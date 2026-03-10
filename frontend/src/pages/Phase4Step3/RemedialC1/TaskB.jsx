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
 * Phase 4 Step 3 - Remedial C1 - Task B: Analysis Odyssey
 * Write 8 analytical sentences with nuanced understanding
 * LLM evaluates C1 nuance, video reference, and analytical depth
 * Score: +1 for each C1-level analysis (8 total)
 */

const QUESTIONS = [
  {
    id: 1,
    term: 'Promotional',
    question: 'Analyze the promotional approach in advertising.',
    guidedPrompt: 'Consider: How does promotional strategy drive sales? What are the risks? Reference Video 1.',
    example: 'Promotional drives sales but risks overexposure as video 1 warns.',
    expectedConcepts: ['sales', 'drives', 'overexposure', 'risks', 'video 1', 'warns']
  },
  {
    id: 2,
    term: 'Persuasive',
    question: 'Analyze the nuance of persuasive techniques.',
    guidedPrompt: 'Consider: How do ethos, pathos, and logos work together? What balance is needed?',
    example: 'Persuasive balances ethos/pathos/logos for credibility.',
    expectedConcepts: ['ethos', 'pathos', 'logos', 'balances', 'credibility', 'nuance']
  },
  {
    id: 3,
    term: 'Targeted',
    question: 'Analyze the ethics of targeted advertising.',
    guidedPrompt: 'Consider: How does targeting enhance relevance? What ethical concerns arise?',
    example: 'Targeted enhances relevance yet raises privacy concerns.',
    expectedConcepts: ['relevance', 'enhances', 'privacy', 'ethical', 'concerns']
  },
  {
    id: 4,
    term: 'Original',
    question: 'Analyze how original ideas fuel creativity.',
    guidedPrompt: 'Consider: What role do original ideas play in creative breakthroughs?',
    example: 'Original ideas fuel creative breakthroughs.',
    expectedConcepts: ['original', 'fuel', 'creative', 'breakthroughs', 'innovation']
  },
  {
    id: 5,
    term: 'Consistent',
    question: 'Analyze the importance of consistent branding.',
    guidedPrompt: 'Consider: How does consistency build trust over time?',
    example: 'Consistent message builds trust over time.',
    expectedConcepts: ['consistent', 'trust', 'builds', 'time', 'branding']
  },
  {
    id: 6,
    term: 'Personalized',
    question: 'Analyze the personalized advertising approach.',
    guidedPrompt: 'Consider: How does personalization increase engagement? What data ethics are involved?',
    example: 'Personalized ads increase engagement but demand data ethics.',
    expectedConcepts: ['personalized', 'engagement', 'data', 'ethics', 'privacy']
  },
  {
    id: 7,
    term: 'Ethical',
    question: 'Analyze the ethical framework in advertising.',
    guidedPrompt: 'Consider: How does ethical advertising create long-term loyalty?',
    example: 'Ethical advertising fosters long-term loyalty.',
    expectedConcepts: ['ethical', 'loyalty', 'long-term', 'fosters', 'trust']
  },
  {
    id: 8,
    term: 'Dramatisation',
    question: 'Analyze the impact of dramatisation in advertising.',
    guidedPrompt: 'Consider: How do goal/obstacle narratives create emotional resonance? Reference Video 2.',
    example: 'Dramatisation creates emotional resonance through goal/obstacle narratives.',
    expectedConcepts: ['dramatisation', 'emotional', 'resonance', 'goal', 'obstacle', 'video 2']
  }
]

export default function RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_c1' })
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
      const response = await fetch('/api/phase4/step3/remedial/c1/evaluate-analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          analyses: QUESTIONS.map(q => ({
            term: q.term,
            question: q.question,
            answer: answers[q.id] || '',
            example: q.example,
            expectedConcepts: q.expectedConcepts
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        setSubmitted(true)

        // Save score to sessionStorage
        sessionStorage.setItem('remedial_step3_c1_taskB_score', data.total_score)

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
          level: 'C1',
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
    // Navigate to dashboard or next task
    navigate('/dashboard')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] && answers[q.id].trim().length >= 20)

  const getTotalScore = () => {
    if (!results) return 0
    return results.filter(r => r.score === 1).length
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task B: Analysis Odyssey 🗺️
        </Typography>
        <Typography variant="body1">
          Embark on an analytical journey through advertising concepts. Nuance reveals new depths!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Analysis Odyssey! 🗺️ This is a C1-level challenge requiring nuanced analytical writing. For each concept, write ONE sophisticated sentence that demonstrates critical thinking, references the videos when applicable, and shows deep understanding of advertising principles. Quality over quantity—aim for analytical depth!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Indicator */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#8e44ad' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {Object.keys(answers).filter(id => answers[id]?.trim().length >= 20).length} / {QUESTIONS.length} completed
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
              borderLeft: '4px solid #8e44ad',
              backgroundColor: '#f3e5f5',
              minHeight: 500
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Chip
                label={`Question ${currentQuestionIndex + 1}`}
                sx={{
                  backgroundColor: '#8e44ad',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 2.5
                }}
              />
              <ExploreIcon sx={{ color: '#8e44ad', fontSize: 32 }} />
            </Box>

            <Typography variant="h5" gutterBottom sx={{ color: '#6c3483', fontWeight: 'bold', mb: 2 }}>
              {QUESTIONS[currentQuestionIndex].term}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ color: '#1a252f', mb: 3, fontWeight: 500 }}>
              {QUESTIONS[currentQuestionIndex].question}
            </Typography>

            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e1f5fe' }}>
              <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                💡 {QUESTIONS[currentQuestionIndex].guidedPrompt}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[QUESTIONS[currentQuestionIndex].id] || ''}
              onChange={(e) => handleAnswerChange(QUESTIONS[currentQuestionIndex].id, e.target.value)}
              placeholder="Write your analytical sentence here... (One sophisticated sentence with nuance and depth)"
              variant="outlined"
              disabled={submitted}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#8e44ad',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: '#6c3483'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6c3483'
                  },
                  '& textarea': {
                    color: '#1a252f',
                    fontWeight: 500,
                    fontSize: '1rem'
                  },
                  '& textarea::placeholder': {
                    color: '#34495e',
                    opacity: 0.8
                  }
                }
              }}
            />

            <Typography variant="body2" sx={{ display: 'block', mt: 1, color: '#2c3e50', fontWeight: 500 }}>
              {answers[QUESTIONS[currentQuestionIndex].id]?.length || 0} characters • Minimum 20 characters (aim for 60-120 for analytical depth)
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
                borderColor: '#8e44ad',
                color: '#8e44ad',
                '&:hover': {
                  borderColor: '#6c3483',
                  backgroundColor: '#f3e5f5'
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
                  background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)' }
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
                Please write at least 20 characters for each analytical sentence before submitting. Use the Previous button to review earlier questions.
              </Typography>
            </Alert>
          )}

          {evaluating && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress sx={{ borderRadius: 1, height: 8 }} />
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: '#2c3e50', fontWeight: 500 }}>
                AI is evaluating your analyses for C1-level nuance, video references, and analytical depth...
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {/* Results Summary */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
            <ExploreIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {getTotalScore() === 8 ? '🗺️ Odyssey Complete! 🗺️' : '🌟 Analysis Complete! 🌟'}
            </Typography>
            <Paper elevation={4} sx={{ p: 3, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#8e44ad' }}>
                {getTotalScore()} / 8
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {getTotalScore() === 8 && '🏆 Perfect! Your analyses demonstrate exceptional C1-level nuance and depth!'}
              {getTotalScore() >= 6 && getTotalScore() < 8 && '🌟 Excellent work! Your analyses show strong C1-level understanding.'}
              {getTotalScore() < 6 && '💪 Good effort! Review the feedback to enhance analytical depth and nuance.'}
            </Typography>
          </Paper>

          {/* Detailed Feedback */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#8e44ad' }}>
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
                    <strong>Your analysis:</strong>
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
              Complete C1 Remedial Tasks →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
