import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const CRITIQUE_ITEMS = [
  { id: 1, element: 'Panic tone', critique: 'Escalates anxiety; fix: Adopt calm, reassuring tone.' },
  { id: 2, element: 'Vague timeline', critique: 'Increases uncertainty; fix: Provide specific ETA.' },
  { id: 3, element: 'Missing reassurance', critique: 'Erodes trust; fix: Include "thank you for your patience".' },
  { id: 4, element: 'Overly technical jargon', critique: 'Confuses audience; fix: Use clear language.' },
  { id: 5, element: 'No stakeholder differentiation', critique: 'Ineffective; fix: Tailor messages (audience vs sponsors).' },
  { id: 6, element: 'Weak closing', critique: 'Leaves negative impression; fix: End positively with commitment.' }
]

export default function Phase5Step5RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 4, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (value) => {
    const newCritiques = [...critiques]
    newCritiques[currentIndex] = value
    setCritiques(newCritiques)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    critiques.forEach((critique, idx) => {
      const words = critique.trim().split(/\s+/).filter(w => w.length > 0)
      const expectedWords = CRITIQUE_ITEMS[idx].critique.toLowerCase().split(' ')
      const hasKeyWords = expectedWords.slice(0, 3).some(word => critique.toLowerCase().includes(word))
      if (words.length >= 10 && hasKeyWords) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_c1_taskD_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(5, 'C1', 'D', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskD_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore
    const maxScore = 3 + 6 + 6 + 6
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold

    try {
      await phase5API.calculateRemedialScore(5, 'C1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/5/remedial/c1/task/a')
    }
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task D: Critique Kahoot</Typography>
        <Typography variant="body1">Critique/fix 6 advanced error types in crisis texts</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Kahoot! Provide nuanced critiques for each error type, showing both the problem and the solution!" />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Element {currentIndex + 1} of 6</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">Error Element: {CRITIQUE_ITEMS[currentIndex].element}</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example critique:</strong> {CRITIQUE_ITEMS[currentIndex].critique}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Write your nuanced critique here (10+ words, explain problem and solution)..." value={critiques[currentIndex]} onChange={(e) => handleCritiqueChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!critiques[currentIndex].trim()}>Submit All</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!critiques[currentIndex].trim()}>Next →</Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task D Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>All C1 remedial tasks completed! Calculating final score...</Typography>
          </Paper>
          <Button variant="contained" color="success" onClick={handleContinue} size="large" fullWidth>Continue to Final Results →</Button>
        </>
      )}
    </Box>
  )
}
