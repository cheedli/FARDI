import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Stack,
  LinearProgress,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level B1 - Task B: Definition Duel
 * Correct 8 faulty sentences for coherence/vocabulary
 * Gamified as "Definition Duel" - Duel with corrections for wins
 * Score: +1 per correctly corrected sentence (8 total)
 */

const SENTENCE_CORRECTIONS = [
  { id: 1, faulty: 'Gatefold are fold.', correct: 'Gatefold is fold for space.' },
  { id: 2, faulty: 'Lettering is text on poster but not bold.', correct: 'Lettering is bold text on poster.' },
  { id: 3, faulty: 'Animation is move picture in video.', correct: 'Animation is moving pictures in video.' },
  { id: 4, faulty: 'Jingle is song and catchy.', correct: 'Jingle is a catchy song.' },
  { id: 5, faulty: 'Dramatisation is story act.', correct: 'Dramatisation is acting out a story.' },
  { id: 6, faulty: 'Sketch is plan draw.', correct: 'Sketch is a plan drawing.' },
  { id: 7, faulty: 'Clip is short part.', correct: 'Clip is a short part of video.' },
  { id: 8, faulty: 'Storytelling is tell story.', correct: 'Storytelling is telling a story.' }
]

export default function Phase4Step5RemedialB1TaskB() {
  const navigate = useNavigate()
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_b1' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState(SENTENCE_CORRECTIONS[0].faulty)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckSentence = async () => {
    const faultySentence = SENTENCE_CORRECTIONS[currentSentence].faulty
    const userAnswerTrimmed = userAnswer.trim()
    setFeedback({ type: 'info', message: 'Evaluating...' })

    try {
      const response = await fetch('/api/phase4/step5/remedial/evaluate-expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', faultySentence, userAnswer: userAnswerTrimmed, sentenceIndex: currentSentence })
      })
      const data = await response.json()
      const pointsEarned = data.correct ? 1 : 0

      if (data.correct) {
        setScore(score + pointsEarned)
        setFeedback({ type: 'success', message: `Excellent correction! Duel won! +${pointsEarned} point` })
      } else {
        setFeedback({ type: 'error', message: data.feedback || 'Not quite. Try to improve grammar, add articles, and use better vocabulary.' })
      }

      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer(SENTENCE_CORRECTIONS[nextIndex].faulty)
          setFeedback(null)
        } else {
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b1_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)
    } catch (error) {
      console.error('Evaluation error:', error)
      const correctAnswer = SENTENCE_CORRECTIONS[currentSentence].correct
      const userLower = userAnswerTrimmed.toLowerCase()
      const faultyWords = faultySentence.split(/\s+/).length
      const userWords = userAnswerTrimmed.split(/\s+/).length
      const hasImprovement = userWords > faultyWords && userLower !== faultySentence.toLowerCase()
      const pointsEarned = hasImprovement ? 1 : 0

      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({ type: 'success', message: `Good improvement! Duel won! +${pointsEarned} point` })
      } else {
        setFeedback({ type: 'error', message: 'Remember to improve grammar, add articles (a/the), and expand the sentence for better coherence.' })
      }

      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer(SENTENCE_CORRECTIONS[nextIndex].faulty)
          setFeedback(null)
        } else {
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b1_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: finalScore })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'B', score: finalScore, max_score: 8, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('[Phase 4 Step 5] B1 Task B completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => { navigate('/phase4/step/5/remedial/b1/taskC') }
  window.__remedialSkip = handleContinue

  const progress = ((currentSentence + 1) / SENTENCE_CORRECTIONS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 Step 5: Evaluate - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level B1 - Task B: Definition Duel
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Duel with corrections for wins! Fix faulty sentences for better coherence and vocabulary.
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="LILIA"
              message="Welcome to the Definition Duel! You have 8 faulty sentences that need correction. Improve each sentence by fixing grammar, adding articles (a, the), and using better vocabulary. Each correct improvement earns you 1 point and brings you closer to winning the duel!"
            />
          </Box>

          {/* Game Area */}
          {!gameCompleted && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 4, mb: 3,
            }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mb: 3, height: 10, borderRadius: 5,
                  bgcolor: isDark ? '#3D1A07' : '#FED7AA',
                  '& .MuiLinearProgress-bar': { bgcolor: P.orange.shadow }
                }}
              />

              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontWeight: 700, color: P.blue.shadow, fontSize: '0.85rem',
                }}>
                  Sentence {currentSentence + 1} of {SENTENCE_CORRECTIONS.length}
                </Box>
                <Box component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontWeight: 700, color: P.purple.shadow, fontSize: '0.85rem',
                }}>
                  Score: {score}/{SENTENCE_CORRECTIONS.length}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                  ✏️ Improve the sentence below (fix grammar, add articles, use better vocabulary):
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Edit and improve the sentence..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={feedback !== null}
                  autoFocus
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem', fontFamily: 'monospace' } }}
                />
              </Box>

              {feedback && (
                <Box sx={{
                  p: 2, mb: 3, borderRadius: '12px',
                  bgcolor: feedback.type === 'success' ? P.green.bg : feedback.type === 'info' ? P.blue.bg : P.red.bg,
                  border: `2px solid ${feedback.type === 'success' ? P.green.border : feedback.type === 'info' ? P.blue.border : P.red.border}`,
                }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: feedback.type === 'success' ? P.green.shadow : feedback.type === 'info' ? P.blue.shadow : P.red.shadow }}>
                    {feedback.message}
                  </Typography>
                </Box>
              )}

              {!feedback && (
                <Box component="button" onClick={handleCheckSentence} disabled={!userAnswer.trim()} sx={{
                  width: '100%',
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                  px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !userAnswer.trim() ? 'not-allowed' : 'pointer',
                  color: P.blue.shadow, opacity: !userAnswer.trim() ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': userAnswer.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s ease',
                }}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                  Check Sentence
                </Box>
              )}
            </Box>
          )}

          {gameCompleted && (
            <>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center',
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.green.shadow }}>
                  Duel Complete!
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: P.green.shadow }}>
                  Score: {score} / 8
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: P.green.shadow, opacity: 0.8 }}>
                  {score === 8 ? 'Perfect victory! All sentences corrected!' : 'Good work on improving the sentences!'}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 6, py: 1.5, fontWeight: 700, fontSize: '1.1rem',
                  cursor: 'pointer', color: P.orange.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s ease',
                }}>
                  Next: Task C (Wordshake Quiz) →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
