import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Chip, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import QuizIcon from '@mui/icons-material/Quiz'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task D: Critique Kahoot
 * Critique game with 6 terms requiring nuanced analysis
 * Inspired by Kahoot! critique rounds
 * Score: +1 for each nuanced critique with video reference = 6 points maximum
 */

const TERMS = [
  {
    id: 1,
    term: 'promotional',
    expectedCritique: 'Effective for sales but can feel pushy if overdone.',
    expectedConcepts: ['effective', 'sales', 'pushy', 'overdone', 'balance'],
    videoReference: 'Video 1'
  },
  {
    id: 2,
    term: 'persuasive',
    expectedCritique: 'Powerful with balanced appeals but manipulative without ethics.',
    expectedConcepts: ['powerful', 'balanced', 'appeals', 'manipulative', 'ethics', 'ethos', 'pathos', 'logos'],
    videoReference: 'Video 1'
  },
  {
    id: 3,
    term: 'targeted',
    expectedCritique: 'Increases relevance but risks exclusion.',
    expectedConcepts: ['relevance', 'increases', 'exclusion', 'risks', 'specific'],
    videoReference: 'Video 1'
  },
  {
    id: 4,
    term: 'original',
    expectedCritique: 'Sparks interest but hard to achieve consistently.',
    expectedConcepts: ['sparks', 'interest', 'hard', 'achieve', 'consistently', 'innovation'],
    videoReference: 'Video 1'
  },
  {
    id: 5,
    term: 'creative',
    expectedCritique: 'Makes ads memorable but needs alignment with brand.',
    expectedConcepts: ['memorable', 'alignment', 'brand', 'needs', 'creative'],
    videoReference: 'Video 1'
  },
  {
    id: 6,
    term: 'dramatisation',
    expectedCritique: 'Engages emotionally but requires authentic storytelling.',
    expectedConcepts: ['engages', 'emotionally', 'authentic', 'storytelling', 'goal', 'obstacle'],
    videoReference: 'Video 2'
  }
]

const TIME_PER_TERM = 45 // 45 seconds per critique

export default function RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TERM)
  const [critique, setCritique] = useState('')
  const [critiques, setCritiques] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])

  const currentTerm = TERMS[currentTermIndex]

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || showFeedback) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up! Auto-submit (forced)
      handleSubmitCritique(true)
    }
  }, [timeLeft, gameStarted, gameFinished, showFeedback])

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleSubmitCritique = (timeUp = false) => {
    // Only validate if user manually submits (not when time is up)
    if (!timeUp && critique.trim().length < 15) {
      alert('Please write a more detailed critique (at least 15 characters with nuance).')
      return
    }

    // Save critique
    const newCritiques = [
      ...critiques,
      {
        termId: currentTerm.id,
        term: currentTerm.term,
        critique: critique,
        timestamp: Date.now()
      }
    ]
    setCritiques(newCritiques)

    // Show brief feedback
    setShowFeedback(true)
    setCurrentFeedback({ term: currentTerm.term, submitted: true })

    // Move to next term after 2 seconds
    setTimeout(() => {
      if (currentTermIndex < TERMS.length - 1) {
        setCurrentTermIndex(currentTermIndex + 1)
        setCritique('')
        setShowFeedback(false)
        setCurrentFeedback(null)
        setTimeLeft(TIME_PER_TERM)
      } else {
        // All critiques submitted - evaluate
        handleFinishGame(newCritiques)
      }
    }, 2000)
  }

  const handleFinishGame = async (finalCritiques) => {
    setEvaluating(true)
    setGameFinished(true)

    // Evaluate ALL critiques in ONE API call
    try {
      const critiquesData = finalCritiques.map(critiqueData => {
        const term = TERMS.find(t => t.id === critiqueData.termId)
        return {
          term: term.term,
          critique: critiqueData.critique,
          expectedConcepts: term.expectedConcepts,
          videoReference: term.videoReference
        }
      })

      const response = await fetch('/api/phase4/step3/remedial/c1/evaluate-critiques-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          critiques: critiquesData
        })
      })

      const data = await response.json()

      if (data.success && data.results) {
        // Map results back
        const evaluatedResults = finalCritiques.map((critiqueData, index) => {
          const term = TERMS.find(t => t.id === critiqueData.termId)
          return {
            termId: term.id,
            term: term.term,
            critique: critiqueData.critique,
            score: data.results[index]?.score || 0,
            feedback: data.results[index]?.feedback || 'Good effort!'
          }
        })

        setResults(evaluatedResults)

        // Calculate total score
        const totalScore = evaluatedResults.reduce((sum, r) => sum + r.score, 0)
        sessionStorage.setItem('remedial_step3_c1_taskD_score', totalScore)

        // Log completion
        await logTaskCompletion(totalScore)
      } else {
        throw new Error('Batch evaluation failed')
      }
    } catch (error) {
      console.error('Batch evaluation error:', error)

      // Fallback: Local evaluation without AI
      const evaluatedResults = finalCritiques.map(critiqueData => {
        const term = TERMS.find(t => t.id === critiqueData.termId)

        // Check if critique is empty or too short
        if (!critiqueData.critique || critiqueData.critique.trim().length < 15) {
          return {
            termId: term.id,
            term: term.term,
            critique: critiqueData.critique || '(No critique provided)',
            score: 0,
            feedback: 'Time ran out before you could provide a critique. Remember to write quickly and include both strengths and weaknesses!'
          }
        }

        const hasNuance = critiqueData.critique.toLowerCase().includes('but') ||
                          critiqueData.critique.toLowerCase().includes('yet') ||
                          critiqueData.critique.toLowerCase().includes('however')
        const hasConcept = term.expectedConcepts.some(c => critiqueData.critique.toLowerCase().includes(c.toLowerCase()))

        return {
          termId: term.id,
          term: term.term,
          critique: critiqueData.critique,
          score: (hasNuance && hasConcept) ? 1 : 0,
          feedback: hasNuance && hasConcept ? 'Good critique with nuance!' : 'Add more nuance using "but", "yet", or "however" to show both strengths and weaknesses.'
        }
      })

      setResults(evaluatedResults)

      const totalScore = evaluatedResults.reduce((sum, r) => sum + r.score, 0)
      sessionStorage.setItem('remedial_step3_c1_taskD_score', totalScore)

      await logTaskCompletion(totalScore)
    }

    setEvaluating(false)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'D',
          step: 2,
          score: finalScore,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/dashboard')
  }

  const getTotalScore = () => {
    return results.reduce((sum, r) => sum + r.score, 0)
  }

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level C1 - Task D: Critique Kahoot 🎯
          </Typography>
          <Typography variant="body1">
            Critique advertising terms with nuanced analysis!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Critique Kahoot! 🎯 For each of the 6 advertising terms, write a NUANCED critique that shows both strengths AND weaknesses. Use 'but', 'yet', or 'however' to show critical thinking. Reference the videos when applicable. You have 45 seconds per critique. Score: 1 point per nuanced critique = 6 points total. Ready for critical analysis? Let's go! 🚀"
          />
        </Paper>

        <Paper
          elevation={6}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJzbWFsbEdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc21hbGxHcmlkKSIvPjwvc3ZnPg==)',
            opacity: 0.3
          }}/>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <RateReviewIcon sx={{ fontSize: 120, color: 'white', mb: 2 }} />
            <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              Critique Kahoot!
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
              6 Terms • 45 Seconds Each • Critical Analysis
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleStartGame}
              sx={{
                py: 3,
                px: 10,
                fontSize: '1.8rem',
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#46178f',
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s'
              }}
            >
              START CRITIQUE
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (gameFinished && !evaluating) {
    const totalScore = getTotalScore()

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level C1 - Task D: Critique Results 🏆
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 5, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)', color: 'white' }}>
          <EmojiEventsIcon sx={{ fontSize: 100, mb: 2 }} />
          <Typography variant="h2" gutterBottom fontWeight="bold">
            {totalScore === 6 ? 'PERFECT CRITIQUE! 🎉' : 'CRITIQUE COMPLETE! 🎊'}
          </Typography>
          <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 350, mx: 'auto', my: 4, borderRadius: 3 }}>
            <Typography variant="h1" fontWeight="bold" sx={{ color: '#8e44ad', fontSize: '5rem' }}>
              {totalScore}
            </Typography>
            <Typography variant="h4" color="text.secondary" fontWeight="bold">
              out of {TERMS.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              {Math.round((totalScore / TERMS.length) * 100)}% nuanced critiques
            </Typography>
          </Paper>
        </Paper>

        {/* Critique Review */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#8e44ad', mb: 3 }}>
            Critique Review
          </Typography>

          <Stack spacing={3}>
            {results.map((result, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 3,
                  borderLeft: '6px solid',
                  borderColor: result.score === 1 ? '#27ae60' : '#e74c3c',
                  backgroundColor: result.score === 1 ? '#d5f4e6' : '#fadbd8'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={index + 1}
                    sx={{
                      backgroundColor: '#8e44ad',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      width: 40,
                      height: 40
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    {result.term}
                  </Typography>
                  {result.score === 1 ? (
                    <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 36 }} />
                  ) : (
                    <CancelIcon sx={{ color: '#e74c3c', fontSize: 36 }} />
                  )}
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                    Your critique:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#2c3e50', fontWeight: 500 }}>
                      "{result.critique}"
                    </Typography>
                  </Paper>
                </Box>

                <Alert
                  severity={result.score === 1 ? 'success' : 'warning'}
                  sx={{
                    backgroundColor: result.score === 1 ? '#d4edda' : '#fff3cd'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                    <strong>AI Feedback:</strong> {result.feedback}
                  </Typography>
                </Alert>
              </Paper>
            ))}
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
              fontSize: '1.3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              borderRadius: '50px',
              '&:hover': {
                background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s'
            }}
          >
            Complete C1 Remedial →
          </Button>
        </Box>
      </Box>
    )
  }

  if (evaluating) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center', mt: 10 }}>
        <LinearProgress sx={{ mb: 3, height: 8, borderRadius: 1 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: '#8e44ad' }}>
          Evaluating Your Critiques...
        </Typography>
        <Typography variant="body1" sx={{ color: '#2c3e50', mt: 2 }}>
          AI is analyzing your critical thinking, nuance, and depth of analysis...
        </Typography>
      </Box>
    )
  }

  // Game in progress
  const progress = ((currentTermIndex + 1) / TERMS.length) * 100
  const completedCount = critiques.length

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)', p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Top Bar */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Paper sx={{ px: 3, py: 1.5, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#8e44ad' }}>
                Term {currentTermIndex + 1} / {TERMS.length}
              </Typography>
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2}>
            <Paper sx={{ px: 3, py: 1.5, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmojiEventsIcon sx={{ color: '#f39c12', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                  {completedCount} / {TERMS.length}
                </Typography>
              </Stack>
            </Paper>

            <Paper
              sx={{
                px: 3,
                py: 1.5,
                backgroundColor: timeLeft <= 10 ? '#e74c3c' : 'rgba(255,255,255,0.95)',
                borderRadius: 2,
                animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <TimerIcon sx={{ color: timeLeft <= 10 ? 'white' : '#e74c3c', fontSize: 28 }} />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: timeLeft <= 10 ? 'white' : '#2c3e50', minWidth: 50 }}
                >
                  {timeLeft}s
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 3,
            height: 12,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'white',
              borderRadius: 2
            }
          }}
        />

        {/* Term Display */}
        <Paper
          elevation={8}
          sx={{
            p: 5,
            mb: 3,
            backgroundColor: 'white',
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Chip
            label="CRITIQUE THIS TERM"
            sx={{
              backgroundColor: '#8e44ad',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              mb: 3,
              py: 2.5
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: '#2c3e50',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            {currentTerm.term}
          </Typography>
          <Typography variant="body1" sx={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
            Write a nuanced critique showing BOTH strengths AND weaknesses
          </Typography>
        </Paper>

        {/* Critique Input */}
        <Paper elevation={6} sx={{ p: 4, backgroundColor: 'white', borderRadius: 3, mb: 3 }}>
          <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e1f5fe' }}>
            <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 600 }}>
              💡 TIP: Use "but", "yet", or "however" to show critical thinking by presenting both strengths and weaknesses.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={critique}
            onChange={(e) => setCritique(e.target.value)}
            placeholder="Write your nuanced critique here... (Show both pros and cons)"
            variant="outlined"
            disabled={showFeedback}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#8e44ad',
                  borderWidth: 3
                },
                '&:hover fieldset': {
                  borderColor: '#6c3483'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6c3483'
                },
                '& textarea': {
                  color: '#1a252f',
                  fontWeight: 500,
                  fontSize: '1.1rem'
                },
                '& textarea::placeholder': {
                  color: '#7f8c8d',
                  opacity: 0.8
                }
              }
            }}
          />

          <Typography variant="body1" sx={{ display: 'block', mt: 2, color: '#2c3e50', fontWeight: 600 }}>
            {critique.length} characters • Minimum 15 characters (aim for 40-100 for nuance)
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmitCritique}
            disabled={critique.trim().length < 15 || showFeedback}
            sx={{
              mt: 3,
              py: 2,
              fontSize: '1.3rem',
              fontWeight: 'bold',
              background: critique.trim().length >= 15 ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
              borderRadius: '50px',
              '&:hover': {
                background: critique.trim().length >= 15 ? 'linear-gradient(135deg, #229954 0%, #1e8449 100%)' : 'linear-gradient(135deg, #7f8c8d 0%, #707b7c 100%)',
                transform: critique.trim().length >= 15 ? 'scale(1.02)' : 'scale(1)'
              },
              transition: 'all 0.2s'
            }}
          >
            SUBMIT CRITIQUE
          </Button>
        </Paper>

        {showFeedback && (
          <Paper
            elevation={8}
            sx={{
              p: 3,
              backgroundColor: '#27ae60',
              color: 'white',
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ✓ Critique Submitted!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Moving to next term...
            </Typography>
          </Paper>
        )}

        {/* Timer Warning */}
        {timeLeft <= 10 && !showFeedback && (
          <Alert severity="warning" sx={{ mt: 3, backgroundColor: '#f39c12', color: 'white', border: '3px solid #e67e22' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ⏰ Hurry! Only {timeLeft} seconds left!
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  )
}
