import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const TERMS = [
  { term: 'success', hint: 'Positive result' },
  { term: 'challenge', hint: 'Difficulty' },
  { term: 'feedback', hint: 'Comments' },
  { term: 'improve', hint: 'Do better' },
  { term: 'recommend', hint: 'Suggest' },
  { term: 'summary', hint: 'Short report' }
]

export default function Phase6SP1Step3RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(TERMS.length).fill(''))
  const [explanations, setExplanations] = useState(Array(TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleSpellingChange = (idx, val) => { const updated = [...spellings]; updated[idx] = val; setSpellings(updated) }
  const handleExplanationChange = (idx, val) => { const updated = [...explanations]; updated[idx] = val; setExplanations(updated) }

  const handleSubmit = async () => {
    const itemResults = TERMS.map((t, i) => {
      const spellingCorrect = spellings[i].trim().toLowerCase() === t.term
      const explanationWords = explanations[i].trim().split(/\s+/).filter(w => w.length > 0).length
      const explanationValid = explanationWords >= 3
      return { spellingCorrect, explanationValid, point: spellingCorrect && explanationValid ? 1 : 0 }
    })
    const total = itemResults.reduce((sum, r) => sum + r.point, 0)
    setResults(itemResults)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_b2_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'D', total, 6, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && explanations.every(e => e.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Step 3: Remedial B2 - Task D</Typography>
            <Typography variant="h6" sx={{ color: P.purple.border }}>Spell &amp; Report Quest</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Spell each report term correctly and write a brief explanation (minimum 3 words) for each.</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3, p: 2 }}>
            <Typography variant="body2">For each term: (1) Type the correct spelling, (2) Write an explanation of at least 3 words. You earn 1 point per term only when both are correct.</Typography>
          </Box>
        </motion.div>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {TERMS.map((t, idx) => {
            const result = results[idx]
            const isCorrect = submitted && result?.point === 1
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.03 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? P.green : P.red) : P.purple), p: 2.5 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: P.purple.border, mb: 1.5 }}>
                    Term {idx + 1}
                    {submitted && <Typography component="span" variant="body2" sx={{ ml: 1, color: isCorrect ? P.green.border : P.red.border, fontWeight: 'bold' }}>{isCorrect ? '(+1 point)' : '(0 points)'}</Typography>}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>Spelling:</Typography>
                    <TextField size="small" value={spellings[idx]} onChange={(e) => handleSpellingChange(idx, e.target.value)} disabled={submitted} placeholder="Type the correct spelling..." sx={{ minWidth: 220, bgcolor: 'white' }} />
                    {submitted && <Typography variant="body2" sx={{ color: result?.spellingCorrect ? P.green.border : P.red.border, fontWeight: 'bold' }}>{result?.spellingCorrect ? `Correct: ${t.term}` : `Incorrect — correct spelling: ${t.term}`}</Typography>}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minWidth: 80 }}>Explanation:</Typography>
                    <TextField size="small" multiline rows={2} value={explanations[idx]} onChange={(e) => handleExplanationChange(idx, e.target.value)} disabled={submitted} placeholder="Write at least 3 words explaining this term..." sx={{ flex: 1, minWidth: 200, bgcolor: 'white' }} />
                  </Box>
                  {submitted && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                      Hint: {t.hint}{!result?.explanationValid && <Typography component="span" sx={{ color: P.red.border, ml: 1 }}>(explanation needs at least 3 words)</Typography>}
                    </Typography>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Stack>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', ...cardSx(P.purple), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.purple.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit Spellings &amp; Explanations
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.purple.border }}>Task D Complete! Score: {score} / 6</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {score === 6 ? 'Perfect! You spelled and explained all 6 terms correctly.' : score >= 4 ? 'Well done! You got most of the terms right.' : 'Keep practising — spelling and clear explanations will strengthen your reports.'}
              </Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/c1/task/a')} sx={{ ...cardSx(P.purple), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.purple.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue to C1 Task A →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
