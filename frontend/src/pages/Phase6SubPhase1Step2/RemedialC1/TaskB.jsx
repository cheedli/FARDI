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
 * Phase 6 SubPhase 1 Step 2 - Level C1 - Task B
 * Writing: Write 8-sentence formal report summary
 */

const GUIDED_QUESTIONS = [
  {
    label: '1. Overview',
    example: 'Example: The Global Cultures Festival achieved its core objectives of fostering intercultural dialogue.',
    placeholder: 'Provide a formal overview of the festival and its objectives.'
  },
  {
    label: '2. Impact',
    example: 'Example: The event fostered meaningful intercultural dialogue among over 200 participants.',
    placeholder: 'Describe the broader impact of the festival.'
  },
  {
    label: '3. Success evidence',
    example: 'Example: High attendance and overwhelmingly positive feedback confirmed the event\'s success.',
    placeholder: 'Provide evidence of success (attendance, feedback data).'
  },
  {
    label: '4. Challenge',
    example: 'Example: A technical lighting failure one hour before opening presented a significant operational challenge.',
    placeholder: 'Describe the main challenge and how it was mitigated.'
  },
  {
    label: '5. Strength',
    example: 'Example: The team demonstrated exceptional resilience and adaptability under pressure.',
    placeholder: 'Identify the key organizational strength demonstrated.'
  },
  {
    label: '6. Weakness',
    example: 'Example: Schedule density limited opportunities for deeper participant engagement.',
    placeholder: 'Identify one weakness or limitation of the event.'
  },
  {
    label: '7. Recommendation 1',
    example: 'Example: It is recommended to extend transition periods between activities by at least 15 minutes.',
    placeholder: 'Provide your first specific, actionable recommendation.'
  },
  {
    label: '8. Recommendation 2',
    example: 'Example: Strengthening contingency planning protocols would significantly enhance operational preparedness.',
    placeholder: 'Provide your second specific, actionable recommendation.'
  }
]

export default function Phase6SP1Step2RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 2, context: 'remedial_c1' })
  const [sentences, setSentences] = useState(Array(GUIDED_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (idx, val) => {
    const updated = [...sentences]
    updated[idx] = val
    setSentences(updated)
  }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().split(/\s+/).length >= 5).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_c1_taskb_score', filled.toString())
    try {
      await phase6API.logRemedialActivity(2, 'C1', 'B', filled, GUIDED_QUESTIONS.length, 0, 1)
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
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level C1</Typography>
        <Typography variant="h6">Task B: Writing — Formal Report Summary</Typography>
        <Typography variant="body1">Write an 8-sentence formal, balanced report summary</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Write a formal 8-sentence report summary for the Global Cultures Festival. Use sophisticated language, include evidence, maintain objectivity, and ensure both strengths and weaknesses are addressed."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>C1 Tips:</strong> Use formal register (avoid contractions). Include evidence and data. Use complex sentences with connectors ("however", "furthermore", "consequently"). Balance positive and negative points. Make recommendations specific and actionable.
        </Typography>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {GUIDED_QUESTIONS.map((q, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>
              {q.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
              {q.example}
            </Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
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
        Total words: {wordCount} (aim for at least 120 words at C1 level)
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
          Submit My Formal Report Summary
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task B Complete! Score: {score}/8
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 7 ? 'Excellent! Formal, balanced, evidence-based writing!' : score >= 5 ? 'Good effort! Focus on formality and balance in future drafts.' : 'Keep developing your formal writing skills — aim for longer, more complex sentences.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/2/remedial/c1/task/c')}
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
