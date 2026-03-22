import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A2 - Task C: Grammar Exercise (Connectors)
 * Add "because" or "and" to 6 sentences, gamified as "Connector Quest"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const SENTENCES = [
  { id: 0, text: 'Singer cancel _______ sick.', answer: 'because', options: ['because', 'and'] },
  { id: 1, text: 'Find solution _______ fix.', answer: 'and', options: ['because', 'and'] },
  { id: 2, text: 'Say sorry _______ problem.', answer: 'because', options: ['because', 'and'] },
  { id: 3, text: 'Use alternative _______ new singer.', answer: 'and', options: ['because', 'and'] },
  { id: 4, text: 'Change time _______ urgent.', answer: 'because', options: ['because', 'and'] },
  { id: 5, text: 'Tell people _______ apologize.', answer: 'and', options: ['because', 'and'] }
]

export default function Phase5Step1RemedialA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (sentenceId, answer) => {
    setAnswers(prev => ({ ...prev, [sentenceId]: answer }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (answers[sentence.id] === sentence.answer) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_a2_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'A2', 'C', correctCount, 6, 0)
      console.log('[Phase 5 Step 1] A2 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 7 + 8 + 6
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold
    try {
      await phase5API.calculateRemedialScore(1, 'A2', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/1/remedial/a2/task/a')
    }
  }

  const allAnswered = SENTENCES.every(sentence => answers[sentence.id])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Step 1: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task C: Connector Quest</Typography>
            <Typography variant="body1">Add "because" or "and" to 6 sentences</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Welcome to Connector Quest! Choose the correct connector ('because' or 'and') for each sentence. 'Because' shows a reason, 'and' adds more information!"
            />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {SENTENCES.map((sentence, i) => (
                <motion.div key={sentence.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <Box sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom>Sentence {sentence.id + 1}</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>{sentence.text}</Typography>
                    <Stack direction="row" spacing={2}>
                      {sentence.options.map((option) => {
                        const isSelected = answers[sentence.id] === option
                        const col = isSelected ? P.purple : P.teal
                        return (
                          <Box
                            key={option}
                            component="button"
                            onClick={() => handleAnswerSelect(sentence.id, option)}
                            sx={{
                              bgcolor: col.bg, border: `2px solid ${col.border}`,
                              borderRadius: '12px', boxShadow: `3px 3px 0 ${col.shadow}`,
                              px: 3, py: 1, fontSize: '1rem', fontWeight: 'bold',
                              color: col.border, cursor: 'pointer',
                              transition: 'all 0.15s',
                              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${col.shadow}` }
                            }}
                          >
                            {option}
                          </Box>
                        )
                      })}
                    </Stack>
                    {answers[sentence.id] && (
                      <Box sx={{
                        mt: 2, bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                        borderRadius: '10px', p: 1
                      }}>
                        <Typography variant="body2" sx={{ color: P.green.shadow }}>
                          Selected: <strong>{answers[sentence.id]}</strong>
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              ))}
            </Stack>

            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.blue.border, cursor: allAnswered ? 'pointer' : 'not-allowed',
                opacity: allAnswered ? 1 : 0.5, width: '100%',
                transition: 'all 0.15s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
              }}
            >
              Submit Answers
            </Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            {/* Results */}
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                Results: {score} / {SENTENCES.length} Correct
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {SENTENCES.map((sentence) => {
                  const isCorrect = answers[sentence.id] === sentence.answer
                  const col = isCorrect ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }
                  return (
                    <Box
                      key={sentence.id}
                      sx={{
                        bgcolor: col.bg, border: `2px solid ${col.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${col.shadow}`,
                        p: 2
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {sentence.text.replace('_______', `[${answers[sentence.id] || 'not answered'}]`)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : col.shadow }}>
                        {isCorrect ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${sentence.answer}`}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.green.shadow, cursor: 'pointer', width: '100%',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
              }}
            >
              Continue to Final Results →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
