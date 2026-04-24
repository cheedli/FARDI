import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Stack,
  Select, MenuItem, FormControl
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const WORD_BANK = ['objectivity', 'credibility', 'stakeholder', 'evidence-based', 'nuanced', 'accountability']

export default function Phase6SP1Step4RemC1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/4/remedial/c1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'remedial_c1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [ans4, setAns4] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'evidence-based') correct++
    if (ans2 === 'credibility') correct++
    if (ans3 === 'stakeholder') correct++
    if (ans4 === 'accountability') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'A', correct, 4, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = ans1 && ans2 && ans3 && ans4

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const gap = (value, setter, options) => (
    <FormControl size="small" sx={{ minWidth: 160, mx: 0.5 }}>
      <Select value={value} onChange={(e) => setter(e.target.value)} disabled={submitted} displayEmpty>
        <MenuItem value=""><em>choose...</em></MenuItem>
        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  )

  const ex1Correct = ans1 === 'evidence-based' && ans2 === 'credibility'
  const ex2Correct = ans3 === 'stakeholder' && ans4 === 'accountability'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Debate Simulation</Typography>
            <Typography variant="body1" color="text.secondary">Defend your report-writing decisions using sophisticated vocabulary</Typography>
          </Box>
        </motion.div>

        {/* Word Bank */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: P.purple.border }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {WORD_BANK.map(w => (
                <Box key={w} sx={{ px: 1.5, py: 0.5, mb: 1, bgcolor: P.purple.border, borderRadius: '10px' }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">A critic is questioning your report choices. Complete your responses using the correct C1-level word from the word bank.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Exchange 1 - Critic */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.red) }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.red.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Critic</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "Your Successes section sounds too positive. Why should readers trust it?"
              </Typography>
            </Box>
          </motion.div>

          {/* Exchange 1 - You */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ ...cardSx(submitted ? (ex1Correct ? P.green : P.red) : P.purple) }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.purple.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>You</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body1">The section is</Typography>
                {gap(ans1, setAns1, ['nuanced', 'evidence-based', 'objectivity'])}
                <Typography variant="body1">, drawing on survey data and attendance figures to ensure</Typography>
                {gap(ans2, setAns2, ['stakeholder', 'credibility', 'accountability'])}
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && !ex1Correct && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Correct: <strong>evidence-based</strong> ... <strong>credibility</strong>
                </Typography>
              )}
            </Box>
          </motion.div>

          {/* Exchange 2 - Critic */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Box sx={{ ...cardSx(P.red) }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.red.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Critic</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "Who is this report actually for, and why does that matter for how you write it?"
              </Typography>
            </Box>
          </motion.div>

          {/* Exchange 2 - You */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Box sx={{ ...cardSx(submitted ? (ex2Correct ? P.green : P.red) : P.purple) }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.purple.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>You</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body1">This is a</Typography>
                {gap(ans3, setAns3, ['stakeholder', 'nuanced', 'objectivity'])}
                <Typography variant="body1">report, so the language must promote transparency and</Typography>
                {gap(ans4, setAns4, ['credibility', 'accountability', 'evidence-based'])}
                <Typography variant="body1">by clearly linking outcomes to stated objectives.</Typography>
              </Box>
              {submitted && !ex2Correct && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Correct: <strong>stakeholder</strong> ... <strong>accountability</strong>
                </Typography>
              )}
            </Box>
          </motion.div>
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
            Submit
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border }} gutterBottom>
                Task A Complete! Score: {score}/4
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {score === 4 ? 'Perfect! You can defend report choices with C1-level precision.' : 'Good effort! Review the correct answers above.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/c1/task/b')}
                sx={{
                  px: 6, py: 1.5,
                  bgcolor: P.purple.bg,
                  border: `2px solid ${P.purple.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.purple.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
