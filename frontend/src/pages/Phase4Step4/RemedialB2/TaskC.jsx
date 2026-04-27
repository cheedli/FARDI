import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, Grid, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Task C: Kahoot Match
 * Match 8 terms to definitions
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

const MATCHING_PAIRS = [
  { term: 'gatefold', definition: 'Folded layout' },
  { term: 'animation', definition: 'Moving images' },
  { term: 'jingle', definition: 'Catchy tune' },
  { term: 'dramatisation', definition: 'Scripted story' },
  { term: 'sketch', definition: 'Plan drawing' },
  { term: 'clip', definition: 'Short segment' },
  { term: 'storytelling', definition: 'Narrative technique' },
  { term: 'eye-catcher', definition: 'Attention grabber' },
]

export default function Phase4Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_b2' })
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)

  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, submitted])

  const cards = useMemo(() => {
    const allCards = []
    MATCHING_PAIRS.forEach((pair, index) => {
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
      setAttempts(a => a + 1)
      const card1 = cards.find(c => c.id === newFlipped[0])
      const card2 = cards.find(c => c.id === newFlipped[1])
      if (card1.pairIndex === card2.pairIndex) {
        setMatchedPairs(prev => [...prev, newFlipped]); setFlippedCards([])
      } else {
        setTimeout(() => setFlippedCards([]), 1500)
      }
    }
  }

  const isCardFlipped = (cardId) => flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))
  const isCardMatched = (cardId) => matchedPairs.some(pair => pair.includes(cardId))
  const allMatched = matchedPairs.length === MATCHING_PAIRS.length

  const handleSubmit = async () => {
    const score = matchedPairs.length
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_b2_taskC_score', score)
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'C', score, max_score: 8, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b2/taskD')
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 4: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task C: Kahoot Match 🎮</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Match 8 advertising terms to their definitions!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Time for Kahoot Match! 🎮 Click on cards to flip them. Find matching pairs of terms and their definitions. When you find a match, both cards will stay flipped. Match all 8 pairs before time runs out!" />
          </Box>

          {/* Stats Row */}
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
            <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow }}>{matchedPairs.length} / 8</Typography>
                <Typography variant="caption" sx={{ color: P.purple.border }}>Matches Found</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow }}>{attempts}</Typography>
                <Typography variant="caption" sx={{ color: P.purple.border }}>Attempts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: timeLeft <= 30 ? P.red.border : P.yellow.border, animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.1)' } } }}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: P.purple.border }}>Time Left</Typography>
                <LinearProgress variant="determinate" value={(timeLeft / 120) * 100} sx={{ mt: 0.5, height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 30 ? P.red.border : P.green.border } }} />
              </Box>
            </Stack>
          </Box>

          {!submitted ? (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {cards.map((card) => {
                  const flipped = isCardFlipped(card.id)
                  const matched = isCardMatched(card.id)
                  return (
                    <Grid item xs={6} sm={4} md={3} key={card.id}>
                      <Box onClick={() => handleCardClick(card.id)}
                        sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: matched || flipped ? 'default' : 'pointer', bgcolor: matched ? P.green.bg : flipped ? (card.type === 'term' ? P.blue.bg : P.purple.bg) : P.yellow.bg, border: `2px solid ${matched ? P.green.border : flipped ? (card.type === 'term' ? P.blue.border : P.purple.border) : P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${matched ? P.green.shadow : flipped ? (card.type === 'term' ? P.blue.shadow : P.purple.shadow) : P.yellow.shadow}`, transition: 'all 0.3s', '&:hover': matched || flipped ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.yellow.shadow}` } }}>
                        {flipped ? (
                          <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: matched ? P.green.shadow : card.type === 'term' ? P.blue.shadow : P.purple.shadow, wordBreak: 'break-word' }}>
                              {card.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                              {card.type === 'term' ? '📚 Term' : '📖 Definition'}
                            </Typography>
                            {matched && <Typography sx={{ fontSize: '1.4rem', mt: 0.5 }}>✓</Typography>}
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: '2.5rem' }}>🔄</Typography>
                        )}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>

              {allMatched && (
                <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
                  <Box component="button" onClick={handleSubmit} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                    Submit All Matches 🎮
                  </Box>
                </Stack>
              )}
            </>
          ) : (
            <Box>
              <Box sx={{ bgcolor: matchedPairs.length === 8 ? P.green.bg : P.yellow.bg, border: `2px solid ${matchedPairs.length === 8 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow }}>
                  {matchedPairs.length === 8 ? '🎮 Perfect Matching! 🎮' : timeLeft === 0 ? "⏰ Time's Up! ⏰" : '🌟 Game Complete! 🌟'}
                </Typography>
                <Typography variant="h6" sx={{ color: matchedPairs.length === 8 ? P.green.border : P.yellow.border, mt: 1 }}>
                  You matched {matchedPairs.length} out of 8 pairs in {attempts} attempts!
                </Typography>
                {timeLeft === 0 && matchedPairs.length < 8 && (
                  <Typography variant="body2" sx={{ color: matchedPairs.length === 8 ? P.green.shadow : P.yellow.shadow, mt: 1 }}>The 2-minute timer ran out. Here's your score!</Typography>
                )}
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>All Term-Definition Pairs:</Typography>
                <Grid container spacing={2}>
                  {MATCHING_PAIRS.map((pair, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.purple.shadow}`, p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.shadow }}>{index + 1}. 📚 Term: {pair.term}</Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.shadow }}>📖 Definition: {pair.definition}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                  Continue to Task D →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
