import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial B1 - Task F: Grammar Kahoot
 * Multiple choice grammar quiz inspired by Kahoot
 * 6 questions about subject-verb agreement
 * Bonus task worth 6 points
 */

const QUESTIONS = [
  {
    id: 1,
    question: "Promotional ads ___ to sell?",
    options: ['is', 'are'],
    correctAnswer: 'are',
    explanation: "Use 'are' because 'ads' is plural"
  },
  {
    id: 2,
    question: "Persuasive ___ logos?",
    options: ['use', 'uses'],
    correctAnswer: 'uses',
    explanation: "Use 'uses' because 'persuasive' (advertising) is singular"
  },
  {
    id: 3,
    question: "Targeted group ___ specific?",
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: "Use 'is' because 'group' is singular"
  },
  {
    id: 4,
    question: "Original idea ___ new?",
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: "Use 'is' because 'idea' is singular"
  },
  {
    id: 5,
    question: "Creative ads ___ memorable?",
    options: ['make', 'makes'],
    correctAnswer: 'make',
    explanation: "Use 'make' because 'ads' is plural"
  },
  {
    id: 6,
    question: "Ethical advertising ___ fair?",
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: "Use 'is' because 'advertising' is singular (uncountable noun)"
  }
]

const TIME_PER_QUESTION = 15 // seconds

export default function RemedialB1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 6, context: 'remedial_b1' })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || showFeedback) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up! Auto-submit
      handleTimeUp()
    }
  }, [timeLeft, gameStarted, gameFinished, showFeedback])

  const handleTimeUp = () => {
    if (selectedAnswer) {
      handleAnswerSubmit(selectedAnswer)
    } else {
      // No answer selected - mark as incorrect
      const isCorrect = false
      setAnswers([...answers, {
        questionId: QUESTIONS[currentQuestion].id,
        question: QUESTIONS[currentQuestion].question,
        selectedAnswer: null,
        correctAnswer: QUESTIONS[currentQuestion].correctAnswer,
        isCorrect: false,
        timedOut: true
      }])
      setShowFeedback(true)

      setTimeout(() => {
        moveToNextQuestion()
      }, 3000)
    }
  }

  const handleAnswerSubmit = (answer) => {
    const isCorrect = answer === QUESTIONS[currentQuestion].correctAnswer

    if (isCorrect) {
      setScore(score + 1)
    }

    setAnswers([...answers, {
      questionId: QUESTIONS[currentQuestion].id,
      question: QUESTIONS[currentQuestion].question,
      selectedAnswer: answer,
      correctAnswer: QUESTIONS[currentQuestion].correctAnswer,
      isCorrect: isCorrect,
      timedOut: false
    }])

    setShowFeedback(true)

    // Move to next question after 3 seconds
    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setTimeLeft(TIME_PER_QUESTION)
    } else {
      // Game finished
      finishGame()
    }
  }

  const finishGame = () => {
    setGameFinished(true)

    // Save score
    const finalScore = answers.filter(a => a.isCorrect).length + (selectedAnswer === QUESTIONS[currentQuestion].correctAnswer ? 1 : 0)
    sessionStorage.setItem('remedial_step3_b1_taskF_score', finalScore)

    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'F',
          step: 2,
          score: finalScore,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleContinue = () => {
    // Navigate to results page or next task
    navigate('/phase4/step3/remedial/b1/results')
  }

  const handleAnswerClick = (answer) => {
    if (showFeedback) return // Don't allow changes after submission

    setSelectedAnswer(answer)
    handleAnswerSubmit(answer)
  }

  const progressPercent = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const currentQ = QUESTIONS[currentQuestion]

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B1 - Task F: Grammar Kahoot 🎯 (BONUS)
          </Typography>
          <Typography variant="body1">
            Timed quiz rounds - compete for the leaderboard!
          </Typography>
          <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(255, 152, 0, 0.9)' }}>
            <strong>Bonus Task:</strong> This is an optional task worth 6 bonus points. Complete it to boost your total score!
          </Alert>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Grammar Kahoot! 🎉 Test your subject-verb agreement skills with 6 timed questions. You have 15 seconds per question. Choose the correct grammar form to score points. All correct answers = 6 bonus points! Ready? Let's go! 🚀"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <EmojiEventsIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Grammar Kahoot Challenge
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Questions • 15 Seconds Each • Subject-Verb Agreement
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            sx={{
              py: 2,
              px: 8,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: '#f39c12',
              color: 'white',
              '&:hover': { backgroundColor: '#e67e22' }
            }}
          >
            START GAME! 🎮
          </Button>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const finalScore = answers.filter(a => a.isCorrect).length
    const passedAll = finalScore === 6

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B1 - Task F: Grammar Kahoot - Results 🏆
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {passedAll ? 'Perfect Score! 🎉' : 'Game Complete! 🎊'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#9b59b6' }}>
                {finalScore} / 6
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Bonus Points Earned
              </Typography>
            </Paper>
            {passedAll && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You got all questions correct! You're a grammar master! 🌟
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Feedback */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9b59b6' }} fontWeight="bold">
            Question Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {answers.map((answer, index) => (
              <Paper
                key={answer.questionId}
                elevation={2}
                sx={{
                  p: 3,
                  borderLeft: '4px solid',
                  borderColor: answer.isCorrect ? '#27ae60' : '#e74c3c',
                  backgroundColor: answer.isCorrect ? '#d5f4e6' : '#fadbd8'
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Question {index + 1}
                  </Typography>
                  {answer.isCorrect ? (
                    <CheckCircleIcon sx={{ color: '#27ae60' }} />
                  ) : (
                    <CancelIcon sx={{ color: '#e74c3c' }} />
                  )}
                </Stack>

                <Typography variant="h6" sx={{ mb: 2, color: '#1a252f' }}>
                  {answer.question}
                </Typography>

                {answer.timedOut ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    ⏰ <strong>Time's up!</strong> No answer selected.
                  </Alert>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ color: '#1a252f' }}>
                      Your answer: <strong style={{ color: answer.isCorrect ? '#27ae60' : '#e74c3c' }}>
                        {answer.selectedAnswer}
                      </strong>
                    </Typography>
                  </Box>
                )}

                {!answer.isCorrect && (
                  <Alert severity="error" sx={{ backgroundColor: '#f8d7da', '& .MuiAlert-message': { color: '#1a252f' } }}>
                    <strong>Correct Answer:</strong> {answer.correctAnswer}
                    <br />
                    <Typography variant="caption" sx={{ color: '#2c3e50' }}>
                      {QUESTIONS[index].explanation}
                    </Typography>
                  </Alert>
                )}

                {answer.isCorrect && (
                  <Alert severity="success" sx={{ backgroundColor: '#d4edda', '& .MuiAlert-message': { color: '#1a252f' } }}>
                    <strong>Correct!</strong> {QUESTIONS[index].explanation}
                  </Alert>
                )}
              </Paper>
            ))}
          </Stack>
        </Paper>

        {/* Continue Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)' }
            }}
          >
            View Final Results →
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Question {currentQuestion + 1} / {QUESTIONS.length}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEventsIcon />
              <Typography variant="h6">
                Score: {score}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon />
              <Typography variant="h6" sx={{
                color: timeLeft <= 5 ? '#e74c3c' : 'white',
                fontWeight: timeLeft <= 5 ? 'bold' : 'normal'
              }}>
                {timeLeft}s
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#f39c12'
            }
          }}
        />
      </Paper>

      {/* Question Card */}
      <Paper
        elevation={6}
        sx={{
          p: 5,
          mb: 3,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: showFeedback
            ? (selectedAnswer === currentQ.correctAnswer ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)')
            : 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)'
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: showFeedback ? 'white' : '#1a252f',
            fontWeight: 'bold',
            mb: 5
          }}
        >
          {currentQ.question}
        </Typography>

        {!showFeedback ? (
          <Stack spacing={3}>
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant="contained"
                size="large"
                onClick={() => handleAnswerClick(option)}
                disabled={showFeedback}
                sx={{
                  py: 3,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  backgroundColor: selectedAnswer === option ? '#3498db' : '#34495e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#2c3e50',
                    transform: 'scale(1.02)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                {option}
              </Button>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            {selectedAnswer === currentQ.correctAnswer ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 100, mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Correct! 🎉
                </Typography>
                <Typography variant="h6">
                  {currentQ.explanation}
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon sx={{ fontSize: 100, mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {selectedAnswer ? 'Not quite!' : "Time's up!"}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Correct answer: <strong>{currentQ.correctAnswer}</strong>
                </Typography>
                <Typography variant="body1">
                  {currentQ.explanation}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Paper>

      {/* Timer Warning */}
      {timeLeft <= 5 && !showFeedback && (
        <Alert severity="warning" sx={{ backgroundColor: '#f39c12', color: 'white' }}>
          <strong>Hurry!</strong> Only {timeLeft} seconds left!
        </Alert>
      )}
    </Box>
  )
}
