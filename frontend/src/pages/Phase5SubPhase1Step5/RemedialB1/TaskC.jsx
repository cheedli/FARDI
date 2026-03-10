import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { id: 1, question: '"Emergancy is" error?', options: ['Spelling', 'Agreement', 'Tense'], correct: 0 },
  { id: 2, question: '"Backup are ready" error?', options: ['Agreement', 'Spelling', 'Structure'], correct: 0 },
  { id: 3, question: '"Announce now" error?', options: ['Structure', 'Spelling', 'Tense'], correct: 0 },
  { id: 4, question: '"Update is sent" error?', options: ['Tense', 'Spelling', 'Agreement'], correct: 0 },
  { id: 5, question: '"Fix fast" error?', options: ['Politeness', 'Spelling', 'Structure'], correct: 0 },
  { id: 6, question: '"Problem bad" error?', options: ['Tone', 'Spelling', 'Agreement'], correct: 0 }
]

export default function Phase5Step5RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_b1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(5, 'B1', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_b1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 5 + 8 + 6
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold

    try {
      await phase5API.calculateRemedialScore(5, 'B1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/5/remedial/b1/task/a')
    }
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Wordshake Quiz</Typography>
        <Typography variant="body1">Identify error type in 6 sentences</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Wordshake Quiz! Identify the type of error in each sentence!" />
      </Paper>
      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {QUESTIONS.map((q) => (
              <Paper key={q.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Question {q.id}: {q.question}</Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                    {q.options.map((option, idx) => (
                      <FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />
                    ))}
                  </RadioGroup>
                </FormControl>
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
          <Button variant="contained" color="success" onClick={handleContinue} size="large" fullWidth>Continue to Final Results →</Button>
        </>
      )}
    </Box>
  )
}
