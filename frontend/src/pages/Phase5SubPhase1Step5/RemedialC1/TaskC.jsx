import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { id: 1, faulty: 'Contingency plan are activated', error: 'Agreement', correct: 'Contingency plan is activated' },
  { id: 2, faulty: 'Backup which fail', error: 'Relative clause', correct: 'Backup that failed' },
  { id: 3, faulty: 'Announce must be fast', error: 'Tense', correct: 'Announcement must be immediate' },
  { id: 4, faulty: 'Update is sent', error: 'Passive', correct: 'Updates are being sent' },
  { id: 5, faulty: 'Solution will prevent', error: 'Connectors', correct: 'Solution will therefore prevent' },
  { id: 6, faulty: 'Communicate with team', error: 'Tone', correct: 'We must communicate transparently with the team' }
]

export default function Phase5Step5RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [corrections, setCorrections] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleCorrectionChange = (questionId, value) => {
    setCorrections(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => {
      const answerCorrect = answers[q.id]?.toLowerCase().trim() === q.error.toLowerCase()
      const correctionCorrect = corrections[q.id]?.toLowerCase().includes(q.correct.toLowerCase().split(' ').slice(0, 3).join(' '))
      if (answerCorrect && correctionCorrect) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_c1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(5, 'C1', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/remedial/c1/task/d')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] && corrections[q.id])

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Quizlet Live</Typography>
        <Typography variant="body1">Identify/fix errors in 6 complex sentences</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quizlet Live! Identify the error type and provide a detailed fix for each complex sentence!" />
      </Paper>
      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {QUESTIONS.map((q) => (
              <Paper key={q.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Question {q.id}: "{q.faulty}"</Typography>
                <TextField fullWidth label="Error Type" variant="outlined" value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} sx={{ mb: 2 }} placeholder="e.g., Agreement, Tense, Tone..." />
                <TextField fullWidth multiline rows={2} label="Detailed Fix" variant="outlined" value={corrections[q.id] || ''} onChange={(e) => handleCorrectionChange(q.id, e.target.value)} placeholder="Write the corrected sentence..." />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Example: {q.correct}</Typography>
              </Paper>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allAnswered} size="large" fullWidth>Submit Answers</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task C Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task D →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
