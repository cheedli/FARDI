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
 * Phase 4 Step 5 - Level A1 - Task C: Grammar Exercise (Simple Sentences)
 */

const GRAMMAR_FIXES = [
  { id: 1, faulty: 'Poster hav title.', correct: 'Poster has title.' },
  { id: 2, faulty: 'Video hav animation.', correct: 'Video has animation.' },
  { id: 3, faulty: 'Slogan is word.', correct: 'Slogan is words.' },
  { id: 4, faulty: 'Clip is parts.', correct: 'Clip is part.' },
  { id: 5, faulty: 'Jingle is songs.', correct: 'Jingle is song.' },
  { id: 6, faulty: 'Feature is highlights.', correct: 'Feature is highlight.' }
]

export default function Phase4Step5RemedialA1TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_a1' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState(GRAMMAR_FIXES[0].faulty)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const handleCheckSentence = () => {
    const correctAnswer = GRAMMAR_FIXES[currentSentence].correct
    const userAnswerTrimmed = userAnswer.trim().toLowerCase()
    const correctAnswerLower = correctAnswer.toLowerCase()
    const isCorrect = userAnswerTrimmed === correctAnswerLower

    if (isCorrect) {
      setScore(score + 1)
      setFeedback({ type: 'success', message: 'Perfect! +1 point' })
    } else {
      setFeedback({ type: 'error', message: `Incorrect. Correct answer: ${correctAnswer}` })
    }

    setTimeout(() => {
      if (currentSentence < GRAMMAR_FIXES.length - 1) {
        const nextIndex = currentSentence + 1
        setCurrentSentence(nextIndex)
        setUserAnswer(GRAMMAR_FIXES[nextIndex].faulty)
        setFeedback(null)
      } else {
        const finalTaskCScore = isCorrect ? score + 1 : score
        sessionStorage.setItem('phase4_step5_remedial_a1_taskC_score', finalTaskCScore)
        logTaskCompletion(finalTaskCScore)
        setGameCompleted(true)
        setFeedback(null)
      }
    }, 1500)
  }

  const logTaskCompletion = async (taskScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: taskScore })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'C', score: taskScore, max_score: 6, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('[Phase 4 Step 5] A1 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6 // 22 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 18
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 5 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Spelling Rescue):', taskAScore, '/8')
    console.log('Task B (Fill Quest):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log(passed ? '✅ PASSED' : '❌ FAILED')
    console.log('='.repeat(60) + '\n')

    try {
      const response = await fetch('/api/phase4/step5/remedial/a1/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore })
      })
      const data = await response.json()
      if (data.success) console.log('Final A1 score logged to backend:', data.data)
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('phase4_step5_remedial_a1_taskA_score')
      sessionStorage.removeItem('phase4_step5_remedial_a1_taskB_score')
      sessionStorage.removeItem('phase4_step5_remedial_a1_taskC_score')

      if (passed) {
        navigate('/phase4/complete')
      } else {
        navigate('/phase4/step/5/remedial/a1/taskA')
      }
    }, 5000)
  }

  const progress = ((currentSentence + 1) / GRAMMAR_FIXES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.red.shadow }}>
              Phase 4 Step 5: Evaluate - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.red.shadow }}>
              Level A1 - Task C: Sentence Builder
            </Typography>
            <Typography variant="body1" sx={{ color: P.red.shadow }}>
              Correct 6 simple grammar mistakes!
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
              message="Excellent progress! For the final task, correct the grammar mistakes in 6 simple sentences. Type the correct version of each sentence!"
            />
          </Box>

          {/* Game Area */}
          {!gameCompleted && !showFinalResults && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 4, mb: 3,
            }}>
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mb: 3, height: 10, borderRadius: 5,
                  bgcolor: isDark ? '#3D1A07' : '#FED7AA',
                  '& .MuiLinearProgress-bar': { bgcolor: P.orange.shadow }
                }}
              />

              {/* Sentence Counter */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontWeight: 700, color: P.blue.shadow, fontSize: '0.85rem',
                }}>
                  Sentence {currentSentence + 1} of {GRAMMAR_FIXES.length}
                </Box>
                <Box component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontWeight: 700, color: P.purple.shadow, fontSize: '0.85rem',
                }}>
                  Score: {score}/{GRAMMAR_FIXES.length}
                </Box>
              </Box>

              {/* User Input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                  ✏️ Edit and correct the sentence below:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Edit the sentence to fix the grammar..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={feedback !== null}
                  autoFocus
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem', fontFamily: 'monospace' } }}
                />
              </Box>

              {/* Feedback */}
              {feedback && (
                <Box sx={{
                  p: 2, mb: 3, borderRadius: '12px',
                  bgcolor: feedback.type === 'success' ? P.green.bg : P.red.bg,
                  border: `2px solid ${feedback.type === 'success' ? P.green.border : P.red.border}`,
                }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: feedback.type === 'success' ? P.green.shadow : P.red.shadow }}>
                    {feedback.message}
                  </Typography>
                </Box>
              )}

              {/* Check Button */}
              {!feedback && (
                <Box component="button" onClick={handleCheckSentence} disabled={!userAnswer.trim()} sx={{
                  width: '100%',
                  bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.red.shadow}`,
                  px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !userAnswer.trim() ? 'not-allowed' : 'pointer',
                  color: P.red.shadow, opacity: !userAnswer.trim() ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': userAnswer.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.red.shadow}` } : {},
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.red.shadow}` },
                  transition: 'all 0.15s ease',
                }}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                  Check Sentence
                </Box>
              )}
            </Box>
          )}

          {/* Navigation after game completion */}
          {gameCompleted && !showFinalResults && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.orange.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                View Final Results
              </Box>
            </Stack>
          )}

          {/* Final Results */}
          {showFinalResults && (
            <Box sx={{
              bgcolor: finalScore.passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${finalScore.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${finalScore.passed ? P.green.shadow : P.yellow.shadow}`,
              p: 5, mt: 3, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Phase 4 Step 5 - Remedial A1 - Final Results
                </Typography>
                {[
                  { label: 'Task A (Spelling Rescue)', val: finalScore.taskA, max: 8 },
                  { label: 'Task B (Fill Quest)', val: finalScore.taskB, max: 8 },
                  { label: 'Task C (Sentence Builder)', val: finalScore.taskC, max: 6 },
                ].map((item, i) => (
                  <Typography key={i} variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                    {item.label}: {item.val} / {item.max}
                  </Typography>
                ))}
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Total Score: {finalScore.total} / 22
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Pass Threshold: 18 / 22 (80%)
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mt: 3, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? '✅ You have passed Remedial A1!' : '❌ Score below passing threshold'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.yellow.shadow, opacity: 0.85 }}>
                {finalScore.passed ? 'Proceeding to Dashboard...' : 'Restarting Remedial A1 to help you improve...'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 3, opacity: 0.7, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                Redirecting in 5 seconds...
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
