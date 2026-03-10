import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const ELEMENTS = [
  { id: 1, element: 'Emergency response', exampleCritique: 'Speed essential but must be accurate.' },
  { id: 2, element: 'Contingency', exampleCritique: 'Powerful if tested; useless if neglected.' },
  { id: 3, element: 'Backup', exampleCritique: 'Reliable if maintained.' },
  { id: 4, element: 'Announce', exampleCritique: 'Transparency builds trust; delay causes panic.' },
  { id: 5, element: 'Update', exampleCritique: 'Frequent updates reassure; inaccurate updates destroy credibility.' },
  { id: 6, element: 'Communicate', exampleCritique: 'Calm tone reduces anxiety; poor communication escalates crisis.' }
]

export default function Phase5Step3RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 4, context: 'remedial_c1' })
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
    critiques.forEach(critique => {
      const words = critique.trim().split(/\s+/).filter(w => w.length > 0)
      if (words.length >= 8) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_c1_taskD_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'C1', 'D', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_c1_taskD_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore
    const maxScore = 6 + 8 + 6 + 6
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold

    try {
      await phase5API.calculateRemedialScore(3, 'C1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/3/remedial/c1/task/a')
    }
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task D: Critique Kahoot</Typography>
        <Typography variant="body1">Critique 6 crisis communication elements with nuanced analysis</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Kahoot! Provide nuanced critiques for each crisis communication element. Show both strengths and limitations!" />
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
            <Typography variant="h6" gutterBottom color="primary">Element: {ELEMENTS[currentIndex].element}</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example critique:</strong> {ELEMENTS[currentIndex].exampleCritique}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your nuanced critique here (8+ words)..." value={critiques[currentIndex]} onChange={(e) => handleCritiqueChange(e.target.value)} sx={{ mb: 2 }} />
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
