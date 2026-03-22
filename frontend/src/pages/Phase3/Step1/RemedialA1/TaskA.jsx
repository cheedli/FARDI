import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

const WORD_IMAGE_PAIRS = [
  { word: 'sponsor', image: '💼', description: 'A company or person who gives money' },
  { word: 'money',   image: '💵', description: 'Cash or currency' },
  { word: 'ticket',  image: '🎫', description: 'Entry pass to an event' },
  { word: 'food',    image: '🍽️', description: 'Meals and snacks' },
]

export default function Phase3RemedialA1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_a1' })
  const [matches, setMatches] = useState({})
  const [selectedWord, setSelectedWord] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [correctMatches, setCorrectMatches] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [shuffledImages, setShuffledImages] = useState([])

  useEffect(() => {
    const shuffled = [...WORD_IMAGE_PAIRS].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)
  }, [])

  const handleWordClick = (word) => {
    if (correctMatches.includes(word)) return
    setSelectedWord(word)
    if (selectedImage !== null) checkMatch(word, selectedImage)
  }

  const handleImageClick = (image) => {
    if (Object.values(matches).includes(image)) return
    setSelectedImage(image)
    if (selectedWord !== null) checkMatch(selectedWord, image)
  }

  const checkMatch = (word, image) => {
    const correctPair = WORD_IMAGE_PAIRS.find(pair => pair.word === word)
    setMatches(prev => ({ ...prev, [word]: image }))
    if (correctPair && correctPair.image === image) {
      setCorrectMatches(prev => [...prev, word])
    }
    setSelectedWord(null)
    setSelectedImage(null)
  }

  const handleSubmit = () => {
    setShowResults(true)
    const scoreOutOf10 = (correctMatches.length / WORD_IMAGE_PAIRS.length) * 10
    sessionStorage.setItem('phase3_remedial_a1_taskA_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase3_remedial_a1_taskA_max', '10')
    logTaskCompletion(correctMatches.length, WORD_IMAGE_PAIRS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'A', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/app/phase3/step/1/remedial/a1/taskB') }

  const isComplete = correctMatches.length === WORD_IMAGE_PAIRS.length
  const allPairsMatched = Object.keys(matches).length === WORD_IMAGE_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level A1 — Task A: Picture Matching
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="MS_MABROUKI" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Ms. Mabrouki
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Let's practice some basic financial vocabulary! Match each word to its picture.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.teal.border, mb: 0.5 }}>
              Instructions
            </Typography>
            <Typography variant="body2" sx={{ color: D.body }}>
              Click on a word, then click on its matching picture.
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted, mt: 0.5 }}>
              Evaluation: All pairs must be correct to proceed.
            </Typography>
          </Box>
        </motion.div>

        {/* Score */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{
              display: 'inline-block',
              px: 1.75, py: 0.4, borderRadius: '50px',
              bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
              fontSize: '0.8rem', fontWeight: 800, color: D.green.border,
            }}>
              Matched: {correctMatches.length}/{WORD_IMAGE_PAIRS.length}
            </Box>
          </Box>
        </motion.div>

        {/* Matching Grid */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Words Column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, textAlign: 'center', mb: 2 }}>
                Words
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {WORD_IMAGE_PAIRS.map(pair => {
                  const isCorrect = correctMatches.includes(pair.word)
                  const isSelected = selectedWord === pair.word
                  const c = isCorrect ? D.green : isSelected ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }
                  return (
                    <Box
                      key={pair.word}
                      component="button"
                      onClick={() => handleWordClick(pair.word)}
                      disabled={isCorrect}
                      sx={{
                        ...clay(c),
                        p: 2, cursor: isCorrect ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: isCorrect ? 'none' : 'translate(-1px,-1px)' },
                      }}
                    >
                      <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>{pair.word}</Typography>
                      {isCorrect && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {/* Images Column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, textAlign: 'center', mb: 2 }}>
                Pictures
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {shuffledImages.map(pair => {
                  const isMatched = Object.values(matches).includes(pair.image)
                  const matchedWord = Object.keys(matches).find(word => matches[word] === pair.image)
                  const isCorrectMatch = matchedWord && correctMatches.includes(matchedWord)
                  const isSelected = selectedImage === pair.image
                  const c = isMatched
                    ? (isCorrectMatch ? D.green : D.red)
                    : isSelected ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }
                  return (
                    <Box
                      key={pair.image}
                      component="button"
                      onClick={() => handleImageClick(pair.image)}
                      disabled={isMatched}
                      sx={{
                        ...clay(c),
                        p: 2, cursor: isMatched ? 'default' : 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: isMatched ? 'none' : 'translate(-1px,-1px)' },
                      }}
                    >
                      <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>{pair.image}</Typography>
                      {isMatched && matchedWord && (
                        <>
                          <Typography variant="body2" fontWeight={800} sx={{ color: isCorrectMatch ? D.green.border : D.red.border }}>
                            {matchedWord}
                          </Typography>
                          {!isCorrectMatch && (
                            <Typography variant="caption" sx={{ color: D.red.border }}>Incorrect</Typography>
                          )}
                        </>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <Box sx={{ ...clay(isComplete ? D.green : D.orange), p: 2, mb: 3 }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: isComplete ? D.green.border : D.orange.border }}>
                {isComplete
                  ? `Perfect! You matched all ${WORD_IMAGE_PAIRS.length} pairs correctly!`
                  : `You matched ${correctMatches.length}/${WORD_IMAGE_PAIRS.length}. Try to match all pairs!`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!showResults && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allPairsMatched}
                sx={{
                  px: 3, py: 1.25,
                  bgcolor: D.blue.bg, color: D.blue.border,
                  border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  opacity: !allPairsMatched ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: !allPairsMatched ? 'none' : 'translate(-2px,-2px)', boxShadow: !allPairsMatched ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit
              </Box>
            </motion.div>
          )}
          {showResults && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 3, py: 1.25,
                  bgcolor: D.green.bg, color: D.green.border,
                  border: `2px solid ${D.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Continue to Task B
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
