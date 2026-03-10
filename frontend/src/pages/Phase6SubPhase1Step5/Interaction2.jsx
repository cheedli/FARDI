import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress, Stack, Chip } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const TARGET_VOCABULARY = ['correct', 'grammar', 'tense', 'past', 'present', 'agreement', 'verb']

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

export default function Phase6SP1Step5Int2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'main' })
  const [text, setText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  const vocabUsed = TARGET_VOCABULARY.filter(v => text.toLowerCase().includes(v))

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const result = await phase6API.evaluateGrammarCorrection(text.trim())
      const data = result?.data || result || {}
      const evalResult = { score: data.score || 1, level: data.level || 'A2', feedback: data.feedback || 'Good work!', strengths: data.strengths || [], improvements: data.improvements || [] }
      setEvaluation(evalResult)
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step5_interaction2_score', evalResult.score.toString())
      sessionStorage.setItem('phase6_sp1_step5_interaction2_level', evalResult.level)
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const fb = fallbackEvaluate(text)
      setEvaluation(fb)
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step5_interaction2_score', fb.score.toString())
      sessionStorage.setItem('phase6_sp1_step5_interaction2_level', fb.level)
    } finally { setLoading(false) }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Evaluate - Interaction 2</Typography>
        <Typography variant="body1">Grammar Correction</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Lilia"
          message="Good spelling fixes! Now, using your spelling-corrected version, fix grammar and tense mistakes only. Fix 'Festival was succes' → 'The festival was a success', 'Liting failur but resolv' → 'Lighting failure but was resolved'."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Hint:</strong> Look for verb tense errors, subject-verb agreement, and missing articles.</Typography>
      </Alert>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#27ae6010', borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Target Vocabulary:</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {TARGET_VOCABULARY.map((w, i) => (
            <Chip key={i} label={w} size="small" sx={{ backgroundColor: vocabUsed.includes(w) ? '#27ae60' : 'transparent', color: vocabUsed.includes(w) ? 'white' : '#27ae60', border: '1px solid #27ae60', fontWeight: 'bold' }} />
          ))}
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <TextField fullWidth multiline rows={6} value={text} onChange={(e) => setText(e.target.value)} disabled={submitted} placeholder="Write your response here..." sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">Words: {wordCount} | Vocabulary: {vocabUsed.length}/{TARGET_VOCABULARY.length}</Typography>
        </Box>
        {!submitted && (
          <Button variant="contained" onClick={handleSubmit} disabled={loading || !text.trim()} fullWidth size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            {loading ? 'Evaluating...' : 'Submit'}
          </Button>
        )}
      </Paper>

      {evaluation && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter', border: '2px solid', borderColor: 'success.main', borderRadius: 2 }}>
          <Typography variant="h6" color="success.dark">Evaluated! Level: {evaluation.level} | Score: {evaluation.score}/4</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>{evaluation.feedback}</Typography>
          {evaluation.strengths?.length > 0 && (
            <Box sx={{ mb: 2 }}><Typography variant="subtitle2" color="success.dark">Strengths:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>{evaluation.strengths.map((s, i) => <li key={i}><Typography variant="body2">{s}</Typography></li>)}</ul>
            </Box>
          )}
          {evaluation.improvements?.length > 0 && (
            <Box sx={{ mb: 2 }}><Typography variant="subtitle2" color="warning.dark">Improvements:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>{evaluation.improvements.map((s, i) => <li key={i}><Typography variant="body2">{s}</Typography></li>)}</ul>
            </Box>
          )}
          {submitted && (
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/interaction/3')} fullWidth size="large"
              sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
              Continue to Interaction 3
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
