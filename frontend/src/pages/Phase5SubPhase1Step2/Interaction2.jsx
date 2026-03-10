import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 2: Explore
 * Interaction 2: Solution Explanation
 * SKANDER: "Why did you choose that solution?"
 */

const EXPECTED_EXAMPLES = {
  A2: 'Backup good because fix.',
  B1: 'Backup lights work because it is emergency and fast.',
  B2: 'Using backup lights is the best immediate solution because it ensures the event continues without major delay and maintains audience safety.',
  C1: 'Deploying the backup lighting system is the optimal crisis response because it minimizes downtime, preserves the event\'s integrity, and demonstrates proactive risk management, thereby reinforcing stakeholder confidence.'
}

export default function Phase5Step2Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 2, context: 'main' })
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please explain why you chose that solution.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateExplanation(explanation.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step2_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step2_interaction2_level', data.level || 'A2')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A2',
          feedback: result.error || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback
      const explanationLower = explanation.toLowerCase()
      const wordCount = explanation.split(/\s+/).length
      const hasBecause = explanationLower.includes('because')
      const hasBackup = explanationLower.includes('backup')

      let score = 2
      let level = 'A2'
      if (wordCount <= 5 && hasBackup) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 15 && hasBecause && hasBackup) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 30 && hasBecause && hasBackup) {
        score = 4
        level = 'B2'
      } else {
        score = 5
        level = 'C1'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback: `Your explanation shows ${level} level understanding.`
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step2_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step2_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 2
        </Typography>
        <Typography variant="body1">
          Explain why you chose that solution
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="Why did you choose that solution? Explain one solution (e.g., backup lights) and why it works."
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2">
          Explain why backup lights (or your chosen solution) is a good solution for the lighting problem. Use "because" to give reasons.
        </Typography>
      </Alert>

      {/* Expected Examples */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Expected Response Examples (by level):
        </Typography>
        <Stack spacing={1}>
          {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
            <Box key={level}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {level}:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>
                "{example}"
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Your Explanation
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Example: Backup lights work because it is emergency and fast..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {explanation.split(/\s+/).filter(w => w.length > 0).length}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !explanation.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Explanation'}
          </Button>
        )}
      </Paper>

      {/* Evaluation Results */}
      {evaluation && submitted && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: evaluation.success ? 'success.lighter' : 'warning.lighter',
            border: '2px solid',
            borderColor: evaluation.success ? 'success.main' : 'warning.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: evaluation.success ? 'success.main' : 'warning.main',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'}>
                {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Continue to Interaction 3
          </Button>
        </Paper>
      )}
    </Box>
  )
}
