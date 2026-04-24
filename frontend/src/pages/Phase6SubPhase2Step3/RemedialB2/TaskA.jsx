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

const WORD_BANK = ['constructive', 'specific', 'balanced', 'suggestion', 'improve', 'polite']

export default function Phase6SP2Step3RemB2TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/3/remedial/b2/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_b2' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'constructive') correct++
    if (ans2 === 'specific') correct++
    if (ans3 === 'improve') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const dialogueLineSx = (isYou, isCorrect) => ({
    p: 2, mb: 2, borderRadius: '12px',
    bgcolor: isYou ? P.blue.bg : P.teal.bg,
    border: `2px solid ${submitted ? (isCorrect ? P.green.border : P.red.border) : (isYou ? P.blue.border : P.teal.border)}`,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial B2 - Task A</Typography>
            <Typography>Role-Play Dialogue: Explaining Effective Feedback</Typography>
          </Box>

          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {WORD_BANK.map(w => (
                <Box key={w} sx={{ px: 2, py: 0.5, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Complete the dialogue about why constructive feedback should be specific and balanced.</Typography>
          </Box>

          {/* Dialogue */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ p: 2, mb: 2, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.red.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>Ms. Mabrouki</Box>
              <Typography sx={{ fontStyle: 'italic' }}>"Why should feedback be constructive?"</Typography>
            </Box>

            <Box sx={dialogueLineSx(true, ans1 === 'constructive')}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.green.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>You</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {['constructive', 'negative', 'harsh'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography>feedback helps people improve — it focuses on growth, not just on problems.</Typography>
              </Box>
              {submitted && ans1 !== 'constructive' && <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct: <strong>constructive</strong></Typography>}
            </Box>

            <Box sx={{ p: 2, mb: 2, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.red.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>Lilia</Box>
              <Typography sx={{ fontStyle: 'italic' }}>"And why does feedback need to be specific?"</Typography>
            </Box>

            <Box sx={dialogueLineSx(true, ans2 === 'specific')}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.green.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>You</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {['specific', 'vague', 'silent'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography>feedback gives the person clear actions to take — not just "make it better" but exactly what to change.</Typography>
              </Box>
              {submitted && ans2 !== 'specific' && <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct: <strong>specific</strong></Typography>}
            </Box>

            <Box sx={{ p: 2, mb: 2, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px' }}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.red.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>Ms. Mabrouki</Box>
              <Typography sx={{ fontStyle: 'italic' }}>"What is the purpose of the positive sandwich?"</Typography>
            </Box>

            <Box sx={dialogueLineSx(true, ans3 === 'improve')}>
              <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.green.border, borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>You</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography>It motivates the person to</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {['improve', 'quit', 'ignore'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography>by making the suggestion feel kind and supported, not discouraging.</Typography>
              </Box>
              {submitted && ans3 !== 'improve' && <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct: <strong>improve</strong></Typography>}
            </Box>
          </Box>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!ans1 || !ans2 || !ans3}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: ans1 && ans2 && ans3 ? 'pointer' : 'not-allowed', opacity: ans1 && ans2 && ans3 ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': ans1 && ans2 && ans3 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 2 }}>Score: {score}/3</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b2/task/b')}
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
