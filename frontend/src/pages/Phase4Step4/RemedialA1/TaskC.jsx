import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SentenceBuilder from '../../../components/exercises/SentenceBuilder.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Level A1 - Task C: Grammar Exercise (Simple Sentences)
 * Write 6 simple sentences describing poster/video following template examples
 */

// Exercise structure for SentenceBuilder component
const SENTENCE_BUILDER_EXERCISE = {
  instruction: 'Complete each sentence following the template',
  templates: [
    'Poster has ___.',
    'Video has ___.',
    '___ is song.',
    '___ is story.',
    'Clip is ___.',
    'Sketch is ___.'
  ],
  correct_answers: [
    'Poster has gatefold.',
    'Video has animation.',
    'Jingle is song.',
    'Dramatisation is story.',
    'Clip is short.',
    'Sketch is plan.'
  ]
}

// For scoring purposes
const SENTENCE_TEMPLATES = [
  { term: 'gatefold', template: 'Poster has gatefold.', subject: 'Poster', verb: 'has', object: 'gatefold' },
  { term: 'animation', template: 'Video has animation.', subject: 'Video', verb: 'has', object: 'animation' },
  { term: 'jingle', template: 'Jingle is song.', subject: 'Jingle', verb: 'is', object: 'song' },
  { term: 'dramatisation', template: 'Dramatisation is story.', subject: 'Dramatisation', verb: 'is', object: 'story' },
  { term: 'clip', template: 'Clip is short.', subject: 'Clip', verb: 'is', object: 'short' },
  { term: 'sketch', template: 'Sketch is plan.', subject: 'Sketch', verb: 'is', object: 'plan' }
]

export default function Phase4Step4RemedialA1TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    // SentenceBuilder now awards 1 point per correct sentence
    const score = result.score || 0 // This will be the actual score (1 point per sentence)

    console.log('[Phase 4 Step 4] A1 Task C - Sentence Builder completed')
    console.log('[Phase 4 Step 4] A1 Task C - Score:', score, '/', SENTENCE_TEMPLATES.length)
    console.log('[Phase 4 Step 4] A1 Task C - Result:', result)

    sessionStorage.setItem('phase4_step4_remedial_a1_taskC_score', score)
    logTaskCompletion(score)
    setGameCompleted(true)
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
          level: 'A1',
          task: 'C',
          score: score,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A1 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6 // 22 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 18
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Matching):', taskAScore, '/8')
    console.log('Task B (Gap Fill):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Dashboard/Next Phase')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/step4/remedial/a1/final-score', {
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
        console.log('Final A1 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A1 scores
      sessionStorage.removeItem('phase4_step4_remedial_a1_taskA_score')
      sessionStorage.removeItem('phase4_step4_remedial_a1_taskB_score')
      sessionStorage.removeItem('phase4_step4_remedial_a1_taskC_score')

      if (passed) {
        // Navigate to dashboard or next phase
        navigate('/dashboard')
      } else {
        // Restart from Task A
        navigate('/phase4/step/4/remedial/a1/taskA')
      }
    }, 5000) // 5 second delay
  }

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
              Phase 4 Step 4: Apply - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A1 - Task C: Sentence Builder
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Write 6 simple sentences following the template examples
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="MS. MABROUKI"
              message="Excellent progress! For the final task, write 6 simple sentences following the examples shown. Use simple present tense and basic structure. You can copy the examples or write your own similar sentences!"
            />
          </Box>

          {/* Sentence Builder Game */}
          {!gameCompleted && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <SentenceBuilder
                exercise={SENTENCE_BUILDER_EXERCISE}
                onComplete={handleGameComplete}
              />
            </Box>
          )}

          {/* Navigation */}
          {gameCompleted && !showFinalResults && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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
          )}

          {/* Final Results - Pass/Fail */}
          {showFinalResults && (
            <Box sx={{
              bgcolor: finalScore.passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${finalScore.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${finalScore.passed ? P.green.shadow : P.yellow.shadow}`,
              p: 5, mt: 3, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                {finalScore.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Phase 4 Step 4 - Remedial A1 - Final Results
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Task A (Term Treasure Hunt): {finalScore.taskA} / 8
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Task B (Fill Quest): {finalScore.taskB} / 8
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Task C (Sentence Builder): {finalScore.taskC} / 6
                </Typography>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Total Score: {finalScore.total} / 22
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.yellow.shadow }}>
                  Pass Threshold: 18 / 22 (80%)
                </Typography>
              </Box>

              {finalScore.passed ? (
                <Box>
                  <Typography variant="h6" sx={{ mt: 3, color: P.green.shadow }}>
                    You have passed Remedial A1!
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: P.green.shadow }}>
                    Proceeding to Dashboard...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mt: 3, color: P.yellow.shadow }}>
                    Score below passing threshold
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: P.yellow.shadow }}>
                    Restarting Remedial A1 to help you improve...
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" sx={{ mt: 3, color: finalScore.passed ? P.green.shadow : P.yellow.shadow, opacity: 0.8 }}>
                Redirecting in 5 seconds...
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
