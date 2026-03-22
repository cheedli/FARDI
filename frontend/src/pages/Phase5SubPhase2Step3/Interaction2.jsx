import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

export default function Phase5SubPhase2Step3Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 2, context: 'main' })
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!explanation.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateSequencingExplanation(explanation.trim())
      if (result.success && result.data) {
        setEvaluation(result.data); setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step3_interaction2_score', result.data.score || '1')
      }
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border }}>SubPhase 2 Step 3: Explain - Interaction 2</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Lilia" message="Now watch these two real volunteer instruction examples (first a festival task card for greeters, then a spoken briefing script for queue managers). Listen for: sequencing words (first, then, next, after that), safety reminders, polite requests, clarity. After watching, explain why sequencing words (first, then, next) are important in instructions." />
          </Box>
        </motion.div>
        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <TextField fullWidth multiline rows={6} variant="outlined" placeholder="Sequencing words are important because..."
                value={explanation} onChange={(e) => setExplanation(e.target.value)} sx={{ mb: 2 }} />
              <Box component="button" onClick={handleSubmit} disabled={loading || !explanation.trim()}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', width: '100%', opacity: (loading || !explanation.trim()) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Explanation'}
              </Box>
            </Box>
          </motion.div>
        )}
        {submitted && evaluation && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3 }}>
              <Typography variant="h6" sx={{ color: P.green.border, mb: 1 }}>Score: {evaluation.score}/4 | Level: {evaluation.level}</Typography>
              <Box component="button" onClick={() => navigate('/phase5/subphase/2/step/3/interaction/3')}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s', width: '100%', mt: 2 }}>
                Continue to Interaction 3 →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
