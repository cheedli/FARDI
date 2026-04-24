import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const TERMS = [
  { term: 'emergency', explanation: 'Urgent problem' },
  { term: 'contingency', explanation: 'Extra plan' },
  { term: 'backup', explanation: 'Alternative' },
  { term: 'announce', explanation: 'Tell' },
  { term: 'update', explanation: 'New info' },
  { term: 'transparent', explanation: 'Open' }
]

export default function Phase5Step4RemedialB2TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/4/remedial/b2/task/a') }, [])
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 4, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [currentIndex, setCurrentIndex] = useState(0)
  const [spellings, setSpellings] = useState(Array(6).fill(''))
  const [explanations, setExplanations] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSpellingChange = (value) => { const s = [...spellings]; s[currentIndex] = value; setSpellings(s) }
  const handleExplanationChange = (value) => { const e = [...explanations]; e[currentIndex] = value; setExplanations(e) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingCorrect = spellings[idx].toLowerCase().trim() === term.term.toLowerCase()
      const explanationCorrect = explanations[idx].toLowerCase().includes(term.explanation.toLowerCase().split(' ')[0])
      if (spellingCorrect && explanationCorrect) correctCount++
    })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step4_remedial_b2_taskD_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'B2', 'D', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const a = parseInt(sessionStorage.getItem('phase5_step4_remedial_b2_taskA_score') || '0')
    const b = parseInt(sessionStorage.getItem('phase5_step4_remedial_b2_taskB_score') || '0')
    const c = parseInt(sessionStorage.getItem('phase5_step4_remedial_b2_taskC_score') || '0')
    const d = parseInt(sessionStorage.getItem('phase5_step4_remedial_b2_taskD_score') || '0')
    let nextUrl = '/phase5/subphase/1/step/4/remedial/b2/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(4, 'B2', { task_a_score: a, task_b_score: b, task_c_score: c, task_d_score: d })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (e) {
      console.error(e)
    }
    navigate(nextUrl)
  }

  const canGoNext = spellings[currentIndex].trim() && explanations[currentIndex].trim()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task D: Spell Quest</Typography>
            <Typography variant="body1">Spell and explain 6 terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spell Quest! Spell each term correctly and explain what it means!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Term {currentIndex + 1} of 6</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Expected explanation:</strong> {TERMS[currentIndex].explanation}</Typography>
              </Box>
              <TextField fullWidth label="Spell the term" variant="outlined" value={spellings[currentIndex]} onChange={(e) => handleSpellingChange(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={2} label="Explain the term" variant="outlined" value={explanations[currentIndex]} onChange={(e) => handleExplanationChange(e.target.value)} sx={{ mb: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ ...clay(P.blue), cursor: 'pointer', opacity: currentIndex === 0 ? 0.5 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s' }}>
                  <Typography variant="button" sx={{ color: P.blue.border }}>← Previous</Typography>
                </Box>
                {currentIndex === 5 ? (
                  <Box component="button" onClick={handleSubmit} disabled={!canGoNext} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !canGoNext ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit All</Typography>
                  </Box>
                ) : (
                  <Box component="button" onClick={handleNext} disabled={!canGoNext} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !canGoNext ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Next →</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', width: '100%', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
              <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Final Results →</Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
