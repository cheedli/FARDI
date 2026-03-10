import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 2 Step 3 — Level B2 — Task B
 * Analysis Odyssey: Write an 8-sentence positive sandwich peer feedback using B2 vocabulary
 */

const PROMPTS = [
  { label: '1. Positive opening', placeholder: 'Start with a genuine, specific strength (e.g. "Your report demonstrates a strong command of...")' },
  { label: '2. Strength with evidence', placeholder: 'Identify a second strength and support it with a specific example from their work' },
  { label: '3. Transition to improvement', placeholder: 'Use a smooth bridge phrase (e.g. "To further strengthen...", "One area that could be developed...")' },
  { label: '4. Constructive suggestion 1', placeholder: 'Give a specific, actionable suggestion — explain what to change and why' },
  { label: '5. Constructive suggestion 2', placeholder: 'Offer a second suggestion with a clear rationale' },
  { label: '6. Empathetic acknowledgement', placeholder: 'Show understanding of the writer\'s effort or context (e.g. "I recognise that...")' },
  { label: '7. Encouraging close', placeholder: 'Return to a positive note — highlight their potential or progress' },
  { label: '8. Forward-looking statement', placeholder: 'End with encouragement about future improvement (e.g. "I look forward to seeing...")' },
]

const MODEL_ANSWER = `Your report demonstrates a commendable level of detail and a clear commitment to honest self-reflection. In particular, the Challenges section is well-structured and offers a balanced account of the difficulties encountered during the event. To further strengthen the report, you might consider expanding the Recommendations section with more specific, measurable targets. For instance, rather than suggesting "better time management", you could specify "allocating an additional 15 minutes to each session". Additionally, the Successes section would benefit from the inclusion of participant data or survey results to support your claims. I recognise that gathering and incorporating such data takes considerable time and effort, especially under tight deadlines. Nevertheless, your analytical approach and commitment to improvement are clearly evident throughout the report. I look forward to seeing how you develop these skills in the next draft.`

export default function Phase6SP2Step3RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 8).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'B', filled, PROMPTS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Peer Feedback Discussion</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice — Level B2</Typography>
        <Typography variant="h6">Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Write 8-sentence positive sandwich peer feedback at B2 level</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Write one sentence per section following the <strong>positive sandwich</strong> structure: open positive → constructive suggestions → close positive. Each sentence should be at least 8 words. Use B2 vocabulary: <strong>constructive, specific, balanced, suggest, improve, strengthen</strong>.
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {PROMPTS.map((p, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #8e44ad' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#8e44ad" sx={{ mb: 0.5 }}>
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
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Feedback
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5', border: '2px solid #8e44ad', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }} gutterBottom>
            Task B Complete! Score: {score}/{PROMPTS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 6 ? 'Excellent B2-level peer feedback!' : 'Good effort! Compare your sentences with the model answer below.'}
          </Typography>
          {!showModel ? (
            <Button
              variant="outlined"
              onClick={() => setShowModel(true)}
              sx={{ mb: 2, color: '#8e44ad', borderColor: '#8e44ad' }}
            >
              Show Model Answer
            </Button>
          ) : (
            <Paper sx={{ p: 2, mb: 2, backgroundColor: 'white', border: '1px solid #8e44ad', borderRadius: 1, textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#8e44ad" sx={{ mb: 1 }}>Model Answer:</Typography>
              <Typography variant="body2">{MODEL_ANSWER}</Typography>
            </Paper>
          )}
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b2/task/c')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
