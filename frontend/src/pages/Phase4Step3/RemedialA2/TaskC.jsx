import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, Link as LinkIcon } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A2 - Task C: Connector Quest
 * Add "because" or "and" to 6 video sentences
 * Score: +1 for each correct connector (6 total)
 */

const SENTENCES = [
  { text: 'Ad promotional _____ persuasive.', correctConnector: 'and', explanation: 'Use "and" to join two equal ideas: promotional AND persuasive' },
  { text: 'Convince _____ good.', correctConnector: 'because', explanation: 'Use "because" to show reason: convince BECAUSE (it is) good' },
  { text: 'Targeted _____ original.', correctConnector: 'and', explanation: 'Use "and" to join two equal ideas: targeted AND original' },
  { text: 'Creative _____ memorable.', correctConnector: 'because', explanation: 'Use "because" to show reason: creative BECAUSE (it is) memorable' },
  { text: 'Dramatisation _____ goal.', correctConnector: 'and', explanation: 'Use "and" to join two equal ideas: dramatisation AND goal' },
  { text: 'Obstacles _____ conflict.', correctConnector: 'because', explanation: 'Use "because" to show reason: obstacles BECAUSE (create) conflict' }
]

export default function RemedialA2TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const currentSentence = SENTENCES[currentIndex]

  const handleConnectorSelect = (connector) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = connector
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCES.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => ({
      userAnswer: answer,
      correctAnswer: SENTENCES[index].correctConnector,
      isCorrect: answer === SENTENCES[index].correctConnector,
      explanation: SENTENCES[index].explanation
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_a2_taskC_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'C', step: 2, score: score, max_score: 6, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step3_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step3_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step3_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= 18
    let nextUrl = passed ? '/phase4/step/4' : '/phase4/step3/remedial/a2/taskA'

    console.log('PHASE 4 STEP 2 - REMEDIAL A2 - FINAL RESULTS')
    console.log('Total:', totalScore, '/22')

    try {
      const response = await fetch('/api/phase4/step3/remedial/a2/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore })
      })
      const data = await response.json()
      if (data?.success && data?.data?.next_url) {
        nextUrl = data.data.next_url.replace(/^\/app/, '')
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('remedial_step3_a2_taskA_score')
      sessionStorage.removeItem('remedial_step3_a2_taskB_score')
      sessionStorage.removeItem('remedial_step3_a2_taskC_score')
      navigate(nextUrl)
    }, 5000)
  }

  const progress = ((currentIndex + 1) / SENTENCES.length) * 100
  const currentScore = userAnswers.filter((answer, idx) => answer === SENTENCES[idx].correctConnector).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 - Step 3: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A2 - Task C: Connector Quest
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Connect sentences to quest for treasure! Choose the right connector (because/and) to link ideas together.
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Excellent work on expanding sentences! Now let's connect them! You have 6 sentences with blanks. For each one, choose either 'because' or 'and' to fill the blank. Remember: use 'and' to join equal ideas, use 'because' to show a reason. Think carefully about each sentence!"
            />
          </Box>

          {!submitted ? (
            <Box>
              {/* Progress Bar */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 2, mb: 3,
              }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }} gutterBottom>
                  Sentence {currentIndex + 1} of {SENTENCES.length}
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{
                  mb: 1, borderRadius: '4px',
                  '& .MuiLinearProgress-bar': { backgroundColor: P.yellow.shadow }
                }} />
              </Box>

              {/* Current Sentence */}
              <Box sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 4, mb: 3,
              }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                    {currentIndex + 1}. {currentSentence.text.replace('_____', '___')}
                  </Typography>
                </Box>

                {/* Connector Buttons */}
                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                  <Box component="button" onClick={() => handleConnectorSelect('because')} sx={{
                    width: 180, height: 180, borderRadius: '50%',
                    fontSize: '1.3rem', fontWeight: 700,
                    bgcolor: userAnswers[currentIndex] === 'because' ? P.green.shadow : P.green.bg,
                    border: `4px solid ${P.green.border}`,
                    boxShadow: userAnswers[currentIndex] === 'because' ? `4px 4px 0 ${P.green.shadow}` : `3px 3px 0 ${P.green.border}`,
                    cursor: 'pointer',
                    color: userAnswers[currentIndex] === 'because' ? 'white' : P.green.shadow,
                    transition: 'all 0.15s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    '&:active': { transform: 'scale(0.98)' },
                  }}>
                    because
                  </Box>

                  <Box component="button" onClick={() => handleConnectorSelect('and')} sx={{
                    width: 180, height: 180, borderRadius: '50%',
                    fontSize: '1.3rem', fontWeight: 700,
                    bgcolor: userAnswers[currentIndex] === 'and' ? P.orange.shadow : P.orange.bg,
                    border: `4px solid ${P.orange.border}`,
                    boxShadow: userAnswers[currentIndex] === 'and' ? `4px 4px 0 ${P.orange.shadow}` : `3px 3px 0 ${P.orange.border}`,
                    cursor: 'pointer',
                    color: userAnswers[currentIndex] === 'and' ? 'white' : P.orange.shadow,
                    transition: 'all 0.15s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                    '&:active': { transform: 'scale(0.98)' },
                  }}>
                    and
                  </Box>
                </Stack>

                {/* Helper Info */}
                <Box sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px', p: 2, mb: 3,
                }}>
                  <Stack direction="row" spacing={4} justifyContent="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LinkIcon fontSize="small" /> "because" = reason
                      </Typography>
                      <Typography variant="caption" sx={{ color: P.blue.shadow, opacity: 0.7 }}>
                        Shows why something happens
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.orange.shadow, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LinkIcon fontSize="small" /> "and" = join equal ideas
                      </Typography>
                      <Typography variant="caption" sx={{ color: P.blue.shadow, opacity: 0.7 }}>
                        Connects two similar things
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Real-time Score */}
                <Box sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', p: 2, mb: 3, textAlign: 'center',
                }}>
                  <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                    {SENTENCES.map((sentence, idx) => {
                      const userAnswer = userAnswers[idx]
                      const isCorrect = userAnswer === sentence.correctConnector
                      const isAnswered = userAnswer !== ''
                      return (
                        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                          <Typography variant="caption" sx={{ color: P.green.shadow, opacity: 0.7 }}>Q{idx + 1}</Typography>
                          <Typography variant="h5" fontWeight="bold" sx={{
                            color: !isAnswered ? 'grey.400' : isCorrect ? P.green.shadow : P.red.shadow
                          }}>
                            {!isAnswered ? '-' : isCorrect ? '+1' : '0'}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, color: P.green.shadow }}>
                    SCORE: {currentScore}
                  </Typography>
                  <Typography variant="caption" sx={{ color: P.green.shadow, opacity: 0.7 }}>
                    Answered: {userAnswers.filter(a => a).length} / {SENTENCES.length}
                  </Typography>
                </Box>

                {/* Navigation */}
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{
                    bgcolor: currentIndex === 0 ? 'grey.200' : P.blue.bg,
                    border: `2px solid ${currentIndex === 0 ? '#ccc' : P.blue.border}`,
                    borderRadius: '12px',
                    boxShadow: currentIndex === 0 ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                    px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    color: currentIndex === 0 ? 'grey.500' : P.blue.shadow,
                    '&:hover': currentIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                    '&:active': currentIndex === 0 ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                  }}>
                    ← Previous
                  </Box>

                  {currentIndex < SENTENCES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{
                      bgcolor: !userAnswers[currentIndex] ? 'grey.200' : P.blue.bg,
                      border: `2px solid ${!userAnswers[currentIndex] ? '#ccc' : P.blue.border}`,
                      borderRadius: '12px',
                      boxShadow: !userAnswers[currentIndex] ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: !userAnswers[currentIndex] ? 'not-allowed' : 'pointer',
                      color: !userAnswers[currentIndex] ? 'grey.500' : P.blue.shadow,
                      '&:hover': !userAnswers[currentIndex] ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                      '&:active': !userAnswers[currentIndex] ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                    }}>
                      Next →
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(answer => !answer)} sx={{
                      bgcolor: userAnswers.some(answer => !answer) ? 'grey.200' : P.green.bg,
                      border: `2px solid ${userAnswers.some(answer => !answer) ? '#ccc' : P.green.border}`,
                      borderRadius: '12px',
                      boxShadow: userAnswers.some(answer => !answer) ? 'none' : `3px 3px 0 ${P.green.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: userAnswers.some(answer => !answer) ? 'not-allowed' : 'pointer',
                      color: userAnswers.some(answer => !answer) ? 'grey.500' : P.green.shadow,
                      '&:hover': userAnswers.some(answer => !answer) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                      '&:active': userAnswers.some(answer => !answer) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                    }}>
                      Submit Quest
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Quick Navigation */}
              <Box sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                p: 2,
              }}>
                <Typography variant="body2" sx={{ color: P.purple.shadow }} gutterBottom>Jump to sentence:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SENTENCES.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{
                      bgcolor: idx === currentIndex ? P.purple.shadow : P.purple.bg,
                      border: `2px solid ${P.purple.border}`,
                      borderRadius: '8px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.8rem', minWidth: 40,
                      cursor: 'pointer',
                      color: idx === currentIndex ? 'white' : P.purple.shadow,
                      '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.purple.shadow}` },
                    }}>
                      {idx + 1} {userAnswers[idx] && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : !showFinalResults ? (
            <Box>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  {score === 6 ? 'Perfect Connection!' : 'Good Quest!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  You scored {score} out of 6 points!
                </Typography>
              </Box>

              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Connector Review:
                </Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={index} sx={{
                      bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', p: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {result.isCorrect ? <CheckCircle sx={{ color: P.green.shadow, fontSize: 18 }} /> : <Cancel sx={{ color: P.red.shadow, fontSize: 18 }} />}
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                          Sentence {index + 1}: {SENTENCES[index].text.replace('_____', `[${result.userAnswer || '?'}]`)}
                        </Typography>
                      </Box>
                      {!result.isCorrect && (
                        <Typography variant="body2" sx={{ color: P.red.shadow, mt: 0.5 }}>
                          Correct answer: <strong>{result.correctAnswer}</strong>
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, opacity: 0.8, display: 'block', mt: 0.5 }}>
                        {result.explanation}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  View Final Results
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box sx={{
              bgcolor: finalScore.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${finalScore.passed ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${finalScore.passed ? P.green.shadow : P.orange.shadow}`,
              p: 5, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                {finalScore.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Phase 4 Step 3 - Remedial A2 - Final Results
                </Typography>
                {[['Task A (Dialogue Adventure)', finalScore.taskA, 8], ['Task B (Expand Empire)', finalScore.taskB, 8], ['Task C (Connector Quest)', finalScore.taskC, 6]].map(([label, val, max]) => (
                  <Typography key={label} variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                    {label}: {val} / {max}
                  </Typography>
                ))}
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Total Score: {finalScore.total} / 22
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.orange.shadow, opacity: 0.8 }}>
                  Pass Threshold: 18 / 22
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mt: 3, color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                {finalScore.passed ? 'You have passed Step 3 Remedial A2!' : 'Score below passing threshold'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.orange.shadow, opacity: 0.8 }}>
                {finalScore.passed ? 'Proceeding to dashboard...' : 'Restarting Step 3 Remedial A2 to help you improve...'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 3, opacity: 0.6, color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                Redirecting in 5 seconds...
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
