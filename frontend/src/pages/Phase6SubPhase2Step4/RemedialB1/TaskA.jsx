import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const BLANK1_OPTIONS = ['positive', 'bad', 'wrong']
const BLANK2_OPTIONS = ['suggestion', 'problem', 'mistake']
const BLANK3_OPTIONS = ['numbers', 'nothing', 'problems']

export default function Phase6SP2Step4RemB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/4/remedial/b1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({ blank1: '', blank2: '', blank3: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const correctAnswers = { blank1: 'positive', blank2: 'suggestion', blank3: 'numbers' }

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    let correct = 0
    if (answers.blank1 === correctAnswers.blank1) correct++
    if (answers.blank2 === correctAnswers.blank2) correct++
    if (answers.blank3 === correctAnswers.blank3) correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = answers.blank1 !== '' && answers.blank2 !== '' && answers.blank3 !== ''

  const selectSx = (key) => ({
    minWidth: 140,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: submitted ? (answers[key] === correctAnswers[key] ? P.green.border : P.red.border) : undefined,
      borderWidth: submitted ? 2 : 1,
    },
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial B1 — Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Negotiation Gap Fill — Giving Feedback on a Report</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Complete the dialogue by choosing the correct word from the options for each blank.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Line 1: SKANDER */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>SKANDER</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>Your report?</Typography>
          </Box>

          {/* Line 2: You — BLANK1 */}
          <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1">It is</Typography>
              <FormControl size="small"><Select value={answers.blank1} onChange={(e) => setAnswers({ ...answers, blank1: e.target.value })} disabled={submitted} displayEmpty sx={selectSx('blank1')}>
                <MenuItem value=""><em>Choose...</em></MenuItem>
                {BLANK1_OPTIONS.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
              </Select></FormControl>
              <Typography variant="body1">.</Typography>
              {submitted && answers.blank1 !== correctAnswers.blank1 && <Typography variant="body2" sx={{ color: P.red.border }}>Correct: <strong>{correctAnswers.blank1}</strong></Typography>}
              {submitted && answers.blank1 === correctAnswers.blank1 && <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} />}
            </Box>
          </Box>

          {/* Line 3: Emna */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>EMNA</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>Suggestion?</Typography>
          </Box>

          {/* Line 4: You — BLANK2 + BLANK3 */}
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <FormControl size="small"><Select value={answers.blank2} onChange={(e) => setAnswers({ ...answers, blank2: e.target.value })} disabled={submitted} displayEmpty sx={selectSx('blank2')}>
                <MenuItem value=""><em>Choose...</em></MenuItem>
                {BLANK2_OPTIONS.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
              </Select></FormControl>
              <Typography variant="body1">is add</Typography>
              <FormControl size="small"><Select value={answers.blank3} onChange={(e) => setAnswers({ ...answers, blank3: e.target.value })} disabled={submitted} displayEmpty sx={selectSx('blank3')}>
                <MenuItem value=""><em>Choose...</em></MenuItem>
                {BLANK3_OPTIONS.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
              </Select></FormControl>
              <Typography variant="body1">.</Typography>
            </Box>
            {submitted && (answers.blank2 !== correctAnswers.blank2 || answers.blank3 !== correctAnswers.blank3) && (
              <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>
                Correct: <strong>{correctAnswers.blank2}</strong> is add <strong>{correctAnswers.blank3}</strong>.
              </Typography>
            )}
            {submitted && answers.blank2 === correctAnswers.blank2 && answers.blank3 === correctAnswers.blank3 && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: P.green.shadow }}>Correct!</Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{
              width: '100%', bgcolor: P.orange.border, color: 'white',
              border: `2px solid ${P.orange.shadow}`, borderRadius: '14px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5,
              fontSize: '1rem', fontWeight: 'bold',
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              opacity: !allFilled ? 0.6 : 1,
              '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s',
            }}
          >
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task A Complete! Score: {score}/3</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {score === 3 ? 'Perfect! You can identify key feedback vocabulary.' : score >= 2 ? 'Well done! Review the highlighted answers above.' : 'Good effort! Study the feedback terms and try again next time.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b1/task/b')}
                sx={{
                  bgcolor: P.green.border, color: 'white',
                  border: `2px solid ${P.green.shadow}`, borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4,
                  fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
