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
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
}

const FAULTY_TEXTS = {
  A2: 'Pleese welcom gests. Furst chek tiket. Then guied.',
  B1: 'Pleese smyle and welcom gests. Furst chek tikets. Then guied to booth. Be cairful.',
  B2: 'Furst, pleese welcom guests warmly. Then chek tikets and guied them. Be cairful with que. Thankk you.',
  C1: 'Begin by ofering a warm welcom: Pleese greet inclusively. Next, veriffy entry polite. Guied clrearly if needed. Emphasise safty. Conclude with appreceation.'
}

export default function Phase5SubPhase2Step5Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 1, context: 'main' })
  const [faultyText, setFaultyText] = useState(FAULTY_TEXTS.B1)
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!correctedText.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateSpellingSubPhase2(faultyText, correctedText.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step5_interaction1_score', result.data.score || '1')
        sessionStorage.setItem('phase5_subphase2_step5_spelling_corrected', correctedText.trim())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/5/interaction/2')
  window.__remedialSkip = handleContinue

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
              SubPhase 2 Step 5: Evaluate - Interaction 1
            </Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Here are faulty volunteer instruction texts with mistakes. First, correct only spelling errors. Look for errors like 'pleese', 'thak you', 'furst', 'cairful', 'guied', 'welcom', 'que'."
            />
          </Box>

          {/* Input */}
          {!submitted && (
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Faulty Text (with spelling errors):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ mt: 1, fontFamily: 'monospace' }}>
                  {faultyText}
                </Typography>
              </Box>
              <TextField
                fullWidth multiline rows={6} variant="outlined"
                label="Corrected Text (fix spelling only)"
                placeholder="Please welcome guests. First check ticket. Then guide."
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !correctedText.trim()}
                sx={{
                  width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                  color: P.orange.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                  transition: 'all 0.15s ease'
                }}
              >
                {loading ? <CircularProgress size={20} /> : null}
                {loading ? 'Evaluating...' : 'Submit Spelling Corrections'}
              </Box>
            </Box>
          )}

          {/* Result */}
          {submitted && evaluation && (
            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.green.shadow }}>
                Score: {evaluation.score}/4 | Level: {evaluation.level}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Errors found: {evaluation.errors_found} | Corrections made: {evaluation.corrections_made} | Accuracy: {evaluation.accuracy}%
              </Typography>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease'
                }}
              >
                Continue to Interaction 2 (Grammar Correction)
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
