import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Alert, Stack, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

const TERMS = [
  { term: 'feedback', meaning: 'Comments given to help someone improve their work' },
  { term: 'constructive', meaning: 'Helpful and focused on improvement' },
  { term: 'suggestion', meaning: 'An idea to make something better' },
  { term: 'strength', meaning: "A positive quality in someone's work" },
  { term: 'weakness', meaning: 'An area in the report that needs improvement' },
  { term: 'polite', meaning: 'Being respectful and kind when giving feedback' },
]

export default function Phase6SP2Step2RemB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 4, context: 'remedial_b2' })
  const [current, setCurrent] = useState(0)
  const [spelling, setSpelling] = useState('')
  const [explanation, setExplanation] = useState('')
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleNext = () => {
    const isCorrectSpell = spelling.trim().toLowerCase() === TERMS[current].term.toLowerCase()
    const hasExplanation = explanation.trim().split(/\s+/).length >= 3
    const pts = (isCorrectSpell ? 0.5 : 0) + (hasExplanation ? 0.5 : 0)
    const newResults = [...results, { pts }]
    setResults(newResults)
    if (current < TERMS.length - 1) {
      setCurrent(current + 1)
      setSpelling('')
      setExplanation('')
    } else {
      const total = newResults.reduce((s, r) => s + r.pts, 0)
      const finalScore = Math.round(total)
      setScore(finalScore)
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp2_step2_remedial_b2_taskd_score', finalScore.toString())
      phase6API.logRemedialActivity(2, 'B2', 'D', finalScore, TERMS.length, 0, 2).catch(e => console.error(e))
    }
  }

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.green.shadow }}>Task D Complete! Score: {score}/{TERMS.length}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/3')}
                sx={{ mt: 2, px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Step 3
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial B2 — Task D</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Spell & Explain: Peer Feedback Terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>For each term: spell it correctly, then explain its meaning in your own words.</Alert>
          <LinearProgress variant="determinate" value={(current / TERMS.length) * 100} sx={{ mb: 1, height: 8, borderRadius: 4, bgcolor: P.orange.bg, '& .MuiLinearProgress-bar': { bgcolor: P.orange.border } }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Term {current + 1} of {TERMS.length}</Typography>
          <Box sx={{ ...cardSx(P.teal) }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>Hint: This word has {TERMS[current].term.length} letters and means: "{TERMS[current].meaning}"</Alert>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Spell the term:</Typography>
                <TextField fullWidth value={spelling} onChange={(e) => setSpelling(e.target.value)} placeholder="Type the spelling here..." />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Explain the meaning:</Typography>
                <TextField fullWidth multiline rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Write what this word means in feedback..." />
              </Box>
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Box component="button" onClick={handleNext} disabled={!spelling.trim() || !explanation.trim()}
                sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: (!spelling.trim() || !explanation.trim()) ? 'not-allowed' : 'pointer', opacity: (!spelling.trim() || !explanation.trim()) ? 0.5 : 1, '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                {current < TERMS.length - 1 ? 'Next Term' : 'Finish'}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
