import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1 - Remedial B2 - Task B: Instruction Odyssey
 * Write an 8-sentence set of instructions for one volunteer role
 */

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Welcome step', example: 'First, warmly welcome guests.' },
  { id: 2, question: 'Ticket check', example: 'Then, politely check tickets.' },
  { id: 3, question: 'Direct to booths', example: 'Guide them to the correct booth.' },
  { id: 4, question: 'Safety reminder', example: 'Remind everyone to be careful.' },
  { id: 5, question: 'Offer help', example: 'Offer help if they have questions.' },
  { id: 6, question: 'Manage queue', example: 'Keep the queue organized.' },
  { id: 7, question: 'Thank them', example: 'Thank guests for coming.' },
  { id: 8, question: 'Final note', example: 'Smile and stay positive.' }
]

export default function Phase5SubPhase2Step1RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 2, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < 7) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleSubmit = async () => {
    // Evaluate: each sentence should have 8+ words, use sequencing, and polite language
    let correctCount = 0
    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      const lowerAnswer = answer.toLowerCase()
      const hasSequencing = lowerAnswer.includes('first') || lowerAnswer.includes('then') || lowerAnswer.includes('after')
      const hasPolite = lowerAnswer.includes('please') || lowerAnswer.includes('thank you')
      if (words.length >= 8 && hasSequencing && hasPolite) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_b2_taskB_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(1, 'B2', 'B', correctCount, 8, 2) // subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/1/remedial/b2/task/c')
  }

  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Instruction Odyssey</Typography>
        <Typography variant="body1">Write an 8-sentence set of instructions for one volunteer role. Create clear, polite, well-sequenced instructions!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Instruction Odyssey! Write 8 sentences giving detailed instructions to volunteers. Each sentence should have at least 8 words, use sequencing words (first, then, after), and include polite language (please, thank you)." />
      </Paper>

      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Question {currentIndex + 1} of 8</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">{GUIDED_QUESTIONS[currentIndex].question}</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Write your sentence here..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
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
