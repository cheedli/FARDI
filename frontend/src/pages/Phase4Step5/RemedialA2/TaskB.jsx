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
 * Phase 4 Step 5 - Level A2 - Task B: Sentence Expansion
 * Expand and correct 8 faulty sentences
 * Gamified as "Expand Empire" - Students edit sentences to fix spelling and add details
 * Score: +1 per correctly expanded sentence (8 total)
 */

const SENTENCE_EXPANSIONS = [
  { id: 1, faulty: 'Poster gatfold is.', correct: 'Poster gatefold is fold.' },
  { id: 2, faulty: 'Lettering is text.', correct: 'Lettering is text on poster.' },
  { id: 3, faulty: 'Animation is move.', correct: 'Animation is move in video.' },
  { id: 4, faulty: 'Jingle is song.', correct: 'Jingle is song in video.' },
  { id: 5, faulty: 'Dramatisation is story.', correct: 'Dramatisation is story act.' },
  { id: 6, faulty: 'Sketch is plan.', correct: 'Sketch is plan draw.' },
  { id: 7, faulty: 'Clip is short.', correct: 'Clip is short part.' },
  { id: 8, faulty: 'Storytelling is tell.', correct: 'Storytelling is tell story.' }
]

export default function Phase4Step5RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_a2' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState(SENTENCE_EXPANSIONS[0].faulty)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckSentence = async () => {
    const faultySentence = SENTENCE_EXPANSIONS[currentSentence].faulty
    const userAnswerTrimmed = userAnswer.trim()

    // Disable the check button while evaluating
    setFeedback({ type: 'info', message: 'Evaluating...' })

    try {
      // Use LLM to evaluate both spelling correction AND expansion
      const response = await fetch('/api/phase4/step5/remedial/evaluate-expansion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
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
          message: `Perfect! Empire expanded! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: data.feedback || 'Not quite. Try to fix spelling and add more details.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_EXPANSIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer(SENTENCE_EXPANSIONS[nextIndex].faulty)
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_a2_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)

    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback: Check basic criteria if API fails
      const userLower = userAnswerTrimmed.toLowerCase()
      const faultyLower = faultySentence.toLowerCase()

      // Check if spelling was fixed (e.g., gatfold → gatefold)
      const hasSpellingFix = !userLower.includes('gatfold') || userLower.includes('gatefold')

      // Check if sentence was expanded (more words than original)
      const faultyWords = faultySentence.split(/\s+/).length
      const userWords = userAnswerTrimmed.split(/\s+/).length
      const isExpanded = userWords > faultyWords

      const pointsEarned = (hasSpellingFix && isExpanded) ? 1 : 0

      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Good! Empire expanded! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Remember to fix spelling AND add details to expand the sentence.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_EXPANSIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer(SENTENCE_EXPANSIONS[nextIndex].faulty)
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_a2_taskB_score', finalScore)
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
          level: 'A2',
          task: 'B',
          score: finalScore,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 5] A2 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/a2/taskC')
  }

  const progress = ((currentSentence + 1) / SENTENCE_EXPANSIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task B: Expand Empire 🏰
        </Typography>
        <Typography variant="body1">
          Expand and correct sentences to build your empire!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Expand Empire! 🏰 Build your knowledge empire by expanding and correcting simple sentences. Fix the spelling mistakes and add the missing details to complete each sentence!"
        />
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          />

          {/* Sentence Counter */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Sentence ${currentSentence + 1} of ${SENTENCE_EXPANSIONS.length}`}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              label={`Score: ${score}/${SENTENCE_EXPANSIONS.length}`}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* User Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              ✏️ Fix spelling and expand the sentence below:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Fix spelling and add details..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  fontFamily: 'monospace'
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
              disabled={!userAnswer.trim()}
              startIcon={<CheckCircleIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                },
                py: 1.5
              }}
            >
              Check Sentence
            </Button>
          )}
        </Paper>
      )}

      {/* Navigation after game completion */}
      {gameCompleted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              🏰 Empire Expanded!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 8
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              You've expanded your empire! Let's continue to the final challenge.
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
              Next: Task C (Connector Quest) →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
