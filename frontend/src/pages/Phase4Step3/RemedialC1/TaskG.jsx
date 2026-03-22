import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GavelIcon from '@mui/icons-material/Gavel'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task G: Debate Duel Advanced
 * Debate grammar game - 6 debate lines using subjunctives/modals
 * Score: +1 for each correct subjunctive/modal (6 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const DEBATE_LINES = [
  { id: 1, debater: 'Ethics Advocate', avatar: '⚖️', before: 'It is essential that promotional', infinitive: 'to be', after: 'balanced.', answer: 'be', grammarType: 'Subjunctive', concept: 'Subjunctive mood after "it is essential that" - use base form' },
  { id: 2, debater: 'Truth Defender', avatar: '🛡️', before: 'Persuasive', infinitive: 'to mislead', after: 'if not ethical.', answer: 'might mislead', grammarType: 'Modal', concept: 'Modal "might" for possibility' },
  { id: 3, debater: 'Privacy Guardian', avatar: '🔒', before: 'Targeted ads', infinitive: 'to respect', after: 'privacy.', answer: 'should respect', grammarType: 'Modal', concept: 'Modal "should" for recommendation/obligation' },
  { id: 4, debater: 'Innovation Champion', avatar: '💡', before: 'Original', infinitive: 'to prize', after: 'in creative work.', answer: 'be prized', grammarType: 'Subjunctive', concept: 'Subjunctive mood with passive voice - use base form "be"' },
  { id: 5, debater: 'Authenticity Voice', avatar: '🎭', before: 'Dramatisation', infinitive: 'to demand', after: 'authentic goals.', answer: 'demand', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' },
  { id: 6, debater: 'Principle Keeper', avatar: '👑', before: 'Ethical', infinitive: 'to remain', after: 'priority despite pressure.', answer: 'remain', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' }
]

const TIME_LIMIT = 300

export default function RemedialC1TaskG() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 7, context: 'remedial_c1' })
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
    sessionStorage.setItem('remedial_step3_c1_taskG_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ phase: 4, step: 2, level: 'C1', task: 'G', score: finalScore, maxScore: 6, timestamp: new Date().toISOString() }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, '0')}` }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), textAlign: 'center', mb: 3 }}>
              <GavelIcon sx={{ fontSize: 64, color: P.orange.border, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: P.orange.border, mb: 1 }}>⚖️ Debate Duel Advanced</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task G: Subjunctives & Modals</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="Ethics Advocate" avatar="⚖️" direction="left">
                Welcome to the Debate Duel! Master advanced grammar by using subjunctives and modals in 6 powerful debate statements.
              </CharacterMessage>
            </Box>
            <Box sx={{ ...cardSx('purple'), mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: P.purple.border, mb: 2 }}>Debate Rules</Typography>
              <Stack spacing={1.5}>
                <Typography sx={{ color: P.purple.shadow }}><strong>Complete 6 Debate Lines:</strong> Use correct subjunctives and modals</Typography>
                <Typography sx={{ color: P.purple.shadow }}><strong>Grammar Focus:</strong> Subjunctive mood and modal verbs (might, should, must)</Typography>
                <Typography sx={{ color: P.purple.shadow }}><strong>Time Limit:</strong> 5 minutes total</Typography>
                <Typography sx={{ color: P.purple.shadow }}><strong>Scoring:</strong> +1 for each correct form (max 6 points)</Typography>
              </Stack>
            </Box>
            <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Grammar Tips:</Typography>
              <Typography variant="body2">• <strong>Subjunctive:</strong> Use base form after "it is essential that" (e.g., "he be", not "he is")</Typography>
              <Typography variant="body2">• <strong>Modals:</strong> might/should/must + base verb (e.g., "might mislead", "should respect")</Typography>
            </Box>
            <Box component="button" onClick={() => setGameStarted(true)} sx={{ ...cardSx('orange'), width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: '1.2rem', fontWeight: 700, color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } }}>
              <GavelIcon /> Start Debate Duel
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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(score >= 5 ? 'green' : score >= 3 ? 'yellow' : 'red'), textAlign: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: P.yellow.border, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Debate Complete!</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border }}>Score: {score}/6</Typography>
            </Box>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {results.map((result) => (
                <Box key={result.lineId} sx={cardSx(result.isCorrect ? 'green' : 'red')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '1.5rem' }}>{result.isCorrect ? '✅' : '❌'}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{result.debater}</Typography>
                      <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>{result.grammarType}</Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Debate Statement:</Typography>
                  <Typography sx={{ mb: 1 }}>
                    {result.before} <strong style={{ color: result.isCorrect ? P.green.border : P.red.border }}>{result.userAnswer}</strong> {result.after}
                  </Typography>
                  {!result.isCorrect && (
                    <Box sx={{ p: 2, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Correct Answer:</Typography>
                      <Typography sx={{ color: P.green.border, fontWeight: 600 }}>{result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>{result.concept}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
            <Box component="button" onClick={() => navigate('/phase4/step3/remedial/c1/taskH')} sx={{ ...cardSx('blue'), width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}>
              Continue to Task H →
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  const progress = ((currentLineIndex + 1) / DEBATE_LINES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border }}>⚖️ Debate Duel Advanced</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: timeLeft < 60 ? P.red.bg : P.blue.bg, border: `2px solid ${timeLeft < 60 ? P.red.border : P.blue.border}`, borderRadius: '12px', px: 2, py: 0.5, color: timeLeft < 60 ? P.red.border : P.blue.border, fontWeight: 700 }}>
                <TimerIcon fontSize="small" /> {formatTime(timeLeft)}
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 2, bgcolor: P.orange.bg, '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 2 } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Debate Line {currentLineIndex + 1} of {DEBATE_LINES.length}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{Math.round(progress)}% Complete</Typography>
            </Box>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ fontSize: '2.5rem' }}>{currentLine.avatar}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentLine.debater}</Typography>
                <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>{currentLine.grammarType}</Box>
              </Box>
            </Box>
            <Box sx={{ ...cardSx('purple') }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>Complete the debate statement:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>"{currentLine.before}</Typography>
                <TextField
                  value={answers[currentLine.id] || ''}
                  onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                  placeholder={currentLine.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: P.purple.bg,
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                      '&:hover fieldset': { borderColor: P.purple.shadow },
                      '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                      '& input': { fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' },
                    }
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 500 }}>{currentLine.after}"</Typography>
              </Box>
              <Typography variant="caption">Grammar: {currentLine.concept}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentLineIndex === 0} sx={{ ...cardSx('teal'), cursor: currentLineIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentLineIndex === 0 ? 0.5 : 1, fontWeight: 700, px: 3, '&:hover': currentLineIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } }}>
              ← Previous
            </Box>
            {currentLineIndex === DEBATE_LINES.length - 1 ? (
              <Box component="button" onClick={handleSubmitAll} sx={{ ...cardSx('green'), cursor: 'pointer', fontWeight: 700, px: 4, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Submit All →</Box>
            ) : (
              <Box component="button" onClick={handleNext} sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, px: 4, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}>Next →</Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {DEBATE_LINES.map((line, idx) => {
              const color = idx === currentLineIndex ? 'blue' : answers[line.id] ? 'green' : 'yellow'
              return (
                <Box key={line.id} component="button" onClick={() => setCurrentLineIndex(idx)} sx={{ ...cardSx(color), width: 40, height: 40, p: 0, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[color].shadow}` } }}>
                  {idx + 1}
                </Box>
              )
            })}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
