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

export default function Phase6SP2Step2RemB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/2/remedial/b1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 1, context: 'remedial_b1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const isAns1Correct = ans1 === 'positive'
  const isAns2Correct = ans2 === 'suggestion'
  const isAns3Correct = ans3 === 'feedback'

  const handleSubmit = async () => {
    let correct = 0
    if (isAns1Correct) correct++
    if (isAns2Correct) correct++
    if (isAns3Correct) correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step2_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial B1 — Task A</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Negotiation Gap Fill: Peer Feedback Dialogue</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>Complete the peer feedback dialogue by choosing the correct word for each blank.</Alert>

          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Chip label="SKANDER" size="small" sx={{ bgcolor: P.blue.border, color: 'white', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Your report?"</Typography>
          </Box>

          <Box sx={{ ...cardSx(submitted ? (isAns1Correct ? P.green : P.red) : P.teal), mb: 2 }}>
            <Chip label="You" size="small" sx={{ bgcolor: P.teal.border, color: 'white', mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['positive', 'negative', 'bad'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">is clear.</Typography>
            </Box>
            {submitted && !isAns1Correct && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>positive</strong></Typography>}
          </Box>

          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Chip label="Emna" size="small" sx={{ bgcolor: P.blue.border, color: 'white', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Improve?"</Typography>
          </Box>

          <Box sx={{ ...cardSx(submitted ? (isAns2Correct && isAns3Correct ? P.green : P.red) : P.teal), mb: 3 }}>
            <Chip label="You" size="small" sx={{ bgcolor: P.teal.border, color: 'white', mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['suggestion', 'problem', 'mistake'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">is add</Typography>
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['feedback', 'bad', 'none'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">quotes.</Typography>
            </Box>
            {submitted && (!isAns2Correct || !isAns3Correct) && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>suggestion</strong> is add <strong>feedback</strong> quotes.</Typography>}
          </Box>

          {!submitted ? (
            <Box component="button" onClick={handleSubmit} disabled={!ans1 || !ans2 || !ans3}
              sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: (!ans1 || !ans2 || !ans3) ? 'not-allowed' : 'pointer', opacity: (!ans1 || !ans2 || !ans3) ? 0.5 : 1, '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
              Submit
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score}/3</Typography>
                <Typography variant="body1" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>{score === 3 ? 'Perfect! All blanks correct.' : `You got ${score} out of 3 correct.`}</Typography>
                <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/2/remedial/b1/task/b')}
                  sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                  Continue to Task B
                </Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
