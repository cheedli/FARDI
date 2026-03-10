import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level B2 - Task A: Comparison
 * Compare two funding options (sponsorship vs tickets)
 */

export default function Phase3RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_b2' })
  const [comparison, setComparison] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setComparison(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    logTaskCompletion(wordCount >= 80 ? 5 : 3, 5)
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

  const isComplete = wordCount >= 60

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B2 - Task A: Comparison
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Let's compare two funding options! Write a comparison between sponsorship and ticket sales. Consider advantages, disadvantages, and suitability for different events."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Compare sponsorship vs. ticket sales as funding options for the Global Cultures Festival.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>What to include:</strong> Advantages, disadvantages, reliability, amount of money, and which is better for your event.
        </Typography>
      </Paper>

      {/* Comparison Table */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CompareArrowsIcon color="primary" />
          <Typography variant="h6">
            Quick Reference
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Sponsorship
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Companies give money</li>
              <li>May require advertising</li>
              <li>Can be large amounts</li>
              <li>Not guaranteed</li>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" color="secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ticket Sales
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Attendees pay entry</li>
              <li>Direct income</li>
              <li>Depends on attendance</li>
              <li>More predictable</li>
            </Typography>
          </Box>
        </Box>
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
          placeholder="Write your comparison here... Discuss both sponsorship and ticket sales, comparing their advantages and disadvantages for the Global Cultures Festival."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Target: 60-100 words
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
            Great Comparison!
          </Typography>
          <Typography>
            You wrote {wordCount} words. Your comparison demonstrates analytical thinking and the ability to evaluate different funding options.
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
