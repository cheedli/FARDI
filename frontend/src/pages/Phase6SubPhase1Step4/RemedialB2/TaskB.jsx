import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level B2 — Task B
 * Analysis Odyssey: Write an 8-sentence post-event report section with specific details
 */

const PROMPTS = [
  { label: '1. Introduction', placeholder: 'State the purpose and date of the event (e.g. "This report summarises the outcomes of...")' },
  { label: '2. Main success', placeholder: 'Describe the biggest success with a specific detail or number (e.g. attendance figure)' },
  { label: '3. Second success', placeholder: 'Describe another achievement and its positive impact on participants' },
  { label: '4. Challenge faced', placeholder: 'Describe one challenge using formal language (e.g. "A key challenge was...")' },
  { label: '5. How it was addressed', placeholder: 'Explain how the challenge was resolved or managed during the event' },
  { label: '6. Participant feedback', placeholder: 'Summarise participant reactions using evidence (e.g. survey results, quotes)' },
  { label: '7. Recommendation', placeholder: 'Make one specific, actionable recommendation for future events' },
  { label: '8. Conclusion', placeholder: 'Close with an overall evaluation of the event\'s success' }
]

const MODEL_ANSWER = `This report summarises the outcomes of the annual cultural festival held on 15 March. The event was a significant success, with attendance exceeding the target by 25%, reflecting strong community interest. The live performances received widespread acclaim, with 90% of participants rating them as "excellent" in post-event surveys. A key challenge was the inadequate sound system in the outdoor area, which disrupted two early sessions. The technical team responded promptly and resolved the issue within 30 minutes, minimising further disruption. Participant feedback was largely positive, with an average satisfaction score of 4.2 out of 5 across all sessions. It is recommended that future events conduct a thorough technical rehearsal at least 48 hours in advance. Overall, the festival achieved its core objectives and provided a valuable experience for all stakeholders.`

export default function Phase6SP1Step4RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 8).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'B', filled, PROMPTS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B2</Typography>
        <Typography variant="h6">Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Write an 8-sentence post-event report with specific details</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Write one sentence for each section of the report. Each sentence should be at least 8 words, use formal vocabulary, and include specific details where guided.
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {PROMPTS.map((p, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #27ae60' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#27ae60" sx={{ mb: 0.5 }}>
              {p.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {p.placeholder}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[idx]}
              onChange={(e) => {
                const updated = [...answers]
                updated[idx] = e.target.value
                setAnswers(updated)
              }}
              disabled={submitted}
              placeholder="Write your sentence here..."
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
          Submit Report
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task B Complete! Score: {score}/{PROMPTS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 6 ? 'Excellent! Your report shows strong B2-level writing.' : 'Good effort! Compare your sentences with the model answer below.'}
          </Typography>
          {!showModel ? (
            <Button
              variant="outlined"
              onClick={() => setShowModel(true)}
              sx={{ mb: 2, color: '#27ae60', borderColor: '#27ae60' }}
            >
              Show Model Answer
            </Button>
          ) : (
            <Paper sx={{ p: 2, mb: 2, backgroundColor: 'white', border: '1px solid #27ae60', borderRadius: 1, textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#27ae60" sx={{ mb: 1 }}>Model Answer:</Typography>
              <Typography variant="body2">{MODEL_ANSWER}</Typography>
            </Paper>
          )}
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/c')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
