import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 1 - Interaction 3: Guided Sentence Production
 * Write one sentence using the word "budget"
 */


export default function Phase3Step1Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 3, context: 'main' })
  const [userSentence, setUserSentence] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [estimatedLevel, setEstimatedLevel] = useState(null)

  const handleSubmit = () => {
    if (!userSentence.trim()) {
      setFeedback({ type: 'error', message: 'Please write a sentence before submitting.' })
      return
    }

    // Simple client-side assessment based on sentence complexity
    const sentence = userSentence.toLowerCase()
    const wordCount = userSentence.trim().split(/\s+/).length
    const containsBudget = sentence.includes('budget')

    if (!containsBudget) {
      setFeedback({
        type: 'warning',
        message: 'Your sentence should include the word "budget". Please try again.'
      })
      return
    }

    // Simple level estimation and scoring
    let level = 'A1'
    let score = 1
    if (wordCount >= 12 && (sentence.includes('because') || sentence.includes('while') || sentence.includes('ensure'))) {
      level = 'C1'
      score = 5
    } else if (wordCount >= 8 && (sentence.includes('help') || sentence.includes('manage') || sentence.includes('avoid'))) {
      level = 'B2'
      score = 4
    } else if (wordCount >= 6 && (sentence.includes('because') || sentence.includes('to'))) {
      level = 'B1'
      score = 3
    } else if (wordCount >= 4) {
      level = 'A2'
      score = 2
    }

    setEstimatedLevel(level)
    setSubmitted(true)
    setFeedback({
      type: 'success',
      message: 'Great! Your sentence has been recorded. This demonstrates your ability to use financial vocabulary in context.'
    })

    // Store interaction 3 score
    sessionStorage.setItem('phase3_step1_int3_score', score.toString())
    console.log(`[Phase 3 Step 1 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
  }

  const handleNext = () => {
    // Calculate total score from all 3 interactions in Step 1
    const int1Score = parseInt(sessionStorage.getItem('phase3_step1_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase3_step1_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase3_step1_int3_score') || '0')

    const totalScore = int1Score + int2Score + int3Score
    const totalMax = 21 // 8 (matching) + 8 (spelling) + 5 (sentence)
    const percentage = (totalScore / totalMax) * 100

    // Store total score for Step 1
    sessionStorage.setItem('phase3_step1_total_score', totalScore.toString())
    sessionStorage.setItem('phase3_step1_total_max', totalMax.toString())
    sessionStorage.setItem('phase3_step1_percentage', percentage.toFixed(2))

    console.log(`[Phase 3 Step 1 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)

    // Navigate to ScoreCalculation page for backend-driven routing
    navigate('/phase3/step/1/score')
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 - Step 1: Interaction 3
        </Typography>
        <Typography variant="h6">
          Guided Sentence Production
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Now let's use one key word in context. Choose the word 'budget' and write one sentence about our festival."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Write one sentence using the word "budget" to talk about the festival.
        </Typography>
        <Typography variant="body2">
          <strong>Mode:</strong> Individual | <strong>Output:</strong> 1 sentence only
        </Typography>
      </Paper>

      {/* Input Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            Your sentence:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={userSentence}
            onChange={(e) => setUserSentence(e.target.value)}
            placeholder="Write one sentence using the word 'budget' about the Global Cultures Festival..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Word count: {userSentence.trim().split(/\s+/).filter(w => w).length}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              endIcon={<SendIcon />}
              disabled={!userSentence.trim()}
            >
              Submit Sentence
            </Button>
          </Box>
        </Paper>
      )}

      {/* Submitted Response Display */}
      {submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter' }}>
          <Typography variant="h6" gutterBottom>
            Your Response:
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
            "{userSentence}"
          </Typography>
          {estimatedLevel && (
            <Chip
              label={`Estimated Level: ${estimatedLevel}`}
              color="success"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Paper>
      )}

      {/* Feedback */}
      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }}>
          {feedback.message}
        </Alert>
      )}

      {/* Assessment Focus */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'grey.100' }}>
        <Typography variant="h6" gutterBottom>
          Assessment Focus
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Correct use of "budget"
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Sentence completeness
          </Typography>
          <Typography component="li" variant="body2">
            Relevance to event planning
          </Typography>
        </Box>
      </Paper>

      {/* Action Buttons */}
      {submitted && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Complete Step 1
          </Button>
        </Box>
      )}
    </Box>
  )
}
