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
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level A2 - Task C: Sentence Builder
 * Write 6 simple sentences for a social media post
 */

const PROMPTS = [
  {
    id: 1,
    prompt: 'Festival fun',
    instruction: 'Write a sentence about having fun at a festival.'
  },
  {
    id: 2,
    prompt: 'Come March 8',
    instruction: 'Write a sentence inviting people to come on March 8.'
  },
  {
    id: 3,
    prompt: 'Use hashtag',
    instruction: 'Write a sentence about using a hashtag.'
  },
  {
    id: 4,
    prompt: 'Add emoji',
    instruction: 'Write a sentence about adding an emoji to your post.'
  },
  {
    id: 5,
    prompt: 'Tag friend',
    instruction: 'Write a sentence about tagging a friend.'
  },
  {
    id: 6,
    prompt: 'Post photo',
    instruction: 'Write a sentence about posting a photo.'
  }
]

export default function Phase4_2Step2RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})

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

    // Must have at least 4 words for a simple sentence
    if (words.length < 4) {
      return { correct: false, feedback: 'Sentence needs more words. Try to write at least 4 words.' }
    }

    // Check if sentence relates to the prompt
    const promptWords = prompt.prompt.toLowerCase().split(/\s+/)
    const hasRelevantWord = promptWords.some(pw =>
      words.some(w => w.includes(pw) || pw.includes(w))
    )

    if (!hasRelevantWord) {
      return { correct: false, feedback: `Your sentence should be about: ${prompt.prompt}` }
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

    return { correct: true, feedback: 'Good sentence!' }
  }

  const handleSubmit = () => {
    const results = {}
    let correctCount = 0

    PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })

    setEvaluation(results)
    setShowResults(true)

    // Store score
    const scoreOutOf10 = (correctCount / PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskC_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskC_max', '10')

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
          step: 2,
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
    navigate('/phase4_2/step/2/remedial/a2/results')
  }

  const allAnswered = PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task C: Sentence Builder
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Write simple sentences for a social media post about a festival! Remember to start with a capital letter and end with punctuation."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write a simple sentence for each prompt.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Requirements:</strong> At least 4 words, start with capital letter, end with punctuation.
        </Typography>
      </Paper>

      {/* Sentence Prompts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {PROMPTS.map(prompt => {
          const result = evaluation[prompt.id]

          return (
            <Grid item xs={12} key={prompt.id}>
              <Card elevation={2} sx={{
                backgroundColor: showResults
                  ? (result?.correct ? 'success.lighter' : 'error.lighter')
                  : 'white'
              }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {prompt.id}. {prompt.prompt}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {prompt.instruction}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Write your sentence here..."
                    value={sentences[prompt.id] || ''}
                    onChange={(e) => handleSentenceChange(prompt.id, e.target.value)}
                    disabled={showResults}
                    sx={{ backgroundColor: 'white' }}
                  />
                  {showResults && result && (
                    <Alert
                      severity={result.correct ? 'success' : 'error'}
                      icon={result.correct ? <CheckCircleIcon /> : undefined}
                      sx={{ mt: 2 }}
                    >
                      {result.feedback}
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
        <Alert severity={correctCount === PROMPTS.length ? "success" : "warning"} sx={{ mb: 3 }}>
          {correctCount === PROMPTS.length ? (
            <Typography>
              Perfect! All {PROMPTS.length} sentences are well written!
            </Typography>
          ) : (
            <Typography>
              You got {correctCount}/{PROMPTS.length} correct. Review the feedback!
            </Typography>
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
            onClick={handleFinish}
            endIcon={<ArrowForwardIcon />}
          >
            View Results
          </Button>
        )}
      </Box>
    </Box>
  )
}
