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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 - Interaction 2
 * Write the Successes & Challenges section with specific evidence
 */

const MINI_TEMPLATE = [
  {
    section: 'Successes',
    lines: [
      '1. [specific achievement with evidence — include numbers or names]',
      '2. [another achievement with details]'
    ]
  },
  {
    section: 'Challenges',
    lines: [
      '1. [specific challenge encountered — what happened and what was its impact]',
      '2. [another challenge with details]'
    ]
  }
]

const TARGET_VOCABULARY = [
  'achieved', 'accomplished', 'demonstrated', 'encountered', 'faced', 'overcome', 'despite'
]

const PAST_TENSE_VERBS = ['was', 'were', 'achieved', 'faced', 'had', 'encountered', 'accomplished',
  'demonstrated', 'overcame', 'resulted', 'attracted', 'exceeded', 'struggled', 'caused', 'impacted']

function fallbackEvaluate(text) {
  const lower = text.toLowerCase()
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length

  // Check for past tense verbs
  const pastTenseCount = PAST_TENSE_VERBS.filter(v => lower.includes(v)).length

  // Check for success and challenge mentions
  const hasSuccesses = lower.includes('success') || lower.includes('achieved') || lower.includes('accomplished')
  const hasChallenges = lower.includes('challenge') || lower.includes('faced') || lower.includes('encountered') || lower.includes('difficulty')

  // Check for specific details (numbers)
  const hasNumbers = /\d+/.test(text)
  // Check for names (capitalised words after first)
  const hasCapitalisedWords = (text.match(/\b[A-Z][a-z]+\b/g) || []).length > 2

  let score = 1
  if (pastTenseCount >= 2 && hasSuccesses && hasChallenges && wordCount >= 30) score = 2
  if (pastTenseCount >= 3 && hasSuccesses && hasChallenges && (hasNumbers || hasCapitalisedWords) && wordCount >= 50) score = 3
  if (pastTenseCount >= 4 && hasSuccesses && hasChallenges && hasNumbers && hasCapitalisedWords && wordCount >= 70) score = 4

  const levelMap = { 1: 'A2', 2: 'B1', 3: 'B2', 4: 'C1' }
  const feedbackMap = {
    1: 'Your writing covers the basics. Try to add more specific details and ensure you use past tense throughout.',
    2: 'Good effort! You have included successes and challenges. Add specific evidence such as numbers or names to strengthen your report.',
    3: 'Well done! Your section includes specific evidence. To reach C1 level, add more precise quantitative data and sophisticated language.',
    4: 'Excellent work! Your Successes & Challenges section is comprehensive, specific, and well-structured.'
  }

  return {
    score,
    level: levelMap[score],
    feedback: feedbackMap[score],
    strengths: pastTenseCount >= 2 ? ['Good use of past tense'] : [],
    improvements: wordCount < 50 ? ['Add more detail and specific evidence'] : []
  }
}

export default function Phase6SP1Step4Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'main' })
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      setEvaluation({
        score: 1,
        level: 'A2',
        feedback: 'Please write your Successes & Challenges section before submitting.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase6API.evaluateSuccessesChallenges(trimmed)
      if (result && result.data) {
        const data = result.data
        const score = data.score || 2
        const level = data.level || 'B1'
        setEvaluation({
          score,
          level,
          feedback: data.feedback || 'Good work on your Successes & Challenges section.',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        sessionStorage.setItem('phase6_sp1_step4_interaction2_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step4_interaction2_level', level)
      } else {
        throw new Error('Invalid response')
      }
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const fallback = fallbackEvaluate(trimmed)
      setEvaluation(fallback)
      sessionStorage.setItem('phase6_sp1_step4_interaction2_score', fallback.score.toString())
      sessionStorage.setItem('phase6_sp1_step4_interaction2_level', fallback.level)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/4/interaction/3')
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
          Step 4: Elaborate - Interaction 2
        </Typography>
        <Typography variant="body1">
          Write the Successes &amp; Challenges Section
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
              Emna
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "Now, write the 'Successes &amp; Challenges' section using the guided template with examples.
              Follow the template to write a balanced section describing 3 successes and 2-3 challenges with
              how they were handled. Use past tense, balance positive and negative, and add simple evidence (numbers, quotes)."
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Mini Template */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0fdf4' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1e8449' }}>
          Section Template
        </Typography>
        {MINI_TEMPLATE.map((part) => (
          <Box key={part.section} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>
              {part.section}:
            </Typography>
            {part.lines.map((line, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  ml: 2,
                  p: 0.75,
                  mb: 0.5,
                  backgroundColor: 'white',
                  border: '1px dashed #27ae60',
                  borderRadius: 1,
                  fontStyle: 'italic'
                }}
              >
                {line}
              </Typography>
            ))}
          </Box>
        ))}
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Writing Instructions:
        </Typography>
        <Typography variant="body2">• Write at least 2 successes and 2 challenges</Typography>
        <Typography variant="body2">• Use past tense throughout (e.g., "The event attracted...", "The team faced...")</Typography>
        <Typography variant="body2">• Include specific details: numbers (e.g., "500 attendees"), names (e.g., "the lighting team")</Typography>
      </Alert>

      {/* Target Vocabulary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Try to use these vocabulary words:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {TARGET_VOCABULARY.map((word) => (
            <Chip
              key={word}
              label={word}
              size="small"
              sx={{ borderColor: '#27ae60', color: '#1e8449' }}
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      {/* Writing Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Your Successes &amp; Challenges Section
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Successes:
1.
2.

Challenges:
1.
2. "
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color={wordCount >= 40 ? 'success.main' : 'text.secondary'}>
              Word count: {wordCount} {wordCount >= 40 ? '(good length)' : '(aim for 40+ words)'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)' },
              '&:disabled': { background: '#ccc' }
            }}
          >
            {loading ? 'Evaluating...' : 'Submit Section'}
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
            backgroundColor: '#f0fdf4',
            border: '2px solid #27ae60'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#27ae60', mr: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#1e8449' }}>
                Section Evaluated!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: {evaluation.score} / 4
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <Alert severity="success" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">Strengths:</Typography>
              {evaluation.strengths.map((s, i) => (
                <Typography key={i} variant="body2">• {s}</Typography>
              ))}
            </Alert>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <Alert severity="info" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">Areas to Improve:</Typography>
              {evaluation.improvements.map((imp, i) => (
                <Typography key={i} variant="body2">• {imp}</Typography>
              ))}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            fullWidth
            sx={{
              mt: 2,
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)' }
            }}
          >
            Continue to Interaction 3
          </Button>
        </Paper>
      )}
    </Box>
  )
}
