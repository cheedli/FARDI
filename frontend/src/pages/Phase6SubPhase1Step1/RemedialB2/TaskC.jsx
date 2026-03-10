import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, Stack, Grid, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B2 - Task C
 * Matching Game: "Kahoot Match"
 * Match 8 report/reflection terms to their correct function/definition
 */

const MATCHING_PAIRS = [
  { term: 'success', definition: 'Positive result / achievement' },
  { term: 'challenge', definition: 'Difficult part / obstacle' },
  { term: 'feedback', definition: 'Opinions from participants' },
  { term: 'improve', definition: 'Make something better next time' },
  { term: 'strength', definition: 'What we did well' },
  { term: 'weakness', definition: 'Area that needs work' },
  { term: 'recommend', definition: 'Suggest future action' },
  { term: 'summary', definition: 'Short overview of the event' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP1Step1RemB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_b2' })
  const shuffledDefs = useMemo(() => shuffle(MATCHING_PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [correctSet, setCorrectSet] = useState(new Set())

  const matchedTermIndices = new Set(Object.keys(matches).map(Number))
  const matchedDefIndices = new Set(Object.values(matches).map(Number))

  const handleTermClick = (idx) => {
    if (submitted) return
    if (matchedTermIndices.has(idx)) {
      const newMatches = { ...matches }
      delete newMatches[idx]
      setMatches(newMatches)
      return
    }
    setSelectedTerm(idx)
  }

  const handleDefClick = (defIdx) => {
    if (submitted || selectedTerm === null) return
    const newMatches = { ...matches }
    const existing = Object.keys(newMatches).find(k => newMatches[k] === defIdx)
    if (existing !== undefined) delete newMatches[existing]
    newMatches[selectedTerm] = defIdx
    setMatches(newMatches)
    setSelectedTerm(null)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const correct = new Set()
    Object.entries(matches).forEach(([termIdx, defIdx]) => {
      const termItem = MATCHING_PAIRS[parseInt(termIdx)]
      const defItem = shuffledDefs[parseInt(defIdx)]
      if (termItem.term === defItem.term) {
        correctCount++
        correct.add(parseInt(termIdx))
      }
    })
    setScore(correctCount)
    setCorrectSet(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b2_taskc_score', correctCount.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'C', correctCount, MATCHING_PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allMatched = matchedTermIndices.size === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Kahoot Match</Typography>
        <Typography variant="body1">Match 8 report/reflection terms to their correct function</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Kahoot Match! Match 8 report/reflection terms to their correct function or definition. Click a term on the left, then click its matching definition on the right. Match all 8 to win!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>How to play:</strong> Click a term on the left to select it, then click the matching definition on the right.
          Match all 8 pairs before submitting.
        </Typography>
      </Alert>

      {!submitted && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary" textAlign="center">Terms</Typography>
              <Stack spacing={1.5}>
                {MATCHING_PAIRS.map((pair, idx) => {
                  const isMatched = matchedTermIndices.has(idx)
                  const isSelected = selectedTerm === idx
                  return (
                    <Box key={idx} onClick={() => handleTermClick(idx)} sx={{
                      p: 1.5, borderRadius: 1, border: '2px solid',
                      borderColor: isSelected ? '#8e44ad' : isMatched ? '#27ae60' : '#e0e0e0',
                      backgroundColor: isSelected ? '#f3e5f5' : isMatched ? '#e8f8f0' : 'white',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                      '&:hover': { borderColor: '#8e44ad', backgroundColor: '#fdf0ff' }
                    }}>
                      <Typography variant="body1" fontWeight="bold">{pair.term}</Typography>
                      {isMatched && <Typography variant="caption" color="success.main">(matched)</Typography>}
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" color="text.secondary">→</Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary" textAlign="center">Definitions</Typography>
              <Stack spacing={1.5}>
                {shuffledDefs.map((item, defIdx) => {
                  const isMatched = matchedDefIndices.has(defIdx)
                  const matchedTermIdx = Object.keys(matches).find(k => matches[k] === defIdx)
                  const matchedTerm = matchedTermIdx !== undefined ? MATCHING_PAIRS[parseInt(matchedTermIdx)].term : null
                  return (
                    <Box key={defIdx} onClick={() => handleDefClick(defIdx)} sx={{
                      p: 1.5, borderRadius: 1, border: '2px solid',
                      borderColor: isMatched ? '#27ae60' : selectedTerm !== null ? '#8e44ad' : '#e0e0e0',
                      backgroundColor: isMatched ? '#e8f8f0' : selectedTerm !== null ? '#fdf0ff' : '#fafafa',
                      cursor: selectedTerm !== null ? 'pointer' : 'default', transition: 'all 0.2s',
                      '&:hover': selectedTerm !== null ? { borderColor: '#6c3483', backgroundColor: '#f3e5f5' } : {}
                    }}>
                      <Typography variant="body2">{item.definition}</Typography>
                      {matchedTerm && <Chip label={matchedTerm} size="small" sx={{ mt: 0.5, backgroundColor: '#27ae60', color: 'white' }} />}
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {!submitted && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" size="large" onClick={handleSubmit} disabled={!allMatched}
            sx={{ px: 6, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { background: 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)' } }}>
            Submit Answers
          </Button>
          {!allMatched && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Match all {MATCHING_PAIRS.length} pairs before submitting ({matchedTermIndices.size}/{MATCHING_PAIRS.length} matched)
            </Typography>
          )}
        </Box>
      )}

      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: '#e8f8f0', textAlign: 'center', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark" fontWeight="bold">Task C Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{MATCHING_PAIRS.length}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === MATCHING_PAIRS.length ? 'Perfect! All 8 terms matched correctly!' : score >= 6 ? 'Well done! Great understanding of report vocabulary.' : 'Good effort! Review the correct matches below.'}
            </Typography>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Correct Matches</Typography>
            <Grid container spacing={2}>
              {MATCHING_PAIRS.map((pair, idx) => {
                const isCorrect = correctSet.has(idx)
                return (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ p: 1.5, borderRadius: 1, border: '2px solid', borderColor: isCorrect ? 'success.main' : 'error.main', backgroundColor: isCorrect ? '#e8f8f0' : '#ffebee', display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isCorrect ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{pair.term}</Typography>
                        <Typography variant="caption" color="text.secondary">{pair.definition}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Paper>

          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/b2/task/d')} size="large"
              sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' } }}>
              Next: Task D →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
