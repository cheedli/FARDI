import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level C1 - Task B: Analytical Writing
 * Write 8-sentence analysis of social media promotion strategies
 */

export default function Phase4_2RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_c1' })
  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setAnalysis(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    // Score based on sentence count (max 10 points)
    const score = Math.min((sentenceCount / 8) * 10, 10)

    sessionStorage.setItem('phase4_2_remedial_c1_taskB_score', score.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_c1_taskB_max', '10')

    logTaskCompletion(sentenceCount, 8)
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
          level: 'C1',
          task: 'B',
          score: score,
          max_score: maxScore,
          content: analysis
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/1/remedial/c1/taskC')
  }

  const isComplete = sentenceCount >= 8

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 1 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task B: Analytical Writing
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Write a sophisticated analysis of social media promotion strategies. Use precise terminology, examine multiple perspectives, and demonstrate critical thinking in 8 well-structured sentences."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write an 8-sentence analysis comparing and evaluating different social media promotion strategies.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>What to include:</strong> Influencer marketing, organic vs paid reach, engagement metrics, viral content, authenticity, analytics, conversion strategies, and ROI considerations.
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Analysis
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={15}
          value={analysis}
          onChange={handleTextChange}
          placeholder="Write your analytical essay here... Compare and evaluate different social media promotion strategies, using sophisticated terminology and examining the effectiveness of various approaches including influencer marketing, organic reach, paid advertising, and viral content creation."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Sentences: {sentenceCount} | Target: 8 sentences (approx. 150-200 words)
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
        <Alert severity={isComplete ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isComplete ? 'Excellent Analytical Writing!' : 'Good Start!'}
          </Typography>
          <Typography>
            You wrote {sentenceCount} sentences with {wordCount} words.
            {isComplete ? ' Your analysis demonstrates advanced critical thinking and sophisticated use of social media promotion terminology.' : ' Try to reach the 8-sentence target for full credit.'}
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
            disabled={sentenceCount < 6}
          >
            Submit Analysis
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
