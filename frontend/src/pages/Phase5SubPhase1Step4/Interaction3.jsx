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
 * Phase 5 Step 4: Elaborate
 * Interaction 3: Sushi Spell + Revision
 * Play game, then revise one sentence using a spelled term and fix mistakes
 */

const TARGET_WORDS = ['emergency', 'contingency', 'backup', 'announce', 'transparent']

const EXPECTED_EXAMPLES = {
  A2: 'Spell backup. Add backup light.',
  B1: 'Use Sushi Spell for \'announce\' - revised: "We announce to everyone" fixed to "We are announcing to all guests".',
  B2: 'Incorporate Sushi Spell for \'transparent\' - revised announcement: "We tell problem" fixed to "We are communicating transparently about the issue".',
  C1: 'Leverage Sushi Spell for \'contingency\' - revised email: Detected passive error in "Backup is use" to "The contingency plan, which includes the backup system, has been activated".'
}

export default function Phase5Step4Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('')
  const [originalSentence, setOriginalSentence] = useState('')
  const [revisedSentence, setRevisedSentence] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!selectedTerm || !originalSentence.trim() || !revisedSentence.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please select a term, provide the original sentence, and write your revision.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateRevisionStep4(
        originalSentence.trim(),
        revisedSentence.trim(),
        selectedTerm.trim()
      )

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good revision!',
          term_used_correctly: data.term_used_correctly || false,
          error_detected: data.error_detected || false,
          improvement_detected: data.improvement_detected || false
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step4_interaction3_game_score', '1')
        sessionStorage.setItem('phase5_step4_interaction3_revision_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step4_interaction3_level', data.level || 'A2')
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
      const termLower = selectedTerm.toLowerCase()
      const wordCount = revisedSentence.split(/\s+/).length
      const hasTerm = revisedLower.includes(termLower)
      const hasGame = ['sushi', 'spell', 'game'].some(w => revisedLower.includes(w))
      const isLonger = revisedSentence.length > originalSentence.length

      let score = 2
      let level = 'A2'
      if (wordCount <= 5 && hasTerm) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 15 && hasTerm && hasGame) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 30 && hasTerm && hasGame && isLonger) {
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
        term_used_correctly: hasTerm,
        error_detected: isLonger,
        improvement_detected: isLonger && hasTerm
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step4_interaction3_game_score', '1')
      sessionStorage.setItem('phase5_step4_interaction3_revision_score', score.toString())
      sessionStorage.setItem('phase5_step4_interaction3_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/4/score')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Elaborate - Interaction 3
        </Typography>
        <Typography variant="body1">
          Play Sushi Spell and revise one sentence
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="To polish your writing, play a game and integrate terms. Play Sushi Spell to spell 5 terms like 'emergency', 'contingency', 'backup', 'announce', 'transparent', then revise one sentence in your text using a spelled term, fixing any mistakes."
        />
      </Paper>

      {/* Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Step 1: Play Sushi Spell (2 minutes)
          </Typography>
          <SushiSpellGame
            step={4}
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
              Step 2: Revise One Sentence
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Select one term you spelled, choose a sentence from your announcement or email, and revise it using the term. Fix any grammar, spelling, or structure mistakes!
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
              variant="outlined"
              label="Original Sentence"
              placeholder="Paste the sentence you want to revise from your announcement or email..."
              value={originalSentence}
              onChange={(e) => setOriginalSentence(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Revised Sentence"
              placeholder="Write your improved sentence here, using the term and fixing mistakes..."
              value={revisedSentence}
              onChange={(e) => setRevisedSentence(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !selectedTerm || !originalSentence.trim() || !revisedSentence.trim()}
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

          {evaluation.term_used_correctly && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Great! You correctly used the term in your revision.
            </Alert>
          )}

          {evaluation.error_detected && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Excellent! You detected and fixed errors in the original sentence.
            </Alert>
          )}

          {evaluation.improvement_detected && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Perfect! Your revision shows clear improvement.
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
