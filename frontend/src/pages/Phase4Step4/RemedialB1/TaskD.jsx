import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Grid, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B1 - Task D: Flashcard Game
 * Flip flashcards to match 8 terms to definitions
 * Score: +1 for each correct match (8 total)
 */

const FLASHCARD_PAIRS = [
  { term: 'promotional', definition: 'To promote or sell' },
  { term: 'persuasive', definition: 'To convince using ethos/pathos/logos' },
  { term: 'targeted', definition: 'For a specific audience/group' },
  { term: 'original', definition: 'New and unique idea' },
  { term: 'creative', definition: 'Using imagination to make memorable' },
  { term: 'consistent', definition: 'Same style/message across ads' },
  { term: 'personalized', definition: 'Customized for individuals' },
  { term: 'ethical', definition: 'Honest and fair, no lies' }
]

export default function RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_b1' })
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes = 120 seconds
  const [gameStarted, setGameStarted] = useState(true)

  // Timer countdown
  useEffect(() => {
    if (gameStarted && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !submitted) {
      // Time's up! Auto-submit
      handleSubmit()
    }
  }, [timeLeft, gameStarted, submitted])

  // Create shuffled cards (terms and definitions mixed)
  const cards = useMemo(() => {
    const allCards = []
    FLASHCARD_PAIRS.forEach((pair, index) => {
      allCards.push({ id: `term-${index}`, type: 'term', value: pair.term, pairIndex: index })
      allCards.push({ id: `def-${index}`, type: 'definition', value: pair.definition, pairIndex: index })
    })
    return allCards.sort(() => Math.random() - 0.5)
  }, [])

  const handleCardClick = (cardId) => {
    if (submitted || timeLeft === 0 || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))) {
      return
    }

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setAttempts(attempts + 1)

      // Check if they match
      const card1 = cards.find(c => c.id === newFlipped[0])
      const card2 = cards.find(c => c.id === newFlipped[1])

      if (card1.pairIndex === card2.pairIndex) {
        // Match found!
        setMatchedPairs([...matchedPairs, newFlipped])
        setFlippedCards([])
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  const isCardFlipped = (cardId) => {
    return flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))
  }

  const isCardMatched = (cardId) => {
    return matchedPairs.some(pair => pair.includes(cardId))
  }

  const handleSubmit = async () => {
    const score = matchedPairs.length
    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b1_taskD_score', score)

    await logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'D',
          step: 4,
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
    navigate('/phase4/step/4/remedial/b1/taskE')
  }

  const allMatched = matchedPairs.length === FLASHCARD_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task D: Flashcard Game 🃏
        </Typography>
        <Typography variant="body1">
          Flip cards to match 8 advertising terms with their definitions!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time for the Flashcard Game! Click on cards to flip them. Find matching pairs of terms and definitions. When you find a match, both cards will stay flipped. Match all 8 pairs!"
        />
      </Paper>

      {/* Game Stats with Timer */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {matchedPairs.length} / 8
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Matches Found
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="secondary">
              {attempts}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Attempts
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <TimerIcon sx={{ fontSize: 30, color: timeLeft <= 30 ? 'error.main' : 'warning.main' }} />
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: timeLeft <= 30 ? 'error.main' : 'warning.main',
                  animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' }
                  }
                }}
              >
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Time Left
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / 120) * 100}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: timeLeft <= 30 ? 'error.main' : 'warning.main'
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {!submitted && (
        <>
          {/* Flashcard Grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => {
              const flipped = isCardFlipped(card.id)
              const matched = isCardMatched(card.id)

              return (
                <Grid item xs={6} sm={4} md={3} key={card.id}>
                  <Paper
                    onClick={() => handleCardClick(card.id)}
                    elevation={flipped ? 6 : 2}
                    sx={{
                      height: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: matched || flipped ? 'default' : 'pointer',
                      backgroundColor: matched ? 'success.light' : flipped ? 'primary.light' : 'grey.200',
                      border: matched ? '3px solid' : '2px solid',
                      borderColor: matched ? 'success.main' : 'grey.400',
                      transition: 'all 0.3s',
                      position: 'relative',
                      '&:hover': {
                        transform: matched || flipped ? 'none' : 'scale(1.05)',
                        boxShadow: matched || flipped ? undefined : 6
                      }
                    }}
                  >
                    {flipped ? (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{
                            color: matched ? 'success.dark' : 'primary.dark',
                            wordBreak: 'break-word'
                          }}
                        >
                          {card.value}
                        </Typography>
                        {matched && (
                          <CheckCircleIcon sx={{ color: 'success.main', mt: 1, fontSize: 30 }} />
                        )}
                      </Box>
                    ) : (
                      <AutorenewIcon sx={{ fontSize: 50, color: 'grey.500' }} />
                    )}
                  </Paper>
                </Grid>
              )
            })}
          </Grid>

          {/* Submit Button */}
          {allMatched && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                size="large"
              >
                Submit All Matches 🃏
              </Button>
            </Stack>
          )}
        </>
      )}

      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: matchedPairs.length === 8 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={matchedPairs.length === 8 ? 'success.dark' : 'warning.dark'}>
              {matchedPairs.length === 8 ? '🃏 Perfect Matching! 🃏' : timeLeft === 0 ? '⏰ Time\'s Up! ⏰' : '🌟 Game Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You matched {matchedPairs.length} out of 8 pairs in {attempts} attempts!
            </Typography>
            {timeLeft === 0 && matchedPairs.length < 8 && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                The 2-minute timer ran out. Here's your score!
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Correct Matches:
            </Typography>
            <Grid container spacing={2}>
              {FLASHCARD_PAIRS.map((pair, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid #4caf50' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      {index + 1}. {pair.term}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      → {pair.definition}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Continue to Task E →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
