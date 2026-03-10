import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task C
 * Advanced Quiz: "Quizlet Live"
 * Answer 6 analytical questions about key concepts in writing a post-event report
 */

const QUESTIONS = [
  {
    question: 'Why should a post-event report include weaknesses?',
    options: [
      'Demonstrate transparency & enable improvement',
      'Make the report longer',
      'Impress stakeholders with honesty',
      'Because it is required by law'
    ],
    correct: 0,
    explanation: 'Including weaknesses demonstrates transparency and creates the foundation for genuine improvement in future events.'
  },
  {
    question: 'Why use evidence (numbers, quotes) in a report?',
    options: [
      'To make the report look professional',
      'Increases credibility & supports recommendations',
      'Because stakeholders like data',
      'To fill space in the report'
    ],
    correct: 1,
    explanation: 'Evidence increases credibility and provides objective support for your claims and recommendations.'
  },
  {
    question: 'What is the primary role of recommendations in a post-event report?',
    options: [
      'Criticise the team',
      'Summarise what happened',
      'Provide actionable steps for future events',
      'Show that you identified problems'
    ],
    correct: 2,
    explanation: 'Recommendations provide actionable, specific steps that turn lessons learned into future performance improvements.'
  },
  {
    question: 'Why is it important to balance positive and negative points?',
    options: [
      'To avoid conflict with stakeholders',
      'Builds trust & shows objectivity',
      'Because negative points are more important',
      'To demonstrate writing skill'
    ],
    correct: 1,
    explanation: 'A balanced report builds trust and shows objectivity — it demonstrates intellectual honesty and prevents accusations of bias.'
  },
  {
    question: 'What is the significance of stakeholder feedback in a report?',
    options: [
      'It validates your personal opinions',
      'It makes the report more interesting',
      'Measures real impact & guides decisions',
      'It shows participants were satisfied'
    ],
    correct: 2,
    explanation: 'Stakeholder feedback measures the real impact of the event and provides evidence-based guidance for future decisions.'
  },
  {
    question: 'What is the best tone for a formal post-event report?',
    options: [
      'Personal, emotional, and passionate',
      'Informal and conversational',
      'Objective, professional, constructive',
      'Critical and analytical only'
    ],
    correct: 2,
    explanation: 'A formal report requires objective, professional, and constructive language — avoiding emotional or informal expressions.'
  }
]

export default function Phase6SP1Step1RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Quizlet Live</Typography>
        <Typography variant="body1">Answer 6 analytical questions about post-event report writing</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Quizlet Live! Answer 6 analytical questions about key concepts in writing a post-event report. These questions test your deep understanding of WHY we write reports, not just HOW. Think carefully!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> For each question, select the best answer. These are analytical questions
          that require understanding of purpose, not just definitions.
        </Typography>
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
            {score === QUESTIONS.length ? 'Perfect! Outstanding analytical understanding!' : score >= 4 ? 'Excellent! Strong conceptual grasp of report writing.' : 'Good effort! Review the explanations above to deepen your understanding.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/c1/task/d')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task D →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
