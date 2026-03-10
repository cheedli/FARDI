import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  MenuItem,
  Select,
  FormControl
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level A2 - Task B: Fill Quest
 * Fill in 8 sentences with social media terms (Gap Fill)
 * Gamified as "Fill Quest" - progress through levels
 */

const WORD_BANK = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action', 'post', 'story', 'like']

const SENTENCES = [
  {
    id: 1,
    text: 'Use ___ #Festival to find posts.',
    answer: 'hashtag',
    level: 'Level 1'
  },
  {
    id: 2,
    text: 'Write a good ___ under your photo.',
    answer: 'caption',
    level: 'Level 2'
  },
  {
    id: 3,
    text: 'Add a happy ___ to show your feeling.',
    answer: 'emoji',
    level: 'Level 3'
  },
  {
    id: 4,
    text: '___ your friend with @ symbol.',
    answer: 'tag',
    level: 'Level 4'
  },
  {
    id: 5,
    text: 'Use a ___ like "Click here!" to get action.',
    answer: 'call-to-action',
    level: 'Level 5'
  },
  {
    id: 6,
    text: 'Make a ___ with picture and text.',
    answer: 'post',
    level: 'Level 6'
  },
  {
    id: 7,
    text: 'Watch my ___ - it disappears in 24 hours!',
    answer: 'story',
    level: 'Level 7'
  },
  {
    id: 8,
    text: 'Click the ___ button to show you love it.',
    answer: 'like',
    level: 'Level 8'
  }
]

export default function Phase4_2Step3RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value.toLowerCase().trim()
    })
  }

  const handleSubmit = () => {
    let correctCount = 0

    SENTENCES.forEach(sentence => {
      if (answers[sentence.id] === sentence.answer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store score (8 correct = full score)
    sessionStorage.setItem('phase4_2_step3_a2_taskB', correctCount.toString())

    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'A2',
          task: 'B',
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
    navigate('/phase4_2/step/3/remedial/a2/taskC')
  }

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())
  const completedLevels = SENTENCES.filter((s, idx) =>
    answers[s.id]?.trim()
  ).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task B: Fill Quest
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Lilia"
          message="Welcome to Fill Quest! Complete each level by filling in the blanks with the correct social media terms. Finish all 8 levels to complete your quest!"
        />
      </Paper>

      {/* Quest Progress */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary">
            Quest Progress: {completedLevels}/8 Levels
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {SENTENCES.map((s, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: answers[s.id]?.trim() ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}
              >
                {idx + 1}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Complete each sentence by selecting or typing the correct word from the word bank.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Scoring:</strong> 1 point per correct answer (Pass: 6/8)
        </Typography>
      </Paper>

      {/* Word Bank */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            📚 Word Bank:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {WORD_BANK.map((word, index) => (
              <Chip
                key={index}
                label={word}
                color="success"
                variant="outlined"
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Quest Levels (Sentences) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SENTENCES.map((sentence, index) => {
          const isCorrect = answers[sentence.id] === sentence.answer
          const isAnswered = answers[sentence.id]

          return (
            <Grid item xs={12} key={sentence.id}>
              <Card
                elevation={2}
                sx={{
                  backgroundColor: showResults
                    ? (isCorrect ? 'success.lighter' : 'error.lighter')
                    : isAnswered ? 'info.lighter' : 'white',
                  border: 2,
                  borderColor: showResults
                    ? (isCorrect ? 'success.main' : 'error.main')
                    : isAnswered ? 'info.main' : 'grey.300'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={sentence.level}
                      color={isAnswered ? 'primary' : 'default'}
                      sx={{ fontWeight: 'bold' }}
                    />
                    {showResults && isCorrect && (
                      <CheckCircleIcon sx={{ color: 'success.main' }} />
                    )}
                  </Box>

                  <Typography variant="h6" color="primary" gutterBottom>
                    {sentence.text.replace('___', '______')}
                  </Typography>

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Select
                      value={answers[sentence.id] || ''}
                      onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                      disabled={showResults}
                      displayEmpty
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select a word...</em>
                      </MenuItem>
                      {WORD_BANK.map((word, idx) => (
                        <MenuItem key={idx} value={word}>
                          {word}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {showResults && (
                    <Alert
                      severity={isCorrect ? 'success' : 'error'}
                      icon={isCorrect ? <CheckCircleIcon /> : undefined}
                      sx={{ mt: 2 }}
                    >
                      {isCorrect ? (
                        <Typography>
                          ✅ Correct! <strong>{sentence.level}</strong> completed!
                        </Typography>
                      ) : (
                        <Typography>
                          Your answer: <strong>{answers[sentence.id] || '(empty)'}</strong> |
                          Correct answer: <strong>{sentence.answer}</strong>
                        </Typography>
                      )}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Results */}
      {showResults && (
        <Alert
          severity={score >= 6 ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            {score >= 6 ? '🎉 Quest Complete!' : 'Quest Incomplete'}
          </Typography>
          <Typography>
            Levels Completed: <strong>{score}/{SENTENCES.length}</strong>
          </Typography>
          <Typography>
            {score >= 6
              ? 'Congratulations! You have mastered the Fill Quest!'
              : 'You need at least 6/8 correct. Review the word meanings and try again!'}
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
            disabled={!allAnswered}
          >
            Complete Quest
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
            Continue to Task C
          </Button>
        )}
      </Box>
    </Box>
  )
}
