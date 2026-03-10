import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Stack,
  Divider,
  Chip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 - Interaction 1
 * Write an Executive Summary using a guided template
 */

const TEMPLATE_SECTIONS = [
  {
    line: 1,
    label: 'Opening Statement',
    template: 'The [event name] was held on [date] at [location].',
    hint: 'Introduce the event with basic factual information.'
  },
  {
    line: 2,
    label: 'Objectives',
    template: 'The event [achieved/aimed to]...',
    hint: 'Describe what the event was intended to accomplish.'
  },
  {
    line: 3,
    label: 'Successes',
    template: 'Key successes included...',
    hint: 'Briefly mention the main positive outcomes.'
  },
  {
    line: 4,
    label: 'Challenges',
    template: 'Main challenges were...',
    hint: 'Note the significant difficulties encountered.'
  },
  {
    line: 5,
    label: 'Overall Conclusion',
    template: 'Overall, the event was [successful/partially successful/unsuccessful] because...',
    hint: 'Give your overall assessment with a reason.'
  }
]

export default function Phase6SP1Step4Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'main' })
  const [summary, setSummary] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const wordCount = summary.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const trimmed = summary.trim()
    if (!trimmed) {
      setResult({ success: false, feedback: 'Please write your Executive Summary before submitting.' })
      return
    }

    // Simple scoring: completed + word count >= 30 = 1 point
    const score = trimmed.length > 0 && wordCount >= 30 ? 1 : 0

    sessionStorage.setItem('phase6_sp1_step4_interaction1_score', score.toString())

    try {
      await phase6API.trackGame(4, 1, { completed: true, time_played: 60, engagement_score: 1 }, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }

    setResult({
      success: true,
      score,
      feedback: score === 1
        ? 'Well done! Your Executive Summary meets the minimum length requirement. Good use of the template structure.'
        : 'Your summary is quite short. Try to write at least 30 words to cover all template sections.',
      wordCount
    })
    setSubmitted(true)
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/4/interaction/2')
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
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection & Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Elaborate - Interaction 1
        </Typography>
        <Typography variant="body1">
          Write an Executive Summary
        </Typography>
      </Paper>

      {/* Character Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #27ae60, #1e8449)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              flexShrink: 0
            }}
          >
            MM
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ms. Mabrouki
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "Now we write real parts of the post-event report! Write the 'Executive Summary' section
              using this guided template with examples. Use examples as models — change words, add festival details,
              keep formal and objective. Self-check grammar, spelling, formality, balance, and clarity before submitting."
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Template Guide */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0fdf4' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1e8449' }}>
          Executive Summary Template
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {TEMPLATE_SECTIONS.map((section, idx) => (
            <Box key={section.line}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label={section.line}
                  size="small"
                  sx={{ backgroundColor: '#27ae60', color: 'white', fontWeight: 'bold', minWidth: 28 }}
                />
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1e8449' }}>
                  {section.label}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  ml: 4,
                  p: 1,
                  backgroundColor: 'white',
                  border: '1px dashed #27ae60',
                  borderRadius: 1,
                  fontStyle: 'italic',
                  color: '#2c3e50'
                }}
              >
                {section.template}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                {section.hint}
              </Typography>
              {idx < TEMPLATE_SECTIONS.length - 1 && <Divider sx={{ mt: 1.5 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Writing Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Your Executive Summary
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Write at least 30 words. Cover all 5 template sections. Use past tense and formal language.
              The Global Cultures Festival was held on [insert date] — use details from your knowledge of the event.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Write your Executive Summary here. Follow the template structure above and use your own words..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color={wordCount >= 30 ? 'success.main' : 'text.secondary'}>
              Word count: {wordCount} {wordCount >= 30 ? '(minimum met)' : '(minimum: 30 words)'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!summary.trim()}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)' },
              '&:disabled': { background: '#ccc' }
            }}
          >
            Submit Executive Summary
          </Button>
        </Paper>
      )}

      {/* Result */}
      {result && submitted && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: result.success ? '#f0fdf4' : '#fff3e0',
            border: '2px solid',
            borderColor: result.success ? '#27ae60' : '#f39c12'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: result.success ? '#27ae60' : '#f39c12', mr: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ color: result.success ? '#1e8449' : '#e67e22' }}>
                Executive Summary {result.success ? 'Submitted!' : 'Needs More Work'}
              </Typography>
              {result.score !== undefined && (
                <Typography variant="body2" color="text.secondary">
                  Score: +{result.score} point | Words: {result.wordCount}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {result.feedback}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            fullWidth
            sx={{
              mt: 1,
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)' }
            }}
          >
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
