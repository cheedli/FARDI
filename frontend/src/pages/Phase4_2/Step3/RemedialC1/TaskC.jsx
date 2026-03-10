import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task C: Quizlet Live (Advanced Quiz)
 * Create and answer quiz on 6 sophisticated social media terms
 */

const TERMS = [
  {
    id: 1,
    term: 'Hashtag',
    question: 'What is the primary function of hashtags in social media?',
    correctAnswer: 'Discoverability amplifier'
  },
  {
    id: 2,
    term: 'Caption',
    question: 'What is the core purpose of post captions?',
    correctAnswer: 'Narrative engagement'
  },
  {
    id: 3,
    term: 'Emoji',
    question: 'What role do emojis play in digital communication?',
    correctAnswer: 'Emotional cue'
  },
  {
    id: 4,
    term: 'Call-to-Action (CTA)',
    question: 'How does a call-to-action function in social media posts?',
    correctAnswer: 'Behavioral trigger'
  },
  {
    id: 5,
    term: 'Tagging',
    question: 'What is the primary benefit of user tagging?',
    correctAnswer: 'Network expansion'
  },
  {
    id: 6,
    term: 'Viral Content',
    question: 'What best describes the dynamic of viral content?',
    correctAnswer: 'Organic amplification'
  }
]

export default function Phase4_2Step3RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, text) => {
    setAnswers({ ...answers, [id]: text })
  }

  const calculateScore = () => {
    let correctCount = 0
    TERMS.forEach(term => {
      const userAnswer = (answers[term.id] || '').toLowerCase().trim()
      const correctAnswer = term.correctAnswer.toLowerCase().trim()

      // Check if answer contains key concepts
      const isCorrect = userAnswer.includes(correctAnswer) ||
                       userAnswer.includes(correctAnswer.replace(' ', ''))

      if (isCorrect) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = () => {
    const correctCount = calculateScore()
    setScore(correctCount)
    setShowResults(true)

    sessionStorage.setItem('phase4_2_step3_c1_taskC_score', correctCount)

    logTaskCompletion(correctCount, TERMS.length)
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
          level: 'C1',
          task: 'C',
          score: score,
          max_score: maxScore,
          answers: answers
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/taskD')
  }

  const allAnswered = TERMS.every(term => {
    const answer = answers[term.id] || ''
    return answer.trim().split(/\s+/).filter(w => w.length > 0).length >= 2
  })

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task C: Quizlet Live
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Create and answer a sophisticated quiz on 6 social media terms. Provide detailed, precise answers that demonstrate your C1-level understanding of these concepts. Use professional terminology and avoid simplistic definitions."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Answer each question with detailed, precise responses (minimum 2-3 words each). Focus on the functional role or core purpose of each element.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Expected answers:</strong> Discoverability amplifier, Narrative engagement, Emotional cue, Behavioral trigger, Network expansion, Organic amplification.
        </Typography>
      </Paper>

      {/* Quiz Questions */}
      <Box sx={{ mb: 4 }}>
        {TERMS.map((term, index) => {
          const wordCount = (answers[term.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
          const userAnswer = (answers[term.id] || '').toLowerCase().trim()
          const isCorrect = showResults && (
            userAnswer.includes(term.correctAnswer.toLowerCase()) ||
            userAnswer.includes(term.correctAnswer.toLowerCase().replace(' ', ''))
          )

          return (
            <Card key={term.id} elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Question {index + 1} of {TERMS.length}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'primary.lighter' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Term: {term.term}
                  </Typography>
                  <Typography variant="body1">
                    {term.question}
                  </Typography>
                </Paper>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={answers[term.id] || ''}
                  onChange={(e) => handleAnswerChange(term.id, e.target.value)}
                  placeholder="Provide a detailed, precise answer using professional terminology..."
                  variant="outlined"
                  disabled={showResults}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="caption"
                  color={wordCount >= 2 ? "success.main" : "text.secondary"}
                  sx={{ fontWeight: wordCount >= 2 ? 'bold' : 'normal' }}
                >
                  Words: {wordCount} {wordCount >= 2 && '✓'}
                </Typography>

                {showResults && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Alert severity={isCorrect ? "success" : "info"}>
                      <Typography variant="subtitle2" gutterBottom>
                        {isCorrect ? '✓ Correct!' : 'Expected Answer:'}
                      </Typography>
                      <Typography variant="body2">
                        {term.correctAnswer}
                      </Typography>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity={score >= 5 ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quiz Complete!
          </Typography>
          <Typography>
            You scored {score}/{TERMS.length} ({((score / TERMS.length) * 100).toFixed(0)}%)
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {score >= 5 ? 'Excellent understanding of sophisticated social media terminology!' : 'Review the correct answers and refine your understanding of these concepts.'}
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
            Submit Quiz
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

      {!showResults && !allAnswered && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          Please answer all questions (minimum 2 words each)
        </Typography>
      )}
    </Box>
  )
}
