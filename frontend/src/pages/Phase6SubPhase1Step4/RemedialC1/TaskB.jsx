import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level C1 — Task B
 * Analysis Odyssey: Write a sophisticated 8-sentence C1-level post-event report
 */

const PROMPTS = [
  { label: '1. Executive summary', placeholder: 'Introduce the report with a concise, formal overview (use "This report evaluates..." or "This document presents...")' },
  { label: '2. Key achievement with data', placeholder: 'State the primary success with precise evidence (percentage, rating, or figure)' },
  { label: '3. Secondary achievement with impact', placeholder: 'Describe another success and its measurable or qualitative impact on stakeholders' },
  { label: '4. Nuanced challenge analysis', placeholder: 'Analyse a challenge with balanced language — acknowledge it without being negative (use "whilst", "notwithstanding", "despite")' },
  { label: '5. Resolution & mitigation', placeholder: 'Explain how the challenge was addressed and what was learned from it' },
  { label: '6. Evidence-based stakeholder feedback', placeholder: 'Synthesise participant feedback using hedging language (e.g. "The majority of respondents indicated...")' },
  { label: '7. Strategic recommendation', placeholder: 'Make a forward-looking, actionable recommendation linked to a specific finding (use "In light of...", "It is therefore recommended...")' },
  { label: '8. Evaluative conclusion', placeholder: 'Close with a balanced overall evaluation that acknowledges both strengths and areas for growth' },
]

const MODEL_ANSWER = `This report presents a comprehensive evaluation of the International Cultural Exchange Forum held on 22 February, drawing on quantitative data and qualitative participant feedback. The event achieved a 94% satisfaction rating across all sessions, representing a 12-percentage-point improvement on the previous year's figure. The keynote address was particularly well-received, with 87% of attendees describing it as "highly relevant" to their professional development. Whilst the networking session experienced an initial logistical challenge due to inadequate signage, this was swiftly resolved through on-site coordination, thereby minimising disruption. The incident nonetheless underscored the importance of a comprehensive pre-event walkthrough, a practice that will be institutionalised in future planning cycles. Participant feedback, gathered via a structured post-event survey (n=142), revealed a strong consensus around the value of interdisciplinary dialogue, though several respondents highlighted the need for extended Q&A time. In light of this finding, it is recommended that future forums allocate a minimum of 20 minutes per session for structured audience interaction. Overall, the event successfully fulfilled its core objectives and demonstrated the organisation's capacity to deliver high-quality, impactful programming.`

export default function Phase6SP1Step4RemC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 10).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'B', filled, PROMPTS.length, 0, 1) } catch (e) { console.error(e) }
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
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level C1</Typography>
        <Typography variant="h6">Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Write a sophisticated 8-sentence C1-level post-event report</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Write one sophisticated sentence per section (minimum 10 words each). Use C1-level vocabulary: <strong>evidence-based, stakeholder, accountability, nuanced, objectivity, credibility</strong>. Aim for formal, analytical language throughout.
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
            {score >= 6 ? 'Excellent C1-level writing!' : 'Good effort! Compare your sentences with the model answer below.'}
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
              <Typography variant="subtitle2" fontWeight="bold" color="#27ae60" sx={{ mb: 1 }}>C1 Model Answer:</Typography>
              <Typography variant="body2">{MODEL_ANSWER}</Typography>
            </Paper>
          )}
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/c1/task/c')}
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
