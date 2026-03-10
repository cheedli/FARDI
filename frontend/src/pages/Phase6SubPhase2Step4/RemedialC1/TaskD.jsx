import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, Collapse, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const EXTRACTS = [
  {
    extract: '"Your report is good but the recommendations are not very good."',
    critiqueChip: 'Vague + unbalanced',
    fixChip: 'Specific + evidence-linked',
    expertWeakness:
      'Vague comparative ("not very good") without specificity; the positive is generic and the negative provides no guidance.',
    expertFix:
      '"Your report demonstrates strong organisational clarity; to enhance its impact, the Recommendations section would benefit from specific, measurable targets linked directly to the challenges identified in Section 3."',
  },
  {
    extract: '"I think your report could maybe be a bit more specific in some parts."',
    critiqueChip: 'Over-hedged + vague',
    fixChip: 'Confident + targeted',
    expertWeakness:
      'Excessive hedging ("think", "could maybe", "a bit", "some parts") renders the feedback meaninglessly vague.',
    expertFix:
      '"To strengthen the analytical rigour of the report, I recommend supplementing the qualitative observations in the Challenges section with quantitative data from participant surveys."',
  },
  {
    extract: '"Everything is fine except the conclusion which needs total rewriting."',
    critiqueChip: 'Sweeping negative',
    fixChip: 'Nuanced + constructive',
    expertWeakness:
      '"Total rewriting" is discouraging and imprecise; "everything is fine" is unspecific and the contrast is jarring.',
    expertFix:
      '"The report is largely well-structured and analytically sound. The conclusion, whilst coherent, would benefit from a more explicit synthesis of the key findings and a stronger forward-looking statement to reinforce the report\'s impact."',
  },
  {
    extract: '"Your vocabulary is impressive."',
    critiqueChip: 'Unsubstantiated praise',
    fixChip: 'Evidence-based praise',
    expertWeakness:
      'Unsubstantiated — the writer cannot learn or build on praise without knowing which vocabulary and why it is effective.',
    expertFix:
      '"Your deployment of formal academic register — particularly the consistent use of nominalisations such as \'evaluation\', \'implementation\', and \'accountability\' — reflects a sophisticated command of professional report language."',
  },
  {
    extract: '"Next time, plan better and write more carefully."',
    critiqueChip: 'Directive + no rationale',
    fixChip: 'Empathetic + specific',
    expertWeakness:
      'Directive and blunt with no acknowledgement of effort; offers no specific guidance or empathy.',
    expertFix:
      '"I recognise the considerable effort that producing this report required. For future iterations, I would recommend building in a dedicated proofreading phase and creating a structured planning timeline to ensure all sections receive equal analytical attention."',
  },
]

export default function Phase6SP2Step4RemC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(EXTRACTS.map(() => ''))
  const [revealed, setRevealed] = useState(EXTRACTS.map(() => false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleReveal = (idx) => {
    const updated = [...revealed]
    updated[idx] = true
    setRevealed(updated)
  }

  const handleSubmit = async () => {
    const filled = critiques.filter((c) => wordCount(c) >= 5).length
    setScore(filled)
    setSubmitted(true)
    const allRevealed = EXTRACTS.map(() => true)
    setRevealed(allRevealed)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taskd_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'D', filled, 5, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = critiques.every((c) => c.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial C1 — Task D</Typography>
        <Typography variant="body1">Critique Kahoot — Identify Weaknesses in Flawed Peer Feedback</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Each extract is a flawed piece of peer feedback. Write your critique identifying the weakness, then reveal the expert analysis and improved version. Each critique should contain at least 5 words.
      </Alert>

      {EXTRACTS.map((item, idx) => (
        <Paper key={idx} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0d0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip label={`${idx + 1}`} size="small" sx={{ backgroundColor: '#6c3483', color: 'white', fontWeight: 'bold' }} />
            <Typography variant="subtitle2" fontWeight="bold" color="error.main">Flawed extract:</Typography>
          </Box>

          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: '#fdecea', borderRadius: 1, borderLeft: '4px solid #c62828' }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{item.extract}</Typography>
          </Paper>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={item.critiqueChip} size="small" color="error" variant="outlined" />
            <Chip label={item.fixChip} size="small" color="success" variant="outlined" />
          </Stack>

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Your critique — what is wrong with this feedback?</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={critiques[idx]}
            onChange={(e) => {
              const updated = [...critiques]
              updated[idx] = e.target.value
              setCritiques(updated)
            }}
            disabled={submitted}
            placeholder="Identify the specific weakness in this feedback extract..."
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color={wordCount(critiques[idx]) >= 5 ? 'success.main' : 'text.secondary'}>
            Words: {wordCount(critiques[idx])} {wordCount(critiques[idx]) >= 5 ? '' : '(aim for 5+)'}
          </Typography>

          {!submitted && !revealed[idx] && (
            <Box sx={{ mt: 1.5 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleReveal(idx)}
                sx={{ color: '#8e44ad', borderColor: '#8e44ad' }}
              >
                Reveal Expert Feedback
              </Button>
            </Box>
          )}

          <Collapse in={revealed[idx] || submitted}>
            <Box sx={{ mt: 2 }}>
              <Paper elevation={0} sx={{ p: 2, mb: 1.5, backgroundColor: '#fff3e0', borderRadius: 1, borderLeft: '4px solid #f39c12' }}>
                <Typography variant="body2" fontWeight="bold" color="warning.dark" gutterBottom>Expert critique:</Typography>
                <Typography variant="body2">{item.expertWeakness}</Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 1, borderLeft: '4px solid #27ae60' }}>
                <Typography variant="body2" fontWeight="bold" color="success.dark" gutterBottom>Expert rewrite:</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{item.expertFix}</Typography>
              </Paper>
            </Box>
          </Collapse>
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
          Submit All Critiques
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task D Complete! Score: {score}/5</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 5
              ? 'Exceptional analytical thinking — you identified every weakness with precision.'
              : score >= 3
                ? 'Well done! Compare your critiques with the expert analyses above.'
                : 'Study the expert critiques carefully — identifying weaknesses is a core C1 analytical skill.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Step 5
          </Button>
        </Paper>
      )}
    </Box>
  )
}
