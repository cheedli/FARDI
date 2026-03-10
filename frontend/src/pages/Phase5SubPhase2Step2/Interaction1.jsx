import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 2: Explore
 * Interaction 1: Sushi Spell + Write Instructions
 * Play Sushi Spell (spell 5 words), then write 3-8 bullet points for entrance volunteer
 */

const TARGET_WORDS = ['please', 'thank you', 'first', 'then', 'careful']

export default function Phase5SubPhase2Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    setGameCompleted(true)
    sessionStorage.setItem('phase5_subphase2_step2_interaction1_game_score', gameData.score || '0')
  }

  const handleSubmit = async () => {
    if (!instructions.trim()) {
      return
    }

    setLoading(true)
    try {
      // Evaluate writing (A2=1, B1=2, B2=3, C1=4)
      const instructionsLower = instructions.toLowerCase()
      const hasPlease = instructionsLower.includes('please')
      const hasThankYou = instructionsLower.includes('thank you') || instructionsLower.includes('thank')
      const hasSequencing = instructionsLower.includes('first') || instructionsLower.includes('then')
      const wordCount = instructions.split(/\s+/).length

      let score = 1
      let level = 'A2'
      if (wordCount >= 50 && hasPlease && hasThankYou && hasSequencing) {
        score = 4
        level = 'C1'
      } else if (wordCount >= 30 && hasPlease && hasSequencing) {
        score = 3
        level = 'B2'
      } else if (wordCount >= 15 && (hasPlease || hasThankYou) && hasSequencing) {
        score = 2
        level = 'B1'
      }

      setEvaluation({ success: true, score, level })
      setSubmitted(true)
      sessionStorage.setItem('phase5_subphase2_step2_interaction1_score', score.toString())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/2/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 2: Explore - Interaction 1
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="First, play Sushi Spell to activate vocabulary, then write simple instructions for an entrance volunteer. Play the game (spell 5 words: please, thank you, first, then, careful), then write 3-8 bullet points or short sentences giving instructions for welcoming guests at the entrance."
        />
      </Paper>

      {!gameCompleted && (
        <SushiSpellGame
          step={2}
          interaction={1}
          subphase={2}
          targetTime={120}
          targetWords={TARGET_WORDS}
          onComplete={handleGameComplete}
        />
      )}

      {gameCompleted && !submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Now Write Your Instructions
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Write 3-8 bullet points or short sentences giving instructions for welcoming guests at the entrance..."
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
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
