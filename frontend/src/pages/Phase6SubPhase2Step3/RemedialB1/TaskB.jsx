import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const PROMPTS = [
  { label: 'Feedback?', example: 'Feedback is comments from people about your work.' },
  { label: 'Positive?', example: 'Positive means saying good things about the report.' },
  { label: 'Suggestion?', example: 'A suggestion is an idea to make the work better.' },
  { label: 'Strength?', example: 'A strength is a good part of the report.' },
  { label: 'Weakness?', example: 'A weakness is a bad part that needs improving.' },
  { label: 'Improve?', example: 'To improve means to make something better.' },
  { label: 'Polite?', example: 'Polite feedback is kind and respectful.' },
  { label: 'Helpful?', example: 'Helpful feedback gives useful ideas.' }
]

export default function Phase6SP2Step3RemB1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/3/remedial/b1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 3).length
    const s = Math.round((filled / PROMPTS.length) * 8)
    setScore(s)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b1_taskb_score', s.toString())
    try { await phase6API.logRemedialActivity(3, 'B1', 'B', s, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const canSubmit = answers.every(a => a.trim().length > 0)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial B1 - Task B</Typography>
            <Typography>Writing Proposals: Define 8 Feedback Terms with Examples</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Write 8 sentences defining feedback terms with simple examples. Use complete sentences like "Feedback is..." or "A suggestion is..."</Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {PROMPTS.map((p, idx) => (
              <Box key={idx} sx={cardSx('teal')}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.teal.border, mb: 0.5 }}>{idx + 1}. {p.label}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>Example: {p.example}</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={answers[idx]}
                  onChange={(e) => { const a = [...answers]; a[idx] = e.target.value; setAnswers(a) }}
                  disabled={submitted}
                  placeholder="Write your definition here..."
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.teal.border } } }}
                />
              </Box>
            ))}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': canSubmit ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 2 }}>Task B Complete! Score: {score}/8</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b1/task/c')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task C
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
