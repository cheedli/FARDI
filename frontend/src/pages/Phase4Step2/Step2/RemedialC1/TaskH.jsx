import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Chip, LinearProgress, Avatar, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BuildIcon from '@mui/icons-material/Build'
import ErrorIcon from '@mui/icons-material/Error'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Remedial C1 - Task H: Correction Crusade
 * Error correction game - Fix 6 sentences with verb agreement errors
 */

const ERROR_SENTENCES = [
  { id: 1, crusader: 'Grammar Detective', avatar: '🔍', before: 'Instagram strategy', infinitive: 'to be', wrongWord: 'are', after: 'crucial.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "strategy" requires singular verb "is"' },
  { id: 2, crusader: 'Syntax Fixer', avatar: '🔧', before: 'Hashtag optimization', infinitive: 'to require', wrongWord: 'require', after: 'research.', answer: 'requires', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "optimization" requires third-person singular "requires"' },
  { id: 3, crusader: 'Error Hunter', avatar: '🎯', before: 'Target audience', infinitive: 'to be', wrongWord: 'are', after: 'specific.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "audience" requires singular verb "is"' },
  { id: 4, crusader: 'Correction Master', avatar: '⚡', before: 'Caption quality', infinitive: 'to be', wrongWord: 'are', after: 'important.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "quality" requires singular verb "is"' },
  { id: 5, crusader: 'Grammar Guardian', avatar: '🛡️', before: 'Viral posts', infinitive: 'to need', wrongWord: 'needs', after: 'engagement.', answer: 'need', errorType: 'Subject-Verb Agreement', concept: 'Plural subject "posts" requires plural verb "need"' },
  { id: 6, crusader: 'Accuracy Champion', avatar: '👑', before: 'Content creation', infinitive: 'to be', wrongWord: 'are', after: 'essential.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "creation" requires singular verb "is"' }
]

const TIME_LIMIT = 300

export default function Phase4_2Step2RemedialC1TaskH() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/2/remedial/c1/results') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 8, context: 'remedial_c1' })
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

  const handleAnswerChange = (sentenceId, value) => { setAnswers({ ...answers, [sentenceId]: value }) }
  const handleNext = () => { if (currentSentenceIndex < ERROR_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1) }
  const handlePrevious = () => { if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = ERROR_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const isCorrect = userAnswer.length > 0 && userAnswer === sentence.answer.toLowerCase()
      return { sentenceId: sentence.id, crusader: sentence.crusader, before: sentence.before, wrongWord: sentence.wrongWord, after: sentence.after, userAnswer: answers[sentence.id] || '(No answer provided)', correctAnswer: sentence.answer, isCorrect, errorType: sentence.errorType, concept: sentence.concept }
    })
    setResults(evaluatedResults)
    const rawScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(rawScore)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskH_score', rawScore)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskH_max', '6')
    await logTaskCompletion(rawScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskH', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'H', score: finalScore, max_score: 6, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
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
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
                Phase 4.2 Step 2 - Remedial Practice
              </Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>
                Level C1 - Task H: Correction Crusade
              </Typography>
            </Box>

            {/* Instructor */}
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage
                character="EMNA"
                message="Welcome to Correction Crusade! Hunt down and fix 6 grammar errors in Instagram strategy sentences. Each sentence has ONE wrong verb that needs correction!"
              />
            </Box>

            {/* Start card */}
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <BuildIcon sx={{ fontSize: 60, color: P.red.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: P.red.shadow }}>
                🔧 Correction Crusade
              </Typography>
              <Typography variant="h6" sx={{ color: P.red.shadow, mb: 3 }}>
                Error Correction — 5 Minutes
              </Typography>

              <Box sx={{ bgcolor: isDark ? '#2a0a0a' : '#ffe8e6', border: `1px solid ${P.red.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: P.red.shadow, mb: 1 }}>🎯 Mission Objectives</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>🔍 Find & Fix Errors:</strong> Each sentence has ONE verb that's wrong</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>✏️ Write Correct Form:</strong> Use the infinitive hint to conjugate correctly</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>⏱️ Time Limit:</strong> 5 minutes total</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>🏆 Scoring:</strong> +1 for each correct fix (max 6 points)</Typography>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: P.yellow.shadow, mb: 1 }}>💡 Grammar Focus:</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>• Check if the subject is singular or plural</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>• Singular subjects: use "is", "requires", "needs" (with -s/-es)</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>• Plural subjects: use "are", "require", "need" (no -s)</Typography>
              </Box>

              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.red.shadow}`, px: 6, py: 2,
                fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', color: P.red.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.red.shadow}` },
              }}>
                <BuildIcon /> Start Correction Crusade
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && submitted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 3, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 60, color: P.red.shadow, mb: 1 }} />
              <Typography variant="h4" fontWeight={800} sx={{ color: P.red.shadow }}>
                Crusade Complete!
              </Typography>
            </Box>

            {/* Score */}
            <Box sx={{
              bgcolor: score >= 5 ? P.green.bg : score >= 3 ? P.yellow.bg : P.red.bg,
              border: `2px solid ${score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow}`,
              p: 3, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow }}>
                Score: {score}/6
              </Typography>
            </Box>

            {/* Results review */}
            <Stack spacing={2} sx={{ mb: 4 }}>
              {results.map((result) => (
                <Box key={result.sentenceId} sx={{
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  p: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ bgcolor: result.isCorrect ? P.green.shadow : P.red.shadow, width: 36, height: 36 }}>
                      {result.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? '#eee' : '#2c3e50' }}>
                      {result.crusader}
                    </Typography>
                    <Box sx={{ bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px', px: 1.5, py: 0.5 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: P.red.shadow }}>{result.errorType}</Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ color: P.red.shadow, mb: 0.5, fontStyle: 'italic' }}>
                    Original: {result.before} <span style={{ textDecoration: 'line-through', fontWeight: 700 }}>{result.wrongWord}</span> {result.after}
                  </Typography>

                  <Typography sx={{ color: isDark ? '#ddd' : '#2c3e50', mb: 1 }}>
                    Your correction: {result.before} <strong style={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>{result.userAnswer}</strong> {result.after}
                  </Typography>

                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `1px solid ${P.green.border}`, borderRadius: '10px', p: 2, mt: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: P.green.shadow, mb: 0.5 }}>Correct: {result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>💡 {result.concept}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/2/remedial/c1/results')} sx={{
                bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.red.shadow}`, px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: P.red.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.red.shadow}` },
              }}>
                <ArrowForwardIcon /> View Final Results
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game screen — gradient preserved
  const progress = ((currentSentenceIndex + 1) / ERROR_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', padding: 3 }}>
      <Paper elevation={24} sx={{ maxWidth: 900, margin: '0 auto', padding: 4, background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)', borderRadius: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>🔧 Correction Crusade</Typography>
            <Chip icon={<TimerIcon />} label={formatTime(timeLeft)} color={timeLeft < 60 ? 'error' : 'primary'} sx={{ fontSize: '1.1rem', fontWeight: 700, px: 2 }} />
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 2, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)', borderRadius: 2 } }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>Sentence {currentSentenceIndex + 1} of {ERROR_SENTENCES.length}</Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>{Math.round(progress)}% Complete</Typography>
          </Box>
        </Box>

        {/* Current Sentence */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#e74c3c', width: 60, height: 60, fontSize: '2rem' }}>{currentSentence.avatar}</Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>{currentSentence.crusader}</Typography>
              <Chip label={currentSentence.errorType} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }} />
            </Box>
          </Box>
          <Paper sx={{ p: 3, bgcolor: 'white' }}>
            <Box sx={{ mb: 2, p: 2, bgcolor: '#ffe8e6', borderRadius: 1, border: '2px solid #e74c3c' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ErrorIcon sx={{ color: '#e74c3c' }} />
                <Typography variant="body2" sx={{ color: '#c0392b', fontWeight: 700 }}>FIND THE ERROR:</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontStyle: 'italic' }}>
                "{currentSentence.before} <span style={{ textDecoration: 'line-through', color: '#e74c3c', fontWeight: 700 }}>{currentSentence.wrongWord}</span> {currentSentence.after}"
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 2 }}>Fix the error - write the correct form:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>"{currentSentence.before}</Typography>
              <TextField
                value={answers[currentSentence.id] || ''}
                onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                placeholder={currentSentence.infinitive}
                variant="outlined"
                sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { backgroundColor: '#d5f4e6', '& fieldset': { borderColor: '#27ae60', borderWidth: 3 }, '&:hover fieldset': { borderColor: '#229954' }, '&.Mui-focused fieldset': { borderColor: '#229954' }, '& input': { color: '#1a252f', fontWeight: 700, fontSize: '1.3rem', textAlign: 'center' }, '& input::placeholder': { color: '#95a5a6', opacity: 0.8, fontWeight: 500 } } }}
              />
              <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>{currentSentence.after}"</Typography>
            </Box>
          </Paper>
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Button onClick={handlePrevious} disabled={currentSentenceIndex === 0} variant="outlined" sx={{ fontWeight: 700, borderColor: '#e74c3c', color: '#e74c3c', '&:hover': { borderColor: '#c0392b', bgcolor: 'rgba(231, 76, 60, 0.1)' } }}>← Previous</Button>
          {currentSentenceIndex === ERROR_SENTENCES.length - 1 ? (
            <Button onClick={handleSubmitAll} variant="contained" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #27ae60 30%, #229954 90%)', px: 4, '&:hover': { background: 'linear-gradient(45deg, #229954 30%, #1e8449 90%)' } }}>Submit All →</Button>
          ) : (
            <Button onClick={handleNext} variant="contained" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)', '&:hover': { background: 'linear-gradient(45deg, #c0392b 30%, #a93226 90%)' } }}>Next →</Button>
          )}
        </Box>

        {/* Progress dots */}
        <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {ERROR_SENTENCES.map((sentence, idx) => (
            <Chip key={sentence.id} label={`${idx + 1}`} onClick={() => setCurrentSentenceIndex(idx)} sx={{ fontWeight: 700, cursor: 'pointer', bgcolor: idx === currentSentenceIndex ? '#e74c3c' : answers[sentence.id] ? '#27ae60' : '#e0e0e0', color: idx === currentSentenceIndex || answers[sentence.id] ? 'white' : '#7f8c8d', '&:hover': { bgcolor: idx === currentSentenceIndex ? '#c0392b' : answers[sentence.id] ? '#229954' : '#d0d0d0' } }} />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
