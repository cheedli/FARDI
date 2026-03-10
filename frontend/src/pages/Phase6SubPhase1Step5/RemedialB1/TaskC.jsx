import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level B1 - Task C
 * Quiz Game: "Wordshake Quiz" — Identify error type in 6 sentences
 */

const QUESTIONS = [
  {
    question: '"Succes was good" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Grammar', 'Formality'],
    correct: 0,
    explanation: 'Spelling error: "succes" should be "success" (double s at the end).'
  },
  {
    question: '"Many people come" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Vocabulary', 'Tone'],
    correct: 1,
    explanation: 'Tense error: "come" should be past tense "came".'
  },
  {
    question: '"Dances nice" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Grammar', 'Vocabulary'],
    correct: 2,
    explanation: 'Grammar error: Missing verb "were" — should be "Dances were nice."'
  },
  {
    question: '"Lights problem bad" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Structure', 'Formality'],
    correct: 2,
    explanation: 'Structure error: Should be "There was a lighting problem" — needs proper sentence structure.'
  },
  {
    question: '"We fix fast" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Vocabulary', 'Grammar'],
    correct: 1,
    explanation: 'Tense error: "fix" should be past tense "fixed". Also "fast" should be "quickly".'
  },
  {
    question: '"People happy" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Grammar', 'Formality'],
    correct: 3,
    explanation: 'Formality error: "People happy" is too informal. Should be "Guests were satisfied" or "Guests gave positive feedback."'
  }
]

export default function Phase6SP1Step5RemB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Wordshake Quiz</Typography>
        <Typography variant="body1">Identify the error type in 6 report sentences</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Wordshake Quiz! For each faulty sentence, identify what TYPE of error it contains: Spelling, Tense, Grammar, Structure, Vocabulary, or Formality. Think carefully!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> Read each sentence and select the type of error it contains. Error types: Spelling (wrong letters), Tense (wrong verb form), Grammar (missing words), Structure (wrong order), Vocabulary (wrong word choice), Formality (too informal).</Typography>
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
                  control={<Radio disabled={submitted} />}
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
          sx={{ mt: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Quiz
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task C Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{QUESTIONS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 5 ? 'Excellent! You can identify error types in report writing.' : score >= 4 ? 'Good work! Review the explanations above.' : 'Keep practicing — understanding error types helps you proofread better.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Continue to Sub-Phase 2 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
