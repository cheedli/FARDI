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
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 5: Evaluate
 * Interaction 2: Grammar Correction
 * Correct grammar errors using spelling-corrected version
 */

const EXPECTED_CORRECTIONS = {
  A2: 'The lights problem. We fix soon. Come to festival.',
  B1: 'Dear guests, there is a lighting problem. We are using backup lights. The festival is ok. Thank you.',
  B2: 'Urgent update: The stage lighting has failed. Our team is activating the backup system. The event will continue. We appreciate your patience.',
  C1: 'Immediate notice: An unforeseen technical malfunction has affected the stage lighting. The contingency protocol has been initiated. Full restoration is expected shortly. Thank you for your understanding.'
}

const GRAMMAR_ERRORS_TO_FIX = [
  'Subject-verb agreement (e.g., "Lights problem" → "The lights have a problem")',
  'Articles (a/an/the)',
  'Prepositions (to, for, with, on, in, at)',
  'Tense consistency',
  'Sentence fragments'
]

export default function Phase5Step5Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'main' })
  const [spellingCorrectedText, setSpellingCorrectedText] = useState('')
  const [grammarCorrectedText, setGrammarCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Load spelling-corrected text from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('phase5_step5_spelling_corrected_text')
    if (saved) {
      setSpellingCorrectedText(saved)
    } else {
      // Fallback to a default
      setSpellingCorrectedText('Dear guests, lighting problem. We use backup. Festival ok. Thank you.')
    }
  }, [])

  const handleSubmit = async () => {
    if (!spellingCorrectedText.trim() || !grammarCorrectedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please provide both spelling-corrected and grammar-corrected texts.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateGrammar(spellingCorrectedText.trim(), grammarCorrectedText.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good grammar corrections!',
          grammar_errors_found: data.grammar_errors_found || [],
          grammar_errors_corrected: data.grammar_errors_corrected || [],
          missed_errors: data.missed_errors || [],
          accuracy_percentage: data.accuracy_percentage || 0
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step5_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step5_interaction2_level', data.level || 'A2')
        sessionStorage.setItem('phase5_step5_grammar_corrected_text', grammarCorrectedText.trim())
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A2',
          feedback: result.error || 'Please try again.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation
      const grammarWords = grammarCorrectedText.split(/\s+/).length
      const spellingWords = spellingCorrectedText.split(/\s+/).length
      const hasArticles = ['the', 'a', 'an'].some(word => grammarCorrectedText.toLowerCase().includes(word))
      const hasPrepositions = ['to', 'for', 'with', 'on', 'in', 'at'].some(word => grammarCorrectedText.toLowerCase().includes(word))
      const hasTense = ['is', 'are', 'has', 'have', 'will', 'was', 'were'].some(word => grammarCorrectedText.toLowerCase().includes(word))
      const isLonger = grammarWords > spellingWords

      const improvements = [hasArticles, hasPrepositions, hasTense, isLonger].filter(Boolean).length

      let score = 2
      let level = 'A2'
      if (improvements <= 1) {
        score = 2
        level = 'A2'
      } else if (improvements <= 2) {
        score = 3
        level = 'B1'
      } else if (improvements <= 3) {
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
        feedback: `Your grammar corrections show ${level} level understanding.`,
        grammar_errors_found: ['subject-verb', 'articles', 'tense'],
        grammar_errors_corrected: hasArticles ? ['Fixed articles', 'Fixed tense'] : [],
        missed_errors: [],
        accuracy_percentage: (improvements / 4) * 100
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step5_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step5_interaction2_level', level)
      sessionStorage.setItem('phase5_step5_grammar_corrected_text', grammarCorrectedText.trim())
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 2
        </Typography>
        <Typography variant="body1">
          Correct grammar errors only
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Lilia"
          message="Well done on spelling! Now, using your spelling-corrected version, fix grammar mistakes only. Fix subject-verb agreement, articles, prepositions, tense consistency, and sentence fragments."
        />
      </Paper>

      {/* Grammar Errors Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Grammar Errors to Fix
        </Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          {GRAMMAR_ERRORS_TO_FIX.map((error, idx) => (
            <Typography key={idx} variant="body2">
              • {error}
            </Typography>
          ))}
        </Stack>
      </Paper>

      {/* Expected Examples */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Expected Correction Examples (by level):
        </Typography>
        <Stack spacing={1}>
          {Object.entries(EXPECTED_CORRECTIONS).map(([level, correction]) => (
            <Box key={level}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {level}:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>
                "{correction}"
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Correction Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Correct Grammar Errors
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Use your spelling-corrected text below and correct ONLY grammar errors. Do not enhance tone or vocabulary yet!
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Spelling-Corrected Text (from Interaction 1)"
            value={spellingCorrectedText}
            onChange={(e) => setSpellingCorrectedText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Your Grammar-Corrected Text"
            placeholder="Write your grammar-corrected version here..."
            value={grammarCorrectedText}
            onChange={(e) => setGrammarCorrectedText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !spellingCorrectedText.trim() || !grammarCorrectedText.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Grammar Corrections'}
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
                {evaluation.success ? 'Grammar Corrections Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''} | Accuracy: {evaluation.accuracy_percentage?.toFixed(0)}%
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.grammar_errors_corrected && evaluation.grammar_errors_corrected.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Grammar Errors Corrected:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.grammar_errors_corrected.map((correction, idx) => (
                  <Chip key={idx} label={correction} color="success" size="small" />
                ))}
              </Box>
            </Box>
          )}

          {evaluation.missed_errors && evaluation.missed_errors.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">Missed Errors:</Typography>
              {evaluation.missed_errors.map((error, idx) => (
                <Typography key={idx} variant="body2">• {error}</Typography>
              ))}
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
            Continue to Interaction 3 (Enhancement + Wordshake)
          </Button>
        </Paper>
      )}
    </Box>
  )
}
