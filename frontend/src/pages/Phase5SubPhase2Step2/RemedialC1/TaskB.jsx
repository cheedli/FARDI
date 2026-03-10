import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 2 - Remedial C1 - Task B: Instruction Odyssey
 * Write an 8-sentence set of professional instructions for volunteers
 */

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Opening greeting', example: 'Begin with warm, inclusive welcome.' },
  { id: 2, question: 'Role clarity', example: 'Clearly define responsibilities.' },
  { id: 3, question: 'Sequencing', example: 'Use logical sequencing words.' },
  { id: 4, question: 'Politeness', example: 'Consistently use polite language.' },
  { id: 5, question: 'Safety emphasis', example: 'Prioritize safety reminders.' },
  { id: 6, question: 'Empathy', example: 'Encourage empathy toward guests.' },
  { id: 7, question: 'Support', example: 'Offer support channels.' },
  { id: 8, question: 'Appreciation', example: 'End with sincere appreciation.' }
]

export default function Phase5SubPhase2Step2RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 2, context: 'remedial_c1' })
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
    // Evaluate: each sentence should have 10+ words, show professional tone, empathy, sequencing
    let correctCount = 0
    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      const lowerAnswer = answer.toLowerCase()
      const hasSequencing = lowerAnswer.includes('first') || lowerAnswer.includes('then') || lowerAnswer.includes('next') || lowerAnswer.includes('after')
      const hasPolite = lowerAnswer.includes('please') || lowerAnswer.includes('thank you') || lowerAnswer.includes('appreciate')
      const hasAdvanced = lowerAnswer.includes('inclusive') || lowerAnswer.includes('empathy') || lowerAnswer.includes('professional') || lowerAnswer.includes('sincere')
      if (words.length >= 10 && hasSequencing && hasPolite && hasAdvanced) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_c1_taskB_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(2, 'C1', 'B', correctCount, 8, 2) // step 2, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/2/remedial/c1/task/c')
  }

  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 2: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Instruction Odyssey</Typography>
        <Typography variant="body1">Write an 8-sentence set of professional instructions for volunteers. Show professional, empathetic, well-structured writing!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Instruction Odyssey! Write 8 professional sentences giving instructions to volunteers. Each sentence should have at least 10 words, use sequencing, polite language, and show empathy and professionalism." />
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
            <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Write your professional sentence here..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
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
