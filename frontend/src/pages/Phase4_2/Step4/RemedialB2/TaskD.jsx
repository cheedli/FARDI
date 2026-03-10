import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Remedial B2 - Task D: Spelling & Explain
 * Spell and explain 6 terms
 * Terms: hashtag, caption, emoji, tag, call-to-action, viral
 * TextField for spelling + explanation per term
 * Score: 12 points (2 per term: 1 spell + 1 explain)
 * Pass: 9/12
 */

const TERMS = [
  { id: 1, word: 'hashtag', hint: 'Symbol for categorizing (#)' },
  { id: 2, word: 'caption', hint: 'Text describing a post' },
  { id: 3, word: 'emoji', hint: 'Visual emotion icon' },
  { id: 4, word: 'tag', hint: 'Mention someone (@)' },
  { id: 5, word: 'call-to-action', hint: 'Prompt to take action (CTA)' },
  { id: 6, word: 'viral', hint: 'Content spreading rapidly' }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState({})

  const handleSpellingChange = (termId, value) => {
    setAnswers(prev => ({
      ...prev,
      [termId]: { ...prev[termId], spelling: value }
    }))
  }

  const handleExplanationChange = (termId, value) => {
    setAnswers(prev => ({
      ...prev,
      [termId]: { ...prev[termId], explanation: value }
    }))
  }

  const handleSubmit = () => {
    let totalScore = 0
    const newResults = {}

    TERMS.forEach(term => {
      const answer = answers[term.id] || {}
      const spelling = (answer.spelling || '').trim().toLowerCase()
      const explanation = (answer.explanation || '').trim()

      const spellingCorrect = spelling === term.word.toLowerCase()
      const explanationCorrect = explanation.length >= 15

      newResults[term.id] = {
        spellingCorrect,
        explanationCorrect,
        userSpelling: answer.spelling || '',
        userExplanation: answer.explanation || ''
      }

      if (spellingCorrect) totalScore++
      if (explanationCorrect) totalScore++
    })

    setScore(totalScore)
    setResults(newResults)
    setSubmitted(true)

    sessionStorage.setItem('phase4_2_step4_b2_taskD', totalScore)

    // Log to backend
    fetch('/api/phase4/remedial/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase: '4.2',
        level: 'B2',
        task: 'D',
        step: 4,
        score: totalScore,
        max_score: 12,
        completed: true
      })
    }).catch(err => console.error('Log error:', err))
  }

  const handleContinue = () => {
    navigate('/phase4_2/step4/remedial/b2/results')
  }

  const allAnswered = TERMS.every(term => {
    const answer = answers[term.id] || {}
    return (answer.spelling || '').trim().length > 0 && (answer.explanation || '').trim().length >= 15
  })

  const passed = score >= 9

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task D: Spelling & Explain
        </Typography>
        <Typography variant="body1">
          Spell and explain 6 social media terms!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Spell each term correctly and write an explanation (at least 15 characters). Each term has 2 points: 1 for correct spelling + 1 for good explanation. Total: 12 points!"
        />
      </Paper>

      {/* Terms */}
      <Stack spacing={3} sx={{ mb: 3 }}>
        {TERMS.map((term, index) => {
          const answer = answers[term.id] || {}
          const result = results[term.id]

          return (
            <Paper key={term.id} elevation={3} sx={{ p: 3, backgroundColor: '#f8f9fa', border: '3px solid #9b59b6' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                Term {index + 1}: {term.hint}
              </Typography>

              {/* Spelling */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                  Spell the term:
                </Typography>
                <TextField
                  fullWidth
                  value={answer.spelling || ''}
                  onChange={(e) => handleSpellingChange(term.id, e.target.value)}
                  placeholder="Type the spelling here..."
                  variant="outlined"
                  disabled={submitted}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: '#9b59b6',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#8e44ad'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8e44ad'
                      },
                      '& input': {
                        color: '#1a252f',
                        fontWeight: 500,
                        fontSize: '1.1rem'
                      }
                    }
                  }}
                />
                {submitted && result && (
                  <Alert severity={result.spellingCorrect ? 'success' : 'error'} sx={{ mt: 1 }}>
                    {result.spellingCorrect ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Correct spelling! (+1 point)
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Incorrect. Correct spelling: <strong>{term.word}</strong>
                      </Typography>
                    )}
                  </Alert>
                )}
              </Box>

              {/* Explanation */}
              <Box>
                <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                  Explain what it means:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={answer.explanation || ''}
                  onChange={(e) => handleExplanationChange(term.id, e.target.value)}
                  placeholder="Write your explanation here (minimum 15 characters)..."
                  variant="outlined"
                  disabled={submitted}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: '#9b59b6',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#8e44ad'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8e44ad'
                      },
                      '& textarea': {
                        color: '#1a252f',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }
                    }
                  }}
                />
                <Chip
                  label={`${(answer.explanation || '').length} characters`}
                  sx={{
                    mt: 1,
                    backgroundColor: (answer.explanation || '').length >= 15 ? '#27ae60' : '#95a5a6',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                {submitted && result && (
                  <Alert severity={result.explanationCorrect ? 'success' : 'warning'} sx={{ mt: 1 }}>
                    {result.explanationCorrect ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Good explanation! (+1 point)
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Too short. Add more detail.
                      </Typography>
                    )}
                  </Alert>
                )}
              </Box>
            </Paper>
          )
        })}
      </Stack>

      {/* Results */}
      {submitted && (
        <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: passed ? '#d5f4e6' : '#fff3cd', border: `4px solid ${passed ? '#27ae60' : '#f39c12'}` }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {passed ? (
              <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
            ) : (
              <EmojiEventsIcon sx={{ fontSize: 60, color: '#f39c12', mb: 1 }} />
            )}
            <Typography variant="h4" gutterBottom sx={{ color: '#1a252f', fontWeight: 'bold' }}>
              {passed ? 'Excellent Work!' : 'Good Effort!'}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 2 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: passed ? '#27ae60' : '#f39c12' }}>
                {score} / 12
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
              {passed ? 'You passed this task! Great spelling and explanations.' : 'Keep practicing your spelling and explanations.'}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!submitted && (
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: allAnswered
                ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
                : '#bdc3c7',
              '&:hover': {
                background: allAnswered
                  ? 'linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)'
                  : '#95a5a6'
              }
            }}
          >
            {allAnswered ? 'Submit All Answers' : 'Complete All Terms First'}
          </Button>
        )}
        {submitted && (
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)'
              }
            }}
          >
            Continue to Results
          </Button>
        )}
      </Box>
    </Box>
  )
}
