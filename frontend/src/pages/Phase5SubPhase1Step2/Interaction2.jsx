import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const EXPECTED_EXAMPLES = {
  A2: 'Backup good because fix.',
  B1: 'Backup lights work because it is emergency and fast.',
  B2: 'Using backup lights is the best immediate solution because it ensures the event continues without major delay and maintains audience safety.',
  C1: 'Deploying the backup lighting system is the optimal crisis response because it minimizes downtime, preserves the event\'s integrity, and demonstrates proactive risk management, thereby reinforcing stakeholder confidence.'
}

export default function Phase5Step2Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 2, context: 'main' })
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please explain why you chose that solution.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateExplanation(explanation.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step2_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step2_interaction2_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const explanationLower = explanation.toLowerCase()
      const wordCount = explanation.split(/\s+/).length
      const hasBecause = explanationLower.includes('because')
      const hasBackup = explanationLower.includes('backup')
      let score = 2, level = 'A2'
      if (wordCount <= 5 && hasBackup) { score = 2; level = 'A2' }
      else if (wordCount <= 15 && hasBecause && hasBackup) { score = 3; level = 'B1' }
      else if (wordCount <= 30 && hasBecause && hasBackup) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your explanation shows ${level} level understanding.` })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step2_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step2_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/interaction/3')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 2: Explore - Interaction 2
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explain why you chose that solution
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="SKANDER"
              message="Why did you choose that solution? Explain one solution (e.g., backup lights) and why it works."
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: P.teal.border }}>
                Explain why backup lights (or your chosen solution) is a good solution for the lighting problem. Use "because" to give reasons.
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.yellow.border }}>
              Expected Response Examples (by level):
            </Typography>
            <Stack spacing={1}>
              {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{level}:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }} color="text.secondary">"{example}"</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Your Explanation
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Example: Backup lights work because it is emergency and fast..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Words: {explanation.split(/\s+/).filter(w => w.length > 0).length}
              </Typography>
            </Box>
            {!submitted && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !explanation.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: loading || !explanation.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  opacity: loading || !explanation.trim() ? 0.6 : 1,
                  '&:hover': !loading && explanation.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Explanation'}
              </Box>
            )}
          </Box>
        </motion.div>

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(evaluation.success ? P.green : P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.yellow.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.border : P.yellow.border }}>
                    {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">{evaluation.feedback}</Typography>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.green.border,
                  mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Interaction 3
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
