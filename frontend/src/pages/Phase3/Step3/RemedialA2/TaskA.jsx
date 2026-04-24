import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, Select, MenuItem, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level A2 - Task A: Gap Fill
 * Complete sentences using: because, so
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

const GAP_FILL_SENTENCES = [
  { id: 1, text: "We need a sponsor _______ the budget is large.", correctAnswers: ['because'], hint: 'Explains the reason' },
  { id: 2, text: "The venue is expensive _______ we need more funding.", correctAnswers: ['so'], hint: 'Shows the result' },
  { id: 3, text: "We sell tickets _______ people want to attend.", correctAnswers: ['because'], hint: 'Why do we sell tickets?' },
  { id: 4, text: "The costs are high _______ we must find sponsors.", correctAnswers: ['so'], hint: 'What happens as a result?' },
  { id: 5, text: "We need careful planning _______ money is limited.", correctAnswers: ['because'], hint: 'What is the reason?' },
  { id: 6, text: "Sponsors help us _______ they give money.", correctAnswers: ['because'], hint: 'How do they help?' },
  { id: 7, text: "The budget shows all costs _______ we can plan better.", correctAnswers: ['so'], hint: 'What does this allow us to do?' },
  { id: 8, text: "We create a budget _______ we need to control spending.", correctAnswers: ['because'], hint: 'Why make a budget?' },
  { id: 9, text: "Equipment is necessary _______ the event needs good sound.", correctAnswers: ['because'], hint: 'What is the reason?' },
  { id: 10, text: "Income is low _______ we need donations.", correctAnswers: ['so'], hint: 'What happens because of this?' },
]

export default function Phase3Step3RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_a2' })
  const muiTheme = useTheme()
  const dark = muiTheme.palette.mode === 'dark'

  const D = dark
    ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
    : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }

  const C = dark
    ? {
        green:  { bg: '#1B2E1B', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#0D1B2A', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#2A0A0A', border: '#C62828', shadow: '#C62828' },
        orange: { bg: '#2A1500', border: '#F57C00', shadow: '#F57C00' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
      }

  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (c) => ({
    bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 2.5,
  })

  const handleAnswerChange = (id, value) => { setAnswers({ ...answers, [id]: value }) }

  const handleSubmit = () => {
    let correctCount = 0
    GAP_FILL_SENTENCES.forEach(sentence => {
      const userAnswer = answers[sentence.id]?.toLowerCase().trim()
      if (sentence.correctAnswers.some(correct => userAnswer === correct)) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    logTaskCompletion(correctCount, GAP_FILL_SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 3 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase3/step/3/remedial/b1/taskA') }
  window.__remedialSkip = handleNext
  const allAnswered = Object.keys(answers).length === GAP_FILL_SENTENCES.length &&
    Object.values(answers).every(a => a && a.trim().length > 0)
  const passThreshold = 8

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.orange), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.orange.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Remedial A2
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Gap Fill Exercise</Typography>
            <Typography sx={{ color: D.muted }}>Select the correct connector for each blank</Typography>
          </Box>
        </motion.div>

        {/* Instructor */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Let's practice using connectors! Fill in the gaps using either 'because' or 'so'. Remember: 'because' explains the reason, and 'so' shows the result."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Instructions:</Typography>
            <Typography sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>
              • <strong>because:</strong> introduces the REASON → "We need money <strong>because</strong> costs are high"
            </Typography>
            <Typography sx={{ color: D.body, fontSize: '0.88rem', mb: 0.75 }}>
              • <strong>so:</strong> introduces the RESULT → "Costs are high <strong>so</strong> we need money"
            </Typography>
            <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}><strong>Passing score:</strong> Minimum 8/10 correct</Typography>
          </Box>
        </motion.div>

        {/* Progress */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, fontSize: '1.05rem' }}>
                Completed: {Object.values(answers).filter(a => a && a.trim().length > 0).length}/{GAP_FILL_SENTENCES.length}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Sentences */}
        <Box sx={{ mb: 4 }}>
          {GAP_FILL_SENTENCES.map((sentence, index) => {
            const userAnswer = answers[sentence.id]?.toLowerCase().trim()
            const isCorrect = showResults && sentence.correctAnswers.some(correct => userAnswer === correct)
            const isAnswered = userAnswer && userAnswer.length > 0
            const c = showResults ? (isCorrect ? C.green : C.red) : isAnswered ? C.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={sentence.id} variants={fadeUp} initial="hidden" animate="visible" custom={4 + index * 0.3}>
                <Box sx={{ ...cardSx(c), mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    <Typography sx={{ color: D.body, fontSize: '0.95rem', fontWeight: 700 }}>
                      {index + 1}.
                    </Typography>
                    <Typography sx={{ color: D.body, fontSize: '0.95rem' }}>
                      {sentence.text.split('_______')[0]}
                    </Typography>
                    <FormControl size="small">
                      <Select
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                        disabled={showResults}
                        displayEmpty
                        sx={{
                          bgcolor: showResults ? (isCorrect ? C.green.bg : C.red.bg) : D.cardBg,
                          border: `2px solid ${showResults ? (isCorrect ? C.green.border : C.red.border) : C.blue.border}`,
                          borderRadius: '10px',
                          minWidth: 110,
                          fontWeight: 700,
                          color: D.body,
                          '& .MuiOutlinedInput-notchedOutline': { display: 'none' },
                        }}
                      >
                        <MenuItem value="" disabled><em style={{ color: D.muted }}>Select...</em></MenuItem>
                        <MenuItem value="because">because</MenuItem>
                        <MenuItem value="so">so</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography sx={{ color: D.body, fontSize: '0.95rem' }}>
                      {sentence.text.split('_______')[1]}
                    </Typography>
                  </Box>

                  <Typography sx={{ color: D.muted, fontSize: '0.82rem', mb: showResults ? 1.5 : 0 }}>
                    💡 Hint: {sentence.hint}
                  </Typography>

                  {showResults && (
                    <Box sx={{
                      bgcolor: isCorrect ? C.green.bg : C.red.bg,
                      border: `1px solid ${isCorrect ? C.green.border : C.red.border}`,
                      borderRadius: '10px', p: 1.25,
                    }}>
                      <Typography sx={{ color: D.body, fontSize: '0.85rem' }}>
                        {isCorrect ? (
                          <>✓ Correct! The answer is: <strong>{userAnswer}</strong></>
                        ) : (
                          <>
                            ✗ Your answer: <strong>{userAnswer || '(no answer)'}</strong><br />
                            Correct answer: <strong>{sentence.correctAnswers.join(' or ')}</strong>
                          </>
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Results Summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Box sx={{ ...cardSx(score >= passThreshold ? C.green : C.yellow), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Typography sx={{ color: D.body, mb: 0.5 }}><strong>Score:</strong> {score}/{GAP_FILL_SENTENCES.length}</Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.9rem' }}>
                {score === GAP_FILL_SENTENCES.length
                  ? "Perfect score! Excellent work!"
                  : score >= passThreshold
                    ? `Great job! You passed with ${score} correct answers.`
                    : `You need ${passThreshold} correct to pass. Review the answers above and try again if needed.`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                bgcolor: allAnswered ? C.orange.border : D.divider,
                color: '#fff', px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${allAnswered ? C.orange.border : D.divider}`,
                boxShadow: allAnswered ? `4px 4px 0 #E65100` : 'none',
                fontWeight: 800, fontSize: '1rem', cursor: allAnswered ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #E65100' } : {},
              }}
            >
              Submit Answers
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleNext}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: C.green.border, color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${C.green.border}`,
                boxShadow: `4px 4px 0 #2E7D32`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #2E7D32' },
              }}
            >
              Continue to B1 Practice <ArrowForwardIcon fontSize="small" />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
