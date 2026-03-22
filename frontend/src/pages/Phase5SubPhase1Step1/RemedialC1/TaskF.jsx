import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const CLAUSE_SENTENCES = [
  { id: 1, template: 'Alternative performer, who _______, saves the event.', answer: 'is secured quickly', hint: 'Use relative clause with passive' },
  { id: 2, template: 'Apology, which _______, maintains trust.', answer: 'is issued promptly', hint: 'Use relative clause with passive' },
  { id: 3, template: 'Schedule change, that _______, is implemented.', answer: 'minimizes disruption', hint: 'Use relative clause' },
  { id: 4, template: 'Team, who _______, coordinates better.', answer: 'is informed early', hint: 'Use relative clause with passive' },
  { id: 5, template: 'Damage, which _______, is limited.', answer: 'is mitigated effectively', hint: 'Use relative clause with passive' },
  { id: 6, template: 'Contingency plan, that _______, is essential.', answer: 'prevents crises', hint: 'Use relative clause' }
]

export default function Phase5Step1RemedialC1TaskF() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 6, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    CLAUSE_SENTENCES.forEach((sent, idx) => {
      const answer = answers[idx].toLowerCase().trim()
      const hasRelativePronoun = answer.includes('who') || answer.includes('which') || answer.includes('that')
      const hasVerb = answer.split(' ').length >= 2
      if (hasRelativePronoun || hasVerb) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_c1_taskF_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'C1', 'F', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/c1/task/g')
  }

  const progress = ((currentIndex + 1) / 6) * 100
  const canPrev = currentIndex > 0
  const canNext = !!(answers[currentIndex].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Step 1: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task F: Clause Conquest</Typography>
            <Typography variant="body1">Write 6 complex sentences with terms in passive/relative clauses</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Clause Conquest! Complete each sentence using relative clauses (who, which, that) with passive voice or active verbs!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{
                bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
                p: 2, mb: 3
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sentence {currentIndex + 1} of 6</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>{CLAUSE_SENTENCES[currentIndex].template}</Typography>
                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Hint:</strong> {CLAUSE_SENTENCES[currentIndex].hint}</Typography>
                </Box>
                <TextField
                  fullWidth variant="outlined" placeholder="Fill in the blank..."
                  value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box
                    component="button" onClick={handlePrevious} disabled={!canPrev}
                    sx={{
                      bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                      px: 3, py: 1, fontWeight: 'bold', color: P.orange.border,
                      cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.5,
                      transition: 'all 0.15s',
                      '&:hover': canPrev ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {}
                    }}
                  >← Previous</Box>
                  {currentIndex === 5 ? (
                    <Box
                      component="button" onClick={handleSubmit} disabled={!canNext}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5,
                        transition: 'all 0.15s',
                        '&:hover': canNext ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                      }}
                    >Submit All</Box>
                  ) : (
                    <Box
                      component="button" onClick={handleNext} disabled={!canNext}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5,
                        transition: 'all 0.15s',
                        '&:hover': canNext ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                      }}
                    >Next →</Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task F Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button" onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >Next: Task G →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
