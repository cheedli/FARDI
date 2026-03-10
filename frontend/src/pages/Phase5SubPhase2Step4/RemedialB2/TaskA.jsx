import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 4 - Remedial B2 - Task A: Role-Play Dialogue
 * Complete dialogue giving instructions
 */

const WORD_BANK_ORIGINAL = ['please', 'first', 'then', 'next', 'careful', 'guide', 'welcome']

const SENTENCES = [
  'Ms. Mabrouki: Booth duty?',
  'You: [First] [please] welcome.',
  'SKANDER: Next?',
  'You: [Then] [guide] and be [careful].',
  'You: [Next] [help] guests.'
]

const CORRECT_ANSWERS = {
  'g_1_0': 'first',
  'g_1_1': 'please',
  'g_3_0': 'then',
  'g_3_1': 'guide',
  'g_3_2': 'careful',
  'g_4_0': 'next',
  'g_4_1': 'help'
}

export default function Phase5SubPhase2Step4RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL, 'help'].sort(() => Math.random() - 0.5)
  }, [])

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, correct]) => {
      if (answers[key]?.toLowerCase().trim() === correct.toLowerCase()) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step4_remedial_b2_taskA_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(4, 'B2', 'A', finalScore, 7, 2) // step 4, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/4/remedial/b2/task/b')
  }

  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 4: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Role-Play Saga</Typography>
        <Typography variant="body1">Complete dialogue giving instructions. Saga unfolds with correct fills!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Role-Play Saga! Complete the dialogue giving instructions by filling in the gaps. Use the word bank to find the right sequencing and polite terms!" />
      </Paper>

      {!submitted && (
        <Box>
          <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={!allFilled} sx={{ px: 6 }}>
              Submit Answers
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task A Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 7</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task B →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
