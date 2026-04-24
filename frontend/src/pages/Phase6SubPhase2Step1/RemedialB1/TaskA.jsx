import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Alert, Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
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
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#B91C1C' },
}

const BLANK1_OPTIONS = ['positive', 'negative', 'boring']
const BLANK2_OPTIONS = ['suggestion', 'problem', 'excuse']
const BLANK3_OPTIONS = ['feedback', 'silence', 'argument']

export default function Phase6SP2Step1RemB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/1/remedial/b1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'remedial_b1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'positive') correct++
    if (ans2 === 'suggestion') correct++
    if (ans3 === 'feedback') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = ans1 && ans2 && ans3

  const gap = (value, setter, options, correct) => (
    <FormControl size="small" sx={{ minWidth: 130, mx: 0.5 }}>
      <Select
        value={value}
        onChange={(e) => setter(e.target.value)}
        disabled={submitted}
        displayEmpty
        sx={submitted ? {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: value === correct ? P.green.border : P.red.border,
            borderWidth: 2
          }
        } : {}}
      >
        <MenuItem value=""><em>choose...</em></MenuItem>
        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>
              Step 1: Remedial B1 — Task A
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Negotiation Gap Fill: Feedback Dialogue
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            Complete the feedback dialogue by choosing the correct words.
          </Alert>

          {/* Skander */}
          <Box sx={{ ...cardSx(P.red), mb: 2 }}>
            <Chip label="SKANDER" size="small" sx={{ bgcolor: P.red.border, color: 'white', mb: 1, fontWeight: 'bold' }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Your report good?"</Typography>
          </Box>

          {/* You — blank1 */}
          <Box sx={{ ...cardSx(submitted ? (ans1 === 'positive' ? P.green : P.red) : P.teal), mb: 2 }}>
            <Chip label="You" size="small" sx={{ bgcolor: P.teal.border, color: 'white', mb: 1, fontWeight: 'bold' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="body1">Yes,</Typography>
              {gap(ans1, setAns1, BLANK1_OPTIONS, 'positive')}
              <Typography variant="body1">parts.</Typography>
            </Box>
            {submitted && ans1 !== 'positive' && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>positive</strong></Typography>
            )}
          </Box>

          {/* Emna */}
          <Box sx={{ ...cardSx(P.orange), mb: 2 }}>
            <Chip label="Emna" size="small" sx={{ bgcolor: P.orange.border, color: 'white', mb: 1, fontWeight: 'bold' }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Improve?"</Typography>
          </Box>

          {/* You — blank2 + blank3 */}
          <Box sx={{ ...cardSx(submitted ? (ans2 === 'suggestion' && ans3 === 'feedback' ? P.green : P.red) : P.teal), mb: 3 }}>
            <Chip label="You" size="small" sx={{ bgcolor: P.teal.border, color: 'white', mb: 1, fontWeight: 'bold' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
              {gap(ans2, setAns2, BLANK2_OPTIONS, 'suggestion')}
              <Typography variant="body1">is add</Typography>
              {gap(ans3, setAns3, BLANK3_OPTIONS, 'feedback')}
              <Typography variant="body1">quotes.</Typography>
            </Box>
            {submitted && (ans2 !== 'suggestion' || ans3 !== 'feedback') && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Correct: <strong>suggestion</strong> is add <strong>feedback</strong> quotes.
              </Typography>
            )}
          </Box>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                px: 5, py: 1.5,
                borderRadius: '16px',
                border: `2px solid ${P.orange.border}`,
                bgcolor: P.orange.bg,
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                fontWeight: 'bold',
                fontSize: '1rem',
                fontFamily: 'inherit',
                width: '100%',
                cursor: !allAnswered ? 'not-allowed' : 'pointer',
                opacity: !allAnswered ? 0.5 : 1,
                '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s',
              }}
            >
              Submit
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Task A Complete! Score: {score}/3
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
                  {score === 3 ? 'Perfect! You know the key feedback vocabulary.' : 'Good effort! Review the correct answers above.'}
                </Typography>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/2/step/1/remedial/b1/task/b')}
                  sx={{
                    px: 5, py: 1.5,
                    borderRadius: '16px',
                    border: `2px solid ${P.green.border}`,
                    bgcolor: P.green.bg,
                    boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s',
                  }}
                >
                  Continue to Task B →
                </Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
