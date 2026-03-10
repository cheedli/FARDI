import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

export default function Phase5SubPhase2Step5Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'main' })
  const [originalText, setOriginalText] = useState(sessionStorage.getItem('phase5_subphase2_step5_grammar_corrected') || '')
  const [improvedText, setImprovedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!improvedText.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateFullImprovement(originalText, improvedText.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step5_interaction3_score', result.data.score || '1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/score')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 5: Evaluate - Interaction 3
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Excellent grammar! Now improve coherence/cohesion, sequencing clarity, politeness, tone, vocabulary, and overall instructional effectiveness in the corrected texts. Add connectors, improve sequencing, enhance politeness, upgrade vocabulary, and add safety reminders."
        />
      </Paper>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Grammar-Corrected Text"
            value={originalText}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            label="Fully Improved Text"
            placeholder="First, please warmly welcome guests: 'Welcome to the Global Cultures Festival!' Then, politely check tickets..."
            value={improvedText}
            onChange={(e) => setImprovedText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !improvedText.trim()}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Full Improvement'}
          </Button>
        </Paper>
      )}

      {submitted && evaluation && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter' }}>
          <Typography variant="h6" gutterBottom>
            Score: {evaluation.score}/4 | Level: {evaluation.level}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleContinue} fullWidth sx={{ mt: 2 }}>
            Continue to Final Score Calculation
          </Button>
        </Paper>
      )}
    </Box>
  )
}
