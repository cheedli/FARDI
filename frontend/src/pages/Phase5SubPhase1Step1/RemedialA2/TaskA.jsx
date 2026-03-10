import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A2 - Task A: Dialogue Completion
 * Complete dialogue about solving the problem, gamified as "Chat Challenge"
 * Complete lines to "unlock" next dialogue level
 */

const WORD_BANK = ['problem', 'because', 'cancel', 'alternative', 'sorry', 'fix', 'solution']

const DIALOGUE_SENTENCES = [
  'Ms. Mabrouki: What is the _______?',
  'You: Singer _______ _______ sick.',
  'SKANDER: What _______?',
  'You: Find _______ singer and say _______.',
  'You: We _______ it.'
]

// Define correct answers for each blank (in order)
const CORRECT_ANSWERS = [
  'problem',           // Line 1: What is the problem?
  'cancel', 'because', // Line 2: Singer cancel because sick
  'solution',          // Line 3: What solution?
  'alternative', 'sorry', // Line 4: Find alternative singer and say sorry
  'fix'                // Line 5: We fix it
]

export default function Phase5Step1RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const calculateScore = () => {
    let correctCount = 0
    let answerIndex = 0

    DIALOGUE_SENTENCES.forEach((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length

      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        const userAnswer = answers[key]?.toLowerCase().trim()
        const correctAnswer = CORRECT_ANSWERS[answerIndex]?.toLowerCase()

        if (userAnswer === correctAnswer) {
          correctCount++
        }
        answerIndex++
      }
    })

    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)

    sessionStorage.setItem('phase5_step1_remedial_a2_taskA_score', finalScore.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A2', 'A', finalScore, 7, 0)
      console.log('[Phase 5 Step 1] A2 Task A completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a2/task/b')
  }

  const allFilled = (() => {
    let blankIndex = 0
    return DIALOGUE_SENTENCES.every((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        if (!answers[key]) {
          return false
        }
        blankIndex++
      }
      return true
    })
  })()

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task A: Chat Challenge
        </Typography>
        <Typography variant="body1">
          Complete dialogue about solving the problem. Complete lines to unlock next level!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Chat Challenge! Complete the dialogue about solving the problem. Fill in the blanks using the word bank. Click a word from the Word Bank, then click the blank space where it belongs. Complete all lines to unlock the next level!"
        />
      </Paper>

      {/* Gap Fill Game */}
      {!submitted && (
        <Box>
          <GapFillStory
            templates={DIALOGUE_SENTENCES}
            wordBank={WORD_BANK}
            answers={answers}
            onChange={handleAnswerChange}
          />
        </Box>
      )}

      {/* Submit Button */}
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

      {/* Results */}
      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              ✓ Task A Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 7
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 6 ? 'Excellent! You completed the dialogue correctly!' : 'Good work! Let\'s continue to the next task.'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Task B →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
