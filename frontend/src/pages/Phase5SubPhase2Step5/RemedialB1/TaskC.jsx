import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial B1 - Task C: Wordshake Quiz
 * Identify error type in 6 sentences
 */

const QUESTIONS = [
  { id: 1, sentence: '"Pleese welcom" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 2, sentence: '"Furst chek" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 3, sentence: '"Then guied" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 4, sentence: '"Be cairful" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 5, sentence: '"Thankk you" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 6, sentence: '"Help peoples" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 1 }
]

export default function Phase5SubPhase2Step5RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_b1' })
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
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b1_taskC_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'B1', 'C', correctCount, 6, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/score')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Wordshake Quiz</Typography>
        <Typography variant="body1">Identify error type in 6 sentences</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Wordshake Quiz! Identify the type of error in each sentence. Is it spelling, grammar, or structure?" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {QUESTIONS.map((q) => (
              <Paper key={q.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Question {q.id}: {q.sentence}</Typography>
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
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Continue to Score Calculation →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
