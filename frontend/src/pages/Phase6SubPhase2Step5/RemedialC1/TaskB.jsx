import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert, TextField, Collapse, Chip, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const FAULTY_TEXT =
  'This report is ok. Sucesses are good. Challange part needs work. Grammer errors. Recomendations not specific. Structure is bad. Do better. Good luck!'

const KEY_TERMS = ['credibility', 'objectivity', 'nuanced', 'accountability', 'evidence-based', 'growth mindset']

const MODEL_ANSWER =
  'This report reflects a commendable level of analytical effort and a genuine commitment to honest self-evaluation of the event\'s outcomes. The Successes section demonstrates strong evidence-based reasoning, effectively linking achievements to measurable outcomes such as attendance figures and satisfaction ratings. Furthermore, the overall organisational structure reflects a sophisticated understanding of academic report conventions, lending the document considerable credibility with its intended stakeholder audience. Notwithstanding these strengths, the Challenges section would benefit from a more nuanced and evidence-based analysis — supplementing the qualitative observations with quantitative data from participant exit surveys would significantly enhance the section\'s objectivity. Additionally, whilst the Recommendations are appropriate in their scope, greater specificity — for instance, replacing \'improve communication\' with \'establish a weekly cross-departmental briefing protocol\' — would render them substantially more actionable. I recognise that producing a report of this analytical depth requires sustained intellectual effort and careful management of competing responsibilities, particularly in a time-constrained context. Nevertheless, the quality of your reflective analysis and your evident accountability to the event\'s stakeholders demonstrate a level of professional maturity that is commendable. I am confident that with these targeted refinements, this report will exemplify best practice in evidence-based, analytically rigorous post-event evaluation.'

const PROMPTS = [
  'Sophisticated positive opening — formal, specific, acknowledge overall quality (min. 10 words).',
  'Evidence-based strength — cite specific section/language with textual reference (min. 10 words).',
  'Second strength with stakeholder impact (min. 10 words).',
  'Nuanced transition — use: notwithstanding / whilst / it is worth noting (min. 10 words).',
  'Evidence-based constructive suggestion 1 — linked to a specific section (min. 10 words).',
  'Evidence-based constructive suggestion 2 — with audience/purpose rationale (min. 10 words).',
  'Empathetic acknowledgement — contextual, not generic (min. 10 words).',
  'Evaluative C1 close — synthesise findings, affirm potential, invite dialogue (min. 10 words).',
]

export default function Phase6SP2Step5RemC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const handleChange = (index, value) => {
    setAnswers(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const wordCount = (text) => text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter(a => wordCount(a) >= 10).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_c1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const anyFilled = answers.some(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial C1 — Task B</Typography>
        <Typography variant="body1">Analysis Odyssey — C1-Level Rewrite of a Severely Flawed Feedback Draft</Typography>
      </Paper>

      {/* Key terms reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#6c3483', mb: 1 }}>
          C1 Key Terms to Use (incorporate where appropriate):
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {KEY_TERMS.map(t => (
            <Chip key={t} label={t} size="small" sx={{ bgcolor: '#8e44ad', color: 'white', fontWeight: 'bold', mb: 1 }} />
          ))}
        </Stack>
      </Paper>

      {/* Faulty text */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#fdecea', border: '1px solid #f5b7b1' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#922b21' }}>Faulty Feedback Draft to Rewrite</Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#4a235a' }}>
          {FAULTY_TEXT}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
          This draft contains spelling errors, fragmented sentences, vague language, and lacks analytical depth. Rewrite each part using the 8 prompts below. Each sentence must be at least 10 words and demonstrate C1-level precision.
        </Typography>
      </Paper>

      {PROMPTS.map((prompt, index) => {
        const wc = wordCount(answers[index])
        const isSufficient = submitted && wc >= 10
        const isInsufficient = submitted && wc < 10

        return (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3, mb: 2, borderRadius: 2,
              border: submitted
                ? isSufficient ? '2px solid #27ae60' : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#8e44ad', fontWeight: 'bold', mb: 1 }}>
              Sentence {index + 1}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>{prompt}</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[index]}
              onChange={e => handleChange(index, e.target.value)}
              disabled={submitted}
              placeholder={`Write your C1-level sentence ${index + 1} here (min. 10 words)...`}
              sx={{ mb: 1 }}
            />
            <Typography
              variant="caption"
              color={submitted && wc < 10 ? 'error' : 'text.secondary'}
            >
              Words: {wc} {submitted && wc < 10 ? '(minimum 10 words required)' : ''}
            </Typography>
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!anyFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit C1 Rewrite
        </Button>
      ) : (
        <Box>
          <Alert severity={score >= 6 ? 'success' : score >= 4 ? 'warning' : 'info'} sx={{ mb: 2 }}>
            You completed {score}/8 sentences with sufficient C1-level detail (10+ words each).{' '}
            {score === 8
              ? 'Outstanding C1 analytical writing!'
              : 'Review the model answer below for guidance on sentence structure and key term usage.'}
          </Alert>

          <Button
            variant="outlined"
            startIcon={<LightbulbIcon />}
            onClick={() => setShowModel(prev => !prev)}
            sx={{ mb: 2, borderColor: '#8e44ad', color: '#8e44ad', '&:hover': { bgcolor: '#f9f0ff' } }}
          >
            {showModel ? 'Hide Model Answer' : 'Show Model Answer'}
          </Button>

          <Collapse in={showModel}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f9f0ff', borderRadius: 2, border: '1px solid #d7bde2' }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#6c3483', mb: 1 }}>
                Model Answer
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.9, color: '#4a235a' }}>
                {MODEL_ANSWER}
              </Typography>
            </Paper>
          </Collapse>

          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
            <Typography variant="h5" sx={{ color: '#6c3483' }}>Task B Complete! Score: {score}/8</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 6
                ? 'Excellent C1 analytical writing — evidence-based, nuanced, and formally precise.'
                : 'Good effort! Study the model answer to deepen your command of C1 academic feedback discourse.'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/phase6/subphase/2/step/5/remedial/c1/task/c')}
              size="large"
              sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
            >
              Continue to Task C
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
