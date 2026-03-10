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
  Link
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 3: Explain
 * Interaction 1: Wordshake + Define Contingency
 * Watch videos, then define 'contingency' in your own words
 */

const TARGET_WORDS = ['emergency', 'contingency', 'backup', 'immediate', 'announce', 'update', 'communicate', 'resolve']

const EXPECTED_EXAMPLES = {
  A2: 'Contingency is extra plan.',
  B1: 'A contingency is an extra plan for problems, like backup lights in the video when main lights fail.',
  B2: 'A contingency plan is a prepared alternative action or resource (such as backup lighting) that is activated when the primary plan fails, as shown in the video\'s event management example.',
  C1: 'In event crisis management, a contingency plan constitutes a pre-established protocol or resource (e.g., backup systems) designed to mitigate disruption, maintain operational continuity, and preserve stakeholder confidence, as exemplified in the video through rapid activation of alternative lighting solutions.'
}

const VIDEO_LINKS = [
  { url: 'https://youtu.be/30SXTxGs-WM?si=iQh0li0bQ03g7xNa', label: 'Video 1: Crisis Communication Basics' },
  { url: 'https://youtu.be/cqW4IfNv1PQ?si=s4x4cSFLA6xrWp3r', label: 'Video 2: Event Crisis Examples' }
]

export default function Phase5Step3Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [videosWatched, setVideosWatched] = useState(false)
  const [definition, setDefinition] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleVideosReady = () => {
    setVideosWatched(true)
  }

  const handleSubmit = async () => {
    if (!definition.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your definition of contingency.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateDefinition(definition.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          video_reference_detected: data.video_reference_detected || false,
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step3_interaction1_game_score', '1')
        sessionStorage.setItem('phase5_step3_interaction1_definition_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step3_interaction1_level', data.level || 'A2')
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
      // Fallback
      const definitionLower = definition.toLowerCase()
      const wordCount = definition.split(/\s+/).length
      const hasContingency = definitionLower.includes('contingency')
      const hasPlan = ['plan', 'extra', 'backup'].some(w => definitionLower.includes(w))
      const hasVideoRef = ['video', 'backup', 'light', 'example', 'show'].some(w => definitionLower.includes(w))

      let score = 2
      let level = 'A2'
      if (wordCount <= 5 && hasContingency && hasPlan) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 20 && hasContingency && hasPlan && hasVideoRef) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 40 && hasContingency && hasPlan && hasVideoRef) {
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
        feedback: `Your definition shows ${level} level understanding.`,
        video_reference_detected: hasVideoRef
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step3_interaction1_game_score', '1')
      sessionStorage.setItem('phase5_step3_interaction1_definition_score', score.toString())
      sessionStorage.setItem('phase5_step3_interaction1_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Interaction 1
        </Typography>
        <Typography variant="body1">
          Watch videos and define 'contingency' plan
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Watch these two short videos on crisis communication basics during events. While watching, listen for: emergency, contingency, backup, immediate, announce, update, communicate, resolve. After watching, answer: What is a 'contingency' plan in an event crisis?"
        />
      </Paper>

      {/* Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Step 1: Play Wordshake (3 minutes)
          </Typography>
          <WordshakeGame
            step={3}
            interaction={1}
            targetTime={180} // 3 minutes
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />
        </Paper>
      )}

      {/* Video Section */}
      {gameCompleted && !videosWatched && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VideoLibraryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6" color="primary">
              Step 2: Watch Videos
            </Typography>
          </Box>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Watch these videos on crisis communication. Listen for key terms: emergency, contingency, backup, immediate, announce, update, communicate, resolve.
            </Typography>
          </Alert>
          <Stack spacing={2}>
            {VIDEO_LINKS.map((video, idx) => (
              <Link
                key={idx}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ display: 'block', p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}
              >
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {video.label} →
                </Typography>
              </Link>
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVideosReady}
            fullWidth
            sx={{ mt: 2 }}
          >
            I've Watched the Videos - Continue
          </Button>
        </Paper>
      )}

      {/* Definition Section */}
      {videosWatched && !submitted && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Step 3: Define 'Contingency'
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Define 'contingency' in your own words, referencing the video. Use "It is extra plan..." and mention one example from the video (e.g., backup lights).
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
              rows={6}
              variant="outlined"
              placeholder="Write your definition of 'contingency' here, referencing the video..."
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !definition.trim()}
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Evaluating...' : 'Submit Definition'}
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
                {evaluation.success ? 'Definition Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.video_reference_detected && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Great! You referenced the video content in your definition.
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
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
