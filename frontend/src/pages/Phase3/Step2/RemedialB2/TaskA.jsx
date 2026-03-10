import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level B2 - Task A: Comparison Task
 * Compare ticket income and sponsorship in 6 sentences
 */

export default function Phase3Step2RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_b2' })
  const [comparison, setComparison] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setComparison(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    logTaskCompletion(Math.min(sentenceCount, 6), 6)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
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

  const isComplete = wordCount >= 100 && sentenceCount >= 6

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B2 - Task A: Comparison Task
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Time for an analytical task! Compare ticket income and sponsorship as funding sources. Write 6 sentences using comparison language like 'while', 'whereas', 'on the other hand', 'both', and 'however'."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Write 6 sentences comparing ticket income and sponsorship.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>What to compare:</strong>
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 3 }}>
          <Typography component="li" variant="body2">
            Timing (when money arrives)
          </Typography>
          <Typography component="li" variant="body2">
            Reliability and predictability
          </Typography>
          <Typography component="li" variant="body2">
            Advantages and disadvantages of each
          </Typography>
          <Typography component="li" variant="body2">
            Examples from real events
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Use comparison language:</strong> while, whereas, on the other hand, both, however, although, similarly, in contrast
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Comparison
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={12}
          value={comparison}
          onChange={handleTextChange}
          placeholder="Write your comparison here... Compare ticket income and sponsorship as funding sources. Use comparison language and analyze advantages and disadvantages of each."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Sentences: {sentenceCount} | Target: 6 sentences (approx. 100-150 words)
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
            Excellent Comparison!
          </Typography>
          <Typography>
            You wrote {sentenceCount} sentences with {wordCount} words. Your comparison demonstrates strong analytical skills and effective use of comparison language.
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
            Submit Comparison
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
            Complete B2 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
