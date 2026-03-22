import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

export default function Phase6SP2Step3Int1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'main' })
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    if (!response.trim()) return
    sessionStorage.setItem('phase6_sp2_step3_interaction1_score', '1')
    try { await phase6API.trackGame(3, 1, { completed: true, time_played: 60, engagement_score: 1 }, 2) } catch (e) { console.error('Track failed:', e) }
    setSubmitted(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" sx={{ color: P.blue.border }}>Step 3: Explain - Interaction 1</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>Ms. Mabrouki: "Watch this video about giving constructive feedback. Then explain: what is the 'positive sandwich' method and why is it useful?"</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Video: <a href="https://youtu.be/GdFBUmC3BAM" target="_blank" rel="noopener noreferrer" style={{ color: P.teal.border }}>https://youtu.be/GdFBUmC3BAM</a></Typography>
            <TextField fullWidth multiline rows={4} value={response} onChange={(e) => setResponse(e.target.value)} disabled={submitted} placeholder="Write your response here..." sx={{ mb: 2 }} />
            {!submitted ? (
              <Box component="button" onClick={handleSubmit} disabled={!response.trim()}
                sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: !response.trim() ? 'not-allowed' : 'pointer', opacity: !response.trim() ? 0.5 : 1, '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                Submit
              </Box>
            ) : (
              <Box>
                <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>Response submitted! Well done.</Alert>
                <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/3/interaction/2')}
                  sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                  Continue to Interaction 2
                </Box>
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
