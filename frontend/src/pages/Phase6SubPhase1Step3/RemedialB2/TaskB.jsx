import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level B2 - Task B
 * Writing: Write an 8-sentence explanation of why we write a post-event report (Explain Expedition)
 */

const GUIDED_QUESTIONS = [
  { label: '1. Main purpose', example: 'Example: To summarize what happened at the event.' },
  { label: '2. Show success', example: 'Example: To show the achievements and positive outcomes.' },
  { label: '3. Show challenge', example: 'Example: To be honest about problems that occurred.' },
  { label: '4. Use feedback', example: 'Example: To use opinions from guests to improve.' },
  { label: '5. Find strength', example: 'Example: To identify what we did well as a team.' },
  { label: '6. Find weakness', example: 'Example: To see what areas need improvement.' },
  { label: '7. Recommend', example: 'Example: To suggest better ideas for the next event.' },
  { label: '8. Help future', example: 'Example: To make the next event even better.' }
]

export default function Phase6SP1Step3RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 2, context: 'remedial_b2' })
  const [sentences, setSentences] = useState(Array(GUIDED_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (idx, val) => {
    const updated = [...sentences]
    updated[idx] = val
    setSentences(updated)
  }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().split(/\s+/).length >= 3).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_b2_taskb_score', filled.toString())
    try {
      await phase6API.logRemedialActivity(3, 'B2', 'B', filled, GUIDED_QUESTIONS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)
  const wordCount = sentences.join(' ').split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level B2</Typography>
        <Typography variant="h6">Task B: Explain Expedition</Typography>
        <Typography variant="body1">Write 8 sentences explaining why we write a post-event report</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Explain Expedition! Write a sentence for each reason why we write a post-event report. Use complete sentences with B2-level vocabulary." />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>Tips:</strong> Use purpose language ("To...", "In order to..."). Be specific. Use report vocabulary (success, challenge, feedback, improve, recommend).
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {GUIDED_QUESTIONS.map((q, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>{q.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{q.example}</Typography>
            <TextField fullWidth size="small" value={sentences[idx]} onChange={(e) => handleChange(idx, e.target.value)} disabled={submitted} placeholder="Write your sentence here..." sx={{ backgroundColor: submitted ? '#f5f5f5' : 'white' }} />
          </Paper>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Total words: {wordCount}</Typography>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allFilled} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Submit My Explanation
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task B Complete! Score: {score}/{GUIDED_QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/b2/task/c')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
