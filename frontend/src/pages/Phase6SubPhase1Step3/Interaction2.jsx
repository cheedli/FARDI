import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const TARGET_VOCABULARY = ['balance', 'objective', 'fair', 'honest', 'improve', 'learn', 'future']
const BALANCE_WORDS = ['balance', 'balanced', 'fair', 'objective', 'honest', 'both']
const BOTH_SIDES_POSITIVE = ['positive', 'strength', 'success', 'well', 'good', 'achievement']
const BOTH_SIDES_NEGATIVE = ['negative', 'weakness', 'challenge', 'problem', 'difficulty', 'improve', 'bad', 'fail']
const PURPOSE_WORDS = ['because', 'so that', 'in order', 'help', 'allow', 'enable', 'understand']

function fallbackScore(text) {
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasBalance = BALANCE_WORDS.some(w => lower.includes(w))
  const hasBecause = PURPOSE_WORDS.some(w => lower.includes(w))
  const hasPositive = BOTH_SIDES_POSITIVE.some(w => lower.includes(w))
  const hasNegative = BOTH_SIDES_NEGATIVE.some(w => lower.includes(w))
  const hasBothSides = hasPositive && hasNegative
  if (wordCount < 5) return { score: 1, level: 'A2' }
  if (wordCount <= 15 && hasBalance) return { score: 1, level: 'A2' }
  if (wordCount <= 30 && hasBalance && hasBecause) return { score: 2, level: 'B1' }
  if (wordCount <= 50 && hasBalance && hasBecause && hasBothSides) return { score: 3, level: 'B2' }
  if (wordCount > 50 && hasBalance && hasBecause && hasBothSides) return { score: 4, level: 'C1' }
  if (hasBalance && hasBecause) return { score: 2, level: 'B1' }
  if (hasBalance) return { score: 1, level: 'A2' }
  return { score: 1, level: 'A2' }
}

const SCORE_LABELS = {
  1: 'A2 - Basic understanding',
  2: 'B1 - Good understanding with reasons',
  3: 'B2 - Strong explanation with both sides',
  4: 'C1 - Sophisticated, nuanced explanation'
}

export default function Phase6SP1Step3Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 2, context: 'main' })
  const [response, setResponse] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    if (!response.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write your explanation before submitting.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase6API.evaluateBalanceExplanation(response.trim())
      if (result && result.score !== undefined) {
        const score = result.score || 1
        const level = result.level || 'A2'
        setEvaluation({ success: true, score, level, feedback: result.feedback || 'Good work!', strengths: result.strengths || [], improvements: result.improvements || [] })
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step3_interaction2_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step3_interaction2_level', level)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const { score, level } = fallbackScore(response.trim())
      const lower = response.toLowerCase()
      const hasBalance = BALANCE_WORDS.some(w => lower.includes(w))
      const hasBothSides = BOTH_SIDES_POSITIVE.some(w => lower.includes(w)) && BOTH_SIDES_NEGATIVE.some(w => lower.includes(w))
      let feedback = ''
      if (score === 1) feedback = 'You\'ve made a start! Try to explain WHY balance matters — use "because" and mention both positives and challenges.'
      else if (score === 2) feedback = 'Good work! You used "because" to give a reason. Try to mention specific examples of both strengths AND weaknesses.'
      else if (score === 3) feedback = 'Very good! You explained both sides and gave reasons. Consider using more formal vocabulary like "objective" or "comprehensive".'
      else feedback = 'Excellent! Your explanation is sophisticated and well-reasoned. You clearly understand why balanced reporting matters.'
      setEvaluation({ success: true, score, level, feedback, hasBalance, hasBothSides })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step3_interaction2_score', score.toString())
      sessionStorage.setItem('phase6_sp1_step3_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>SubPhase 6.1 - Step 3: Explain - Interaction 2</Typography>
            <Typography variant="body1" color="text.secondary">Explain why balance matters in a post-event report</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Lilia" message="The video shows the typical structure of a good report. Now explain why it is important to include both strengths (successes) and weaknesses (challenges) in the report. Include 'It is important because...' and reference one reason from the video (e.g., 'shows honesty', 'helps improve', 'builds trust')." />
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Writing Task</Typography>
              <Box sx={{ ...cardSx(P.teal), p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <InfoIcon sx={{ color: P.teal.border }} />
                  <Typography variant="body2" fontWeight="bold">Explain: Why is it important to include BOTH strengths AND weaknesses in a post-event report?</Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>Hint: What happens if you only write positives? What happens if you only write negatives?</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom color="text.secondary">Try to use these words:</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {TARGET_VOCABULARY.map((word) => (
                    <Box key={word} sx={{ bgcolor: P.blue.border, color: 'white', px: 2, py: 0.5, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>{word}</Box>
                  ))}
                </Stack>
              </Box>
              <TextField fullWidth multiline rows={4} variant="outlined" placeholder="It is important to include both strengths and weaknesses because..." value={response} onChange={(e) => setResponse(e.target.value)} sx={{ mb: 2 }} />
              <Box component="button" onClick={handleSubmit} disabled={loading || !response.trim()} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                {loading && <CircularProgress size={18} color="inherit" />}
                {loading ? 'Evaluating...' : 'Submit Explanation'}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>Explanation Evaluated!</Typography>
                  {evaluation.level && (
                    <Typography variant="body2" color="text.secondary">Level: <strong>{evaluation.level}</strong> — {SCORE_LABELS[evaluation.score] || evaluation.level}</Typography>
                  )}
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <Box sx={{ ...cardSx(P.green), p: 2, mb: 1 }}>
                  <Typography variant="body2"><strong>Strengths:</strong> {evaluation.strengths.join(', ')}</Typography>
                </Box>
              )}
              {evaluation.improvements && evaluation.improvements.length > 0 && (
                <Box sx={{ ...cardSx(P.teal), p: 2, mb: 1 }}>
                  <Typography variant="body2"><strong>To improve:</strong> {evaluation.improvements.join(', ')}</Typography>
                </Box>
              )}
              {evaluation.hasBalance && (
                <Box sx={{ ...cardSx(P.green), p: 1.5, mb: 1 }}>
                  <Typography variant="body2">You used balance-related vocabulary.</Typography>
                </Box>
              )}
              {evaluation.hasBothSides && (
                <Box sx={{ ...cardSx(P.green), p: 1.5, mb: 2 }}>
                  <Typography variant="body2">You mentioned both the positive and negative aspects.</Typography>
                </Box>
              )}
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/interaction/3')} sx={{ width: '100%', ...cardSx(P.blue), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.blue.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue to Interaction 3 →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
