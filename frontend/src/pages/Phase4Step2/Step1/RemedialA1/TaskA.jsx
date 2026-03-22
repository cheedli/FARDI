import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A1 - Task A: Match Race
 */

const WORD_IMAGE_PAIRS = [
  { word: 'hashtag', image: '#️⃣', description: '# symbol picture' },
  { word: 'caption', image: '📝', description: 'Text under photo' },
  { word: 'emoji',   image: '😊', description: 'Smiley face' },
  { word: 'tag',     image: '🏷️', description: '@name' },
  { word: 'like',    image: '❤️', description: 'Heart button' },
  { word: 'share',   image: '↗️', description: 'Arrow button' },
  { word: 'post',    image: '🖼️', description: 'Square picture' },
  { word: 'story',   image: '⭕', description: 'Circle icon' }
]

export default function Phase4_2RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_a1' })
  const [matches, setMatches] = useState({})
  const [selectedWord, setSelectedWord] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [correctMatches, setCorrectMatches] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [shuffledImages, setShuffledImages] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [timerActive, setTimerActive] = useState(true)
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

  useEffect(() => {
    const shuffled = [...WORD_IMAGE_PAIRS].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)
  }, [])

  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit()
    }
  }, [timeLeft, timerActive, showResults])

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
    setMatches({ ...matches, [word]: image })
    if (correctPair && correctPair.image === image) {
      setCorrectMatches([...correctMatches, word])
    }
    setSelectedWord(null)
    setSelectedImage(null)
  }

  const handleSubmit = () => {
    setTimerActive(false)
    setShowResults(true)
    const baseScore = correctMatches.length
    const timeBonus = timeLeft > 30 ? 2 : timeLeft > 10 ? 1 : 0
    const finalScore = Math.min(baseScore + timeBonus, 10)
    sessionStorage.setItem('phase4_2_remedial_a1_taskA_score', finalScore.toString())
    sessionStorage.setItem('phase4_2_remedial_a1_taskA_max', '10')
    logTaskCompletion(correctMatches.length, WORD_IMAGE_PAIRS.length, 60 - timeLeft)
  }

  const logTaskCompletion = async (score, maxScore, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'A1', task: 'A', score, max_score: maxScore, time_taken: timeTaken })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/1/remedial/a1/taskB') }

  const isComplete = correctMatches.length === WORD_IMAGE_PAIRS.length
  const allPairsMatched = Object.keys(matches).length === WORD_IMAGE_PAIRS.length
  const timerProgress = (timeLeft / 60) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level A1 - Task A: Match Race</Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Race against the timer to match social media words to their pictures! Match correctly before time runs out for bonus points!" />
          </Box>

          {/* Timer */}
          {!showResults && (
            <Box sx={{ bgcolor: timeLeft < 10 ? P.red.bg : P.yellow.bg, border: `2px solid ${timeLeft < 10 ? P.red.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${timeLeft < 10 ? P.red.shadow : P.yellow.shadow}`, p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TimerIcon sx={{ color: timeLeft < 10 ? P.red.shadow : P.yellow.shadow }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: timeLeft < 10 ? P.red.shadow : P.yellow.shadow }}>{timeLeft}s</Typography>
                <Typography variant="body2" sx={{ color: timeLeft < 10 ? P.red.shadow : P.yellow.shadow }}>remaining</Typography>
              </Box>
              <LinearProgress variant="determinate" value={timerProgress} color={timeLeft < 10 ? 'error' : 'warning'} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Click on a word, then click on its matching picture/definition. Race against the timer!</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Evaluation:</strong> All pairs must match exactly. Finish faster for bonus points!</Typography>
          </Box>

          {/* Score */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Box component="span" sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '999px', px: 3, py: 1, fontSize: '1rem', fontWeight: 700, color: P.green.shadow, display: 'inline-block' }}>
              Matched: {correctMatches.length}/{WORD_IMAGE_PAIRS.length}
            </Box>
          </Box>

          {/* Matching Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Words Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 2, color: P.blue.shadow }}>Social Media Words</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {WORD_IMAGE_PAIRS.map(pair => (
                  <Box key={pair.word} onClick={() => handleWordClick(pair.word)} sx={{
                    bgcolor: correctMatches.includes(pair.word) ? P.green.bg : selectedWord === pair.word ? P.blue.bg : isDark ? '#1a1a2e' : 'white',
                    border: `2px solid ${correctMatches.includes(pair.word) ? P.green.border : selectedWord === pair.word ? P.blue.border : '#ccc'}`,
                    borderRadius: '12px',
                    boxShadow: selectedWord === pair.word ? `3px 3px 0 ${P.blue.shadow}` : '2px 2px 0 #ccc',
                    p: 2, cursor: correctMatches.includes(pair.word) ? 'default' : 'pointer',
                    textAlign: 'center', transition: 'all 0.15s',
                    '&:hover': correctMatches.includes(pair.word) ? {} : { transform: 'translate(-2px,-2px)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: correctMatches.includes(pair.word) ? P.green.shadow : selectedWord === pair.word ? P.blue.shadow : 'text.primary' }}>
                        {pair.word}
                      </Typography>
                      {correctMatches.includes(pair.word) && <CheckCircleIcon sx={{ color: P.green.shadow }} />}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Images Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 2, color: P.blue.shadow }}>Pictures/Definitions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {shuffledImages.map(pair => {
                  const isMatched = Object.values(matches).includes(pair.image)
                  const matchedWord = Object.keys(matches).find(word => matches[word] === pair.image)
                  const isCorrectMatch = matchedWord && correctMatches.includes(matchedWord)
                  return (
                    <Box key={pair.image} onClick={() => handleImageClick(pair.image)} sx={{
                      bgcolor: isMatched ? (isCorrectMatch ? P.green.bg : P.red.bg) : selectedImage === pair.image ? P.blue.bg : isDark ? '#1a1a2e' : 'white',
                      border: `2px solid ${isMatched ? (isCorrectMatch ? P.green.border : P.red.border) : selectedImage === pair.image ? P.blue.border : '#ccc'}`,
                      borderRadius: '12px', p: 2, cursor: isMatched ? 'default' : 'pointer',
                      textAlign: 'center', transition: 'all 0.15s',
                      '&:hover': isMatched ? {} : { transform: 'translate(-2px,-2px)' }
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h1" sx={{ fontSize: '3rem' }}>{pair.image}</Typography>
                        <Typography variant="body2" color="text.secondary">{pair.description}</Typography>
                        {isMatched && matchedWord && (
                          <>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: isCorrectMatch ? P.green.shadow : P.red.shadow }}>{matchedWord}</Typography>
                            {isCorrectMatch ? <CheckCircleIcon sx={{ color: P.green.shadow }} /> : <Typography variant="caption" sx={{ color: P.red.shadow }}>✗ Incorrect</Typography>}
                          </>
                        )}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Grid>
          </Grid>

          {/* Results */}
          {showResults && (
            <Box sx={{ bgcolor: isComplete ? P.green.bg : P.yellow.bg, border: `2px solid ${isComplete ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${isComplete ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography sx={{ color: isComplete ? P.green.shadow : P.yellow.shadow, fontWeight: 700 }}>
                {isComplete ? `Perfect! You matched all ${WORD_IMAGE_PAIRS.length} pairs correctly! ${timeLeft > 30 ? '⚡ Time bonus awarded!' : ''}` : `You matched ${correctMatches.length}/${WORD_IMAGE_PAIRS.length} correctly. Keep practicing!`}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allPairsMatched} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allPairsMatched ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allPairsMatched ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Matches</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task B</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
