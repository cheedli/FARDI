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
 * Phase 6 SubPhase 1 Step 2 - Level B1 - Task B
 * Writing Proposals: Write 6 sentences for a report summary
 */

const GUIDED_QUESTIONS = [
  { label: 'Success?', example: 'Example: Festival was success.' },
  { label: 'People?', example: 'Example: Many people came.' },
  { label: 'Good part?', example: 'Example: Dances were good.' },
  { label: 'Challenge?', example: 'Example: Lighting challenge.' },
  { label: 'Fix?', example: 'Example: We fixed it.' },
  { label: 'Recommend?', example: 'Example: Recommend more backup.' }
]

export default function Phase6SP1Step2RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 2, context: 'remedial_b1' })
  const [sentences, setSentences] = useState(Array(GUIDED_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (idx, val) => {
    const updated = [...sentences]
    updated[idx] = val
    setSentences(updated)
  }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().length > 2).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b1_taskb_score', filled.toString())
    try {
      await phase6API.logRemedialActivity(2, 'B1', 'B', filled, GUIDED_QUESTIONS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)
  const wordCount = sentences.join(' ').split(/\s+/).filter(w => w.length > 0).length

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
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B1</Typography>
        <Typography variant="h6">Task B: Writing Proposals</Typography>
        <Typography variant="body1">Write 6 sentences for a report summary</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now write your own sentences! Answer each question with a simple sentence. Use the examples to help you. Aim to write 6 complete sentences."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Answer each guided question with one sentence. Use the examples as a model. Use past tense when possible (e.g., "was", "came", "fixed").
        </Typography>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {GUIDED_QUESTIONS.map((q, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>
              {idx + 1}. {q.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {q.example}
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

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Total words: {wordCount}
      </Typography>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Submit My Report Summary
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task B Complete! Score: {score}/{GUIDED_QUESTIONS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 5 ? 'Excellent! Your report summary looks great!' : 'Good effort! Keep practicing your report writing.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b1/task/c')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
