import React, { useState, useEffect } from 'react'
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
  Chip,
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 2: Explore - Interaction 2
 * Explain writing choices using "because"
 */

const SAMPLE_SUMMARY = 'The festival was successful because many students participated. However, we faced challenges with timing.'

const EXPLANATION_PROMPTS = [
  'Why did you start with a positive point in your summary?',
  'Why did you mention a challenge in the report?',
  'Why is it important to include both good and bad things in a report?'
]

const USEFUL_PHRASES = ['because', 'chose', 'decided', 'wanted', 'important', 'helps', 'shows', 'allows']

const determineLevel = (text) => {
  const lower = text.toLowerCase()
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  const hasBecause = lower.includes('because')
  const hasChoiceWords = ['chose', 'decided', 'wanted', 'important', 'helps', 'shows'].some(w => lower.includes(w))
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  if (wordCount < 10) return { score: 1, level: 'A2' }
  if (hasBecause && wordCount >= 10 && wordCount < 20) return { score: 2, level: 'A2' }
  if (hasBecause && hasChoiceWords && wordCount >= 20 && sentenceCount >= 2) return { score: 3, level: 'B1' }
  if (hasBecause && hasChoiceWords && wordCount >= 35 && sentenceCount >= 3) return { score: 4, level: 'B2' }
  return { score: 2, level: 'A2' }
}

export default function Phase6SP1Step2Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 2, context: 'main' })
  const [trialSummary, setTrialSummary] = useState('')
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('phase6_sp1_step2_trial_summary')
    if (saved) setTrialSummary(saved)
  }, [])

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your explanation before submitting.',
        strengths: [],
        improvements: ['Write at least one reason using "because"']
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase6API.evaluateWritingChoice(explanation.trim())

      if (result && result.data) {
        const data = result.data
        const score = data.score || 2
        const level = data.level || 'A2'
        setEvaluation({
          success: true,
          score,
          level,
          feedback: data.feedback || 'Good explanation!',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step2_interaction2_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step2_interaction2_level', level)
      } else {
        throw new Error('No data returned')
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation
      const { score, level } = determineLevel(explanation)
      const lower = explanation.toLowerCase()
      const hasBecause = lower.includes('because')

      setEvaluation({
        success: true,
        score,
        level,
        feedback: hasBecause
          ? `Good work! You used "because" to explain your choices. Your explanation shows ${level} level understanding.`
          : `Try to use "because" to explain your reasons. Your explanation shows ${level} level understanding.`,
        strengths: hasBecause ? ['Used "because" to give reasons'] : [],
        improvements: hasBecause ? ['Add more specific details about why you made each choice'] : ['Use "because" to explain your reasons']
      })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step2_interaction2_score', score.toString())
      sessionStorage.setItem('phase6_sp1_step2_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/2/interaction/3')
  }

  const wordCount = explanation.split(/\s+/).filter(w => w.length > 0).length

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
          Step 2: Explore - Interaction 2
        </Typography>
        <Typography variant="body1">
          Explain Your Writing Choices
        </Typography>
      </Paper>

      {/* Character Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="Why did you choose to write your summary that way? Explain one choice you made (e.g., 'I wrote about successes first because positive') and why it is good for a report. Use words from the game and say 'because...'"
        />
      </Paper>

      {/* Sample Summary Display */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#27ae60', fontWeight: 'bold' }}>
          Sample Summary to Analyze
        </Typography>
        <Card variant="outlined" sx={{ borderColor: '#27ae60', borderLeft: '4px solid #27ae60', mb: 2 }}>
          <CardContent>
            <Typography variant="body1" fontStyle="italic">
              "{SAMPLE_SUMMARY}"
            </Typography>
          </CardContent>
        </Card>

        {trialSummary && (
          <>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Your Trial Summary (from Interaction 1):
            </Typography>
            <Card variant="outlined" sx={{ borderColor: '#2980b9', borderLeft: '4px solid #2980b9', mb: 2 }}>
              <CardContent>
                <Typography variant="body1" fontStyle="italic" color="text.secondary">
                  "{trialSummary}"
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Paper>

      {/* Writing Prompts */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          Answer these questions in your explanation (2-3 reasons using "because"):
        </Typography>
        {EXPLANATION_PROMPTS.map((prompt, idx) => (
          <Typography key={idx} variant="body2">
            {idx + 1}. {prompt}
          </Typography>
        ))}
      </Alert>

      {/* Useful Phrases */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f0faf4', borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="text.secondary">
          Useful words and phrases:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {USEFUL_PHRASES.map((phrase, idx) => (
            <Chip
              key={idx}
              label={phrase}
              size="small"
              variant="outlined"
              sx={{ borderColor: '#27ae60', color: '#27ae60' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#27ae60', fontWeight: 'bold' }}>
          Your Explanation
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder='Example: "I started with a positive point because it is important to show what went well first. I mentioned the challenge because readers need to know what to improve next time. I chose this structure because it helps the reader understand the full picture."'
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount}
          </Typography>
          <Typography
            variant="caption"
            color={explanation.toLowerCase().includes('because') ? 'success.main' : 'warning.main'}
          >
            {explanation.toLowerCase().includes('because') ? '"because" used ✓' : 'Remember to use "because"'}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || explanation.trim().length < 10}
            fullWidth
            size="large"
            sx={{
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' }
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
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
              <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'}>
                {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: <strong>{evaluation.level}</strong> | Score: <strong>{evaluation.score}/4</strong>
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="success.dark">
                Strengths:
              </Typography>
              <Stack spacing={0.5}>
                {evaluation.strengths.map((s, idx) => (
                  <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    {s}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="warning.dark">
                Areas to Improve:
              </Typography>
              <Stack spacing={0.5}>
                {evaluation.improvements.map((imp, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary">
                    • {imp}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' }
            }}
          >
            Continue to Interaction 3
          </Button>
        </Paper>
      )}
    </Box>
  )
}
