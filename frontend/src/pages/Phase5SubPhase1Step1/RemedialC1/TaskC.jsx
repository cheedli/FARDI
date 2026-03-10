import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { id: 1, question: 'Alternative?', options: ['Substitute option', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Urgent?', options: ['Immediate action', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Solution?', options: ['Problem resolution', 'Stop plan', 'Another choice'], correct: 0 },
  { id: 4, question: 'Apology?', options: ['Expression of regret', 'Very important', 'Solve'], correct: 0 },
  { id: 5, question: 'Mitigate?', options: ['Reduce impact', 'Apology', 'Stop plan'], correct: 0 },
  { id: 6, question: 'Contingency?', options: ['Backup plan', 'Fix issue', 'Another option'], correct: 0 }
]

export default function Phase5Step1RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  }

  const handleJustificationChange = (questionId, value) => {
    setJustifications(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct && justifications[q.id]?.trim().length >= 5) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_c1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'C1', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/c1/task/d')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && justifications[q.id]?.trim())

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Quizlet Live</Typography>
        <Typography variant="body1">Answer quiz on 6 problem-solving terms with justifications</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quizlet Live! Answer each question and provide a brief justification for your answer!" />
      </Paper>
      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {QUESTIONS.map((q) => (
              <Paper key={q.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Question {q.id}: {q.question}</Typography>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                    {q.options.map((option, idx) => (
                      <FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />
                    ))}
                  </RadioGroup>
                </FormControl>
                <TextField fullWidth multiline rows={2} label="Justification (5+ words)" variant="outlined" value={justifications[q.id] || ''} onChange={(e) => handleJustificationChange(q.id, e.target.value)} />
              </Paper>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allAnswered} size="large" fullWidth>Submit Answers</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task C Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task D →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
