import React from 'react'
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
 * Phase 4.2 Step 1 - Remedial C1 - Task G: Debate Duel Advanced
 */

const DEBATE_LINES = [
  { id: 1, debater: 'Content Ethics Advocate', avatar: '⚖️', before: 'It is essential that hashtag use', infinitive: 'to be', after: 'balanced.', answer: 'be', grammarType: 'Subjunctive', concept: 'Subjunctive mood after "it is essential that" - use base form' },
  { id: 2, debater: 'Engagement Truth Defender', avatar: '🛡️', before: 'Caption strategy', infinitive: 'to mislead', after: 'if not authentic.', answer: 'might mislead', grammarType: 'Modal', concept: 'Modal "might" for possibility' },
  { id: 3, debater: 'Privacy Guardian', avatar: '🔒', before: 'Viral content', infinitive: 'to respect', after: 'user privacy.', answer: 'should respect', grammarType: 'Modal', concept: 'Modal "should" for recommendation/obligation' },
  { id: 4, debater: 'Innovation Champion', avatar: '💡', before: 'Original emoji use', infinitive: 'to prize', after: 'in creative posts.', answer: 'be prized', grammarType: 'Subjunctive', concept: 'Subjunctive mood with passive voice - use base form "be"' },
  { id: 5, debater: 'Authenticity Voice', avatar: '🎭', before: 'Story design', infinitive: 'to demand', after: 'authentic goals.', answer: 'demand', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' },
  { id: 6, debater: 'Principle Keeper', avatar: '👑', before: 'Ethical tagging', infinitive: 'to remain', after: 'priority despite trends.', answer: 'remain', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' }
]

const TIME_LIMIT = 300

export default function Phase4_2RemedialC1TaskG() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/1/remedial/c1/taskH') }, [])
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 7, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
    purple: { bg: '#F5F3FF', border: '#8B5CF6', shadow: '#6D28D9' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
    purple: { bg: '#2E1065', border: '#A78BFA', shadow: '#5B21B6' },
  }
  const P = isDark ? DARK : LIGHT

  const currentLine = DEBATE_LINES[currentLineIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitAll() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (lineId, value) => setAnswers({ ...answers, [lineId]: value })
  const handleNext = () => { if (currentLineIndex < DEBATE_LINES.length - 1) setCurrentLineIndex(currentLineIndex + 1) }
  const handlePrevious = () => { if (currentLineIndex > 0) setCurrentLineIndex(currentLineIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = DEBATE_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const correctAnswer = line.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer
      return { lineId: line.id, debater: line.debater, before: line.before, after: line.after, userAnswer: answers[line.id] || '(No answer provided)', correctAnswer: line.answer, isCorrect, grammarType: line.grammarType, concept: line.concept }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_remedial_c1_taskG_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'G', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task G: Debate Duel Advanced</Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="Content Ethics Advocate" message="Welcome to the Debate Duel! Master advanced grammar by using subjunctives and modals in 6 powerful social media debate statements." />
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <GavelIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.purple.shadow }}>Debate Duel Advanced</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>Level C1 - Task G: Subjunctives & Modals</Typography>

              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${P.purple.border}`, borderRadius: '12px', p: 3, mb: 2, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold', mb: 2 }}>Debate Rules</Typography>
                <Typography variant="body1" sx={{ color: P.purple.shadow }}>
                  • Complete 6 Debate Lines: Use correct subjunctives and modals<br />
                  • Grammar Focus: Subjunctive mood and modal verbs (might, should, must)<br />
                  • Time Limit: 5 minutes total<br />
                  • Scoring: +1 for each correct form (max 6 points)
                </Typography>
              </Box>

              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.shadow, mb: 1 }}>Grammar Tips:</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                  • <strong>Subjunctive:</strong> Use base form after "it is essential that" (e.g., "he be", not "he is")<br />
                  • <strong>Modals:</strong> might/should/must + base verb (e.g., "might mislead", "should respect")
                </Typography>
              </Box>

              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><GavelIcon /> Start Debate Duel</Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished && submitted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.orange.shadow }}>Debate Complete!</Typography>
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow }}>{score} / 6</Typography>
                <Typography variant="h6" sx={{ color: P.purple.shadow }}>Score</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              {results.map((result) => (
                <Box key={result.lineId} sx={{
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                  borderRadius: '20px', boxShadow: `4px 4px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  p: 3, mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: result.isCorrect ? P.green.border : P.red.border }}>
                      {result.isCorrect ? <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} /> : <CancelIcon sx={{ color: 'white', fontSize: 20 }} />}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>{result.debater}</Typography>
                      <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.25, display: 'inline-block', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: P.purple.shadow, fontWeight: 700 }}>{result.grammarType}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontSize: '1.05rem' }}>
                    {result.before} <strong>{result.userAnswer}</strong> {result.after}
                  </Typography>

                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '10px', p: 2, mt: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow, mb: 0.5 }}>Correct: {result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption" sx={{ color: P.blue.shadow }}>{result.concept}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/c1/taskH')} sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.purple.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task H</Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>Debate Duel Advanced</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: timeLeft < 60 ? P.red.bg : P.purple.bg, border: `1px solid ${timeLeft < 60 ? P.red.border : P.purple.border}`, borderRadius: '10px', px: 1.5, py: 0.5 }}>
                <TimerIcon sx={{ color: timeLeft < 60 ? P.red.shadow : P.purple.shadow, fontSize: 18 }} />
                <Typography variant="body1" fontWeight="bold" sx={{ color: timeLeft < 60 ? P.red.shadow : P.purple.shadow }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${((currentLineIndex + 1) / DEBATE_LINES.length) * 100}%`, bgcolor: P.green.border, borderRadius: '4px', transition: 'width 0.3s' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: P.purple.shadow }}>Debate Line {currentLineIndex + 1} of {DEBATE_LINES.length}</Typography>
              <Typography variant="caption" sx={{ color: P.purple.shadow }}>{Math.round(((currentLineIndex + 1) / DEBATE_LINES.length) * 100)}% Complete</Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)', border: `2px solid ${P.purple.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{currentLine.avatar}</Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>{currentLine.debater}</Typography>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)', border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.25, display: 'inline-block', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: P.purple.shadow, fontWeight: 700 }}>{currentLine.grammarType}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `2px solid ${P.purple.border}`, borderRadius: '12px', p: 3, mb: 2 }}>
              <Typography variant="body2" sx={{ color: P.purple.shadow, fontWeight: 600, mb: 2 }}>Complete the debate statement:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ color: P.purple.shadow }}>"{currentLine.before}</Typography>
                <TextField
                  value={answers[currentLine.id] || ''}
                  onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                  placeholder={currentLine.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? 'rgba(139,92,246,0.1)' : '#F5F3FF',
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                      '& input': { color: P.purple.shadow, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: P.purple.shadow }}>{currentLine.after}"</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: P.purple.shadow, display: 'block', mt: 1.5, opacity: 0.8 }}>Grammar: {currentLine.concept}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentLineIndex === 0} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: currentLineIndex === 0 ? 'none' : `3px 3px 0 ${P.purple.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, cursor: currentLineIndex === 0 ? 'not-allowed' : 'pointer',
              color: P.purple.shadow, opacity: currentLineIndex === 0 ? 0.4 : 1,
              '&:hover': currentLineIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>← Previous</Box>

            {currentLineIndex === DEBATE_LINES.length - 1 ? (
              <Box component="button" onClick={handleSubmitAll} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Submit All →</Box>
            ) : (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, cursor: 'pointer', color: P.purple.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` }
              }}>Next →</Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {DEBATE_LINES.map((line, idx) => {
              const isCurrent = idx === currentLineIndex
              const isAnswered = !!answers[line.id]
              const btnColor = isCurrent ? P.purple : isAnswered ? P.green : P.yellow
              return (
                <Box key={line.id} component="button" onClick={() => setCurrentLineIndex(idx)} sx={{
                  bgcolor: btnColor.bg, border: `2px solid ${btnColor.border}`, borderRadius: '10px', boxShadow: `2px 2px 0 ${btnColor.shadow}`,
                  px: 2, py: 0.75, fontWeight: 700, cursor: 'pointer', color: btnColor.shadow,
                  '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${btnColor.shadow}` }
                }}>{idx + 1}</Box>
              )
            })}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
