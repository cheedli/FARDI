import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1 - Level A2 - Task B: Fill Frenzy
 * Fill in 6 gaps with instruction words
 * Gamified as "Fill Frenzy" - Fill fast for high score
 */

const WORD_BANK = ['please', 'thank you', 'first', 'then', 'careful', 'help']

const SENTENCES = [
  '[Please] welcome guests.',
  '[First], check ticket.',
  '[Then], show way.',
  'Be [careful].',
  '[Help] people.',
  'Say [thank you].'
]

const CORRECT_ANSWERS = {
  'g_0_0': 'please',
  'g_1_0': 'first',
  'g_2_0': 'then',
  'g_3_0': 'careful',
  'g_4_0': 'help',
  'g_5_0': 'thank you'
}

export default function Phase5SubPhase2Step1RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

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
    sessionStorage.setItem('phase5_subphase2_step1_remedial_a2_taskB_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(1, 'A2', 'B', finalScore, 6, 0, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/1/remedial/a2/task/c')
  }

  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 1: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task B: Fill Frenzy
        </Typography>
        <Typography variant="body1">
          Fill in 6 gaps with instruction words. Fill fast for high score!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Fill Frenzy! Fill in the gaps with words from the word bank. Complete all sentences to finish!"
        />
      </Paper>

      {!submitted && (
        <Box>
          <GapFillStory
            templates={SENTENCES}
            wordBank={WORD_BANK}
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
            size="large"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{ px: 6 }}
          >
            Submit Answers
          </Button>
        </Stack>
      )}

      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              ✓ Task B Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 6
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 6 ? 'Excellent! All correct!' : 'Good work! Let\'s continue to the next task.'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Task C →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
