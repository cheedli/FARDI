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
 * Phase 4.2 - Level A2 - Task B: Expand Quest
 * Expand 8 sentences with "because" or "and"
 */

const SENTENCE_PROMPTS = [
  { id: 1, prompt: 'Post has hashtag.', connector: 'because', example: 'Post has hashtag because viral.' },
  { id: 2, prompt: 'Caption is words.', connector: 'and', example: 'Caption is words and emoji.' },
  { id: 3, prompt: 'Story has photo.', connector: 'because', example: 'Story has photo because memory.' },
  { id: 4, prompt: 'Friend likes post.', connector: 'and', example: 'Friend likes post and shares.' },
  { id: 5, prompt: 'Tag is important.', connector: 'because', example: 'Tag is important because search.' },
  { id: 6, prompt: 'Emoji shows feeling.', connector: 'and', example: 'Emoji shows feeling and color.' },
  { id: 7, prompt: 'Share is fast.', connector: 'because', example: 'Share is fast because click.' },
  { id: 8, prompt: 'Profile has name.', connector: 'and', example: 'Profile has name and picture.' }
]

export default function Phase4_2RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})

  const handleSentenceChange = (id, value) => {
    setSentences({
      ...sentences,
      [id]: value
    })
  }

  const evaluateSentence = (sentence, originalPrompt, expectedConnector) => {
    if (!sentence || sentence.trim().length < originalPrompt.length + 5) {
      return { correct: false, feedback: 'Sentence is too short - you need to expand it!' }
    }

    const lower = sentence.toLowerCase()
    const hasConnector = lower.includes('because') || lower.includes('and')

    if (!hasConnector) {
      return { correct: false, feedback: 'Must include "because" or "and"' }
    }

    // Check if sentence starts with the original prompt (roughly)
    const promptWords = originalPrompt.toLowerCase().replace('.', '').split(' ')
    const startsCorrectly = promptWords.every(word => lower.includes(word))

    if (!startsCorrectly) {
      return { correct: false, feedback: 'Must start with the original sentence' }
    }

    // Check if there's content after the connector
    const connectorIndex = Math.max(lower.indexOf('because'), lower.indexOf('and'))
    const afterConnector = sentence.slice(connectorIndex).trim()
    const wordsAfter = afterConnector.split(/\s+/).length

    if (wordsAfter < 2) {
      return { correct: false, feedback: 'Add more detail after the connector' }
    }

    return { correct: true, feedback: 'Good expansion!' }
  }

  const handleSubmit = () => {
    const results = {}
    let correctCount = 0

    SENTENCE_PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt.prompt, prompt.connector)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })

    setEvaluation(results)
    setShowResults(true)

    // Store score
    const scoreOutOf10 = (correctCount / SENTENCE_PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_a2_taskB_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_remedial_a2_taskB_max', '10')

    logTaskCompletion(correctCount, SENTENCE_PROMPTS.length)
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
          step: 1,
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
    navigate('/phase4_2/step/1/remedial/a2/taskC')
  }

  const allAnswered = SENTENCE_PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task B: Expand Quest
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Expand these sentences by adding 'because' or 'and' with more detail! Make your sentences longer and more interesting!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Expand each sentence by adding "because" or "and" with logical detail. Look at the examples!
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Must add connector ("because" or "and") and logical detail.
        </Typography>
      </Paper>

      {/* Sentence Prompts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SENTENCE_PROMPTS.map(prompt => {
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
                    {prompt.id}. Expand: "{prompt.prompt}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Example: <em>{prompt.example}</em>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Write your expanded sentence here..."
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
                      {!result.correct && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Example: {prompt.example}
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
        <Alert severity={correctCount === SENTENCE_PROMPTS.length ? "success" : "warning"} sx={{ mb: 3 }}>
          {correctCount === SENTENCE_PROMPTS.length ? (
            <Typography>
              Perfect! All {SENTENCE_PROMPTS.length} sentences are correctly expanded!
            </Typography>
          ) : (
            <Typography>
              You got {correctCount}/{SENTENCE_PROMPTS.length} correct. Review the feedback and try to add more detail!
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
