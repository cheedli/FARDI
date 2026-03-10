import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial B1 - Task F: Grammar Kahoot
 * Multiple choice error quiz - identify error type in 6 sentences
 * Gamified as "Grammar Kahoot"
 * Score: +1 for each correct answer (6 total)
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: '"Gatefold are" - What type of error?',
    answers: ['Agreement', 'Spelling', 'Punctuation'],
    correctIndex: 0,
    explanation: 'This is a subject-verb agreement error: "Gatefold" is singular, so it should be "Gatefold is" not "are".'
  },
  {
    id: 2,
    question: '"Animation move" - What type of error?',
    answers: ['Verb form', 'Spelling', 'Punctuation'],
    correctIndex: 0,
    explanation: 'This is a verb form error: needs "is" or "moves" - should be "Animation is move" or "Animation moves".'
  },
  {
    id: 3,
    question: '"Slogan is words" - What type of error?',
    answers: ['Agreement', 'Spelling', 'Tense'],
    correctIndex: 0,
    explanation: 'This is a subject-verb-complement agreement error: "Slogan" is singular, so it should be "is word" not "is words".'
  },
  {
    id: 4,
    question: '"Clip is parts" - What type of error?',
    answers: ['Agreement', 'Spelling', 'Tense'],
    correctIndex: 0,
    explanation: 'This is a subject-verb-complement agreement error: "Clip" is singular, so it should be "is part" not "is parts".'
  },
  {
    id: 5,
    question: '"Jingle is songs" - What type of error?',
    answers: ['Agreement', 'Spelling', 'Punctuation'],
    correctIndex: 0,
    explanation: 'This is a subject-verb-complement agreement error: "Jingle" is singular, so it should be "is song" not "is songs".'
  },
  {
    id: 6,
    question: '"Feature is highlights" - What type of error?',
    answers: ['Agreement', 'Spelling', 'Tense'],
    correctIndex: 0,
    explanation: 'This is a subject-verb-complement agreement error: "Feature" is singular, so it should be "is highlight" not "is highlights".'
  }
]

export default function Phase4Step5RemedialB1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 6, context: 'remedial_b1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Shuffle answers for each question once when component mounts
  const shuffledQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.map(question => {
      const answers = [...question.answers]
      const correctAnswer = answers[question.correctIndex]

      // Shuffle the answers array
      const shuffled = answers.sort(() => Math.random() - 0.5)

      // Find new index of correct answer after shuffle
      const newCorrectIndex = shuffled.findIndex(ans => ans === correctAnswer)

      return {
        ...question,
        answers: shuffled,
        correctIndex: newCorrectIndex
      }
    })
  }, [])

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const totalQuestions = shuffledQuestions.length

  // Answer button colors (3 colors for 3 options)
  const answerColors = [
    { bg: '#e21b3c', hover: '#c41230' }, // Red
    { bg: '#1368ce', hover: '#0f5ab0' }, // Blue
    { bg: '#d89e00', hover: '#b88400' }  // Yellow
  ]

  // Timer countdown
  useEffect(() => {
    if (gameStarted && !showResult && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, currentQuestionIndex, showResult, quizCompleted])

  const handleStartQuiz = () => {
    setGameStarted(true)
    setTimeLeft(20)
  }

  const handleTimeUp = () => {
    // Time ran out - mark as incorrect
    setShowResult(true)

    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const handleAnswerClick = (answerIndex) => {
    if (showResult || selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.correctIndex

    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)

    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(20)
    } else {
      // Quiz complete
      setQuizCompleted(true)
      const finalScore = score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0)
      sessionStorage.setItem('phase4_step5_remedial_b1_taskF_score', finalScore)
      logTaskCompletion(finalScore)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'F',
          score: finalScore,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/b1/results')
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4 Step 5: Evaluate - Remedial Practice
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B1 - Task F: Grammar Kahoot 🎮
          </Typography>
          <Typography variant="body1">
            Final challenge! Identify grammar error types in 6 sentences.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="LILIA"
            message="Final task! Time for the Grammar Kahoot! 🎮 You'll see 6 sentences with errors. For each one, identify whether it's an AGREEMENT, VERB FORM, SPELLING, TENSE, or PUNCTUATION error. You have 20 seconds per question. This is your last challenge - good luck! 🎮"
          />
        </Paper>

        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #46178f 0%, #e21b3c 100%)' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
            Ready for the Final Challenge?
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Questions · 20 seconds each · Final Score: X/6
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Start Grammar Kahoot 🎮
          </Button>
        </Paper>
      </Box>
    )
  }

  // Quiz completed screen
  if (quizCompleted) {
    const finalScore = sessionStorage.getItem('phase4_step5_remedial_b1_taskF_score') || score

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4 Step 5: Evaluate - Remedial Practice
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B1 - Task F: Grammar Kahoot 🎮
          </Typography>
        </Paper>

        <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #46178f 0%, #e21b3c 100%)' }}>
          <Box sx={{ color: 'white' }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              All Tasks Complete! 🎉
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 4 }}>
              <Typography variant="h2" fontWeight="bold" color="primary">
                {finalScore} / 6
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Final Task Score
              </Typography>
            </Paper>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#45a049' }
              }}
            >
              View Final Results →
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Quiz in progress
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with timer and score */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #46178f 0%, #e21b3c 100%)',
          color: 'white'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </Typography>

          {/* Timer */}
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <TimerIcon sx={{ fontSize: 30 }} />
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  color: timeLeft <= 5 ? '#ff5252' : 'white',
                  animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)' }
                  }
                }}
              >
                {timeLeft}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / 20) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                mt: 1,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: timeLeft <= 5 ? '#ff5252' : '#4caf50'
                }
              }}
            />
          </Box>

          <Typography variant="h5" fontWeight="bold">
            Score: {score} / 6
          </Typography>
        </Stack>
      </Paper>

      {/* Question Display */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 3,
          minHeight: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#46178f',
          color: 'white'
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center">
          {currentQuestion?.question}
        </Typography>
      </Paper>

      {/* Answer Options - 3 buttons in a row */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {currentQuestion?.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === currentQuestion.correctIndex
          const showCorrect = showResult && isCorrect
          const showIncorrect = showResult && isSelected && !isCorrect

          return (
            <Button
              key={index}
              fullWidth
              onClick={() => handleAnswerClick(index)}
              disabled={showResult}
              sx={{
                py: 4,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: showCorrect
                  ? '#4caf50'
                  : showIncorrect
                  ? '#f44336'
                  : answerColors[index].bg,
                color: 'white',
                border: '4px solid white',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: showResult
                    ? undefined
                    : answerColors[index].hover,
                  transform: showResult ? 'none' : 'scale(1.05)'
                },
                transition: 'all 0.2s ease',
                flex: index === 1 ? 1.2 : 1 // Middle button slightly larger
              }}
            >
              <Stack spacing={1} alignItems="center">
                {showCorrect && <CheckCircleIcon sx={{ fontSize: 40 }} />}
                {showIncorrect && <CancelIcon sx={{ fontSize: 40 }} />}
                <Typography variant="h6" fontWeight="bold">
                  {answer}
                </Typography>
              </Stack>
            </Button>
          )
        })}
      </Stack>

      {/* Explanation */}
      {showResult && (
        <Paper
          elevation={4}
          sx={{
            p: 3,
            backgroundColor: selectedAnswer === currentQuestion.correctIndex ? '#e8f5e9' : '#ffebee'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#000000' }}>
            {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#000000' }}>
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}
