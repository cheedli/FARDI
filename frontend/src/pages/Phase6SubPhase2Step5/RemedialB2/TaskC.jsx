import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PAIRS = [
  {
    error: '"Your reprot is good."',
    correct: '"Your report demonstrates a strong command of formal register."',
  },
  {
    error: '"The chalenge part is ok."',
    correct: '"The Challenges section provides an honest account of the difficulties encountered."',
  },
  {
    error: '"You should recomend better things."',
    correct: '"I recommend including more specific, measurable targets in the Recommendations section."',
  },
  {
    error: '"The feedbak is nice."',
    correct: '"The feedback is well-structured and demonstrates careful attention to the positive sandwich approach."',
  },
  {
    error: '"Do better on grammer."',
    correct: '"To enhance grammatical accuracy, I suggest reviewing subject-verb agreement throughout."',
  },
  {
    error: '"The sucesses are good but short."',
    correct: '"The Successes section is well-identified; further development with specific data would strengthen its impact."',
  },
]

// Build shuffled options list (all correct versions)
const ALL_OPTIONS = PAIRS.map(p => p.correct)

export default function Phase6SP2Step5RemB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_b2' })
  const [selections, setSelections] = useState(Array(PAIRS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (index, value) => {
    setSelections(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const allFilled = selections.every(s => s !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = selections.filter((s, i) => s === PAIRS[i].correct).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial B2 — Task C</Typography>
        <Typography variant="body1">Error Matching Game — Match Each Flawed Sentence to Its Corrected Version</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
          Instructions: For each flawed feedback sentence, select the correct formal version from the dropdown. Each correct version is used only once.
        </Typography>
      </Paper>

      {PAIRS.map((pair, index) => {
        const userSelection = selections[index]
        const isCorrect = submitted && userSelection === pair.correct
        const isWrong = submitted && userSelection !== pair.correct

        return (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3, mb: 2, borderRadius: 2,
              border: submitted
                ? isCorrect ? '2px solid #27ae60' : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#8e44ad', fontWeight: 'bold', mb: 1 }}>
              Sentence {index + 1}
            </Typography>

            <Paper elevation={0} sx={{ p: 2, bgcolor: '#fdecea', borderRadius: 1, mb: 2, border: '1px solid #f5b7b1' }}>
              <Typography variant="body2" sx={{ color: '#922b21', fontWeight: 'bold' }}>Flawed version:</Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mt: 0.5 }}>{pair.error}</Typography>
            </Paper>

            <FormControl fullWidth disabled={submitted}>
              <InputLabel>Select the correct version</InputLabel>
              <Select
                value={userSelection}
                label="Select the correct version"
                onChange={e => handleChange(index, e.target.value)}
                sx={{
                  bgcolor: submitted
                    ? isCorrect ? '#e8f5e9' : '#fdecea'
                    : 'white'
                }}
              >
                {ALL_OPTIONS.map((opt, oi) => (
                  <MenuItem key={oi} value={opt} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <Typography variant="body2">{opt}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {submitted && (
              <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
                {isCorrect
                  ? 'Correct match!'
                  : (
                    <>
                      <Typography variant="body2" fontWeight="bold">Incorrect.</Typography>
                      <Typography variant="body2">The correct match is: {pair.correct}</Typography>
                    </>
                  )}
              </Alert>
            )}
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Matches
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2, mt: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task C Complete! Score: {score}/6</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 6
              ? 'Perfect! You matched all flawed sentences to their correct formal versions.'
              : score >= 4
              ? 'Good work! Review the mismatched pairs above to consolidate your understanding.'
              : 'Keep practising — focus on identifying spelling errors, vague language, and informal register.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/complete')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Complete SubPhase 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
