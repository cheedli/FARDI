import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Emergency identification.', example: 'Quickly identify the problem (e.g., lighting failure).' },
  { id: 2, question: 'Contingency activation.', example: 'Activate backup plan immediately.' },
  { id: 3, question: 'Transparent announcement.', example: 'Announce clearly to audience.' },
  { id: 4, question: 'Frequent updates.', example: 'Provide regular updates.' },
  { id: 5, question: 'Stakeholder communication.', example: 'Inform sponsors and team.' },
  { id: 6, question: 'Calm tone.', example: 'Use calm language to reassure.' },
  { id: 7, question: 'Resolution steps.', example: 'Explain how we fix it.' },
  { id: 8, question: 'Learning outcome.', example: 'Reflect for future prevention.' }
]

export default function Phase5Step3RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 2, context: 'remedial_b2' })
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
    sessionStorage.setItem('phase5_step3_remedial_b2_taskB_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'B2', 'B', correctCount, 8, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/remedial/b2/task/c')
  }

  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Explain Expedition</Typography>
        <Typography variant="body1">Write an 8-sentence explanation of crisis communication elements</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Write an 8-sentence explanation with B2 structure. Each sentence should be 8+ words. Expedition through explanations!" />
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
