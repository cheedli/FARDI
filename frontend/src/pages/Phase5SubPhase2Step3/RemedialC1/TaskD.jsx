import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
}

const APPROACHES = [
  { term: 'Impolite tone', critique: 'Reduces cooperation', fix: 'Add please/thank you' },
  { term: 'No sequencing', critique: 'Causes confusion', fix: 'Use first/then/next' },
  { term: 'Vague safety', critique: 'Risks incidents', fix: 'Be explicit' },
  { term: 'No empathy', critique: 'Feels mechanical', fix: 'Show understanding' },
  { term: 'Missing appreciation', critique: 'Lowers morale', fix: 'Thank volunteers' },
  { term: 'Overly complex', critique: 'Overwhelms', fix: 'Simplify' }
]

export default function Phase5SubPhase2Step3RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [fixes, setFixes] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (index, value) => {
    const newCritiques = [...critiques]
    newCritiques[index] = value
    setCritiques(newCritiques)
  }

  const handleFixChange = (index, value) => {
    const newFixes = [...fixes]
    newFixes[index] = value
    setFixes(newFixes)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    APPROACHES.forEach((approach, idx) => {
      const critiqueWords = critiques[idx].trim().split(/\s+/).filter(w => w.length > 0)
      const fixWords = fixes[idx].trim().split(/\s+/).filter(w => w.length > 0)
      if (critiqueWords.length >= 8 && fixWords.length >= 5) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_c1_taskD_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'C1', 'D', correctCount, 6, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(3, 'C1'))

  const allFilled = critiques.every(c => c.trim()) && fixes.every(f => f.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.purple.shadow }}>SubPhase 2 Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task D: Critique Game</Typography>
            <Typography variant="body1">Critique 6 instructional approaches. Nuanced critiques!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Game! For each instructional approach, write a nuanced critique (at least 8 words) and suggest a fix (at least 5 words). Use sophisticated language!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {APPROACHES.map((approach, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
                  <Box sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}><strong>{approach.term}</strong></Typography>
                    <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                      <Typography variant="body2">Example critique: "{approach.critique}" | Example fix: "{approach.fix}"</Typography>
                    </Box>
                    <TextField
                      fullWidth multiline rows={2}
                      label="Your critique (at least 8 words)"
                      variant="outlined"
                      value={critiques[idx]}
                      onChange={(e) => handleCritiqueChange(idx, e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth multiline rows={2}
                      label="Your fix (at least 5 words)"
                      variant="outlined"
                      value={fixes[idx]}
                      onChange={(e) => handleFixChange(idx, e.target.value)}
                    />
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Box
              component="button" onClick={handleSubmit} disabled={!allFilled}
              sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.blue.border, cursor: allFilled ? 'pointer' : 'not-allowed',
                opacity: allFilled ? 1 : 0.5, width: '100%',
                transition: 'all 0.15s',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
              }}
            >Submit Answers</Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task D Complete!</Typography>
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
              >Continue to Step 4 →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
