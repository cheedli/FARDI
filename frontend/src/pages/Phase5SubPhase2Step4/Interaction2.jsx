import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const QUEUE_TEMPLATE = `Step 1 (Preparation): Get ready.
Example: First, position yourself at the queue area and smile.

Step 2 (Welcome & Explain): Welcome and inform.
Example: Welcome guests and explain: "Please wait here - the line moves quickly."

Step 3 (Manage Flow): Keep order.
Example: Then, guide people to stay in line and move forward when space opens.

Step 4 (Safety): Safety first.
Example: Be careful: remind guests to keep pathways clear and watch for children.`

export default function Phase5SubPhase2Step4Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 2, context: 'main' })
  const [instructions, setInstructions] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!instructions.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateQueueManagerInstructions(instructions.trim())
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step4_interaction2_score', result.data.score || '1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/4/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 4: Elaborate - Interaction 2
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Now, write instructions for a queue manager volunteer using this guided template with examples."
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {QUEUE_TEMPLATE}
        </Typography>
      </Paper>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder="Write 5-10 bullet-point instructions for managing queues..."
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
          <Button variant="contained" color="primary" onClick={handleContinue} fullWidth sx={{ mt: 2 }}>
            Continue to Interaction 3
          </Button>
        </Paper>
      )}
    </Box>
  )
}
