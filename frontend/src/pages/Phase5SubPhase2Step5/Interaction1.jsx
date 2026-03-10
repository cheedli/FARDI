import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const FAULTY_TEXTS = {
  A2: 'Pleese welcom gests. Furst chek tiket. Then guied.',
  B1: 'Pleese smyle and welcom gests. Furst chek tikets. Then guied to booth. Be cairful.',
  B2: 'Furst, pleese welcom guests warmly. Then chek tikets and guied them. Be cairful with que. Thankk you.',
  C1: 'Begin by ofering a warm welcom: Pleese greet inclusively. Next, veriffy entry polite. Guied clrearly if needed. Emphasise safty. Conclude with appreceation.'
}

export default function Phase5SubPhase2Step5Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 1, context: 'main' })
  const [faultyText, setFaultyText] = useState(FAULTY_TEXTS.B1)
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!correctedText.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateSpellingSubPhase2(faultyText, correctedText.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step5_interaction1_score', result.data.score || '1')
        sessionStorage.setItem('phase5_subphase2_step5_spelling_corrected', correctedText.trim())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 5: Evaluate - Interaction 1
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Here are faulty volunteer instruction texts with mistakes. First, correct only spelling errors. Look for errors like 'pleese', 'thak you', 'furst', 'cairful', 'guied', 'welcom', 'que'."
        />
      </Paper>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Faulty Text (with spelling errors):
            </Typography>
            <Typography variant="body2" component="pre" sx={{ mt: 1, fontFamily: 'monospace' }}>
              {faultyText}
            </Typography>
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Corrected Text (fix spelling only)"
            placeholder="Please welcome guests. First check ticket. Then guide."
            value={correctedText}
            onChange={(e) => setCorrectedText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !correctedText.trim()}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Spelling Corrections'}
          </Button>
        </Paper>
      )}

      {submitted && evaluation && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter' }}>
          <Typography variant="h6" gutterBottom>
            Score: {evaluation.score}/4 | Level: {evaluation.level}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Errors found: {evaluation.errors_found} | Corrections made: {evaluation.corrections_made} | Accuracy: {evaluation.accuracy}%
          </Typography>
          <Button variant="contained" color="primary" onClick={handleContinue} fullWidth>
            Continue to Interaction 2 (Grammar Correction)
          </Button>
        </Paper>
      )}
    </Box>
  )
}
