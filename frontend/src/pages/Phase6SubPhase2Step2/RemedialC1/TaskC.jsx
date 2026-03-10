import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  {
    question: 'What is the primary value of writing "trial feedback" before formal feedback?',
    options: [
      'It lets you avoid giving real feedback later',
      'It helps you experiment with structure, tone, and vocabulary without pressure',
      'It replaces the need for any further feedback',
      'It is only useful for lower proficiency levels'
    ],
    correct: 1
  },
  {
    question: 'Why is the "positive sandwich" technique psychologically effective in peer feedback?',
    options: [
      'It makes feedback shorter and easier to write',
      'It hides the criticism between two positive statements',
      'Opening with strengths reduces defensiveness and makes suggestions easier to accept',
      'It always guarantees that the writer will agree with the feedback'
    ],
    correct: 2
  },
  {
    question: 'What distinguishes "specific" feedback from "general" feedback?',
    options: [
      'Specific feedback is always longer',
      'General feedback uses more advanced vocabulary',
      'Specific feedback provides concrete examples and actionable steps rather than vague comments',
      'Specific feedback is always positive'
    ],
    correct: 2
  },
  {
    question: 'How does showing empathy improve the quality of peer feedback?',
    options: [
      'It means you agree with all the writer\'s choices',
      'It makes feedback softer but less honest',
      'It acknowledges the writer\'s effort and reduces resistance to constructive suggestions',
      'Empathy is not appropriate in academic feedback'
    ],
    correct: 2
  },
  {
    question: 'Which sentence demonstrates the most "actionable" feedback?',
    options: [
      '"This report needs improvement."',
      '"The recommendations could be better."',
      '"The recommendations would be stronger if you included measurable targets, for example adding specific attendance figures."',
      '"Good report overall."'
    ],
    correct: 2
  },
  {
    question: 'Why is "balanced" feedback more credible than purely positive or purely negative feedback?',
    options: [
      'Because it is always longer',
      'Because it shows the reviewer has genuinely engaged with both strengths and areas for growth',
      'Because it uses more complex vocabulary',
      'Because positive feedback is always less reliable'
    ],
    correct: 1
  }
]

export default function Phase6SP2Step2RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step2_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'C1', 'C', correct, QUESTIONS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 2: Remedial C1 - Task C</Typography>
        <Typography variant="body1">Advanced Quiz: Analyzing Trial Feedback Quality</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Answer 6 advanced questions analyzing the principles of effective trial peer feedback.</Alert>
      {QUESTIONS.map((q, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (parseInt(answers[idx]) === q.correct ? 'success.main' : 'error.main') : '#e0e0e0' }}>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
          <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
            {q.options.map((opt, oi) => (
              <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} />} label={opt} />
            ))}
          </RadioGroup>
          {submitted && parseInt(answers[idx]) !== q.correct && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>{q.options[q.correct]}</strong></Typography>}
        </Paper>
      ))}
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit Answers</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/{QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/3')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Step 3</Button>
        </Paper>
      )}
    </Box>
  )
}
