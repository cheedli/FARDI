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
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 2: Explore
 * Interaction 3: Sushi Spell + Revision
 * Play game again, then improve one sentence using a new term
 */

const TARGET_WORDS = ['emergency', 'backup', 'announce', 'update', 'communicate', 'contingency']

const EXPECTED_EXAMPLES = {
  A2: 'Add communicate.',
  B1: 'Add "We communicate to everyone."',
  B2: 'Revised: "We are communicating transparently with all stakeholders."',
  C1: 'Revised: "We are communicating transparently and proactively to all stakeholders to maintain trust during this contingency."'
}

export default function Phase5Step2Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [originalSentence, setOriginalSentence] = useState('')
  const [revisedSentence, setRevisedSentence] = useState('')
  const [newTerm, setNewTerm] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!revisedSentence.trim() || !newTerm.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please provide both the revised sentence and the new term you used.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateRevision(
        originalSentence.trim(),
        revisedSentence.trim(),
        newTerm.trim()
      )

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good revision!',
          improvement_detected: data.improvement_detected || false
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step2_interaction3_game_score', '1')
        sessionStorage.setItem('phase5_step2_interaction3_revision_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step2_interaction3_level', data.level || 'A2')
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
      // Fallback
      const revisedLower = revisedSentence.toLowerCase()
      const newTermLower = newTerm.toLowerCase()
      const hasTerm = newTermLower in revisedLower
      const wordCount = revisedSentence.split(/\s+/).length
      const isLonger = revisedSentence.length > originalSentence.length

      let score = 2
      let level = 'A2'
      if (wordCount <= 3 && hasTerm) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 8 && hasTerm) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 15 && hasTerm && isLonger) {
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
        feedback: `Your revision shows ${level} level improvement.`,
        improvement_detected: isLonger && hasTerm
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step2_interaction3_game_score', '1')
      sessionStorage.setItem('phase5_step2_interaction3_revision_score', score.toString())
      sessionStorage.setItem('phase5_step2_interaction3_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/score')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 3
        </Typography>
        <Typography variant="body1">
          Revise your announcement after the game
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Revise your announcement after the game. Play Sushi Spell again, then improve one sentence using a new term (e.g., 'communicate', 'contingency')."
        />
      </Paper>

      {/* Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Step 1: Play Sushi Spell Again
          </Typography>
          <SushiSpellGame
            step={2}
            interaction={3}
            targetTime={120} // 2 minutes
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />
        </Paper>
      )}

      {/* Revision Section */}
      {gameCompleted && !submitted && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Step 2: Revise Your Announcement
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Choose one sentence from your announcement and improve it using a new vocabulary term like: <strong>communicate, contingency, update</strong>
              </Typography>
            </Alert>

            {/* Expected Examples */}
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: 'warning.lighter' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Expected Revision Examples (by level):
              </Typography>
              <Stack spacing={1}>
                {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                  <Box key={level}>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {level}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>
                      "{example}"
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            <TextField
              fullWidth
              variant="outlined"
              label="Original Sentence"
              placeholder="Paste the sentence you want to revise..."
              value={originalSentence}
              onChange={(e) => setOriginalSentence(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="New Term Used"
              placeholder="e.g., communicate, contingency, update..."
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              label="Revised Sentence"
              placeholder="Write your improved sentence here..."
              value={revisedSentence}
              onChange={(e) => setRevisedSentence(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !revisedSentence.trim() || !newTerm.trim()}
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Evaluating...' : 'Submit Revision'}
            </Button>
          </Paper>
        </>
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
                {evaluation.success ? 'Revision Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.improvement_detected && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Great improvement! You successfully enhanced your sentence with the new vocabulary term.
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
            Continue to Score Calculation
          </Button>
        </Paper>
      )}
    </Box>
  )
}
