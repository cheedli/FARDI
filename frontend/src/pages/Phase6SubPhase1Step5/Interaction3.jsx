import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const SAMPLE_TEXT = "The festival had many visitors last week. Students were very excited and they participated in all activities. The organizers planned well and every booth was successful. We recommend improvements for next time."

export default function Phase6SP1Step5Int3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'main' })
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    if (!text.trim()) return
    const wordCount = text.split(/\s+/).length
    const formalWords = ['evidence', 'recommend', 'achieved', 'conclude', 'furthermore', 'however', 'specifically', 'analysis'].filter(w => text.toLowerCase().includes(w)).length
    const s = wordCount > SAMPLE_TEXT.split(/\s+/).length * 1.2 && formalWords >= 2 ? 4 : formalWords >= 1 ? 3 : wordCount >= 20 ? 2 : 1
    setScore(s)
    sessionStorage.setItem('phase6_sp1_step5_interaction3_score', s.toString())
    try { await phase6API.trackGame(5, 3, { completed: true, score: s }, 1) } catch (e) { console.error(e) }
    setSubmitted(true)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Evaluate - Interaction 3</Typography>
        <Typography variant="body1">Enhancement Task</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Excellent grammar! Now improve coherence/cohesion, tone, formality, balance, evidence use, vocabulary, and overall effectiveness in the corrected texts. Make tone formal and objective; add connectors (however, therefore, in addition); balance successes and challenges; include evidence."
        />
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2" gutterBottom>Original Text (corrected):</Typography>
          <Typography variant="body1">{SAMPLE_TEXT}</Typography>
        </Paper>
        <TextField fullWidth multiline rows={6} value={text} onChange={(e) => setText(e.target.value)} disabled={submitted} placeholder="Write your enhanced version here..." sx={{ mb: 2 }} />
        {!submitted ? (
          <Button variant="contained" onClick={handleSubmit} disabled={!text.trim()} fullWidth sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Submit Enhanced Version</Button>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>Score: {score}/4 - {score >= 3 ? 'Excellent enhancement!' : 'Good effort!'}</Alert>
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/score')} fullWidth sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Score</Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
