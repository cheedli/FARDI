import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, LinearProgress, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

/**
 * Phase 4 Step 3 - Remedial B1 - Task D: Flashcard Game
 */

const FLASHCARDS = [
  { id: 1, term: 'promotional', definition: 'To promote or sell' },
  { id: 2, term: 'persuasive', definition: 'To convince using ethos/pathos/logos' },
  { id: 3, term: 'targeted', definition: 'For a specific audience/group' },
  { id: 4, term: 'original', definition: 'New and unique idea' },
  { id: 5, term: 'creative', definition: 'Using imagination to make memorable' },
  { id: 6, term: 'consistent', definition: 'Same style/message across ads' },
  { id: 7, term: 'personalized', definition: 'Customized for individuals' },
  { id: 8, term: 'ethical', definition: 'Honest and fair, no lies' }
]

export default function RemedialB1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_b1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState([])
  const [studyingCards, setStudyingCards] = useState([])
  const [timeLeft, setTimeLeft] = useState(300)
  const [gameCompleted, setGameCompleted] = useState(false)

  const shuffledCards = useMemo(() => [...FLASHCARDS].sort(() => Math.random() - 0.5), [])
  const currentCard = shuffledCards[currentCardIndex]
  const totalCards = shuffledCards.length

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timer); handleTimeUp(); return 0 }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, gameCompleted])

  const handleStartGame = () => setGameStarted(true)
  const handleFlipCard = () => setIsFlipped(!isFlipped)

  const handleKnowCard = () => {
    if (!knownCards.includes(currentCard.id)) setKnownCards([...knownCards, currentCard.id])
    setStudyingCards(studyingCards.filter(id => id !== currentCard.id))
    if (currentCardIndex + 1 < totalCards) { setCurrentCardIndex(currentCardIndex + 1); setIsFlipped(false) }
    else { if (knownCards.length + 1 >= totalCards) completeGame(); else { setCurrentCardIndex(0); setIsFlipped(false) } }
  }

  const handleStillLearning = () => {
    if (!studyingCards.includes(currentCard.id) && !knownCards.includes(currentCard.id)) setStudyingCards([...studyingCards, currentCard.id])
    if (currentCardIndex + 1 < totalCards) { setCurrentCardIndex(currentCardIndex + 1); setIsFlipped(false) }
    else { setCurrentCardIndex(0); setIsFlipped(false) }
  }

  const handlePreviousCard = () => { if (currentCardIndex > 0) { setCurrentCardIndex(currentCardIndex - 1); setIsFlipped(false) } }
  const handleNextCard = () => { if (currentCardIndex + 1 < totalCards) { setCurrentCardIndex(currentCardIndex + 1); setIsFlipped(false) } }
  const handleTimeUp = () => completeGame()

  const completeGame = () => {
    setGameCompleted(true)
    const finalScore = knownCards.length + (knownCards.includes(currentCard.id) ? 0 : 1)
    const timeBonus = Math.floor(timeLeft / 30)
    sessionStorage.setItem('remedial_step3_b1_taskD_score', finalScore)
    logTaskCompletion(finalScore, timeBonus)
  }

  const logTaskCompletion = async (score, bonus) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'D', step: 2, score, max_score: 8, time_bonus: bonus, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleFinish = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskA_score') || 0)
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskB_score') || 0)
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskC_score') || 0)
    const taskDScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskD_score') || 0)
    try {
      const response = await fetch('/api/phase4/step3/remedial/b1/final-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore, task_e_score: 0, task_f_score: 0 })
      })
      const result = await response.json()
      if (result.success) {
        const { passed, required_total } = result.data
        alert(`B1 Remedial Complete!\n\nRequired Tasks Score: ${required_total}/27\nPass Threshold: 22/27\n\nResult: ${passed ? '✅ PASSED' : '❌ FAILED - Please retry'}`)
        navigate('/dashboard')
      }
    } catch (error) { console.error('Failed to submit final score:', error); navigate('/dashboard') }
  }

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B1 - Task D: Flashcard Game 🃏</Typography>
              <Typography variant="body1">Match 8 advertising terms to their definitions!</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Final task! Study 8 flashcards to memorize advertising terms and their definitions. Click to flip each card. Mark cards as 'Know' or 'Still Learning'. You have 5 minutes!" />
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold">Ready to Study? 📚</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>8 Flashcards · 5 Minutes · Flip & Memorize</Typography>
              <Box
                component="button"
                onClick={handleStartGame}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Start Studying
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameCompleted) {
    const finalScore = sessionStorage.getItem('remedial_step3_b1_taskD_score') || knownCards.length
    const timeBonus = Math.floor(timeLeft / 30)
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5">Level B1 - Task D: Flashcard Game 🃏</Typography>
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <CheckCircleIcon sx={{ fontSize: 80, mb: 2, color: P.green.border }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">Flashcards Complete! 🎉</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 320, mx: 'auto', my: 4 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.blue.border }}>{finalScore} / 8</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>Cards Mastered</Typography>
                {timeBonus > 0 && <Typography variant="body1" sx={{ color: P.green.border, mt: 2 }}>⭐ Time Bonus: +{timeBonus} points!</Typography>}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Time Remaining: {formatTime(timeLeft)}</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Box
                  component="button"
                  onClick={handleFinish}
                  sx={{
                    ...cardSx('blue'), cursor: 'pointer', px: 4, py: 1.5,
                    fontSize: '0.9rem', fontWeight: 'bold', color: P.blue.border, transition: 'all 0.2s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
                  }}
                >
                  Finish Now (Skip Bonus)
                </Box>
                <Box
                  component="button"
                  onClick={() => navigate('/phase4/step3/remedial/b1/taskE')}
                  sx={{
                    ...cardSx('orange'), cursor: 'pointer', px: 4, py: 1.5,
                    fontSize: '1rem', fontWeight: 'bold', color: P.orange.border, transition: 'all 0.2s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
                  }}
                >
                  Try Bonus Tasks! →
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Complete bonus tasks E & F to earn up to 12 extra points!
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header with timer */}
          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">Card {currentCardIndex + 1} / {totalCards}</Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <TimerIcon />
                  <Typography variant="h4" fontWeight="bold">{formatTime(timeLeft)}</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(timeLeft / 300) * 100}
                  sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 60 ? P.red?.border || '#ef4444' : P.green.border } }}
                />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">Mastered: {knownCards.length} / 8</Typography>
                <Typography variant="body2">Studying: {studyingCards.length}</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Progress bar */}
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={(knownCards.length / totalCards) * 100}
              sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.green.border, borderRadius: 6 } }}
            />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              {knownCards.length} of {totalCards} cards mastered
            </Typography>
          </Box>

          {/* Flashcard */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              onClick={handleFlipCard}
              sx={{
                width: 560, height: 360,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                bgcolor: isFlipped ? P.blue.bg : P.purple.bg,
                border: `2px solid ${isFlipped ? P.blue.border : P.purple.border}`,
                borderRadius: '20px',
                boxShadow: `6px 6px 0 ${isFlipped ? P.blue.shadow : P.purple.shadow}`,
              }}
            >
              {/* Front */}
              <Box sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Typography variant="overline" sx={{ mb: 2, opacity: 0.8 }}>TERM</Typography>
                <Typography variant="h2" fontWeight="bold" align="center">{currentCard.term}</Typography>
                <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 40, opacity: 0.6 }} />
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Click to flip</Typography>
              </Box>
              {/* Back */}
              <Box sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Typography variant="overline" sx={{ mb: 2, opacity: 0.8 }}>DEFINITION</Typography>
                <Typography variant="h3" fontWeight="bold" align="center">{currentCard.definition}</Typography>
                <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 40, opacity: 0.6 }} />
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Click to flip back</Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation + action buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <IconButton
              onClick={handlePreviousCard}
              disabled={currentCardIndex === 0}
              sx={{ ...cardSx('blue'), '&:disabled': { opacity: 0.3 } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              component="button"
              onClick={handleStillLearning}
              sx={{
                ...cardSx('orange'), cursor: 'pointer', px: 3, py: 1.5,
                fontWeight: 'bold', fontSize: '0.9rem', color: P.orange.border, transition: 'all 0.2s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
              }}
            >
              Still Learning
            </Box>
            <Box
              component="button"
              onClick={handleKnowCard}
              sx={{
                ...cardSx('green'), cursor: 'pointer', px: 3, py: 1.5,
                fontWeight: 'bold', fontSize: '0.9rem', color: P.green.border, transition: 'all 0.2s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
              }}
            >
              I Know This!
            </Box>
            <IconButton
              onClick={handleNextCard}
              disabled={currentCardIndex === totalCards - 1}
              sx={{ ...cardSx('blue'), '&:disabled': { opacity: 0.3 } }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Stack>

          {knownCards.length >= totalCards && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box
                component="button"
                onClick={completeGame}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 5, py: 1.5,
                  fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Complete Flashcards
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
