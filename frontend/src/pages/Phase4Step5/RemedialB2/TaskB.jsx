import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level B2 - Task B: Analysis Odyssey
 * Correct 8 faulty sentences one by one for coherence/vocabulary
 * Gamified as "Analysis Odyssey" - Odyssey journey with corrections
 * Score: +1 per correctly corrected sentence (8 total)
 */

const SENTENCE_CORRECTIONS = [
  {
    id: 1,
    faulty: 'Poster with billboard is good but it not have slogan good.',
    correct: 'A poster with a billboard-style design is effective, but it often lacks a strong slogan.'
  },
  {
    id: 2,
    faulty: 'Video feature is viral but animation are bad sometime.',
    correct: 'The video feature goes viral easily, although the animation is sometimes poorly executed.'
  },
  {
    id: 3,
    faulty: 'Slogan use words catchy but it not clear always.',
    correct: 'The slogan uses catchy words, but it is not always clear to the audience.'
  },
  {
    id: 4,
    faulty: 'Layout in poster organize thing but color is too much bright.',
    correct: 'The layout in the poster organizes information well, even though the colors can be overly bright.'
  },
  {
    id: 5,
    faulty: 'Dramatisation in video make emotional but it too long and boring.',
    correct: 'Dramatisation in the video creates emotional impact, but it can become too long and feel boring.'
  },
  {
    id: 6,
    faulty: 'Jingle is song nice but not fit with video sometime.',
    correct: 'The jingle is a pleasant tune, but it does not always fit the video\'s mood.'
  },
  {
    id: 7,
    faulty: 'Clip show culture but it jump too fast and confuse.',
    correct: 'The clips show cultural elements, but they jump too fast and can confuse viewers.'
  },
  {
    id: 8,
    faulty: 'Overall promotion is ok but need improve for attract more people.',
    correct: 'Overall, the promotion is acceptable, but it needs improvement to attract more people.'
  }
]

export default function Phase4Step5RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_b2' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckSentence = async () => {
    const faultySentence = SENTENCE_CORRECTIONS[currentSentence].faulty
    const userAnswerTrimmed = userAnswer.trim()

    // Disable the check button while evaluating
    setFeedback({ type: 'info', message: 'Evaluating your correction...' })

    try {
      // Use LLM to evaluate B2-level corrections
      const response = await fetch('/api/phase4/step5/remedial/evaluate-expansion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          faultySentence: faultySentence,
          userAnswer: userAnswerTrimmed,
          sentenceIndex: currentSentence
        })
      })

      const data = await response.json()
      const pointsEarned = data.correct ? 1 : 0

      if (data.correct) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Excellent B2-level correction! Odyssey continues! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: data.feedback || 'Not quite B2 level. Focus on: articles (a/the), subject-verb agreement, advanced vocabulary, and connectors.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer('')
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b2_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)

    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback: Check basic B2 criteria if API fails
      const correctAnswer = SENTENCE_CORRECTIONS[currentSentence].correct
      const userLower = userAnswerTrimmed.toLowerCase()
      const correctLower = correctAnswer.toLowerCase()

      // Check if key B2 improvements were made
      const hasArticles = /\b(a|an|the)\b/.test(userLower)
      const hasAdvancedVocab = /(effective|pleasant|acceptable|poorly executed|organizes|creates)/i.test(userAnswerTrimmed)
      const hasProperLength = userAnswerTrimmed.split(/\s+/).length >= 8
      const hasFixes = userLower !== faultySentence.toLowerCase()

      const pointsEarned = (hasArticles && hasAdvancedVocab && hasProperLength && hasFixes) ? 1 : 0

      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Good B2-level improvement! Odyssey continues! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Remember to add articles (a/the), use advanced vocabulary (effective, pleasant), fix grammar, and create coherent sentences.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer('')
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b2_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: finalScore })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'B',
          score: finalScore,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 5] B2 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/b2/taskC')
  }

  const progress = ((currentSentence + 1) / SENTENCE_CORRECTIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Analysis Odyssey 📝
        </Typography>
        <Typography variant="body1">
          Journey through corrections! Rewrite faulty sentences with B2-level accuracy.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Analysis Odyssey! 📝 You have 8 faulty sentences to correct, one at a time. Your mission: completely rewrite each sentence with proper grammar, articles, advanced vocabulary, and coherent structure. Each correct B2-level sentence earns you 1 point!"
        />
      </Paper>

      {/* What to Fix Guide */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd', border: '2px solid #2196f3' }}>
        <Typography variant="h6" sx={{ color: '#0d47a1', fontWeight: 'bold' }} gutterBottom>
          📝 What to Fix:
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#01579b', fontWeight: 700 }}>
            <strong>Grammar:</strong> Subject-verb agreement (are→is, have→has), verb forms (organize→organizes)
          </Typography>
          <Typography variant="body2" sx={{ color: '#01579b', fontWeight: 700 }}>
            <strong>Articles:</strong> Add a/the (poster→a poster, video→the video)
          </Typography>
          <Typography variant="body2" sx={{ color: '#01579b', fontWeight: 700 }}>
            <strong>Spelling:</strong> sometime→sometimes, thing→information
          </Typography>
          <Typography variant="body2" sx={{ color: '#01579b', fontWeight: 700 }}>
            <strong>Vocabulary:</strong> Upgrade (good→effective, bad→poorly executed, ok→acceptable, nice→pleasant)
          </Typography>
          <Typography variant="body2" sx={{ color: '#01579b', fontWeight: 700 }}>
            <strong>Connectors:</strong> Use although, even though, but properly
          </Typography>
          <Typography variant="body2" sx={{ color: '#01579b', fontWeight: 700 }}>
            <strong>Coherence:</strong> Create logical flow between ideas
          </Typography>
        </Stack>
      </Paper>

      {/* Game Area */}
      {!gameCompleted && (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 3,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e1bee7',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)'
              }
            }}
          />

          {/* Sentence Counter */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Sentence ${currentSentence + 1} of ${SENTENCE_CORRECTIONS.length}`}
              sx={{ bgcolor: '#8e44ad', color: 'white', fontWeight: 'bold' }}
            />
            <Chip
              label={`Score: ${score}/${SENTENCE_CORRECTIONS.length}`}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* Faulty Sentence */}
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#ffebee', border: '2px solid #f44336' }}>
            <Typography variant="subtitle2" color="error.dark" fontWeight="bold" gutterBottom>
              ❌ Faulty Sentence (DO NOT copy - rewrite it!):
            </Typography>
            <Typography variant="h6" sx={{ color: '#c62828', fontFamily: 'monospace', mt: 1 }}>
              {SENTENCE_CORRECTIONS[currentSentence].faulty}
            </Typography>
          </Paper>

          {/* User Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#2e7d32' }}>
              ✏️ Your B2-level correction (fix grammar, add articles, upgrade vocabulary):
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rewrite the sentence with B2-level improvements..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              autoFocus
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem'
                }
              }}
            />
          </Box>

          {/* Feedback */}
          {feedback && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor:
                  feedback.type === 'success'
                    ? '#d4edda'
                    : feedback.type === 'info'
                    ? '#d1ecf1'
                    : '#f8d7da',
                border: `2px solid ${
                  feedback.type === 'success'
                    ? '#28a745'
                    : feedback.type === 'info'
                    ? '#17a2b8'
                    : '#dc3545'
                }`
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color:
                    feedback.type === 'success'
                      ? '#155724'
                      : feedback.type === 'info'
                      ? '#0c5460'
                      : '#721c24',
                  fontWeight: 'bold'
                }}
              >
                {feedback.message}
              </Typography>
            </Paper>
          )}

          {/* Check Button */}
          {!feedback && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckSentence}
              disabled={!userAnswer.trim() || userAnswer.trim().split(/\s+/).length < 5}
              startIcon={<CheckCircleIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7d3c98 0%, #1a252f 100%)'
                },
                py: 1.5
              }}
            >
              {userAnswer.trim().split(/\s+/).length < 5 ? 'Write at least 5 words' : 'Check Sentence'}
            </Button>
          )}
        </Paper>
      )}

      {/* Navigation after game completion */}
      {gameCompleted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              📝 Analysis Odyssey Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 8
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === 8 ? 'Perfect B2-level writing! All sentences corrected excellently!' : score >= 6 ? 'Great job! Strong B2-level improvements!' : 'Good effort! Keep practicing B2 writing skills!'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
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
              Next: Task C →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
