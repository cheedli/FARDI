import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Alert, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

const PROMPTS = [
  { label: '1. Positive opening', example: 'Your report is well-organized.' },
  { label: '2. Strength 1', example: 'Strengths are clear successes.' },
  { label: '3. Strength 2', example: 'Good use of past tense.' },
  { label: '4. Weakness 1', example: 'Weakness is few recommendations.' },
  { label: '5. Suggestion', example: 'Suggestion: add more specific ideas.' },
  { label: '6. Overall', example: 'Overall very good.' },
  { label: '7. Encourage', example: 'You can improve formality.' },
  { label: '8. Closing', example: 'Thank you for sharing.' },
]

export default function Phase6SP2Step1RemB2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/1/remedial/b2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 4).length
    const s = Math.round((filled / PROMPTS.length) * 8)
    setScore(s)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_b2_taskb_score', s.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'B', s, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const canSubmit = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial B2 — Task B</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Writing: 8-Sentence Peer Feedback Paragraph</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            Write 8 sentences of balanced, polite peer feedback using the positive sandwich technique (positive → suggestion → positive). Each prompt guides one sentence.
          </Alert>

          <Stack spacing={2}>
            {PROMPTS.map((p, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04 }}>
                <Box sx={{ ...cardSx(P.blue) }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: P.blue.border }}>{p.label}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Example: <em>{p.example}</em></Typography>
                  <TextField
                    fullWidth multiline rows={2}
                    value={answers[idx]}
                    onChange={(e) => { const a = [...answers]; a[idx] = e.target.value; setAnswers(a) }}
                    disabled={submitted}
                    placeholder="Write your sentence here..."
                  />
                </Box>
              </motion.div>
            ))}
          </Stack>

          {!submitted ? (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                sx={{
                  px: 5, py: 1.5, borderRadius: '16px',
                  border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%',
                  cursor: !canSubmit ? 'not-allowed' : 'pointer', opacity: !canSubmit ? 0.5 : 1,
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s',
                }}
              >Submit</Box>
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center', mt: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task B Complete! Score: {score}/8</Typography>
                <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                  {score >= 6 ? 'Excellent balanced feedback!' : 'Good effort! Try to use more specific language.'}
                </Typography>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/2/step/1/remedial/b2/task/c')}
                  sx={{
                    mt: 2, px: 5, py: 1.5, borderRadius: '16px',
                    border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s',
                  }}
                >Continue to Task C</Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
