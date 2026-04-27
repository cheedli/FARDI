import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Grid, Container, useTheme, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 3 - Remedial B1 - Task D: Flashcard Game
 * Flip flashcards to match 8 terms to definitions
 * Score: +1 for each correct match (8 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

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
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_b1' })
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gameStarted] = useState(true)

  useEffect(() => {
    if (gameStarted && !submitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, gameStarted, submitted])

  const cards = useMemo(() => {
    const allCards = []
    FLASHCARD_PAIRS.forEach((pair, index) => {
      allCards.push({ id: `term-${index}`, type: 'term', value: pair.term, pairIndex: index })
      allCards.push({ id: `def-${index}`, type: 'definition', value: pair.definition, pairIndex: index })
    })
    return allCards.sort(() => Math.random() - 0.5)
  }, [])

  const handleCardClick = (cardId) => {
    if (submitted || timeLeft === 0 || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))) return
    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)
    if (newFlipped.length === 2) {
      setAttempts(attempts + 1)
      const card1 = cards.find(c => c.id === newFlipped[0])
      const card2 = cards.find(c => c.id === newFlipped[1])
      if (card1.pairIndex === card2.pairIndex) {
        setMatchedPairs([...matchedPairs, newFlipped])
        setFlippedCards([])
      } else {
        setTimeout(() => setFlippedCards([]), 1500)
      }
    }
  }

  const isCardFlipped = (cardId) => flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))
  const isCardMatched = (cardId) => matchedPairs.some(pair => pair.includes(cardId))

  const handleSubmit = async () => {
    const score = matchedPairs.length
    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b1_taskD_score', score)
    await logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'D', step: 4, score, max_score: 8, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase4/step/3/remedial/b1/taskE')
  window.__remedialSkip = handleContinue
  const allMatched = matchedPairs.length === FLASHCARD_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B1 - Task D: Flashcard Game 🃏</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Flip cards to match 8 advertising terms with their definitions!</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Time for the Flashcard Game! Click on cards to flip them. Find matching pairs of terms and definitions. When you find a match, both cards will stay flipped. Match all 8 pairs!" />
          </Box>

          {/* Stats */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.teal.border }}>{matchedPairs.length} / 8</Typography>
                <Typography variant="caption" sx={{ color: P.teal.shadow }}>Matches Found</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.border }}>{attempts}</Typography>
                <Typography variant="caption" sx={{ color: P.teal.shadow }}>Attempts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <TimerIcon sx={{ fontSize: 30, color: timeLeft <= 30 ? P.red.border : P.yellow.border }} />
                  <Typography variant="h4" fontWeight="bold" sx={{
                    color: timeLeft <= 30 ? P.red.border : P.yellow.border,
                    animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.1)' } }
                  }}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: P.teal.shadow }}>Time Left</Typography>
                <LinearProgress variant="determinate" value={(timeLeft / 120) * 100} sx={{ mt: 1, height: 6, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 30 ? P.red.border : P.yellow.border } }} />
              </Box>
            </Stack>
          </Box>

          {!submitted && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {cards.map((card) => {
                  const flipped = isCardFlipped(card.id)
                  const matched = isCardMatched(card.id)
                  return (
                    <Grid item xs={6} sm={4} md={3} key={card.id}>
                      <Box onClick={() => handleCardClick(card.id)} sx={{
                        height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: matched || flipped ? 'default' : 'pointer',
                        bgcolor: matched ? P.green.bg : flipped ? P.blue.bg : P.yellow.bg,
                        border: `2px solid ${matched ? P.green.border : flipped ? P.blue.border : P.yellow.border}`,
                        borderRadius: '16px',
                        boxShadow: `3px 3px 0 ${matched ? P.green.shadow : flipped ? P.blue.shadow : P.yellow.shadow}`,
                        transition: 'all 0.3s',
                        '&:hover': matched || flipped ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.yellow.shadow}` }
                      }}>
                        {flipped ? (
                          <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: matched ? P.green.shadow : P.blue.shadow, wordBreak: 'break-word' }}>
                              {card.value}
                            </Typography>
                            {matched && <CheckCircleIcon sx={{ color: P.green.border, mt: 1, fontSize: 30 }} />}
                          </Box>
                        ) : (
                          <AutorenewIcon sx={{ fontSize: 50, color: P.yellow.shadow }} />
                        )}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>

              {allMatched && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
                  <Box component="button" onClick={handleSubmit} sx={{
                    bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px',
                    boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer',
                    fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                  }}>
                    Submit All Matches 🃏
                  </Box>
                </Stack>
              )}
            </>
          )}

          {submitted && (
            <Box>
              <Box sx={{
                bgcolor: matchedPairs.length === 8 ? P.green.bg : P.yellow.bg,
                border: `2px solid ${matchedPairs.length === 8 ? P.green.border : P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow}`,
                p: 4, textAlign: 'center', mb: 3
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow }}>
                  {matchedPairs.length === 8 ? '🃏 Perfect Matching! 🃏' : timeLeft === 0 ? "⏰ Time's Up! ⏰" : '🌟 Game Complete! 🌟'}
                </Typography>
                <Typography variant="h6" sx={{ color: matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow }}>
                  You matched {matchedPairs.length} out of 8 pairs in {attempts} attempts!
                </Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>All Correct Matches:</Typography>
                <Grid container spacing={2}>
                  {FLASHCARD_PAIRS.map((pair, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.green.shadow }}>{index + 1}. {pair.term}</Typography>
                        <Typography variant="body2" sx={{ color: P.green.border }}>→ {pair.definition}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer',
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}>
                  Continue to Task E →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
