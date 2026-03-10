import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level C1 - Task C: Quizlet Live
 * Answer 6 advanced questions one by one with detailed responses
 * Gamified as "Quizlet Live" - Live quiz with sophisticated answers
 * Score: +1 per correctly answered question (6 total)
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary aim of promotional advertising according to video 1?',
    expectedAnswer: 'To drive sales and increase brand recognition, though effectiveness depends on execution quality.',
    keywords: ['drive sales', 'brand recognition', 'effectiveness', 'execution', 'quality']
  },
  {
    id: 2,
    question: 'How does video 1 describe the components of persuasive advertising?',
    expectedAnswer: 'It is rooted in ethos (credibility), pathos (emotion), and logos (logic), creating balance without coercion.',
    keywords: ['ethos', 'pathos', 'logos', 'credibility', 'emotion', 'logic', 'balance', 'coercion']
  },
  {
    id: 3,
    question: 'What advantage and risk do targeted/personalized strategies present?',
    expectedAnswer: 'They enhance relevance by addressing specific needs, but raise ethical concerns about data privacy.',
    keywords: ['enhance', 'relevance', 'addressing', 'needs', 'ethical', 'data privacy', 'concerns']
  },
  {
    id: 4,
    question: 'Why does video 1 emphasize originality and creativity?',
    expectedAnswer: 'They distinguish ads in saturated markets, ensuring memorability and emotional resonance.',
    keywords: ['distinguish', 'saturated', 'markets', 'memorability', 'emotional', 'resonance']
  },
  {
    id: 5,
    question: 'What does consistent messaging achieve, and what is the potential drawback?',
    expectedAnswer: 'It reinforces brand identity and trust, but excessive rigidity may limit adaptability.',
    keywords: ['reinforces', 'brand identity', 'trust', 'rigidity', 'limit', 'adaptability']
  },
  {
    id: 6,
    question: 'How does dramatisation in video 2 contribute to ad effectiveness?',
    expectedAnswer: 'Through structured storytelling with clear goals and obstacles, it creates emotional depth and captivates viewers.',
    keywords: ['structured', 'storytelling', 'goals', 'obstacles', 'emotional', 'depth', 'captivates', 'viewers']
  }
]

export default function Phase4Step5RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_c1' })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckAnswer = async () => {
    const question = QUESTIONS[currentQuestion]
    const userAnswerTrimmed = userAnswer.trim()

    // Disable the check button while evaluating
    setFeedback({ type: 'info', message: 'Evaluating your answer...' })

    try {
      // Use LLM to evaluate C1-level answers
      const response = await fetch('/api/phase4/step5/remedial/evaluate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          question: question.question,
          userAnswer: userAnswerTrimmed,
          expectedAnswer: question.expectedAnswer,
          keywords: question.keywords,
          questionIndex: currentQuestion
        })
      })

      const data = await response.json()
      const pointsEarned = data.correct ? 1 : 0

      if (data.correct) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Excellent C1-level answer! Quiz continues! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: data.feedback || 'Not quite C1 level. Focus on: detailed explanations, sophisticated vocabulary, and video references.'
        })
      }

      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          const nextIndex = currentQuestion + 1
          setCurrentQuestion(nextIndex)
          setUserAnswer('')
          setFeedback(null)
        } else {
          // All questions completed
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_c1_taskC_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)

    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback: Check basic C1 criteria if API fails
      const userLower = userAnswerTrimmed.toLowerCase()

      // Count keyword matches
      const keywordMatches = question.keywords.filter((keyword) =>
        userLower.includes(keyword.toLowerCase())
      ).length

      // C1 requires high accuracy - at least 60% of keywords + reasonable length
      const keywordThreshold = Math.ceil(question.keywords.length * 0.6)
      const hasLength = userAnswerTrimmed.length >= 30
      const hasVideoRef = userLower.includes('video')

      const pointsEarned = (keywordMatches >= keywordThreshold && hasLength && hasVideoRef) ? 1 : 0

      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Good C1-level answer! Quiz continues! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Remember to provide detailed answers with key concepts, reference the videos, and use sophisticated vocabulary.'
        })
      }

      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          const nextIndex = currentQuestion + 1
          setCurrentQuestion(nextIndex)
          setUserAnswer('')
          setFeedback(null)
        } else {
          // All questions completed
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_c1_taskC_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'C',
          score: finalScore,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 5] C1 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/c1/taskD')
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task C: Quizlet Live 🎯
        </Typography>
        <Typography variant="body1">
          Live quiz challenge! Answer advanced questions with detail and sophistication.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to Quizlet Live! 🎯 You have 6 advanced questions to answer, one at a time. Your mission: provide detailed, sophisticated answers with references to the videos. Each correct C1-level answer earns you 1 point!"
        />
      </Paper>

      {/* What to Include Guide */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec', border: '2px solid #c0392b' }}>
        <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }} gutterBottom>
          🎯 What to Include (C1 Level):
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Video References:</strong> Mention specific videos (video 1, video 2) in your answers
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Key Concepts:</strong> Use keywords from the expected answers
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Sophisticated Vocabulary:</strong> Advanced words and precise expressions
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Detail:</strong> Write at least 30 characters with complete explanations
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Nuance:</strong> Explain both advantages and drawbacks where applicable
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Coherence:</strong> Create clear, flowing sentences with logical connections
          </Typography>
        </Stack>
      </Paper>

      {/* Game Area */}
      {!gameCompleted && (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 3,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#f8bbd0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)'
              }
            }}
          />

          {/* Question Counter */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Question ${currentQuestion + 1} of ${QUESTIONS.length}`}
              sx={{ bgcolor: '#c0392b', color: 'white', fontWeight: 'bold' }}
            />
            <Chip
              label={`Score: ${score}/${QUESTIONS.length}`}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* Question */}
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd', border: '2px solid #2196f3' }}>
            <Typography variant="subtitle2" color="primary.dark" fontWeight="bold" gutterBottom>
              ❓ Question:
            </Typography>
            <Typography variant="h6" sx={{ color: '#1565c0', fontFamily: 'monospace', mt: 1 }}>
              {QUESTIONS[currentQuestion].question}
            </Typography>
          </Paper>

          {/* User Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#6a1b9a' }}>
              ✏️ Your C1-level answer (provide detailed, sophisticated response with video references):
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Provide a detailed, sophisticated answer with references to the videos..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              autoFocus
              multiline
              rows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  '& textarea': {
                    color: '#ffffff',
                    fontWeight: 500
                  }
                }
              }}
            />
          </Box>

          {/* Feedback */}
          {feedback && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor:
                  feedback.type === 'success'
                    ? '#d4edda'
                    : feedback.type === 'info'
                    ? '#d1ecf1'
                    : '#f8d7da',
                border: `2px solid ${
                  feedback.type === 'success'
                    ? '#28a745'
                    : feedback.type === 'info'
                    ? '#17a2b8'
                    : '#dc3545'
                }`
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color:
                    feedback.type === 'success'
                      ? '#155724'
                      : feedback.type === 'info'
                      ? '#0c5460'
                      : '#721c24',
                  fontWeight: 'bold'
                }}
              >
                {feedback.message}
              </Typography>
            </Paper>
          )}

          {/* Check Button */}
          {!feedback && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckAnswer}
              disabled={!userAnswer.trim() || userAnswer.trim().length < 30}
              startIcon={<CheckCircleIcon />}
              sx={{
                background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #a93226 0%, #7d3c98 100%)'
                },
                py: 1.5
              }}
            >
              {userAnswer.trim().length < 30 ? 'Write at least 30 characters' : 'Check Answer'}
            </Button>
          )}
        </Paper>
      )}

      {/* Navigation after game completion */}
      {gameCompleted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              🎯 Quizlet Live Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 6
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === 6 ? 'Perfect C1-level answers! All questions answered with sophistication!' : score >= 4 ? 'Great job! Strong C1-level responses!' : 'Good effort! Keep practicing C1 comprehension skills!'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                '&:hover': {
                  background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)'
                }
              }}
            >
              Next: Task D →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
