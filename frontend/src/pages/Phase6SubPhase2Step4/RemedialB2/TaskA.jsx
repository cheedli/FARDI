import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const WORD_BANK = ['positive', 'strength', 'weakness', 'suggestion', 'improve', 'specific']
const CORRECT = { blank1: 'positive', blank2: 'weakness', blank3: 'specific', blank4: 'suggestion' }

export default function Phase6SP2Step4RemB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({ blank1: '', blank2: '', blank3: '', blank4: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    Object.keys(CORRECT).forEach((k) => { if (answers[k] === CORRECT[k]) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = Object.values(answers).every((v) => v !== '')

  const selectSx = (key) => ({
    minWidth: 140,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: submitted ? (answers[key] === CORRECT[key] ? P.green.border : P.red.border) : undefined,
      borderWidth: submitted ? 2 : 1,
    },
  })

  const makeSelect = (key) => (
    <FormControl size="small">
      <Select value={answers[key]} onChange={(e) => !submitted && setAnswers({ ...answers, [key]: e.target.value })} disabled={submitted} displayEmpty sx={selectSx(key)}>
        <MenuItem value=""><em>Choose...</em></MenuItem>
        {WORD_BANK.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial B2 — Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Role-Play Dialogue Gap Fill — Feedback on a Report</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Complete the dialogue by choosing the correct word from the word bank for each blank.</Typography>
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
          {/* Line 1: PEER */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>PEER</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>My report?</Typography>
          </Box>

          {/* Line 2: YOU — BLANK1 */}
          <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              {makeSelect('blank1')}
              <Typography variant="body1">is clear summary.</Typography>
              {submitted && answers.blank1 !== CORRECT.blank1 && <Typography variant="body2" sx={{ color: P.red.border }}>Correct: <strong>{CORRECT.blank1}</strong></Typography>}
              {submitted && answers.blank1 === CORRECT.blank1 && <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} />}
            </Box>
          </Box>

          {/* Line 3: PEER */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>PEER</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>Weak?</Typography>
          </Box>

          {/* Line 4: YOU — BLANK2 + BLANK3 + BLANK4 */}
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              {makeSelect('blank2')}
              <Typography variant="body1">is few numbers,</Typography>
              {makeSelect('blank3')}
              {makeSelect('blank4')}
              <Typography variant="body1">is add attendance.</Typography>
            </Box>
            {submitted && (answers.blank2 !== CORRECT.blank2 || answers.blank3 !== CORRECT.blank3 || answers.blank4 !== CORRECT.blank4) && (
              <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>
                Correct: <strong>{CORRECT.blank2}</strong> is few numbers, <strong>{CORRECT.blank3}</strong> <strong>{CORRECT.blank4}</strong> is add attendance.
              </Typography>
            )}
            {submitted && answers.blank2 === CORRECT.blank2 && answers.blank3 === CORRECT.blank3 && answers.blank4 === CORRECT.blank4 && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: P.green.shadow }}>Correct!</Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task A Complete! Score: {score}/4</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 4 ? 'Excellent! You can use all feedback vocabulary in context.' : score >= 3 ? 'Well done! Review the highlighted answers above.' : 'Good effort! Study the word bank and try again next time.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/b')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
