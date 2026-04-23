import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Alert,
  Card,
  CardContent,
  Container,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level A2 - Task A: Term Treasure Hunt
 * Match 8 social media terms to definitions (Drag and Drop Matching)
 * Click-to-match interface
 */

const TERM_PAIRS = [
  { id: 1, term: 'hashtag', definition: '#', description: 'Hash symbol used to categorize posts' },
  { id: 2, term: 'caption', definition: 'Words under photo', description: 'Text that appears below an image' },
  { id: 3, term: 'emoji', definition: 'Smile face', description: 'Expression icon like 😊' },
  { id: 4, term: 'tag', definition: '@name', description: 'At symbol to mention someone' },
  { id: 5, term: 'call-to-action', definition: 'Do this!', description: 'A command telling people what to do' },
  { id: 6, term: 'post', definition: 'Picture+text', description: 'Content shared on social media' },
  { id: 7, term: 'story', definition: '24-hour post', description: 'Temporary content that disappears' },
  { id: 8, term: 'like', definition: 'Heart', description: 'Heart button to show appreciation' },
]

export default function Phase4_2Step4RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 4, interaction: 1, context: 'remedial_a2' })
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

  const [matches, setMatches] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleTermClick = (pairId, term) => {
    if (showResults) return
    if (matches[pairId] === term) {
      const newMatches = { ...matches }
      delete newMatches[pairId]
      setMatches(newMatches)
    } else {
      const newMatches = { ...matches }
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === term) delete newMatches[key]
      })
      newMatches[pairId] = term
      setMatches(newMatches)
    }
  }

  const handleSubmit = () => {
    let correctCount = 0
    TERM_PAIRS.forEach(pair => {
      if (matches[pair.id] === pair.term) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase4_2_step4_a2_taskA', correctCount.toString())
    logTaskCompletion(correctCount, TERM_PAIRS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: '4_remedial', level: 'A2', task: 'A', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/a2/taskB')
  }

  const availableTerms = TERM_PAIRS.map(p => p.term).filter(term => !Object.values(matches).includes(term))
  const allMatched = Object.keys(matches).length === TERM_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>Level A2 - Task A: Term Treasure Hunt</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to the Term Treasure Hunt! Match each social media term to its picture or definition. Find all 8 treasures to unlock the gems!" />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              <strong>Instructions:</strong> Click a term from the treasure chest, then click the matching definition box. Match all 8 correctly!
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}>
              <strong>Scoring:</strong> 1 point per correct match (Pass: 6/8)
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Term Treasure Chest */}
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 2 }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, color: P.orange.shadow, fontWeight: 'bold' }}>
                  💎 Treasure Chest 💎
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {availableTerms.map(term => (
                    <Box
                      key={term}
                      component="button"
                      sx={{
                        bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                        py: 1.5, fontWeight: 700, fontSize: '1rem',
                        cursor: 'pointer', color: P.orange.shadow, width: '100%',
                        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                        '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                      }}
                    >
                      {term}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Definition Boxes */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, color: P.blue.shadow, fontWeight: 'bold' }}>
                📦 Match to Definitions:
              </Typography>
              <Grid container spacing={2}>
                {TERM_PAIRS.map(pair => {
                  const isMatched = !!matches[pair.id]
                  const isCorrect = matches[pair.id] === pair.term
                  let cardColor = P.teal.bg
                  let cardBorder = P.teal.border
                  let cardShadow = P.teal.shadow
                  if (showResults && isMatched) {
                    cardColor = isCorrect ? P.green.bg : P.red.bg
                    cardBorder = isCorrect ? P.green.border : P.red.border
                    cardShadow = isCorrect ? P.green.shadow : P.red.shadow
                  } else if (isMatched) {
                    cardColor = P.blue.bg
                    cardBorder = P.blue.border
                    cardShadow = P.blue.shadow
                  }

                  return (
                    <Grid item xs={12} sm={6} key={pair.id}>
                      <Box sx={{
                        bgcolor: cardColor, border: `2px solid ${cardBorder}`,
                        borderRadius: '16px', boxShadow: `3px 3px 0 ${cardShadow}`,
                        minHeight: 140, cursor: 'pointer', p: 2,
                        transition: 'all 0.3s',
                      }}>
                        <Box sx={{ textAlign: 'center', mb: 1 }}>
                          <Typography variant="h3" sx={{ fontSize: '2.5rem', mb: 1 }}>{pair.definition}</Typography>
                          <Typography variant="body2" color="text.secondary">{pair.description}</Typography>
                        </Box>

                        {isMatched && (
                          <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: '8px', textAlign: 'center', border: `2px solid ${cardBorder}` }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: cardShadow }}>{matches[pair.id]}</Typography>
                            {showResults && isCorrect && <CheckCircleIcon sx={{ color: P.green.shadow, mt: 0.5 }} />}
                          </Box>
                        )}

                        {!isMatched && !showResults && availableTerms.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                            {availableTerms.slice(0, 3).map(term => (
                              <Box
                                key={term}
                                component="button"
                                onClick={(e) => { e.stopPropagation(); handleTermClick(pair.id, term) }}
                                sx={{
                                  bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`,
                                  borderRadius: '8px', px: 1, py: 0.5, fontSize: '0.7rem',
                                  fontWeight: 700, cursor: 'pointer', color: P.purple.shadow,
                                  '&:hover': { bgcolor: P.purple.border, color: 'white' },
                                }}
                              >
                                {term}
                              </Box>
                            ))}
                          </Box>
                        )}

                        {showResults && !isCorrect && (
                          <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                            <Typography variant="caption">Correct: <strong>{pair.term}</strong></Typography>
                          </Alert>
                        )}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>

          {/* Results */}
          {showResults && (
            <Box sx={{
              bgcolor: score >= 6 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 6 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mt: 3,
            }}>
              <Typography variant="h6" sx={{ color: score >= 6 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {score >= 6 ? '🎉 Treasures Found!' : 'Keep Hunting!'}
              </Typography>
              <Typography sx={{ color: score >= 6 ? P.green.shadow : P.yellow.shadow }}>
                Correct Matches: <strong>{score}/{TERM_PAIRS.length}</strong>
              </Typography>
              <Typography sx={{ color: score >= 6 ? P.green.shadow : P.yellow.shadow }}>
                {score >= 6 ? 'You unlocked the gems! Ready for the next quest!' : 'You need at least 6/8 correct. Review and try again!'}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allMatched}
                sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !allMatched ? 'not-allowed' : 'pointer', color: P.blue.shadow, opacity: !allMatched ? 0.5 : 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                }}
              >
                Submit Matches
              </Box>
            )}
            {showResults && (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}
              >
                Continue to Task B <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
