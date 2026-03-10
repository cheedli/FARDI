import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Grid, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PAIRS = [
  { mistake: 'report bad', correction: 'report could be better' },
  { mistake: 'feedbak', correction: 'feedback' },
  { mistake: 'no good', correction: 'not strong' },
  { mistake: 'add more', correction: 'suggestion: add more' },
  { mistake: 'thank', correction: 'thank you' },
  { mistake: 'weak', correction: 'area to improve' },
  { mistake: 'sugestion', correction: 'suggestion' },
  { mistake: 'improv', correction: 'improve' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP2Step5RemA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_a2' })
  const shuffledCorrections = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedMistake, setSelectedMistake] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedMistakes = new Set(Object.keys(matches).map(Number))
  const matchedCorrections = new Set(Object.values(matches).map(Number))

  const handleMistakeClick = (idx) => {
    if (submitted) return
    if (matchedMistakes.has(idx)) {
      const m = { ...matches }
      delete m[idx]
      setMatches(m)
      return
    }
    setSelectedMistake(idx)
  }

  const handleCorrectionClick = (corrIdx) => {
    if (submitted || selectedMistake === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === corrIdx) delete m[k] })
    m[selectedMistake] = corrIdx
    setMatches(m)
    setSelectedMistake(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([mIdx, cIdx]) => {
      if (PAIRS[parseInt(mIdx)].correction === shuffledCorrections[parseInt(cIdx)].correction) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'A', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial A2 - Task A</Typography>
        <Typography variant="body1">Feedback Rescue: Match Mistakes to Corrections</Typography>
      </Paper>

      {!submitted ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            Click a feedback mistake on the left, then click its correct version on the right to match them.
          </Alert>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center" color="error.main">Mistakes</Typography>
                <Stack spacing={1.5}>
                  {PAIRS.map((p, idx) => (
                    <Box
                      key={idx}
                      onClick={() => handleMistakeClick(idx)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: selectedMistake === idx ? '#8e44ad' : matchedMistakes.has(idx) ? '#27ae60' : '#e0e0e0',
                        backgroundColor: selectedMistake === idx ? '#f3e5f5' : matchedMistakes.has(idx) ? '#e8f8f0' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold" color="error.dark">"{p.mistake}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" color="text.secondary">→</Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center" color="success.main">Corrections</Typography>
                <Stack spacing={1.5}>
                  {shuffledCorrections.map((item, cIdx) => (
                    <Box
                      key={cIdx}
                      onClick={() => handleCorrectionClick(cIdx)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: matchedCorrections.has(cIdx) ? '#27ae60' : selectedMistake !== null ? '#8e44ad' : '#e0e0e0',
                        cursor: selectedMistake !== null ? 'pointer' : 'default',
                        backgroundColor: matchedCorrections.has(cIdx) ? '#e8f8f0' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium" color="success.dark">"{item.correction}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={matchedMistakes.size < PAIRS.length}
              sx={{ px: 6, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
            >
              Submit ({matchedMistakes.size}/{PAIRS.length} matched)
            </Button>
          </Box>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Feedback Rescue Complete! Score: {score}/{PAIRS.length}
          </Typography>
          <Box sx={{ mt: 2, mb: 3 }}>
            {PAIRS.map((p, idx) => {
              const cIdx = matches[idx]
              const isCorrect = cIdx !== undefined && shuffledCorrections[cIdx]?.correction === p.correction
              return (
                <Chip
                  key={idx}
                  label={`"${p.mistake}" → "${p.correction}"`}
                  color={isCorrect ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              )
            })}
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/a2/task/b')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task B
          </Button>
        </Paper>
      )}
    </Box>
  )
}
