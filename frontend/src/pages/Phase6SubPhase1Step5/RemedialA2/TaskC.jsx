import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level A2 - Task C
 * Grammar Exercise: "Sentence Builder" — Correct 6 grammar mistakes in simple report sentences
 */

const QUESTIONS = [
  {
    question: 'Which is the correct version of "Festival good."?',
    options: ['Festival good.', 'The festival was good.', 'Festival was good.', 'The festival good.'],
    correct: 1,
    explanation: 'Add "The" (article) and "was" (past tense verb) → "The festival was good."'
  },
  {
    question: 'Which is the correct version of "Many people come."?',
    options: ['Many people come.', 'Many people comed.', 'Many people came.', 'Many peoples came.'],
    correct: 2,
    explanation: 'Use past tense: "come" → "came" → "Many people came."'
  },
  {
    question: 'Which is the correct version of "Dances nice."?',
    options: ['Dances nice.', 'The dances were nice.', 'Dance was nice.', 'Dances was nice.'],
    correct: 1,
    explanation: 'Add "The" and past tense "were" → "The dances were nice."'
  },
  {
    question: 'Which is the correct version of "Lights problem."?',
    options: ['Lights problem.', 'There was a lights problem.', 'Lights was a problem.', 'There were lights problem.'],
    correct: 1,
    explanation: '"There was a lights problem." — uses correct structure with "there was".'
  },
  {
    question: 'Which is the correct version of "We fix it."?',
    options: ['We fix it.', 'We fixing it.', 'We fixed it.', 'We fixes it.'],
    correct: 2,
    explanation: 'Use past tense: "fix" → "fixed" → "We fixed it."'
  },
  {
    question: 'Which is the correct version of "Next time good."?',
    options: ['Next time good.', 'Next time will be better.', 'Next time is better.', 'Next time were better.'],
    correct: 1,
    explanation: '"Next time will be better." — uses future tense correctly with complete sentence structure.'
  }
]

export default function Phase6SP1Step5RemA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Sentence Builder</Typography>
        <Typography variant="body1">Choose the grammatically correct version of each sentence</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Sentence Builder! Each question shows a faulty sentence. Choose the correct version. Focus on: articles (the/a), past tense verbs (was/were/came/fixed), and complete sentence structure!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> Each question has a short faulty sentence. Select the grammatically correct version from the options.</Typography>
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
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: submitted ? (oi === q.correct ? 'success.dark' : parseInt(answers[idx]) === oi ? 'error.dark' : 'text.secondary') : 'text.primary' }}>
                      {opt}{submitted && oi === q.correct ? ' ✓' : ''}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
            {submitted && (
              <Alert severity={parseInt(answers[idx]) === q.correct ? 'success' : 'info'} sx={{ mt: 1 }}>
                <Typography variant="body2">{q.explanation}</Typography>
              </Alert>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task C Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{QUESTIONS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 5 ? 'Excellent! You can identify correct grammar in report sentences.' : score >= 4 ? 'Good work! Review the explanations above.' : 'Good effort! Remember: use past tense and articles in formal sentences.'}
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
