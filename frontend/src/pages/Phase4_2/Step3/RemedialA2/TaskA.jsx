import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level A2 - Task A: Term Treasure Hunt
 * Match 8 social media terms to definitions/pictures (Drag and Drop Matching)
 * Gamified as "Term Treasure Hunt"
 */

const TERM_PAIRS = [
  {
    id: 1,
    term: 'hashtag',
    definition: '#',
    description: 'Hash symbol used to categorize posts'
  },
  {
    id: 2,
    term: 'caption',
    definition: 'Words under photo',
    description: 'Text that appears below an image'
  },
  {
    id: 3,
    term: 'emoji',
    definition: '😊',
    description: 'Smile face or expression icon'
  },
  {
    id: 4,
    term: 'tag',
    definition: '@name',
    description: 'At symbol to mention someone'
  },
  {
    id: 5,
    term: 'call-to-action',
    definition: 'Do this!',
    description: 'A command telling people what to do'
  },
  {
    id: 6,
    term: 'post',
    definition: 'Picture+text',
    description: 'Content shared on social media'
  },
  {
    id: 7,
    term: 'story',
    definition: '24-hour post',
    description: 'Temporary content that disappears'
  },
  {
    id: 8,
    term: 'like',
    definition: '❤️',
    description: 'Heart button to show appreciation'
  }
]

export default function Phase4_2Step3RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleTermClick = (pairId, term) => {
    if (showResults) return

    // Toggle selection
    if (matches[pairId] === term) {
      const newMatches = { ...matches }
      delete newMatches[pairId]
      setMatches(newMatches)
    } else {
      // Remove term from other matches if exists
      const newMatches = { ...matches }
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === term) {
          delete newMatches[key]
        }
      })
      newMatches[pairId] = term
      setMatches(newMatches)
    }
  }

  const handleSubmit = () => {
    let correctCount = 0

    TERM_PAIRS.forEach(pair => {
      if (matches[pair.id] === pair.term) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store score (8 correct = full score)
    sessionStorage.setItem('phase4_2_step3_a2_taskA', correctCount.toString())

    logTaskCompletion(correctCount, TERM_PAIRS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'A2',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/a2/taskB')
  }

  const availableTerms = TERM_PAIRS.map(p => p.term).filter(
    term => !Object.values(matches).includes(term)
  )
  const allMatched = Object.keys(matches).length === TERM_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task A: Term Treasure Hunt
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to the Term Treasure Hunt! Match each social media term to its picture or definition. Find all 8 treasures to unlock the gems!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Click a term from the treasure chest, then click the matching definition box. Match all 8 correctly!
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Scoring:</strong> 1 point per correct match (Pass: 6/8)
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Term Treasure Chest */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f4e4c1', border: '3px solid #d4a373' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ textAlign: 'center', mb: 2 }}>
              💎 Treasure Chest 💎
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {availableTerms.map(term => (
                <Button
                  key={term}
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: '#8b7355',
                    '&:hover': { backgroundColor: '#6b5335' }
                  }}
                  onClick={() => {
                    // This is for display only - clicking here does nothing
                  }}
                >
                  {term}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Definition Boxes */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom color="primary">
            📦 Match to Definitions:
          </Typography>
          <Grid container spacing={2}>
            {TERM_PAIRS.map(pair => {
              const isMatched = !!matches[pair.id]
              const isCorrect = matches[pair.id] === pair.term

              return (
                <Grid item xs={12} sm={6} key={pair.id}>
                  <Card
                    elevation={3}
                    sx={{
                      minHeight: 140,
                      cursor: 'pointer',
                      backgroundColor: showResults
                        ? (isCorrect ? 'success.lighter' : isMatched ? 'error.lighter' : 'grey.100')
                        : isMatched ? 'info.lighter' : 'grey.100',
                      border: 2,
                      borderColor: isMatched ? 'primary.main' : 'grey.300',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: showResults ? 'none' : 'scale(1.02)',
                        boxShadow: showResults ? 3 : 6
                      }
                    }}
                    onClick={() => {
                      // Allow clicking any available term to match with this definition
                      if (availableTerms.length > 0 && !showResults) {
                        // For simplicity, we'll make each box selectable from available terms
                        // User experience: click box, select from available terms (simplified)
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h3" sx={{ fontSize: '2.5rem', mb: 1 }}>
                          {pair.definition}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pair.description}
                        </Typography>
                      </Box>

                      {/* Matched Term Display */}
                      {isMatched && (
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            backgroundColor: 'white',
                            textAlign: 'center',
                            border: 2,
                            borderColor: showResults
                              ? (isCorrect ? 'success.main' : 'error.main')
                              : 'primary.main'
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {matches[pair.id]}
                          </Typography>
                          {showResults && isCorrect && (
                            <CheckCircleIcon sx={{ color: 'success.main', mt: 0.5 }} />
                          )}
                        </Paper>
                      )}

                      {/* Available Terms Buttons */}
                      {!isMatched && !showResults && availableTerms.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                          {availableTerms.slice(0, 3).map(term => (
                            <Button
                              key={term}
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTermClick(pair.id, term)
                              }}
                              sx={{ fontSize: '0.7rem', minWidth: 0, px: 1 }}
                            >
                              {term}
                            </Button>
                          ))}
                        </Box>
                      )}

                      {/* Show correct answer if wrong */}
                      {showResults && !isCorrect && (
                        <Alert severity="error" sx={{ mt: 2, py: 0 }}>
                          <Typography variant="caption">
                            Correct: <strong>{pair.term}</strong>
                          </Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>


      {/* Results */}
      {showResults && (
        <Alert
          severity={score >= 6 ? "success" : "warning"}
          sx={{ mt: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            {score >= 6 ? '🎉 Treasures Found!' : 'Keep Hunting!'}
          </Typography>
          <Typography>
            Correct Matches: <strong>{score}/{TERM_PAIRS.length}</strong>
          </Typography>
          <Typography>
            {score >= 6
              ? 'You unlocked the gems! Ready for the next quest!'
              : 'You need at least 6/8 correct. Review and try again!'}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allMatched}
          >
            Submit Matches
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task B
          </Button>
        )}
      </Box>
    </Box>
  )
}
