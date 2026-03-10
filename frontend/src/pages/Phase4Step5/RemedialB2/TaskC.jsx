import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Grid, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial B2 - Task C: Kahoot Match
 * Match 8 terms to definitions
 * Gamified as "Kahoot Match"
 * Score: +1 for each correct match (8 total)
 */

const MATCHING_PAIRS = [
  { term: 'gatefold', definition: 'Folded layout' },
  { term: 'animation', definition: 'Moving images' },
  { term: 'jingle', definition: 'Catchy tune' },
  { term: 'dramatisation', definition: 'Scripted story' },
  { term: 'sketch', definition: 'Plan drawing' },
  { term: 'clip', definition: 'Short segment' },
  { term: 'storytelling', definition: 'Narrative technique' },
  { term: 'eye-catcher', definition: 'Attention grabber' }
]

export default function Phase4Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_b2' })
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [gameStarted, setGameStarted] = useState(true)

  // Timer countdown
  useEffect(() => {
    if (gameStarted && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, gameStarted, submitted])

  // Create shuffled cards (terms and definitions mixed)
  const cards = useMemo(() => {
    const allCards = []
    MATCHING_PAIRS.forEach((pair, index) => {
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
    sessionStorage.setItem('phase4_step5_remedial_b2_taskC_score', score)

    await logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'C',
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
    navigate('/phase4/step/5/remedial/b2/taskD')
  }

  const allMatched = matchedPairs.length === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task C: Kahoot Match 🎮
        </Typography>
        <Typography variant="body1">
          Match 8 advertising terms to their definitions!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Time for Kahoot Match! 🎮 Click on cards to flip them. Find matching pairs of terms and their definitions. When you find a match, both cards will stay flipped. Match all 8 pairs before time runs out!"
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
          {/* Matching Grid */}
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
                      backgroundColor: matched ? 'success.light' : flipped ? (card.type === 'term' ? 'primary.light' : 'secondary.light') : 'grey.200',
                      border: matched ? '3px solid' : '2px solid',
                      borderColor: matched ? 'success.main' : (flipped ? (card.type === 'term' ? 'primary.main' : 'secondary.main') : 'grey.400'),
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
                            color: matched ? 'success.dark' : (card.type === 'term' ? 'primary.dark' : 'secondary.dark'),
                            wordBreak: 'break-word'
                          }}
                        >
                          {card.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {card.type === 'term' ? '📚 Term' : '📖 Definition'}
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
                Submit All Matches 🎮
              </Button>
            </Stack>
          )}
        </>
      )}

      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: matchedPairs.length === 8 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={matchedPairs.length === 8 ? 'success.dark' : 'warning.dark'}>
              {matchedPairs.length === 8 ? '🎮 Perfect Matching! 🎮' : timeLeft === 0 ? '⏰ Time\'s Up! ⏰' : '🌟 Game Complete! 🌟'}
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
              All Term-Definition Pairs:
            </Typography>
            <Grid container spacing={2}>
              {MATCHING_PAIRS.map((pair, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid #8e44ad' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
                      {index + 1}. 📚 Term: {pair.term}
                    </Typography>
                    <Typography variant="body2" color="secondary.dark" fontWeight="bold">
                      📖 Definition: {pair.definition}
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
              Continue to Task D →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
