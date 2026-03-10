import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Chip, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level B2 - Task C
 * Matching Game — Match 8 error types to corrections
 */

const PAIRS = [
  { error: '"Succes"', errorType: 'Spelling', correction: 'success' },
  { error: '"Come"', errorType: 'Tense', correction: 'came' },
  { error: '"Nice"', errorType: 'Vocabulary', correction: 'well-received' },
  { error: '"Problem bad"', errorType: 'Tone', correction: 'challenge' },
  { error: '"We fix"', errorType: 'Tense', correction: 'was fixed' },
  { error: '"People happy"', errorType: 'Formality', correction: 'guests were satisfied' },
  { error: '"Next time good"', errorType: 'Recommendation', correction: 'recommend improvements' },
  { error: 'No balance', errorType: 'Structure', correction: 'include challenges' }
]

export default function Phase6SP1Step5RemB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [selectedError, setSelectedError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledCorrections] = useState(() => [...PAIRS.map(p => p.correction)].sort(() => Math.random() - 0.5))

  const handleErrorClick = (idx) => {
    if (submitted || matches[idx] !== undefined) return
    setSelectedError(idx === selectedError ? null : idx)
  }

  const handleCorrectionClick = (correction) => {
    if (submitted || selectedError === null) return
    setMatches({ ...matches, [selectedError]: correction })
    setSelectedError(null)
  }

  const allMatched = Object.keys(matches).length === PAIRS.length

  const handleSubmit = async () => {
    let correct = 0
    PAIRS.forEach((p, i) => { if (matches[i] === p.correction) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'C', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const isUsed = (correction) => Object.values(matches).includes(correction)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Error Matching Game</Typography>
        <Typography variant="body1">Match 8 report errors to their correct alternatives</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Error Matching Game! On the left are 8 error types found in a report. On the right are the correct alternatives. Click an error, then click its correction to match them!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">Click an error on the left, then click the correct alternative on the right to match them.</Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Errors column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">Report Errors:</Typography>
          <Stack spacing={1}>
            {PAIRS.map((p, idx) => {
              const isMatched = matches[idx] !== undefined
              const isCorrectMatch = submitted && matches[idx] === p.correction
              const isWrongMatch = submitted && isMatched && matches[idx] !== p.correction
              return (
                <Paper key={idx} onClick={() => handleErrorClick(idx)} elevation={1}
                  sx={{
                    p: 1.5, borderRadius: 1, cursor: isMatched ? 'default' : 'pointer', border: '2px solid',
                    borderColor: isCorrectMatch ? 'success.main' : isWrongMatch ? 'error.main' : selectedError === idx ? 'warning.main' : isMatched ? 'success.light' : '#e0e0e0',
                    backgroundColor: isCorrectMatch ? '#e8f8f0' : isWrongMatch ? '#fde8e8' : selectedError === idx ? '#fff9c4' : isMatched ? '#f0fdf4' : 'white'
                  }}>
                  <Typography variant="body2" fontWeight="bold" color="error.dark">{p.error}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.errorType}</Typography>
                  {isMatched && <Typography variant="caption" sx={{ display: 'block', color: isCorrectMatch ? 'success.main' : 'error.main' }}>→ {matches[idx]}</Typography>}
                </Paper>
              )
            })}
          </Stack>
        </Box>

        {/* Corrections column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">Correct Alternatives:</Typography>
          <Stack spacing={1}>
            {shuffledCorrections.map((correction) => {
              const used = isUsed(correction)
              return (
                <Chip
                  key={correction}
                  label={correction}
                  onClick={() => handleCorrectionClick(correction)}
                  color={used ? 'success' : selectedError !== null ? 'primary' : 'default'}
                  variant={used ? 'filled' : 'outlined'}
                  disabled={submitted || used}
                  sx={{ justifyContent: 'flex-start', cursor: 'pointer', fontSize: '0.875rem', height: 40 }}
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
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task C Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{PAIRS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 7 ? 'Excellent! You can identify and correct all report error types.' : score >= 5 ? 'Good work! Review the correct matches above.' : 'Good effort! Focus on recognizing formality, tense, and vocabulary issues.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Continue to Sub-Phase 2 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
