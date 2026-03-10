import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level B1 - Task C: Wordshake Quiz
 * Multiple choice questions on social media terms
 */

const QUESTIONS = [
  {
    question: 'What is a hashtag used for?',
    options: [
      'Make post seen by more people',
      'Delete a post',
      'Send a message'
    ],
    correct: 0
  },
  {
    question: 'What is a caption?',
    options: [
      'A photo filter',
      'Words under a photo',
      'A video clip'
    ],
    correct: 1
  },
  {
    question: 'What is an emoji for?',
    options: [
      'Show feeling or emotion',
      'Tag a person',
      'Share a link'
    ],
    correct: 0
  },
  {
    question: 'What does "tag" mean?',
    options: [
      'Delete a comment',
      'Mention a person with @',
      'Block someone'
    ],
    correct: 1
  },
  {
    question: 'What is a call-to-action?',
    options: [
      'A phone number',
      'Tell people to do something',
      'A video call'
    ],
    correct: 1
  },
  {
    question: 'How long does a story last?',
    options: [
      '1 hour',
      'Forever',
      '24 hours'
    ],
    correct: 2
  }
]

export default function Phase4_2Step3RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_b1' })
  const [selectedAnswers, setSelectedAnswers] = useState(Array(6).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const checkAnswer = (questionIndex) => {
    return selectedAnswers[questionIndex] === QUESTIONS[questionIndex].correct
  }

  const handleSubmit = () => {
    let correctCount = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === QUESTIONS[index].correct) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store score out of 6 total points
    sessionStorage.setItem('phase4_2_step3_b1_taskC', correctCount.toString())

    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'B1',
          task: 'C',
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
    navigate('/phase4_2/step/3/remedial/b1/taskD')
  }

  const allAnswered = selectedAnswers.every(answer => answer !== null)
  const passThreshold = 5

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task C: Wordshake Quiz
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Test your knowledge! Answer these questions about social media terms."
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Answer 6 multiple-choice questions about social media terms.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Each correct answer earns 1 point. You need {passThreshold}/6 to pass.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        {QUESTIONS.map((q, qIndex) => (
          <Card
            key={qIndex}
            elevation={2}
            sx={{
              mb: 2,
              border: showResults ? 2 : 0,
              borderColor: showResults
                ? (checkAnswer(qIndex) ? 'success.main' : 'error.main')
                : 'transparent'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Question {qIndex + 1}: {q.question}
              </Typography>
              <RadioGroup
                value={selectedAnswers[qIndex] !== null ? selectedAnswers[qIndex] : ''}
                onChange={(e) => handleAnswerChange(qIndex, parseInt(e.target.value))}
              >
                {q.options.map((option, oIndex) => (
                  <FormControlLabel
                    key={oIndex}
                    value={oIndex}
                    control={<Radio />}
                    label={option}
                    disabled={showResults}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: showResults && oIndex === q.correct
                          ? 'success.main'
                          : showResults && oIndex === selectedAnswers[qIndex] && oIndex !== q.correct
                            ? 'error.main'
                            : 'text.primary',
                        fontWeight: showResults && oIndex === q.correct ? 'bold' : 'normal'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
              {showResults && !checkAnswer(qIndex) && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Correct answer: {q.options[q.correct]}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {showResults && (
        <Alert severity={score >= passThreshold ? "success" : "warning"} sx={{ mb: 3 }}>
          {score >= passThreshold ? (
            <Typography>Excellent! You scored {score}/6 points!</Typography>
          ) : (
            <Typography>You got {score}/6 correct. You need at least {passThreshold}/6 to pass. Review the answers!</Typography>
          )}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Answers
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
            Continue to Task D
          </Button>
        )}
      </Box>
    </Box>
  )
}
