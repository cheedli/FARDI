import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Alert, CircularProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, yellow: { bg: '#1C1708', border: '#FACC15', shadow: '#854D0E' } }

const TARGET_VOCABULARY = ['specific', 'actionable', 'clear', 'example', 'improve', 'understand', 'vague', 'general']

function fallbackEvaluate(text) {
  const lower = text.toLowerCase()
  const words = text.split(/\s+/).filter(w => w.length > 0).length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5).length
  const vocabUsed = TARGET_VOCABULARY.filter(v => lower.includes(v)).length

  if (words >= 40 && sentences >= 4 && vocabUsed >= 4) return { score: 4, level: 'C1', feedback: 'Excellent! Sophisticated and detailed response.', strengths: ['Rich vocabulary', 'Well-structured'], improvements: ['Consider adding more specific examples'] }
  if (words >= 25 && sentences >= 3 && vocabUsed >= 3) return { score: 3, level: 'B2', feedback: 'Very good! Clear and well-developed response.', strengths: ['Good vocabulary use', 'Clear structure'], improvements: ['Try adding more detail'] }
  if (words >= 15 && sentences >= 2 && vocabUsed >= 2) return { score: 2, level: 'B1', feedback: 'Good effort! Your response shows understanding.', strengths: ['Shows understanding'], improvements: ['Use more target vocabulary', 'Write longer responses'] }
  return { score: 1, level: 'A2', feedback: 'Keep going! Try to write more and use the target vocabulary.', strengths: ['Made an attempt'], improvements: ['Write at least 3 sentences', 'Use more vocabulary words'] }
}

export default function Phase6SP2Step3Int2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'main' })
  const [text, setText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  const vocabUsed = TARGET_VOCABULARY.filter(v => text.toLowerCase().includes(v))

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const result = await phase6API.evaluateSpecificityExplanation(text.trim())
      const data = result?.data || result || {}
      const evalResult = { score: data.score || 1, level: data.level || 'A2', feedback: data.feedback || 'Good work!', strengths: data.strengths || [], improvements: data.improvements || [] }
      setEvaluation(evalResult)
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp2_step3_interaction2_score', evalResult.score.toString())
      sessionStorage.setItem('phase6_sp2_step3_interaction2_level', evalResult.level)
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const fb = fallbackEvaluate(text)
      setEvaluation(fb)
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp2_step3_interaction2_score', fb.score.toString())
      sessionStorage.setItem('phase6_sp2_step3_interaction2_level', fb.level)
    } finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 3: Explain - Interaction 2</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Feedback Importance Explanation</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Lilia: "It is important to give specific feedback because... Use the sentence starter 'It is important because...' and reference the video."</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            <Typography variant="body2"><strong>Hint:</strong> Use the sentence starter: 'It is important because...' and reference what you saw in the video.</Typography>
          </Alert>

          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.yellow.border }}>Target Vocabulary:</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {TARGET_VOCABULARY.map((w, i) => (
                <Box key={i} sx={{ px: 2, py: 0.5, bgcolor: vocabUsed.includes(w) ? P.yellow.border : P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '10px' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: vocabUsed.includes(w) ? 'white' : P.yellow.border }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <TextField fullWidth multiline rows={6} value={text} onChange={(e) => setText(e.target.value)} disabled={submitted} placeholder="Write your response here..." sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Words: {wordCount} | Vocabulary: {vocabUsed.length}/{TARGET_VOCABULARY.length}</Typography>
            </Box>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !text.trim()}
                sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !text.trim()) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                {loading ? <><CircularProgress size={20} /> Evaluating...</> : <><CheckCircleIcon /> Submit</>}
              </Box>
            )}
          </Box>

          {evaluation && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.shadow }}>Evaluated! Level: {evaluation.level} | Score: {evaluation.score}/4</Typography>
                <Typography variant="body1" sx={{ my: 2 }}>{evaluation.feedback}</Typography>
                {evaluation.strengths?.length > 0 && (
                  <Box sx={{ mb: 2 }}><Typography variant="subtitle2" sx={{ color: P.green.shadow }}>Strengths:</Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>{evaluation.strengths.map((s, i) => <li key={i}><Typography variant="body2">{s}</Typography></li>)}</ul>
                  </Box>
                )}
                {evaluation.improvements?.length > 0 && (
                  <Box sx={{ mb: 2 }}><Typography variant="subtitle2" color="warning.dark">Improvements:</Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>{evaluation.improvements.map((s, i) => <li key={i}><Typography variant="body2">{s}</Typography></li>)}</ul>
                  </Box>
                )}
                {submitted && (
                  <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/3/interaction/3')}
                    sx={{ mt: 2, px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                    Continue to Interaction 3
                  </Box>
                )}
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
