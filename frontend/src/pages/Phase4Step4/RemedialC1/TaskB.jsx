import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial C1 - Task B: Quizlet Live Advanced Quiz
 * Answer 6 advanced questions about advertising concepts
 * Score: +1 for each correct answer (6 total)
 * Quizlet Live inspired design
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What does promotional advertising primarily aim to achieve?',
    correctAnswer: 'To drive sales and increase brand visibility, as video 1 states.',
    keywords: ['drive sales', 'increase', 'brand visibility', 'video 1']
  },
  {
    id: 2,
    question: 'How does video 1 define the components of persuasive advertising?',
    correctAnswer: 'Through ethos (credibility), pathos (emotion), and logos (logic).',
    keywords: ['ethos', 'pathos', 'logos', 'credibility', 'emotion', 'logic']
  },
  {
    id: 3,
    question: 'Why does the video advocate for targeted and personalized strategies?',
    correctAnswer: 'They increase relevance and effectiveness by addressing specific audience needs.',
    keywords: ['increase relevance', 'effectiveness', 'specific audience needs', 'addressing']
  },
  {
    id: 4,
    question: 'What risk does video 1 associate with a lack of originality and creativity?',
    correctAnswer: 'Ads become forgettable and fail to stand out in saturated media.',
    keywords: ['forgettable', 'fail', 'stand out', 'saturated media']
  },
  {
    id: 5,
    question: 'According to video 1, why is consistency across platforms essential?',
    correctAnswer: 'It reinforces brand identity and builds long-term trust.',
    keywords: ['reinforces', 'brand identity', 'builds', 'long-term trust']
  },
  {
    id: 6,
    question: 'How does video 2 illustrate the role of dramatisation in successful ads?',
    correctAnswer: 'By using relatable characters, clear goals, and obstacles to create emotional engagement.',
    keywords: ['relatable characters', 'clear goals', 'obstacles', 'emotional engagement']
  }
]

export default function RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(QUIZ_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentQuestion = QUIZ_QUESTIONS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkAnswer = (userAnswer, correctAnswer, keywords) => {
    const userLower = userAnswer.toLowerCase().trim()
    const correctLower = correctAnswer.toLowerCase().trim()

    // Exact match
    if (userLower === correctLower) return true

    // Check if answer contains at least 3 keywords
    const matchedKeywords = keywords.filter(keyword =>
      userLower.includes(keyword.toLowerCase())
    )

    // Must have at least half the keywords and reasonable length
    return matchedKeywords.length >= Math.ceil(keywords.length / 2) &&
           userAnswer.split(' ').length >= 5
  }

  const handleSubmit = async () => {
    const checkResults = answers.map((answer, index) => {
      const question = QUIZ_QUESTIONS[index]
      const isCorrect = checkAnswer(answer, question.correctAnswer, question.keywords)
      return {
        isCorrect,
        userAnswer: answer,
        correctAnswer: question.correctAnswer
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('remedial_step4_c1_taskB_score', correctCount)
    await logTaskCompletion(correctCount)
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
          step: 4,
          score: score,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/c1/taskC')
  }

  const allFilled = answers.every(a => a.trim().length > 0)
  const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header - Quizlet Live inspired (purple/blue theme) */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #4255ff 0%, #563de7 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task B: Quizlet Live 🎮
        </Typography>
        <Typography variant="body1">
          Answer 6 advanced questions with detailed, sophisticated responses!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to Quizlet Live! Answer each question with detailed, accurate responses using sophisticated vocabulary. Reference video 1 and video 2 where appropriate, and provide specific examples!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar - Quizlet style */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f7f7ff' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 1,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#e5e5ff',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4255ff 0%, #563de7 100%)'
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {QUIZ_QUESTIONS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 10,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? '#4caf50' :
                                    idx === currentIndex ? '#4255ff' : '#e5e5e5'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Question */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            {/* Question Display */}
            <Box sx={{ mb: 3, p: 3, backgroundColor: '#f0f4ff', borderRadius: 2, borderLeft: '5px solid #4255ff' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#1a1a1a' }} fontWeight="bold">
                Q{currentIndex + 1}: {currentQuestion.question}
              </Typography>
            </Box>

            {/* Answer Input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your detailed answer here..."
              variant="outlined"
              helperText={`Word count: ${answers[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for at least 10 words with specific details)`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white'
                }
              }}
            />

            {/* Hint */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: '#fff9e6' }}>
              <Typography variant="subtitle2" color="warning.dark" fontWeight="bold">
                💡 Include in your answer:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {currentQuestion.keywords.join(', ')}
              </Typography>
            </Paper>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{ borderColor: '#4255ff', color: '#4255ff' }}
              >
                ← Previous
              </Button>

              {currentIndex < QUIZ_QUESTIONS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!answers[currentIndex].trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #4255ff 0%, #563de7 100%)'
                  }}
                >
                  Next Question →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!allFilled}
                >
                  Submit Quiz 🎮
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to question:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: 40,
                    ...(idx === currentIndex && {
                      background: 'linear-gradient(135deg, #4255ff 0%, #563de7 100%)'
                    })
                  }}
                >
                  {idx + 1} {answers[idx].trim() && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'} fontWeight="bold">
              {score === 6 ? '🎮 Perfect Quiz! 🎮' : '🌟 Quiz Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Answer Review:
            </Typography>
            <Stack spacing={2}>
              {QUIZ_QUESTIONS.map((question, index) => {
                const result = results[index]
                return (
                  <Alert
                    key={index}
                    severity={result.isCorrect ? 'success' : 'error'}
                    icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                  >
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Q{index + 1}: {question.question}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Your answer: "{result.userAnswer}"
                    </Typography>
                    {!result.isCorrect && (
                      <Typography variant="body2" color="success.dark" sx={{ mt: 1 }}>
                        Model answer: <strong>{result.correctAnswer}</strong>
                      </Typography>
                    )}
                  </Alert>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #4255ff 0%, #563de7 100%)'
              }}
            >
              Continue to Task C →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
