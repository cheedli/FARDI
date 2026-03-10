import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1 - Level A2 - Task C: Sentence Builder
 * Write 6 very simple instructions for volunteers
 * Gamified as "Sentence Builder"
 */

const EXPECTED_SENTENCES = [
  'Please welcome.',
  'First check ticket.',
  'Then guide.',
  'Be careful.',
  'Help people.',
  'Thank you.'
]

export default function Phase5SubPhase2Step1RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState(['', '', '', '', '', ''])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSentenceChange = (index, value) => {
    const newSentences = [...sentences]
    newSentences[index] = value
    setSentences(newSentences)
  }

  const calculateScore = () => {
    let correctCount = 0
    sentences.forEach((sentence, index) => {
      const userLower = sentence.toLowerCase().trim()
      const expectedLower = EXPECTED_SENTENCES[index].toLowerCase().trim()
      // Check if key words match
      const expectedWords = expectedLower.split(' ')
      const matches = expectedWords.filter(word => userLower.includes(word)).length
      if (matches >= expectedWords.length * 0.6) { // 60% match threshold
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_a2_taskC_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(1, 'A2', 'C', finalScore, 6, 0, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to next step
    navigate('/phase5/subphase/2/step/2')
  }

  const allFilled = sentences.every(s => s.trim().length > 0)

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
          Task C: Sentence Builder
        </Typography>
        <Typography variant="body1">
          Write 6 very simple instructions for volunteers
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Sentence Builder! Write 6 very simple instructions for volunteers. Use the examples as a guide, but write your own sentences."
        />
      </Paper>

      {!submitted && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Write Simple Instructions
          </Typography>
          <Stack spacing={2}>
            {EXPECTED_SENTENCES.map((example, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Example: "{example}"
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={`Write instruction ${index + 1}...`}
                  value={sentences[index]}
                  onChange={(e) => handleSentenceChange(index, e.target.value)}
                  disabled={submitted}
                />
              </Paper>
            ))}
          </Stack>
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
              ✓ Task C Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 6
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 5 ? 'Excellent! Well done!' : 'Good work! Let\'s see your final score.'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              View Final Score →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
