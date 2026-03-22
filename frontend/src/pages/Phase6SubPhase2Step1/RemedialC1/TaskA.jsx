import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Alert, Chip, Stack } from '@mui/material'
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
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#B91C1C' },
}

const WORD_BANK = ['constructive', 'specific', 'balanced', 'empathy', 'actionable', 'growth mindset']

export default function Phase6SP2Step1RemC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'remedial_c1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [ans4, setAns4] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'constructive') correct++
    if (ans2 === 'growth mindset') correct++
    if (ans3 === 'specific') correct++
    if (ans4 === 'empathy') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = ans1 && ans2 && ans3 && ans4

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial C1 — Task A</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Debate Simulation: Defending Effective Peer Feedback Principles</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: P.purple.border }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {WORD_BANK.map(w => (
                <Box key={w} sx={{ px: 2, py: 0.5, bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '10px', mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.border }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>Complete the debate dialogue about effective peer feedback using C1-level vocabulary.</Alert>

          {/* Peer line 1 */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Chip label="Peer" size="small" sx={{ bgcolor: P.blue.border, color: 'white', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Why does feedback need to be constructive? Can't we just say what we think?"</Typography>
          </Box>

          {/* You line 1 */}
          <Box sx={{ ...cardSx(submitted ? (ans1 === 'constructive' && ans2 === 'growth mindset' ? P.green : P.red) : P.teal), mb: 2 }}>
            <Chip label="You" size="small" sx={{ bgcolor: P.teal.border, color: 'white', mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['constructive', 'harsh', 'vague'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">feedback drives a</Typography>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['growth mindset', 'fixed mindset', 'negative attitude'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">— it motivates people to improve rather than feel attacked.</Typography>
            </Box>
            {submitted && (ans1 !== 'constructive' || ans2 !== 'growth mindset') && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>constructive</strong> ... <strong>growth mindset</strong></Typography>
            )}
          </Box>

          {/* Peer line 2 */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Chip label="Peer" size="small" sx={{ bgcolor: P.blue.border, color: 'white', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"But how do you make feedback actually useful and not just nice words?"</Typography>
          </Box>

          {/* You line 2 */}
          <Box sx={{ ...cardSx(submitted ? (ans3 === 'specific' && ans4 === 'empathy' ? P.green : P.red) : P.teal), mb: 3 }}>
            <Chip label="You" size="small" sx={{ bgcolor: P.teal.border, color: 'white', mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1">Be</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['specific', 'vague', 'harsh'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">and balanced in your comments, and use</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select value={ans4} onChange={(e) => setAns4(e.target.value)} disabled={submitted} displayEmpty>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {['empathy', 'anger', 'sarcasm'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1">to understand how the person might feel when receiving it.</Typography>
            </Box>
            {submitted && (ans3 !== 'specific' || ans4 !== 'empathy') && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>specific</strong> ... <strong>empathy</strong></Typography>
            )}
          </Box>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                px: 5, py: 1.5, borderRadius: '16px',
                border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%',
                cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.5 : 1,
                '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s',
              }}
            >Submit</Box>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score}/4</Typography>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/2/step/1/remedial/c1/task/b')}
                  sx={{
                    mt: 2, px: 5, py: 1.5, borderRadius: '16px',
                    border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s',
                  }}
                >Continue to Task B</Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
