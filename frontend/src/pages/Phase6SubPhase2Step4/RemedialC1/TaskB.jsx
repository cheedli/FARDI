import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, Collapse } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  {
    num: 1,
    label: 'Sophisticated positive opening',
    instruction: 'Use "demonstrates", "commendable", "analytical rigour". Minimum 10 words.',
  },
  {
    num: 2,
    label: 'Specific strength with textual evidence',
    instruction: 'Quote or paraphrase from their work. Minimum 10 words.',
  },
  {
    num: 3,
    label: 'Second strength with broader impact',
    instruction: 'Explain how it serves the reader or stakeholder. Minimum 10 words.',
  },
  {
    num: 4,
    label: 'Nuanced transition',
    instruction: 'Use "notwithstanding", "whilst", or "it is worth noting that". Minimum 10 words.',
  },
  {
    num: 5,
    label: 'Evidence-based constructive suggestion 1',
    instruction: 'Link to a specific section or finding. Minimum 10 words.',
  },
  {
    num: 6,
    label: 'Evidence-based constructive suggestion 2',
    instruction: 'Include rationale referencing audience or purpose. Minimum 10 words.',
  },
  {
    num: 7,
    label: 'Empathetic contextual acknowledgement',
    instruction: 'Recognise external factors or constraints. Minimum 10 words.',
  },
  {
    num: 8,
    label: 'Forward-looking evaluative close',
    instruction: 'Affirm potential and invite continued dialogue. Minimum 10 words.',
  },
]

const MODEL_ANSWER = `This report demonstrates commendable analytical rigour and a nuanced understanding of both the successes and challenges inherent in large-scale event management. The executive summary is particularly effective, offering a concise yet comprehensive overview that contextualises the subsequent findings with clarity and precision. Furthermore, the Recommendations section reflects a sophisticated grasp of stakeholder accountability, linking each proposal directly to an identified gap in the event's delivery. Notwithstanding these considerable strengths, the Challenges section would benefit from a more evidence-based analysis — for instance, supplementing the qualitative observations with data from participant exit surveys would significantly strengthen the credibility of your conclusions. Additionally, whilst the tone throughout is appropriately formal, some passages in the methodology section could be restructured to improve logical flow and coherence for the non-specialist reader. I recognise that producing a report of this scope demands substantial time and intellectual investment, particularly in the context of competing institutional demands. Nevertheless, the quality of your analysis and the clarity of your organisational framework reflect a genuine commitment to professional excellence. I am confident that with these targeted refinements, this report will serve as an exemplary model of evidence-based reflective practice.`

const C1_VOCAB = ['evidence-based', 'nuanced', 'accountability', 'objectivity', 'credibility', 'growth mindset']

export default function Phase6SP2Step4RemC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(PROMPTS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter((a) => wordCount(a) >= 10).length
    setScore(filled)
    setSubmitted(true)
    setShowModel(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = answers.every((a) => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial C1 — Task B</Typography>
        <Typography variant="body1">Analysis Odyssey — Write a Sophisticated 8-Sentence C1 Peer Feedback</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Write one sentence per prompt to build a complete C1-level peer feedback using the positive sandwich. Each sentence must contain at least 10 words and demonstrate sophisticated academic language.
      </Alert>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#faf5ff', border: '1px solid #d7bde2' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#6c3483', mb: 1 }}>Target C1 Vocabulary — Try to use these in your writing</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {C1_VOCAB.map((v) => (
            <Chip key={v} label={v} size="small" sx={{ backgroundColor: '#6c3483', color: 'white', fontWeight: 'bold' }} />
          ))}
        </Box>
      </Paper>

      {PROMPTS.map((p, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: '1px solid #e0d0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={`${p.num}`}
              size="small"
              sx={{ backgroundColor: '#6c3483', color: 'white', fontWeight: 'bold', minWidth: 28 }}
            />
            <Typography variant="subtitle2" fontWeight="bold" color="#6c3483">{p.label}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>{p.instruction}</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={answers[idx]}
            onChange={(e) => {
              const updated = [...answers]
              updated[idx] = e.target.value
              setAnswers(updated)
            }}
            disabled={submitted}
            placeholder="Write your sentence here..."
          />
          <Typography
            variant="caption"
            color={wordCount(answers[idx]) >= 10 ? 'success.main' : 'text.secondary'}
            sx={{ mt: 0.5, display: 'block' }}
          >
            Words: {wordCount(answers[idx])} {wordCount(answers[idx]) >= 10 ? '(sufficient)' : '(aim for 10+)'}
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
              {score === 8
                ? 'Exceptional! Every sentence met the C1 standard — sophisticated, evidence-based, and structured.'
                : score >= 5
                  ? 'Strong effort! Compare your sentences with the model answer to identify areas for refinement.'
                  : 'Review the model answer carefully and focus on using nuanced vocabulary and evidence-linked language.'}
            </Typography>
          </Paper>

          <Collapse in={showModel}>
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f3e5f5', border: '2px solid #8e44ad' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#6c3483" gutterBottom>Model Answer (Complete C1 Feedback)</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.9 }}>{MODEL_ANSWER}</Typography>
            </Paper>
          </Collapse>

          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/c1/task/c')}
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
