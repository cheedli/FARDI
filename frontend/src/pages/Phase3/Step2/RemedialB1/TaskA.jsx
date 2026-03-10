import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level B1 - Task A: Short Explanation
 * Write 4-5 sentences explaining why sponsorship is important
 */

export default function Phase3Step2RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_b1' })
  const [explanation, setExplanation] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setExplanation(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    logTaskCompletion(Math.min(sentenceCount, 5), 5)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: 0,
          step: 2
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const isComplete = wordCount >= 60 && sentenceCount >= 4

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task A: Short Explanation
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now for a more detailed task! Explain why sponsorship is important for events. Write 4-5 sentences with clear reasons and examples."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Write 4-5 sentences explaining why sponsorship is important.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>What to include:</strong>
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 3 }}>
          <Typography component="li" variant="body2">
            Why events need sponsors
          </Typography>
          <Typography component="li" variant="body2">
            What sponsors provide
          </Typography>
          <Typography component="li" variant="body2">
            Benefits for the event
          </Typography>
          <Typography component="li" variant="body2">
            An example if possible
          </Typography>
        </Box>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Explanation
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={explanation}
          onChange={handleTextChange}
          placeholder="Write your explanation here... Explain why sponsorship is important for events. Include reasons, benefits, and examples."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Sentences: {sentenceCount} | Target: 4-5 sentences (approx. 60-100 words)
          </Typography>
          {isComplete && !showResults && (
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
              ✓ Ready to submit!
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Results */}
      {showResults && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Great Explanation!
          </Typography>
          <Typography>
            You wrote {sentenceCount} sentences with {wordCount} words. Your explanation demonstrates good understanding of sponsorship importance.
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
            disabled={!isComplete}
          >
            Submit Explanation
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
            Complete B1 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
