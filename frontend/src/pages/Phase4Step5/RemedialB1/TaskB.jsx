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
 * Phase 4 Step 5 - Level B1 - Task B: Definition Duel
 * Correct 8 faulty sentences for coherence/vocabulary
 * Gamified as "Definition Duel" - Duel with corrections for wins
 * Score: +1 per correctly corrected sentence (8 total)
 */

const SENTENCE_CORRECTIONS = [
  { id: 1, faulty: 'Gatefold are fold.', correct: 'Gatefold is fold for space.' },
  { id: 2, faulty: 'Lettering is text on poster but not bold.', correct: 'Lettering is bold text on poster.' },
  { id: 3, faulty: 'Animation is move picture in video.', correct: 'Animation is moving pictures in video.' },
  { id: 4, faulty: 'Jingle is song and catchy.', correct: 'Jingle is a catchy song.' },
  { id: 5, faulty: 'Dramatisation is story act.', correct: 'Dramatisation is acting out a story.' },
  { id: 6, faulty: 'Sketch is plan draw.', correct: 'Sketch is a plan drawing.' },
  { id: 7, faulty: 'Clip is short part.', correct: 'Clip is a short part of video.' },
  { id: 8, faulty: 'Storytelling is tell story.', correct: 'Storytelling is telling a story.' }
]

export default function Phase4Step5RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_b1' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState(SENTENCE_CORRECTIONS[0].faulty)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckSentence = async () => {
    const faultySentence = SENTENCE_CORRECTIONS[currentSentence].faulty
    const userAnswerTrimmed = userAnswer.trim()

    // Disable the check button while evaluating
    setFeedback({ type: 'info', message: 'Evaluating...' })

    try {
      // Use LLM to evaluate coherence and vocabulary improvements
      const response = await fetch('/api/phase4/step5/remedial/evaluate-expansion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
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
          message: `Excellent correction! Duel won! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: data.feedback || 'Not quite. Try to improve grammar, add articles, and use better vocabulary.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer(SENTENCE_CORRECTIONS[nextIndex].faulty)
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b1_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)

    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback: Check basic criteria if API fails
      const correctAnswer = SENTENCE_CORRECTIONS[currentSentence].correct
      const userLower = userAnswerTrimmed.toLowerCase()
      const correctLower = correctAnswer.toLowerCase()

      // Check if significant improvements were made (word count increase, different structure)
      const faultyWords = faultySentence.split(/\s+/).length
      const userWords = userAnswerTrimmed.split(/\s+/).length
      const hasImprovement = userWords > faultyWords && userLower !== faultySentence.toLowerCase()

      const pointsEarned = hasImprovement ? 1 : 0

      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Good improvement! Duel won! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Remember to improve grammar, add articles (a/the), and expand the sentence for better coherence.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer(SENTENCE_CORRECTIONS[nextIndex].faulty)
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b1_taskB_score', finalScore)
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
          level: 'B1',
          task: 'B',
          score: finalScore,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 5] B1 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/b1/taskC')
  }

  const progress = ((currentSentence + 1) / SENTENCE_CORRECTIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task B: Definition Duel ⚔️
        </Typography>
        <Typography variant="body1">
          Duel with corrections for wins! Fix faulty sentences for better coherence and vocabulary.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Definition Duel! ⚔️ You have 8 faulty sentences that need correction. Improve each sentence by fixing grammar, adding articles (a, the), and using better vocabulary. Each correct improvement earns you 1 point and brings you closer to winning the duel!"
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
              backgroundColor: '#bbdefb',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)'
              }
            }}
          />

          {/* Sentence Counter */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Sentence ${currentSentence + 1} of ${SENTENCE_CORRECTIONS.length}`}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              label={`Score: ${score}/${SENTENCE_CORRECTIONS.length}`}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* User Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              ✏️ Improve the sentence below (fix grammar, add articles, use better vocabulary):
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Edit and improve the sentence..."
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
                background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
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
              ⚔️ Duel Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 8
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === 8 ? 'Perfect victory! All sentences corrected!' : 'Good work on improving the sentences!'}
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
              Next: Task C (Wordshake Quiz) →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
