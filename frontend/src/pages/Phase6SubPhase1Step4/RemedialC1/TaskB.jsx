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
  { label: '1. Executive summary', placeholder: 'Introduce the report with a concise, formal overview (use "This report evaluates..." or "This document presents...")' },
  { label: '2. Key achievement with data', placeholder: 'State the primary success with precise evidence (percentage, rating, or figure)' },
  { label: '3. Secondary achievement with impact', placeholder: 'Describe another success and its measurable or qualitative impact on stakeholders' },
  { label: '4. Nuanced challenge analysis', placeholder: 'Analyse a challenge with balanced language — acknowledge it without being negative (use "whilst", "notwithstanding", "despite")' },
  { label: '5. Resolution & mitigation', placeholder: 'Explain how the challenge was addressed and what was learned from it' },
  { label: '6. Evidence-based stakeholder feedback', placeholder: 'Synthesise participant feedback using hedging language (e.g. "The majority of respondents indicated...")' },
  { label: '7. Strategic recommendation', placeholder: 'Make a forward-looking, actionable recommendation linked to a specific finding (use "In light of...", "It is therefore recommended...")' },
  { label: '8. Evaluative conclusion', placeholder: 'Close with a balanced overall evaluation that acknowledges both strengths and areas for growth' },
]

const MODEL_ANSWER = `This report presents a comprehensive evaluation of the International Cultural Exchange Forum held on 22 February, drawing on quantitative data and qualitative participant feedback. The event achieved a 94% satisfaction rating across all sessions, representing a 12-percentage-point improvement on the previous year's figure. The keynote address was particularly well-received, with 87% of attendees describing it as "highly relevant" to their professional development. Whilst the networking session experienced an initial logistical challenge due to inadequate signage, this was swiftly resolved through on-site coordination, thereby minimising disruption. The incident nonetheless underscored the importance of a comprehensive pre-event walkthrough, a practice that will be institutionalised in future planning cycles. Participant feedback, gathered via a structured post-event survey (n=142), revealed a strong consensus around the value of interdisciplinary dialogue, though several respondents highlighted the need for extended Q&A time. In light of this finding, it is recommended that future forums allocate a minimum of 20 minutes per session for structured audience interaction. Overall, the event successfully fulfilled its core objectives and demonstrated the organisation's capacity to deliver high-quality, impactful programming.`

export default function Phase6SP1Step4RemC1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/4/remedial/c1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 10).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'B', filled, PROMPTS.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Analysis Odyssey</Typography>
            <Typography variant="body1" color="text.secondary">Write a sophisticated 8-sentence C1-level post-event report</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">
              Write one sophisticated sentence per section (minimum 10 words each). Use C1-level vocabulary: <strong>evidence-based, stakeholder, accountability, nuanced, objectivity, credibility</strong>. Aim for formal, analytical language throughout.
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
                {score >= 6 ? 'Excellent C1-level writing!' : 'Good effort! Compare your sentences with the model answer below.'}
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
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.green.border, mb: 1 }}>C1 Model Answer:</Typography>
                  <Typography variant="body2">{MODEL_ANSWER}</Typography>
                </Box>
              )}
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/c1/task/c')}
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
