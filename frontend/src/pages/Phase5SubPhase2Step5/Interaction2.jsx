import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

export default function Phase5SubPhase2Step5Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 2, context: 'main' })
  const [originalText, setOriginalText] = useState(sessionStorage.getItem('phase5_subphase2_step5_spelling_corrected') || '')
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!correctedText.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateGrammarSubPhase2(originalText, correctedText.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step5_interaction2_score', result.data.score || '1')
        sessionStorage.setItem('phase5_subphase2_step5_grammar_corrected', correctedText.trim())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 5: Evaluate - Interaction 2
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Lilia"
          message="Good spelling fixes! Now, using your spelling-corrected version, fix grammar mistakes only. Fix errors like subject-verb agreement, articles, imperative form, prepositions, sentence fragments."
        />
      </Paper>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Spelling-Corrected Text"
            value={originalText}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Grammar-Corrected Text"
            placeholder="Please welcome guests. First, check the ticket. Then, guide them."
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
            {loading ? 'Evaluating...' : 'Submit Grammar Corrections'}
          </Button>
        </Paper>
      )}

      {submitted && evaluation && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter' }}>
          <Typography variant="h6" gutterBottom>
            Score: {evaluation.score}/4 | Level: {evaluation.level}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleContinue} fullWidth sx={{ mt: 2 }}>
            Continue to Interaction 3 (Full Improvement)
          </Button>
        </Paper>
      )}
    </Box>
  )
}
