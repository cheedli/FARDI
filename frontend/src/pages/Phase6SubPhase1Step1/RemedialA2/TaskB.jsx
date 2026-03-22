import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Stack,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level A2 - Task B
 * Gap Fill: Choose the correct word for each blank in festival sentences
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const GAP_FILL_ITEMS = [
  { id: 0, sentence: 'Festival was ___.', options: ['success', 'failure', 'mistake'], correct: 'success', explanation: '"Success" means a good result.' },
  { id: 1, sentence: 'Lighting was ___.', options: ['easy', 'challenge', 'positive'], correct: 'challenge', explanation: '"Challenge" means a difficult thing.' },
  { id: 2, sentence: 'Give ___.', options: ['feedback', 'problem', 'activity'], correct: 'feedback', explanation: '"Feedback" means what people say about something.' },
  { id: 3, sentence: 'We can ___.', options: ['negative', 'improve', 'success'], correct: 'improve', explanation: '"Improve" means to make something better.' },
  { id: 4, sentence: 'I feel ___.', options: ['positive', 'challenge', 'feedback'], correct: 'positive', explanation: '"Positive" means a good feeling.' },
  { id: 5, sentence: 'Some parts ___.', options: ['improve', 'success', 'negative'], correct: 'negative', explanation: '"Negative" means a bad feeling or result.' }
]

export default function Phase6SP1Step1RemedialA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (id, value) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    GAP_FILL_ITEMS.forEach(item => {
      if (answers[item.id] === item.correct) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_a2_taskB_score', correctCount.toString())
    try {
      await phase6API.logRemedialActivity(1, 'A2', 'B', correctCount, 6, 0, 1)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/1/remedial/a2/task/c')
  }

  const allAnswered = GAP_FILL_ITEMS.every(item => answers[item.id] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Step 1: Remedial Practice - Level A2
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>
              Task B: Gap Fill
            </Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>
              Choose the correct word to complete each sentence about the festival
            </Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.purple.bg,
            border: `2px solid ${P.purple.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Fill Frenzy! Fill 6 gaps with reflection words. Choose the correct word from the word bank for each sentence about the festival."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: P.blue.shadow }}>
            <strong>Instructions:</strong> For each sentence, select the word that best fills the blank.
            There is only one correct answer for each question.
          </Typography>
        </Box>

        {/* Gap Fill Questions */}
        <Stack spacing={3}>
          {GAP_FILL_ITEMS.map((item) => {
            const userAnswer = answers[item.id]
            const isCorrect = submitted && userAnswer === item.correct
            const isIncorrect = submitted && userAnswer !== item.correct

            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + item.id * 0.04 }}>
                <Box sx={{
                  bgcolor: submitted ? (isCorrect ? P.green.bg : P.red.bg) : P.yellow.bg,
                  border: `2px solid ${submitted ? (isCorrect ? P.green.border : P.red.border) : P.yellow.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${submitted ? (isCorrect ? P.green.shadow : P.red.shadow) : P.yellow.shadow}`,
                  p: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: P.orange.shadow, minWidth: 24 }}>
                      {item.id + 1}.
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {item.sentence}
                    </Typography>
                    {submitted && (
                      isCorrect
                        ? <CheckCircleIcon sx={{ color: P.green.border, ml: 'auto' }} />
                        : <CancelIcon sx={{ color: P.red.border, ml: 'auto' }} />
                    )}
                  </Box>

                  <FormControl component="fieldset" disabled={submitted}>
                    <RadioGroup
                      value={userAnswer || ''}
                      onChange={(e) => handleAnswer(item.id, e.target.value)}
                    >
                      {item.options.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio sx={{ '&.Mui-checked': { color: submitted && option === item.correct ? P.green.border : submitted && option !== item.correct ? P.red.border : P.purple.border } }} />}
                          label={
                            <Typography variant="body1" sx={{
                              color: submitted
                                ? option === item.correct ? P.green.shadow
                                : option === userAnswer && option !== item.correct ? P.red.shadow
                                : 'text.secondary'
                                : 'text.primary'
                            }}>
                              {option}{submitted && option === item.correct && ' ✓'}
                            </Typography>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {submitted && (
                    <Box sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: isCorrect ? P.green.bg : P.red.bg,
                      border: `1px solid ${isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '10px'
                    }}>
                      <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                        {isCorrect
                          ? `Correct! ${item.explanation}`
                          : `The correct answer is "${item.correct}". ${item.explanation}`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Stack>

        {/* Submit */}
        {!submitted && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                opacity: allAnswered ? 1 : 0.6,
                px: 6,
                py: 1.5,
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: P.orange.shadow,
                '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none', boxShadow: allAnswered ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s'
              }}
            >
              Submit Answers
            </Box>
          </Box>
        )}

        {/* Results */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3,
              mt: 3,
              mb: 3,
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>
                Task B Complete!
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>
                Score: {score} / {GAP_FILL_ITEMS.length}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score === GAP_FILL_ITEMS.length
                  ? 'Perfect! You chose all the correct words!'
                  : score >= 2
                  ? 'Well done! Keep practising these vocabulary words.'
                  : 'Good effort! Review the correct answers above.'}
              </Typography>
            </Box>

            <Stack direction="row" justifyContent="flex-end">
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  cursor: 'pointer',
                  px: 4,
                  py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Next: Task C →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
