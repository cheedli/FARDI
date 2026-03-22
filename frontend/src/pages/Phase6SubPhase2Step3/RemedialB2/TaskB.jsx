import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 2 Step 3 — Level B2 — Task B
 * Analysis Odyssey: Write an 8-sentence positive sandwich peer feedback using B2 vocabulary
 */

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
  { label: '1. Positive opening', placeholder: 'Start with a genuine, specific strength (e.g. "Your report demonstrates a strong command of...")' },
  { label: '2. Strength with evidence', placeholder: 'Identify a second strength and support it with a specific example from their work' },
  { label: '3. Transition to improvement', placeholder: 'Use a smooth bridge phrase (e.g. "To further strengthen...", "One area that could be developed...")' },
  { label: '4. Constructive suggestion 1', placeholder: 'Give a specific, actionable suggestion — explain what to change and why' },
  { label: '5. Constructive suggestion 2', placeholder: 'Offer a second suggestion with a clear rationale' },
  { label: '6. Empathetic acknowledgement', placeholder: 'Show understanding of the writer\'s effort or context (e.g. "I recognise that...")' },
  { label: '7. Encouraging close', placeholder: 'Return to a positive note — highlight their potential or progress' },
  { label: '8. Forward-looking statement', placeholder: 'End with encouragement about future improvement (e.g. "I look forward to seeing...")' },
]

const MODEL_ANSWER = `Your report demonstrates a commendable level of detail and a clear commitment to honest self-reflection. In particular, the Challenges section is well-structured and offers a balanced account of the difficulties encountered during the event. To further strengthen the report, you might consider expanding the Recommendations section with more specific, measurable targets. For instance, rather than suggesting "better time management", you could specify "allocating an additional 15 minutes to each session". Additionally, the Successes section would benefit from the inclusion of participant data or survey results to support your claims. I recognise that gathering and incorporating such data takes considerable time and effort, especially under tight deadlines. Nevertheless, your analytical approach and commitment to improvement are clearly evident throughout the report. I look forward to seeing how you develop these skills in the next draft.`

export default function Phase6SP2Step3RemB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 8).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'B', filled, PROMPTS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a.trim().length > 0)

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
            <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Phase 6: Peer Feedback Discussion</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Step 3: Remedial Practice — Level B2</Typography>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Task B: Analysis Odyssey</Typography>
            <Typography>Write 8-sentence positive sandwich peer feedback at B2 level</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Write one sentence per section following the <strong>positive sandwich</strong> structure: open positive → constructive suggestions → close positive. Each sentence should be at least 8 words. Use B2 vocabulary: <strong>constructive, specific, balanced, suggest, improve, strengthen</strong>.</Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {PROMPTS.map((p, idx) => (
              <Box key={idx} sx={{ ...cardSx('teal'), borderLeft: `4px solid ${P.purple.border}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.purple.border, mb: 0.5 }}>{p.label}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>{p.placeholder}</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={answers[idx]}
                  onChange={(e) => { const updated = [...answers]; updated[idx] = e.target.value; setAnswers(updated) }}
                  disabled={submitted}
                  placeholder="Write your sentence here..."
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.purple.border } } }}
                />
              </Box>
            ))}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allFilled}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: allFilled ? 'pointer' : 'not-allowed', opacity: allFilled ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit Feedback
            </Box>
          ) : (
            <Box sx={{ ...cardSx('purple'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border, fontWeight: 700 }}>Task B Complete! Score: {score}/{PROMPTS.length}</Typography>
              <Typography sx={{ mt: 1, mb: 2 }}>{score >= 6 ? 'Excellent B2-level peer feedback!' : 'Good effort! Compare your sentences with the model answer below.'}</Typography>
              {!showModel ? (
                <Box
                  component="button"
                  onClick={() => setShowModel(true)}
                  sx={{ ...cardSx('teal'), cursor: 'pointer', fontWeight: 600, mb: 2, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } }}
                >
                  Show Model Answer
                </Box>
              ) : (
                <Box sx={{ p: 2, mb: 2, bgcolor: P.teal.bg, border: `1px solid ${P.teal.border}`, borderRadius: '12px', textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Model Answer:</Typography>
                  <Typography variant="body2">{MODEL_ANSWER}</Typography>
                </Box>
              )}
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b2/task/c')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task C →
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
