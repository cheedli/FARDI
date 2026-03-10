import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B1 - Task A: Negotiation Battle
 * Fill gaps in poster/video descriptions
 * Line 1 (Lilia): Describe poster gatefold.
 * Line 2 (You): Gatefold is [fold] for [space].
 * Line 3 (Ryan): Video animation?
 * Line 4 (You): Animation is [move] [picture] for fun.
 * Score: +1 for each correct answer (4 total)
 */

const WORD_BANK_ORIGINAL = [
  'fold',
  'space',
  'move',
  'picture'
]

const SENTENCES = [
  'Lilia: Can you describe the poster gatefold?',
  'You: Gatefold is _______ for _______.',
  'Ryan: What about the video animation?',
  'You: Animation is _______ _______ for fun.'
]

const CORRECT_ANSWERS = [
  'fold',
  'space',
  'move',
  'picture'
]

export default function RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Shuffle word bank on component mount
  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5)
  }, [])

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const calculateScore = () => {
    let correctCount = 0

    // Second sentence has 2 gaps (g_1_0 and g_1_1)
    const answer1 = answers['g_1_0']?.toLowerCase().trim()
    const answer2 = answers['g_1_1']?.toLowerCase().trim()

    if (answer1 === CORRECT_ANSWERS[0].toLowerCase()) correctCount++
    if (answer2 === CORRECT_ANSWERS[1].toLowerCase()) correctCount++

    // Fourth sentence has 2 gaps (g_3_0, g_3_1)
    const answer3 = answers['g_3_0']?.toLowerCase().trim()
    const answer4 = answers['g_3_1']?.toLowerCase().trim()

    if (answer3 === CORRECT_ANSWERS[2].toLowerCase()) correctCount++
    if (answer4 === CORRECT_ANSWERS[3].toLowerCase()) correctCount++

    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)

    sessionStorage.setItem('remedial_step4_b1_taskA_score', finalScore)

    await logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'A',
          step: 4,
          score: score,
          max_score: 4,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/b1/taskB')
  }

  // Check if all 4 blanks are filled
  const allFilled = answers['g_1_0'] && answers['g_1_1'] &&
                    answers['g_3_0'] && answers['g_3_1']

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task A: Negotiation Battle ⚔️
        </Typography>
        <Typography variant="body1">
          Fill 4 gaps with the correct words. Click a word from the Word Bank, then click the blank!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Negotiation Battle! Complete the conversation about advertising poster and video design. Click a word from the Word Bank below, then click the blank space where it belongs. Fill all 4 gaps correctly to win the battle!"
        />
      </Paper>

      {!submitted && (
        <Box>
          <GapFillStory
            templates={SENTENCES}
            wordBank={shuffledWordBank}
            answers={answers}
            onChange={handleAnswerChange}
          />
        </Box>
      )}

      {!submitted && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="large"
            disabled={!allFilled}
          >
            {allFilled ? 'Submit Battle Answers ⚔️' : 'Fill All Gaps First'}
          </Button>
        </Stack>
      )}

      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: score === 4 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 4 ? 'success.dark' : 'warning.dark'}>
              {score === 4 ? '⚔️ Perfect Battle Victory! ⚔️' : '🌟 Battle Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 4 points!
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={2}>
              <Alert severity={answers['g_1_0']?.toLowerCase() === CORRECT_ANSWERS[0].toLowerCase() ? 'success' : 'error'}>
                <Typography variant="body2">
                  <strong>Gap 1:</strong> Gatefold is "{answers['g_1_0'] || '(empty)'}"
                  {answers['g_1_0']?.toLowerCase() !== CORRECT_ANSWERS[0].toLowerCase() && (
                    <span> - Correct: <strong>{CORRECT_ANSWERS[0]}</strong></span>
                  )}
                </Typography>
              </Alert>

              <Alert severity={answers['g_1_1']?.toLowerCase() === CORRECT_ANSWERS[1].toLowerCase() ? 'success' : 'error'}>
                <Typography variant="body2">
                  <strong>Gap 2:</strong> for "{answers['g_1_1'] || '(empty)'}"
                  {answers['g_1_1']?.toLowerCase() !== CORRECT_ANSWERS[1].toLowerCase() && (
                    <span> - Correct: <strong>{CORRECT_ANSWERS[1]}</strong></span>
                  )}
                </Typography>
              </Alert>

              <Alert severity={answers['g_3_0']?.toLowerCase() === CORRECT_ANSWERS[2].toLowerCase() ? 'success' : 'error'}>
                <Typography variant="body2">
                  <strong>Gap 3:</strong> Animation is "{answers['g_3_0'] || '(empty)'}"
                  {answers['g_3_0']?.toLowerCase() !== CORRECT_ANSWERS[2].toLowerCase() && (
                    <span> - Correct: <strong>{CORRECT_ANSWERS[2]}</strong></span>
                  )}
                </Typography>
              </Alert>

              <Alert severity={answers['g_3_1']?.toLowerCase() === CORRECT_ANSWERS[3].toLowerCase() ? 'success' : 'error'}>
                <Typography variant="body2">
                  <strong>Gap 4:</strong> "{answers['g_3_1'] || '(empty)'}" for fun
                  {answers['g_3_1']?.toLowerCase() !== CORRECT_ANSWERS[3].toLowerCase() && (
                    <span> - Correct: <strong>{CORRECT_ANSWERS[3]}</strong></span>
                  )}
                </Typography>
              </Alert>
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Continue to Task B →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
