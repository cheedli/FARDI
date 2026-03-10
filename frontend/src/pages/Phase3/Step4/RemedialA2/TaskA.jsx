import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Level A2 - Task A: Sentence-guided Pitch
 * Complete sponsor pitch sentences using "because" or "so"
 */

const SENTENCE_STARTERS = [
  {
    id: 1,
    prompt: "We need a sponsor because...",
    hint: "Why do you need a sponsor? (e.g., costs are high, we need money)",
    keywords: ['cost', 'money', 'expensive', 'need', 'high', 'budget']
  },
  {
    id: 2,
    prompt: "The festival is important because...",
    hint: "Why is the festival important? (e.g., celebrates culture, brings students together)",
    keywords: ['culture', 'student', 'celebrate', 'important', 'learn', 'diversity']
  },
  {
    id: 3,
    prompt: "Your company will benefit because...",
    hint: "How will the sponsor benefit? (e.g., logo on posters, good image)",
    keywords: ['logo', 'poster', 'visibility', 'image', 'brand', 'promotion', 'see']
  },
  {
    id: 4,
    prompt: "We have many costs, so...",
    hint: "What is the result of having many costs? (e.g., we need funding, we ask for help)",
    keywords: ['need', 'funding', 'sponsor', 'help', 'support', 'money']
  },
  {
    id: 5,
    prompt: "Students will see your logo, so...",
    hint: "What is the result of students seeing the logo? (e.g., they know your company, good for your brand)",
    keywords: ['know', 'company', 'brand', 'good', 'remember', 'visibility']
  }
]

export default function Phase3Step4RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value
    })
  }

  const handleSubmit = async () => {
    // Evaluate each answer
    const evals = {}
    let totalScore = 0

    SENTENCE_STARTERS.forEach(sentence => {
      const answer = answers[sentence.id]?.trim() || ''
      const answerLower = answer.toLowerCase()

      // Check if answer has reasonable length and contains at least one keyword
      const hasLength = answer.length >= 5
      const hasKeyword = sentence.keywords.some(keyword => answerLower.includes(keyword))
      const isCorrect = hasLength && (hasKeyword || answer.length >= 10)

      evals[sentence.id] = {
        correct: isCorrect,
        feedback: isCorrect
          ? "Good! Your sentence makes sense."
          : "Try to complete the sentence with a logical reason or result."
      }

      if (isCorrect) totalScore++
    })

    setEvaluation(evals)
    setShowResults(true)

    // Log to backend
    logTaskCompletion(totalScore, SENTENCE_STARTERS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: 0,
          step: 4
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const allAnswered = SENTENCE_STARTERS.every(s => answers[s.id]?.trim()?.length >= 5)
  const score = Object.values(evaluation).filter(e => e.correct).length
  const passThreshold = 4 // 4/5 to pass

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task A: Sentence-guided Pitch
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Let's practice writing sponsor pitch sentences! Complete each sentence using 'because' or 'so'. Think about why you need a sponsor and what they will gain."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Complete each sentence to create a sponsor pitch.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Use "because" to explain a reason
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Use "so" to show a result
        </Typography>
        <Typography variant="body2">
          <strong>Passing score:</strong> Minimum 4/5 sentences completed logically
        </Typography>
      </Paper>

      {/* Sentence Completion */}
      <Box sx={{ mb: 4 }}>
        {SENTENCE_STARTERS.map((sentence, index) => (
          <Card key={sentence.id} elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Sentence {index + 1}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Complete the sentence:
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000' }}>
                    {sentence.prompt}
                  </Typography>
                </Paper>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder={sentence.hint}
                value={answers[sentence.id] || ''}
                onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                disabled={showResults}
                sx={{
                  mb: 1,
                  backgroundColor: showResults
                    ? evaluation[sentence.id]?.correct
                      ? 'success.lighter'
                      : 'warning.lighter'
                    : 'white',
                  '& .MuiInputBase-input': {
                    color: '#000'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#666',
                    opacity: 1
                  }
                }}
              />

              <Typography variant="caption" color="text.secondary">
                💡 Hint: {sentence.hint}
              </Typography>

              {/* Show results */}
              {showResults && evaluation[sentence.id] && (
                <Alert severity={evaluation[sentence.id].correct ? "success" : "warning"} sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {evaluation[sentence.id].feedback}
                  </Typography>
                  {answers[sentence.id] && (
                    <Paper sx={{ p: 1.5, mt: 1, backgroundColor: 'rgba(255,255,255,0.7)' }}>
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        <strong>Your complete sentence:</strong><br />
                        {sentence.prompt} {answers[sentence.id]}
                      </Typography>
                    </Paper>
                  )}
                  {!answers[sentence.id] && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      (No answer provided)
                    </Typography>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert
          severity={score >= passThreshold ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Task Complete!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{SENTENCE_STARTERS.length}
          </Typography>
          <Typography>
            {score === SENTENCE_STARTERS.length
              ? "Perfect! All sentences completed well!"
              : score >= passThreshold
                ? `Great job! You passed with ${score} correct sentences.`
                : `You need ${passThreshold} correct sentences to pass. Review your answers and try again if needed.`}
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
            Submit Sentences
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
            Complete A2 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
