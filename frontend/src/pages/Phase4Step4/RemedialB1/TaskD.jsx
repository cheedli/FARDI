import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Grid, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B1 - Task D: Quizlet Flashcards
 * Flip flashcards to correct faulty terms
 * Score: +1 for each correct match (8 total)
 */

const FLASHCARD_PAIRS = [
  { term: 'gatfold', definition: 'gatefold' },
  { term: 'letering', definition: 'lettering' },
  { term: 'animasion', definition: 'animation' },
  { term: 'jingel', definition: 'jingle' },
  { term: 'dramatisation', definition: 'dramatisation' },
  { term: 'skech', definition: 'sketch' },
  { term: 'clipp', definition: 'clip' },
  { term: 'slogon', definition: 'slogan' }
]

export default function Phase4Step5RemedialB1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_b1' })
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gameStarted, setGameStarted] = useState(true)

  useEffect(() => {
    if (gameStarted && !submitted && timeLeft > 0) {
      const timer = setInterval(() => { setTimeLeft(prev => prev - 1) }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, gameStarted, submitted])

  const cards = useMemo(() => {
    const allCards = []
    FLASHCARD_PAIRS.forEach((pair, index) => {
      allCards.push({ id: `faulty-${index}`, type: 'faulty', value: pair.term, pairIndex: index })
      allCards.push({ id: `correct-${index}`, type: 'correct', value: pair.definition, pairIndex: index })
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
    sessionStorage.setItem('phase4_step5_remedial_b1_taskD_score', score)
    await logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'D', score, max_score: 8, completed: true })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => { navigate('/phase4/step/4/remedial/b1/taskE') }
  window.__remedialSkip = handleContinue
  const allMatched = matchedPairs.length === FLASHCARD_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 Step 4: Evaluate - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level B1 - Task D: Quizlet Flashcards
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Flip cards to match 8 faulty spellings with their corrections!
            </Typography>
          </Box>

          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage character="LILIA" message="Time for the Quizlet Flashcards! Click on cards to flip them. Find matching pairs of faulty spellings and their corrections. When you find a match, both cards will stay flipped. Match all 8 pairs before time runs out!" />
          </Box>

          {/* Game Stats */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 2, mb: 3,
          }}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" flexWrap="wrap">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.yellow.shadow }}>{matchedPairs.length} / 8</Typography>
                <Typography variant="caption" sx={{ color: P.yellow.shadow, opacity: 0.7 }}>Matches</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.yellow.shadow }}>{attempts}</Typography>
                <Typography variant="caption" sx={{ color: P.yellow.shadow, opacity: 0.7 }}>Attempts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <TimerIcon sx={{ fontSize: 30, color: timeLeft <= 30 ? P.red.shadow : P.yellow.shadow }} />
                  <Typography variant="h4" fontWeight="bold" sx={{
                    color: timeLeft <= 30 ? P.red.shadow : P.yellow.shadow,
                    animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.1)' } }
                  }}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: P.yellow.shadow, opacity: 0.7 }}>Time Left</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(timeLeft / 120) * 100}
                  sx={{
                    mt: 1, height: 6, borderRadius: 1,
                    bgcolor: isDark ? '#3D2E00' : '#FEF9C3',
                    '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 30 ? P.red.shadow : P.yellow.shadow }
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {!submitted && (
            <>
              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
                {cards.map((card) => {
                  const flipped = isCardFlipped(card.id)
                  const matched = isCardMatched(card.id)
                  const cardColor = matched ? P.green : flipped ? (card.type === 'faulty' ? P.red : P.blue) : P.yellow

                  return (
                    <Grid item xs={4} sm={3} md={3} key={card.id}>
                      <Box
                        onClick={() => handleCardClick(card.id)}
                        sx={{
                          height: { xs: 90, sm: 130, md: 150 },
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: matched || flipped ? 'default' : 'pointer',
                          bgcolor: cardColor.bg,
                          border: `2px solid ${cardColor.border}`,
                          borderRadius: '16px',
                          boxShadow: flipped || matched ? `3px 3px 0 ${cardColor.shadow}` : `2px 2px 0 ${cardColor.shadow}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: matched || flipped ? 'none' : 'translate(-2px,-2px)',
                            boxShadow: matched || flipped ? `3px 3px 0 ${cardColor.shadow}` : `4px 4px 0 ${cardColor.shadow}`
                          }
                        }}
                      >
                        {flipped ? (
                          <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" fontWeight="bold" sx={{
                              color: cardColor.shadow, wordBreak: 'break-word',
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}>
                              {card.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: cardColor.shadow, opacity: 0.7, display: 'block', mt: 0.5 }}>
                              {card.type === 'faulty' ? '❌ Faulty' : '✓ Correct'}
                            </Typography>
                            {matched && <CheckCircleIcon sx={{ color: P.green.shadow, mt: 1, fontSize: 30 }} />}
                          </Box>
                        ) : (
                          <AutorenewIcon sx={{ fontSize: { xs: 30, sm: 40, md: 50 }, color: P.yellow.shadow }} />
                        )}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>

              {allMatched && (
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                  <Box component="button" onClick={handleSubmit} sx={{
                    bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', color: P.green.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s ease',
                  }}>
                    Submit All Matches
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
                p: 4, mt: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow }}>
                  {matchedPairs.length === 8 ? 'Perfect Matching!' : timeLeft === 0 ? "Time's Up!" : 'Game Complete!'}
                </Typography>
                <Typography variant="h6" sx={{ color: matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow }}>
                  You matched {matchedPairs.length} out of 8 pairs in {attempts} attempts!
                </Typography>
              </Box>

              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mt: 3,
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow }}>All Correct Spellings:</Typography>
                <Grid container spacing={2}>
                  {FLASHCARD_PAIRS.map((pair, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{
                        bgcolor: isDark ? '#1a1a2e' : '#fff',
                        border: `2px solid ${P.green.border}`,
                        borderLeft: `4px solid ${P.green.shadow}`,
                        borderRadius: '12px', p: 2,
                      }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.shadow }}>
                          {index + 1}. ❌ Faulty: {pair.term}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                          ✓ Correct: {pair.definition}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.orange.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s ease',
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
