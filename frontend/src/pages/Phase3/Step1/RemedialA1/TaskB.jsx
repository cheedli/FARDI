import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, MenuItem, Select, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

const GAP_FILL_SENTENCES = [
  { id: 1, sentence: 'We need ____ for food.', answer: 'money', options: ['money', 'sponsor', 'budget', 'ticket'] },
  { id: 2, sentence: 'The ____ will help us pay for the event.', answer: 'sponsor', options: ['money', 'sponsor', 'budget', 'ticket'] },
  { id: 3, sentence: 'Our ____ shows how we spend money.', answer: 'budget', options: ['money', 'sponsor', 'budget', 'ticket'] },
  { id: 4, sentence: 'People buy a ____ to enter the festival.', answer: 'ticket', options: ['money', 'sponsor', 'budget', 'ticket'] },
]

export default function Phase3RemedialA1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 2, context: 'remedial_a1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const usedWords = Object.values(answers).filter(Boolean)

  const handleAnswerChange = (sentenceId, value) => {
    setAnswers(prev => ({ ...prev, [sentenceId]: value }))
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = GAP_FILL_SENTENCES.filter(s => answers[s.id] === s.answer).length
    logTaskCompletion(score, GAP_FILL_SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'B', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/app/dashboard') }

  const correctCount = GAP_FILL_SENTENCES.filter(s => answers[s.id] === s.answer).length
  const isComplete = Object.keys(answers).length === GAP_FILL_SENTENCES.length
  const allCorrect = correctCount === GAP_FILL_SENTENCES.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level A1 — Task B: Gap Fill
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="MS_MABROUKI" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Ms. Mabrouki
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Let's practice using financial words in sentences. Fill in the blanks with the correct word!
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.teal.border, mb: 0.5 }}>
              Instructions
            </Typography>
            <Typography variant="body2" sx={{ color: D.body }}>
              Choose the correct word to fill each gap.
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>
              Words to use: money, sponsor, budget, ticket
            </Typography>
          </Box>
        </motion.div>

        {/* Gap Fill Sentences */}
        <Box sx={{ mb: 4 }}>
          {GAP_FILL_SENTENCES.map((sentence, index) => {
            const isCorrect = showResults && answers[sentence.id] === sentence.answer
            const isWrong = showResults && answers[sentence.id] && answers[sentence.id] !== sentence.answer
            const c = isCorrect ? D.green : isWrong ? D.red : { bg: D.cardBg, border: D.divider, shadow: D.divider }
            return (
              <motion.div key={sentence.id} variants={fadeUp} initial="hidden" animate="visible" custom={3 + index}>
                <Box sx={{ ...clay(c), p: { xs: 2, md: 2.5 }, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body1" fontWeight={700} sx={{ color: D.heading }}>{index + 1}.</Typography>
                    <Typography variant="body1" sx={{ color: D.body }}>{sentence.sentence.split('____')[0]}</Typography>
                    <FormControl size="small">
                      <Select
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                        displayEmpty
                        disabled={showResults}
                        sx={{
                          minWidth: 130,
                          borderRadius: '10px',
                          bgcolor: D.cardBg,
                          fontWeight: 700,
                          '& .MuiSelect-select': { color: D.body, fontWeight: 700 },
                          '& .MuiSelect-select em': { color: D.muted },
                        }}
                      >
                        <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                        {sentence.options.map((option) => {
                          const usedElsewhere = usedWords.includes(option) && answers[sentence.id] !== option
                          return (
                            <MenuItem key={option} value={option} disabled={usedElsewhere} sx={{ color: usedElsewhere ? D.muted : D.body, fontWeight: 600 }}>
                              {option}{usedElsewhere ? ' (used)' : ''}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                    <Typography variant="body1" sx={{ color: D.body }}>{sentence.sentence.split('____')[1]}</Typography>
                    {isCorrect && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                  </Box>
                  {isWrong && (
                    <Box sx={{ mt: 1, p: 1, borderRadius: '10px', bgcolor: D.red.bg }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: D.red.border }}>
                        Correct answer: {sentence.answer}
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
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <Box sx={{ ...clay(allCorrect ? D.green : D.orange), p: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={700} sx={{ color: allCorrect ? D.green.border : D.orange.border }}>
                You got {correctCount} out of {GAP_FILL_SENTENCES.length} correct.
                {allCorrect && ' Excellent! You understand how to use these financial words!'}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!showResults && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!isComplete}
                sx={{
                  px: 3, py: 1.25,
                  bgcolor: D.blue.bg, color: D.blue.border,
                  border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  opacity: !isComplete ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: !isComplete ? 'none' : 'translate(-2px,-2px)', boxShadow: !isComplete ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit Answers
              </Box>
            </motion.div>
          )}
          {showResults && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 3, py: 1.25,
                  bgcolor: D.green.bg, color: D.green.border,
                  border: `2px solid ${D.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Complete A1 Tasks
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
