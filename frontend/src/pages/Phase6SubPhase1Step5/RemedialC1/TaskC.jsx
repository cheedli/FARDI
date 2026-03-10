import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level C1 - Task C
 * Advanced Quiz: "Quizlet Live" — Identify/fix errors in 6 complex report sentences
 */

const QUESTIONS = [
  {
    question: '"Festival good" — what is the precise error and its C1-level correction?',
    options: [
      'Formality → The festival was successful',
      'Spelling → The festival was successfull',
      'Tense → The festival is successful',
      'Grammar → Festival was good'
    ],
    correct: 0,
    explanation: 'Formality error: "good" is too informal for a formal report. "Successful" is the appropriate register. Full correction: "The festival was successful."'
  },
  {
    question: '"Many people come" — what is the precise error and its C1-level correction?',
    options: [
      'Spelling error',
      'Tense → Many people came',
      'Vocabulary → Many people arrived',
      'Structure → Many came people'
    ],
    correct: 1,
    explanation: 'Tense error: "come" is present tense; the report describes a past event. Correction: "Many people came." Even better: "Over 200 participants attended."'
  },
  {
    question: '"Lighting failure but resolved" — what is missing at C1 level?',
    options: [
      'Nothing — this is correct',
      'Past tense verb',
      'Balance: how it was resolved + impact mitigation',
      'An article before "lighting"'
    ],
    correct: 2,
    explanation: 'At C1, a good correction explains how the challenge was resolved and what the impact was. E.g., "While a lighting failure occurred, rapid contingency deployment ensured minimal disruption."'
  },
  {
    question: '"People liked the event" — what C1-level improvement is needed?',
    options: [
      'Change to past tense',
      'Add more specificity and formal vocabulary: participant satisfaction data/feedback evidence',
      'Nothing — this is a complete sentence',
      'Add "very much" after "liked"'
    ],
    correct: 1,
    explanation: 'At C1, vague statements must be supported with evidence. Better: "Participant satisfaction surveys indicated high approval ratings, with 87% describing the event as well-organized."'
  },
  {
    question: '"I recommend more backup" — what needs improving for C1 recommendations?',
    options: [
      'Change "I" to "We"',
      'Make it actionable and strategic: specify what backup, when, and why',
      'Use past tense: "I recommended"',
      'Nothing — recommendations are personal'
    ],
    correct: 1,
    explanation: 'C1 recommendations must be specific and actionable. Better: "It is strongly recommended that future events establish a dedicated technical contingency team with pre-tested backup systems at least 48 hours before each event."'
  },
  {
    question: '"The festival had some good things and some bad things" — what C1-level rewrite is best?',
    options: [
      '"The festival was balanced."',
      '"The festival had positives and negatives."',
      '"The festival demonstrated notable strengths in cross-cultural engagement while revealing critical areas requiring strategic improvement."',
      '"The festival was good and bad."'
    ],
    correct: 2,
    explanation: 'The C1 version uses sophisticated vocabulary (demonstrated, notable, cross-cultural engagement, strategic improvement), balanced structure, and formal register appropriate for a professional report.'
  }
]

export default function Phase6SP1Step5RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Quizlet Live</Typography>
        <Typography variant="body1">Identify and fix advanced errors in 6 complex report sentences</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Quizlet Live! These questions test C1-level understanding of report writing. They require you to identify not just WHAT is wrong, but WHY — and what the sophisticated correction should be. Think analytically!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> For each question, select the most accurate identification of the error and its best C1-level correction. Some questions test understanding of WHY certain choices are better.</Typography>
      </Alert>

      <Stack spacing={3}>
        {QUESTIONS.map((q, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 3, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (parseInt(answers[idx]) === q.correct ? 'success.main' : 'error.main') : '#e0e0e0' }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>{idx + 1}. {q.question}</Typography>
            <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
              {q.options.map((opt, oi) => (
                <FormControlLabel
                  key={oi}
                  value={oi.toString()}
                  control={<Radio disabled={submitted} sx={{ '&.Mui-checked': { color: submitted ? (oi === q.correct ? 'success.main' : 'error.main') : '#8e44ad' } }} />}
                  label={
                    <Typography variant="body2" sx={{ color: submitted ? (oi === q.correct ? 'success.dark' : parseInt(answers[idx]) === oi ? 'error.dark' : 'text.secondary') : 'text.primary' }}>
                      {opt}{submitted && oi === q.correct ? ' ✓' : ''}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
            {submitted && (
              <Alert severity={parseInt(answers[idx]) === q.correct ? 'success' : 'error'} sx={{ mt: 2 }}>
                <Typography variant="body2">{q.explanation}</Typography>
              </Alert>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Quiz
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task C Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{QUESTIONS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === QUESTIONS.length ? 'Perfect! Outstanding analytical understanding of C1 report writing.' : score >= 4 ? 'Excellent! Strong analytical grasp of professional report quality.' : 'Good effort! Review the detailed explanations above to deepen your C1 understanding.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/c1/task/d')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task D →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
