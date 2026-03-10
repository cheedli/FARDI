import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, IconButton } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { ArrowForward, ArrowBack, Lightbulb } from '@mui/icons-material'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'

/**
 * Phase 4 Step 2 - Vocabulary Warm-up
 * Browse through 20 marketing and video terms with definitions and examples
 * Quizlet-style 3D flip cards
 */

const VOCABULARY = [
  {
    id: 1,
    term: 'Promotional',
    definition: 'Designed to promote or sell a product, service, or event.',
    example: 'A promotional poster advertises the festival to attract visitors.'
  },
  {
    id: 2,
    term: 'Persuasive',
    definition: 'Intended to convince or influence people to take action (e.g., buy or attend).',
    example: 'A persuasive slogan like "Join the Celebration!" encourages attendance.'
  },
  {
    id: 3,
    term: 'Targeted',
    definition: 'Directed at a specific group of people (audience).',
    example: 'Targeted videos shown to university students on social media.'
  },
  {
    id: 4,
    term: 'Original',
    definition: 'New, fresh, or unique; not copied.',
    example: 'An original festival poster design that stands out.'
  },
  {
    id: 5,
    term: 'Creative',
    definition: 'Using imagination to make something new and appealing.',
    example: 'Creative animation in a video teaser to show cultures vividly.'
  },
  {
    id: 6,
    term: 'Consistent',
    definition: 'The same style or message across all ads.',
    example: 'Consistent colors and slogan on posters and videos.'
  },
  {
    id: 7,
    term: 'Personalized',
    definition: 'Customized for individual people or groups.',
    example: 'Personalized video messages inviting specific students.'
  },
  {
    id: 8,
    term: 'Ethical',
    definition: 'Honest, fair, and respectful (no lies or harm).',
    example: 'Ethical promotion that truthfully shows festival activities.'
  },
  {
    id: 9,
    term: 'Dramatisation',
    definition: 'Acting out a story or scene to make it engaging.',
    example: 'Dramatisation in a video showing people enjoying cultures.'
  },
  {
    id: 10,
    term: 'Sketch',
    definition: 'A simple plan or rough drawing for an ad (storyboard).',
    example: 'A sketch planning video scenes before filming.'
  },
  {
    id: 11,
    term: 'Storytelling',
    definition: 'Using a narrative to connect emotionally.',
    example: 'Storytelling in a video about cultural journeys.'
  },
  {
    id: 12,
    term: 'Jingle',
    definition: 'A short, catchy song or tune for the brand.',
    example: 'A jingle in the video: "Come to Global Cultures!"'
  },
  {
    id: 13,
    term: 'Animation',
    definition: 'Moving images created digitally or by drawing.',
    example: 'Animation of dancing figures in the teaser video.'
  },
  {
    id: 14,
    term: 'Clip',
    definition: 'A short segment of video.',
    example: 'Quick clips of food and music in the promo video.'
  },
  {
    id: 15,
    term: 'Commercial',
    definition: 'A short advertisement on TV, online, or radio.',
    example: 'A 30-second commercial teaser for the festival.'
  },
  {
    id: 16,
    term: 'Eye-catcher',
    definition: 'Something bright or striking that grabs attention.',
    example: 'Bold colors as eye-catchers on the poster.'
  },
  {
    id: 17,
    term: 'Feature',
    definition: 'A highlighted main part or benefit.',
    example: 'Featuring diverse traditions in the video.'
  },
  {
    id: 18,
    term: 'Billboard',
    definition: 'A large outdoor advertising sign.',
    example: 'A festival billboard on campus roads.'
  },
  {
    id: 19,
    term: 'Slogan',
    definition: 'A short, memorable phrase for the brand/event.',
    example: '"Discover the World Together" as the festival slogan.'
  },
  {
    id: 20,
    term: 'Layout',
    definition: 'The arrangement of text and images on a poster/ad.',
    example: 'A balanced layout with title at top and images below.'
  }
]

export default function VocabularyWarmup() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [viewed, setViewed] = useState(new Set())

  // Shuffle vocabulary once at start
  const shuffledVocab = useMemo(() => {
    return [...VOCABULARY].sort(() => Math.random() - 0.5)
  }, [])

  const currentCard = shuffledVocab[currentIndex]
  const progress = ((currentIndex + 1) / shuffledVocab.length) * 100
  const hasViewedAll = viewed.size === shuffledVocab.length

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
      setShowExample(false)
    }
  }

  const handleNextCard = () => {
    if (currentIndex < shuffledVocab.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setShowExample(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/3/interaction/1')
  }

  const handleShowExample = (e) => {
    e.stopPropagation()
    setShowExample(!showExample)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 2: Explain - Vocabulary Warm-up 📚
        </Typography>
        <Typography variant="body1">
          Learn marketing and video terminology through flashcards. Browse all 20 terms to continue!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the vocabulary warm-up! Before we start creating promotional materials, let's review key marketing terms. Click on each flashcard to flip and reveal the definition. Browse through all 20 terms to unlock the next activity! 📚"
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
            Card {currentIndex + 1} / {shuffledVocab.length}
          </Typography>

          <Box sx={{ width: { xs: '100%', md: '40%' } }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Progress: {viewed.size} / {shuffledVocab.length} viewed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(viewed.size / shuffledVocab.length) * 100}
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, perspective: '1200px' }}>
        <Paper
          elevation={8}
          onClick={handleFlipCard}
          sx={{
            width: { xs: '100%', sm: 700 },
            maxWidth: 700,
            height: 450,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            '&:hover': {
              filter: 'brightness(1.05)'
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
              WebkitBackfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              color: 'white',
              backgroundColor: '#46178f',
              borderRadius: 2,
              boxShadow: 8
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
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 5,
              color: 'white',
              backgroundColor: '#1976d2',
              borderRadius: 2,
              boxShadow: 8
            }}
          >
            <Typography variant="overline" sx={{ mb: 2, opacity: 0.8, fontSize: '1rem' }}>
              DEFINITION
            </Typography>
            <Typography variant="h4" fontWeight="medium" align="center" sx={{ mb: 3 }}>
              {currentCard.definition}
            </Typography>

            {showExample && (
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  mt: 2,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderLeft: '4px solid #4caf50'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Lightbulb sx={{ color: '#4caf50', mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#4caf50' }}>
                      EXAMPLE
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                      {currentCard.example}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={handleShowExample}
              sx={{
                mt: 2,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white'
                }
              }}
            >
              {showExample ? 'Hide Example' : 'Show Example'}
            </Button>

            <FlipCameraAndroidIcon sx={{ mt: 3, fontSize: 40, opacity: 0.6 }} />
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
          {currentIndex + 1} / {shuffledVocab.length}
        </Typography>

        <IconButton
          onClick={handleNextCard}
          disabled={currentIndex === shuffledVocab.length - 1}
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
          {hasViewedAll ? 'Continue to Interactions →' : `View all ${shuffledVocab.length} terms first`}
        </Button>

        {!hasViewedAll && (
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            You need to view all flashcards to continue ({viewed.size}/{shuffledVocab.length} viewed)
          </Typography>
        )}
      </Box>
    </Box>
  )
}
