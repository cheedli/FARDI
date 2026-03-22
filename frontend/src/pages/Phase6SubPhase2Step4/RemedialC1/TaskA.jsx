import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const WORD_BANK = ['accountability', 'objectivity', 'evidence-based', 'growth mindset', 'nuanced', 'empathy']

const DIALOGUE = [
  { speaker: 'Critic', role: 'critic', text: 'Positive sandwich is just a way to soften criticism — it lacks honesty.', hasGap: false },
  { speaker: 'You', role: 'student', text: 'Actually, ___ feedback that balances praise with critique requires more precision and ___ than purely negative feedback.', hasGap: true, gapIndices: [0, 1], corrects: ['nuanced', 'objectivity'] },
  { speaker: 'Critic', role: 'critic', text: 'But how do you ensure your feedback is credible rather than just polite?', hasGap: false },
  { speaker: 'You', role: 'student', text: 'By making all suggestions ___ — linked to specific moments in the text — and framing them to foster a ___ rather than defensiveness.', hasGap: true, gapIndices: [2, 3], corrects: ['evidence-based', 'growth mindset'] },
]

const correctAnswers = { 0: 'nuanced', 1: 'objectivity', 2: 'evidence-based', 3: 'growth mindset' }

export default function Phase6SP2Step4RemC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({ 0: '', 1: '', 2: '', 3: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    Object.keys(correctAnswers).forEach((k) => { if (answers[k] === correctAnswers[k]) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = Object.values(answers).every((v) => v !== '')

  const selectSx = (key) => ({
    minWidth: 160,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: submitted ? (answers[key] === correctAnswers[key] ? P.green.border : P.red.border) : undefined,
      borderWidth: submitted ? 2 : 1,
    },
  })

  const renderTwoGapLine = (line, lineIdx) => {
    const isStudent = line.role === 'student'
    const lineColor = isStudent ? P.teal : P.blue
    const [g1, g2] = line.gapIndices
    const parts = line.text.split('___')
    return (
      <Box key={lineIdx} sx={{ ...cardSx(lineColor), mb: 2 }}>
        <Typography variant="caption" fontWeight="bold" sx={{ color: lineColor.border, textTransform: 'uppercase', letterSpacing: 1 }}>{line.speaker}</Typography>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body1">{parts[0]}</Typography>
          <FormControl size="small"><Select value={answers[g1]} onChange={(e) => setAnswers({ ...answers, [g1]: e.target.value })} disabled={submitted} displayEmpty sx={selectSx(g1)}>
            <MenuItem value=""><em>Choose...</em></MenuItem>
            {WORD_BANK.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
          </Select></FormControl>
          <Typography variant="body1">{parts[1]}</Typography>
          <FormControl size="small"><Select value={answers[g2]} onChange={(e) => setAnswers({ ...answers, [g2]: e.target.value })} disabled={submitted} displayEmpty sx={selectSx(g2)}>
            <MenuItem value=""><em>Choose...</em></MenuItem>
            {WORD_BANK.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
          </Select></FormControl>
          <Typography variant="body1">{parts[2]}</Typography>
        </Box>
        {submitted && (answers[g1] !== correctAnswers[g1] || answers[g2] !== correctAnswers[g2]) && (
          <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct: <strong>{correctAnswers[g1]}</strong> ... <strong>{correctAnswers[g2]}</strong></Typography>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial C1 — Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Debate Simulation — Defending Positive Sandwich Feedback Writing</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">A critic challenges your approach to peer feedback. Complete your responses by selecting the correct academic term from the word bank.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Word Bank</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {WORD_BANK.map((w) => (
                <Box key={w} sx={{ bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', px: 2, py: 0.5, borderRadius: '10px', fontSize: '0.875rem' }}>{w}</Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {DIALOGUE.map((line, idx) => {
            if (!line.hasGap) {
              const lineColor = line.role === 'student' ? P.teal : P.blue
              return (
                <Box key={idx} sx={{ ...cardSx(lineColor), mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: lineColor.border, textTransform: 'uppercase', letterSpacing: 1 }}>{line.speaker}</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>{line.text}</Typography>
                </Box>
              )
            }
            return renderTwoGapLine(line, idx)
          })}
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Debate Responses
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task A Complete! Score: {score}/4</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 4 ? 'Outstanding! You can defend positive sandwich feedback with precise C1 vocabulary.' : score >= 3 ? 'Well done! Review the highlighted gaps to consolidate your understanding.' : 'Study the C1 terms carefully — these are key for sophisticated academic debate.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/c1/task/b')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
