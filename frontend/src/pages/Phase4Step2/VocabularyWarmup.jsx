import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, IconButton, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { ArrowForward, ArrowBack, Lightbulb } from '@mui/icons-material'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'

/**
 * Phase 4 Step 2 - Vocabulary Warm-up
 */

const VOCABULARY = [
  { id: 1, term: 'Promotional', definition: 'Designed to promote or sell a product, service, or event.', example: 'A promotional poster advertises the festival to attract visitors.' },
  { id: 2, term: 'Persuasive', definition: 'Intended to convince or influence people to take action (e.g., buy or attend).', example: 'A persuasive slogan like "Join the Celebration!" encourages attendance.' },
  { id: 3, term: 'Targeted', definition: 'Directed at a specific group of people (audience).', example: 'Targeted videos shown to university students on social media.' },
  { id: 4, term: 'Original', definition: 'New, fresh, or unique; not copied.', example: 'An original festival poster design that stands out.' },
  { id: 5, term: 'Creative', definition: 'Using imagination to make something new and appealing.', example: 'Creative animation in a video teaser to show cultures vividly.' },
  { id: 6, term: 'Consistent', definition: 'The same style or message across all ads.', example: 'Consistent colors and slogan on posters and videos.' },
  { id: 7, term: 'Personalized', definition: 'Customized for individual people or groups.', example: 'Personalized video messages inviting specific students.' },
  { id: 8, term: 'Ethical', definition: 'Honest, fair, and respectful (no lies or harm).', example: 'Ethical promotion that truthfully shows festival activities.' },
  { id: 9, term: 'Dramatisation', definition: 'Acting out a story or scene to make it engaging.', example: 'Dramatisation in a video showing people enjoying cultures.' },
  { id: 10, term: 'Sketch', definition: 'A simple plan or rough drawing for an ad (storyboard).', example: 'A sketch planning video scenes before filming.' },
  { id: 11, term: 'Storytelling', definition: 'Using a narrative to connect emotionally.', example: 'Storytelling in a video about cultural journeys.' },
  { id: 12, term: 'Jingle', definition: 'A short, catchy song or tune for the brand.', example: 'A jingle in the video: "Come to Global Cultures!"' },
  { id: 13, term: 'Animation', definition: 'Moving images created digitally or by drawing.', example: 'Animation of dancing figures in the teaser video.' },
  { id: 14, term: 'Clip', definition: 'A short segment of video.', example: 'Quick clips of food and music in the promo video.' },
  { id: 15, term: 'Commercial', definition: 'A short advertisement on TV, online, or radio.', example: 'A 30-second commercial teaser for the festival.' },
  { id: 16, term: 'Eye-catcher', definition: 'Something bright or striking that grabs attention.', example: 'Bold colors as eye-catchers on the poster.' },
  { id: 17, term: 'Feature', definition: 'A highlighted main part or benefit.', example: 'Featuring diverse traditions in the video.' },
  { id: 18, term: 'Billboard', definition: 'A large outdoor advertising sign.', example: 'A festival billboard on campus roads.' },
  { id: 19, term: 'Slogan', definition: 'A short, memorable phrase for the brand/event.', example: '"Discover the World Together" as the festival slogan.' },
  { id: 20, term: 'Layout', definition: 'The arrangement of text and images on a poster/ad.', example: 'A balanced layout with title at top and images below.' },
]

export default function VocabularyWarmup() {
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

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [viewed, setViewed] = useState(new Set())

  const shuffledVocab = useMemo(() => {
    return [...VOCABULARY].sort(() => Math.random() - 0.5)
  }, [])

  const currentCard = shuffledVocab[currentIndex]
  const hasViewedAll = viewed.size === shuffledVocab.length

  const handleFlipCard = () => {
    if (!isFlipped) {
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

  useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/2/interaction/1') }, [])

  const handleContinue = () => {
    navigate('/phase4/step/2/interaction/1')
  }

  const handleShowExample = (e) => {
    e.stopPropagation()
    setShowExample(!showExample)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 - Step 2: Explain - Vocabulary Warm-up
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Learn marketing and video terminology through flashcards. Browse all 20 terms to continue!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Welcome to the vocabulary warm-up! Before we start creating promotional materials, let's review key marketing terms. Click on each flashcard to flip and reveal the definition. Browse through all 20 terms to unlock the next activity!"
            />
          </Box>

          {/* Progress Header */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                Card {currentIndex + 1} / {shuffledVocab.length}
              </Typography>
              <Box sx={{ width: { xs: '100%', md: '40%' } }}>
                <Typography variant="body2" sx={{ mb: 1, color: P.yellow.shadow }}>
                  Progress: {viewed.size} / {shuffledVocab.length} viewed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(viewed.size / shuffledVocab.length) * 100}
                  sx={{
                    height: 8, borderRadius: 1,
                    backgroundColor: `${P.yellow.border}44`,
                    '& .MuiLinearProgress-bar': { backgroundColor: P.yellow.shadow }
                  }}
                />
              </Box>
              <Box component="span" sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '999px', px: 2, py: 0.5,
                fontSize: '0.85rem', fontWeight: 700, color: P.yellow.shadow,
                display: 'inline-block'
              }}>
                {hasViewedAll ? 'All Viewed!' : 'Keep Reading'}
              </Box>
            </Stack>
          </Box>

          {/* 3D Flashcard */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, perspective: '1200px' }}>
            <Box
              onClick={handleFlipCard}
              sx={{
                width: { xs: '100%', sm: 700 }, maxWidth: 700, height: 450,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front - TERM */}
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                p: 4,
                bgcolor: P.purple.bg, borderRadius: '20px',
                border: `2px solid ${P.purple.border}`,
                boxShadow: `6px 6px 0 ${P.purple.shadow}`,
              }}>
                <Typography variant="overline" sx={{ mb: 2, fontSize: '0.85rem', fontWeight: 800, color: P.purple.border, letterSpacing: 2 }}>TERM</Typography>
                <Typography variant="h2" fontWeight={800} align="center" sx={{ color: P.purple.shadow }}>{currentCard.term}</Typography>
                <FlipCameraAndroidIcon sx={{ mt: 4, fontSize: 40, color: P.purple.border, opacity: 0.7 }} />
                <Typography variant="body2" fontWeight={600} sx={{ mt: 1.5, color: P.purple.border }}>Click to flip and see definition</Typography>
              </Box>

              {/* Back - DEFINITION */}
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                p: 4,
                bgcolor: P.blue.bg, borderRadius: '20px',
                border: `2px solid ${P.blue.border}`,
                boxShadow: `6px 6px 0 ${P.blue.shadow}`,
              }}>
                <Typography variant="overline" sx={{ mb: 2, fontSize: '0.85rem', fontWeight: 800, color: P.blue.border, letterSpacing: 2 }}>DEFINITION</Typography>
                <Typography variant="h5" fontWeight={700} align="center" sx={{ mb: 2, color: P.blue.shadow }}>
                  {currentCard.definition}
                </Typography>

                {showExample && (
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      p: 2, mt: 1, width: '100%',
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '14px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Lightbulb sx={{ color: P.green.shadow, mt: 0.25, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="caption" fontWeight={800} sx={{ color: P.green.shadow }}>EXAMPLE</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ color: P.green.shadow }}>{currentCard.example}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}

                <Box component="button" onClick={handleShowExample} sx={{
                  mt: 2,
                  bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`,
                  px: 3, py: 0.75, fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', color: P.teal.shadow,
                  transition: 'all 0.12s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.teal.shadow}` }
                }}>
                  {showExample ? 'Hide Example' : 'Show Example'}
                </Box>

                <FlipCameraAndroidIcon sx={{ mt: 2, fontSize: 32, color: P.blue.border, opacity: 0.7 }} />
                <Typography variant="body2" fontWeight={600} sx={{ mt: 1, color: P.blue.border }}>Click to flip back</Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <Box component="button" onClick={handlePreviousCard} disabled={currentIndex === 0} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${currentIndex === 0 ? '#ccc' : P.blue.border}`,
              borderRadius: '14px', boxShadow: currentIndex === 0 ? 'none' : `4px 4px 0 ${P.blue.shadow}`,
              width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.4 : 1,
              color: P.blue.shadow, transition: 'all 0.12s',
              '&:hover': currentIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
            }}>
              <ArrowBack />
            </Box>

            <Typography variant="h6" sx={{ minWidth: 150, textAlign: 'center', color: P.blue.shadow, fontWeight: 800 }}>
              {currentIndex + 1} / {shuffledVocab.length}
            </Typography>

            <Box component="button" onClick={handleNextCard} disabled={currentIndex === shuffledVocab.length - 1} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${currentIndex === shuffledVocab.length - 1 ? '#ccc' : P.blue.border}`,
              borderRadius: '14px', boxShadow: currentIndex === shuffledVocab.length - 1 ? 'none' : `4px 4px 0 ${P.blue.shadow}`,
              width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: currentIndex === shuffledVocab.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === shuffledVocab.length - 1 ? 0.4 : 1,
              color: P.blue.shadow, transition: 'all 0.12s',
              '&:hover': currentIndex === shuffledVocab.length - 1 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
            }}>
              <ArrowForward />
            </Box>
          </Stack>

          {/* Continue Button */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} disabled={!hasViewedAll} sx={{
              bgcolor: hasViewedAll ? P.green.bg : 'grey.200',
              border: `2px solid ${hasViewedAll ? P.green.border : '#ccc'}`,
              borderRadius: '12px', boxShadow: hasViewedAll ? `3px 3px 0 ${P.green.shadow}` : 'none',
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem',
              cursor: hasViewedAll ? 'pointer' : 'not-allowed',
              color: hasViewedAll ? P.green.shadow : '#999',
              display: 'inline-flex', alignItems: 'center', gap: 1,
              '&:hover': hasViewedAll ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
              '&:active': hasViewedAll ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` } : {},
            }}>
              {hasViewedAll ? 'Continue to Interactions' : `View all ${shuffledVocab.length} terms first`}
              <ArrowForward fontSize="small" />
            </Box>

            {!hasViewedAll && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: P.yellow.shadow }}>
                You need to view all flashcards to continue ({viewed.size}/{shuffledVocab.length} viewed)
              </Typography>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
