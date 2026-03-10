import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const TEMPLATE = `Step 1 (Greeting): Start with welcome.
Example: First, warmly welcome every guest: "Welcome to the Global Cultures Festival!"

Step 2 (Check): Check entry.
Example: Then, politely check tickets or registration.

Step 3 (Guide): Direct them.
Example: Next, guide them to the information desk or main area if needed.

Step 4 (Safety): Safety reminder.
Example: Please be careful with queues and pathways - keep them clear.

Step 5 (Help): Offer help.
Example: If guests have questions, please help or direct them to the right person.

Step 6 (Closing): Thank them.
Example: Thank every guest for coming and wish them a great time.`

export default function Phase5SubPhase2Step4Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 1, context: 'main' })
  const [instructions, setInstructions] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!instructions.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateEntranceInstructions(instructions.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step4_interaction1_score', result.data.score || '1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/4/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 4: Elaborate - Interaction 1
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="First, write instructions for an entrance volunteer using this guided template with examples."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {TEMPLATE}
        </Typography>
      </Alert>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder="Write 5-10 bullet-point or numbered instructions for welcoming guests at the entrance..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !instructions.trim()}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Instructions'}
          </Button>
        </Paper>
      )}

      {submitted && evaluation && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter' }}>
          <Typography variant="h6" gutterBottom>
            Score: {evaluation.score}/4 | Level: {evaluation.level}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
          <Button variant="contained" color="primary" onClick={handleContinue} fullWidth>
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
