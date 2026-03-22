import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
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

const GAPS = [
  { id: 'ans1', answer: 'positive',    options: ['positive', 'negative', 'feedback'] },
  { id: 'ans2', answer: 'suggestion',  options: ['suggestion', 'problem', 'mistake'] },
  { id: 'ans3', answer: 'improve',     options: ['improve', 'fail', 'ignore'] },
]

export default function Phase6SP2Step3RemB1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_b1' })
  const [selections, setSelections] = useState({ ans1: '', ans2: '', ans3: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (id, value) => setSelections(prev => ({ ...prev, [id]: value }))
  const allFilled = Object.values(selections).every(v => v !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = GAPS.filter(g => selections[g.id] === g.answer).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const GapSelect = ({ id, label }) => {
    const gap = GAPS.find(g => g.id === id)
    const isCorrect = submitted && selections[id] === gap.answer
    const isWrong = submitted && selections[id] !== gap.answer
    return (
      <FormControl size="small" sx={{ minWidth: 140, display: 'inline-flex', verticalAlign: 'middle', mx: 0.5 }}>
        <Select
          value={selections[id]}
          label={label}
          onChange={e => handleChange(id, e.target.value)}
          disabled={submitted}
          sx={{ bgcolor: submitted ? (isCorrect ? P.green.bg : P.red.bg) : 'transparent' }}
        >
          {gap.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </Select>
        {isWrong && (
          <Typography variant="caption" sx={{ color: P.red.border, mt: 0.5 }}>
            Correct: <strong>{gap.answer}</strong>
          </Typography>
        )}
      </FormControl>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial B1 — Task A</Typography>
            <Typography>Negotiation Gap Fill: Explaining Feedback Terms</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Complete the dialogue by selecting the correct word for each gap.</Typography>
          </Box>

          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            {/* Line 1 — Lilia */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.purple.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>Lilia</Box>
              <Typography sx={{ fontStyle: 'italic' }}>"Why positive first?"</Typography>
            </Box>

            {/* Line 2 — You */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.blue.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>You</Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
                <GapSelect id="ans1" label="Gap 1" />
                <Typography component="span">&nbsp;makes feel good."</Typography>
              </Box>
            </Box>

            {/* Line 3 — Ryan */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.purple.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>Ryan</Box>
              <Typography sx={{ fontStyle: 'italic' }}>"Suggestion?"</Typography>
            </Box>

            {/* Line 4 — You */}
            <Box sx={{ p: 1.5, bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.blue.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>You</Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
                <GapSelect id="ans2" label="Gap 2" />
                <Typography component="span">&nbsp;tells how&nbsp;</Typography>
                <GapSelect id="ans3" label="Gap 3" />
                <Typography component="span">."</Typography>
              </Box>
            </Box>
          </Box>

          {submitted && (
            <Box sx={{ ...cardSx(score === 3 ? 'green' : score >= 2 ? 'yellow' : 'red'), mb: 3 }}>
              <Typography>
                {score === 3 ? 'Perfect! All 3 gaps correct. You understand the key feedback terms.' : `You got ${score}/3 correct. Remember: positive makes feel good; suggestion tells how to improve.`}
              </Typography>
            </Box>
          )}

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
              Submit Answers
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 1 }}>Task A Complete! Score: {score}/3</Typography>
              <Typography sx={{ mb: 2 }}>
                {score === 3 ? 'Excellent — you have mastered the feedback negotiation vocabulary!' : 'Good effort! Key terms: positive → makes feel good; suggestion → tells how to improve.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b1/task/b')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task B
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
