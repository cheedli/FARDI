import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, IconButton } from '@mui/material'
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
  {
    id: 1,
    term: 'hashtag',
    definition: '# for search'
  },
  {
    id: 2,
    term: 'caption',
    definition: 'Text under photo'
  },
  {
    id: 3,
    term: 'emoji',
    definition: 'Picture feeling'
  },
  {
    id: 4,
    term: 'tag',
    definition: '@ mention'
  },
  {
    id: 5,
    term: 'call-to-action',
    definition: 'Tell to act'
  },
  {
    id: 6,
    term: 'post',
    definition: 'Photo + text'
  },
  {
    id: 7,
    term: 'story',
    definition: '24h content'
  },
  {
    id: 8,
    term: 'like',
    definition: 'Heart button'
  }
]

export default function Phase4_2Step3RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_b1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [viewed, setViewed] = useState(new Set())

  // Shuffle flashcards once at start
  const shuffledCards = useMemo(() => {
    return [...FLASHCARDS].sort(() => Math.random() - 0.5)
  }, [])

  const currentCard = shuffledCards[currentIndex]
  const hasViewedAll = viewed.size === shuffledCards.length

  const handleFlipCard = () => {
    if (!isFlipped) {
      // Mark as viewed when flipping to definition
      const newViewed = new Set(viewed)
      newViewed.add(currentCard.id)
      setViewed(newViewed)
    }
    setIsFlipped(!isFlipped)
  }

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleNextCard = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handleContinue = () => {
    // Store score - all 8 cards viewed = 8 points
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
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'B1',
          task: 'D',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task D: Flashcard Game 📚
        </Typography>
        <Typography variant="body1">
          Learn social media terms through flashcards. Browse all 8 terms to continue!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Time to test your memory! Browse through the flashcards to match terms with their definitions. Click on each flashcard to flip and reveal the definition. View all 8 terms to complete this task! 📚"
        />
      </Paper>

      {/* Progress Header */}
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
            Card {currentIndex + 1} / {shuffledCards.length}
          </Typography>

          <Box sx={{ width: { xs: '100%', md: '40%' } }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Progress: {viewed.size} / {shuffledCards.length} viewed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(viewed.size / shuffledCards.length) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50'
                }
              }}
            />
          </Box>

          <Typography variant="h6" fontWeight="bold">
            {hasViewedAll ? '✅ All Viewed!' : '📖 Keep Reading'}
          </Typography>
        </Stack>
      </Paper>

      {/* 3D Flashcard */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper
          elevation={8}
          onClick={handleFlipCard}
          sx={{
            width: 700,
            height: 450,
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
          {/* Front - TERM */}
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
            <Typography variant="overline" sx={{ mb: 2, opacity: 0.8, fontSize: '1rem' }}>
              TERM
            </Typography>
            <Typography variant="h2" fontWeight="bold" align="center">
              {currentCard.term}
            </Typography>
            <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 50, opacity: 0.6 }} />
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
              Click to flip and see definition
            </Typography>
          </Box>

          {/* Back - DEFINITION */}
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
              p: 5,
              color: 'white'
            }}
          >
            <Typography variant="overline" sx={{ mb: 2, opacity: 0.8, fontSize: '1rem' }}>
              DEFINITION
            </Typography>
            <Typography variant="h4" fontWeight="medium" align="center" sx={{ mb: 3 }}>
              {currentCard.definition}
            </Typography>

            <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, width: '80%' }}>
              <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                {currentCard.term}
              </Typography>
              <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
                = {currentCard.definition}
              </Typography>
            </Box>

            <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 40, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Click to flip back
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
        <IconButton
          onClick={handlePreviousCard}
          disabled={currentIndex === 0}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': { backgroundColor: 'primary.dark' },
            '&:disabled': { backgroundColor: 'grey.300' }
          }}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" sx={{ minWidth: 150, textAlign: 'center' }}>
          {currentIndex + 1} / {shuffledCards.length}
        </Typography>

        <IconButton
          onClick={handleNextCard}
          disabled={currentIndex === shuffledCards.length - 1}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': { backgroundColor: 'primary.dark' },
            '&:disabled': { backgroundColor: 'grey.300' }
          }}
        >
          <ArrowForward />
        </IconButton>
      </Stack>

      {/* Continue Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleContinue}
          disabled={!hasViewedAll}
          endIcon={<ArrowForward />}
          sx={{
            py: 2,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
        >
          {hasViewedAll ? 'Continue to Results →' : `View all ${shuffledCards.length} terms first`}
        </Button>

        {!hasViewedAll && (
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            You need to view all flashcards to continue ({viewed.size}/{shuffledCards.length} viewed)
          </Typography>
        )}
      </Box>
    </Box>
  )
}
