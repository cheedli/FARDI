import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Stack,
  Divider,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 - Interaction 1
 * Write an Executive Summary using a guided template
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const TEMPLATE_SECTIONS = [
  {
    line: 1,
    label: 'Opening Statement',
    template: 'The [event name] was held on [date] at [location].',
    hint: 'Introduce the event with basic factual information.'
  },
  {
    line: 2,
    label: 'Objectives',
    template: 'The event [achieved/aimed to]...',
    hint: 'Describe what the event was intended to accomplish.'
  },
  {
    line: 3,
    label: 'Successes',
    template: 'Key successes included...',
    hint: 'Briefly mention the main positive outcomes.'
  },
  {
    line: 4,
    label: 'Challenges',
    template: 'Main challenges were...',
    hint: 'Note the significant difficulties encountered.'
  },
  {
    line: 5,
    label: 'Overall Conclusion',
    template: 'Overall, the event was [successful/partially successful/unsuccessful] because...',
    hint: 'Give your overall assessment with a reason.'
  }
]

export default function Phase6SP1Step4Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'main' })
  const [summary, setSummary] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const wordCount = summary.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const trimmed = summary.trim()
    if (!trimmed) {
      setResult({ success: false, feedback: 'Please write your Executive Summary before submitting.' })
      return
    }

    const score = trimmed.length > 0 && wordCount >= 30 ? 1 : 0
    sessionStorage.setItem('phase6_sp1_step4_interaction1_score', score.toString())

    try {
      await phase6API.trackGame(4, 1, { completed: true, time_played: 60, engagement_score: 1 }, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }

    setResult({
      success: true,
      score,
      feedback: score === 1
        ? 'Well done! Your Executive Summary meets the minimum length requirement. Good use of the template structure.'
        : 'Your summary is quite short. Try to write at least 30 words to cover all template sections.',
      wordCount
    })
    setSubmitted(true)
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/4/interaction/2')
  }

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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection & Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 4: Elaborate - Interaction 1
            </Typography>
            <Typography variant="body1" color="text.secondary">Write an Executive Summary</Typography>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{
                width: 50, height: 50, borderRadius: '50%',
                bgcolor: P.teal.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0
              }}>MM</Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Ms. Mabrouki</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "Now we write real parts of the post-event report! Write the 'Executive Summary' section
                  using this guided template with examples. Use examples as models — change words, add festival details,
                  keep formal and objective. Self-check grammar, spelling, formality, balance, and clarity before submitting."
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Template Guide */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>
              Executive Summary Template
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {TEMPLATE_SECTIONS.map((section, idx) => (
                <Box key={section.line}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box sx={{
                      px: 1, py: 0.25,
                      bgcolor: P.orange.border,
                      borderRadius: '8px',
                      color: 'white', fontWeight: 'bold', fontSize: '0.8rem', minWidth: 24, textAlign: 'center'
                    }}>
                      {section.line}
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.orange.border }}>
                      {section.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      ml: 4, p: 1,
                      bgcolor: P.pageBg,
                      border: `1px dashed ${P.orange.border}`,
                      borderRadius: '8px',
                      fontStyle: 'italic',
                    }}
                  >
                    {section.template}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                    {section.hint}
                  </Typography>
                  {idx < TEMPLATE_SECTIONS.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Writing Area */}
        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>
                Your Executive Summary
              </Typography>
              <Box sx={{
                display: 'flex', alignItems: 'flex-start', gap: 1,
                bgcolor: P.teal.bg,
                border: `2px solid ${P.teal.border}`,
                borderRadius: '12px',
                p: 2, mb: 2
              }}>
                <InfoIcon sx={{ color: P.teal.border, mt: 0.25 }} />
                <Typography variant="body2">
                  Write at least 30 words. Cover all 5 template sections. Use past tense and formal language.
                  The Global Cultures Festival was held on [insert date] — use details from your knowledge of the event.
                </Typography>
              </Box>

              <TextField
                fullWidth multiline rows={8} variant="outlined"
                placeholder="Write your Executive Summary here. Follow the template structure above and use your own words..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ color: wordCount >= 30 ? P.green.border : 'text.secondary' }}>
                  Word count: {wordCount} {wordCount >= 30 ? '(minimum met)' : '(minimum: 30 words)'}
                </Typography>
              </Box>

              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!summary.trim()}
                sx={{
                  width: '100%', py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: summary.trim() ? 'pointer' : 'not-allowed',
                  opacity: summary.trim() ? 1 : 0.5,
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': summary.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                Submit Executive Summary
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Result */}
        {result && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(result.success ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: result.success ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: result.success ? P.green.border : P.orange.border }}>
                    Executive Summary {result.success ? 'Submitted!' : 'Needs More Work'}
                  </Typography>
                  {result.score !== undefined && (
                    <Typography variant="body2" color="text.secondary">
                      Score: +{result.score} point | Words: {result.wordCount}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>{result.feedback}</Typography>

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%', py: 1.5,
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
                Continue to Interaction 2
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
