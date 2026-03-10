import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Alert
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level B2 - Task D
 * Spelling & Explain: Spell and explain 6 report terms
 * Scoring: 1 point if spelling correct + explanation >= 3 words. Max = 6.
 */

const TERMS = [
  { term: 'success', hint: 'Positive result' },
  { term: 'challenge', hint: 'Difficulty' },
  { term: 'feedback', hint: 'Comments' },
  { term: 'improve', hint: 'Do better' },
  { term: 'recommend', hint: 'Suggest' },
  { term: 'summary', hint: 'Short report' }
]

const PURPLE_GRADIENT = 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)'

export default function Phase6SP1Step3RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(TERMS.length).fill(''))
  const [explanations, setExplanations] = useState(Array(TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])

  const handleSpellingChange = (idx, val) => {
    const updated = [...spellings]
    updated[idx] = val
    setSpellings(updated)
  }

  const handleExplanationChange = (idx, val) => {
    const updated = [...explanations]
    updated[idx] = val
    setExplanations(updated)
  }

  const handleSubmit = async () => {
    const itemResults = TERMS.map((t, i) => {
      const spellingCorrect = spellings[i].trim().toLowerCase() === t.term
      const explanationWords = explanations[i].trim().split(/\s+/).filter(w => w.length > 0).length
      const explanationValid = explanationWords >= 3
      return {
        spellingCorrect,
        explanationValid,
        point: spellingCorrect && explanationValid ? 1 : 0
      }
    })

    const total = itemResults.reduce((sum, r) => sum + r.point, 0)
    setResults(itemResults)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_b2_taskd_score', total.toString())
    try {
      await phase6API.logRemedialActivity(3, 'B2', 'D', total, 6, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && explanations.every(e => e.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: PURPLE_GRADIENT, color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Step 3: Remedial B2 - Task D
        </Typography>
        <Typography variant="h6">Spell &amp; Report Quest</Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
          Spell each report term correctly and write a brief explanation (minimum 3 words) for each.
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        For each term: (1) Type the correct spelling, (2) Write an explanation of at least 3 words. You earn 1 point per term only when both are correct.
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {TERMS.map((t, idx) => {
          const result = results[idx]
          const isCorrect = submitted && result.point === 1
          const isWrong = submitted && result.point === 0

          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: submitted ? '2px solid' : '1px solid #e0e0e0',
                borderColor: submitted
                  ? isCorrect
                    ? '#8e44ad'
                    : '#f44336'
                  : '#e0e0e0',
                backgroundColor: submitted
                  ? isCorrect
                    ? '#f9f0ff'
                    : '#fff5f5'
                  : 'white'
              }}
            >
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#8e44ad', mb: 1.5 }}>
                Term {idx + 1}
                {submitted && (
                  <Typography component="span" variant="body2" sx={{ ml: 1, color: isCorrect ? '#8e44ad' : '#f44336', fontWeight: 'bold' }}>
                    {isCorrect ? '(+1 point)' : '(0 points)'}
                  </Typography>
                )}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                  Spelling:
                </Typography>
                <TextField
                  size="small"
                  value={spellings[idx]}
                  onChange={(e) => handleSpellingChange(idx, e.target.value)}
                  disabled={submitted}
                  placeholder="Type the correct spelling..."
                  sx={{ minWidth: 220, backgroundColor: 'white' }}
                />
                {submitted && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: result.spellingCorrect ? '#8e44ad' : '#f44336',
                      fontWeight: 'bold'
                    }}
                  >
                    {result.spellingCorrect ? `Correct: ${t.term}` : `Incorrect — correct spelling: ${t.term}`}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minWidth: 80 }}>
                  Explanation:
                </Typography>
                <TextField
                  size="small"
                  multiline
                  rows={2}
                  value={explanations[idx]}
                  onChange={(e) => handleExplanationChange(idx, e.target.value)}
                  disabled={submitted}
                  placeholder="Write at least 3 words explaining this term..."
                  sx={{ flex: 1, minWidth: 200, backgroundColor: 'white' }}
                />
              </Box>

              {submitted && (
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                  Hint: {t.hint}
                  {!result.explanationValid && (
                    <Typography component="span" sx={{ color: '#f44336', ml: 1 }}>
                      (explanation needs at least 3 words)
                    </Typography>
                  )}
                </Typography>
              )}
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{
            background: PURPLE_GRADIENT,
            '&:hover': { background: 'linear-gradient(135deg, #7d3c98 0%, #5b2c6f 100%)' },
            '&:disabled': { opacity: 0.5 }
          }}
        >
          Submit Spellings &amp; Explanations
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: '#f9f0ff',
            border: '2px solid #8e44ad',
            borderRadius: 2
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }} gutterBottom>
            Task D Complete! Score: {score} / 6
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            {score === 6
              ? 'Perfect! You spelled and explained all 6 terms correctly.'
              : score >= 4
              ? 'Well done! You got most of the terms right.'
              : 'Keep practising — spelling and clear explanations will strengthen your reports.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/3/remedial/c1/task/a')}
            size="large"
            sx={{
              background: PURPLE_GRADIENT,
              '&:hover': { background: 'linear-gradient(135deg, #7d3c98 0%, #5b2c6f 100%)' }
            }}
          >
            Continue to C1 Task A
          </Button>
        </Paper>
      )}
    </Box>
  )
}
