import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' } }
const DARK  = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const TARGET_WORDS = ['guide', 'safety', 'welcome', 'careful', 'help']

export default function Phase5SubPhase2Step2Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [original, setOriginal] = useState('')
  const [revised, setRevised] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!revised.trim()) return
    setLoading(true)
    try {
      const result = await phase5API.evaluateRevisionSubPhase2(original, revised)
      if (result.success && result.data) {
        setEvaluation(result.data)
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step2_interaction3_score', result.data.score || '1')
      }
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, mb: 1 }}>SubPhase 2 Step 2: Explore - Interaction 3</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Emna" message="Now revise your instructions after seeing real examples and playing the game again. Play Sushi Spell once more (2 minutes), then improve one or two instructions using a new spelled term (e.g., 'guide', 'safety', 'welcome')." />
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SushiSpellGame step={2} interaction={3} subphase={2} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
          </motion.div>
        )}

        {gameCompleted && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Revise Your Instructions</Typography>
              <TextField fullWidth multiline rows={3} variant="outlined" label="Original Instruction"
                placeholder="Enter your original instruction..." value={original}
                onChange={(e) => setOriginal(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={4} variant="outlined" label="Revised Instruction (use a new term from the game)"
                placeholder="Enter your improved instruction..." value={revised}
                onChange={(e) => setRevised(e.target.value)} sx={{ mb: 2 }} />
              <Box component="button" onClick={handleSubmit} disabled={loading || !revised.trim()}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: (loading || !revised.trim()) ? 0.5 : 1 }}>
                {loading ? <><CircularProgress size={18} /> Evaluating...</> : 'Submit Revision'}
              </Box>
            </Box>
          </motion.div>
        )}

        {submitted && evaluation && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.green.border }}>Score: {evaluation.score}/4 | Level: {evaluation.level}</Typography>
              <Box component="button" onClick={() => navigate('/phase5/subphase/2/step/2/score')}
                sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.blue.border, transition: 'all 0.15s', width: '100%', mt: 1 }}>
                Continue to Score Calculation
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
