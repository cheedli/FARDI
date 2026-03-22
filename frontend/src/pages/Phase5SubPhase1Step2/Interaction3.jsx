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

const TARGET_WORDS = ['emergency', 'backup', 'announce', 'update', 'communicate', 'contingency']

const EXPECTED_EXAMPLES = {
  A2: 'Add communicate.',
  B1: 'Add "We communicate to everyone."',
  B2: 'Revised: "We are communicating transparently with all stakeholders."',
  C1: 'Revised: "We are communicating transparently and proactively to all stakeholders to maintain trust during this contingency."'
}

export default function Phase5Step2Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [originalSentence, setOriginalSentence] = useState('')
  const [revisedSentence, setRevisedSentence] = useState('')
  const [newTerm, setNewTerm] = useState('')
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
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!revisedSentence.trim() || !newTerm.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please provide both the revised sentence and the new term you used.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateRevision(originalSentence.trim(), revisedSentence.trim(), newTerm.trim())
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
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const revisedLower = revisedSentence.toLowerCase()
      const newTermLower = newTerm.toLowerCase()
      const hasTerm = newTermLower in revisedLower
      const wordCount = revisedSentence.split(/\s+/).length
      const isLonger = revisedSentence.length > originalSentence.length
      let score = 2, level = 'A2'
      if (wordCount <= 3 && hasTerm) { score = 2; level = 'A2' }
      else if (wordCount <= 8 && hasTerm) { score = 3; level = 'B1' }
      else if (wordCount <= 15 && hasTerm && isLonger) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your revision shows ${level} level improvement.`, improvement_detected: isLonger && hasTerm })
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
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 2: Explore - Interaction 3
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Revise your announcement after the game
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Revise your announcement after the game. Play Sushi Spell again, then improve one sentence using a new term (e.g., 'communicate', 'contingency')."
            />
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 1: Play Sushi Spell Again
              </Typography>
              <SushiSpellGame
                step={2}
                interaction={3}
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
                Step 2: Revise Your Announcement
              </Typography>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Choose one sentence from your announcement and improve it using a new vocabulary term like: <strong>communicate, contingency, update</strong>
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ...cardSx(P.yellow), mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.yellow.border }}>
                  Expected Revision Examples (by level):
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
              <TextField fullWidth variant="outlined" label="Original Sentence" placeholder="Paste the sentence you want to revise..." value={originalSentence} onChange={(e) => setOriginalSentence(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth variant="outlined" label="New Term Used" placeholder="e.g., communicate, contingency, update..." value={newTerm} onChange={(e) => setNewTerm(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={3} variant="outlined" label="Revised Sentence" placeholder="Write your improved sentence here..." value={revisedSentence} onChange={(e) => setRevisedSentence(e.target.value)} sx={{ mb: 2 }} />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !revisedSentence.trim() || !newTerm.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: loading || !revisedSentence.trim() || !newTerm.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  opacity: loading || !revisedSentence.trim() || !newTerm.trim() ? 0.6 : 1,
                  '&:hover': !loading && revisedSentence.trim() && newTerm.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Revision'}
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
                    {evaluation.success ? 'Revision Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">{evaluation.feedback}</Typography>
              {evaluation.improvement_detected && (
                <Box sx={{ ...cardSx(P.green), mb: 2 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>
                    Great improvement! You successfully enhanced your sentence with the new vocabulary term.
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
                Continue to Score Calculation
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
