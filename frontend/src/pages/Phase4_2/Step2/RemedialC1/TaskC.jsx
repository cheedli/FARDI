import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
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
 * Phase 4.2 Step 2 - Level C1 - Task C: Advanced Quiz
 * 6 questions with detailed answers and justifications
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary purpose of using hashtags in Instagram posts?',
    options: [
      'To make posts look professional',
      'To increase discoverability and reach new audiences',
      'To show trending topics',
      'To categorize personal content'
    ],
    correct: 'To increase discoverability and reach new audiences'
  },
  {
    id: 2,
    question: 'Which element of a caption is most effective for driving engagement?',
    options: [
      'Length of the caption',
      'Use of technical jargon',
      'Compelling storytelling and emotional connection',
      'Number of emojis used'
    ],
    correct: 'Compelling storytelling and emotional connection'
  },
  {
    id: 3,
    question: 'Why are emojis considered powerful in social media communication?',
    options: [
      'They reduce character count',
      'They convey emotion and enhance visual appeal',
      'They are required by Instagram',
      'They replace the need for captions'
    ],
    correct: 'They convey emotion and enhance visual appeal'
  },
  {
    id: 4,
    question: 'What makes a call-to-action (CTA) effective in Instagram posts?',
    options: [
      'Using ALL CAPS for emphasis',
      'Being vague to create curiosity',
      'Being clear, specific, and action-oriented',
      'Placing it at the beginning of the caption'
    ],
    correct: 'Being clear, specific, and action-oriented'
  },
  {
    id: 5,
    question: 'How does tagging users in posts contribute to engagement?',
    options: [
      'It automatically increases follower count',
      'It notifies tagged users and expands reach to their networks',
      'It improves post quality',
      'It reduces spam detection'
    ],
    correct: 'It notifies tagged users and expands reach to their networks'
  },
  {
    id: 6,
    question: 'Which metric best indicates true audience engagement beyond vanity metrics?',
    options: [
      'Number of followers',
      'Post impressions',
      'Comment quality and conversation depth',
      'Profile visits'
    ],
    correct: 'Comment quality and conversation depth'
  }
]

export default function Phase4_2Step2RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleJustificationChange = (questionId, text) => {
    setJustifications({ ...justifications, [questionId]: text })
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Calculate normalized score (out of 10)
    const normalizedScore = (correctCount / QUESTIONS.length) * 10

    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskC_score', normalizedScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskC_max', '10')

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
          level: 'C1',
          task: 'C',
          score: score,
          max_score: maxScore,
          answers: answers,
          justifications: justifications
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/2/remedial/c1/taskD')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id])
  const allJustified = QUESTIONS.every(q => justifications[q.id] && justifications[q.id].trim().length > 20)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task C: Advanced Quiz with Justifications
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Answer these advanced questions about Instagram post strategies. For each question, select the best answer AND write a justification explaining your reasoning using sophisticated terminology."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Answer all 6 questions and provide justifications for each answer (minimum 20 words per justification).
        </Typography>
      </Paper>

      {/* Questions */}
      <Box sx={{ mb: 4 }}>
        {QUESTIONS.map((q, index) => (
          <Card key={q.id} elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Question {index + 1} of {QUESTIONS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {q.question}
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                <RadioGroup
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                >
                  {q.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={showResults}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: showResults && answers[q.id] === option
                          ? (option === q.correct ? 'success.lighter' : 'error.lighter')
                          : 'transparent'
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Justify your answer (minimum 20 words):
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={justifications[q.id] || ''}
                onChange={(e) => handleJustificationChange(q.id, e.target.value)}
                placeholder="Explain why you chose this answer using specific examples and terminology..."
                variant="outlined"
                disabled={showResults}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Words: {justifications[q.id]?.trim().split(/\s+/).filter(w => w.length > 0).length || 0}
              </Typography>

              {showResults && (
                <Alert severity={answers[q.id] === q.correct ? "success" : "error"} sx={{ mt: 2 }}>
                  {answers[q.id] === q.correct ? (
                    <Typography>✓ Correct! {q.correct}</Typography>
                  ) : (
                    <Typography>✗ Incorrect. Correct answer: {q.correct}</Typography>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity={score >= 5 ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quiz Complete!
          </Typography>
          <Typography>
            You scored {score}/{QUESTIONS.length} ({((score / QUESTIONS.length) * 100).toFixed(0)}%)
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
            disabled={!allAnswered || !allJustified}
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
          Please answer all questions before submitting
        </Typography>
      )}
      {!showResults && allAnswered && !allJustified && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          Please provide justifications for all questions (minimum 20 words each)
        </Typography>
      )}
    </Box>
  )
}
