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
  Chip,
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 5: Evaluate
 * Interaction 1: Spelling Correction
 * Correct spelling errors only in faulty crisis texts
 */

const FAULTY_TEXTS = {
  A2: 'Lites problem. We fix soon. Come festivl.',
  B1: 'Dear gests, lighting probelm. We use bakup. Festival ok. Thank you.',
  B2: 'Urgent up-date: Stage lighing fail. Team activat bakup. Event continue. Appreciate patience.',
  C1: 'Imediate notice: Unforseen technicle malfuntion afected stage lighing. Contingincy protocol iniciated. Full restorasion expected shortly. Thank for understanding.'
}

const EXPECTED_CORRECTIONS = {
  A2: 'Lights problem. We fix soon. Come festival.',
  B1: 'Dear guests, lighting problem. We use backup. Festival ok. Thank you.',
  B2: 'Urgent update: Stage lighting failure. Team activating backup. Event continues. Appreciate patience.',
  C1: 'Immediate notice: Unforeseen technical malfunction affected stage lighting. Contingency protocol initiated. Full restoration expected shortly. Thank you for understanding.'
}

const COMMON_SPELLING_ERRORS = [
  'emergancy → emergency',
  'back-up → backup',
  'anounce → announce',
  'up-date → update',
  'resolv → resolve',
  'transperent → transparent',
  'probelm → problem',
  'fixs → fix',
  'lites → lights',
  'festivl → festival',
  'gests → guests',
  'bakup → backup',
  'lighing → lighting',
  'activat → activating',
  'imediate → immediate',
  'unforseen → unforeseen',
  'technicle → technical',
  'malfuntion → malfunction',
  'afected → affected',
  'contingincy → contingency',
  'iniciated → initiated',
  'restorasion → restoration'
]

export default function Phase5Step5Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 1, context: 'main' })
  const [originalText, setOriginalText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Initialize with a default faulty text (B1 level)
  React.useEffect(() => {
    if (!originalText) {
      setOriginalText(FAULTY_TEXTS.B1)
    }
  }, [])

  const handleSubmit = async () => {
    if (!originalText.trim() || !correctedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please provide both original and corrected texts.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateSpelling(originalText.trim(), correctedText.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good spelling corrections!',
          spelling_errors_found: data.spelling_errors_found || [],
          spelling_errors_corrected: data.spelling_errors_corrected || [],
          missed_errors: data.missed_errors || [],
          accuracy_percentage: data.accuracy_percentage || 0
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step5_interaction1_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step5_interaction1_level', data.level || 'A2')
        sessionStorage.setItem('phase5_step5_spelling_corrected_text', correctedText.trim())
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
      const originalLower = originalText.toLowerCase()
      const correctedLower = correctedText.toLowerCase()
      const commonErrors = ['emergancy', 'back-up', 'anounce', 'up-date', 'resolv', 'transperent', 'probelm', 'fixs', 'lites', 'festivl', 'gests', 'bakup', 'lighing', 'activat']
      const errorsFound = commonErrors.filter(err => originalLower.includes(err))
      const errorsCorrected = errorsFound.filter(err => {
        const correction = err.replace('-', '').replace('up-', '').replace('back-', '')
        return correctedLower.includes(correction) || !correctedLower.includes(err)
      })
      const accuracy = errorsFound.length > 0 ? (errorsCorrected.length / errorsFound.length) * 100 : 0

      let score = 2
      let level = 'A2'
      if (errorsFound.length <= 3 && accuracy >= 80) {
        score = 2
        level = 'A2'
      } else if (errorsFound.length <= 6 && accuracy >= 85) {
        score = 3
        level = 'B1'
      } else if (errorsFound.length <= 10 && accuracy >= 90) {
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
        feedback: `You corrected ${errorsCorrected.length} spelling errors. ${level} level accuracy.`,
        spelling_errors_found: errorsFound,
        spelling_errors_corrected: errorsCorrected.map(err => `${err} → corrected`),
        missed_errors: errorsFound.filter(err => !errorsCorrected.includes(err)),
        accuracy_percentage: accuracy
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step5_interaction1_score', score.toString())
      sessionStorage.setItem('phase5_step5_interaction1_level', level)
      sessionStorage.setItem('phase5_step5_spelling_corrected_text', correctedText.trim())
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 1
        </Typography>
        <Typography variant="body1">
          Correct spelling errors only
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Here are faulty crisis messages with mistakes. First, correct only spelling errors. Look for errors like 'emergancy', 'back-up', 'anounce', 'up-date', 'resolv', 'transperent'."
        />
      </Paper>

      {/* Common Spelling Errors Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Common Spelling Errors to Look For
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {COMMON_SPELLING_ERRORS.map((error, idx) => (
            <Chip
              key={idx}
              label={error}
              color="info"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
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
            Correct Spelling Errors
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Read the faulty text below and correct ONLY spelling errors. Do not fix grammar yet!
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Original (Faulty) Text"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Your Spelling-Corrected Text"
            placeholder="Write your spelling-corrected version here..."
            value={correctedText}
            onChange={(e) => setCorrectedText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !originalText.trim() || !correctedText.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Spelling Corrections'}
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
                {evaluation.success ? 'Spelling Corrections Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''} | Accuracy: {evaluation.accuracy_percentage?.toFixed(0)}%
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.spelling_errors_corrected && evaluation.spelling_errors_corrected.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Spelling Errors Corrected:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.spelling_errors_corrected.map((correction, idx) => (
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
            Continue to Interaction 2 (Grammar Correction)
          </Button>
        </Paper>
      )}
    </Box>
  )
}
