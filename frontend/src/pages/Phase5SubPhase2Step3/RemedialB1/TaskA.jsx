import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 3 - Remedial B1 - Task A: Negotiation Battle
 * Fill gaps explaining instruction terms
 * Score: +1 for each correct answer (5 total: Please, because, First, then, because)
 */

const WORD_BANK_ORIGINAL = ['Please', 'because', 'First', 'then']

const SENTENCES = [
  'Lilia: Why say please?',
  'You: [Please] is polite [because] good.',
  'Ryan: First and then?',
  'You: [First] step one, [then] next step [because] clear.'
]

const CORRECT_ANSWERS = {
  'g_1_0': 'Please',
  'g_1_1': 'because',
  'g_3_0': 'First',
  'g_3_1': 'then',
  'g_3_2': 'because'
}

export default function Phase5SubPhase2Step3RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL, 'because'].sort(() => Math.random() - 0.5)
  }, [])

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }))
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

    sessionStorage.setItem('phase5_subphase2_step3_remedial_b1_taskA_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(3, 'B1', 'A', finalScore, 5, 2) // step 3, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3/remedial/b1/task/b')
  }

  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 3: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task A: Negotiation Battle</Typography>
        <Typography variant="body1">Fill gaps explaining instruction terms. Battle with fills for victory!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Negotiation Battle! Complete the dialogue explaining instruction terms by filling in the gaps. Use the word bank to find the right terms and reasons!" />
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
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 5</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task B →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
