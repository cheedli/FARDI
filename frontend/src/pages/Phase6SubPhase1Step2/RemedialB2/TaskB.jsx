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
 * Phase 6 SubPhase 1 Step 2 - Level B2 - Task B
 * Writing: Write an 8-sentence report summary draft
 */

const GUIDED_QUESTIONS = [
  {
    label: '1. Event overview',
    example: 'Example: The Global Cultures Festival took place on March 8.',
    placeholder: 'When and where did the festival take place?'
  },
  {
    label: '2. Attendance',
    example: 'Example: Over 200 people came to the festival.',
    placeholder: 'How many people attended?'
  },
  {
    label: '3. Success',
    example: 'Example: The performances were a great success.',
    placeholder: 'What was the main success of the festival?'
  },
  {
    label: '4. Challenge',
    example: 'Example: A lighting problem happened during the event.',
    placeholder: 'What was the main challenge?'
  },
  {
    label: '5. Solution',
    example: 'Example: Backup lights were used to solve the problem.',
    placeholder: 'How was the challenge resolved?'
  },
  {
    label: '6. Feedback',
    example: 'Example: Guests gave positive feedback about the activities.',
    placeholder: 'What feedback did participants give?'
  },
  {
    label: '7. Strength',
    example: 'Example: The teamwork was the main strength of the event.',
    placeholder: 'What was the key strength of the team/event?'
  },
  {
    label: '8. Recommend',
    example: 'Example: It is recommended to have more backup plans.',
    placeholder: 'What do you recommend for the next event?'
  }
]

export default function Phase6SP1Step2RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 2, context: 'remedial_b2' })
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
    sessionStorage.setItem('phase6_sp1_step2_remedial_b2_taskb_score', filled.toString())
    try {
      await phase6API.logRemedialActivity(2, 'B2', 'B', filled, GUIDED_QUESTIONS.length, 0, 1)
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
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B2</Typography>
        <Typography variant="h6">Task B: Writing — 8-Sentence Report Summary</Typography>
        <Typography variant="body1">Write a complete report summary draft following the guided questions</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Write an 8-sentence report summary for the Global Cultures Festival. Answer each guided question with a complete sentence. Use past tense and include evidence where you can."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Tips:</strong> Use past tense (was, were, came, had). Include specific details (numbers, names). Keep each sentence focused on one point.
        </Typography>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {GUIDED_QUESTIONS.map((q, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>
              {q.label}
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
              placeholder={q.placeholder}
              sx={{ backgroundColor: submitted ? '#f5f5f5' : 'white' }}
            />
          </Paper>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Total words: {wordCount} (aim for at least 60 words)
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
            Task B Complete! Score: {score}/8
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 7 ? 'Excellent! Coherent draft with great detail!' : score >= 5 ? 'Good effort! Keep developing your report writing.' : 'Keep practicing — aim for more complete sentences.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b2/task/c')}
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
