import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Task C: Kahoot Match
 * Matching game - link 8 social media terms to advanced definitions
 * Score: 1 point per match (8 total)
 * Pass threshold: 6/8
 */

const TERMS = [
  { id: 1, term: 'hashtag', definition: 'Discoverability tool for content categorization' },
  { id: 2, term: 'caption', definition: 'Engagement hook that tells your story' },
  { id: 3, term: 'emoji', definition: 'Emotional enhancer adding visual appeal' },
  { id: 4, term: 'tag', definition: 'Network amplifier mentioning other users' },
  { id: 5, term: 'call-to-action', definition: 'Conversion trigger prompting user action' },
  { id: 6, term: 'story', definition: 'Temporary content disappearing in 24 hours' },
  { id: 7, term: 'engagement', definition: 'Interaction metric measuring post success' },
  { id: 8, term: 'viral', definition: 'Organic spread reaching millions rapidly' }
]

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_b2' })
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
    if (gameStarted && shuffledTerms.length === 0) {
      const terms = [...TERMS].sort(() => Math.random() - 0.5)
      const definitions = [...TERMS].sort(() => Math.random() - 0.5)
      setShuffledTerms(terms)
      setShuffledDefinitions(definitions)
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
    sessionStorage.setItem('phase4_2_step3_b2_taskC', correctMatches)
    logTaskCompletion(correctMatches)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'C', step: 3, score: finalScore, max_score: 8, completed: true })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleStartGame = () => setGameStarted(true)
  const handleContinue = () => navigate('/phase4_2/step3/remedial/b2/taskD')
  const allMatched = Object.keys(matches).length === 8
  const getTermById = (id) => TERMS.find(t => t.id === id)

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 - Step 3: Remedial Activities</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task C: Kahoot Match</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>Match 8 social media terms to their advanced definitions!</Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Kahoot Match! Match 8 social media terms to their advanced definitions. Click a term, then click its matching definition. All correct matches earn full points! Ready? Let's play!" />
            </Box>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <SwapHorizIcon sx={{ fontSize: 80, color: P.orange.shadow, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.orange.shadow, mb: 1 }}>Kahoot Match Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow, mb: 3 }}>8 Terms · 8 Advanced Definitions · Match Them All!</Typography>
              <Box component="button" onClick={handleStartGame} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 8, py: 2, fontWeight: 700, fontSize: '1.3rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
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
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 - Step 3: Remedial Activities</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task C: Kahoot Match - Results</Typography>
            </Box>

            <Box sx={{ bgcolor: passed ? P.green.bg : P.yellow.bg, border: `2px solid ${passed ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: passed ? P.green.border : P.yellow.border, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.yellow.shadow, mb: 2 }}>
                {passed ? 'Great Matching!' : 'Keep Practicing!'}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: passed ? P.green.border : P.yellow.border }}>{score} / 8</Typography>
              <Typography variant="h6" sx={{ opacity: 0.7, mt: 1 }}>Points Earned</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Pass threshold: 6/8</Typography>
              {passed && (
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: P.green.shadow }}>
                    Well done! You matched most terms correctly! You understand social media terminology well!
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Match Review */}
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.blue.shadow }}>Match Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {TERMS.map((term) => {
                  const userMatchId = matches[term.id]
                  const userMatch = getTermById(userMatchId)
                  const isCorrect = userMatchId === term.id
                  return (
                    <Box key={term.id} sx={{
                      bgcolor: isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', p: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{term.term}</Typography>
                        <Typography variant="body2">Correct: <strong>{term.definition}</strong></Typography>
                        {!isCorrect && userMatch && (
                          <Typography variant="body2" sx={{ color: P.red.border, mt: 0.5 }}>Your match: {userMatch.definition}</Typography>
                        )}
                      </Box>
                      {isCorrect ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 32 }} /> : <CancelIcon sx={{ color: P.red.border, fontSize: 32 }} />}
                    </Box>
                  )
                })}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.2rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Continue to Task D: Spell Quest</Box>
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

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Kahoot Match</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SwapHorizIcon sx={{ color: P.orange.shadow }} />
                <Typography variant="h6" sx={{ color: P.orange.shadow }}>Matched: {Object.keys(matches).length} / 8</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={(Object.keys(matches).length / 8) * 100}
              sx={{ mt: 2, height: 8, borderRadius: 1, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 1 } }}
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow, fontWeight: 500 }}>
              <strong>How to play:</strong> Click a term on the left, then click its matching definition on the right. Click a matched pair to unmatch it.
            </Typography>
          </Box>

          {/* Matching Grid */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Terms Column */}
              <Box sx={{ flex: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.yellow.shadow, mb: 3 }}>Terms</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {shuffledTerms.map((term) => {
                    const isMatched = matches[term.id]
                    const isSelected = selectedTerm === term.id
                    return (
                      <Box key={term.id} id={`term-${term.id}`} component="button" onClick={() => handleTermClick(term.id)} sx={{
                        bgcolor: isSelected ? P.blue.bg : isMatched ? P.teal.bg : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                        border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.teal.border : P.orange.border}`,
                        borderRadius: '12px', p: 2, cursor: 'pointer', textAlign: 'left', fontWeight: 'bold',
                        fontSize: '1rem', color: isSelected ? P.blue.shadow : isMatched ? P.teal.shadow : P.orange.shadow,
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'translate(-2px,-2px)' }
                      }}>
                        {term.term}
                        {isMatched && <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, mt: 0.5 }}>Matched</Typography>}
                      </Box>
                    )
                  })}
                </Box>
              </Box>

              {/* Definitions Column */}
              <Box sx={{ flex: 1, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 3 }}>Advanced Definitions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {shuffledDefinitions.map((definition) => {
                    const isMatched = Object.values(matches).includes(definition.id)
                    const isSelected = selectedDefinition === definition.id
                    return (
                      <Box key={definition.id} id={`definition-${definition.id}`} component="button" onClick={() => handleDefinitionClick(definition.id)} sx={{
                        bgcolor: isSelected ? P.blue.bg : isMatched ? P.teal.bg : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                        border: `2px solid ${isSelected ? P.purple.border : isMatched ? P.teal.border : P.blue.border}`,
                        borderRadius: '12px', p: 2, cursor: 'pointer', textAlign: 'left',
                        fontSize: '0.95rem', fontWeight: 500, color: isSelected ? P.purple.shadow : isMatched ? P.teal.shadow : P.blue.shadow,
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'translate(-2px,-2px)' }
                      }}>
                        {definition.definition}
                        {isMatched && <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, mt: 0.5 }}>Matched</Typography>}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Submit */}
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmit} disabled={!allMatched} sx={{
              bgcolor: allMatched ? P.orange.bg : (isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'),
              border: `2px solid ${allMatched ? P.orange.border : (isDark ? 'rgba(255,255,255,0.2)' : '#ccc')}`,
              borderRadius: '12px', boxShadow: allMatched ? `3px 3px 0 ${P.orange.shadow}` : 'none',
              px: 6, py: 2, fontWeight: 700, fontSize: '1.2rem',
              cursor: allMatched ? 'pointer' : 'not-allowed',
              color: allMatched ? P.orange.shadow : (isDark ? 'rgba(255,255,255,0.3)' : '#999'),
              opacity: allMatched ? 1 : 0.5,
              '&:hover': { transform: allMatched ? 'translate(-2px,-2px)' : 'none', boxShadow: allMatched ? `5px 5px 0 ${P.orange.shadow}` : 'none' }
            }}>
              {allMatched ? 'Submit Matches!' : `Match All Terms First (${Object.keys(matches).length}/8)`}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
