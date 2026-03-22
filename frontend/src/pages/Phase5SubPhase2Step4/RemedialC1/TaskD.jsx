import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const APPROACHES = [
  { term: 'Impolite', critique: 'Reduces cooperation', fix: 'Add politeness' },
  { term: 'No sequence', critique: 'Confuses', fix: 'Use first/then' },
  { term: 'Vague safety', critique: 'Risks', fix: 'Explicit' },
  { term: 'No empathy', critique: 'Cold', fix: 'Show care' },
  { term: 'No thanks', critique: 'Low morale', fix: 'Appreciate' },
  { term: 'Complex', critique: 'Confuses', fix: 'Simplify' }
]

export default function Phase5SubPhase2Step4RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [fixes, setFixes] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (index, value) => { const n = [...critiques]; n[index] = value; setCritiques(n) }
  const handleFixChange = (index, value) => { const n = [...fixes]; n[index] = value; setFixes(n) }

  const handleSubmit = async () => {
    let correctCount = 0
    APPROACHES.forEach((_, idx) => {
      const critiqueWords = critiques[idx].trim().split(/\s+/).filter(w => w.length > 0)
      const fixWords = fixes[idx].trim().split(/\s+/).filter(w => w.length > 0)
      if (critiqueWords.length >= 6 && fixWords.length >= 4) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step4_remedial_c1_taskD_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'C1', 'D', correctCount, 6, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/5')
  const allFilled = critiques.every(c => c.trim()) && fixes.every(f => f.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 4: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task D: Critique Game</Typography>
            <Typography variant="body1">Critique 6 instructional approaches. Nuanced critiques!</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Game! For each instructional approach, write a nuanced critique (at least 6 words) and suggest a fix (at least 4 words). Use sophisticated language!" />
          </Box>
          {!submitted ? (
            <>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {APPROACHES.map((approach, idx) => (
                  <Box key={idx} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 3 }}>
                    <Typography variant="h6" gutterBottom><strong>{approach.term}</strong></Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Example critique: "{approach.critique}" | Example fix: "{approach.fix}"</Typography>
                    <TextField fullWidth multiline rows={2} label="Your critique (at least 6 words)" variant="outlined" value={critiques[idx]} onChange={(e) => handleCritiqueChange(idx, e.target.value)} sx={{ mb: 2 }} />
                    <TextField fullWidth multiline rows={2} label="Your fix (at least 4 words)" variant="outlined" value={fixes[idx]} onChange={(e) => handleFixChange(idx, e.target.value)} />
                  </Box>
                ))}
              </Stack>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Submit Answers
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task D Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>Continue to Step 5 →</Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
