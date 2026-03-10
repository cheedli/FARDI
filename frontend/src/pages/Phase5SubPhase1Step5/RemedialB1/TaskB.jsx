import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const FAULTY_SENTENCES = [
  { id: 1, faulty: 'Lights problem bad.', correct: 'There is a lighting problem.' },
  { id: 2, faulty: 'We use backup.', correct: 'We are using backup lights.' },
  { id: 3, faulty: 'Festival ok.', correct: 'The festival will be ok.' },
  { id: 4, faulty: 'Announce people.', correct: 'We announce to people.' },
  { id: 5, faulty: 'Thank patience.', correct: 'Thank you for your patience.' },
  { id: 6, faulty: 'Fix soon.', correct: 'We will fix it soon.' },
  { id: 7, faulty: 'Update later.', correct: 'We will give an update later.' },
  { id: 8, faulty: 'Sorry problem.', correct: 'We are sorry for the problem.' }
]

export default function Phase5Step5RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'remedial_b1' })
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
    answers.forEach((answer, idx) => {
      const correct = FAULTY_SENTENCES[idx].correct.toLowerCase()
      const normalized = answer.toLowerCase().trim()
      if (normalized.includes(correct.split(' ').slice(0, 3).join(' ')) || normalized === correct) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_b1_taskB_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(5, 'B1', 'B', correctCount, 8, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/remedial/b1/task/c')
  }

  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Definition Duel</Typography>
        <Typography variant="body1">Correct 8 faulty sentences for coherence/vocabulary/tone</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Correct each faulty sentence for coherence, vocabulary, and polite tone!" />
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
            <Typography variant="h6" gutterBottom color="error">Faulty: "{FAULTY_SENTENCES[currentIndex].faulty}"</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example:</strong> {FAULTY_SENTENCES[currentIndex].correct}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={2} variant="outlined" placeholder="Write the corrected sentence here..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
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
