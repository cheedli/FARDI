import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level C1 - Task D
 * Critique Game: "Critique Kahoot" — Critique/fix 6 advanced report weaknesses
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

const WEAKNESSES = [
  { id: 1, label: 'Overly positive', example: '"The festival was amazing in every way. Everything was perfect and everyone loved it."', critique: 'Lacks credibility', fix: 'Balanced evaluation', explanation: 'Overly positive reports lose credibility. Readers expect honest assessment of both successes and challenges. Balanced evaluation builds trust and demonstrates intellectual honesty.' },
  { id: 2, label: 'No evidence', example: '"Many people came and they were satisfied."', critique: 'Subjective', fix: 'Add data/quotes', explanation: 'Without evidence (numbers, quotes, surveys), claims are subjective. Add: "Over 200 participants attended and 87% rated satisfaction as excellent (post-event survey)."' },
  { id: 3, label: 'Vague recommendations', example: '"We should do better next time."', critique: 'Unusable', fix: 'Make actionable', explanation: 'Vague recommendations cannot be implemented. Make them specific: "It is recommended that future events implement 15-minute transition buffers between all scheduled activities."' },
  { id: 4, label: 'Informal tone', example: '"The show was super cool and the food was yummy!"', critique: 'Unprofessional', fix: 'Use formal language', explanation: 'Informal language ("super cool", "yummy") is inappropriate for professional reports. Use formal alternatives: "The performances were well-received" and "The catering was highly regarded."' },
  { id: 5, label: 'Poor cohesion', example: '"The festival succeeded. Problems occurred. Feedback received. Improvements needed."', critique: 'Hard to follow', fix: 'Add connectors', explanation: 'Reports without connectors are choppy and hard to follow. Use logical connectors: "The festival achieved notable success; however, several logistical challenges were encountered. In addition, participant feedback highlighted areas for improvement."' },
  { id: 6, label: 'No stakeholder focus', example: '"We all worked very hard and are proud of what we did."', critique: 'Misses purpose', fix: 'Address audience needs', explanation: 'Reports must serve the needs of stakeholders (sponsors, administrators, future planners). Address what they need to know: outcomes achieved, value delivered, and what will improve next time.' }
]

export default function Phase6SP1Step5RemC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [revealed, setRevealed] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleReveal = (id) => setRevealed({ ...revealed, [id]: true })

  const handleSubmit = async () => {
    let correct = 0
    WEAKNESSES.forEach(w => { if ((critiques[w.id] || '').trim().split(/\s+/).filter(Boolean).length >= 5) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taskd_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'D', correct, WEAKNESSES.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAttempted = WEAKNESSES.every(w => (critiques[w.id] || '').trim().length > 0)

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
            <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border, mb: 1 }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Step 5: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Task D: Critique Kahoot</Typography>
            <Typography>Critique and fix 6 advanced weaknesses in report writing</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Critique Kahoot! For each report weakness below, write your critique explaining WHY it's a problem and HOW to fix it. Then reveal the expert feedback to compare. Use sophisticated C1 language in your critiques!"
            />
          </Box>

          <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
            <Typography variant="body2"><strong>Instructions:</strong> For each weakness: (1) Read the example text, (2) Write your own critique (minimum 5 words), (3) Click "Reveal" to see the expert feedback. Your score is based on the quality of your own critique attempt.</Typography>
          </Box>

          <Stack spacing={3} sx={{ mb: 3 }}>
            {WEAKNESSES.map((w) => (
              <Box key={w.id} sx={cardSx('teal')}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{w.id}. {w.label}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ px: 1.5, py: 0.3, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: P.red.border }}>Critique: {w.critique}</Box>
                    <Box sx={{ px: 1.5, py: 0.3, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: P.green.border }}>Fix: {w.fix}</Box>
                  </Box>
                </Box>

                <Box sx={{ p: 2, mb: 2, bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px' }}>
                  <Typography variant="caption" sx={{ color: P.red.border, fontWeight: 700, display: 'block', mb: 0.5 }}>Weak Report Example:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{w.example}</Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Your Critique:</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={critiques[w.id] || ''}
                  onChange={(e) => setCritiques({ ...critiques, [w.id]: e.target.value })}
                  disabled={submitted}
                  placeholder="Explain why this is a weakness and how to fix it..."
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.teal.border } } }}
                />

                {!revealed[w.id] && !submitted ? (
                  <Box
                    component="button"
                    onClick={() => handleReveal(w.id)}
                    sx={{ ...cardSx('purple'), p: 1.5, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` } }}
                  >
                    Reveal Expert Feedback
                  </Box>
                ) : (
                  <Box sx={{ p: 2, bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>Expert Feedback:</Typography>
                    <Typography variant="body2">{w.explanation}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAttempted}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: allAttempted ? 'pointer' : 'not-allowed', opacity: allAttempted ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': allAttempted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit All Critiques
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700 }}>Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{WEAKNESSES.length} substantial critiques</Typography>
              <Typography sx={{ mt: 1 }}>
                {score >= 5 ? 'Outstanding! You have deep analytical understanding of professional report quality.' : score >= 4 ? 'Excellent! Strong critical analysis skills.' : 'Good effort! Compare your critiques with the expert feedback above.'}
              </Typography>
              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(5, 'C1'))}
                sx={{ ...cardSx('blue'), mt: 2, cursor: 'pointer', fontWeight: 700, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue →
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
