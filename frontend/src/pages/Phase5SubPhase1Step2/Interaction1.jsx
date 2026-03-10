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
  Chip,
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 2: Explore
 * Interaction 1: Sushi Spell + Announcement Writing
 * Play game, then write 3-6 sentences announcing the issue and solution
 */

const TARGET_WORDS = ['emergency', 'backup', 'announce', 'update', 'communicate']

const EXPECTED_EXAMPLES = {
  A2: 'Lights problem. Use backup. Come festival.',
  B1: 'Dear guests, there is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you for understanding.',
  B2: 'Urgent update: Due to a technical issue, the main stage lighting has temporarily failed. Our team is implementing the backup lighting system and expects resolution within 20 minutes. The event will proceed as scheduled. We appreciate your patience and understanding.',
  C1: 'Immediate notice to all attendees: An unexpected technical failure has affected the main stage lighting system just one hour before opening. Our contingency team is actively deploying the pre-tested backup lighting array, with full restoration anticipated within the next 20-25 minutes. The festival schedule remains unchanged, and we are committed to delivering the full cultural experience you expect. We sincerely thank you for your patience and understanding during this brief disruption.'
}

export default function Phase5Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    setGameCompleted(true)
    // Game completion is tracked automatically
  }

  const handleSubmit = async () => {
    if (!announcement.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your announcement.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateAnnouncement(announcement.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          vocabulary_used: data.vocabulary_used || [],
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        // Store scores
        sessionStorage.setItem('phase5_step2_interaction1_game_score', '1') // Game completion
        sessionStorage.setItem('phase5_step2_interaction1_writing_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step2_interaction1_level', data.level || 'A2')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A2',
          feedback: result.error || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation
      const announcementLower = announcement.toLowerCase()
      const wordCount = announcement.split(/\s+/).length
      const sentenceCount = announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const hasBackup = announcementLower.includes('backup')
      const hasPolite = ['thank', 'appreciate', 'please', 'sorry', 'understanding'].some(w => announcementLower.includes(w))

      let score = 2
      let level = 'A2'
      if (wordCount <= 10 && sentenceCount <= 3) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 30 && sentenceCount <= 6 && hasBackup) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 50 && sentenceCount >= 4 && hasBackup && hasPolite) {
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
        feedback: `Your announcement shows ${level} level understanding.`
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step2_interaction1_game_score', '1')
      sessionStorage.setItem('phase5_step2_interaction1_writing_score', score.toString())
      sessionStorage.setItem('phase5_step2_interaction1_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 1
        </Typography>
        <Typography variant="body1">
          Play Sushi Spell, then write a short announcement
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Play Sushi Spell to activate vocabulary, then write a short announcement. Write 3-6 sentences announcing the issue and solution."
        />
      </Paper>

      {/* Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Step 1: Play Sushi Spell
          </Typography>
          <SushiSpellGame
            step={2}
            interaction={1}
            targetTime={120} // 2 minutes
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />
        </Paper>
      )}

      {/* Writing Section */}
      {gameCompleted && !submitted && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Step 2: Write Your Announcement
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Write 3-6 sentences announcing the lighting problem and the solution. Use vocabulary terms like: <strong>{TARGET_WORDS.join(', ')}</strong>
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

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Write your announcement here (3-6 sentences)..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Words: {announcement.split(/\s+/).filter(w => w.length > 0).length} |
                Sentences: {announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !announcement.trim()}
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Evaluating...' : 'Submit Announcement'}
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
                {evaluation.success ? 'Announcement Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Vocabulary Terms Used:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.vocabulary_used.map((term, idx) => (
                  <Chip key={idx} label={term} color="success" size="small" />
                ))}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
