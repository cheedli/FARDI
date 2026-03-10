import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 2 - Remedial B1 - Task B: Instruction Builder
 * Write 6 sentences giving instructions to volunteers
 * Score: +1 for each correct sentence (6 total)
 */

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Welcome guests?', example: 'Please welcome guests with a smile.' },
  { id: 2, question: 'Check ticket?', example: 'First, check their ticket.' },
  { id: 3, question: 'Guide way?', example: 'Then, guide them to booths.' },
  { id: 4, question: 'Be careful?', example: 'Be careful with queues.' },
  { id: 5, question: 'Help people?', example: 'Help people if they ask.' },
  { id: 6, question: 'Thank you?', example: 'Say thank you at the end.' }
]

export default function Phase5SubPhase2Step2RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 2, context: 'remedial_b1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < 5) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleSubmit = async () => {
    // Evaluate: each sentence should have 5+ words and show B1 grammar with polite language
    let correctCount = 0
    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      const lowerAnswer = answer.toLowerCase()
      const hasPolite = lowerAnswer.includes('please') || lowerAnswer.includes('thank you')
      const hasSequencing = lowerAnswer.includes('first') || lowerAnswer.includes('then')
      if (words.length >= 5 && (hasPolite || hasSequencing)) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_b1_taskB_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(2, 'B1', 'B', correctCount, 6, 2) // step 2, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/2/remedial/b1/task/c')
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 2: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Instruction Builder</Typography>
        <Typography variant="body1">Write 6 sentences giving instructions to volunteers. Build instructions like puzzle pieces!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Instruction Builder! Write sentences giving instructions to volunteers. Each sentence should have at least 5 words and use polite language (please/thank you) or sequencing words (first/then)." />
      </Paper>

      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Question {currentIndex + 1} of 6</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">{GUIDED_QUESTIONS[currentIndex].question}</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your sentence here..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
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
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
