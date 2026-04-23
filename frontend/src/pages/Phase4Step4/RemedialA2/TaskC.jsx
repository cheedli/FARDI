import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, useTheme, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, Link as LinkIcon } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Level A2 - Task C: Connector Quest
 * Add "because" or "and" to 6 sentences
 * Score: +1 for each correct connector (6 total)
 */

const SENTENCES = [
  {
    text: 'Poster gatefold _____ lettering.',
    correctConnector: 'and',
    explanation: 'Use "and" to join two equal ideas: gatefold AND lettering'
  },
  {
    text: 'Video animation _____ fun.',
    correctConnector: 'because',
    explanation: 'Use "because" to show reason: animation BECAUSE (it is) fun'
  },
  {
    text: 'Jingle short _____ catchy.',
    correctConnector: 'and',
    explanation: 'Use "and" to join two equal ideas: short AND catchy'
  },
  {
    text: 'Dramatisation story _____ engage.',
    correctConnector: 'because',
    explanation: 'Use "because" to show reason: story BECAUSE (it can) engage'
  },
  {
    text: 'Sketch plan _____ draw.',
    correctConnector: 'and',
    explanation: 'Use "and" to join two equal ideas: plan AND draw'
  },
  {
    text: 'Clip short _____ quick.',
    correctConnector: 'because',
    explanation: 'Use "because" to show reason: short BECAUSE (it is) quick'
  }
]

export default function Phase4Step4RemedialA2TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_a2' })
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
    if (currentIndex < SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    // Check all answers
    const checkResults = userAnswers.map((answer, index) => {
      const isCorrect = answer === SENTENCES[index].correctConnector
      return {
        userAnswer: answer,
        correctAnswer: SENTENCES[index].correctConnector,
        isCorrect,
        explanation: SENTENCES[index].explanation
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('phase4_step4_remedial_a2_taskC_score', correctCount)

    // Log to backend
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'C',
          score: score,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A2 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 7 + 8 + 6 // 21 total (Task A now worth 7, not 12)
    const threshold = 18
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL A2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Dialogue Adventure):', taskAScore, '/7')
    console.log('Task B (Expand Empire):', taskBScore, '/8')
    console.log('Task C (Connector Quest):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Dashboard/Next Phase')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A2')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/step4/remedial/a2/final-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Final A2 score logged to backend:', data.data)
        sessionStorage.setItem('phase4_step4_a2_next_url', data.data.next_url || (passed ? '/phase4/step/5' : '/phase4/step/4/remedial/a2/taskA'))
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A2 scores
      sessionStorage.removeItem('phase4_step4_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_step4_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_step4_remedial_a2_taskC_score')

      navigate(sessionStorage.getItem('phase4_step4_a2_next_url') || (passed ? '/phase4/step/5' : '/phase4/step/4/remedial/a2/taskA'))
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 Step 4: Apply - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A2 - Task C: Connector Quest
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Connect sentences to quest for treasure! Choose the right connector (because/and) to link ideas together.
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Excellent work on expanding sentences! Now let's connect them! You have 6 sentences with blanks. For each one, choose either 'because' or 'and' to fill the blank. Remember: use 'and' to join equal ideas, use 'because' to show a reason. Think carefully about each sentence!"
            />
          </Box>

          {!submitted ? (
            <Box>
              {/* Progress */}
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }} gutterBottom>
                  Sentence {currentIndex + 1} of {SENTENCES.length}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {SENTENCES.map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: '100%', height: 8, borderRadius: '999px',
                        bgcolor: idx < currentIndex ? P.green.border :
                                idx === currentIndex ? P.blue.border : (isDark ? '#333' : '#ddd'),
                        border: `1px solid ${idx < currentIndex ? P.green.shadow : idx === currentIndex ? P.blue.shadow : 'transparent'}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Current Sentence */}
              <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mb: 3 }}>
                {/* Sentence display */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                    {currentIndex + 1}. {currentSentence.text.replace('_____', '___')}
                  </Typography>
                </Box>

                {/* Connector Buttons (large circular clay buttons) */}
                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                  <Box
                    component="button"
                    onClick={() => handleConnectorSelect('because')}
                    sx={{
                      width: 160, height: 160, borderRadius: '50%',
                      fontSize: '1.3rem', fontWeight: 'bold',
                      bgcolor: userAnswers[currentIndex] === 'because' ? P.green.border : P.green.bg,
                      color: userAnswers[currentIndex] === 'because' ? 'white' : P.green.shadow,
                      border: `4px solid ${userAnswers[currentIndex] === 'because' ? P.green.shadow : P.green.border}`,
                      boxShadow: userAnswers[currentIndex] === 'because' ? `4px 4px 0 ${P.green.shadow}` : `3px 3px 0 ${P.green.shadow}`,
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.05)', transition: 'all 0.2s' }
                    }}
                  >
                    because
                  </Box>

                  <Box
                    component="button"
                    onClick={() => handleConnectorSelect('and')}
                    sx={{
                      width: 160, height: 160, borderRadius: '50%',
                      fontSize: '1.3rem', fontWeight: 'bold',
                      bgcolor: userAnswers[currentIndex] === 'and' ? P.yellow.border : P.yellow.bg,
                      color: userAnswers[currentIndex] === 'and' ? 'white' : P.yellow.shadow,
                      border: `4px solid ${userAnswers[currentIndex] === 'and' ? P.yellow.shadow : P.yellow.border}`,
                      boxShadow: userAnswers[currentIndex] === 'and' ? `4px 4px 0 ${P.yellow.shadow}` : `3px 3px 0 ${P.yellow.shadow}`,
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.05)', transition: 'all 0.2s' }
                    }}
                  >
                    and
                  </Box>
                </Stack>

                {/* Helper Info */}
                <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.purple.shadow}`, p: 2, mb: 3 }}>
                  <Stack direction="row" spacing={4} justifyContent="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                        <LinkIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        "because" = reason
                      </Typography>
                      <Typography variant="caption" sx={{ color: P.purple.shadow }}>
                        Shows why something happens
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                        <LinkIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        "and" = join equal ideas
                      </Typography>
                      <Typography variant="caption" sx={{ color: P.purple.shadow }}>
                        Connects two similar things
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Score Display */}
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.green.shadow}`, p: 2, textAlign: 'center', mb: 3 }}>
                  <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                    {SENTENCES.map((sentence, idx) => {
                      const userAnswer = userAnswers[idx]
                      const isCorrect = userAnswer === sentence.correctConnector
                      const isAnswered = userAnswer !== ''
                      return (
                        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                          <Typography variant="caption" sx={{ color: P.green.shadow }}>Q{idx + 1}</Typography>
                          <Typography variant="h5" fontWeight="bold" sx={{ color: !isAnswered ? (isDark ? '#555' : '#ccc') : isCorrect ? P.green.shadow : P.red.shadow }}>
                            {!isAnswered ? '-' : isCorrect ? '+1' : '0'}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, color: P.green.shadow }}>
                    SCORE: {userAnswers.filter((answer, idx) => answer === SENTENCES[idx].correctConnector).length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: P.green.shadow }}>
                    Answered: {userAnswers.filter(a => a).length} / {SENTENCES.length}
                  </Typography>
                </Box>

                {/* Navigation */}
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                    px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', color: P.blue.shadow,
                    opacity: currentIndex === 0 ? 0.5 : 1,
                    '&:hover': currentIndex !== 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                  }}>
                    ← Previous
                  </Box>

                  {currentIndex < SENTENCES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{
                      bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                      px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                      cursor: !userAnswers[currentIndex] ? 'not-allowed' : 'pointer', color: P.orange.shadow,
                      opacity: !userAnswers[currentIndex] ? 0.5 : 1,
                      '&:hover': userAnswers[currentIndex] ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                    }}>
                      Next →
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(answer => !answer)} sx={{
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                      px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                      cursor: userAnswers.some(answer => !answer) ? 'not-allowed' : 'pointer', color: P.green.shadow,
                      opacity: userAnswers.some(answer => !answer) ? 0.5 : 1,
                      '&:hover': !userAnswers.some(answer => !answer) ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
                    }}>
                      Submit Quest
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Quick Navigation */}
              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.purple.shadow }} gutterBottom>Jump to sentence:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SENTENCES.map((_, idx) => (
                    <Box
                      key={idx}
                      component="button"
                      onClick={() => setCurrentIndex(idx)}
                      sx={{
                        minWidth: 40, py: 0.5, px: 1,
                        bgcolor: idx === currentIndex ? P.purple.border : P.purple.bg,
                        border: `2px solid ${P.purple.border}`,
                        borderRadius: '8px',
                        boxShadow: idx === currentIndex ? `2px 2px 0 ${P.purple.shadow}` : 'none',
                        color: idx === currentIndex ? 'white' : P.purple.shadow,
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                      }}
                    >
                      {idx + 1} {userAnswers[idx] && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : !showFinalResults ? (
            <Box>
              {/* Results */}
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  {score === 6 ? 'Perfect Connection!' : 'Good Quest!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  You scored {score} out of 6 points!
                </Typography>
              </Box>

              {/* Answer Review */}
              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                  Connector Review:
                </Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={index} sx={{
                      bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', boxShadow: `2px 2px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                      p: 2, display: 'flex', gap: 1, alignItems: 'flex-start',
                    }}>
                      {result.isCorrect ? <CheckCircle sx={{ color: P.green.shadow }} /> : <Cancel sx={{ color: P.red.shadow }} />}
                      <Box>
                        <Typography variant="body2" gutterBottom sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                          <strong>Sentence {index + 1}:</strong> {SENTENCES[index].text.replace('_____', `[${result.userAnswer || '?'}]`)}
                        </Typography>
                        {!result.isCorrect && (
                          <Typography variant="body2" sx={{ mt: 1, color: P.red.shadow }}>
                            Correct answer: <strong>{result.correctAnswer}</strong>
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: result.isCorrect ? P.green.shadow : P.red.shadow, opacity: 0.8 }}>
                          {result.explanation}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>
                  View Final Results
                </Box>
              </Box>
            </Box>
          ) : (
            /* Final Results - Pass/Fail */
            <Box sx={{
              bgcolor: finalScore.passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${finalScore.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${finalScore.passed ? P.green.shadow : P.yellow.shadow}`,
              p: 5, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Phase 4 Step 4 - Remedial A2 - Final Results
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Task A (Dialogue Adventure): {finalScore.taskA} / 7
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Task B (Expand Empire): {finalScore.taskB} / 8
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Task C (Connector Quest): {finalScore.taskC} / 6
                </Typography>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Total Score: {finalScore.total} / 21
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Pass Threshold: 17 / 21 (80%)
                </Typography>
              </Box>

              {finalScore.passed ? (
                <Box>
                  <Typography variant="h6" sx={{ mt: 3, color: P.green.shadow }}>You have passed Remedial A2!</Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: P.green.shadow }}>Proceeding to Dashboard...</Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mt: 3, color: P.yellow.shadow }}>Score below passing threshold</Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: P.yellow.shadow }}>Restarting Remedial A2 to help you improve...</Typography>
                </Box>
              )}

              <Typography variant="body2" sx={{ mt: 3, opacity: 0.8, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                Redirecting in 5 seconds...
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
