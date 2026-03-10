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
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1: Engage
 * Interaction 2: Festival Reflection Writing
 * Write 3-5 sentences about what went well and what was challenging
 */

const TARGET_VOCABULARY = [
  'success', 'challenge', 'achievement', 'strength', 'weakness', 'positive', 'negative'
]

const PAST_TENSE_VERBS = [
  'was', 'were', 'had', 'achieved', 'faced', 'improved', 'learned',
  'helped', 'went', 'showed', 'provided', 'worked', 'felt', 'made'
]

function fallbackEvaluate(text) {
  const textLower = text.toLowerCase()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length

  const pastTenseCount = PAST_TENSE_VERBS.filter(v => textLower.includes(v)).length
  const vocabCount = TARGET_VOCABULARY.filter(v => textLower.includes(v)).length
  const sentenceCount = sentences.length

  const hasSuccess = textLower.includes('success') || textLower.includes('well') ||
                     textLower.includes('positive') || textLower.includes('achievement') ||
                     textLower.includes('strength')
  const hasChallenge = textLower.includes('challenge') || textLower.includes('difficult') ||
                       textLower.includes('problem') || textLower.includes('weakness') ||
                       textLower.includes('negative')

  let score = 1
  let level = 'A2'
  let feedback = ''
  let strengths = []
  let improvements = []

  if (
    wordCount >= 40 && sentenceCount >= 4 && pastTenseCount >= 4 &&
    vocabCount >= 4 && hasSuccess && hasChallenge
  ) {
    score = 4
    level = 'C1'
    feedback = 'Excellent reflection! Your writing demonstrates sophisticated language use with varied past tense, rich evaluation vocabulary, and a balanced analysis of successes and challenges.'
    strengths = ['Sophisticated vocabulary range', 'Strong past tense usage', 'Well-balanced reflection with both successes and challenges']
    improvements = ['Consider adding specific evidence or examples to support your points']
  } else if (
    wordCount >= 25 && sentenceCount >= 3 && pastTenseCount >= 3 &&
    vocabCount >= 3 && hasSuccess && hasChallenge
  ) {
    score = 3
    level = 'B2'
    feedback = 'Very good reflection! You have written clearly about both successes and challenges using past tense and evaluation vocabulary.'
    strengths = ['Good use of past tense', 'Covers both success and challenge', 'Clear evaluation language']
    improvements = ['Try to add more specific vocabulary like "achievement" or "strength"', 'Aim for more varied sentence structures']
  } else if (
    wordCount >= 15 && sentenceCount >= 3 && pastTenseCount >= 2 &&
    vocabCount >= 2 && (hasSuccess || hasChallenge)
  ) {
    score = 2
    level = 'B1'
    feedback = 'Good reflection! You have written some sentences about the festival using past tense. Try to include both a success and a challenge in your reflection.'
    strengths = ['Uses past tense correctly', 'Shows understanding of reflection writing']
    improvements = ['Include both a success AND a challenge', 'Use more evaluation vocabulary', 'Aim for at least 3-5 sentences']
  } else if (wordCount >= 5 && sentenceCount >= 1) {
    score = 1
    level = 'A2'
    feedback = 'You have started your reflection. Keep going! Try to write more sentences about what went well and what was challenging during the festival.'
    strengths = ['Made an attempt at reflection writing']
    improvements = ['Write at least 3 sentences', 'Use past tense (was, were, had, achieved)', 'Include a success and a challenge']
  }

  return { score, level, feedback, strengths, improvements }
}

export default function Phase6SP1Step1Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'main' })
  const [reflection, setReflection] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const wordCount = reflection.split(/\s+/).filter(w => w.length > 0).length
  const vocabUsed = TARGET_VOCABULARY.filter(v => reflection.toLowerCase().includes(v))

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your reflection before submitting.',
        strengths: [],
        improvements: ['Write at least 3 sentences about the festival']
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase6API.evaluateReflection61(reflection.trim())

      if (result && result.data) {
        const data = result.data
        const evalResult = {
          success: true,
          score: data.score || 1,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        }
        setEvaluation(evalResult)
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step1_interaction2_score', evalResult.score.toString())
        sessionStorage.setItem('phase6_sp1_step1_interaction2_level', evalResult.level)
      } else if (result && result.score !== undefined) {
        const evalResult = {
          success: true,
          score: result.score || 1,
          level: result.level || 'A2',
          feedback: result.feedback || 'Good work!',
          strengths: result.strengths || [],
          improvements: result.improvements || []
        }
        setEvaluation(evalResult)
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step1_interaction2_score', evalResult.score.toString())
        sessionStorage.setItem('phase6_sp1_step1_interaction2_level', evalResult.level)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const fallback = fallbackEvaluate(reflection)
      setEvaluation({ success: fallback.score > 0, ...fallback })
      setSubmitted(fallback.score > 0)
      if (fallback.score > 0) {
        sessionStorage.setItem('phase6_sp1_step1_interaction2_score', fallback.score.toString())
        sessionStorage.setItem('phase6_sp1_step1_interaction2_level', fallback.level)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/1/interaction/3')
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
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 2
        </Typography>
        <Typography variant="body1">
          Share your festival reflection in writing
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="After the game, think about the festival: What was your favorite moment? What was difficult? How did it make you feel?"
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2">
          Share 3–5 sentences about one success and one challenge from the festival. Use past tense.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          <strong>Hint:</strong> Start with "My favorite moment was…" or "The most difficult part was… because…"
        </Typography>
      </Alert>

      {/* Vocabulary Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0faf4', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#27ae60' }}>
            Target Vocabulary
          </Typography>
        </Box>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {TARGET_VOCABULARY.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              sx={{
                backgroundColor: vocabUsed.includes(term) ? '#27ae60' : 'transparent',
                color: vocabUsed.includes(term) ? 'white' : '#27ae60',
                border: '1px solid #27ae60',
                fontWeight: 'bold'
              }}
            />
          ))}
        </Stack>
        {vocabUsed.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1, color: '#27ae60' }}>
            Using {vocabUsed.length} / {TARGET_VOCABULARY.length} target words
          </Typography>
        )}
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Your Festival Reflection
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Assessment Focus:</strong> Past tense usage, evaluation vocabulary,
            balanced reflection (success + challenge), sentence count (3-5 sentences)
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="My favorite moment was the traditional dances because they were beautiful. The most difficult part was the lighting problem, but we fixed it. I felt proud of what our team achieved..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Vocabulary used: {vocabUsed.length}/{TARGET_VOCABULARY.length}
          </Typography>
          <Typography
            variant="caption"
            color={wordCount >= 25 ? 'success.main' : 'text.secondary'}
          >
            {wordCount >= 25 ? 'Good length!' : `Aim for at least 25 words`}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !reflection.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
            }}
          >
            {loading ? 'Evaluating...' : 'Submit Reflection'}
          </Button>
        )}
      </Paper>

      {/* Evaluation Results */}
      {evaluation && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: evaluation.success ? 'success.lighter' : 'warning.lighter',
            border: '2px solid',
            borderColor: evaluation.success ? 'success.main' : 'warning.main',
            borderRadius: 2
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
                {evaluation.success ? 'Reflection Evaluated!' : 'Keep Trying'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: {evaluation.score}/4
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="success.dark" fontWeight="bold">
                Strengths:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {evaluation.strengths.map((strength, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{strength}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="warning.dark" fontWeight="bold">
                Suggestions for Improvement:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {evaluation.improvements.map((improvement, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{improvement}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {submitted && (
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              fullWidth
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
              }}
            >
              Continue to Interaction 3
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
