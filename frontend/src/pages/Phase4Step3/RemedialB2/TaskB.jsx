import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ExploreIcon from '@mui/icons-material/Explore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial B2 - Task B: Explain Expedition
 * Write 8 explanations with video references
 * LLM evaluates depth, detail, and video reference
 * Score: +1 for each acceptable explanation (8 total)
 */

const QUESTIONS = [
  {
    id: 1,
    term: 'Promotional',
    question: 'Explain the promotional purpose of advertising.',
    guidedPrompt: 'Think about: What is the main goal? How does it relate to selling? What did Video 1 say?',
    expectedConcepts: ['sell', 'promote', 'video 1', 'advertising']
  },
  {
    id: 2,
    term: 'Persuasive Techniques',
    question: 'Explain persuasive techniques in advertising.',
    guidedPrompt: 'Think about: What are the three appeals? How do they work? What examples did Video 1 show?',
    expectedConcepts: ['ethos', 'pathos', 'logos', 'convince', 'video 1']
  },
  {
    id: 3,
    term: 'Targeted Audience',
    question: 'Explain what targeted audience means in advertising.',
    guidedPrompt: 'Think about: Who is the audience? Why focus on specific groups? What did Video 1 advise?',
    expectedConcepts: ['specific', 'group', 'audience', 'video 1']
  },
  {
    id: 4,
    term: 'Original and Creative',
    question: 'Explain why ads should be original and creative.',
    guidedPrompt: 'Think about: What makes ads memorable? Why is creativity important? What did Video 1 highlight?',
    expectedConcepts: ['memorable', 'creative', 'original', 'video 1']
  },
  {
    id: 5,
    term: 'Consistent Message',
    question: 'Explain why consistent messaging is important in advertising.',
    guidedPrompt: 'Think about: What does consistent mean? Why keep the same style? What did Video 1 recommend?',
    expectedConcepts: ['consistent', 'same', 'style', 'video 1']
  },
  {
    id: 6,
    term: 'Personalized Ads',
    question: 'Explain what personalized advertising means.',
    guidedPrompt: 'Think about: How are ads customized? Who are they for? What did Video 1 explain?',
    expectedConcepts: ['personalized', 'individual', 'customize', 'video 1']
  },
  {
    id: 7,
    term: 'Ethical Advertising',
    question: 'Explain why ethical advertising is important.',
    guidedPrompt: 'Think about: What makes advertising ethical? Why does it matter? What did Video 1 stress?',
    expectedConcepts: ['honest', 'fair', 'ethical', 'video 1']
  },
  {
    id: 8,
    term: 'Dramatisation',
    question: 'Explain dramatisation in advertising.',
    guidedPrompt: 'Think about: What is dramatisation? How does it use story elements? What did Video 2 show?',
    expectedConcepts: ['story', 'goal', 'obstacle', 'video 2', 'character']
  }
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const evaluateAnswers = async () => {
    setEvaluating(true)

    try {
      const response = await fetch('/api/phase4/step3/remedial/b2/evaluate-explanations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          explanations: QUESTIONS.map(q => ({
            term: q.term,
            question: q.question,
            answer: answers[q.id] || '',
            expectedConcepts: q.expectedConcepts
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        setSubmitted(true)

        // Save score to sessionStorage
        sessionStorage.setItem('remedial_step3_b2_taskB_score', data.total_score)

        // Log completion
        await logTaskCompletion(data.total_score)
      } else {
        alert('Failed to evaluate answers. Please try again.')
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('An error occurred during evaluation. Please try again.')
    } finally {
      setEvaluating(false)
    }
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'B',
          step: 2,
          score: score,
          max_score: 8,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task C (Kahoot Match)
    navigate('/phase4/step3/remedial/b2/taskC')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] && answers[q.id].trim().length >= 10)

  const getTotalScore = () => {
    if (!results) return 0
    return results.filter(r => r.score === 1).length
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Explain Expedition 🗺️
        </Typography>
        <Typography variant="body1">
          Write detailed explanations with video references. Depth discovers new levels!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Explain Expedition! 🗺️ Write detailed explanations for 8 advertising concepts. Each explanation should reference the videos (Video 1 or Video 2) and show B2-level depth. The more detailed and well-referenced your explanations, the deeper you explore! Aim for at least 2-3 sentences per question."
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Indicator */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f39c12' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {Object.keys(answers).filter(id => answers[id]?.trim().length >= 30).length} / {QUESTIONS.length} completed
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(currentQuestionIndex + 1) / QUESTIONS.length * 100}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
            />
          </Paper>

          {/* Current Question */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderLeft: '4px solid #f39c12',
              backgroundColor: '#fff3e0',
              minHeight: 500
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Chip
                label={`Question ${currentQuestionIndex + 1}`}
                sx={{
                  backgroundColor: '#f39c12',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 2.5
                }}
              />
              <ExploreIcon sx={{ color: '#f39c12', fontSize: 32 }} />
            </Box>

            <Typography variant="h5" gutterBottom sx={{ color: '#d35400', fontWeight: 'bold', mb: 2 }}>
              {QUESTIONS[currentQuestionIndex].term}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ color: '#1a252f', mb: 3, fontWeight: 500 }}>
              {QUESTIONS[currentQuestionIndex].question}
            </Typography>

            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
              <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                💡 {QUESTIONS[currentQuestionIndex].guidedPrompt}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={6}
              value={answers[QUESTIONS[currentQuestionIndex].id] || ''}
              onChange={(e) => handleAnswerChange(QUESTIONS[currentQuestionIndex].id, e.target.value)}
              placeholder="Write your detailed explanation here... (Include video references and specific concepts)"
              variant="outlined"
              disabled={submitted}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#f39c12',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: '#e67e22'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e67e22'
                  },
                  '& textarea': {
                    color: '#1a252f',
                    fontWeight: 500
                  },
                  '& textarea::placeholder': {
                    color: '#34495e',
                    opacity: 0.8
                  }
                }
              }}
            />

            <Typography variant="body2" sx={{ display: 'block', mt: 1, color: '#2c3e50', fontWeight: 500 }}>
              {answers[QUESTIONS[currentQuestionIndex].id]?.length || 0} characters • Minimum 30 characters (aim for 100+ for full detail)
            </Typography>
          </Paper>

          {/* Navigation Buttons */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderColor: '#f39c12',
                color: '#f39c12',
                '&:hover': {
                  borderColor: '#e67e22',
                  backgroundColor: '#fff3e0'
                },
                '&:disabled': {
                  borderColor: '#bdc3c7',
                  color: '#bdc3c7'
                }
              }}
            >
              ← Previous
            </Button>

            {currentQuestionIndex < QUESTIONS.length - 1 ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)' }
                }}
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={evaluateAnswers}
                disabled={!allAnswered || evaluating}
                startIcon={evaluating ? null : <AutoAwesomeIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)' },
                  '&:disabled': { background: '#bdc3c7' }
                }}
              >
                {evaluating ? 'Evaluating...' : allAnswered ? 'Submit All 🗺️' : 'Complete All First'}
              </Button>
            )}
          </Stack>

          {/* Submit Info */}
          {currentQuestionIndex === QUESTIONS.length - 1 && !allAnswered && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                Please write at least 30 characters for each explanation before submitting. Use the Previous button to review earlier questions.
              </Typography>
            </Alert>
          )}

          {evaluating && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress sx={{ borderRadius: 1, height: 8 }} />
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: '#2c3e50', fontWeight: 500 }}>
                AI is evaluating your explanations for depth, detail, and video references...
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {/* Results Summary */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', color: 'white' }}>
            <ExploreIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {getTotalScore() === 8 ? '🗺️ Complete Expedition! 🗺️' : '🌟 Expedition Complete! 🌟'}
            </Typography>
            <Paper elevation={4} sx={{ p: 3, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#f39c12' }}>
                {getTotalScore()} / 8
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {getTotalScore() === 8 && '🏆 Perfect! You explored every depth with detailed, well-referenced explanations!'}
              {getTotalScore() >= 6 && getTotalScore() < 8 && '🌟 Great expedition! You showed strong B2-level explanations.'}
              {getTotalScore() < 6 && '💪 Good effort! Review the feedback to improve depth and video references.'}
            </Typography>
          </Paper>

          {/* Detailed Feedback */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#f39c12' }}>
              AI Evaluation Results
            </Typography>

            <Stack spacing={3} sx={{ mt: 2 }}>
              {results && results.map((result, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: '4px solid',
                    borderColor: result.score === 1 ? '#27ae60' : '#e74c3c',
                    backgroundColor: result.score === 1 ? '#d5f4e6' : '#fadbd8'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                      Question {index + 1}: {result.term}
                    </Typography>
                    {result.score === 1 ? (
                      <CheckCircleIcon sx={{ color: '#27ae60' }} />
                    ) : (
                      <CancelIcon sx={{ color: '#e74c3c' }} />
                    )}
                  </Stack>

                  <Typography variant="body2" sx={{ mb: 2, color: '#1a252f', fontWeight: 600 }}>
                    <strong>Your explanation:</strong>
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#2c3e50', fontWeight: 500 }}>
                      "{answers[QUESTIONS[index].id]}"
                    </Typography>
                  </Paper>

                  <Alert
                    severity={result.score === 1 ? 'success' : 'warning'}
                    sx={{
                      backgroundColor: result.score === 1 ? '#d4edda' : '#fff3cd'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                      <strong>AI Feedback:</strong> {result.feedback}
                    </Typography>
                  </Alert>
                </Paper>
              ))}
            </Stack>
          </Paper>

          {/* Continue Button */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)' }
              }}
            >
              Continue to Task C: Kahoot Match →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
