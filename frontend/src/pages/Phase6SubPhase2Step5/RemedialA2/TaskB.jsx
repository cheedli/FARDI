import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Chip, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['good', 'please', 'suggestion', 'thank you', 'nice', 'improve', 'positive', 'helpful']

const GAPS = [
  { sentence: 'Your work is ___', answer: 'good' },
  { sentence: '___ add more.', answer: 'please' },
  { sentence: 'My ___ is...', answer: 'suggestion' },
  { sentence: '___!', answer: 'thank you' },
  { sentence: 'It is ___.', answer: 'nice' },
  { sentence: 'You can ___.', answer: 'improve' },
  { sentence: '___ feedback.', answer: 'positive' },
  { sentence: 'Very ___.', answer: 'helpful' }
]

export default function Phase6SP2Step5RemA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const usedWords = new Set(Object.values(answers))

  const handleWordClick = (word) => {
    if (submitted) return
    // Find first unfilled gap
    const firstEmpty = GAPS.findIndex((_, i) => !answers[i])
    if (firstEmpty === -1) return
    if (usedWords.has(word)) return
    setAnswers(prev => ({ ...prev, [firstEmpty]: word }))
  }

  const handleRemoveAnswer = (gapIdx) => {
    if (submitted) return
    setAnswers(prev => {
      const next = { ...prev }
      delete next[gapIdx]
      return next
    })
  }

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach((g, i) => { if (answers[i] === g.answer) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = Object.keys(answers).length === GAPS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial A2 - Task B</Typography>
        <Typography variant="body1">Fill Quest: Complete the Polite Phrases</Typography>
      </Paper>

      {!submitted && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Click a word from the word bank to place it in the next empty gap. Click a filled gap to remove its answer.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Word Bank</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {WORD_BANK.map((word) => (
            <Chip
              key={word}
              label={word}
              onClick={() => handleWordClick(word)}
              disabled={submitted || usedWords.has(word)}
              color={usedWords.has(word) ? 'default' : 'secondary'}
              variant={usedWords.has(word) ? 'outlined' : 'filled'}
              sx={{ cursor: submitted || usedWords.has(word) ? 'default' : 'pointer', fontWeight: 'bold' }}
            />
          ))}
        </Stack>
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {GAPS.map((g, idx) => {
          const filled = answers[idx]
          const isCorrect = submitted && filled === g.answer
          const isWrong = submitted && filled !== g.answer
          const display = g.sentence.replace('___', filled ? `[${filled}]` : '[___]')
          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : filled ? '#8e44ad' : '#e0e0e0',
                backgroundColor: isCorrect ? '#e8f8f0' : isWrong ? '#fdecea' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Typography variant="body1" fontWeight="medium">
                {idx + 1}. {display}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                {filled && !submitted && (
                  <Chip
                    label={`Remove "${filled}"`}
                    size="small"
                    onDelete={() => handleRemoveAnswer(idx)}
                    color="secondary"
                    variant="outlined"
                  />
                )}
                {isWrong && (
                  <Typography variant="body2" color="error.main">
                    Correct: <strong>{g.answer}</strong>
                  </Typography>
                )}
              </Stack>
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
          Submit ({Object.keys(answers).length}/{GAPS.length} filled)
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Fill Quest Complete! Score: {score}/{GAPS.length}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/a2/task/c')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task C
          </Button>
        </Paper>
      )}
    </Box>
  )
}
