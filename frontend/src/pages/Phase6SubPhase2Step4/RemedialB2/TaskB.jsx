import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, Collapse } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  { num: 1, label: 'Positive opening', instruction: 'Name a specific strength using formal language.' },
  { num: 2, label: 'Second strength', instruction: 'Provide a concrete example from their work.' },
  { num: 3, label: 'Transition', instruction: 'Use "To further strengthen..." or "One area that could be developed..."' },
  { num: 4, label: 'Constructive suggestion 1', instruction: 'Make it specific and actionable.' },
  { num: 5, label: 'Constructive suggestion 2', instruction: 'Include a clear rationale for your suggestion.' },
  { num: 6, label: 'Empathetic acknowledgement', instruction: 'Use "I recognise that..." or "Given the time constraints..."' },
  { num: 7, label: 'Return to positive', instruction: 'Reaffirm the writer\'s overall quality.' },
  { num: 8, label: 'Forward-looking close', instruction: 'Use "I look forward to seeing..." or "I am confident that..."' },
]

const MODEL_ANSWER = `Your report demonstrates an impressive command of formal academic language and a thoughtful, structured approach to evaluating the event. In particular, the Successes section is commendable for its use of specific attendance data and participant satisfaction scores. To further strengthen the report, I would suggest expanding the Recommendations section beyond general statements to include specific, measurable targets. For example, rather than suggesting 'improve communication', you might specify 'hold weekly planning meetings with all event coordinators'. Additionally, the Challenges section, whilst honest, would benefit from a brief explanation of how each difficulty was or could be resolved. I recognise that writing a comprehensive post-event report requires considerable time and analytical effort, particularly when balancing multiple responsibilities. Nevertheless, your commitment to honest self-evaluation and your clear organisational structure are evident throughout. I look forward to seeing how you develop these skills further in your next draft.`

export default function Phase6SP2Step4RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(PROMPTS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter((a) => wordCount(a) >= 8).length
    setScore(filled)
    setSubmitted(true)
    setShowModel(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = answers.every((a) => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial B2 — Task B</Typography>
        <Typography variant="body1">Analysis Odyssey — Write an 8-Sentence B2 Peer Feedback</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Write one sentence for each prompt below to construct a complete peer feedback using the positive sandwich structure. Each sentence should contain at least 8 words.
      </Alert>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#faf5ff', border: '1px solid #d7bde2' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#6c3483', mb: 1 }}>The Positive Sandwich</Typography>
        <Typography variant="body2" color="text.secondary">
          Open with a strength → Give a second strength → Transition → Constructive suggestion 1 → Constructive suggestion 2 → Show empathy → Return to positive → Close with encouragement
        </Typography>
      </Paper>

      {PROMPTS.map((p, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: '1px solid #e0d0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={`${p.num}`}
              size="small"
              sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold', minWidth: 28 }}
            />
            <Typography variant="subtitle2" fontWeight="bold" color="#6c3483">{p.label}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>{p.instruction}</Typography>
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
          <Typography variant="caption" color={wordCount(answers[idx]) >= 8 ? 'success.main' : 'text.secondary'} sx={{ mt: 0.5, display: 'block' }}>
            Words: {wordCount(answers[idx])} {wordCount(answers[idx]) >= 8 ? '(sufficient)' : '(aim for 8+)'}
          </Typography>
        </Paper>
      ))}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAttempted}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Feedback
        </Button>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark" gutterBottom>Task B Complete! Score: {score}/8</Typography>
            <Typography variant="body1">
              {score === 8 ? 'Outstanding! Every sentence met the B2 standard.' : score >= 5 ? 'Good work! Read the model answer below to refine your approach.' : 'Review the model answer carefully to understand the B2 feedback structure.'}
            </Typography>
          </Paper>

          <Collapse in={showModel}>
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f3e5f5', border: '2px solid #8e44ad' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#6c3483" gutterBottom>Model Answer (Complete Feedback)</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{MODEL_ANSWER}</Typography>
            </Paper>
          </Collapse>

          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/c')}
            size="large"
            fullWidth
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task C
          </Button>
        </>
      )}
    </Box>
  )
}
