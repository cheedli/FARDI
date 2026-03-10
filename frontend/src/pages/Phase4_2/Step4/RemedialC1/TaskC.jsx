import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level C1 - Task C: Advanced Quiz
 * Create and answer quiz on 6 terms
 */

const QUIZ_ITEMS = [
  { term: 'Hashtag', expectedAnswer: 'discoverability amplifier' },
  { term: 'Caption', expectedAnswer: 'narrative hook' },
  { term: 'Emoji', expectedAnswer: 'emotional cue' },
  { term: 'Call-to-action', expectedAnswer: 'behavioral trigger' },
  { term: 'Viral', expectedAnswer: 'exponential reach' },
  { term: 'Engagement', expectedAnswer: 'audience interaction' }
]

export default function Phase4_2Step4RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (term, value) => {
    setAnswers({ ...answers, [term]: value })
  }

  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().trim()
    const s2 = str2.toLowerCase().trim()

    if (s1 === s2) return 1.0
    if (s1.includes(s2) || s2.includes(s1)) return 0.9

    const words1 = s1.split(/\s+/)
    const words2 = s2.split(/\s+/)
    const commonWords = words1.filter(w => words2.includes(w))

    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length)
    }

    return 0
  }

  const handleSubmit = () => {
    let correctCount = 0

    QUIZ_ITEMS.forEach(item => {
      const userAnswer = answers[item.term] || ''
      const similarity = calculateSimilarity(userAnswer, item.expectedAnswer)
      if (similarity >= 0.7) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase4_2_step4_c1_taskC_score', correctCount)

    logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'C1',
          task: 'C',
          score: finalScore,
          max_score: 6
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/c1/taskD')
  }

  const allAnswered = QUIZ_ITEMS.every(item => answers[item.term]?.trim())

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task C: Advanced Quiz
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Create and answer a quiz on 6 social media terms. Define each term with sophisticated precision. For example: Hashtag = Discoverability amplifier. Score 5/6 to pass!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Answer each question with a precise, sophisticated definition (2-4 words). Use advanced terminology to demonstrate C1 mastery.
        </Typography>
      </Paper>

      {/* Quiz Items */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          {QUIZ_ITEMS.map((item, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Q{idx + 1}: What is a {item.term}?
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Your answer..."
                value={answers[item.term] || ''}
                onChange={(e) => handleAnswerChange(item.term, e.target.value)}
                disabled={submitted}
                sx={{ mt: 1 }}
              />
              {submitted && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'block',
                    color: calculateSimilarity(answers[item.term] || '', item.expectedAnswer) >= 0.7 ? 'success.main' : 'error.main'
                  }}
                >
                  Expected: {item.expectedAnswer}
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
            {score >= 5 ? 'Excellent Quiz Performance!' : 'Good Effort!'}
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
            Submit Quiz
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
            Continue to Task D
          </Button>
        )}
      </Box>
    </Box>
  )
}
