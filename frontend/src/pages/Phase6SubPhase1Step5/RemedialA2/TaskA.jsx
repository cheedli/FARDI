import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Chip, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level A2 - Task A
 * Drag & Drop: "Spelling Rescue" — Match 8 spelling mistakes to corrections
 */

const PAIRS = [
  { wrong: 'succes', correct: 'success' },
  { wrong: 'challange', correct: 'challenge' },
  { wrong: 'feedbak', correct: 'feedback' },
  { wrong: 'improv', correct: 'improve' },
  { wrong: 'recomend', correct: 'recommend' },
  { wrong: 'sumary', correct: 'summary' },
  { wrong: 'achievment', correct: 'achievement' },
  { wrong: 'evidance', correct: 'evidence' }
]

export default function Phase6SP1Step5RemA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledCorrect] = useState(() => [...PAIRS.map(p => p.correct)].sort(() => Math.random() - 0.5))

  const handleWrongClick = (wrong) => {
    if (submitted) return
    setSelected(wrong === selected ? null : wrong)
  }

  const handleCorrectClick = (correct) => {
    if (submitted || !selected) return
    setMatches({ ...matches, [selected]: correct })
    setSelected(null)
  }

  const allMatched = Object.keys(matches).length === PAIRS.length

  const handleSubmit = async () => {
    let correct = 0
    PAIRS.forEach(p => { if (matches[p.wrong] === p.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'A', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Spelling Rescue</Typography>
        <Typography variant="body1">Match 8 misspelled words to their correct spellings</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Spelling Rescue! Match each misspelled word on the left to its correct spelling on the right. Click a misspelled word, then click the correct spelling to match them!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">Click a word on the left (misspelled), then click the correct spelling on the right to match them.</Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Wrong words column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">Misspelled Words:</Typography>
          <Stack spacing={1}>
            {PAIRS.map((p) => (
              <Chip
                key={p.wrong}
                label={p.wrong}
                onClick={() => handleWrongClick(p.wrong)}
                color={matches[p.wrong] ? 'success' : selected === p.wrong ? 'warning' : 'error'}
                variant={matches[p.wrong] ? 'filled' : 'outlined'}
                disabled={submitted || !!matches[p.wrong]}
                sx={{ justifyContent: 'flex-start', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1rem' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Correct words column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">Correct Spellings:</Typography>
          <Stack spacing={1}>
            {shuffledCorrect.map((correct) => {
              const isMatched = Object.values(matches).includes(correct)
              return (
                <Chip
                  key={correct}
                  label={correct}
                  onClick={() => handleCorrectClick(correct)}
                  color={isMatched ? 'success' : selected ? 'primary' : 'default'}
                  variant={isMatched ? 'filled' : 'outlined'}
                  disabled={submitted || isMatched}
                  sx={{ justifyContent: 'flex-start', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1rem' }}
                />
              )
            })}
          </Stack>
        </Box>
      </Box>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allMatched} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Matches
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task A Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{PAIRS.length} correct matches</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 7 ? 'Excellent spelling accuracy!' : score >= 5 ? 'Good work! Keep practicing spelling.' : 'Keep working on spelling — these words are important for reports.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/a2/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
