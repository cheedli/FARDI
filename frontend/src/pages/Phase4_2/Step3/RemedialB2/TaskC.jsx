import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Task C: Kahoot Match
 * Matching game - link 8 social media terms to advanced definitions
 * Pairs: hashtag—Discoverability tool, caption—Engagement hook, emoji—Emotional enhancer,
 * tag—Network amplifier, call-to-action—Conversion trigger, story—Temporary content,
 * engagement—Interaction metric, viral—Organic spread
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
  const [matches, setMatches] = useState({}) // {termId: definitionId}
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledDefinitions, setShuffledDefinitions] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [lineRenderKey, setLineRenderKey] = useState(0)

  // Shuffle terms and definitions on start
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

    // If clicking already matched term, unselect it
    if (matches[termId]) {
      const { [termId]: _, ...rest } = matches
      setMatches(rest)
      return
    }

    setSelectedTerm(termId)

    // If definition is already selected, make the match
    if (selectedDefinition) {
      setMatches({ ...matches, [termId]: selectedDefinition })
      setSelectedTerm(null)
      setSelectedDefinition(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleDefinitionClick = (definitionId) => {
    if (submitted) return

    // If clicking already matched definition, unselect it
    const matchedTermId = Object.keys(matches).find(key => matches[key] === definitionId)
    if (matchedTermId) {
      const { [matchedTermId]: _, ...rest } = matches
      setMatches(rest)
      return
    }

    setSelectedDefinition(definitionId)

    // If term is already selected, make the match
    if (selectedTerm) {
      setMatches({ ...matches, [selectedTerm]: definitionId })
      setSelectedTerm(null)
      setSelectedDefinition(null)
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

    setScore(correctMatches)
    setSubmitted(true)
    setGameFinished(true)

    // Save score
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
        body: JSON.stringify({
          phase: '4.2',
          level: 'B2',
          task: 'C',
          step: 3,
          score: finalScore,
          max_score: 8,
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
    navigate('/phase4_2/step3/remedial/b2/taskD')
  }

  const allMatched = Object.keys(matches).length === 8

  const getTermById = (id) => TERMS.find(t => t.id === id)

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task C: Kahoot Match
          </Typography>
          <Typography variant="body1">
            Match 8 social media terms to their advanced definitions!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Kahoot Match! Match 8 social media terms to their advanced definitions. Click a term, then click its matching definition. All correct matches earn full points! Ready? Let's play!"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)' }}>
          <SwapHorizIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Kahoot Match Challenge
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            8 Terms • 8 Advanced Definitions • Match Them All!
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

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', fontStyle: 'italic' }}>
              Inspired by Kahoot's interactive matching games!
            </Typography>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const passed = score >= 6

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 3: Remedial Activities
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
              {passed ? 'Great Matching!' : 'Keep Practicing!'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#e67e22' }}>
                {score} / 8
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Pass threshold: 6/8
              </Typography>
            </Paper>
            {passed && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Well done!</strong> You matched most terms correctly! You understand social media terminology well!
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
                        Correct definition: <strong>{term.definition}</strong>
                      </Typography>
                      {!isCorrect && userMatch && (
                        <Typography variant="body1" sx={{ color: '#e74c3c', fontWeight: 500, mt: 1 }}>
                          Your match: {userMatch.definition}
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
            Continue to Task D: Spell Quest
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Kahoot Match
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SwapHorizIcon />
            <Typography variant="h6">
              Matched: {Object.keys(matches).length} / 8
            </Typography>
          </Box>
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
          <strong>How to play:</strong> Click a term on the left, then click its matching definition on the right. Click a matched pair to unmatch it.
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

          {/* Definitions Column */}
          <Paper elevation={3} sx={{ flex: 1, p: 3, backgroundColor: '#ecf0f1', zIndex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 3 }}>
              Advanced Definitions
            </Typography>
            <Stack spacing={2}>
              {shuffledDefinitions.map((definition) => {
                const isMatched = Object.values(matches).includes(definition.id)
                const isSelected = selectedDefinition === definition.id

                return (
                  <Paper
                    key={definition.id}
                    id={`definition-${definition.id}`}
                    elevation={isSelected ? 6 : 2}
                    onClick={() => handleDefinitionClick(definition.id)}
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
                      {definition.definition}
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
            const definitionId = matches[termId]
            const termEl = document.getElementById(`term-${termId}`)
            const definitionEl = document.getElementById(`definition-${definitionId}`)

            if (termEl && definitionEl) {
              const termRect = termEl.getBoundingClientRect()
              const definitionRect = definitionEl.getBoundingClientRect()
              const containerRect = termEl.closest('.MuiBox-root')?.getBoundingClientRect()

              if (containerRect) {
                const x1 = termRect.right - containerRect.left
                const y1 = termRect.top + termRect.height / 2 - containerRect.top
                const x2 = definitionRect.left - containerRect.left
                const y2 = definitionRect.top + definitionRect.height / 2 - containerRect.top

                return (
                  <line
                    key={`line-${termId}-${definitionId}`}
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
    </Box>
  )
}
