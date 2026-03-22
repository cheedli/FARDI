import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
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

const TARGET_WORDS = ['emergency', 'contingency', 'backup', 'announce', 'transparent']

const EXPECTED_EXAMPLES = {
  A2: 'Game for backup.',
  B1: 'Use Sushi Spell for \'backup\' because the video showed extra lights for emergency.',
  B2: 'Incorporate Sushi Spell for rapid spelling of \'transparent\' to make vocabulary engaging, as the email example used open communication to reassure people.',
  C1: 'Leverage Sushi Spell to master \'contingency\' through competitive spelling, relating to the Twitter update\'s reference to pre-planned alternative measures that ensured minimal disruption.'
}

export default function Phase5Step3Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('')
  const [explanation, setExplanation] = useState('')
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
    if (!selectedTerm || !explanation.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please select a term and write your explanation.' })
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
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const explanationLower = explanation.toLowerCase()
      const termLower = selectedTerm.toLowerCase()
      const wordCount = explanation.split(/\s+/).length
      const hasGame = ['game', 'sushi', 'spell'].some(w => explanationLower.includes(w))
      const hasTerm = explanationLower.includes(termLower)
      const hasVideo = ['video', 'example', 'text', 'twitter', 'email'].some(w => explanationLower.includes(w))
      let score = 2, level = 'A2'
      if (wordCount <= 5 && hasTerm) { score = 2; level = 'A2' }
      else if (wordCount <= 15 && hasTerm && hasGame) { score = 3; level = 'B1' }
      else if (wordCount <= 30 && hasTerm && hasGame && hasVideo) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your explanation shows ${level} level understanding.`, game_reference_detected: hasGame, video_reference_detected: hasVideo })
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
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 3: Explain - Interaction 3
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Play Sushi Spell and explain one term
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ryan"
              message="Use a game to practise more crisis communication terms from the videos! Play Sushi Spell to spell 5 terms like 'emergency', 'contingency', 'backup', 'announce', 'transparent' in 2 minutes, then explain one spelled term relating to the videos."
            />
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 1: Play Sushi Spell (2 minutes)
              </Typography>
              <SushiSpellGame
                step={3}
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
                Step 2: Explain One Term
              </Typography>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Select one term you spelled in the game and explain it, relating it to the videos you watched. Mention the game and link to video examples.
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select a Term You Spelled</InputLabel>
                <Select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  label="Select a Term You Spelled"
                >
                  {TARGET_WORDS.map((term) => (
                    <MenuItem key={term} value={term}>{term}</MenuItem>
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
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !selectedTerm || !explanation.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: loading || !selectedTerm || !explanation.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  opacity: loading || !selectedTerm || !explanation.trim() ? 0.6 : 1,
                  '&:hover': !loading && selectedTerm && explanation.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Explanation'}
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
                    {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">{evaluation.feedback}</Typography>
              {evaluation.game_reference_detected && (
                <Box sx={{ ...cardSx(P.green), mb: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Great! You mentioned the game in your explanation.</Typography>
                </Box>
              )}
              {evaluation.video_reference_detected && (
                <Box sx={{ ...cardSx(P.green), mb: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Excellent! You linked your explanation to the video examples.</Typography>
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
