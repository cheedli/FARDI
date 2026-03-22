import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const WEAKNESSES = [
  { weakness: 'Only successes reported', critique: 'Lacks credibility', fix: 'Include a balanced view', description: 'A report that only lists successes appears biased and untrustworthy to stakeholders.' },
  { weakness: 'No evidence provided', critique: 'Subjective and unverifiable', fix: 'Add data & quotes', description: 'Claims without supporting data or participant quotes cannot be verified or acted upon effectively.' },
  { weakness: 'Vague recommendations', critique: 'Unusable by decision-makers', fix: 'Make recommendations specific', description: '"Do better next time" provides no guidance. Specific steps (who, what, when) are essential.' },
  { weakness: 'Poor structure', critique: 'Difficult to read and navigate', fix: 'Use clear headings and sections', description: 'An unstructured report forces readers to search for information, reducing usability and impact.' },
  { weakness: 'Emotional or biased tone', critique: 'Unprofessional and unreliable', fix: 'Maintain an objective tone', description: 'Emotional language undermines credibility. Professional reports present facts analytically, not emotionally.' },
  { weakness: 'No future focus', critique: 'Wastes the learning opportunity', fix: 'End with forward-looking recommendations', description: 'A report without recommendations fails its primary purpose: to drive continuous improvement for future events.' }
]

export default function Phase6SP1Step3RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(WEAKNESSES.length).fill(''))
  const [fixes, setFixes] = useState(Array(WEAKNESSES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleCritiqueChange = (idx, val) => { const updated = [...critiques]; updated[idx] = val; setCritiques(updated) }
  const handleFixChange = (idx, val) => { const updated = [...fixes]; updated[idx] = val; setFixes(updated) }

  const handleSubmit = async () => {
    const critFilled = critiques.filter(c => c.trim().split(/\s+/).length >= 2).length
    const fixFilled = fixes.filter(f => f.trim().split(/\s+/).length >= 2).length
    const total = Math.round((critFilled + fixFilled) / 2)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_c1_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(3, 'C1', 'D', total, WEAKNESSES.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = critiques.every(c => c.trim().length > 0) && fixes.every(f => f.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task D: Critique Game</Typography>
            <Typography variant="body1" color="text.secondary">Critique 6 common report weaknesses and propose fixes</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="You are the expert reviewer! For each common report weakness, write a professional critique explaining why it is a problem, then propose a specific fix. Use sophisticated analytical language." />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3, p: 2 }}>
            <Typography variant="body2"><strong>Instructions:</strong> For each weakness: (1) Write a critique explaining WHY it is problematic, (2) Propose a specific FIX. After submitting, compare with the model answers.</Typography>
          </Box>
        </motion.div>
        <Stack spacing={3} sx={{ mb: 3 }}>
          {WEAKNESSES.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.05 }}>
              <Box sx={{ ...cardSx(submitted ? P.green : P.blue), p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ bgcolor: P.red.border, color: 'white', px: 1.5, py: 0.3, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>Weakness {idx + 1}</Box>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: P.red.border }}>{item.weakness}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Your critique (Why is this a problem?):</Typography>
                  <TextField fullWidth size="small" multiline rows={2} value={critiques[idx]} onChange={(e) => handleCritiqueChange(idx, e.target.value)} disabled={submitted} placeholder="Write your critique here..." sx={{ bgcolor: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Your fix (How to improve it?):</Typography>
                  <TextField fullWidth size="small" multiline rows={2} value={fixes[idx]} onChange={(e) => handleFixChange(idx, e.target.value)} disabled={submitted} placeholder="Propose your fix here..." sx={{ bgcolor: 'white' }} />
                </Box>
                {submitted && (
                  <Box sx={{ ...cardSx(P.green), mt: 2, p: 2 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.border, mb: 0.5 }}>Model Answer:</Typography>
                    <Typography variant="body2"><strong>Critique:</strong> {item.critique} — {item.description}</Typography>
                    <Typography variant="body2"><strong>Fix:</strong> {item.fix}</Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          ))}
        </Stack>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit My Critiques &amp; Fixes
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task D Complete! Score: {score}/{WEAKNESSES.length}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>Excellent! You have completed all C1 remedial tasks for Step 3.</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/1')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue to Next Phase →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
