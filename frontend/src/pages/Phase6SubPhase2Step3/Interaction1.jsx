import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

export default function Phase6SP2Step3Int1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'main' })
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!response.trim()) return
    sessionStorage.setItem('phase6_sp2_step3_interaction1_score', '1')
    try { await phase6API.trackGame(3, 1, { completed: true, time_played: 60, engagement_score: 1 }, 2) } catch (e) { console.error('Track failed:', e) }
    setSubmitted(true)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Explain - Interaction 1</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>Ms. Mabrouki: "Watch this video about giving constructive feedback. Then explain: what is the 'positive sandwich' method and why is it useful?"</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Video: <a href="https://youtu.be/GdFBUmC3BAM" target="_blank" rel="noopener noreferrer">https://youtu.be/GdFBUmC3BAM</a></Typography>
        <TextField fullWidth multiline rows={4} value={response} onChange={(e) => setResponse(e.target.value)} disabled={submitted} placeholder="Write your response here..." sx={{ mb: 2 }} />
        {!submitted ? (
          <Button variant="contained" onClick={handleSubmit} disabled={!response.trim()} fullWidth
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>Response submitted! Well done.</Alert>
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/3/interaction/2')} fullWidth
              sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Interaction 2</Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
