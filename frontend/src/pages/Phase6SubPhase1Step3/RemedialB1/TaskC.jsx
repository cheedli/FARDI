import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level B1 - Task C
 * Quiz Game: Answer 6 multiple-choice questions on report terms
 */

const QUESTIONS = [
  {
    question: 'What does "success" mean?',
    options: ['Good result', 'A big problem', 'A list of names'],
    correct: 0,
    explanation: 'Success = Good result. When things go well, it is a success!'
  },
  {
    question: 'What does "challenge" mean?',
    options: ['Easy activity', 'Difficult thing', 'Happy feeling'],
    correct: 1,
    explanation: 'Challenge = Difficult thing. A challenge is something hard to deal with.'
  },
  {
    question: 'What does "feedback" mean?',
    options: ['A type of music', 'A new game', 'Opinion'],
    correct: 2,
    explanation: 'Feedback = Opinion. Feedback is what people think or say about the event.'
  },
  {
    question: 'What does "improve" mean?',
    options: ['Make better', 'Write a list', 'Ask a question'],
    correct: 0,
    explanation: 'Improve = Make better. We improve when we do something better than before.'
  },
  {
    question: 'What does "strength" mean?',
    options: ['A weakness', 'Good skill', 'A problem'],
    correct: 1,
    explanation: 'Strength = Good skill. A strength is something we are good at.'
  },
  {
    question: 'What does "recommend" mean?',
    options: ['Find an error', 'Write a summary', 'Suggest better'],
    correct: 2,
    explanation: 'Recommend = Suggest better. When you recommend, you suggest something for next time.'
  }
]

export default function Phase6SP1Step3RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_b1_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'B1', 'C', correct, QUESTIONS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level B1</Typography>
        <Typography variant="h6">Task C: Quiz Game</Typography>
        <Typography variant="body1">Answer 6 questions on report terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Quiz time! Choose the correct meaning for each report term. Read carefully and select the best answer." />
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, idx) => {
          const isCorrect = submitted && parseInt(answers[idx]) === q.correct
          const isWrong = submitted && parseInt(answers[idx]) !== q.correct
          return (
            <Paper key={idx} elevation={1} sx={{
              p: 2.5, borderRadius: 2,
              border: submitted ? '2px solid' : '1px solid #e0e0e0',
              borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : '#e0e0e0',
              backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white'
            }}>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
              <RadioGroup value={answers[idx] !== undefined ? answers[idx].toString() : ''} onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}>
                {q.options.map((opt, oi) => (
                  <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} />}
                    label={<Typography variant="body2" sx={{ color: submitted && oi === q.correct ? '#27ae60' : 'inherit', fontWeight: submitted && oi === q.correct ? 'bold' : 'normal' }}>{opt}</Typography>} />
                ))}
              </RadioGroup>
              {submitted && (
                <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 1, py: 0.5 }}>
                  <Typography variant="body2">{q.explanation}</Typography>
                </Alert>
              )}
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task C Complete! Score: {score}/{QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Continue to Next Phase →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
