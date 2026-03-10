import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 2 - Level B2 - Task C
 * Matching Game: Match 8 terms to functions
 */

const PAIRS = [
  { term: 'success', definition: 'Positive outcome' },
  { term: 'challenge', definition: 'Difficulty faced' },
  { term: 'feedback', definition: 'Participant opinions' },
  { term: 'improve', definition: 'Enhance future' },
  { term: 'recommend', definition: 'Suggest action' },
  { term: 'evidence', definition: 'Numbers & quotes' },
  { term: 'summary', definition: 'Short overview' },
  { term: 'balance', definition: 'Show good & bad' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP1Step2RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'remedial_b2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, origIdx: i }))), [])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedTerms = new Set(Object.keys(matches).map(Number))
  const matchedDefIndices = new Set(Object.values(matches).map(Number))

  const handleTermClick = (idx) => {
    if (submitted) return
    if (matchedTerms.has(idx)) {
      const m = { ...matches }
      delete m[idx]
      setMatches(m)
      return
    }
    setSelectedTerm(idx)
  }

  const handleDefClick = (defIdx) => {
    if (submitted || selectedTerm === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === defIdx) delete m[k] })
    m[selectedTerm] = defIdx
    setMatches(m)
    setSelectedTerm(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([termIdx, defIdx]) => {
      if (PAIRS[parseInt(termIdx)].term === shuffledDefs[parseInt(defIdx)].term) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b2_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(2, 'B2', 'C', correct, PAIRS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B2</Typography>
        <Typography variant="h6">Task C: Matching Game</Typography>
        <Typography variant="body1">Match 8 report terms to their functions</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Match each report term on the left to its correct definition on the right. Click a term, then click its matching definition."
        />
      </Paper>

      {!submitted ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            Click a term (left) to select it, then click its matching definition (right). Click a matched term to unselect it.
          </Alert>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: '#27ae60' }}>Terms</Typography>
                <Stack spacing={1.5}>
                  {PAIRS.map((p, idx) => (
                    <Box
                      key={idx}
                      onClick={() => handleTermClick(idx)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: selectedTerm === idx ? '#27ae60' : matchedTerms.has(idx) ? '#2196f3' : '#e0e0e0',
                        backgroundColor: selectedTerm === idx ? '#f0faf4' : matchedTerms.has(idx) ? '#e3f2fd' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        '&:hover': { borderColor: '#27ae60', backgroundColor: '#f0faf4' }
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">{p.term}</Typography>
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
                <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: '#27ae60' }}>Definitions</Typography>
                <Stack spacing={1.5}>
                  {shuffledDefs.map((item, dIdx) => (
                    <Box
                      key={dIdx}
                      onClick={() => handleDefClick(dIdx)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: matchedDefIndices.has(dIdx) ? '#2196f3' : selectedTerm !== null ? '#27ae60' : '#e0e0e0',
                        backgroundColor: matchedDefIndices.has(dIdx) ? '#e3f2fd' : 'white',
                        cursor: selectedTerm !== null ? 'pointer' : 'default',
                        '&:hover': selectedTerm !== null ? { borderColor: '#27ae60', backgroundColor: '#f0faf4' } : {}
                      }}
                    >
                      <Typography variant="body2">{item.definition}</Typography>
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
              disabled={matchedTerms.size < PAIRS.length}
              sx={{ px: 6, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
            >
              Check My Answers
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#27ae60', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="success.dark">Task C Complete!</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#27ae60' }}>Score: {score}/{PAIRS.length}</Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Correct Answers:</Typography>
            <Stack spacing={1}>
              {PAIRS.map((p, idx) => {
                const defIdx = matches[idx]
                const isCorrect = defIdx !== undefined && shuffledDefs[defIdx]?.term === p.term
                return (
                  <Box
                    key={idx}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: isCorrect ? '#c8e6c9' : '#ffcdd2'
                    }}
                  >
                    <Typography variant="body2">
                      {isCorrect ? '✓' : '✗'} <strong>{p.term}</strong> → {p.definition}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
          </Paper>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b2/task/d')}
              size="large"
              sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
            >
              Next: Task D →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
