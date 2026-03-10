import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const SENTENCES = [
  { faulty: 'Report bad.', model: 'Your report is good.', keyWord: 'good' },
  { faulty: 'Add more.', model: 'Please add more.', keyWord: 'please' },
  { faulty: 'Thank.', model: 'Thank you.', keyWord: 'thank' },
  { faulty: 'No good.', model: 'It is nice.', keyWord: 'nice' },
  { faulty: 'Improv.', model: 'You can improve.', keyWord: 'improve' },
  { faulty: 'Sugestion.', model: 'Suggestion: add...', keyWord: 'suggestion' }
]

export default function Phase6SP2Step5RemA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_a2' })
  const [inputs, setInputs] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState({})

  const handleChange = (idx, value) => {
    if (submitted) return
    setInputs(prev => ({ ...prev, [idx]: value }))
  }

  const handleSubmit = async () => {
    let correct = 0
    const newResults = {}
    SENTENCES.forEach((s, i) => {
      const userAnswer = (inputs[i] || '').trim().toLowerCase()
      const passes = userAnswer.includes(s.keyWord.toLowerCase())
      newResults[i] = passes
      if (passes) correct++
    })
    setScore(correct)
    setResults(newResults)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'C', correct, SENTENCES.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = SENTENCES.every((_, i) => (inputs[i] || '').trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial A2 - Task C</Typography>
        <Typography variant="body1">Sentence Builder: Correct the Feedback</Typography>
      </Paper>

      {!submitted && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Each sentence below uses poor or faulty feedback language. Rewrite it as polite, correct feedback.
        </Alert>
      )}

      <Stack spacing={3} sx={{ mb: 3 }}>
        {SENTENCES.map((s, idx) => {
          const isCorrect = submitted && results[idx] === true
          const isWrong = submitted && results[idx] === false
          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '2px solid',
                borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : '#e0e0e0',
                backgroundColor: isCorrect ? '#e8f8f0' : isWrong ? '#fdecea' : 'white'
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Faulty sentence:
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="error.dark" sx={{ mb: 2 }}>
                "{s.faulty}"
              </Typography>
              <TextField
                fullWidth
                label={`${idx + 1}. Your correction`}
                value={inputs[idx] || ''}
                onChange={(e) => handleChange(idx, e.target.value)}
                disabled={submitted}
                placeholder="Type the corrected sentence..."
                variant="outlined"
                size="small"
              />
              {submitted && (
                <Box sx={{ mt: 1.5 }}>
                  {isCorrect ? (
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      Correct! Your answer contains the key improvement word.
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error.main">
                      Model answer: <strong>"{s.model}"</strong> (key word: <em>{s.keyWord}</em>)
                    </Typography>
                  )}
                </Box>
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
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Corrections
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Sentence Builder Complete! Score: {score}/{SENTENCES.length}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b1/task/a')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Remedial B1
          </Button>
        </Paper>
      )}
    </Box>
  )
}
