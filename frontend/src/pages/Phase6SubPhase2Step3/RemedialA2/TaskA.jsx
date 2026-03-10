import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Grid, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PAIRS = [
  { word: 'feedback', definition: 'What people say about work' },
  { word: 'positive', definition: 'Good things' },
  { word: 'suggestion', definition: 'Idea to make better' },
  { word: 'strength', definition: 'Good part' },
  { word: 'weakness', definition: 'Bad part / needs work' },
  { word: 'improve', definition: 'Make better' },
  { word: 'polite', definition: 'Be nice and kind' },
  { word: 'helpful', definition: 'Good to use / useful' }
]

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

export default function Phase6SP2Step3RemA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_a2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedWords = new Set(Object.keys(matches).map(Number))
  const matchedDefs = new Set(Object.values(matches).map(Number))

  const handleWordClick = (idx) => {
    if (submitted) return
    if (matchedWords.has(idx)) { const m = { ...matches }; delete m[idx]; setMatches(m); return }
    setSelectedWord(idx)
  }
  const handleDefClick = (dIdx) => {
    if (submitted || selectedWord === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === dIdx) delete m[k] })
    m[selectedWord] = dIdx
    setMatches(m)
    setSelectedWord(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([wIdx, dIdx]) => {
      if (PAIRS[parseInt(wIdx)].word === shuffledDefs[parseInt(dIdx)].word) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'A2', 'A', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 3: Remedial A2 - Task A</Typography>
        <Typography variant="body1">Term Treasure Hunt: Match Feedback Words to Definitions</Typography>
      </Paper>
      {!submitted ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>Click a feedback word, then click its matching definition.</Alert>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center">Feedback Words</Typography>
                <Stack spacing={1.5}>
                  {PAIRS.map((p, idx) => (
                    <Box key={idx} onClick={() => handleWordClick(idx)} sx={{ p: 1.5, borderRadius: 1, border: '2px solid', borderColor: selectedWord === idx ? '#8e44ad' : matchedWords.has(idx) ? '#27ae60' : '#e0e0e0', backgroundColor: selectedWord === idx ? '#f3e5f5' : matchedWords.has(idx) ? '#e8f8f0' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">{p.word}</Typography>
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
                <Typography variant="h6" gutterBottom textAlign="center">Definitions</Typography>
                <Stack spacing={1.5}>
                  {shuffledDefs.map((item, dIdx) => (
                    <Box key={dIdx} onClick={() => handleDefClick(dIdx)} sx={{ p: 1.5, borderRadius: 1, border: '2px solid', borderColor: matchedDefs.has(dIdx) ? '#27ae60' : selectedWord !== null ? '#8e44ad' : '#e0e0e0', cursor: selectedWord !== null ? 'pointer' : 'default', backgroundColor: matchedDefs.has(dIdx) ? '#e8f8f0' : 'white' }}>
                      <Typography variant="body2">{item.definition}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" onClick={handleSubmit} disabled={matchedWords.size < PAIRS.length}
              sx={{ px: 6, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
          </Box>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task A Complete! Score: {score}/{PAIRS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/3/remedial/a2/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task B</Button>
        </Paper>
      )}
    </Box>
  )
}
