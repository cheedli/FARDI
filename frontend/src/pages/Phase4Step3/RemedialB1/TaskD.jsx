import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, IconButton } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial B1 - Task D: Flashcard Game
 * Quizlet-style flashcard game with flip animation
 * 8 terms to memorize with definitions
 * Timed rounds for scoring
 */

const FLASHCARDS = [
  {
    id: 1,
    term: 'promotional',
    definition: 'To promote or sell'
  },
  {
    id: 2,
    term: 'persuasive',
    definition: 'To convince using ethos/pathos/logos'
  },
  {
    id: 3,
    term: 'targeted',
    definition: 'For a specific audience/group'
  },
  {
    id: 4,
    term: 'original',
    definition: 'New and unique idea'
  },
  {
    id: 5,
    term: 'creative',
    definition: 'Using imagination to make memorable'
  },
  {
    id: 6,
    term: 'consistent',
    definition: 'Same style/message across ads'
  },
  {
    id: 7,
    term: 'personalized',
    definition: 'Customized for individuals'
  },
  {
    id: 8,
    term: 'ethical',
    definition: 'Honest and fair, no lies'
  }
]

export default function RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_b1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState([])
  const [studyingCards, setStudyingCards] = useState([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [gameCompleted, setGameCompleted] = useState(false)
  const [studyMode, setStudyMode] = useState('learn') // 'learn' or 'test'

  // Shuffle flashcards once at start
  const shuffledCards = useMemo(() => {
    return [...FLASHCARDS].sort(() => Math.random() - 0.5)
  }, [])

  const currentCard = shuffledCards[currentCardIndex]
  const totalCards = shuffledCards.length
  const cardsRemaining = totalCards - knownCards.length

  // Timer countdown
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
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
  }, [gameStarted, gameCompleted])

  const handleStartGame = () => {
    setGameStarted(true)
    setStudyMode('learn')
  }

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKnowCard = () => {
    if (!knownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id])
    }

    // Remove from studying if it was there
    setStudyingCards(studyingCards.filter(id => id !== currentCard.id))

    // Move to next card
    if (currentCardIndex + 1 < totalCards) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // All cards reviewed - check if all known
      if (knownCards.length + 1 >= totalCards) {
        completeGame()
      } else {
        // Restart with unknown cards
        setCurrentCardIndex(0)
        setIsFlipped(false)
      }
    }
  }

  const handleStillLearning = () => {
    if (!studyingCards.includes(currentCard.id) && !knownCards.includes(currentCard.id)) {
      setStudyingCards([...studyingCards, currentCard.id])
    }

    // Move to next card
    if (currentCardIndex + 1 < totalCards) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // End of deck - restart
      setCurrentCardIndex(0)
      setIsFlipped(false)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleNextCard = () => {
    if (currentCardIndex + 1 < totalCards) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const handleTimeUp = () => {
    completeGame()
  }

  const completeGame = () => {
    setGameCompleted(true)
    const finalScore = knownCards.length + (knownCards.includes(currentCard.id) ? 0 : 1)
    const timeBonus = Math.floor(timeLeft / 30) // Bonus point for every 30 seconds remaining

    sessionStorage.setItem('remedial_step3_b1_taskD_score', finalScore)
    logTaskCompletion(finalScore, timeBonus)
  }

  const logTaskCompletion = async (score, bonus) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'D',
          step: 2,
          score: score,
          max_score: 8,
          time_bonus: bonus,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleFinish = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskA_score') || 0)
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskB_score') || 0)
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskC_score') || 0)
    const taskDScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskD_score') || 0)

    await submitFinalScore(taskAScore, taskBScore, taskCScore, taskDScore)
  }

  const submitFinalScore = async (taskA, taskB, taskC, taskD) => {
    try {
      const response = await fetch('/api/phase4/step3/remedial/b1/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskA,
          task_b_score: taskB,
          task_c_score: taskC,
          task_d_score: taskD,
          task_e_score: 0,
          task_f_score: 0
        })
      })

      const result = await response.json()

      if (result.success) {
        const { passed, required_total } = result.data

        alert(
          `B1 Remedial Complete!\n\nRequired Tasks Score: ${required_total}/27\nPass Threshold: 22/27\n\nResult: ${
            passed ? '✅ PASSED' : '❌ FAILED - Please retry'
          }`
        )

        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Failed to submit final score:', error)
      navigate('/dashboard')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h4" gutterBottom>
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B1 - Task D: Flashcard Game 🃏
          </Typography>
          <Typography variant="body1">
            Match 8 advertising terms to their definitions!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Final task! Study 8 flashcards to memorize advertising terms and their definitions. Click to flip each card. Mark cards as 'Know' or 'Still Learning'. You have 5 minutes!"
          />
        </Paper>

        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
            Ready to Study? 📚
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            8 Flashcards · 5 Minutes · Flip & Memorize
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Start Studying
          </Button>
        </Paper>
      </Box>
    )
  }

  // Completion screen
  if (gameCompleted) {
    const finalScore = sessionStorage.getItem('remedial_step3_b1_taskD_score') || knownCards.length
    const timeBonus = Math.floor(timeLeft / 30)

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h4" gutterBottom>
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B1 - Task D: Flashcard Game 🃏
          </Typography>
        </Paper>

        <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Box sx={{ color: 'white' }}>
            <CheckCircleIcon sx={{ fontSize: 100, mb: 2, color: '#4caf50' }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Flashcards Complete! 🎉
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, mx: 'auto', my: 4 }}>
              <Typography variant="h2" fontWeight="bold" color="primary">
                {finalScore} / 8
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Cards Mastered
              </Typography>
              {timeBonus > 0 && (
                <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                  ⭐ Time Bonus: +{timeBonus} points!
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Time Remaining: {formatTime(timeLeft)}
              </Typography>
            </Paper>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                size="large"
                onClick={handleFinish}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Finish Now (Skip Bonus)
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/phase4/step3/remedial/b1/taskE')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#f57c00' }
                }}
              >
                Try Bonus Tasks! →
              </Button>
            </Stack>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Complete bonus tasks E & F to earn up to 12 extra points!
            </Typography>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Flashcard study mode
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with timer and progress */}
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
            Card {currentCardIndex + 1} / {totalCards}
          </Typography>

          {/* Timer */}
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <TimerIcon sx={{ fontSize: 30 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatTime(timeLeft)}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / 300) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                mt: 1,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: timeLeft <= 60 ? '#ff5252' : '#4caf50'
                }
              }}
            />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold">
              Mastered: {knownCards.length} / 8
            </Typography>
            <Typography variant="body2">
              Studying: {studyingCards.length}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Progress indicator */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={(knownCards.length / totalCards) * 100}
          sx={{
            height: 12,
            borderRadius: 2,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50',
              borderRadius: 2
            }
          }}
        />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {knownCards.length} of {totalCards} cards mastered
        </Typography>
      </Box>

      {/* Flashcard */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper
          elevation={8}
          onClick={handleFlipCard}
          sx={{
            width: 600,
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            backgroundColor: isFlipped ? '#1976d2' : '#46178f',
            '&:hover': {
              boxShadow: 16
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              color: 'white'
            }}
          >
            <Typography variant="overline" sx={{ mb: 2, opacity: 0.8 }}>
              TERM
            </Typography>
            <Typography variant="h2" fontWeight="bold" align="center">
              {currentCard.term}
            </Typography>
            <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 40, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Click to flip
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              color: 'white'
            }}
          >
            <Typography variant="overline" sx={{ mb: 2, opacity: 0.8 }}>
              DEFINITION
            </Typography>
            <Typography variant="h3" fontWeight="bold" align="center">
              {currentCard.definition}
            </Typography>
            <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 40, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Click to flip back
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Navigation and action buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
        <IconButton
          onClick={handlePreviousCard}
          disabled={currentCardIndex === 0}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' },
            '&:disabled': { backgroundColor: 'grey.300' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Button
          variant="contained"
          color="error"
          onClick={handleStillLearning}
          sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
        >
          Still Learning
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleKnowCard}
          sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
        >
          I Know This!
        </Button>

        <IconButton
          onClick={handleNextCard}
          disabled={currentCardIndex === totalCards - 1}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' },
            '&:disabled': { backgroundColor: 'grey.300' }
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>

      {/* Quick complete button for testing */}
      {knownCards.length >= totalCards && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={completeGame}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Complete Flashcards
          </Button>
        </Box>
      )}
    </Box>
  )
}
