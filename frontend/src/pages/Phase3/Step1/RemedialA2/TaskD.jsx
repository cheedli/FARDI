import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, TextField, MenuItem, Select, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level A2 - Task D: Choose the Correct Word
 * Select the correct financial vocabulary word for each context sentence
 */

const QUESTIONS = [
  {
    id: 1,
    sentence: 'We need a ____ to pay for the event costs.',
    options: ['sponsor', 'ticket', 'sketch'],
    answer: 'sponsor'
  },
  {
    id: 2,
    sentence: 'The ____ tells us how much money we can spend.',
    options: ['jingle', 'budget', 'layout'],
    answer: 'budget'
  },
  {
    id: 3,
    sentence: 'People buy a ____ to enter the festival.',
    options: ['ticket', 'slogan', 'clip'],
    answer: 'ticket'
  },
  {
    id: 4,
    sentence: 'The event made a lot of ____ from selling tickets.',
    options: ['animation', 'income', 'poster'],
    answer: 'income'
  },
]

export default function Phase3RemedialA2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 4, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const isComplete = QUESTIONS.every(q => answers[q.id])

  const handleSubmit = () => {
    setShowResults(true)
    const score = QUESTIONS.filter(q => answers[q.id] === q.answer).length
    logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'D', score, max_score: QUESTIONS.length, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const score = showResults ? QUESTIONS.filter(q => answers[q.id] === q.answer).length : 0

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>Phase 3 - Remedial Practice</Typography>
        <Typography variant="h6">Level A2 - Task D: Choose the Correct Word</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Almost done! Choose the correct word to complete each sentence. You can do it!"
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Select the correct word from the dropdown to complete each sentence.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        {QUESTIONS.map((q, index) => {
          const userAnswer = answers[q.id]
          const isCorrect = showResults && userAnswer === q.answer
          const isWrong = showResults && userAnswer && userAnswer !== q.answer
          const parts = q.sentence.split('____')

          return (
            <Paper key={q.id} elevation={2} sx={{ p: 3, mb: 2, border: '2px solid', borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'divider', bgcolor: isCorrect ? 'success.lighter' : isWrong ? 'error.lighter' : 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" component="span">{index + 1}.</Typography>
                <Typography variant="h6" component="span">{parts[0]}</Typography>
                <FormControl size="small">
                  <Select
                    value={userAnswer || ''}
                    onChange={e => !showResults && setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    displayEmpty
                    disabled={showResults}
                    sx={{
                      minWidth: 140,
                      bgcolor: isCorrect ? 'success.light' : isWrong ? 'error.light' : 'background.paper',
                      fontWeight: 600,
                    }}
                  >
                    <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                    {q.options.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="h6" component="span">{parts[1]}</Typography>
                {isCorrect && <CheckCircleIcon color="success" />}
              </Box>
              {isWrong && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Correct answer: <strong>{q.answer}</strong>
                </Alert>
              )}
            </Paper>
          )
        })}
      </Box>

      {showResults && (
        <Alert severity={score === QUESTIONS.length ? 'success' : 'info'} sx={{ mb: 3 }}>
          <Typography variant="h6">
            {score === QUESTIONS.length
              ? `Perfect score! ${score}/${QUESTIONS.length} — Great work on A2 remedial!`
              : `Score: ${score}/${QUESTIONS.length} — Keep practicing!`}
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {!showResults ? (
          <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={!isComplete}>
            Submit Answers
          </Button>
        ) : (
          <Button variant="contained" color="success" size="large" onClick={() => navigate('/app/dashboard')} endIcon={<ArrowForwardIcon />}>
            Complete A2 Tasks
          </Button>
        )}
      </Box>
    </Box>
  )
}
