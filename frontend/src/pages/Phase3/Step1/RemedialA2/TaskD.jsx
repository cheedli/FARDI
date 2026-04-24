import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, MenuItem, Select, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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

const QUESTIONS = [
  { id: 1, sentence: 'We need a ____ to pay for the event costs.', options: ['sponsor', 'ticket', 'sketch'], answer: 'sponsor' },
  { id: 2, sentence: 'The ____ tells us how much money we can spend.', options: ['jingle', 'budget', 'layout'], answer: 'budget' },
  { id: 3, sentence: 'People buy a ____ to enter the festival.', options: ['ticket', 'slogan', 'clip'], answer: 'ticket' },
  { id: 4, sentence: 'The event made a lot of ____ from selling tickets.', options: ['animation', 'income', 'poster'], answer: 'income' },
]

export default function Phase3RemedialA2TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase3/step/1/remedial/b1/taskA') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 4, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const isComplete = QUESTIONS.every(q => answers[q.id])

  const handleSubmit = () => {
    setShowResults(true)
    const score = QUESTIONS.filter(q => answers[q.id] === q.answer).length
    logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'D', score, max_score: QUESTIONS.length, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const score = showResults ? QUESTIONS.filter(q => answers[q.id] === q.answer).length : 0
  const allCorrect = score === QUESTIONS.length

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
                Level A2 — Task D: Choose the Correct Word
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="EMNA" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Emna
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Almost done! Choose the correct word to complete each sentence. You can do it!
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
              Select the correct word from the dropdown to complete each sentence.
            </Typography>
          </Box>
        </motion.div>

        {/* Questions */}
        <Box sx={{ mb: 4 }}>
          {QUESTIONS.map((q, index) => {
            const userAnswer = answers[q.id]
            const isCorrect = showResults && userAnswer === q.answer
            const isWrong = showResults && userAnswer && userAnswer !== q.answer
            const parts = q.sentence.split('____')
            const c = isCorrect ? D.green : isWrong ? D.red : { bg: D.cardBg, border: D.divider, shadow: D.divider }
            return (
              <motion.div key={q.id} variants={fadeUp} initial="hidden" animate="visible" custom={3 + index}>
                <Box sx={{ ...clay(c), p: { xs: 2, md: 2.5 }, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading }}>{index + 1}.</Typography>
                    <Typography variant="body1" sx={{ color: D.body }}>{parts[0]}</Typography>
                    <FormControl size="small">
                      <Select
                        value={userAnswer || ''}
                        onChange={e => !showResults && setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        displayEmpty
                        disabled={showResults}
                        sx={{
                          minWidth: 130, borderRadius: '10px',
                          bgcolor: D.cardBg, fontWeight: 700,
                          '& .MuiSelect-select': { color: D.body, fontWeight: 700 },
                          '& .MuiSelect-select em': { color: D.muted },
                        }}
                      >
                        <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                        {q.options.map(opt => (
                          <MenuItem key={opt} value={opt} sx={{ fontWeight: 600, color: D.body }}>{opt}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="body1" sx={{ color: D.body }}>{parts[1]}</Typography>
                    {isCorrect && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                  </Box>
                  {isWrong && (
                    <Box sx={{ mt: 1, p: 1, borderRadius: '10px', bgcolor: D.red.bg }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: D.red.border }}>
                        Correct answer: {q.answer}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Results summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <Box sx={{ ...clay(allCorrect ? D.green : D.blue), p: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={700} sx={{ color: allCorrect ? D.green.border : D.blue.border }}>
                {allCorrect
                  ? `Perfect score! ${score}/${QUESTIONS.length} — Great work on A2 remedial!`
                  : `Score: ${score}/${QUESTIONS.length} — Keep practicing!`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!showResults ? (
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
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
              <Box
                component="button"
                onClick={() => navigate('/phase3/step/1/remedial/b1/taskA')}
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
                Continue to B1 Practice
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
