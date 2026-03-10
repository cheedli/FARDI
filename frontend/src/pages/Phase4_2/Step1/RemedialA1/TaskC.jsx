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
 * Phase 4.2 - Level A1 - Task C: Sentence Builder
 * Write 6 very simple sentences about social media posts
 */

const SENTENCE_PROMPTS = [
  { id: 1, term: 'hashtag', example: 'I use hashtag' },
  { id: 2, term: 'emoji', example: 'Emoji is smile' },
  { id: 3, term: 'like', example: 'I like post' },
  { id: 4, term: 'share', example: 'Share is good' },
  { id: 5, term: 'post', example: 'Post is picture' },
  { id: 6, term: 'caption', example: 'Caption is words' }
]

export default function Phase4_2RemedialA1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_a1' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})

  const handleSentenceChange = (id, value) => {
    setSentences({
      ...sentences,
      [id]: value
    })
  }

  const evaluateSentence = (sentence, term) => {
    if (!sentence || sentence.trim().length < 3) {
      return { correct: false, feedback: 'Too short' }
    }

    const lower = sentence.toLowerCase()
    const hasTerm = lower.includes(term.toLowerCase())
    const hasVerb = /\b(is|are|use|like|make|write|add|click|watch|share)\b/i.test(sentence)
    const isSimple = sentence.split(/\s+/).length <= 6

    if (hasTerm && hasVerb && isSimple) {
      return { correct: true, feedback: 'Good simple sentence!' }
    } else if (!hasTerm) {
      return { correct: false, feedback: `Must include "${term}"` }
    } else if (!hasVerb) {
      return { correct: false, feedback: 'Need a verb (is, use, like, etc.)' }
    } else {
      return { correct: false, feedback: 'Try to keep it simple' }
    }
  }

  const handleSubmit = () => {
    const results = {}
    let correctCount = 0

    SENTENCE_PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt.term)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })

    setEvaluation(results)
    setShowResults(true)

    // Store score
    const scoreOutOf10 = (correctCount / SENTENCE_PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_a1_taskC_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_remedial_a1_taskC_max', '10')

    logTaskCompletion(correctCount, SENTENCE_PROMPTS.length)
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
          step: 1,
          level: 'A1',
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
    navigate('/phase4_2/step/1/remedial/a1/results')
  }

  const allAnswered = SENTENCE_PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
          Phase 4.2 - Remedial Practice
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 500, color: 'white' }}>
          Level A1 - Task C: Sentence Builder
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Write 6 very simple sentences about social media! Keep them short and clear."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
          <strong>Instructions:</strong> Write a simple sentence for each social media term. Look at the examples!
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
          <strong>Evaluation:</strong> Correct simple present tense; basic meaning.
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
                  : 'background.paper'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {prompt.id}. Write a sentence using "{prompt.term}"
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.primary' }}>
                    Example: <em>{prompt.example}</em>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Write your sentence here..."
                    value={sentences[prompt.id] || ''}
                    onChange={(e) => handleSentenceChange(prompt.id, e.target.value)}
                    disabled={showResults}
                    sx={{
                      backgroundColor: 'background.paper',
                      '& .MuiInputBase-input': {
                        color: 'text.primary'
                      }
                    }}
                  />
                  {showResults && result && (
                    <Alert
                      severity={result.correct ? 'success' : 'error'}
                      icon={result.correct ? <CheckCircleIcon /> : undefined}
                      sx={{ mt: 2 }}
                    >
                      <Typography sx={{ color: 'text.primary' }}>{result.feedback}</Typography>
                      {!result.correct && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.primary' }}>
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
            <Typography sx={{ color: 'text.primary' }}>
              🎉 Perfect! All {SENTENCE_PROMPTS.length} sentences are correct!
            </Typography>
          ) : (
            <Typography sx={{ color: 'text.primary' }}>
              You got {correctCount}/{SENTENCE_PROMPTS.length} correct. Review the feedback and keep practicing!
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
