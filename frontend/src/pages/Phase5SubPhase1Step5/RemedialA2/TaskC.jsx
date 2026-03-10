import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const GRAMMAR_EXERCISES = [
  { faulty: 'Lights problem.', correct: 'The lights have problem.' },
  { faulty: 'We use backup.', correct: 'We use the backup.' },
  { faulty: 'Announce now.', correct: 'We announce now.' },
  { faulty: 'Fix fast.', correct: 'We fix fast.' },
  { faulty: 'Thank you.', correct: 'Thank you very much.' },
  { faulty: 'Festival ok.', correct: 'The festival is ok.' }
]

export default function Phase5Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkAnswer = (userAnswer, correct) => {
    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    const correctNormalized = correct.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    return normalized === correctNormalized || normalized.includes(correctNormalized.split(' ').slice(0, 3).join(' '))
  }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const exercise = GRAMMAR_EXERCISES[index]
      const isCorrect = checkAnswer(answer, exercise.correct)
      return { userAnswer: answer, correctAnswer: exercise.correct, isCorrect }
    })

    const correctCount = checkResults.filter(r => r.isCorrect).length
    setResults(checkResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_a2_taskC_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'A2', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold

    try {
      await phase5API.calculateRemedialScore(5, 'A2', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/5/remedial/a2/task/a')
    }
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Sentence Builder</Typography>
        <Typography variant="body1">Correct 6 grammar mistakes in crisis sentences</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Correct the grammar mistakes in each sentence!" />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Sentence {currentIndex + 1} of 6</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">Faulty Sentence:</Typography>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: 'error.main' }}>
              "{GRAMMAR_EXERCISES[currentIndex].faulty}"
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example:</strong> {GRAMMAR_EXERCISES[currentIndex].correct}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={2} variant="outlined" placeholder="Write the corrected sentence here..." value={userAnswers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!userAnswers[currentIndex].trim()}>Submit All Sentences</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!userAnswers[currentIndex].trim()}>Next →</Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h5" gutterBottom color="primary">Results: {score} / 6 Correct</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {results.map((result, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, backgroundColor: result.isCorrect ? 'success.lighter' : 'error.lighter', border: '1px solid', borderColor: result.isCorrect ? 'success.main' : 'error.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {result.isCorrect ? <CheckCircle sx={{ color: 'success.main', mr: 1 }} /> : <Cancel sx={{ color: 'error.main', mr: 1 }} />}
                    <Typography variant="subtitle2" fontWeight="bold">Sentence {index + 1}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Your answer:</strong> {result.userAnswer || '(empty)'}</Typography>
                  {!result.isCorrect && <Typography variant="body2" color="success.dark"><strong>Correct:</strong> {result.correctAnswer}</Typography>}
                </Paper>
              ))}
            </Stack>
          </Paper>
          <Button variant="contained" color="success" onClick={handleContinue} size="large" fullWidth>Continue to Final Results →</Button>
        </>
      )}
    </Box>
  )
}
