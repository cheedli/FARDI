import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const QUEUE_TEMPLATE = `Step 1 (Preparation): Get ready.
Example: First, position yourself at the queue area and smile.

Step 2 (Welcome & Explain): Welcome and inform.
Example: Welcome guests and explain: "Please wait here - the line moves quickly."

Step 3 (Manage Flow): Keep order.
Example: Then, guide people to stay in line and move forward when space opens.

Step 4 (Safety): Safety first.
Example: Be careful: remind guests to keep pathways clear and watch for children.`

export default function Phase5SubPhase2Step4Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 2, context: 'main' })
  const [instructions, setInstructions] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!instructions.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateQueueManagerInstructions(instructions.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step4_interaction2_score', result.data.score || '1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/4/interaction/3')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              SubPhase 2 Step 4: Elaborate - Interaction 2
            </Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Emna" message="Now, write instructions for a queue manager volunteer using this guided template with examples." />
          </Box>

          {/* Template */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: P.orange.shadow }}>
              {QUEUE_TEMPLATE}
            </Typography>
          </Box>

          {/* Input */}
          {!submitted && (
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <TextField
                fullWidth multiline rows={10} variant="outlined"
                placeholder="Write 5-10 bullet-point instructions for managing queues..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !instructions.trim()}
                sx={{
                  width: '100%', bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                  py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                  color: P.blue.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                  transition: 'all 0.15s ease'
                }}
              >
                {loading ? <CircularProgress size={20} /> : null}
                {loading ? 'Evaluating...' : 'Submit Instructions'}
              </Box>
            </Box>
          )}

          {/* Result */}
          {submitted && evaluation && (
            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.green.shadow }}>
                Score: {evaluation.score}/4 | Level: {evaluation.level}
              </Typography>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5, mt: 2, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease'
                }}
              >
                Continue to Interaction 3
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
