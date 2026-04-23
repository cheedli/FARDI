import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#422006', border: '#FACC15', shadow: '#854D0E' },
}

const WEAKNESSES = [
  {
    extract: '"The event was very successful and everyone was happy with it."',
    weakness: 'Vague & subjective — no evidence, no measurable outcome',
    fix: '"The event achieved a 91% participant satisfaction rate, as recorded in post-event surveys (n=158)."',
    critiqueChip: 'No evidence',
    fixChip: 'Add quantitative data'
  },
  {
    extract: '"We had some problems but we fixed them quickly."',
    weakness: 'Informal register; lacks specificity about the challenge and resolution',
    fix: '"A technical malfunction in the audio system was identified during the opening session and resolved within 15 minutes by the on-site technical team."',
    critiqueChip: 'Informal + vague',
    fixChip: 'Specify challenge & resolution'
  },
  {
    extract: '"It is recommended that we do better next time."',
    weakness: 'Recommendation not linked to a specific finding; not actionable',
    fix: '"In light of the low engagement scores recorded in the afternoon sessions, it is recommended that future events incorporate interactive workshops in place of extended lecture formats."',
    critiqueChip: 'Not evidence-based',
    fixChip: 'Link to finding & specify action'
  },
  {
    extract: '"The speakers were good and talked about interesting things."',
    weakness: 'Adjectives ("good", "interesting") are subjective and imprecise at C1 level',
    fix: '"The invited speakers delivered sessions that were rated as highly relevant by 84% of attendees, with particular commendation given to the panel discussion on sustainable event management."',
    critiqueChip: 'Subjective adjectives',
    fixChip: 'Use specific, evidence-backed praise'
  },
  {
    extract: '"Overall, the event was a big success and we will do it again."',
    weakness: 'Conclusion lacks evaluative balance — no acknowledgement of areas for growth',
    fix: '"Overall, the event substantially met its stated objectives; however, the challenges identified in time management and catering logistics present clear opportunities for improvement in future iterations."',
    critiqueChip: 'No balance',
    fixChip: 'Acknowledge growth areas'
  },
]

export default function Phase6SP1Step4RemC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(WEAKNESSES.length).fill(''))
  const [revealed, setRevealed] = useState(Array(WEAKNESSES.length).fill(false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleReveal = (idx) => {
    const updated = [...revealed]; updated[idx] = true; setRevealed(updated)
  }

  const handleSubmit = async () => {
    const filled = critiques.filter(c => c.trim().split(/\s+/).length >= 5).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taskd_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'D', filled, WEAKNESSES.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = critiques.every(c => c.trim().length > 0)

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
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task D: Critique Kahoot</Typography>
            <Typography variant="body1" color="text.secondary">Identify weaknesses and suggest C1-level fixes for flawed report extracts</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">
              Read each flawed report extract. Write your own critique (at least 5 words explaining what is wrong), then reveal the expert feedback and model fix to compare.
            </Typography>
          </Box>
        </motion.div>

        <Stack spacing={3} sx={{ mb: 3 }}>
          {WEAKNESSES.map((w, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
              <Box sx={{ ...cardSx(P.orange) }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Extract {idx + 1}</Typography>

                {/* Flawed extract */}
                <Box sx={{ p: 1.5, mb: 1.5, bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px' }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: P.red.border }}>{w.extract}</Typography>
                </Box>

                {/* Hints */}
                <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: P.red.border, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Problem: {w.critiqueChip}</Typography>
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: P.green.border, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Fix: {w.fixChip}</Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Your critique:</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={critiques[idx]}
                  onChange={(e) => {
                    const updated = [...critiques]; updated[idx] = e.target.value; setCritiques(updated)
                  }}
                  disabled={submitted}
                  placeholder="Explain what is wrong with this extract..."
                  sx={{ mb: 1.5 }}
                />

                {!revealed[idx] ? (
                  <Box
                    component="button"
                    onClick={() => handleReveal(idx)}
                    sx={{
                      px: 3, py: 0.75,
                      bgcolor: P.teal.bg,
                      border: `2px solid ${P.teal.border}`,
                      borderRadius: '12px',
                      boxShadow: `2px 2px 0 ${P.teal.shadow}`,
                      cursor: 'pointer',
                      fontWeight: 'bold', fontSize: '0.85rem',
                      color: P.teal.border,
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `4px 4px 0 ${P.teal.shadow}` },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Reveal Expert Feedback
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    <Box sx={{ p: 1.5, bgcolor: P.red.bg, borderRadius: '12px', border: `1px solid ${P.red.border}` }}>
                      <Typography variant="body2" sx={{ color: P.red.border, fontWeight: 'bold' }}>Weakness: {w.weakness}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: P.green.bg, borderRadius: '12px', border: `1px solid ${P.green.border}` }}>
                      <Typography variant="body2" sx={{ color: P.green.border, fontWeight: 'bold' }}>
                        Model fix: {w.fix}
                      </Typography>
                    </Box>
                  </Stack>
                )}
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
            Submit Critiques
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task D Complete! Score: {score}/{WEAKNESSES.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {score >= 4 ? 'Excellent critical analysis at C1 level!' : 'Good effort! Review the expert feedback and model fixes above.'}
              </Typography>
              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(4, 'C1'))}
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
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
