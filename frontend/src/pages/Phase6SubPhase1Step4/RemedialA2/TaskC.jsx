import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const PROMPTS = [
  { label: 'Sentence 1', hint: 'Festival good.' },
  { label: 'Sentence 2', hint: 'Many people.' },
  { label: 'Sentence 3', hint: 'Dances nice.' },
  { label: 'Sentence 4', hint: 'Lights problem.' },
  { label: 'Sentence 5', hint: 'We fix.' },
  { label: 'Sentence 6', hint: 'Next time better.' }
]

export default function Phase6SP1Step4RemedialA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (idx, val) => {
    const updated = [...sentences]; updated[idx] = val; setSentences(updated)
  }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().length > 0).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_a2_taskc_score', filled.toString())
    try {
      await phase6API.logRemedialActivity(4, 'A2', 'C', filled, PROMPTS.length, 0, 1)
    } catch (e) { console.error('Failed to log task:', e) }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1" color="text.secondary">Write 6 simple sentences for a report</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Sentence Builder! Write one simple sentence for each prompt. Use the hint as your model. Short and simple is fine for A2!" />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">Write a simple sentence for each number. Use the hint as your example.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {PROMPTS.map((prompt, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04 }}>
              <Box sx={{ ...cardSx(P.orange) }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, color: P.orange.border }}>{prompt.label}:</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Example: <em>{prompt.hint}</em></Typography>
                <TextField fullWidth size="small" value={sentences[idx]} onChange={(e) => handleChange(idx, e.target.value)} disabled={submitted} placeholder="Write your sentence..." />
              </Box>
            </motion.div>
          ))}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              opacity: !allFilled ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit My Sentences
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task C Complete! Score: {score}/{PROMPTS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>You have completed all A2 remedial tasks for Step 4!</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/1')}
                sx={{
                  px: 6, py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Next Phase →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
