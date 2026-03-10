import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 2: Explore
 * Interaction 3: Revision with new term
 * Emna: "Now revise your instructions after seeing real examples and playing the game again."
 */

const TARGET_WORDS = ['guide', 'safety', 'welcome', 'careful', 'help']

export default function Phase5SubPhase2Step2Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [original, setOriginal] = useState('')
  const [revised, setRevised] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!revised.trim()) return

    setLoading(true)
    try {
      const result = await phase5API.evaluateRevisionSubPhase2(original, revised)
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step2_interaction3_score', result.data.score || '1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/2/score')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 2: Explore - Interaction 3
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Now revise your instructions after seeing real examples and playing the game again. Play Sushi Spell once more (2 minutes), then improve one or two instructions using a new spelled term (e.g., 'guide', 'safety', 'welcome')."
        />
      </Paper>

      {!gameCompleted && (
        <SushiSpellGame
          step={2}
          interaction={3}
          subphase={2}
          targetTime={120}
          targetWords={TARGET_WORDS}
          onComplete={handleGameComplete}
        />
      )}

      {gameCompleted && !submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Revise Your Instructions
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Original Instruction"
            placeholder="Enter your original instruction..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Revised Instruction (use a new term from the game)"
            placeholder="Enter your improved instruction..."
            value={revised}
            onChange={(e) => setRevised(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !revised.trim()}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Revision'}
          </Button>
        </Paper>
      )}

      {submitted && evaluation && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter' }}>
          <Typography variant="h6" gutterBottom>
            Score: {evaluation.score}/4 | Level: {evaluation.level}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleContinue} fullWidth sx={{ mt: 2 }}>
            Continue to Score Calculation
          </Button>
        </Paper>
      )}
    </Box>
  )
}
