import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GavelIcon from '@mui/icons-material/Gavel'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Remedial C1 - Task G: Debate Duel Advanced
 * Debate grammar game - 6 debate lines using subjunctives/modals
 * Score: +1 for each correct subjunctive/modal (6 total, scaled to /10)
 */

const DEBATE_LINES = [
  {
    id: 1,
    debater: 'Strategy Advocate',
    avatar: '📊',
    before: 'It is essential that Instagram',
    infinitive: 'to be',
    after: 'consistent.',
    answer: 'be',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood after "it is essential that" - use base form'
  },
  {
    id: 2,
    debater: 'Hashtag Defender',
    avatar: '#️⃣',
    before: 'Trending hashtags',
    infinitive: 'to boost',
    after: 'engagement.',
    answer: 'might boost',
    grammarType: 'Modal',
    concept: 'Modal "might" for possibility'
  },
  {
    id: 3,
    debater: 'Caption Guardian',
    avatar: '✍️',
    before: 'Captions',
    infinitive: 'to include',
    after: 'strong CTAs.',
    answer: 'should include',
    grammarType: 'Modal',
    concept: 'Modal "should" for recommendation/obligation'
  },
  {
    id: 4,
    debater: 'Engagement Champion',
    avatar: '💬',
    before: 'Quality content',
    infinitive: 'to prioritize',
    after: 'in every post.',
    answer: 'be prioritized',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood with passive voice - use base form "be"'
  },
  {
    id: 5,
    debater: 'Analytics Voice',
    avatar: '📈',
    before: 'Weekly tracking',
    infinitive: 'to reveal',
    after: 'performance gaps.',
    answer: 'reveal',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood - use base form'
  },
  {
    id: 6,
    debater: 'Timing Keeper',
    avatar: '⏰',
    before: 'Optimal posting times',
    infinitive: 'to remain',
    after: 'priority for reach.',
    answer: 'remain',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood - use base form'
  }
]

const TIME_LIMIT = 300

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function Phase4_2Step4RemedialC1TaskG() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 7, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentLine = DEBATE_LINES[currentLineIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (lineId, value) => {
    setAnswers({ ...answers, [lineId]: value })
  }

  const handleNext = () => {
    if (currentLineIndex < DEBATE_LINES.length - 1) setCurrentLineIndex(currentLineIndex + 1)
  }
  const handlePrevious = () => {
    if (currentLineIndex > 0) setCurrentLineIndex(currentLineIndex - 1)
  }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = DEBATE_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const correctAnswer = line.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer
      return {
        lineId: line.id,
        debater: line.debater,
        avatar: line.avatar,
        before: line.before,
        after: line.after,
        userAnswer: answers[line.id] || '(No answer provided)',
        correctAnswer: line.answer,
        isCorrect,
        grammarType: line.grammarType,
        concept: line.concept
      }
    })
    setResults(evaluatedResults)
    const rawScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(rawScore)
    const finalScore = Math.round((rawScore / 6) * 10)
    sessionStorage.setItem('phase4_2_step4_remedial_c1_taskG_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step4_remedial_c1_taskG_max', '10')
    await logTaskCompletion(finalScore, rawScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore, rawScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 4, level: 'C1', task: 'G', score: finalScore, max_score: 10, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task G: Debate Duel Advanced</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <CharacterMessage
                character="EMNA"
                message="Welcome to the Debate Duel! Master advanced grammar by using subjunctives and modals in 6 powerful debate statements about Instagram strategy. Score 5/6 to pass!"
              />
            </Box>

            {/* Start Card */}
            <Box sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <GavelIcon sx={{ fontSize: 72, color: P.purple.border, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.purple.shadow, mb: 1 }}>Debate Duel Advanced</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>
                6 Lines • Subjunctives & Modals • 5 Minutes
              </Typography>

              {/* Rules */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                p: 3, mb: 3, textAlign: 'left',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 1 }}>Debate Rules</Typography>
                <Typography variant="body2" sx={{ color: P.blue.shadow, lineHeight: 2 }}>
                  Complete 6 Debate Lines using correct subjunctives and modals<br />
                  Grammar Focus: Subjunctive mood and modal verbs (might, should, must)<br />
                  Time Limit: 5 minutes total<br />
                  Scoring: +1 for each correct form (6 points = 10/10)
                </Typography>
              </Box>

              {/* Grammar Tips */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                p: 3, mb: 3, textAlign: 'left',
              }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: P.yellow.shadow, mb: 1 }}>Grammar Tips:</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                  <strong>Subjunctive:</strong> Use base form after "it is essential that" (e.g., "he be", not "he is")<br />
                  <strong>Modals:</strong> might/should/must + base verb (e.g., "might boost", "should include")
                </Typography>
              </Box>

              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.2rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1, mx: 'auto',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}><GavelIcon fontSize="small" /> Start Debate Duel</Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && submitted) {
    const finalScore = Math.round((score / 6) * 10)
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task G: Debate Duel - Results</Typography>
            </Box>

            {/* Score */}
            <Box sx={{
              bgcolor: score >= 5 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: score >= 5 ? P.green.border : P.yellow.border, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: score >= 5 ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                Debate Complete!
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                Score: {finalScore}/10
              </Typography>
              <Typography variant="body1" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                ({score}/6 correct)
              </Typography>
            </Box>

            {/* Results detail */}
            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
              p: 3, mb: 3,
            }}>
              {results.map((result) => (
                <Box key={result.lineId} sx={{
                  mb: 2, p: 2, borderRadius: '12px',
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{result.avatar}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                      {result.debater}
                    </Typography>
                    <Box sx={{
                      bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                      borderRadius: '999px', px: 1.5, py: 0.2, fontSize: '0.75rem', fontWeight: 700,
                      color: P.purple.shadow,
                    }}>{result.grammarType}</Box>
                    {result.isCorrect
                      ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: '1rem' }} />
                      : <CancelIcon sx={{ color: P.red.border, fontSize: '1rem' }} />
                    }
                  </Box>
                  <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                    Your: "{result.before} <strong>{result.userAnswer}</strong> {result.after}"
                  </Typography>
                  {!result.isCorrect && (
                    <>
                      <Typography variant="body2" sx={{ color: P.green.shadow, mt: 0.5 }}>
                        Correct: "{result.before} {result.correctAnswer} {result.after}"
                      </Typography>
                      <Typography variant="caption" sx={{ color: P.red.shadow, display: 'block', mt: 0.5 }}>
                        {result.concept}
                      </Typography>
                    </>
                  )}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/4/remedial/c1/taskH')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task H <ArrowForwardIcon fontSize="small" /></Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game screen
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header with Timer */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.purple.shadow }}>
              Debate Line {currentLineIndex + 1} / {DEBATE_LINES.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.border : P.purple.border }} />
              <Typography variant="h6" sx={{
                color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow,
                fontWeight: timeLeft <= 60 ? 'bold' : 'normal',
              }}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '999px', height: 12, mb: 3, overflow: 'hidden',
          }}>
            <Box sx={{
              bgcolor: P.teal.border, height: '100%', borderRadius: '999px',
              width: `${((currentLineIndex + 1) / DEBATE_LINES.length) * 100}%`,
              transition: 'width 0.3s',
            }} />
          </Box>

          {/* Current Line */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography sx={{ fontSize: '3rem' }}>{currentLine.avatar}</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.purple.shadow }}>
                  {currentLine.debater}
                </Typography>
                <Box sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '999px', px: 2, py: 0.2, display: 'inline-block',
                  fontSize: '0.8rem', fontWeight: 700, color: P.blue.shadow,
                }}>{currentLine.grammarType}</Box>
              </Box>
            </Box>

            <Box sx={{
              bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
              borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
              p: 3, mb: 2,
            }}>
              <Typography variant="body2" sx={{ color: P.yellow.shadow, fontWeight: 600, mb: 2 }}>
                Complete the debate statement:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ color: P.yellow.shadow, fontWeight: 500 }}>
                  "{currentLine.before}
                </Typography>
                <TextField
                  value={answers[currentLine.id] || ''}
                  onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                  placeholder={currentLine.infinitive}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 180 }}
                />
                <Typography variant="h6" sx={{ color: P.yellow.shadow, fontWeight: 500 }}>
                  {currentLine.after}"
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: P.yellow.shadow, display: 'block', mt: 1 }}>
                Grammar: {currentLine.concept}
              </Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentLineIndex === 0} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
              cursor: currentLineIndex === 0 ? 'not-allowed' : 'pointer',
              color: P.blue.shadow, opacity: currentLineIndex === 0 ? 0.4 : 1,
              '&:hover': { transform: currentLineIndex === 0 ? 'none' : 'translate(-2px,-2px)' },
            }}>← Previous</Box>

            {currentLineIndex === DEBATE_LINES.length - 1 ? (
              <Box component="button" onClick={handleSubmitAll} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1, fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
              }}>Submit All →</Box>
            ) : (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', color: P.blue.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
              }}>Next →</Box>
            )}
          </Box>

          {/* Progress dots */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {DEBATE_LINES.map((line, idx) => (
              <Box
                key={line.id}
                component="button"
                onClick={() => setCurrentLineIndex(idx)}
                sx={{
                  width: 36, height: 36,
                  bgcolor: idx === currentLineIndex ? P.purple.bg : answers[line.id] ? P.green.bg : P.blue.bg,
                  border: `2px solid ${idx === currentLineIndex ? P.purple.border : answers[line.id] ? P.green.border : P.blue.border}`,
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer',
                  color: idx === currentLineIndex ? P.purple.shadow : answers[line.id] ? P.green.shadow : P.blue.shadow,
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {idx + 1}
              </Box>
            ))}
          </Box>

          {/* Timer Warning */}
          {timeLeft <= 60 && (
            <Box sx={{
              bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
              borderRadius: '16px', boxShadow: `3px 3px 0 ${P.red.shadow}`,
              p: 2, mt: 3, textAlign: 'center',
            }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: P.red.shadow }}>
                Hurry! Only {timeLeft} seconds left!
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
