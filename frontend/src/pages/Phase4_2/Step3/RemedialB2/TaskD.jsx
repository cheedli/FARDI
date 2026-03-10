import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, Chip, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Task D: Spell Quest
 * Spelling and explanation challenge - spell 6 terms and explain them
 * Terms: hashtag—# for visibility, caption—Text description, emoji—Visual emotion,
 * tag—Mention people, call-to-action—Prompt action, viral—Rapid sharing
 * Inspired by British Council Sushi Spell
 * Score: 2 points per term (1 spell + 1 explain) = 12 total
 * Pass threshold: 9/12
 */

const TERMS = [
  { id: 1, word: 'hashtag', hint: '# symbol for visibility', expectedExplanation: 'visibility categorize search discover' },
  { id: 2, word: 'caption', hint: 'Text description', expectedExplanation: 'text describe context story tell' },
  { id: 3, word: 'emoji', hint: 'Visual emotion', expectedExplanation: 'visual emotion icon feeling express' },
  { id: 4, word: 'tag', hint: 'Mention people', expectedExplanation: 'mention people user network amplify' },
  { id: 5, word: 'call-to-action', hint: 'Prompt action', expectedExplanation: 'prompt action click conversion engage' },
  { id: 6, word: 'viral', hint: 'Rapid sharing', expectedExplanation: 'rapid spread share millions popular' }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_b2' })
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentSpelling, setCurrentSpelling] = useState('')
  const [currentExplanation, setCurrentExplanation] = useState('')
  const [gameFinished, setGameFinished] = useState(false)
  const [score, setScore] = useState(0)

  const currentTerm = TERMS[currentTermIndex]

  const handleSubmitTerm = () => {
    const spellingCorrect = currentSpelling.toLowerCase().trim() === currentTerm.word.toLowerCase()

    // Simple explanation check: does it contain at least 2 expected keywords?
    const explanationWords = currentExplanation.toLowerCase().split(/\s+/)
    const expectedWords = currentTerm.expectedExplanation.toLowerCase().split(/\s+/)
    const matchCount = expectedWords.filter(word => explanationWords.includes(word)).length
    const explanationCorrect = matchCount >= 2 && currentExplanation.trim().length >= 10

    const spellingScore = spellingCorrect ? 1 : 0
    const explanationScore = explanationCorrect ? 1 : 0

    const newAnswer = {
      termId: currentTerm.id,
      word: currentTerm.word,
      hint: currentTerm.hint,
      userSpelling: currentSpelling.trim(),
      userExplanation: currentExplanation.trim(),
      spellingScore,
      explanationScore,
      spellingCorrect,
      explanationCorrect
    }

    setUserAnswers([...userAnswers, newAnswer])
    setScore(score + spellingScore + explanationScore)

    // Move to next term or finish
    if (currentTermIndex < TERMS.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1)
      setCurrentSpelling('')
      setCurrentExplanation('')
    } else {
      finishGame(score + spellingScore + explanationScore)
    }
  }

  const finishGame = (finalScore) => {
    setGameFinished(true)
    sessionStorage.setItem('phase4_2_step3_b2_taskD', finalScore)

    // Log to backend
    fetch('/api/phase4/remedial/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase: '4.2',
        level: 'B2',
        task: 'D',
        step: 3,
        score: finalScore,
        max_score: 12,
        completed: true
      })
    }).catch(err => console.error('Log error:', err))
  }

  const handleContinue = () => {
    navigate('/phase4_2/step3/remedial/b2/results')
  }

  const canSubmit = currentSpelling.trim().length > 0 && currentExplanation.trim().length >= 10

  if (gameFinished) {
    const passed = score >= 9

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task D: Spell Quest - Results
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {passed ? 'Excellent Spelling!' : 'Keep Practicing!'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#9b59b6' }}>
                {score} / 12
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Pass threshold: 9/12
              </Typography>
            </Paper>
            {passed && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Great work!</strong> You've mastered both spelling and explaining social media terms!
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9b59b6' }} fontWeight="bold">
            Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {userAnswers.map((answer, index) => {
              const totalCorrect = answer.spellingCorrect && answer.explanationCorrect

              return (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: '4px solid',
                    borderColor: totalCorrect ? '#27ae60' : answer.spellingCorrect || answer.explanationCorrect ? '#f39c12' : '#e74c3c',
                    backgroundColor: totalCorrect ? '#d5f4e6' : answer.spellingCorrect || answer.explanationCorrect ? '#fff3cd' : '#fadbd8'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                      Term {index + 1}: {answer.word}
                    </Typography>
                    {totalCorrect ? (
                      <CheckCircleIcon sx={{ color: '#27ae60' }} />
                    ) : (
                      <CancelIcon sx={{ color: answer.spellingCorrect || answer.explanationCorrect ? '#f39c12' : '#e74c3c' }} />
                    )}
                    <Chip
                      label={`${answer.spellingScore + answer.explanationScore}/2 pts`}
                      sx={{
                        backgroundColor: totalCorrect ? '#27ae60' : '#f39c12',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Stack>

                  {/* Hint */}
                  <Box sx={{ mb: 2, p: 2, backgroundColor: '#fff3cd', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 600 }}>
                      Hint: {answer.hint}
                    </Typography>
                  </Box>

                  {/* Spelling Result */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                      Spelling: {answer.spellingCorrect ? 'Correct (+1)' : 'Incorrect (+0)'}
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        You spelled: <strong>{answer.userSpelling || '(no answer)'}</strong>
                      </Typography>
                      {!answer.spellingCorrect && (
                        <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 500, mt: 1 }}>
                          Correct spelling: <strong>{answer.word}</strong>
                        </Typography>
                      )}
                    </Paper>
                  </Box>

                  {/* Explanation Result */}
                  <Box>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                      Explanation: {answer.explanationCorrect ? 'Good (+1)' : 'Needs improvement (+0)'}
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#2c3e50', fontWeight: 500 }}>
                        "{answer.userExplanation || '(no explanation provided)'}"
                      </Typography>
                    </Paper>
                  </Box>
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
            Continue to Results
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task D: Spell Quest
        </Typography>
        <Typography variant="body1">
          Spell words and explain them! Inspired by British Council Sushi Spell.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to Spell Quest! For each term, you'll see a hint. Type the correct spelling, then write a brief explanation of what it means. Each term is worth 2 points: 1 for spelling + 1 for explanation. Total: 12 points!"
        />
      </Paper>

      {/* Progress */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: '#9b59b6', fontWeight: 'bold' }}>
            Term {currentTermIndex + 1} of {TERMS.length}
          </Typography>
          <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
            Score: {score} / 12
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(currentTermIndex / TERMS.length) * 100}
          sx={{
            height: 10,
            borderRadius: 1,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#9b59b6'
            }
          }}
        />
      </Paper>

      {/* Current Term */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#fff3e0', border: '4px solid #e67e22' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold', textAlign: 'center' }}>
          Hint: {currentTerm.hint}
        </Typography>
      </Paper>

      {/* Spelling Input */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #9b59b6' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          1. Spell the word:
        </Typography>
        <TextField
          fullWidth
          value={currentSpelling}
          onChange={(e) => setCurrentSpelling(e.target.value)}
          placeholder="Type the correct spelling..."
          variant="outlined"
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
                fontWeight: 600,
                fontSize: '1.2rem'
              }
            }
          }}
        />
      </Paper>

      {/* Explanation Input */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #27ae60' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          2. Explain what it means:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={currentExplanation}
          onChange={(e) => setCurrentExplanation(e.target.value)}
          placeholder="Write a brief explanation of what this term means in social media context..."
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#27ae60',
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: '#229954'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#229954'
              },
              '& textarea': {
                color: '#1a252f',
                fontWeight: 500,
                fontSize: '1.05rem'
              }
            }
          }}
        />
        <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 600 }}>
          Characters: {currentExplanation.length} / 10+ (minimum)
        </Typography>
      </Paper>

      {/* Submit Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmitTerm}
          disabled={!canSubmit}
          sx={{
            py: 2,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: canSubmit
              ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
              : '#bdc3c7',
            '&:hover': {
              background: canSubmit
                ? 'linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)'
                : '#95a5a6'
            }
          }}
        >
          {currentTermIndex < TERMS.length - 1 ? 'Submit & Next Term' : 'Submit & See Results'}
        </Button>
      </Box>

      {/* Link Reference */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#e8f5e9', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#2c3e50', fontStyle: 'italic' }}>
          Inspired by British Council Sushi Spell game format
        </Typography>
      </Paper>
    </Box>
  )
}
