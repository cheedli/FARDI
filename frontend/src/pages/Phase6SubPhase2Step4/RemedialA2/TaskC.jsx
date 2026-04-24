import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const PROMPTS = [
  { prompt: 'Say something good about the report.', example: 'Good work.' },
  { prompt: "Use the word 'positive'.", example: 'Positive nice.' },
  { prompt: 'Give a suggestion.', example: 'Suggestion add.' },
  { prompt: 'Name a strength.', example: 'Strength good.' },
  { prompt: 'Name a weakness.', example: 'Weakness small.' },
  { prompt: "Use the word 'improve'.", example: 'Improve better.' }
]

export default function Phase6SP2Step4RemA2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase2RemedialNextUrl(4, 'A2').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    let correct = 0
    answers.forEach((ans) => {
      const trimmed = ans.trim()
      if (trimmed.split(/\s+/).filter(w => w.length > 0).length >= 1) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'A2', 'C', correct, PROMPTS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial A2 - Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Sentence Builder: Write Simple Feedback Sentences</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Write a simple sentence for each prompt. Any response with at least 1 word is accepted.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Stack spacing={2}>
            {PROMPTS.map((item, idx) => {
              const isOk = submitted && answers[idx].trim().split(/\s+/).filter(w => w.length > 0).length >= 1
              const isWrong = submitted && !isOk
              return (
                <Box key={idx} sx={{ ...cardSx(isOk ? P.green : isWrong ? P.red : P.blue) }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {item.prompt}</Typography>
                  <TextField
                    fullWidth size="small" placeholder="Write your sentence here..."
                    value={answers[idx]}
                    onChange={(e) => { const updated = [...answers]; updated[idx] = e.target.value; setAnswers(updated) }}
                    disabled={submitted} multiline minRows={1}
                  />
                  {submitted && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Example answer: <em>{item.example}</em>
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>
        </motion.div>

        <Box sx={{ mt: 3 }}>
          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                width: '100%', bgcolor: P.orange.border, color: 'white',
                border: `2px solid ${P.orange.shadow}`, borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5,
                fontSize: '1rem', fontWeight: 'bold',
                cursor: !allAnswered ? 'not-allowed' : 'pointer',
                opacity: !allAnswered ? 0.6 : 1,
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                transition: 'all 0.15s',
              }}
            >
              Submit Sentences
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" sx={{ color: P.green.shadow }}>Task C Complete! Score: {score}/{PROMPTS.length}</Typography>
                <Box
                  component="button"
                  onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(4, 'A2'))}
                  sx={{
                    mt: 2, bgcolor: P.green.border, color: 'white',
                    border: `2px solid ${P.green.shadow}`, borderRadius: '14px',
                    boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4,
                    fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s',
                  }}
                >
                  Continue
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  )
}
