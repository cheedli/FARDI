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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 3: Explain
 * Interaction 3: Sushi Spell + Term Explanation
 * Play game, then explain one spelled term relating to the videos
 */

const TARGET_WORDS = ['emergency', 'contingency', 'backup', 'announce', 'transparent']

const EXPECTED_EXAMPLES = {
  A2: 'Game for backup.',
  B1: 'Use Sushi Spell for \'backup\' because the video showed extra lights for emergency.',
  B2: 'Incorporate Sushi Spell for rapid spelling of \'transparent\' to make vocabulary engaging, as the email example used open communication to reassure people.',
  C1: 'Leverage Sushi Spell to master \'contingency\' through competitive spelling, relating to the Twitter update\'s reference to pre-planned alternative measures that ensured minimal disruption.'
}

export default function Phase5Step3Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('')
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!selectedTerm || !explanation.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please select a term and write your explanation.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateTermExplanation(selectedTerm.trim(), explanation.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          game_reference_detected: data.game_reference_detected || false,
          video_reference_detected: data.video_reference_detected || false
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step3_interaction3_game_score', '1')
        sessionStorage.setItem('phase5_step3_interaction3_term_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step3_interaction3_level', data.level || 'A2')
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
      const explanationLower = explanation.toLowerCase()
      const termLower = selectedTerm.toLowerCase()
      const wordCount = explanation.split(/\s+/).length
      const hasGame = ['game', 'sushi', 'spell'].some(w => explanationLower.includes(w))
      const hasTerm = explanationLower.includes(termLower)
      const hasVideo = ['video', 'example', 'text', 'twitter', 'email'].some(w => explanationLower.includes(w))

      let score = 2
      let level = 'A2'
      if (wordCount <= 5 && hasTerm) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 15 && hasTerm && hasGame) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 30 && hasTerm && hasGame && hasVideo) {
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
        feedback: `Your explanation shows ${level} level understanding.`,
        game_reference_detected: hasGame,
        video_reference_detected: hasVideo
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step3_interaction3_game_score', '1')
      sessionStorage.setItem('phase5_step3_interaction3_term_score', score.toString())
      sessionStorage.setItem('phase5_step3_interaction3_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/score')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Interaction 3
        </Typography>
        <Typography variant="body1">
          Play Sushi Spell and explain one term
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Use a game to practise more crisis communication terms from the videos! Play Sushi Spell to spell 5 terms like 'emergency', 'contingency', 'backup', 'announce', 'transparent' in 2 minutes, then explain one spelled term relating to the videos."
        />
      </Paper>

      {/* Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Step 1: Play Sushi Spell (2 minutes)
          </Typography>
          <SushiSpellGame
            step={3}
            interaction={3}
            targetTime={120} // 2 minutes
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />
        </Paper>
      )}

      {/* Term Explanation Section */}
      {gameCompleted && !submitted && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Step 2: Explain One Term
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Select one term you spelled in the game and explain it, relating it to the videos you watched. Mention the game and link to video examples.
              </Typography>
            </Alert>

            {/* Expected Examples */}
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: 'warning.lighter' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Expected Response Examples (by level):
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

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select a Term You Spelled</InputLabel>
              <Select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                label="Select a Term You Spelled"
              >
                {TARGET_WORDS.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Write your explanation here, mentioning the game and linking to video examples..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !selectedTerm || !explanation.trim()}
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Evaluating...' : 'Submit Explanation'}
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
                {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.game_reference_detected && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Great! You mentioned the game in your explanation.
            </Alert>
          )}

          {evaluation.video_reference_detected && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Excellent! You linked your explanation to the video examples.
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
