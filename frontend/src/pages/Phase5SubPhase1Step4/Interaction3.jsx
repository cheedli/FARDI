import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack, MenuItem, Select, FormControl, InputLabel, useTheme } from '@mui/material'
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
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const TARGET_WORDS = ['emergency', 'contingency', 'backup', 'announce', 'transparent']

const EXPECTED_EXAMPLES = {
  A2: 'Spell backup. Add backup light.',
  B1: "Use Sushi Spell for 'announce' - revised: \"We announce to everyone\" fixed to \"We are announcing to all guests\".",
  B2: "Incorporate Sushi Spell for 'transparent' - revised announcement: \"We tell problem\" fixed to \"We are communicating transparently about the issue\".",
  C1: "Leverage Sushi Spell for 'contingency' - revised email: Detected passive error in \"Backup is use\" to \"The contingency plan, which includes the backup system, has been activated\"."
}

export default function Phase5Step4Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 3, context: 'main' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('')
  const [originalSentence, setOriginalSentence] = useState('')
  const [revisedSentence, setRevisedSentence] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!selectedTerm || !originalSentence.trim() || !revisedSentence.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please select a term, provide the original sentence, and write your revision.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateRevisionStep4(originalSentence.trim(), revisedSentence.trim(), selectedTerm.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 2, level: data.level || 'A2', feedback: data.feedback || 'Good revision!', term_used_correctly: data.term_used_correctly || false, error_detected: data.error_detected || false, improvement_detected: data.improvement_detected || false })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step4_interaction3_game_score', '1')
        sessionStorage.setItem('phase5_step4_interaction3_revision_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step4_interaction3_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const revisedLower = revisedSentence.toLowerCase()
      const termLower = selectedTerm.toLowerCase()
      const wordCount = revisedSentence.split(/\s+/).length
      const hasTerm = revisedLower.includes(termLower)
      const hasGame = ['sushi', 'spell', 'game'].some(w => revisedLower.includes(w))
      const isLonger = revisedSentence.length > originalSentence.length
      let score = 2; let level = 'A2'
      if (wordCount <= 5 && hasTerm) { score = 2; level = 'A2' }
      else if (wordCount <= 15 && hasTerm && hasGame) { score = 3; level = 'B1' }
      else if (wordCount <= 30 && hasTerm && hasGame && isLonger) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your revision shows ${level} level improvement.`, term_used_correctly: hasTerm, error_detected: isLonger, improvement_detected: isLonger && hasTerm })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step4_interaction3_game_score', '1')
      sessionStorage.setItem('phase5_step4_interaction3_revision_score', score.toString())
      sessionStorage.setItem('phase5_step4_interaction3_level', level)
    } finally { setLoading(false) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/score') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 4: Elaborate - Interaction 3</Typography>
            <Typography variant="body1">Play Sushi Spell and revise one sentence</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ryan" message="To polish your writing, play a game and integrate terms. Play Sushi Spell to spell 5 terms like 'emergency', 'contingency', 'backup', 'announce', 'transparent', then revise one sentence in your text using a spelled term, fixing any mistakes." />
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...clay(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Step 1: Play Sushi Spell (2 minutes)</Typography>
              <SushiSpellGame step={4} interaction={3} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
            </Box>
          </motion.div>
        )}

        {gameCompleted && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Step 2: Revise One Sentence</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.blue.border, fontSize: 20 }} />
                <Typography variant="body2">Select one term you spelled, choose a sentence from your announcement or email, and revise it using the term. Fix any grammar, spelling, or structure mistakes!</Typography>
              </Box>

              <Box sx={{ ...clay(P.orange), mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Expected Revision Examples (by level):</Typography>
                <Stack spacing={1}>
                  {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                    <Box key={level}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>{level}:</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>"{example}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select a Term You Spelled</InputLabel>
                <Select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} label="Select a Term You Spelled">
                  {TARGET_WORDS.map((term) => <MenuItem key={term} value={term}>{term}</MenuItem>)}
                </Select>
              </FormControl>

              <TextField fullWidth variant="outlined" label="Original Sentence" placeholder="Paste the sentence you want to revise from your announcement or email..." value={originalSentence} onChange={(e) => setOriginalSentence(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={4} variant="outlined" label="Revised Sentence" placeholder="Write your improved sentence here, using the term and fixing mistakes..." value={revisedSentence} onChange={(e) => setRevisedSentence(e.target.value)} sx={{ mb: 2 }} />

              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !selectedTerm || !originalSentence.trim() || !revisedSentence.trim()}
                sx={{
                  ...clay(P.blue), cursor: 'pointer', width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s', opacity: (loading || !selectedTerm || !originalSentence.trim() || !revisedSentence.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: P.blue.border }} /> : <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>Submit Revision</Typography>}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(evaluation.success ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>{evaluation.success ? 'Revision Evaluated!' : 'Try Again'}</Typography>
                  <Typography variant="body2">Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.term_used_correctly && (
                <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Great! You correctly used the term in your revision.</Typography>
                </Box>
              )}
              {evaluation.error_detected && (
                <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Excellent! You detected and fixed errors in the original sentence.</Typography>
                </Box>
              )}
              {evaluation.improvement_detected && (
                <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Perfect! Your revision shows clear improvement.</Typography>
                </Box>
              )}
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  ...clay(P.green), cursor: 'pointer', width: '100%', mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Score Calculation</Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
