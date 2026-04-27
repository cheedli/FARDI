import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task C: Kahoot Match
 * Matching game - link 8 social media terms to scenarios
 */

const TERMS = [
  { id: 1, term: 'hashtag', scenario: 'User adds #travel to reach people searching for trips' },
  { id: 2, term: 'caption', scenario: 'Text below photo describes the sunset moment' },
  { id: 3, term: 'viral', scenario: 'Video gets 10 million views in one day' },
  { id: 4, term: 'engagement', scenario: 'Post receives 500 likes, 200 comments, 100 shares' },
  { id: 5, term: 'emoji', scenario: 'Heart symbol added to express love for food' },
  { id: 6, term: 'call-to-action', scenario: 'Post says "Click link in bio to shop now"' },
  { id: 7, term: 'tag', scenario: 'Photographer mentions @friend in the photo' },
  { id: 8, term: 'story', scenario: '24-hour post shows behind-the-scenes content' }
]

const TIME_LIMIT = 120

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/1/remedial/b2/taskD') }, [])
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 3, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [matches, setMatches] = useState({})
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledScenarios, setShuffledScenarios] = useState([])
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
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  useEffect(() => {
    if (gameStarted && shuffledTerms.length === 0) {
      setShuffledTerms([...TERMS].sort(() => Math.random() - 0.5))
      setShuffledScenarios([...TERMS].sort(() => Math.random() - 0.5))
    }
  }, [gameStarted])

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmit() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleTermClick = (termId) => {
    if (submitted) return
    if (matches[termId]) { const { [termId]: _, ...rest } = matches; setMatches(rest); return }
    setSelectedTerm(termId)
    if (selectedScenario) {
      setMatches({ ...matches, [termId]: selectedScenario })
      setSelectedTerm(null); setSelectedScenario(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleScenarioClick = (scenarioId) => {
    if (submitted) return
    const matchedTermId = Object.keys(matches).find(key => matches[key] === scenarioId)
    if (matchedTermId) { const { [matchedTermId]: _, ...rest } = matches; setMatches(rest); return }
    setSelectedScenario(scenarioId)
    if (selectedTerm) {
      setMatches({ ...matches, [selectedTerm]: scenarioId })
      setSelectedTerm(null); setSelectedScenario(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleSubmit = () => {
    let correctMatches = 0
    Object.keys(matches).forEach(termId => { if (matches[termId] === parseInt(termId)) correctMatches++ })
    const finalScore = Math.round((correctMatches / 8) * 10)
    setScore(finalScore); setSubmitted(true); setGameFinished(true)
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskC_score', finalScore)
    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'C', step: 1, score: finalScore, max_score: 10, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allMatched = Object.keys(matches).length === 8

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTermById = (id) => TERMS.find(t => t.id === id)

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 - Step 1: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B2 - Task C: Kahoot Match</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>Timed matching game - Link terms to scenarios!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS_MABROUKI" message="Welcome to Kahoot Match! Match 8 social media terms to their correct scenarios in 2 minutes. Click a term, then click its matching scenario. All correct matches = 10 points! Ready? Let's play!" />
            </Box>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, textAlign: 'center' }}>
              <SwapHorizIcon sx={{ fontSize: 80, color: P.orange.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Kahoot Match Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow, mb: 4 }}>8 Terms • 8 Scenarios • 2 Minutes • Match Them All!</Typography>
              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>START MATCHING!</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 10
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Level B2 - Task C: Kahoot Match - Results</Typography>
            </Box>
            <Box sx={{ bgcolor: perfectScore ? P.green.bg : P.yellow.bg, border: `2px solid ${perfectScore ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 70, color: perfectScore ? P.green.shadow : P.yellow.shadow, mb: 1 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{perfectScore ? 'Perfect Match!' : 'Game Complete!'}</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{score} / 10</Typography>
                <Typography sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>Points Earned</Typography>
              </Box>
              {perfectScore && (
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}><strong>Amazing!</strong> You matched all terms perfectly! You're a social media vocabulary master!</Typography>
                </Box>
              )}
            </Box>

            {/* Match Review */}
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Match Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {TERMS.map((term) => {
                  const userMatchId = matches[term.id]
                  const userMatch = getTermById(userMatchId)
                  const isCorrect = userMatchId === term.id
                  return (
                    <Box key={term.id} sx={{
                      bgcolor: isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', p: 2,
                      display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 'bold', mb: 0.5 }}>{term.term}</Typography>
                        <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>Correct: <strong>{term.scenario}</strong></Typography>
                        {!isCorrect && userMatch && (
                          <Typography variant="body2" sx={{ color: P.red.shadow, mt: 0.5 }}>Your match: {userMatch.scenario}</Typography>
                        )}
                      </Box>
                      {isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow, fontSize: 32 }} /> : <CancelIcon sx={{ color: P.red.shadow, fontSize: 32 }} />}
                    </Box>
                  )
                })}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/b2/taskD')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task D</Box>
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

          {/* Timer Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Kahoot Match</Typography>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SwapHorizIcon sx={{ color: P.orange.shadow }} />
                  <Typography variant="h6" sx={{ color: P.orange.shadow }}>Matched: {Object.keys(matches).length} / 8</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TimerIcon sx={{ color: timeLeft <= 30 ? P.red.shadow : P.orange.shadow }} />
                  <Typography variant="h6" sx={{ color: timeLeft <= 30 ? P.red.shadow : P.orange.shadow, fontWeight: timeLeft <= 30 ? 'bold' : 'normal' }}>{formatTime(timeLeft)}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 2, height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${(Object.keys(matches).length / 8) * 100}%`, bgcolor: P.orange.border, transition: 'width 0.3s', borderRadius: '4px' }} />
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>How to play:</strong> Click a term on the left, then click its matching scenario on the right. Click a matched pair to unmatch it.</Typography>
          </Box>

          {/* Matching Grid */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Terms Column */}
              <Box sx={{ flex: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow, mb: 2 }}>Terms</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {shuffledTerms.map((term) => {
                    const isMatched = matches[term.id]
                    const isSelected = selectedTerm === term.id
                    return (
                      <Box key={term.id} id={`term-${term.id}`} onClick={() => handleTermClick(term.id)} sx={{
                        p: 2, borderRadius: '12px', cursor: 'pointer',
                        bgcolor: isSelected ? P.blue.bg : isMatched ? P.teal.bg : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                        border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.teal.border : P.yellow.border}`,
                        boxShadow: isSelected ? `3px 3px 0 ${P.blue.shadow}` : isMatched ? `2px 2px 0 ${P.teal.shadow}` : 'none',
                        transform: isSelected ? 'translate(-2px,-2px)' : 'none',
                        transition: 'all 0.15s',
                        '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.yellow.shadow}` }
                      }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: isSelected ? P.blue.shadow : isMatched ? P.teal.shadow : P.yellow.shadow }}>{term.term}</Typography>
                        {isMatched && <Typography variant="caption" sx={{ color: P.teal.shadow, fontWeight: 600 }}>Matched ✓</Typography>}
                      </Box>
                    )
                  })}
                </Box>
              </Box>

              {/* Scenarios Column */}
              <Box sx={{ flex: 1, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow, mb: 2 }}>Scenarios</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {shuffledScenarios.map((scenario) => {
                    const isMatched = Object.values(matches).includes(scenario.id)
                    const isSelected = selectedScenario === scenario.id
                    return (
                      <Box key={scenario.id} id={`scenario-${scenario.id}`} onClick={() => handleScenarioClick(scenario.id)} sx={{
                        p: 2, borderRadius: '12px', cursor: 'pointer',
                        bgcolor: isSelected ? P.blue.bg : isMatched ? P.green.bg : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                        border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.green.border : P.teal.border}`,
                        boxShadow: isSelected ? `3px 3px 0 ${P.blue.shadow}` : isMatched ? `2px 2px 0 ${P.green.shadow}` : 'none',
                        transform: isSelected ? 'translate(-2px,-2px)' : 'none',
                        transition: 'all 0.15s',
                        '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.teal.shadow}` }
                      }}>
                        <Typography variant="body1" fontWeight={500} sx={{ color: isSelected ? P.blue.shadow : isMatched ? P.green.shadow : P.teal.shadow }}>{scenario.scenario}</Typography>
                        {isMatched && <Typography variant="caption" sx={{ color: P.green.shadow, fontWeight: 600 }}>Matched ✓</Typography>}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>

            {/* SVG Lines */}
            <svg key={lineRenderKey} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
              {Object.keys(matches).map((termId) => {
                const scenarioId = matches[termId]
                const termEl = document.getElementById(`term-${termId}`)
                const scenarioEl = document.getElementById(`scenario-${scenarioId}`)
                if (termEl && scenarioEl) {
                  const termRect = termEl.getBoundingClientRect()
                  const scenarioRect = scenarioEl.getBoundingClientRect()
                  const containerRect = termEl.closest('.MuiBox-root')?.getBoundingClientRect()
                  if (containerRect) {
                    const x1 = termRect.right - containerRect.left
                    const y1 = termRect.top + termRect.height / 2 - containerRect.top
                    const x2 = scenarioRect.left - containerRect.left
                    const y2 = scenarioRect.top + scenarioRect.height / 2 - containerRect.top
                    return <line key={`line-${termId}-${scenarioId}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366F1" strokeWidth="3" strokeDasharray="6,4" />
                  }
                }
                return null
              })}
            </svg>
          </Box>

          {/* Submit */}
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmit} disabled={!allMatched} sx={{
              bgcolor: allMatched ? P.blue.bg : (isDark ? '#1a1a2e' : '#e0e0e0'),
              border: `2px solid ${allMatched ? P.blue.border : '#ccc'}`,
              borderRadius: '12px', boxShadow: allMatched ? `3px 3px 0 ${P.blue.shadow}` : 'none',
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1.1rem', cursor: allMatched ? 'pointer' : 'not-allowed',
              color: allMatched ? P.blue.shadow : '#999', opacity: allMatched ? 1 : 0.6,
              '&:hover': allMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
            }}>{allMatched ? 'Submit Matches!' : `Match All Terms First (${Object.keys(matches).length}/8)`}</Box>
          </Box>

          {timeLeft <= 30 && (
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, mt: 3 }}>
              <Typography sx={{ color: P.red.shadow, fontWeight: 700 }}><strong>Hurry!</strong> Only {timeLeft} seconds left!</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
