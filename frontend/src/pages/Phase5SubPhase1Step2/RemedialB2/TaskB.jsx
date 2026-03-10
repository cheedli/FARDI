import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Identify problem.', example: 'Lighting failure.' },
  { id: 2, question: 'Immediate action.', example: 'Deploy backup.' },
  { id: 3, question: 'Inform audience.', example: 'Announce delay.' },
  { id: 4, question: 'Update team.', example: 'Communicate internally.' },
  { id: 5, question: 'Alternative.', example: 'Use phone lights.' },
  { id: 6, question: 'Prevent future.', example: 'Check equipment.' },
  { id: 7, question: 'Thank people.', example: 'Thank patience.' },
  { id: 8, question: 'Follow-up.', example: 'Post success.' }
]

export default function Phase5Step2RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 2, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 7) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      if (words.length >= 8) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step2_remedial_b2_taskB_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(2, 'B2', 'B', correctCount, 8, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/remedial/b2/task/c')
  }

  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Crisis Response Plan</Typography>
        <Typography variant="body1">Write 8-sentence crisis response plan</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Write an 8-sentence crisis response plan with B2 structure and coherent language. Each sentence should be 8+ words." />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Sentence {currentIndex + 1} of 8</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">{GUIDED_QUESTIONS[currentIndex].question}</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your sentence here (8+ words)..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 7 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!answers[currentIndex].trim()}>Submit All</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!answers[currentIndex].trim()}>Next →</Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
