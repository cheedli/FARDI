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
 * Phase 6 SubPhase 1 Step 2 - Level A2 - Task C
 * Sentence Builder: Write 6 simple sentences for a report summary
 */

const PROMPTS = [
  { label: 'Sentence 1', hint: 'Festival good.' },
  { label: 'Sentence 2', hint: 'Many people came.' },
  { label: 'Sentence 3', hint: 'Music nice.' },
  { label: 'Sentence 4', hint: 'Challenge lights.' },
  { label: 'Sentence 5', hint: 'We fix.' },
  { label: 'Sentence 6', hint: 'Next time better.' }
]

export default function Phase6SP1Step2RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (idx, val) => {
    const updated = [...sentences]
    updated[idx] = val
    setSentences(updated)
  }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().length > 0).length
    const correct = filled
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_a2_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(2, 'A2', 'C', correct, PROMPTS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level A2</Typography>
        <Typography variant="h6">Task C: Sentence Builder</Typography>
        <Typography variant="body1">Write 6 simple sentences for a report summary</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Sentence Builder! Write one simple sentence for each prompt. Use the example as a guide. Short sentences are fine for A2 level!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Write a simple sentence for each number. Use the hint as an example to follow.
        </Typography>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {PROMPTS.map((prompt, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, color: '#27ae60' }}>
              {prompt.label}:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Example: <em>{prompt.hint}</em>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={sentences[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              disabled={submitted}
              placeholder="Write your sentence here..."
              sx={{ backgroundColor: submitted ? '#f5f5f5' : 'white' }}
            />
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Submit My Sentences
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task C Complete! Score: {score}/{PROMPTS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Great work building your sentences! You have completed all A2 remedial tasks.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/1')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Next Phase →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
