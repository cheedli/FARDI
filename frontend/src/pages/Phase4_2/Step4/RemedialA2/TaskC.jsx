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
  CircularProgress
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level A2 - Task C: Sentence Builder
 * Write 6 simple sentences for social media posts
 * Client-side evaluation with basic grammar checks
 */

const PROMPTS = [
  {
    id: 1,
    term: 'Festival fun',
    instruction: 'Write a sentence about a festival. Example: "The festival is fun."',
    expectedWords: ['festival', 'fun', 'is']
  },
  {
    id: 2,
    term: 'Come March 8',
    instruction: 'Write a sentence about a date. Example: "Come to the event on March 8."',
    expectedWords: ['come', 'march', '8']
  },
  {
    id: 3,
    term: 'Use hashtag',
    instruction: 'Write a sentence about using a hashtag. Example: "Use hashtag for posts."',
    expectedWords: ['use', 'hashtag', 'post']
  },
  {
    id: 4,
    term: 'Add emoji',
    instruction: 'Write a sentence about adding an emoji. Example: "Add emoji to show feeling."',
    expectedWords: ['add', 'emoji', 'show']
  },
  {
    id: 5,
    term: 'Tag friend',
    instruction: 'Write a sentence about tagging a friend. Example: "Tag your friend in the photo."',
    expectedWords: ['tag', 'friend', 'photo']
  },
  {
    id: 6,
    term: 'Post photo',
    instruction: 'Write a sentence about posting a photo. Example: "Post a photo on social media."',
    expectedWords: ['post', 'photo', 'social']
  }
]

export default function Phase4_2Step4RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleSentenceChange = (id, value) => {
    setSentences({
      ...sentences,
      [id]: value
    })
  }

  const evaluateSentence = (sentence, prompt) => {
    if (!sentence || sentence.trim().length < 5) {
      return { correct: false, feedback: 'Sentence is too short. Write a complete sentence.' }
    }

    const lower = sentence.toLowerCase()
    const words = lower.split(/\s+/).filter(w => w.length > 0)

    // Must have at least 2 words for a simple sentence at A2 level
    if (words.length < 2) {
      return { correct: false, feedback: 'Sentence needs more words. Write at least 2 words.' }
    }

    // Check for basic sentence structure (starts with capital, ends with punctuation)
    const hasCapital = /^[A-Z]/.test(sentence.trim())
    const hasPunctuation = /[.!?]$/.test(sentence.trim())

    if (!hasCapital) {
      return { correct: false, feedback: 'Start your sentence with a capital letter.' }
    }

    if (!hasPunctuation) {
      return { correct: false, feedback: 'End your sentence with punctuation (. ! ?)' }
    }

    // Check if sentence contains at least one expected word (basic meaning check)
    const hasExpectedWord = prompt.expectedWords.some(ew => {
      const cleanWord = ew.replace(/[^a-z0-9@#]/gi, '')
      return lower.includes(cleanWord.toLowerCase())
    })

    if (!hasExpectedWord) {
      return { correct: false, feedback: `Try to write about: ${prompt.term}` }
    }

    return { correct: true, feedback: 'Good sentence! Simple and clear!' }
  }

  const handleSubmit = async () => {
    setIsEvaluating(true)

    // Client-side evaluation
    const results = {}
    let correctCount = 0

    PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })

    setEvaluation(results)
    setIsEvaluating(false)
    setShowResults(true)

    // Store score (6 correct = full score)
    sessionStorage.setItem('phase4_2_step4_a2_taskC', correctCount.toString())

    logTaskCompletion(correctCount, PROMPTS.length)
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
          step: '4_remedial',
          level: 'A2',
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

  const handleFinish = () => {
    navigate('/phase4_2/step/4/remedial/a2/results')
  }

  const allAnswered = PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task C: Sentence Builder
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Let's build simple sentences! Write one sentence for each social media topic. Keep it simple and clear. Look at the examples for help!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write a simple sentence for each topic. Keep it short and simple.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Requirements:</strong> At least 2 words, start with capital, end with punctuation.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Scoring:</strong> 1 point per correct sentence (Pass: 4/6)
        </Typography>
      </Paper>

      {/* Sentence Prompts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {PROMPTS.map(prompt => {
          const result = evaluation[prompt.id]

          return (
            <Grid item xs={12} key={prompt.id}>
              <Card
                elevation={2}
                sx={{
                  backgroundColor: showResults
                    ? (result?.correct ? 'success.lighter' : 'error.lighter')
                    : 'white'
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {prompt.id}. {prompt.term}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                    {prompt.instruction}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Write your sentence here..."
                    value={sentences[prompt.id] || ''}
                    onChange={(e) => handleSentenceChange(prompt.id, e.target.value)}
                    disabled={showResults || isEvaluating}
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1.1rem'
                      }
                    }}
                  />

                  {showResults && result && (
                    <Alert
                      severity={result.correct ? 'success' : 'error'}
                      icon={result.correct ? <CheckCircleIcon /> : undefined}
                      sx={{ mt: 2 }}
                    >
                      <Typography>{result.feedback}</Typography>
                      {!result.correct && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Hint: {prompt.instruction}
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

      {/* Results Summary */}
      {showResults && (
        <Alert severity={correctCount >= 4 ? "success" : "warning"} sx={{ mb: 3 }}>
          {correctCount >= 4 ? (
            <Typography variant="h6">
              🎉 Great work! You passed with {correctCount}/{PROMPTS.length} correct sentences!
            </Typography>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Sentences Correct: {correctCount}/{PROMPTS.length}
              </Typography>
              <Typography>
                You need at least 4/6 to pass. Review the feedback and examples!
              </Typography>
            </Box>
          )}
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
            disabled={!allAnswered || isEvaluating}
            startIcon={isEvaluating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isEvaluating ? 'Evaluating...' : 'Submit Sentences'}
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleFinish}
            endIcon={<ArrowForwardIcon />}
          >
            View Final Results
          </Button>
        )}
      </Box>
    </Box>
  )
}
