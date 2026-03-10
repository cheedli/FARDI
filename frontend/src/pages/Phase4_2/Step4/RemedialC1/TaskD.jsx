import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level C1 - Task D: Critique Game
 * Critique 6 post elements with balanced analysis (both positive and negative)
 */

const CRITIQUE_ITEMS = [
  {
    element: 'Hashtag',
    expectedPositive: 'powerful',
    expectedNegative: 'overuse dilutes'
  },
  {
    element: 'Caption',
    expectedPositive: 'concise best',
    expectedNegative: 'long loses readers'
  },
  {
    element: 'Emoji',
    expectedPositive: 'emotional connection',
    expectedNegative: 'excessive unprofessional'
  },
  {
    element: 'Call-to-action',
    expectedPositive: 'drives conversion',
    expectedNegative: 'pushy alienates'
  },
  {
    element: 'Viral content',
    expectedPositive: 'exponential reach',
    expectedNegative: 'unpredictable timing'
  },
  {
    element: 'Engagement metrics',
    expectedPositive: 'measurable success',
    expectedNegative: 'vanity metrics mislead'
  }
]

export default function Phase4_2Step4RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (element, value) => {
    setCritiques({ ...critiques, [element]: value })
  }

  const evaluateCritique = (text, expectedPositive, expectedNegative) => {
    const lower = text.toLowerCase()

    const hasPositive = lower.includes(expectedPositive.toLowerCase()) ||
                       expectedPositive.split(' ').some(word => lower.includes(word.toLowerCase()))

    const hasNegative = lower.includes(expectedNegative.toLowerCase()) ||
                       expectedNegative.split(' ').some(word => lower.includes(word.toLowerCase()))

    const hasBalancedStructure = (lower.includes('but ') || lower.includes('however') ||
                                  lower.includes('yet ') || lower.includes('though') ||
                                  lower.includes('while '))

    return hasPositive && hasNegative && hasBalancedStructure
  }

  const handleSubmit = () => {
    let correctCount = 0

    CRITIQUE_ITEMS.forEach(item => {
      const userCritique = critiques[item.element] || ''
      if (evaluateCritique(userCritique, item.expectedPositive, item.expectedNegative)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase4_2_step4_c1_taskD_score', correctCount)

    logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'C1',
          task: 'D',
          score: finalScore,
          max_score: 6
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/c1/taskE')
  }

  const allAnswered = CRITIQUE_ITEMS.every(item => critiques[item.element]?.trim())

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task D: Critique Game
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Critique 6 post elements with balanced analysis. Each critique must include BOTH positive and negative aspects. For example: 'Hashtags are powerful for discoverability, but overuse dilutes impact.' Score 5/6 to pass!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write balanced critiques that acknowledge both strengths and weaknesses. Use transitional words like 'but', 'however', 'yet', 'though', or 'while'.
        </Typography>
      </Paper>

      {/* Example */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
            Example Balanced Critique:
          </Typography>
          <Typography variant="body2">
            "Hashtags are powerful for amplifying discoverability, but overuse dilutes their impact and appears spammy."
          </Typography>
        </CardContent>
      </Card>

      {/* Critique Items */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          {CRITIQUE_ITEMS.map((item, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {idx + 1}. Critique: {item.element}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Write a balanced critique with both positive and negative aspects..."
                value={critiques[item.element] || ''}
                onChange={(e) => handleCritiqueChange(item.element, e.target.value)}
                disabled={submitted}
                sx={{ mt: 1 }}
              />
              {submitted && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'block',
                    color: evaluateCritique(critiques[item.element] || '', item.expectedPositive, item.expectedNegative) ? 'success.main' : 'error.main'
                  }}
                >
                  {evaluateCritique(critiques[item.element] || '', item.expectedPositive, item.expectedNegative)
                    ? 'Balanced critique with both aspects!'
                    : `Hint: Include "${item.expectedPositive}" (positive) and "${item.expectedNegative}" (negative)`}
                </Typography>
              )}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      {submitted && (
        <Alert severity={score >= 5 ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {score >= 5 ? 'Excellent Critical Analysis!' : 'Good Effort!'}
          </Typography>
          <Typography>
            Score: {score}/6 points (Need 5/6 to pass)
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Critiques
          </Button>
        )}
        {submitted && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task E
          </Button>
        )}
      </Box>
    </Box>
  )
}
