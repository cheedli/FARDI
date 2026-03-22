import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const PROMPTS = [
  { label: '1. Introduction', placeholder: 'State the purpose and date of the event (e.g. "This report summarises the outcomes of...")' },
  { label: '2. Main success', placeholder: 'Describe the biggest success with a specific detail or number (e.g. attendance figure)' },
  { label: '3. Second success', placeholder: 'Describe another achievement and its positive impact on participants' },
  { label: '4. Challenge faced', placeholder: 'Describe one challenge using formal language (e.g. "A key challenge was...")' },
  { label: '5. How it was addressed', placeholder: 'Explain how the challenge was resolved or managed during the event' },
  { label: '6. Participant feedback', placeholder: 'Summarise participant reactions using evidence (e.g. survey results, quotes)' },
  { label: '7. Recommendation', placeholder: 'Make one specific, actionable recommendation for future events' },
  { label: '8. Conclusion', placeholder: 'Close with an overall evaluation of the event\'s success' }
]

const MODEL_ANSWER = `This report summarises the outcomes of the annual cultural festival held on 15 March. The event was a significant success, with attendance exceeding the target by 25%, reflecting strong community interest. The live performances received widespread acclaim, with 90% of participants rating them as "excellent" in post-event surveys. A key challenge was the inadequate sound system in the outdoor area, which disrupted two early sessions. The technical team responded promptly and resolved the issue within 30 minutes, minimising further disruption. Participant feedback was largely positive, with an average satisfaction score of 4.2 out of 5 across all sessions. It is recommended that future events conduct a thorough technical rehearsal at least 48 hours in advance. Overall, the festival achieved its core objectives and provided a valuable experience for all stakeholders.`

export default function Phase6SP1Step4RemB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 8).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'B', filled, PROMPTS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a.trim().length > 0)

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
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Analysis Odyssey</Typography>
            <Typography variant="body1" color="text.secondary">Write an 8-sentence post-event report with specific details</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">
              Write one sentence for each section of the report. Each sentence should be at least 8 words, use formal vocabulary, and include specific details where guided.
            </Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {PROMPTS.map((p, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.04 }}>
              <Box sx={{ ...cardSx(P.orange) }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.orange.border, mb: 0.5 }}>{p.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>{p.placeholder}</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={answers[idx]}
                  onChange={(e) => {
                    const updated = [...answers]; updated[idx] = e.target.value; setAnswers(updated)
                  }}
                  disabled={submitted}
                  placeholder="Write your sentence here..."
                />
              </Box>
            </motion.div>
          ))}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              opacity: !allFilled ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit Report
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task B Complete! Score: {score}/{PROMPTS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {score >= 6 ? 'Excellent! Your report shows strong B2-level writing.' : 'Good effort! Compare your sentences with the model answer below.'}
              </Typography>
              {!showModel ? (
                <Box
                  component="button"
                  onClick={() => setShowModel(true)}
                  sx={{
                    px: 4, py: 1, mb: 2,
                    bgcolor: P.teal.bg,
                    border: `2px solid ${P.teal.border}`,
                    borderRadius: '12px',
                    boxShadow: `2px 2px 0 ${P.teal.shadow}`,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: P.teal.border,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `4px 4px 0 ${P.teal.shadow}` },
                    transition: 'all 0.15s ease',
                  }}
                >
                  Show Model Answer
                </Box>
              ) : (
                <Box sx={{ p: 2, mb: 2, bgcolor: P.pageBg, border: `1px solid ${P.green.border}`, borderRadius: '12px', textAlign: 'left' }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.green.border, mb: 1 }}>Model Answer:</Typography>
                  <Typography variant="body2">{MODEL_ANSWER}</Typography>
                </Box>
              )}
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/c')}
                sx={{
                  px: 6, py: 1.5,
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
                Continue to Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
