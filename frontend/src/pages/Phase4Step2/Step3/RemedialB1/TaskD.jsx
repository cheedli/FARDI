import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import { ArrowForward, ArrowBack } from '@mui/icons-material'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level B1 - Task D: Flashcard Game
 * Flip flashcards to match terms to definitions
 * Quizlet-style 3D flip cards
 */

const FLASHCARDS = [
  { id: 1, term: 'hashtag', definition: '# for search' },
  { id: 2, term: 'caption', definition: 'Text under photo' },
  { id: 3, term: 'emoji', definition: 'Picture feeling' },
  { id: 4, term: 'tag', definition: '@ mention' },
  { id: 5, term: 'call-to-action', definition: 'Tell to act' },
  { id: 6, term: 'post', definition: 'Photo + text' },
  { id: 7, term: 'story', definition: '24h content' },
  { id: 8, term: 'like', definition: 'Heart button' }
]

export default function Phase4_2Step3RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 4, context: 'remedial_b1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [viewed, setViewed] = useState(new Set())

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

  const shuffledCards = useMemo(() => [...FLASHCARDS].sort(() => Math.random() - 0.5), [])
  const currentCard = shuffledCards[currentIndex]
  const hasViewedAll = viewed.size === shuffledCards.length

  const handleFlipCard = () => {
    if (!isFlipped) {
      const newViewed = new Set(viewed)
      newViewed.add(currentCard.id)
      setViewed(newViewed)
    }
    setIsFlipped(!isFlipped)
  }

  const handlePreviousCard = () => {
    if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setIsFlipped(false) }
  }

  const handleNextCard = () => {
    if (currentIndex < shuffledCards.length - 1) { setCurrentIndex(currentIndex + 1); setIsFlipped(false) }
  }

  const handleContinue = () => {
    const score = viewed.size
    sessionStorage.setItem('phase4_2_step3_b1_taskD', score.toString())
    logTaskCompletion(score, FLASHCARDS.length)
    navigate('/phase4_2/step/3/remedial/b1/results')
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'B1', task: 'D', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>Phase 4.2 Step 3 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task D: Flashcard Game</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>Learn social media terms through flashcards. Browse all 8 terms to continue!</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Time to test your memory! Browse through the flashcards to match terms with their definitions. Click on each flashcard to flip and reveal the definition. View all 8 terms to complete this task!" />
          </Box>

          {/* Progress bar */}
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.purple.shadow }}>Card {currentIndex + 1} / {shuffledCards.length}</Typography>
              <Typography variant="body2" sx={{ color: P.purple.shadow }}>{viewed.size}/{shuffledCards.length} viewed {hasViewedAll ? '- All Done!' : ''}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={(viewed.size / shuffledCards.length) * 100}
              sx={{ height: 8, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: 4 } }}
            />
          </Box>

          {/* 3D Flashcard */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, perspective: '1000px' }}>
            <Box onClick={handleFlipCard} sx={{
              width: 560, height: 340,
              cursor: 'pointer',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* Front - TERM */}
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%',
                backfaceVisibility: 'hidden',
                bgcolor: P.purple.bg, border: `3px solid ${P.purple.border}`,
                borderRadius: '20px', boxShadow: `6px 6px 0 ${P.purple.shadow}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4,
              }}>
                <Typography variant="overline" sx={{ mb: 1, color: P.purple.border, fontWeight: 700, fontSize: '0.9rem' }}>TERM</Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold', textAlign: 'center', color: P.purple.shadow }}>{currentCard.term}</Typography>
                <FlipCameraAndroidIcon sx={{ mt: 3, fontSize: 40, color: P.purple.border, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow, opacity: 0.7 }}>Click to flip and see definition</Typography>
              </Box>

              {/* Back - DEFINITION */}
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                bgcolor: P.blue.bg, border: `3px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `6px 6px 0 ${P.blue.shadow}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4,
              }}>
                <Typography variant="overline" sx={{ mb: 1, color: P.blue.border, fontWeight: 700, fontSize: '0.9rem' }}>DEFINITION</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: P.blue.shadow, mb: 2 }}>{currentCard.definition}</Typography>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', border: `2px solid ${P.blue.border}`, borderRadius: '12px', px: 3, py: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>{currentCard.term} = {currentCard.definition}</Typography>
                </Box>
                <FlipCameraAndroidIcon sx={{ mt: 3, fontSize: 32, color: P.blue.border, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow, opacity: 0.7 }}>Click to flip back</Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box component="button" onClick={handlePreviousCard} disabled={currentIndex === 0} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              width: 48, height: 48, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.blue.shadow,
              '&:hover': { transform: currentIndex === 0 ? 'none' : 'translate(-2px,-2px)' }
            }}><ArrowBack /></Box>

            <Typography variant="h6" sx={{ minWidth: 120, textAlign: 'center', fontWeight: 'bold' }}>{currentIndex + 1} / {shuffledCards.length}</Typography>

            <Box component="button" onClick={handleNextCard} disabled={currentIndex === shuffledCards.length - 1} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              width: 48, height: 48, cursor: currentIndex === shuffledCards.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === shuffledCards.length - 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.blue.shadow,
              '&:hover': { transform: currentIndex === shuffledCards.length - 1 ? 'none' : 'translate(-2px,-2px)' }
            }}><ArrowForward /></Box>
          </Box>

          {/* Continue */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} disabled={!hasViewedAll} sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: hasViewedAll ? 'pointer' : 'not-allowed',
              color: P.green.shadow, opacity: hasViewedAll ? 1 : 0.5,
              display: 'inline-flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: hasViewedAll ? 'translate(-2px,-2px)' : 'none', boxShadow: hasViewedAll ? `5px 5px 0 ${P.green.shadow}` : `3px 3px 0 ${P.green.shadow}` }
            }}>
              {hasViewedAll ? <>Continue to Results <ArrowForward /></> : `View all ${shuffledCards.length} terms first`}
            </Box>
            {!hasViewedAll && (
              <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.6 }}>
                You need to view all flashcards to continue ({viewed.size}/{shuffledCards.length} viewed)
              </Typography>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
