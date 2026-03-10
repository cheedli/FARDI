import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK_ORIGINAL = ['emergency', 'contingency', 'backup', 'announce', 'transparent', 'update']

const SENTENCES = [
  'Ms. Mabrouki: What is emergency?',
  'You: [Emergency] is urgent problem.',
  'Lilia: Solution?',
  'You: Use [contingency] and [backup], then [announce] with [transparent] [update].'
]

const CORRECT_ANSWERS = {
  'g_1_0': 'emergency',
  'g_3_0': 'contingency',
  'g_3_1': 'backup',
  'g_3_2': 'announce',
  'g_3_3': 'transparent',
  'g_3_4': 'update'
}

export default function Phase5Step3RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5)
  }, [])

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, correct]) => {
      if (answers[key]?.toLowerCase().trim() === correct.toLowerCase()) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_b2_taskA_score', finalScore.toString())
    try {
      await phase5API.logRemedialActivity(3, 'B2', 'A', finalScore, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/remedial/b2/task/b')
  }

  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Role-Play Saga</Typography>
        <Typography variant="body1">Complete dialogue explaining crisis terms</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Role-Play Saga! Complete the dialogue explaining crisis terms. Saga unfolds with correct fills!" />
      </Paper>
      {!submitted && (
        <Box>
          <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={!allFilled} sx={{ px: 6 }}>Submit Answers</Button>
          </Stack>
        </Box>
      )}
      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task A Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task B →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
