import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Alert, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level A2 - Task C: Connector Quest
 */

const CONNECTOR_OPTIONS = ['and', 'but', 'so', 'because']

const SENTENCES = [
  { part1: 'Poster has gatefold', part2: 'video has animation', correctConnector: 'and', explanation: '"and" joins two equal ideas (gatefold AND animation)' },
  { part1: 'Slogan is catchy', part2: 'poster is memorable', correctConnector: 'so', explanation: '"so" shows result (catchy LEADS TO memorable)' },
  { part1: 'Clip is short', part2: 'it is easy to watch', correctConnector: 'so', explanation: '"so" shows result (short LEADS TO easy to watch)' },
  { part1: 'Jingle is simple', part2: 'it is complex', correctConnector: 'but', explanation: '"but" shows contrast (simple VERSUS complex)' },
  { part1: 'Video uses dramatisation', part2: 'it engages viewers', correctConnector: 'because', explanation: '"because" shows reason (uses dramatisation FOR THE REASON THAT it engages)' },
  { part1: 'Poster is colorful', part2: 'video is plain', correctConnector: 'but', explanation: '"but" shows contrast (colorful VERSUS plain)' }
]

export default function Phase4Step5RemedialA2TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_a2' })
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

  const handleNext = () => { if (currentIndex < SENTENCES.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const isCorrect = answer === SENTENCES[index].correctConnector
      return {
        userAnswer: answer,
        correctAnswer: SENTENCES[index].correctConnector,
        isCorrect,
        explanation: SENTENCES[index].explanation,
        correctSentence: `${SENTENCES[index].part1} ${SENTENCES[index].correctConnector} ${SENTENCES[index].part2}.`
      }
    })
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_a2_taskC_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'C', score: score, max_score: 6, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('[Phase 4 Step 5] A2 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 18
    const threshold = 15
    const passed = totalScore >= threshold

    try {
      const response = await fetch('/api/phase4/step5/remedial/a2/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore })
      })
      const data = await response.json()
      if (data.success) {
        console.log('Final A2 score logged to backend:', data.data)
        sessionStorage.setItem('phase4_step5_a2_next_url', data.data.next_url || (passed ? '/phase4_2/step/1' : '/phase4/step/5/remedial/a2/taskA'))
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('phase4_step5_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_step5_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_step5_remedial_a2_taskC_score')
      navigate(sessionStorage.getItem('phase4_step5_a2_next_url') || (passed ? '/phase4_2/step/1' : '/phase4/step/5/remedial/a2/taskA'))
    }, 5000)
  }

  const progress = ((currentIndex + 1) / SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Phase 4 Step 5: Evaluate - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.purple.shadow }}>
              Level A2 - Task C: Connector Quest
            </Typography>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              Choose the right connector to link ideas!
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
              message="Excellent work! Now let's connect sentences! For each sentence pair, choose the best connector: 'and' (join equal ideas), 'but' (show contrast), 'so' (show result), or 'because' (show reason). Choose wisely!"
            />
          </Box>

          {!submitted ? (
            <Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mb: 3, height: 10, borderRadius: 5,
                  bgcolor: isDark ? '#3B1F6E' : '#E9D5FF',
                  '& .MuiLinearProgress-bar': { bgcolor: P.purple.shadow }
                }}
              />

              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 4, mb: 3,
              }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box component="span" sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontWeight: 700, color: P.blue.shadow, fontSize: '0.85rem',
                  }}>
                    Sentence {currentIndex + 1} of {SENTENCES.length}
                  </Box>
                  <Box component="span" sx={{
                    bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontWeight: 700, color: P.purple.shadow, fontSize: '0.85rem',
                  }}>
                    Answered: {userAnswers.filter(a => a).length}/{SENTENCES.length}
                  </Box>
                </Box>

                {/* Sentence Display */}
                <Box sx={{
                  bgcolor: isDark ? '#1a1a2e' : '#F5F5F5',
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '16px', p: 3, mb: 3, textAlign: 'center',
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
                    {currentSentence.part1}
                    <Box component="span" sx={{
                      mx: 2, px: 3, py: 0.5,
                      bgcolor: userAnswers[currentIndex] ? P.purple.bg : isDark ? '#1a1a2e' : '#fff',
                      border: `2px dashed ${P.purple.border}`,
                      borderRadius: '8px', display: 'inline-block', minWidth: 120,
                      color: P.purple.shadow, fontWeight: 700,
                    }}>
                      {userAnswers[currentIndex] || '______'}
                    </Box>
                    {currentSentence.part2}.
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3, color: P.blue.shadow }}>
                  Choose the best connector:
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
                  {CONNECTOR_OPTIONS.map((connector) => (
                    <Box component="button" key={connector} onClick={() => handleConnectorSelect(connector)} sx={{
                      minWidth: 120, height: 60,
                      bgcolor: userAnswers[currentIndex] === connector ? P.purple.bg : isDark ? '#1a1a2e' : '#fff',
                      border: `2px solid ${P.purple.border}`,
                      borderRadius: '12px',
                      boxShadow: userAnswers[currentIndex] === connector ? `3px 3px 0 ${P.purple.shadow}` : 'none',
                      fontSize: '1.2rem', fontWeight: 'bold',
                      cursor: 'pointer', color: P.purple.shadow,
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `3px 3px 0 ${P.purple.shadow}` },
                      '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.purple.shadow}` },
                      transition: 'all 0.15s ease',
                    }}>
                      {connector}
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{
                    bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                    px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    color: P.yellow.shadow, opacity: currentIndex === 0 ? 0.5 : 1,
                    '&:hover': currentIndex !== 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.yellow.shadow}` } : {},
                    transition: 'all 0.15s ease',
                  }}>
                    ← Previous
                  </Box>

                  {currentIndex < SENTENCES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{
                      bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: !userAnswers[currentIndex] ? 'not-allowed' : 'pointer',
                      color: P.purple.shadow, opacity: !userAnswers[currentIndex] ? 0.5 : 1,
                      '&:hover': userAnswers[currentIndex] ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {},
                      transition: 'all 0.15s ease',
                    }}>
                      Next →
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(answer => !answer)} sx={{
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                      px: 4, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: userAnswers.some(a => !a) ? 'not-allowed' : 'pointer',
                      color: P.green.shadow, opacity: userAnswers.some(a => !a) ? 0.5 : 1,
                      '&:hover': !userAnswers.some(a => !a) ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
                      transition: 'all 0.15s ease',
                    }}>
                      Submit Quest
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Quick Jump */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                p: 2,
              }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Jump to sentence:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SENTENCES.map((_, idx) => (
                    <Box component="button" key={idx} onClick={() => setCurrentIndex(idx)} sx={{
                      minWidth: 40, height: 36,
                      bgcolor: idx === currentIndex ? P.purple.bg : isDark ? '#1a1a2e' : '#fff',
                      border: `2px solid ${P.purple.border}`,
                      borderRadius: '8px',
                      fontWeight: 700, fontSize: '0.85rem',
                      cursor: 'pointer', color: P.purple.shadow,
                      '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.purple.shadow}` },
                      transition: 'all 0.15s ease',
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
                  {score === 6 ? 'Perfect Connection!' : 'Quest Complete!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  Score: {score} / 6
                </Typography>
              </Box>

              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow }}>Connector Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Alert
                      key={index}
                      severity={result.isCorrect ? 'success' : 'error'}
                      icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                      sx={{ borderRadius: '12px' }}
                    >
                      <Typography variant="body2" gutterBottom><strong>Sentence {index + 1}:</strong></Typography>
                      <Typography variant="body2" color="success.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ✓ Correct: {result.correctSentence}
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" color="error.dark" sx={{ mt: 1 }}>
                          Your answer: <strong>{result.userAnswer || 'No answer'}</strong> (should be "<strong>{result.correctAnswer}</strong>")
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {result.explanation}
                      </Typography>
                    </Alert>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="center">
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
            </Box>
          ) : (
            <Box sx={{
              bgcolor: finalScore.passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${finalScore.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${finalScore.passed ? P.green.shadow : P.yellow.shadow}`,
              p: 5, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
              </Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Phase 4 Step 5 - Remedial A2 - Final Results
                </Typography>
                {[
                  { label: 'Task A (Dialogue Adventure)', val: finalScore.taskA, max: 4 },
                  { label: 'Task B (Expand Empire)', val: finalScore.taskB, max: 8 },
                  { label: 'Task C (Connector Quest)', val: finalScore.taskC, max: 6 },
                ].map((item, i) => (
                  <Typography key={i} variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                    {item.label}: {item.val} / {item.max}
                  </Typography>
                ))}
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Total Score: {finalScore.total} / 18
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Pass Threshold: 15 / 18 (80%)
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mt: 3, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? '✅ You have passed Remedial A2!' : '❌ Score below passing threshold'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.85, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? 'Proceeding to Dashboard...' : 'Restarting Remedial A2 to help you improve...'}
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
