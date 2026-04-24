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
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
}

const ERROR_SENTENCES = [
  { id: 1, incorrect: 'Alternative is found quick', correct: 'Alternative is found quickly', error: 'quick → quickly (adverb)' },
  { id: 2, incorrect: 'Apology send to audience', correct: 'Apology is sent to audience', error: 'send → is sent (passive)' },
  { id: 3, incorrect: 'Schedule change minimize disruption', correct: 'Schedule change minimizes disruption', error: 'minimize → minimizes (3rd person)' },
  { id: 4, incorrect: 'Team inform early', correct: 'Team is informed early', error: 'inform → is informed (passive)' },
  { id: 5, incorrect: 'Damage mitigate effectively', correct: 'Damage is mitigated effectively', error: 'mitigate → is mitigated (passive)' },
  { id: 6, incorrect: 'Contingency plan prevent crisis', correct: 'Contingency plan prevents crisis', error: 'prevent → prevents (3rd person)' }
]

export default function Phase5Step1RemedialC1TaskH() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/1/remedial/c1/task/a') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 8, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [corrections, setCorrections] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCorrectionChange = (value) => {
    const newCorrections = [...corrections]
    newCorrections[currentIndex] = value
    setCorrections(newCorrections)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    ERROR_SENTENCES.forEach((sent, idx) => {
      const correction = corrections[idx].toLowerCase().trim()
      const correct = sent.correct.toLowerCase()
      if (correction.includes(correct.split(' ')[0]) && correction.length >= sent.correct.length * 0.7) {
        correctCount++
      }
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_c1_taskH_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'C1', 'H', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskF_score') || '0')
    const taskGScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskG_score') || '0')
    const taskHScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskH_score') || '0')
    let nextUrl = '/phase5/subphase/1/step/1/remedial/c1/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(1, 'C1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore,
        task_e_score: taskEScore, task_f_score: taskFScore, task_g_score: taskGScore, task_h_score: taskHScore
      })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
    navigate(nextUrl)
  }

  const progress = ((currentIndex + 1) / 6) * 100
  const canPrev = currentIndex > 0
  const canNext = !!(corrections[currentIndex].trim())

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
            <Typography variant="h6" gutterBottom fontWeight="bold">Task H: Correction Crusade</Typography>
            <Typography variant="body1">Correct errors in 6 advanced sentences</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Correction Crusade! Correct the errors in each sentence. Look for grammar, spelling, and structure mistakes!" />
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
                <Typography variant="h6" gutterBottom sx={{ color: '#EF4444' }}>
                  Incorrect: {ERROR_SENTENCES[currentIndex].incorrect}
                </Typography>
                <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Error:</strong> {ERROR_SENTENCES[currentIndex].error}</Typography>
                </Box>
                <TextField
                  fullWidth multiline rows={2} variant="outlined" label="Corrected sentence"
                  placeholder="Write the corrected sentence here..."
                  value={corrections[currentIndex]} onChange={(e) => handleCorrectionChange(e.target.value)}
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
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task H Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>All C1 remedial tasks completed! Calculating final score...</Typography>
            </Box>
            <Box
              component="button" onClick={handleContinue}
              sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.green.shadow, cursor: 'pointer', width: '100%',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
              }}
            >Continue to Final Results →</Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
