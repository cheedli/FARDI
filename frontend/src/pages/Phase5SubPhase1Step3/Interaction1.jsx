import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress, Link } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

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
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [videosWatched, setVideosWatched] = useState(false)
  const [definition, setDefinition] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleVideosReady = () => {
    setVideosWatched(true)
  }

  const handleSubmit = async () => {
    if (!definition.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write your definition of contingency.' })
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
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const definitionLower = definition.toLowerCase()
      const wordCount = definition.split(/\s+/).length
      const hasContingency = definitionLower.includes('contingency')
      const hasPlan = ['plan', 'extra', 'backup'].some(w => definitionLower.includes(w))
      const hasVideoRef = ['video', 'backup', 'light', 'example', 'show'].some(w => definitionLower.includes(w))
      let score = 2, level = 'A2'
      if (wordCount <= 5 && hasContingency && hasPlan) { score = 2; level = 'A2' }
      else if (wordCount <= 20 && hasContingency && hasPlan && hasVideoRef) { score = 3; level = 'B1' }
      else if (wordCount <= 40 && hasContingency && hasPlan && hasVideoRef) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your definition shows ${level} level understanding.`, video_reference_detected: hasVideoRef })
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
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 3: Explain - Interaction 1
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Watch videos and define 'contingency' plan
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Watch these two short videos on crisis communication basics during events. While watching, listen for: emergency, contingency, backup, immediate, announce, update, communicate, resolve. After watching, answer: What is a 'contingency' plan in an event crisis?"
            />
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 1: Play Wordshake (3 minutes)
              </Typography>
              <WordshakeGame
                step={3}
                interaction={1}
                targetTime={180}
                targetWords={TARGET_WORDS}
                onComplete={handleGameComplete}
              />
            </Box>
          </motion.div>
        )}

        {gameCompleted && !videosWatched && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibraryIcon sx={{ fontSize: 36, color: P.orange.border, mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.orange.border }}>
                  Step 2: Watch Videos
                </Typography>
              </Box>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Watch these videos on crisis communication. Listen for key terms: emergency, contingency, backup, immediate, announce, update, communicate, resolve.
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={2}>
                {VIDEO_LINKS.map((video, idx) => (
                  <Link key={idx} href={video.url} target="_blank" rel="noopener noreferrer" underline="none">
                    <Box sx={{
                      ...cardSx(P.blue),
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                    }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: P.blue.border }}>{video.label} →</Typography>
                    </Box>
                  </Link>
                ))}
              </Stack>
              <Box
                component="button"
                onClick={handleVideosReady}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                I've Watched the Videos - Continue
              </Box>
            </Box>
          </motion.div>
        )}

        {videosWatched && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 3: Define 'Contingency'
              </Typography>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Define 'contingency' in your own words, referencing the video. Use "It is extra plan..." and mention one example from the video (e.g., backup lights).
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ...cardSx(P.yellow), mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.yellow.border }}>
                  Expected Response Examples (by level):
                </Typography>
                <Stack spacing={1}>
                  {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                    <Box key={level}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{level}:</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }} color="text.secondary">"{example}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
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
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !definition.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: loading || !definition.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  opacity: loading || !definition.trim() ? 0.6 : 1,
                  '&:hover': !loading && definition.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Definition'}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(evaluation.success ? P.green : P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.yellow.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.border : P.yellow.border }}>
                    {evaluation.success ? 'Definition Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">{evaluation.feedback}</Typography>
              {evaluation.video_reference_detected && (
                <Box sx={{ ...cardSx(P.green), mb: 2 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>
                    Great! You referenced the video content in your definition.
                  </Typography>
                </Box>
              )}
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.green.border,
                  mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Interaction 2
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
