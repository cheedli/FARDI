import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const ERROR_SENTENCES = [
  { id: 1, incorrect: 'Alternative is found quick', correct: 'Alternative is found quickly', error: 'quick → quickly (adverb)' },
  { id: 2, incorrect: 'Apology send to audience', correct: 'Apology is sent to audience', error: 'send → is sent (passive)' },
  { id: 3, incorrect: 'Schedule change minimize disruption', correct: 'Schedule change minimizes disruption', error: 'minimize → minimizes (3rd person)' },
  { id: 4, incorrect: 'Team inform early', correct: 'Team is informed early', error: 'inform → is informed (passive)' },
  { id: 5, incorrect: 'Damage mitigate effectively', correct: 'Damage is mitigated effectively', error: 'mitigate → is mitigated (passive)' },
  { id: 6, incorrect: 'Contingency plan prevent crisis', correct: 'Contingency plan prevents crisis', error: 'prevent → prevents (3rd person)' }
]

export default function Phase5Step1RemedialC1TaskH() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 8, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [corrections, setCorrections] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCorrectionChange = (value) => {
    const newCorrections = [...corrections]
    newCorrections[currentIndex] = value
    setCorrections(newCorrections)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    ERROR_SENTENCES.forEach((sent, idx) => {
      const correction = corrections[idx].toLowerCase().trim()
      const correct = sent.correct.toLowerCase()
      // Check if correction includes key corrected elements
      if (correction.includes(correct.split(' ')[0]) && correction.length >= sent.correct.length * 0.7) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_c1_taskH_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'C1', 'H', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total C1 score
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskF_score') || '0')
    const taskGScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskG_score') || '0')
    const taskHScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_c1_taskH_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const maxScore = 7 + 8 + 6 + 6 + 6 + 6 + 6 + 6 // 51 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 41
    const passed = totalScore >= threshold

    try {
      await phase5API.calculateRemedialScore(1, 'C1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore,
        task_e_score: taskEScore, task_f_score: taskFScore, task_g_score: taskGScore, task_h_score: taskHScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/1/remedial/c1/task/a')
    }
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task H: Correction Crusade</Typography>
        <Typography variant="body1">Correct errors in 6 advanced sentences</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Correction Crusade! Correct the errors in each sentence. Look for grammar, spelling, and structure mistakes!" />
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
            <Typography variant="h6" gutterBottom color="error">Incorrect: {ERROR_SENTENCES[currentIndex].incorrect}</Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Error:</strong> {ERROR_SENTENCES[currentIndex].error}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={2} variant="outlined" label="Corrected sentence" placeholder="Write the corrected sentence here..." value={corrections[currentIndex]} onChange={(e) => handleCorrectionChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!corrections[currentIndex].trim()}>Submit All</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!corrections[currentIndex].trim()}>Next →</Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task H Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>All C1 remedial tasks completed! Calculating final score...</Typography>
          </Paper>
          <Button variant="contained" color="success" onClick={handleContinue} size="large" fullWidth>Continue to Final Results →</Button>
        </>
      )}
    </Box>
  )
}
