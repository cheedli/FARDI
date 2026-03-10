import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level B1 - Task A: Short Writing
 * Write 4-5 sentences explaining why events need sponsorship or a budget
 */

export default function Phase3RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_b1' })
  const [writing, setWriting] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setWriting(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    const sentences = writing.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    logTaskCompletion(Math.min(sentences, 5), 5)
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
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const sentenceCount = writing.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const isComplete = wordCount >= 40 && sentenceCount >= 4

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task A: Short Writing
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="Let's develop your writing skills! Write 4-5 sentences explaining why events need sponsorship or a budget."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write 4-5 sentences explaining why events need sponsorship or a budget.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Tips:</strong> Include reasons, examples, and explain the importance of financial planning.
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Writing
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={writing}
          onChange={handleTextChange}
          placeholder="Start writing here... Explain why events need financial support and planning."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Sentences: {sentenceCount} | Target: 4-5 sentences (approx. 40-60 words)
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
            Excellent Work!
          </Typography>
          <Typography>
            You wrote {sentenceCount} sentences with {wordCount} words. Your writing demonstrates your ability to explain financial concepts clearly.
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
            Submit Writing
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
