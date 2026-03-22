import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const WORD_BANK = ['positive', 'suggestion', 'specific', 'balanced', 'polite']
const GAPS = [
  { id: 'ans1', answer: 'positive' },
  { id: 'ans2', answer: 'specific' },
  { id: 'ans3', answer: 'suggestion' },
  { id: 'ans4', answer: 'polite' },
]

export default function Phase6SP2Step5RemB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_b2' })
  const [selections, setSelections] = useState({ ans1: '', ans2: '', ans3: '', ans4: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const allFilled = Object.values(selections).every(v => v !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = GAPS.filter(g => selections[g.id].toLowerCase() === g.answer).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const selectSx = (id) => {
    const gap = GAPS.find(g => g.id === id)
    return {
      minWidth: 140, display: 'inline-flex', verticalAlign: 'middle', mx: 0.5,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: submitted ? (selections[id].toLowerCase() === gap.answer ? P.green.border : P.red.border) : undefined,
        borderWidth: submitted ? 2 : 1,
      },
    }
  }

  const makeSelect = (id, label) => {
    const gap = GAPS.find(g => g.id === id)
    const isCorrect = submitted && selections[id].toLowerCase() === gap.answer
    const isWrong = submitted && selections[id].toLowerCase() !== gap.answer
    return (
      <Box key={id} sx={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', mx: 0.5 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={selections[id]} onChange={e => setSelections(prev => ({ ...prev, [id]: e.target.value }))} disabled={submitted} displayEmpty sx={selectSx(id)}>
            <MenuItem value=""><em>{label}</em></MenuItem>
            {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
          </Select>
        </FormControl>
        {isWrong && <Typography variant="caption" sx={{ color: P.red.border, mt: 0.5 }}>Correct: <strong>{gap.answer}</strong></Typography>}
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial B2 — Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Role-Play Dialogue Gap Fill: Discussing Peer Feedback Quality</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Word Bank</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {WORD_BANK.map(w => (
                <Box key={w} sx={{ bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', px: 2, py: 0.5, borderRadius: '10px', fontSize: '0.875rem' }}>{w}</Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Complete the dialogue by selecting the correct word for each gap.</Typography>

            {/* Line 1: PEER */}
            <Box sx={{ ...cardSx(P.blue), mb: 2, p: 2 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>PEER</Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"Feedback too negative?"</Typography>
            </Box>

            {/* Line 2: YOU */}
            <Box sx={{ ...cardSx(P.teal), mb: 2, p: 2 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
              <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body1" component="span">"Yes - add&nbsp;</Typography>
                {makeSelect('ans1', 'Gap 1')}
                <Typography variant="body1" component="span">&nbsp;first."</Typography>
              </Box>
            </Box>

            {/* Line 3: PEER */}
            <Box sx={{ ...cardSx(P.blue), mb: 2, p: 2 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>PEER</Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"How?"</Typography>
            </Box>

            {/* Line 4: YOU */}
            <Box sx={{ ...cardSx(P.teal), p: 2 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
              <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body1" component="span">"Use&nbsp;</Typography>
                {makeSelect('ans2', 'Gap 2')}
                {makeSelect('ans3', 'Gap 3')}
                <Typography variant="body1" component="span">&nbsp;and be&nbsp;</Typography>
                {makeSelect('ans4', 'Gap 4')}
                <Typography variant="body1" component="span">."</Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {submitted && (
          <Box sx={{ ...cardSx(score === 4 ? P.green : score >= 3 ? P.yellow : P.red), mb: 2, p: 2 }}>
            <Typography variant="body2" sx={{ color: score === 4 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.border }}>
              {score === 4 ? 'Perfect! All 4 gaps correct. You understand how to give quality peer feedback.' : `You got ${score}/4 correct. Remember: add positive first, then use specific suggestion and be polite.`}
            </Typography>
          </Box>
        )}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task A Complete! Score: {score}/4</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 4 ? 'Excellent — you have mastered the peer feedback dialogue structure!' : 'Good effort! Key sequence: positive first → specific suggestion → be polite.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b2/task/b')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
