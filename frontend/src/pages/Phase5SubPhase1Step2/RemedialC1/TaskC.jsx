import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { id: 1, question: 'Emergency?', options: ['Urgent crisis', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Backup?', options: ['Contingency plan', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Announce?', options: ['Public communication', 'Very important', 'Solve'], correct: 0 },
  { id: 4, question: 'Update?', options: ['Real-time information', 'Apology', 'Stop plan'], correct: 0 },
  { id: 5, question: 'Communicate?', options: ['Clear coordination', 'Fix issue', 'Another option'], correct: 0 },
  { id: 6, question: 'Fix?', options: ['Immediate resolution', 'Apology', 'Stop plan'], correct: 0 }
]

export default function Phase5Step2RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 3, context: 'remedial_c1' })
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
    sessionStorage.setItem('phase5_step2_remedial_c1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(2, 'C1', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/remedial/c1/task/d')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && justifications[q.id]?.trim())

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Advanced Quiz</Typography>
        <Typography variant="body1">Answer quiz on 6 terms with detailed answers</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Advanced Quiz! Answer each question and provide a detailed justification!" />
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
                <TextField fullWidth multiline rows={2} label="Detailed Justification (5+ words)" variant="outlined" value={justifications[q.id] || ''} onChange={(e) => handleJustificationChange(q.id, e.target.value)} />
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
