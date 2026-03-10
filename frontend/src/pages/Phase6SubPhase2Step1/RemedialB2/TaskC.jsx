import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Grid, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PAIRS = [
  { term: 'positive', function: 'Praise good parts of the report' },
  { term: 'strength', function: 'What is already good' },
  { term: 'weakness', function: 'What needs improvement' },
  { term: 'suggestion', function: 'Idea to make it better' },
  { term: 'improve', function: 'Make the report better' },
  { term: 'feedback', function: 'Comments to help' },
  { term: 'polite', function: 'Be kind and respectful' },
  { term: 'specific', function: 'Give clear examples' }
]

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

export default function Phase6SP2Step1RemB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 3, context: 'remedial_b2' })
  const shuffledFunctions = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedTerms = new Set(Object.keys(matches).map(Number))
  const matchedFuncs = new Set(Object.values(matches).map(Number))

  const handleTermClick = (idx) => {
    if (submitted) return
    if (matchedTerms.has(idx)) { const m = { ...matches }; delete m[idx]; setMatches(m); return }
    setSelectedTerm(idx)
  }
  const handleFuncClick = (fIdx) => {
    if (submitted || selectedTerm === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === fIdx) delete m[k] })
    m[selectedTerm] = fIdx
    setMatches(m)
    setSelectedTerm(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([tIdx, fIdx]) => {
      if (PAIRS[parseInt(tIdx)].term === shuffledFunctions[parseInt(fIdx)].term) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'C', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial B2 - Task C</Typography>
        <Typography variant="body1">Matching Game: Feedback Terms and Functions</Typography>
      </Paper>
      {!submitted ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>Click a feedback term, then click its matching function.</Alert>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center">Feedback Terms</Typography>
                <Stack spacing={1.5}>
                  {PAIRS.map((p, idx) => (
                    <Box key={idx} onClick={() => handleTermClick(idx)} sx={{ p: 1.5, borderRadius: 1, border: '2px solid', borderColor: selectedTerm === idx ? '#8e44ad' : matchedTerms.has(idx) ? '#27ae60' : '#e0e0e0', backgroundColor: selectedTerm === idx ? '#f3e5f5' : matchedTerms.has(idx) ? '#e8f8f0' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">{p.term}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">→</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center">Functions</Typography>
                <Stack spacing={1.5}>
                  {shuffledFunctions.map((item, fIdx) => (
                    <Box key={fIdx} onClick={() => handleFuncClick(fIdx)} sx={{ p: 1.5, borderRadius: 1, border: '2px solid', borderColor: matchedFuncs.has(fIdx) ? '#27ae60' : selectedTerm !== null ? '#8e44ad' : '#e0e0e0', cursor: selectedTerm !== null ? 'pointer' : 'default', backgroundColor: matchedFuncs.has(fIdx) ? '#e8f8f0' : 'white' }}>
                      <Typography variant="body2">{item.function}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" onClick={handleSubmit} disabled={matchedTerms.size < PAIRS.length}
              sx={{ px: 6, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
          </Box>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task C Complete! Score: {score}/{PAIRS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1/remedial/b2/task/d')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task D</Button>
        </Paper>
      )}
    </Box>
  )
}
