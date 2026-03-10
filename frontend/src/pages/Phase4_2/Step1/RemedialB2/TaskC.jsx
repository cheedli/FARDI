import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task C: Kahoot Match
 * Matching game - link 8 social media terms to scenarios
 * Timed rounds like Kahoot group play for points
 * Score: All correct = 10 points
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

const TIME_LIMIT = 120 // 2 minutes for all matches

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [matches, setMatches] = useState({}) // {termId: scenarioId}
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledScenarios, setShuffledScenarios] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [lineRenderKey, setLineRenderKey] = useState(0)

  // Shuffle terms and scenarios on start
  useEffect(() => {
    if (gameStarted && shuffledTerms.length === 0) {
      const terms = [...TERMS].sort(() => Math.random() - 0.5)
      const scenarios = [...TERMS].sort(() => Math.random() - 0.5)
      setShuffledTerms(terms)
      setShuffledScenarios(scenarios)
    }
  }, [gameStarted])

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up! Auto-submit
      handleSubmit()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleTermClick = (termId) => {
    if (submitted) return

    // If clicking already matched term, unselect it
    if (matches[termId]) {
      const { [termId]: _, ...rest } = matches
      setMatches(rest)
      return
    }

    setSelectedTerm(termId)

    // If scenario is already selected, make the match
    if (selectedScenario) {
      setMatches({ ...matches, [termId]: selectedScenario })
      setSelectedTerm(null)
      setSelectedScenario(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleScenarioClick = (scenarioId) => {
    if (submitted) return

    // If clicking already matched scenario, unselect it
    const matchedTermId = Object.keys(matches).find(key => matches[key] === scenarioId)
    if (matchedTermId) {
      const { [matchedTermId]: _, ...rest } = matches
      setMatches(rest)
      return
    }

    setSelectedScenario(scenarioId)

    // If term is already selected, make the match
    if (selectedTerm) {
      setMatches({ ...matches, [selectedTerm]: scenarioId })
      setSelectedTerm(null)
      setSelectedScenario(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correctMatches = 0
    Object.keys(matches).forEach(termId => {
      if (matches[termId] === parseInt(termId)) {
        correctMatches++
      }
    })

    const finalScore = Math.round((correctMatches / 8) * 10)
    setScore(finalScore)
    setSubmitted(true)
    setGameFinished(true)

    // Save score
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskC_score', finalScore)
    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          level: 'B2',
          task: 'C',
          step: 1,
          score: finalScore,
          max_score: 10,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleContinue = () => {
    navigate('/phase4_2/step1/remedial/b2/taskD')
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task C: Kahoot Match
          </Typography>
          <Typography variant="body1">
            Timed matching game - Link terms to scenarios!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Kahoot Match! Match 8 social media terms to their correct scenarios in 2 minutes. Click a term, then click its matching scenario. All correct matches = 10 points! Ready? Let's play!"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)' }}>
          <SwapHorizIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Kahoot Match Challenge
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            8 Terms • 8 Scenarios • 2 Minutes • Match Them All!
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            sx={{
              py: 2,
              px: 8,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: '#27ae60',
              color: 'white',
              '&:hover': { backgroundColor: '#229954' }
            }}
          >
            START MATCHING!
          </Button>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 10

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task C: Kahoot Match - Results
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {perfectScore ? 'Perfect Match!' : 'Game Complete!'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#e67e22' }}>
                {score} / 10
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You matched all terms perfectly! You're a social media vocabulary master!
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#e67e22' }} fontWeight="bold">
            Match Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {TERMS.map((term) => {
              const userMatchId = matches[term.id]
              const userMatch = getTermById(userMatchId)
              const isCorrect = userMatchId === term.id

              return (
                <Paper
                  key={term.id}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: '4px solid',
                    borderColor: isCorrect ? '#27ae60' : '#e74c3c',
                    backgroundColor: isCorrect ? '#d5f4e6' : '#fadbd8'
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 'bold', mb: 1 }}>
                        {term.term}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        Correct scenario: <strong>{term.scenario}</strong>
                      </Typography>
                      {!isCorrect && userMatch && (
                        <Typography variant="body1" sx={{ color: '#e74c3c', fontWeight: 500, mt: 1 }}>
                          Your match: {userMatch.scenario}
                        </Typography>
                      )}
                    </Box>
                    {isCorrect ? (
                      <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 40 }} />
                    ) : (
                      <CancelIcon sx={{ color: '#e74c3c', fontSize: 40 }} />
                    )}
                  </Stack>
                </Paper>
              )
            })}
          </Stack>
        </Paper>

        {/* Continue Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)' }
            }}
          >
            Continue to Task D
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header with Timer */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Kahoot Match
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SwapHorizIcon />
              <Typography variant="h6">
                Matched: {Object.keys(matches).length} / 8
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon />
              <Typography variant="h6" sx={{
                color: timeLeft <= 30 ? '#e74c3c' : 'white',
                fontWeight: timeLeft <= 30 ? 'bold' : 'normal'
              }}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(Object.keys(matches).length / 8) * 100}
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#5a6c7d'
            }
          }}
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 500 }}>
          <strong>How to play:</strong> Click a term on the left, then click its matching scenario on the right. Click a matched pair to unmatch it.
        </Typography>
      </Alert>

      {/* Matching Grid with Lines */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <Stack direction="row" spacing={3}>
          {/* Terms Column */}
          <Paper elevation={3} sx={{ flex: 1, p: 3, backgroundColor: '#fff3e0', zIndex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 3 }}>
              Terms
            </Typography>
            <Stack spacing={2}>
              {shuffledTerms.map((term) => {
                const isMatched = matches[term.id]
                const isSelected = selectedTerm === term.id

                return (
                  <Paper
                    key={term.id}
                    id={`term-${term.id}`}
                    elevation={isSelected ? 6 : 2}
                    onClick={() => handleTermClick(term.id)}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#3498db' : isMatched ? '#5a6c7d' : 'white',
                      color: isSelected || isMatched ? 'white' : '#1a252f',
                      borderLeft: '4px solid',
                      borderColor: isSelected ? '#2980b9' : isMatched ? '#34495e' : '#e67e22',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        backgroundColor: isSelected ? '#2980b9' : isMatched ? '#34495e' : '#f5f5f5'
                      }
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {term.term}
                    </Typography>
                    {isMatched && (
                      <Chip
                        label="Matched"
                        size="small"
                        icon={<CheckCircleIcon />}
                        sx={{
                          mt: 1,
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Paper>
                )
              })}
            </Stack>
          </Paper>

          {/* Scenarios Column */}
          <Paper elevation={3} sx={{ flex: 1, p: 3, backgroundColor: '#ecf0f1', zIndex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 3 }}>
              Scenarios
            </Typography>
            <Stack spacing={2}>
              {shuffledScenarios.map((scenario) => {
                const isMatched = Object.values(matches).includes(scenario.id)
                const isSelected = selectedScenario === scenario.id

                return (
                  <Paper
                    key={scenario.id}
                    id={`scenario-${scenario.id}`}
                    elevation={isSelected ? 6 : 2}
                    onClick={() => handleScenarioClick(scenario.id)}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#3498db' : isMatched ? '#5a6c7d' : 'white',
                      color: isSelected || isMatched ? 'white' : '#1a252f',
                      borderLeft: '4px solid',
                      borderColor: isSelected ? '#2980b9' : isMatched ? '#34495e' : '#7f8c8d',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        backgroundColor: isSelected ? '#2980b9' : isMatched ? '#34495e' : '#f5f5f5'
                      }
                    }}
                  >
                    <Typography variant="body1" fontWeight="500">
                      {scenario.scenario}
                    </Typography>
                    {isMatched && (
                      <Chip
                        label="Matched"
                        size="small"
                        icon={<CheckCircleIcon />}
                        sx={{
                          mt: 1,
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Paper>
                )
              })}
            </Stack>
          </Paper>
        </Stack>

        {/* SVG Lines for matches */}
        <svg
          key={lineRenderKey}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
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

                return (
                  <line
                    key={`line-${termId}-${scenarioId}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#34495e"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />
                )
              }
            }
            return null
          })}
        </svg>
      </Box>

      {/* Submit Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!allMatched}
          sx={{
            py: 2,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: allMatched ? 'linear-gradient(135deg, #5a6c7d 0%, #34495e 100%)' : '#bdc3c7',
            '&:hover': {
              background: allMatched ? 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)' : '#95a5a6'
            }
          }}
        >
          {allMatched ? 'Submit Matches!' : `Match All Terms First (${Object.keys(matches).length}/8)`}
        </Button>
      </Box>

      {/* Timer Warning */}
      {timeLeft <= 30 && (
        <Alert severity="warning" sx={{ mt: 3, backgroundColor: '#f39c12', color: 'white' }}>
          <strong>Hurry!</strong> Only {timeLeft} seconds left!
        </Alert>
      )}
    </Box>
  )
}
