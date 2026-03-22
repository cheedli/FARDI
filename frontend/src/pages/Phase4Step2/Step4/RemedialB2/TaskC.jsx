import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, Stack } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

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

const TERMS = [
  { id: 1, term: 'hashtag', definition: 'Discoverability' },
  { id: 2, term: 'caption', definition: 'Engagement text' },
  { id: 3, term: 'emoji', definition: 'Visual emotion' },
  { id: 4, term: 'tag', definition: 'Mention reach' },
  { id: 5, term: 'call-to-action', definition: 'Prompt action' },
  { id: 6, term: 'story', definition: 'Temporary content' },
  { id: 7, term: 'engagement', definition: 'Likes/comments' },
  { id: 8, term: 'viral', definition: 'Fast spread' }
]

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [matches, setMatches] = useState({})
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledDefinitions, setShuffledDefinitions] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [lineRenderKey, setLineRenderKey] = useState(0)

  useEffect(() => {
    if (gameStarted && shuffledTerms.length === 0) {
      setShuffledTerms([...TERMS].sort(() => Math.random() - 0.5))
      setShuffledDefinitions([...TERMS].sort(() => Math.random() - 0.5))
    }
  }, [gameStarted])

  const handleTermClick = (termId) => {
    if (submitted) return
    if (matches[termId]) {
      const { [termId]: _, ...rest } = matches
      setMatches(rest)
      return
    }
    setSelectedTerm(termId)
    if (selectedDefinition) {
      setMatches({ ...matches, [termId]: selectedDefinition })
      setSelectedTerm(null)
      setSelectedDefinition(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleDefinitionClick = (definitionId) => {
    if (submitted) return
    const matchedTermId = Object.keys(matches).find(key => matches[key] === definitionId)
    if (matchedTermId) {
      const { [matchedTermId]: _, ...rest } = matches
      setMatches(rest)
      return
    }
    setSelectedDefinition(definitionId)
    if (selectedTerm) {
      setMatches({ ...matches, [selectedTerm]: definitionId })
      setSelectedTerm(null)
      setSelectedDefinition(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleSubmit = () => {
    let correctMatches = 0
    Object.keys(matches).forEach(termId => {
      if (matches[termId] === parseInt(termId)) correctMatches++
    })
    setScore(correctMatches)
    setSubmitted(true)
    setGameFinished(true)
    sessionStorage.setItem('phase4_2_step4_b2_taskC', correctMatches)
    logTaskCompletion(correctMatches)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'C', step: 4, score: finalScore, max_score: 8, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const getTermById = (id) => TERMS.find(t => t.id === id)
  const allMatched = Object.keys(matches).length === 8

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 - Step 4: Remedial Activities</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task C: Matching Game</Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to the Matching Game! Match 8 social media terms to their correct definitions. Click a term, then click its matching definition. All correct matches earn you 8 points! Ready? Let's start!" />
            </Box>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, textAlign: 'center' }}>
              <SwapHorizIcon sx={{ fontSize: 80, color: P.orange.shadow, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.orange.shadow, mb: 1 }}>Matching Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.orange.border, mb: 4 }}>8 Terms • 8 Definitions • Match Them All!</Typography>
              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>START MATCHING!</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const passed = score >= 6
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 - Step 4: Remedial Activities</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task C: Matching Game - Results</Typography>
            </Box>

            <Box sx={{
              bgcolor: passed ? P.green.bg : P.red.bg,
              border: `2px solid ${passed ? P.green.border : P.red.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.red.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: passed ? P.green.shadow : P.red.shadow, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.red.shadow, mb: 1 }}>
                {passed ? 'Great Match!' : 'Game Complete!'}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.red.shadow }}>{score} / 8</Typography>
              <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.red.shadow }}>Points Earned</Typography>
            </Box>

            {/* Match Review */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Match Review:</Typography>
            <Stack spacing={2} sx={{ mb: 4 }}>
              {TERMS.map((term) => {
                const userMatchId = matches[term.id]
                const userMatch = getTermById(userMatchId)
                const isCorrect = userMatchId === term.id
                return (
                  <Box key={term.id} sx={{
                    bgcolor: isCorrect ? P.green.bg : P.red.bg,
                    border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                    borderRadius: '16px', boxShadow: `3px 3px 0 ${isCorrect ? P.green.shadow : P.red.shadow}`,
                    p: 3,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: isCorrect ? P.green.shadow : P.red.shadow }}>{term.term}</Typography>
                        <Typography variant="body1" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                          Correct: <strong>{term.definition}</strong>
                        </Typography>
                        {!isCorrect && userMatch && (
                          <Typography variant="body1" sx={{ color: P.red.shadow }}>Your match: {userMatch.definition}</Typography>
                        )}
                      </Box>
                      {isCorrect
                        ? <CheckCircleIcon sx={{ color: P.green.shadow, fontSize: 32 }} />
                        : <CancelIcon sx={{ color: P.red.shadow, fontSize: 32 }} />
                      }
                    </Box>
                  </Box>
                )
              })}
            </Stack>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step4/remedial/b2/taskD')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task D: Spelling & Explain</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Matching Game</Typography>
            <Box component="span" sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '999px', px: 2, py: 0.5, fontWeight: 700, color: P.blue.shadow }}>
              Matched: {Object.keys(matches).length} / 8
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.yellow.shadow }}>
              <strong>How to play:</strong> Click a term on the left, then click its matching definition on the right. Click a matched pair to unmatch it.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3, position: 'relative' }}>
            {/* Terms Column */}
            <Box sx={{ flex: 1, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.orange.shadow}`, p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.orange.shadow, mb: 2 }}>Terms</Typography>
              <Stack spacing={1.5}>
                {shuffledTerms.map((term) => {
                  const isMatched = !!matches[term.id]
                  const isSelected = selectedTerm === term.id
                  return (
                    <Box key={term.id} id={`term-${term.id}`} component="button" onClick={() => handleTermClick(term.id)} sx={{
                      bgcolor: isSelected ? P.blue.bg : isMatched ? P.teal.bg : 'white',
                      border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.teal.border : P.orange.border}`,
                      borderRadius: '10px', p: 1.5, textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem',
                      color: isSelected ? P.blue.shadow : isMatched ? P.teal.shadow : P.orange.shadow,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-1px,-1px)' },
                    }}>
                      {term.term}
                      {isMatched && <Typography variant="caption" sx={{ display: 'block', color: P.teal.border, fontWeight: 600 }}>Matched</Typography>}
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            {/* Definitions Column */}
            <Box sx={{ flex: 1, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.teal.shadow, mb: 2 }}>Definitions</Typography>
              <Stack spacing={1.5}>
                {shuffledDefinitions.map((definition) => {
                  const isMatched = Object.values(matches).includes(definition.id)
                  const isSelected = selectedDefinition === definition.id
                  return (
                    <Box key={definition.id} id={`definition-${definition.id}`} component="button" onClick={() => handleDefinitionClick(definition.id)} sx={{
                      bgcolor: isSelected ? P.blue.bg : isMatched ? P.purple.bg : 'white',
                      border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.purple.border : P.teal.border}`,
                      borderRadius: '10px', p: 1.5, textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
                      color: isSelected ? P.blue.shadow : isMatched ? P.purple.shadow : P.teal.shadow,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-1px,-1px)' },
                    }}>
                      {definition.definition}
                      {isMatched && <Typography variant="caption" sx={{ display: 'block', color: P.purple.border, fontWeight: 600 }}>Matched</Typography>}
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmit} disabled={!allMatched} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: !allMatched ? 'not-allowed' : 'pointer', color: P.blue.shadow, opacity: !allMatched ? 0.5 : 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
            }}>
              {allMatched ? 'Submit Matches!' : `Match All Terms First (${Object.keys(matches).length}/8)`}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
