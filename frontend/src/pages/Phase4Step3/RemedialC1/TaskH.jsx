import React from 'react'
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
import BuildIcon from '@mui/icons-material/Build'
import ErrorIcon from '@mui/icons-material/Error'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task H: Correction Crusade
 * Error correction game - Fix 6 sentences with verb agreement errors
 * Score: +1 for each correct correction (6 total)
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

const ERROR_SENTENCES = [
  { id: 1, crusader: 'Grammar Detective', avatar: '🔍', before: 'Promotional', infinitive: 'to be', wrongWord: 'are', after: 'to sell.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "Promotional" requires singular verb "is"' },
  { id: 2, crusader: 'Syntax Fixer', avatar: '🔧', before: 'Persuasive', infinitive: 'to use', wrongWord: 'use', after: 'logos.', answer: 'uses', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "Persuasive" requires third-person singular "uses"' },
  { id: 3, crusader: 'Error Hunter', avatar: '🎯', before: 'Targeted group', infinitive: 'to be', wrongWord: 'are', after: 'specific.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "group" requires singular verb "is"' },
  { id: 4, crusader: 'Correction Master', avatar: '⚡', before: 'Original idea', infinitive: 'to be', wrongWord: 'are', after: 'new.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "idea" requires singular verb "is"' },
  { id: 5, crusader: 'Grammar Guardian', avatar: '🛡️', before: 'Creative ads', infinitive: 'to make', wrongWord: 'makes', after: 'memorable.', answer: 'make', errorType: 'Subject-Verb Agreement', concept: 'Plural subject "ads" requires plural verb "make"' },
  { id: 6, crusader: 'Accuracy Champion', avatar: '👑', before: 'Ethical advertising', infinitive: 'to be', wrongWord: 'are', after: 'fair.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "advertising" requires singular verb "is"' }
]

const TIME_LIMIT = 300

export default function RemedialC1TaskH() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/4') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 8, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = ERROR_SENTENCES[currentSentenceIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => setAnswers({ ...answers, [sentenceId]: value })
  const handleNext = () => { if (currentSentenceIndex < ERROR_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1) }
  const handlePrevious = () => { if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = ERROR_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer
      return { sentenceId: sentence.id, crusader: sentence.crusader, before: sentence.before, wrongWord: sentence.wrongWord, after: sentence.after, userAnswer: answers[sentence.id] || '(No answer provided)', correctAnswer: sentence.answer, isCorrect, errorType: sentence.errorType, concept: sentence.concept }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('remedial_step3_c1_taskH_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskH', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ phase: 4, step: 2, level: 'C1', task: 'H', score: finalScore, maxScore: 6, timestamp: new Date().toISOString() }) })
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
              <BuildIcon sx={{ fontSize: 64, color: P.orange.border, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: P.orange.border, mb: 1 }}>🔧 Correction Crusade</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task H: Error Correction</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="Grammar Detective" avatar="🔍" direction="left">
                Welcome to Correction Crusade! Hunt down and fix 6 grammar errors. Each sentence has ONE wrong verb that needs correction!
              </CharacterMessage>
            </Box>
            <Box sx={{ ...cardSx('red'), mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: P.red.border, mb: 2 }}>Mission Objectives</Typography>
              <Stack spacing={1.5}>
                <Typography><strong>Find & Fix Errors:</strong> Each sentence has ONE verb that's wrong</Typography>
                <Typography><strong>Write Correct Form:</strong> Use the infinitive hint to conjugate correctly</Typography>
                <Typography><strong>Time Limit:</strong> 5 minutes total</Typography>
                <Typography><strong>Scoring:</strong> +1 for each correct fix (max 6 points)</Typography>
              </Stack>
            </Box>
            <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Grammar Focus:</Typography>
              <Typography variant="body2">• Check if the subject is singular or plural</Typography>
              <Typography variant="body2">• Singular subjects: use "is", "uses", "makes" (with -s/-es)</Typography>
              <Typography variant="body2">• Plural subjects: use "are", "use", "make" (no -s)</Typography>
            </Box>
            <Box component="button" onClick={() => setGameStarted(true)} sx={{ ...cardSx('orange'), width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: '1.2rem', fontWeight: 700, color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } }}>
              <BuildIcon /> Start Correction Crusade
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
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Crusade Complete!</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border }}>Score: {score}/6</Typography>
            </Box>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {results.map((result) => (
                <Box key={result.sentenceId} sx={cardSx(result.isCorrect ? 'green' : 'red')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '1.5rem' }}>{result.isCorrect ? '✅' : '❌'}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{result.crusader}</Typography>
                      <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>{result.errorType}</Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Original Sentence (with error):</Typography>
                  <Typography sx={{ color: P.red.border, fontStyle: 'italic', mb: 1 }}>
                    {result.before} <span style={{ textDecoration: 'line-through', fontWeight: 700 }}>{result.wrongWord}</span> {result.after}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Your Correction:</Typography>
                  <Typography sx={{ mb: 1 }}>
                    {result.before} <strong style={{ color: result.isCorrect ? P.green.border : P.red.border }}>{result.userAnswer}</strong> {result.after}
                  </Typography>
                  {!result.isCorrect && (
                    <Box sx={{ p: 2, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Correct Answer:</Typography>
                      <Typography sx={{ color: P.green.border, fontWeight: 600, mb: 0.5 }}>{result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption">{result.concept}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
            <Box
              component="button"
              onClick={async () => {
                const taskScores = {
                  A: parseInt(sessionStorage.getItem('remedial_step3_c1_taskA_score') || '0'),
                  B: parseInt(sessionStorage.getItem('remedial_step3_c1_taskB_score') || '0'),
                  C: parseInt(sessionStorage.getItem('remedial_step3_c1_taskC_score') || '0'),
                  D: parseInt(sessionStorage.getItem('remedial_step3_c1_taskD_score') || '0'),
                  E: parseInt(sessionStorage.getItem('remedial_step3_c1_taskE_score') || '0'),
                  F: parseInt(sessionStorage.getItem('remedial_step3_c1_taskF_score') || '0'),
                  G: parseInt(sessionStorage.getItem('remedial_step3_c1_taskG_score') || '0'),
                  H: parseInt(sessionStorage.getItem('remedial_step3_c1_taskH_score') || '0')
                }
                const totalScore = Object.values(taskScores).reduce((sum, value) => sum + value, 0)
                console.log('=== REMEDIAL C1 COMPLETION ===', taskScores, `Total: ${totalScore}/54`)

                try {
                  const response = await fetch('/api/phase4/step3/remedial/c1/final-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      task_a_score: taskScores.A,
                      task_b_score: taskScores.B,
                      task_c_score: taskScores.C,
                      task_d_score: taskScores.D,
                      task_e_score: taskScores.E,
                      task_f_score: taskScores.F,
                      task_g_score: taskScores.G,
                      task_h_score: taskScores.H
                    })
                  })
                  const data = await response.json()
                  const nextUrl = data?.data?.next_url?.replace(/^\/app/, '')
                  if (data?.success && nextUrl) {
                    navigate(nextUrl)
                    return
                  }
                } catch (error) {
                  console.error('Failed to log final C1 score:', error)
                }

                if (totalScore >= 43) {
                  navigate('/phase4/step/4')
                } else {
                  alert(`Your score: ${totalScore}/54. You need 43/54 to pass. Please try the Remedial C1 exercises again.`)
                  navigate('/phase4/step/4')
                }
              }}
              sx={{ ...cardSx('orange'), width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } }}
            >
              Continue to Step 4
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  const progress = ((currentSentenceIndex + 1) / ERROR_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border }}>🔧 Correction Crusade</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: timeLeft < 60 ? P.red.bg : P.blue.bg, border: `2px solid ${timeLeft < 60 ? P.red.border : P.blue.border}`, borderRadius: '12px', px: 2, py: 0.5, color: timeLeft < 60 ? P.red.border : P.blue.border, fontWeight: 700 }}>
                <TimerIcon fontSize="small" /> {formatTime(timeLeft)}
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 2, bgcolor: P.orange.bg, '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 2 } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Sentence {currentSentenceIndex + 1} of {ERROR_SENTENCES.length}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{Math.round(progress)}% Complete</Typography>
            </Box>
          </Box>

          <Box sx={{ ...cardSx('red'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ fontSize: '2.5rem' }}>{currentSentence.avatar}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentSentence.crusader}</Typography>
                <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>{currentSentence.errorType}</Box>
              </Box>
            </Box>
            <Box sx={{ p: 2, mb: 2, bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ErrorIcon sx={{ color: P.red.border }} />
                <Typography variant="body2" sx={{ color: P.red.border, fontWeight: 700 }}>FIND THE ERROR:</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
                "{currentSentence.before} <span style={{ textDecoration: 'line-through', color: P.red.border, fontWeight: 700 }}>{currentSentence.wrongWord}</span> {currentSentence.after}"
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>Fix the error - write the correct form:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 500 }}>"{currentSentence.before}</Typography>
              <TextField
                value={answers[currentSentence.id] || ''}
                onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                placeholder={currentSentence.infinitive}
                variant="outlined"
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: P.green.bg,
                    '& fieldset': { borderColor: P.green.border, borderWidth: 2 },
                    '&:hover fieldset': { borderColor: P.green.shadow },
                    '&.Mui-focused fieldset': { borderColor: P.green.shadow },
                    '& input': { fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' },
                  }
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 500 }}>{currentSentence.after}"</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{ ...cardSx('teal'), cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentSentenceIndex === 0 ? 0.5 : 1, fontWeight: 700, px: 3, '&:hover': currentSentenceIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } }}>
              ← Previous
            </Box>
            {currentSentenceIndex === ERROR_SENTENCES.length - 1 ? (
              <Box component="button" onClick={handleSubmitAll} sx={{ ...cardSx('green'), cursor: 'pointer', fontWeight: 700, px: 4, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Submit All →</Box>
            ) : (
              <Box component="button" onClick={handleNext} sx={{ ...cardSx('orange'), cursor: 'pointer', fontWeight: 700, px: 4, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } }}>Next →</Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ERROR_SENTENCES.map((sentence, idx) => {
              const color = idx === currentSentenceIndex ? 'red' : answers[sentence.id] ? 'green' : 'yellow'
              return (
                <Box key={sentence.id} component="button" onClick={() => setCurrentSentenceIndex(idx)} sx={{ ...cardSx(color), width: 40, height: 40, p: 0, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[color].shadow}` } }}>
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
