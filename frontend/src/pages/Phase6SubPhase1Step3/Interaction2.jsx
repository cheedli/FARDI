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
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3: Explain
 * Interaction 2: Explain why balance matters in a post-event report
 */

const TARGET_VOCABULARY = ['balance', 'objective', 'fair', 'honest', 'improve', 'learn', 'future']

const BALANCE_WORDS = ['balance', 'balanced', 'fair', 'objective', 'honest', 'both']
const BOTH_SIDES_POSITIVE = ['positive', 'strength', 'success', 'well', 'good', 'achievement']
const BOTH_SIDES_NEGATIVE = ['negative', 'weakness', 'challenge', 'problem', 'difficulty', 'improve', 'bad', 'fail']
const PURPOSE_WORDS = ['because', 'so that', 'in order', 'help', 'allow', 'enable', 'understand']

function fallbackScore(text) {
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length

  const hasBalance = BALANCE_WORDS.some(w => lower.includes(w))
  const hasBecause = PURPOSE_WORDS.some(w => lower.includes(w))
  const hasPositive = BOTH_SIDES_POSITIVE.some(w => lower.includes(w))
  const hasNegative = BOTH_SIDES_NEGATIVE.some(w => lower.includes(w))
  const hasBothSides = hasPositive && hasNegative

  if (wordCount < 5) return { score: 1, level: 'A2' }
  if (wordCount <= 15 && hasBalance) return { score: 1, level: 'A2' }
  if (wordCount <= 30 && hasBalance && hasBecause) return { score: 2, level: 'B1' }
  if (wordCount <= 50 && hasBalance && hasBecause && hasBothSides) return { score: 3, level: 'B2' }
  if (wordCount > 50 && hasBalance && hasBecause && hasBothSides) return { score: 4, level: 'C1' }
  if (hasBalance && hasBecause) return { score: 2, level: 'B1' }
  if (hasBalance) return { score: 1, level: 'A2' }
  return { score: 1, level: 'A2' }
}

const SCORE_LABELS = {
  1: 'A2 - Basic understanding',
  2: 'B1 - Good understanding with reasons',
  3: 'B2 - Strong explanation with both sides',
  4: 'C1 - Sophisticated, nuanced explanation'
}

export default function Phase6SP1Step3Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 2, context: 'main' })
  const [response, setResponse] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!response.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your explanation before submitting.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase6API.evaluateBalanceExplanation(response.trim())

      if (result && result.score !== undefined) {
        const score = result.score || 1
        const level = result.level || 'A2'
        setEvaluation({
          success: true,
          score,
          level,
          feedback: result.feedback || 'Good work!',
          strengths: result.strengths || [],
          improvements: result.improvements || []
        })
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step3_interaction2_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step3_interaction2_level', level)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback scoring
      const { score, level } = fallbackScore(response.trim())
      const lower = response.toLowerCase()
      const hasBalance = BALANCE_WORDS.some(w => lower.includes(w))
      const hasBothSides = BOTH_SIDES_POSITIVE.some(w => lower.includes(w)) && BOTH_SIDES_NEGATIVE.some(w => lower.includes(w))

      let feedback = ''
      if (score === 1) {
        feedback = 'You\'ve made a start! Try to explain WHY balance matters — use "because" and mention both positives and challenges.'
      } else if (score === 2) {
        feedback = 'Good work! You used "because" to give a reason. Try to mention specific examples of both strengths AND weaknesses.'
      } else if (score === 3) {
        feedback = 'Very good! You explained both sides and gave reasons. Consider using more formal vocabulary like "objective" or "comprehensive".'
      } else {
        feedback = 'Excellent! Your explanation is sophisticated and well-reasoned. You clearly understand why balanced reporting matters.'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback,
        hasBalance,
        hasBothSides
      })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step3_interaction2_score', score.toString())
      sessionStorage.setItem('phase6_sp1_step3_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/3/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection &amp; Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 6.1 - Step 3: Explain - Interaction 2
        </Typography>
        <Typography variant="body1">
          Explain why balance matters in a post-event report
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Lilia"
          message="The video shows the typical structure of a good report. Now explain why it is important to include both strengths (successes) and weaknesses (challenges) in the report. Include 'It is important because...' and reference one reason from the video (e.g., 'shows honesty', 'helps improve', 'builds trust')."
        />
      </Paper>

      {/* Writing Task */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
            Writing Task
          </Typography>

          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom fontWeight="bold">
              Explain: Why is it important to include BOTH strengths AND weaknesses in a post-event report?
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
              Hint: What happens if you only write positives? What happens if you only write negatives?
            </Typography>
          </Alert>

          {/* Target Vocabulary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom color="text.secondary">
              Try to use these words:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {TARGET_VOCABULARY.map((word) => (
                <Chip
                  key={word}
                  label={word}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: '#27ae60', color: '#27ae60' }}
                />
              ))}
            </Stack>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="It is important to include both strengths and weaknesses because..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !response.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Evaluating...' : 'Submit Explanation'}
          </Button>
        </Paper>
      )}

      {/* Evaluation Results */}
      {evaluation && submitted && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: evaluation.success ? '#f0faf4' : '#fff8e1',
            border: '2px solid',
            borderColor: evaluation.success ? '#27ae60' : '#f39c12',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: evaluation.success ? '#27ae60' : '#f39c12',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'} fontWeight="bold">
                {evaluation.success ? 'Explanation Evaluated!' : 'Needs Improvement'}
              </Typography>
              {evaluation.level && (
                <Typography variant="body2" color="text.secondary">
                  Level: <strong>{evaluation.level}</strong> — {SCORE_LABELS[evaluation.score] || evaluation.level}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <Alert severity="success" sx={{ mb: 1 }}>
              <Typography variant="body2"><strong>Strengths:</strong> {evaluation.strengths.join(', ')}</Typography>
            </Alert>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <Alert severity="info" sx={{ mb: 1 }}>
              <Typography variant="body2"><strong>To improve:</strong> {evaluation.improvements.join(', ')}</Typography>
            </Alert>
          )}

          {evaluation.hasBalance && (
            <Alert severity="success" sx={{ mb: 1 }}>
              <Typography variant="body2">You used balance-related vocabulary.</Typography>
            </Alert>
          )}

          {evaluation.hasBothSides && (
            <Alert severity="success" sx={{ mb: 1 }}>
              <Typography variant="body2">You mentioned both the positive and negative aspects.</Typography>
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontWeight: 'bold'
            }}
          >
            Continue to Interaction 3
          </Button>
        </Paper>
      )}
    </Box>
  )
}
