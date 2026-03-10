import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, LinearProgress, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CreateIcon from '@mui/icons-material/Create'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Remedial B2 - Task B: Writing (8-sentence explanation)
 * Explain effective post elements
 * 8 guided questions with examples
 * AI evaluation or client-side validation
 * Score: 8 points (1 per question)
 * Pass: 6/8
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'How do hashtags help posts?',
    example: 'Example: Use relevant hashtags for discoverability'
  },
  {
    id: 2,
    question: 'What makes a good caption length?',
    example: 'Example: Keep captions concise but engaging'
  },
  {
    id: 3,
    question: 'Why use emojis in posts?',
    example: 'Example: Emojis add visual emotion and personality'
  },
  {
    id: 4,
    question: 'What is a call-to-action?',
    example: 'Example: A CTA prompts followers to take action'
  },
  {
    id: 5,
    question: 'How does tagging help reach?',
    example: 'Example: Tagging people expands your post reach'
  },
  {
    id: 6,
    question: 'When is the best time to post?',
    example: 'Example: Post when your audience is most active'
  },
  {
    id: 7,
    question: 'Why are visuals important?',
    example: 'Example: Strong visuals attract attention and engagement'
  },
  {
    id: 8,
    question: 'How do analytics help?',
    example: 'Example: Analytics show what content performs best'
  }
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState({})

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    // Client-side validation: check if answers are at least 20 characters
    let calculatedScore = 0
    const newFeedback = {}

    Object.keys(answers).forEach(qId => {
      const answer = answers[qId] || ''
      if (answer.trim().length >= 20) {
        calculatedScore++
        newFeedback[qId] = 'Good answer!'
      } else {
        newFeedback[qId] = 'Too short. Add more detail.'
      }
    })

    setScore(calculatedScore)
    setFeedback(newFeedback)
    setSubmitted(true)
    setEvaluating(false)

    sessionStorage.setItem('phase4_2_step4_b2_taskB', calculatedScore)

    // Log to backend
    await fetch('/api/phase4/remedial/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase: '4.2',
        level: 'B2',
        task: 'B',
        step: 4,
        score: calculatedScore,
        max_score: 8,
        completed: true
      })
    }).catch(err => console.error('Log error:', err))
  }

  const handleContinue = () => {
    navigate('/phase4_2/step4/remedial/b2/taskC')
  }

  const answeredCount = Object.keys(answers).filter(key => (answers[key] || '').trim().length >= 20).length
  const canSubmit = answeredCount === 8
  const passed = score >= 6

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Writing (8 Questions)
        </Typography>
        <Typography variant="body1">
          Answer 8 questions about effective social media posts!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Answer each question about effective social media post elements. Write at least 20 characters for each answer. Use the examples as guidance. Each correct answer earns 1 point. Total: 8 points!"
        />
      </Paper>

      {/* Writing Prompt */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e9', border: '3px solid #27ae60' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CreateIcon sx={{ fontSize: 32, color: '#27ae60' }} />
          <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 'bold' }}>
            Explain Effective Post Elements
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
          Answer all 8 questions below. Each answer should be at least 20 characters.
        </Typography>
      </Paper>

      {/* Questions */}
      <Stack spacing={3} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, index) => {
          const answer = answers[q.id] || ''
          const isAnswered = answer.trim().length >= 20
          const questionFeedback = feedback[q.id]

          return (
            <Paper key={q.id} elevation={3} sx={{ p: 3, backgroundColor: '#f8f9fa', border: '2px solid #27ae60' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                {index + 1}. {q.question}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f8c8d', fontStyle: 'italic', mb: 2 }}>
                {q.example}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={2}
                value={answer}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Write your answer here..."
                variant="outlined"
                disabled={submitted}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: '#27ae60',
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: '#229954'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#229954'
                    },
                    '& textarea': {
                      color: '#1a252f',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={`${answer.length} characters`}
                  sx={{
                    backgroundColor: isAnswered ? '#27ae60' : '#95a5a6',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                />
                {submitted && questionFeedback && (
                  <Alert severity={isAnswered ? 'success' : 'warning'} sx={{ py: 0, px: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {questionFeedback}
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Paper>
          )
        })}
      </Stack>

      {/* Progress */}
      {!submitted && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1, color: '#2c3e50', fontWeight: 600 }}>
            Progress: {answeredCount} / 8 questions answered
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(answeredCount / 8) * 100}
            sx={{
              height: 10,
              borderRadius: 1,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#27ae60'
              }
            }}
          />
        </Paper>
      )}

      {/* Results */}
      {submitted && (
        <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: passed ? '#d5f4e6' : '#fff3cd', border: `4px solid ${passed ? '#27ae60' : '#f39c12'}` }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: passed ? '#27ae60' : '#f39c12', mb: 1 }} />
            <Typography variant="h4" gutterBottom sx={{ color: '#1a252f', fontWeight: 'bold' }}>
              {passed ? 'Excellent Work!' : 'Good Effort!'}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 2 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: passed ? '#27ae60' : '#f39c12' }}>
                {score} / 8
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
              {passed ? 'You passed this task! Great understanding of post elements.' : 'Keep practicing to improve your answers.'}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!canSubmit || evaluating}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: canSubmit && !evaluating
                ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
                : '#bdc3c7',
              '&:hover': {
                background: canSubmit && !evaluating
                  ? 'linear-gradient(135deg, #229954 0%, #1e8449 100%)'
                  : '#95a5a6'
              }
            }}
          >
            {evaluating ? 'Evaluating...' : canSubmit ? 'Submit Answers' : `Answer ${8 - answeredCount} More Questions`}
          </Button>
        )}
        {submitted && (
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2980b9 0%, #21618c 100%)'
              }
            }}
          >
            Continue to Task C: Matching Game
          </Button>
        )}
      </Box>
    </Box>
  )
}
