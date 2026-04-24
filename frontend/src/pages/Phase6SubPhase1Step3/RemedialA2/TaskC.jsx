import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

const PROMPTS = [
  { label: 'Sentence 1', hint: 'Festival good.' },
  { label: 'Sentence 2', hint: 'People happy.' },
  { label: 'Sentence 3', hint: 'Challenge lighting.' },
  { label: 'Sentence 4', hint: 'We fix it.' },
  { label: 'Sentence 5', hint: 'Improve next time.' },
  { label: 'Sentence 6', hint: 'Recommend more help.' }
]

export default function Phase6SP1Step3RemedialA2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase1RemedialNextUrl(3, 'A2').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleChange = (idx, val) => { const updated = [...sentences]; updated[idx] = val; setSentences(updated) }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().length > 0).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_a2_taskc_score', filled.toString())
    try { await phase6API.logRemedialActivity(3, 'A2', 'C', filled, PROMPTS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1" color="text.secondary">Write 6 simple sentences for a report</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Sentence Builder! Write one simple sentence for each prompt. Use the example as a guide. Short sentences are fine!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3, p: 2 }}>
            <Typography variant="body2">Write a simple sentence for each number. Use the hint as a model.</Typography>
          </Box>
        </motion.div>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {PROMPTS.map((prompt, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.03 }}>
              <Box sx={{ ...cardSx(P.blue), p: 2.5 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, color: P.blue.border }}>{prompt.label}:</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Example: <em>{prompt.hint}</em></Typography>
                <TextField fullWidth size="small" value={sentences[idx]} onChange={(e) => handleChange(idx, e.target.value)} disabled={submitted} placeholder="Write your sentence here..." />
              </Box>
            </motion.div>
          ))}
        </Stack>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit My Sentences
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task C Complete! Score: {score}/{PROMPTS.length}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>Great work! You have completed all A2 remedial tasks for Step 3.</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(3, 'A2'))} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
