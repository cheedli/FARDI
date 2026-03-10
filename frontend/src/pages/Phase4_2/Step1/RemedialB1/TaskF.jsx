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
 * Phase 4.2 - Level B1 - Task F: Multiple Choice Grammar Quiz
 * 6 questions on subject-verb agreement
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'The social media influencer ___ many followers.',
    options: ['have', 'has', 'having', 'haves'],
    correct: 1,
    explanation: 'Use "has" with third-person singular (he/she/it/influencer)'
  },
  {
    id: 2,
    question: 'My friends ___ photos every day on Instagram.',
    options: ['posts', 'post', 'posting', 'posted'],
    correct: 1,
    explanation: 'Use "post" with plural subject (friends)'
  },
  {
    id: 3,
    question: 'Each post ___ a unique caption.',
    options: ['need', 'needs', 'needing', 'are needing'],
    correct: 1,
    explanation: 'Use "needs" with "each" (singular)'
  },
  {
    id: 4,
    question: 'The team ___ working on the campaign together.',
    options: ['is', 'are', 'be', 'am'],
    correct: 0,
    explanation: 'Use "is" when referring to team as a single unit'
  },
  {
    id: 5,
    question: 'Everyone in the group ___ to share the video.',
    options: ['want', 'wants', 'wanting', 'are wanting'],
    correct: 1,
    explanation: 'Use "wants" with "everyone" (singular)'
  },
  {
    id: 6,
    question: 'The hashtags we use ___ very important for reach.',
    options: ['is', 'was', 'are', 'be'],
    correct: 2,
    explanation: 'Use "are" with plural subject (hashtags)'
  }
]

export default function Phase4_2RemedialB1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 6, context: 'remedial_b1' })
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
    sessionStorage.setItem('phase4_2_remedial_b1_taskF_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskF_max', '10')

    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'B1',
          task: 'F',
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
    navigate('/phase4_2/step/1/remedial/b1/results')
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task F: Subject-Verb Agreement Quiz
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Choose the correct verb form for each sentence. Remember: subjects and verbs must agree in number!"
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Select the correct verb form to complete each sentence.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Each correct answer earns points.
        </Typography>
      </Paper>

      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'warning.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning.dark">
            Subject-Verb Agreement Rules:
          </Typography>
          <Typography variant="body2">
            <strong>Singular subjects</strong> take singular verbs (is, has, wants)
          </Typography>
          <Typography variant="body2">
            <strong>Plural subjects</strong> take plural verbs (are, have, want)
          </Typography>
          <Typography variant="body2">
            <strong>Special cases:</strong> "everyone", "each", "team" are usually singular
          </Typography>
        </CardContent>
      </Card>

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
                      Correct! {question.explanation}
                    </Alert>
                  ) : (
                    <Alert severity="error">
                      <Typography variant="body2" gutterBottom>
                        Incorrect. The correct answer is: <strong>{question.options[question.correct]}</strong>
                      </Typography>
                      <Typography variant="body2">{question.explanation}</Typography>
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
            <Typography>Perfect! You got all {QUESTIONS.length} questions correct!</Typography>
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
