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
  Divider,
  Grid
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5: Evaluate
 * Interaction 1: Spelling Correction
 */

const FAULTY_TEXT = `The Globbal Cultures Festivval was an incredble sucess. We acheived our goal of celbrating diversity and the studants loved every momment. The organizors did excelent work and evryone enjoyed the performences.`

const SPELLING_ERRORS = [
  { wrong: 'Globbal', correct: 'Global' },
  { wrong: 'Festivval', correct: 'Festival' },
  { wrong: 'incredble', correct: 'incredible' },
  { wrong: 'sucess', correct: 'success' },
  { wrong: 'acheived', correct: 'achieved' },
  { wrong: 'celbrating', correct: 'celebrating' },
  { wrong: 'studants', correct: 'students' },
  { wrong: 'momment', correct: 'moment' },
  { wrong: 'organizors', correct: 'organizers' },
  { wrong: 'excelent', correct: 'excellent' },
  { wrong: 'evryone', correct: 'everyone' },
  { wrong: 'performences', correct: 'performances' }
]

export default function Phase6SubPhase1Step5Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'main' })
  const [correctedText, setCorrectedText] = useState(FAULTY_TEXT)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!correctedText.trim()) return

    setLoading(true)

    try {
      const result = await phase6API.evaluateSpellingCorrection(FAULTY_TEXT, correctedText.trim())

      if (result && result.score !== undefined) {
        const score = result.score || 2
        const level = result.level || 'A2'
        setEvaluation({
          success: true,
          score,
          level,
          feedback: result.feedback || 'Good spelling corrections!',
          corrections_found: result.corrections_found || [],
          missed_errors: result.missed_errors || []
        })
        sessionStorage.setItem('phase6_sp1_step5_interaction1_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step5_interaction1_level', level)
        sessionStorage.setItem('phase6_sp1_step5_spelling_corrected_text', correctedText.trim())
      } else {
        throw new Error('Invalid API response')
      }
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)

      // Fallback: count how many known errors were corrected
      const correctedLower = correctedText.toLowerCase()
      let correctionsMade = 0
      const foundCorrections = []
      const missedErrors = []

      SPELLING_ERRORS.forEach(({ wrong, correct }) => {
        const wrongLower = wrong.toLowerCase()
        const correctLower = correct.toLowerCase()
        if (!correctedLower.includes(wrongLower) && correctedLower.includes(correctLower)) {
          correctionsMade++
          foundCorrections.push(`${wrong} → ${correct}`)
        } else if (correctedLower.includes(wrongLower)) {
          missedErrors.push(wrong)
        }
      })

      let score = 1
      let level = 'A2'
      if (correctionsMade >= 10) { score = 4; level = 'C1' }
      else if (correctionsMade >= 8) { score = 3; level = 'B2' }
      else if (correctionsMade >= 5) { score = 2; level = 'B1' }
      else { score = 1; level = 'A2' }

      setEvaluation({
        success: true,
        score,
        level,
        feedback: `You corrected ${correctionsMade} out of ${SPELLING_ERRORS.length} spelling errors. ${level} level performance.`,
        corrections_found: foundCorrections,
        missed_errors: missedErrors
      })
      sessionStorage.setItem('phase6_sp1_step5_interaction1_score', score.toString())
      sessionStorage.setItem('phase6_sp1_step5_interaction1_level', level)
      sessionStorage.setItem('phase6_sp1_step5_spelling_corrected_text', correctedText.trim())
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/5/interaction/2')
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
          Phase 6: Reflection & Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 1
        </Typography>
        <Typography variant="body1">
          Spelling Correction - Find and fix all spelling mistakes
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Here are faulty post-event report sections with mistakes. First, correct only spelling errors. Look for errors like 'succes', 'challange', 'feedbak', 'improv', 'recomend', 'sumary', 'achievment'."
        />
      </Paper>

      {/* Hint chips */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f0fdf4' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SpellcheckIcon sx={{ color: '#27ae60', mr: 1 }} />
          <Typography variant="subtitle2" fontWeight="bold" color="#1e8449">
            Some words to look out for (misspelled versions):
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {SPELLING_ERRORS.slice(0, 6).map(({ wrong }, idx) => (
            <Chip
              key={idx}
              label={wrong}
              size="small"
              variant="outlined"
              color="error"
            />
          ))}
        </Box>
      </Paper>

      {/* Correction Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1e8449', fontWeight: 'bold' }}>
            Correct the Spelling Errors
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              The text below contains spelling mistakes. Edit it directly to correct the spelling errors only. Do not change grammar or style yet.
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            {/* Original */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error">
                Original (Faulty) Text:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#fff5f5',
                  border: '1px solid #ffcdd2',
                  borderRadius: 1,
                  minHeight: 160,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {FAULTY_TEXT}
              </Box>
            </Grid>

            {/* Editable */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
                Your Corrected Version:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={7}
                variant="outlined"
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#27ae60' },
                    '&:hover fieldset': { borderColor: '#1e8449' },
                    '&.Mui-focused fieldset': { borderColor: '#27ae60' }
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Word count: {correctedText.trim().split(/\s+/).filter(Boolean).length}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Instruction: Find and correct at least 6 spelling mistakes. There are 12 total errors to find.
              </Typography>
            </Alert>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !correctedText.trim()}
              fullWidth
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SpellcheckIcon />}
              sx={{
                background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)' }
              }}
            >
              {loading ? 'Evaluating Spelling...' : 'Submit Spelling Corrections'}
            </Button>
          </Box>
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
            border: '2px solid #27ae60',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#27ae60', mr: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#1e8449' }}>
                Spelling Corrections Evaluated!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: {evaluation.score} / 4
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.corrections_found && evaluation.corrections_found.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Corrections Made:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.corrections_found.map((correction, idx) => (
                  <Chip key={idx} label={correction} color="success" size="small" />
                ))}
              </Box>
            </Box>
          )}

          {evaluation.missed_errors && evaluation.missed_errors.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">Still Misspelled:</Typography>
              {evaluation.missed_errors.map((err, idx) => (
                <Typography key={idx} variant="body2">- {err}</Typography>
              ))}
            </Alert>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)' }
            }}
          >
            Continue to Interaction 2: Grammar Correction
          </Button>
        </Paper>
      )}
    </Box>
  )
}
