import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
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

const TARGET_WORDS = ['emergency', 'backup', 'announce', 'update', 'communicate']

const EXPECTED_EXAMPLES = {
  A2: 'Lights problem. Use backup. Come festival.',
  B1: 'Dear guests, there is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you for understanding.',
  B2: 'Urgent update: Due to a technical issue, the main stage lighting has temporarily failed. Our team is implementing the backup lighting system and expects resolution within 20 minutes. The event will proceed as scheduled. We appreciate your patience and understanding.',
  C1: 'Immediate notice to all attendees: An unexpected technical failure has affected the main stage lighting system just one hour before opening. Our contingency team is actively deploying the pre-tested backup lighting array, with full restoration anticipated within the next 20-25 minutes. The festival schedule remains unchanged, and we are committed to delivering the full cultural experience you expect. We sincerely thank you for your patience and understanding during this brief disruption.'
}

export default function Phase5Step2Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
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

  const handleSubmit = async () => {
    if (!announcement.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write your announcement.' })
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
        sessionStorage.setItem('phase5_step2_interaction1_game_score', '1')
        sessionStorage.setItem('phase5_step2_interaction1_writing_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step2_interaction1_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const announcementLower = announcement.toLowerCase()
      const wordCount = announcement.split(/\s+/).length
      const sentenceCount = announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const hasBackup = announcementLower.includes('backup')
      const hasPolite = ['thank', 'appreciate', 'please', 'sorry', 'understanding'].some(w => announcementLower.includes(w))
      let score = 2, level = 'A2'
      if (wordCount <= 10 && sentenceCount <= 3) { score = 2; level = 'A2' }
      else if (wordCount <= 30 && sentenceCount <= 6 && hasBackup) { score = 3; level = 'B1' }
      else if (wordCount <= 50 && sentenceCount >= 4 && hasBackup && hasPolite) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your announcement shows ${level} level understanding.` })
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
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 2: Explore - Interaction 1
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Play Sushi Spell, then write a short announcement
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Play Sushi Spell to activate vocabulary, then write a short announcement. Write 3-6 sentences announcing the issue and solution."
            />
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 1: Play Sushi Spell
              </Typography>
              <SushiSpellGame
                step={2}
                interaction={1}
                targetTime={120}
                targetWords={TARGET_WORDS}
                onComplete={handleGameComplete}
              />
            </Box>
          </motion.div>
        )}

        {gameCompleted && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 2: Write Your Announcement
              </Typography>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Write 3-6 sentences announcing the lighting problem and the solution. Use vocabulary terms like: <strong>{TARGET_WORDS.join(', ')}</strong>
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

              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !announcement.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: loading || !announcement.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  opacity: loading || !announcement.trim() ? 0.6 : 1,
                  '&:hover': !loading && announcement.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Announcement'}
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
                    {evaluation.success ? 'Announcement Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">{evaluation.feedback}</Typography>

              {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">Vocabulary Terms Used:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.vocabulary_used.map((term, idx) => (
                      <Box key={idx} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '10px', px: 1.5, py: 0.5 }}>
                        <Typography variant="body2" sx={{ color: P.green.border }}>{term}</Typography>
                      </Box>
                    ))}
                  </Box>
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
