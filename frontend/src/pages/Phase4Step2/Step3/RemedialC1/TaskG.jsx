import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress, TextField, Avatar, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GavelIcon from '@mui/icons-material/Gavel'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial C1 - Task G: Debate Duel Advanced
 * Debate grammar game - 6 debate lines using subjunctives/modals with social media terms
 * Score: +1 for each correct subjunctive/modal (6 total)
 */

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

const DEBATE_LINES = [
  { id: 1, debater: 'Content Ethics Advocate', avatar: '⚖️', before: 'It is essential that hashtag use', infinitive: 'to be', after: 'balanced.', answer: 'be', grammarType: 'Subjunctive', concept: 'Subjunctive mood after "it is essential that" - use base form' },
  { id: 2, debater: 'Engagement Truth Defender', avatar: '🛡️', before: 'Caption strategy', infinitive: 'to mislead', after: 'if not authentic.', answer: 'might mislead', grammarType: 'Modal', concept: 'Modal "might" for possibility' },
  { id: 3, debater: 'Privacy Guardian', avatar: '🔒', before: 'Viral content', infinitive: 'to respect', after: 'user privacy.', answer: 'should respect', grammarType: 'Modal', concept: 'Modal "should" for recommendation/obligation' },
  { id: 4, debater: 'Innovation Champion', avatar: '💡', before: 'Original emoji use', infinitive: 'to prize', after: 'in creative posts.', answer: 'be prized', grammarType: 'Subjunctive', concept: 'Subjunctive mood with passive voice - use base form "be"' },
  { id: 5, debater: 'Authenticity Voice', avatar: '🎭', before: 'Story design', infinitive: 'to demand', after: 'authentic goals.', answer: 'demand', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' },
  { id: 6, debater: 'Principle Keeper', avatar: '👑', before: 'Ethical tagging', infinitive: 'to remain', after: 'priority despite trends.', answer: 'remain', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' }
]

const TIME_LIMIT = 300

export default function Phase4_2Step3RemedialC1TaskG() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 7, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentLine = DEBATE_LINES[currentLineIndex]

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

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
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_step3_remedial_c1_taskG_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', task: 'G', score: finalScore, max_score: 6, completed: true })
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

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clayCard('orange'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 · Task G</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>Debate Duel Advanced</Typography>
            </Box>
            <Box sx={{ ...clayCard('teal'), mb: 3 }}>
              <CharacterMessage character="Content Ethics Advocate" message="Welcome to the Debate Duel! Master advanced grammar by using subjunctives and modals in 6 powerful social media debate statements." />
            </Box>
            <Box sx={{ ...clayCard('purple'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border, mb: 2 }}>Debate Rules</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ color: isDark ? '#ccc' : '#333' }}><strong>Complete 6 Debate Lines:</strong> Use correct subjunctives and modals</Typography>
                <Typography sx={{ color: isDark ? '#ccc' : '#333' }}><strong>Grammar Focus:</strong> Subjunctive mood and modal verbs (might, should, must)</Typography>
                <Typography sx={{ color: isDark ? '#ccc' : '#333' }}><strong>Time Limit:</strong> 5 minutes total</Typography>
                <Typography sx={{ color: isDark ? '#ccc' : '#333' }}><strong>Scoring:</strong> +1 for each correct form (max 6 points)</Typography>
              </Box>
            </Box>
            <Box sx={{ ...clayCard('yellow'), mb: 3 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border, mb: 1 }}>Grammar Tips:</Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#856404' }}>
                <strong>Subjunctive:</strong> Use base form after "it is essential that" (e.g., "he be", not "he is")<br />
                <strong>Modals:</strong> might/should/must + base verb (e.g., "might mislead", "should respect")
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={() => setGameStarted(true)}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                <GavelIcon /> Start Debate Duel
              </Box>
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
            <Box sx={{ ...clayCard('orange'), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: P.orange.border, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>Debate Complete!</Typography>
              <Typography variant="h4" sx={{ color: score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border, fontWeight: 700, mt: 1 }}>
                Score: {score}/6
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {results.map((result) => (
                <Box key={result.lineId} sx={{ ...clayCard(result.isCorrect ? 'green' : 'red') }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: P[result.isCorrect ? 'green' : 'red'].bg, border: `2px solid ${P[result.isCorrect ? 'green' : 'red'].border}`, width: 40, height: 40 }}>
                      {result.isCorrect ? <CheckCircleIcon sx={{ color: P.green.border }} /> : <CancelIcon sx={{ color: P.red.border }} />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>{result.debater}</Typography>
                      <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 'bold', color: P.purple.border, display: 'inline-block', mt: 0.5 }}>{result.grammarType}</Box>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 0.5 }}>Debate Statement:</Typography>
                    <Typography sx={{ color: isDark ? '#ddd' : '#2c3e50', fontSize: '1.05rem' }}>
                      {result.before} <strong style={{ color: result.isCorrect ? P.green.border : P.red.border }}>{result.userAnswer}</strong> {result.after}
                    </Typography>
                  </Box>
                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 2 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 0.5 }}>Correct Answer:</Typography>
                      <Typography sx={{ color: P.green.border, fontWeight: 600 }}>{result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#888' : '#777', mt: 0.5, display: 'block' }}>{result.concept}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={() => navigate('/phase4_2/step/3/remedial/c1/taskH')}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-block',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task H
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game screen
  const progress = ((currentLineIndex + 1) / DEBATE_LINES.length) * 100
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Box sx={{ ...clayCard('purple'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.border }}>Debate Duel Advanced</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft < 60 ? P.red.border : P.purple.border }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft < 60 ? P.red.border : P.purple.border }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 10, borderRadius: 5, bgcolor: isDark ? '#333' : '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: 5 } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>Debate Line {currentLineIndex + 1} of {DEBATE_LINES.length}</Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>{Math.round(progress)}% Complete</Typography>
            </Box>
          </Box>

          {/* Current Line */}
          <Box sx={{ ...clayCard('blue'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, width: 56, height: 56, fontSize: '1.8rem' }}>
                {currentLine.avatar}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>{currentLine.debater}</Typography>
                <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 'bold', color: P.purple.border, display: 'inline-block', mt: 0.5 }}>{currentLine.grammarType}</Box>
              </Box>
            </Box>
            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 3 }}>
              <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 2 }}>Complete the debate statement:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h5" sx={{ color: isDark ? '#ddd' : '#2c3e50' }}>"{currentLine.before}</Typography>
                <TextField
                  value={answers[currentLine.id] || ''}
                  onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                  placeholder={currentLine.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: P.purple.bg,
                      borderRadius: '12px',
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 3 },
                      '&:hover fieldset': { borderColor: P.purple.shadow },
                      '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                      '& input': { color: isDark ? '#eee' : '#1a252f', fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: isDark ? '#ddd' : '#2c3e50' }}>{currentLine.after}"</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>Grammar: {currentLine.concept}</Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              component="button"
              onClick={handlePrevious}
              disabled={currentLineIndex === 0}
              sx={{
                ...clayCard('teal'),
                cursor: currentLineIndex > 0 ? 'pointer' : 'not-allowed',
                opacity: currentLineIndex > 0 ? 1 : 0.4,
                px: 3, py: 1,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: P.teal.border,
                '&:hover': currentLineIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              Previous
            </Box>
            {currentLineIndex === DEBATE_LINES.length - 1 ? (
              <Box
                component="button"
                onClick={handleSubmitAll}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 4, py: 1,
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Submit All
              </Box>
            ) : (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  ...clayCard('teal'),
                  cursor: 'pointer',
                  px: 3, py: 1,
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: P.teal.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Next
              </Box>
            )}
          </Box>

          {/* Line indicators */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {DEBATE_LINES.map((line, idx) => (
              <Box
                key={line.id}
                component="button"
                onClick={() => setCurrentLineIndex(idx)}
                sx={{
                  bgcolor: idx === currentLineIndex ? P.purple.bg : answers[line.id] ? P.green.bg : isDark ? '#2a2a2a' : '#e0e0e0',
                  border: `2px solid ${idx === currentLineIndex ? P.purple.border : answers[line.id] ? P.green.border : (isDark ? '#444' : '#bbb')}`,
                  borderRadius: '12px',
                  px: 2, py: 0.5,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: idx === currentLineIndex ? P.purple.border : answers[line.id] ? P.green.border : (isDark ? '#888' : '#666'),
                  fontSize: '0.9rem',
                }}
              >
                {idx + 1}
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
