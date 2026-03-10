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
  Link
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import ArticleIcon from '@mui/icons-material/Article'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 3: Explain
 * Interaction 2: Explain Transparent Communication
 * Lilia: "Explain 'transparent' communication in a crisis"
 */

const EXPECTED_EXAMPLES = {
  A2: 'Transparent is tell truth.',
  B1: 'Transparent communication means telling people the truth about the problem and what we are doing, like the Twitter post said "lights broken but we fix soon" because it makes people not worried.',
  B2: 'Transparent communication involves openly sharing accurate information about the crisis (problem + actions being taken), as seen in the Twitter update that clearly stated the issue and resolution timeline, because it builds trust and reduces anxiety.',
  C1: 'Transparent communication in crisis situations entails full, timely, and honest disclosure of the issue, response measures, and expected outcomes (e.g., "technical failure - backup lighting activated - event proceeds in 25 minutes"), as both examples demonstrate, thereby mitigating misinformation, preserving stakeholder trust, and transforming potential disruption into an opportunity for demonstrating reliability and accountability.'
}

const EXAMPLE_LINKS = [
  { url: 'https://www.sendible.com/insights/your-guide-to-social-media-crisis-management', label: 'Example 1: Social Media Crisis Management Guide' },
  { url: 'https://theeventscalendar.com/blog/event-cancellation-announcement-examples/', label: 'Example 2: Event Cancellation Announcement Examples' }
]

export default function Phase5Step3Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 2, context: 'main' })
  const [examplesRead, setExamplesRead] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleExamplesReady = () => {
    setExamplesRead(true)
  }

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please explain transparent communication.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateTransparent(explanation.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          example_reference_detected: data.example_reference_detected || false,
          purpose_explained: data.purpose_explained || false
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step3_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step3_interaction2_level', data.level || 'A2')
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
      const hasTransparent = explanationLower.includes('transparent')
      const hasTruth = ['truth', 'honest', 'open'].some(w => explanationLower.includes(w))
      const hasExample = ['twitter', 'email', 'example', 'text', 'post'].some(w => explanationLower.includes(w))
      const hasPurpose = ['trust', 'panic', 'worried', 'anxiety', 'because'].some(w => explanationLower.includes(w))

      let score = 2
      let level = 'A2'
      if (wordCount <= 5 && hasTransparent && hasTruth) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 25 && hasTransparent && hasTruth && hasExample) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 50 && hasTransparent && hasTruth && hasExample && hasPurpose) {
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
        feedback: `Your explanation shows ${level} level understanding.`,
        example_reference_detected: hasExample,
        purpose_explained: hasPurpose
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step3_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step3_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Interaction 2
        </Typography>
        <Typography variant="body1">
          Explain 'transparent' communication in a crisis
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Lilia"
          message="Now read these two real crisis communication examples. Listen for: transparent, reassure, immediate, resolve, communicate, update. After reading, explain 'transparent' communication in a crisis."
        />
      </Paper>

      {/* Examples Section */}
      {!examplesRead && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ArticleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6" color="primary">
              Step 1: Read Examples
            </Typography>
          </Box>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Read these examples of crisis communication. Look for: transparent, reassure, immediate, resolve, communicate, update.
            </Typography>
          </Alert>
          <Stack spacing={2}>
            {EXAMPLE_LINKS.map((example, idx) => (
              <Link
                key={idx}
                href={example.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ display: 'block', p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}
              >
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {example.label} →
                </Typography>
              </Link>
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExamplesReady}
            fullWidth
            sx={{ mt: 2 }}
          >
            I've Read the Examples - Continue
          </Button>
        </Paper>
      )}

      {/* Explanation Section */}
      {examplesRead && !submitted && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Step 2: Explain 'Transparent' Communication
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Define 'transparent' communication and describe its purpose, using examples from the texts. Include "It means tell truth..." and reference one example (e.g., "We tell you the problem and solution").
              </Typography>
            </Alert>

            {/* Expected Examples */}
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: 'warning.lighter' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
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

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Write your explanation of 'transparent' communication here, referencing the examples..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              sx={{ mb: 2 }}
            />

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
          </Paper>
        </>
      )}

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

          {evaluation.example_reference_detected && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Great! You referenced examples from the texts.
            </Alert>
          )}

          {evaluation.purpose_explained && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Excellent! You explained the purpose of transparent communication.
            </Alert>
          )}

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
