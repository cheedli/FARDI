import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level B1 - Task C: Wordshake Quiz
 * 6 multiple-choice questions on social media concepts
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'What is the main purpose of using a hashtag in a social media post?',
    options: [
      'To make the post viral',
      'To categorize content and make it searchable',
      'To add color to the post',
      'To tag friends'
    ],
    correct: 1
  },
  {
    id: 2,
    question: 'What does a good caption do for a social media post?',
    options: [
      'It replaces the image',
      'It provides context and engages the audience',
      'It deletes the post automatically',
      'It blocks comments'
    ],
    correct: 1
  },
  {
    id: 3,
    question: 'Why do people use emojis in social media posts?',
    options: [
      'To replace all words',
      'To make posts longer',
      'To express emotions and make posts more friendly',
      'To hide the message'
    ],
    correct: 2
  },
  {
    id: 4,
    question: 'When you tag someone in a post, what happens?',
    options: [
      'They receive a notification and can see the post',
      'They get blocked from your account',
      'The post is automatically deleted',
      'Your account becomes private'
    ],
    correct: 0
  },
  {
    id: 5,
    question: 'What is a call-to-action (CTA) in a social media post?',
    options: [
      'A way to delete comments',
      'An instruction asking the audience to do something specific',
      'A type of hashtag',
      'A filter for photos'
    ],
    correct: 1
  },
  {
    id: 6,
    question: 'What does it mean when a post "goes viral"?',
    options: [
      'The post gets deleted',
      'The post spreads rapidly and reaches many people',
      'The post becomes private',
      'The post gets reported'
    ],
    correct: 1
  }
]

export default function Phase4_2Step2RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    })
  }

  const handleSubmit = () => {
    let correctCount = 0
    QUESTIONS.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    const scoreOutOf10 = (correctCount / QUESTIONS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskC_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskC_max', '10')

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
          step: 2,
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
    navigate('/phase4_2/step/2/remedial/b1/results')
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task C: Wordshake Quiz
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Test your understanding of social media concepts! Choose the best answer for each question."
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Answer all 6 multiple-choice questions about social media.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Each correct answer earns points.
        </Typography>
      </Paper>

      <Box sx={{ mb: 3 }}>
        {QUESTIONS.map((question, index) => (
          <Card key={question.id} elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Question {index + 1}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {question.question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[question.id] !== undefined ? answers[question.id] : ''}
                  onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      value={optionIndex}
                      control={<Radio disabled={showResults} />}
                      label={option}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: showResults
                          ? (optionIndex === question.correct
                            ? 'success.lighter'
                            : (answers[question.id] === optionIndex
                              ? 'error.lighter'
                              : 'transparent'))
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: showResults ? undefined : 'action.hover'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {showResults && (
                <>
                  <Divider sx={{ my: 2 }} />
                  {answers[question.id] === question.correct ? (
                    <Alert severity="success">
                      Correct! {question.options[question.correct]}
                    </Alert>
                  ) : (
                    <Alert severity="error">
                      Incorrect. The correct answer is: {question.options[question.correct]}
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {showResults && (
        <Alert severity={score === QUESTIONS.length ? "success" : "info"} sx={{ mb: 3 }}>
          {score === QUESTIONS.length ? (
            <Typography>Perfect score! You got all {QUESTIONS.length} questions correct!</Typography>
          ) : (
            <Typography>
              You got {score}/{QUESTIONS.length} correct ({((score / QUESTIONS.length) * 100).toFixed(0)}%).
            </Typography>
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
            View Results
          </Button>
        )}
      </Box>
    </Box>
  )
}
