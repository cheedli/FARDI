import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert, Chip, Collapse } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  {
    question: 'Why is it more effective to open peer feedback with a specific strength rather than a generic compliment like "Well done!"?',
    options: [
      'It is polite.',
      'Generic compliments signal inattention; specific praise demonstrates engagement with the work and builds the credibility of subsequent critique.',
      'It makes the feedback longer.',
      'It avoids conflict.',
    ],
    correct: 1,
    explanation:
      'Credibility is established through specificity — vague praise is dismissed; engaged, textual praise signals that your critique is equally thoughtful.',
  },
  {
    question:
      'A C1 peer reviewer writes: "The report is comprehensive, though the Recommendations section, whilst well-intentioned, lacks the specificity required to function as actionable guidance for future stakeholders." What makes this C1-level?',
    options: [
      'It is long.',
      'It balances genuine praise with a nuanced, evidence-linked critique using sophisticated hedging and stakeholder awareness.',
      'It uses passive voice.',
      'It ends negatively.',
    ],
    correct: 1,
    explanation:
      'This demonstrates balance, specificity, hedging ("whilst"), and stakeholder awareness — all hallmarks of C1 analytical writing.',
  },
  {
    question:
      'When should you use hedging language (e.g. "might", "could", "it is worth considering") in peer feedback?',
    options: [
      'Always, to avoid being definitive.',
      'Never — it makes feedback seem weak.',
      'When making suggestions or expressing opinions, to maintain epistemic humility and reduce the risk of the feedback being received as prescriptive.',
      'Only in the opening sentence.',
    ],
    correct: 2,
    explanation:
      'Hedging in feedback signals intellectual humility and invites dialogue rather than imposing judgment — this is a key feature of sophisticated academic discourse.',
  },
  {
    question:
      'Why is linking a constructive suggestion to a specific section or moment in the text a marker of C1-level feedback?',
    options: [
      'It shows you read the whole document.',
      'It demonstrates close reading, analytical precision, and provides actionable, evidence-based guidance that the writer can directly apply.',
      'It makes the feedback more formal.',
      'It is a requirement of the positive sandwich.',
    ],
    correct: 1,
    explanation:
      'Evidence-based feedback is more credible, actionable, and demonstrates the analytical depth expected at C1 level.',
  },
  {
    question:
      'A student\'s feedback closing reads: "Overall, nice work — keep it up!" Why is this insufficient at C1 level?',
    options: [
      'It is too short.',
      'It should use passive voice.',
      'It is generic, fails to synthesise the key findings, and offers no forward-looking growth orientation — a C1 close should affirm potential and invite further development.',
      'It uses informal language only.',
    ],
    correct: 2,
    explanation:
      'A C1 closing should synthesise, affirm, and orient forward — it is an evaluative statement, not a social nicety.',
  },
  {
    question:
      'What is the purpose of empathetic acknowledgement in peer feedback (e.g. "I recognise that...")?',
    options: [
      'To show you understand the writer\'s feelings and context, which increases the likelihood that your constructive suggestions will be received and acted upon.',
      'To make the feedback more personal and informal.',
      'To avoid giving criticism.',
      'To add more words to the feedback.',
    ],
    correct: 0,
    explanation:
      'Empathy in feedback is strategic as well as humane — acknowledging context signals that your critique is fair and considered, not arbitrary.',
  },
]

export default function Phase6SP2Step4RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_c1' })
  const [selections, setSelections] = useState(QUESTIONS.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelect = (qIdx, val) => {
    if (submitted) return
    const updated = [...selections]
    updated[qIdx] = Number(val)
    setSelections(updated)
  }

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (selections[i] === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = selections.every((s) => s !== null)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial C1 — Task C</Typography>
        <Typography variant="body1">Quizlet Live — Advanced Analytical Questions on C1 Peer Feedback</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Answer each question about the principles and techniques behind C1-level peer feedback writing. Explanations will appear after submission.
      </Alert>

      {QUESTIONS.map((q, qIdx) => {
        const selected = selections[qIdx]
        const isCorrect = submitted && selected === q.correct
        const isWrong = submitted && selected !== q.correct

        return (
          <Paper
            key={qIdx}
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: submitted ? `2px solid ${isCorrect ? '#27ae60' : '#e74c3c'}` : '1px solid #e0d0f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <Chip
                label={`Q${qIdx + 1}`}
                size="small"
                sx={{ backgroundColor: '#6c3483', color: 'white', fontWeight: 'bold', flexShrink: 0, mt: 0.2 }}
              />
              <Typography variant="body1" fontWeight="bold">{q.question}</Typography>
            </Box>

            <RadioGroup
              value={selected !== null ? selected.toString() : ''}
              onChange={(e) => handleSelect(qIdx, e.target.value)}
            >
              {q.options.map((opt, oIdx) => {
                let optColor = 'inherit'
                let optBg = 'transparent'
                if (submitted) {
                  if (oIdx === q.correct) { optColor = '#1b5e20'; optBg = '#e8f5e9' }
                  else if (oIdx === selected && selected !== q.correct) { optColor = '#b71c1c'; optBg = '#fdecea' }
                }
                return (
                  <FormControlLabel
                    key={oIdx}
                    value={oIdx.toString()}
                    control={<Radio size="small" />}
                    disabled={submitted}
                    label={
                      <Typography variant="body2" sx={{ color: optColor }}>{opt}</Typography>
                    }
                    sx={{ mb: 0.5, pl: 1, borderRadius: 1, backgroundColor: optBg, transition: 'background-color 0.2s' }}
                  />
                )
              })}
            </RadioGroup>

            <Collapse in={submitted}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 1,
                  backgroundColor: isCorrect ? '#e8f5e9' : '#fff3e0',
                  borderLeft: `4px solid ${isCorrect ? '#27ae60' : '#f39c12'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                {isCorrect
                  ? <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 20, flexShrink: 0, mt: 0.2 }} />
                  : <CancelIcon sx={{ color: '#e74c3c', fontSize: 20, flexShrink: 0, mt: 0.2 }} />
                }
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={isCorrect ? 'success.dark' : 'error.dark'} gutterBottom>
                    {isCorrect ? 'Correct!' : `Incorrect — correct answer: option ${q.correct + 1}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{q.explanation}</Typography>
                </Box>
              </Paper>
            </Collapse>
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit All Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task C Complete! Score: {score}/6</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 6
              ? 'Excellent — you have a thorough analytical understanding of C1 peer feedback principles.'
              : score >= 4
                ? 'Strong performance! Review the explanations for any questions you missed.'
                : 'Read each explanation carefully — these principles are fundamental to producing C1-level peer feedback.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/c1/task/d')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task D
          </Button>
        </Paper>
      )}
    </Box>
  )
}
