import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level C1 — Task C
 * Quizlet Live: 6 advanced questions about WHY report-writing decisions are made
 */

const QUESTIONS = [
  {
    question: 'Why is it important to use evidence (data, figures) in a post-event report rather than just stating opinions?',
    options: [
      'It makes the report longer and more impressive.',
      'It ensures credibility and allows stakeholders to verify claims objectively.',
      'It shows you have good vocabulary.',
      'It is a rule that all reports must follow.',
    ],
    correct: 1,
    explanation: 'Evidence-based reporting ensures credibility and objectivity — stakeholders can verify findings rather than relying on subjective impressions.'
  },
  {
    question: 'A report states: "The event went well." What is the main weakness of this sentence at C1 level?',
    options: [
      'It uses the wrong tense.',
      'It is too long.',
      'It is vague, subjective, and lacks specific evidence or measurable outcomes.',
      'It should start with "Furthermore".',
    ],
    correct: 2,
    explanation: 'C1 reports require precise, evidence-based language. "Went well" is subjective and unverifiable — it must be replaced with specific, measurable claims.'
  },
  {
    question: 'When writing about challenges, which approach is most appropriate for a C1-level report?',
    options: [
      'Omit challenges to make the report more positive.',
      'List challenges briefly without explanation.',
      'Acknowledge challenges with nuanced language, explaining their cause and resolution.',
      'Use informal language to show honesty.',
    ],
    correct: 2,
    explanation: 'A balanced, nuanced treatment of challenges demonstrates analytical maturity. Omitting them undermines the report\'s objectivity and accountability.'
  },
  {
    question: 'Which opening is most appropriate for a C1 post-event report?',
    options: [
      '"This report is about the event that happened."',
      '"This report presents a comprehensive evaluation of the outcomes of the annual symposium held on 5 March."',
      '"The event was great and we learned a lot."',
      '"Here is the report about what we did."',
    ],
    correct: 1,
    explanation: 'C1 reports open with a formal, precise statement of purpose. The second option uses appropriate academic register and provides key contextual information.'
  },
  {
    question: 'Why should recommendations in a report be linked to specific findings?',
    options: [
      'To make the report more interesting to read.',
      'Because all reports must have exactly three recommendations.',
      'To ensure recommendations are actionable and justified by evidence rather than arbitrary.',
      'To demonstrate the writer\'s creativity.',
    ],
    correct: 2,
    explanation: 'Linking recommendations to findings (e.g. "In light of the low attendance figures...") ensures they are evidence-based, stakeholder-relevant, and actionable.'
  },
  {
    question: 'A report says: "Notwithstanding the logistical constraints encountered, the event achieved its core objectives." What does this sentence demonstrate?',
    options: [
      'Poor grammar and overuse of formal language.',
      'A nuanced, balanced evaluation that acknowledges difficulty while affirming success.',
      'The writer is trying to hide the problems.',
      'That the event was mostly unsuccessful.',
    ],
    correct: 1,
    explanation: '"Notwithstanding" signals a concessive relationship — the writer acknowledges a challenge while asserting a positive outcome. This balance is characteristic of C1-level analytical writing.'
  },
]

export default function Phase6SP1Step4RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level C1</Typography>
        <Typography variant="h6">Task C: Quizlet Live</Typography>
        <Typography variant="body1">6 advanced analytical questions about report-writing decisions</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        These questions test your understanding of <strong>why</strong> certain report-writing choices are made — not just what they are.
      </Alert>

      <Stack spacing={3} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, idx) => {
          const answered = answers[idx] !== undefined
          const isCorrect = submitted && parseInt(answers[idx]) === q.correct
          const isWrong = submitted && parseInt(answers[idx]) !== q.correct
          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '2px solid',
                borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : '#e0e0e0',
                backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
                {idx + 1}. {q.question}
              </Typography>
              <RadioGroup
                value={answers[idx] ?? ''}
                onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}
              >
                {q.options.map((opt, oi) => (
                  <FormControlLabel
                    key={oi}
                    value={oi.toString()}
                    control={<Radio disabled={submitted} />}
                    label={opt}
                    sx={{
                      ...(submitted && oi === q.correct && { '& .MuiFormControlLabel-label': { color: '#27ae60', fontWeight: 'bold' } }),
                      ...(submitted && isWrong && oi === parseInt(answers[idx]) && { '& .MuiFormControlLabel-label': { color: '#f44336' } }),
                    }}
                  />
                ))}
              </RadioGroup>
              {submitted && (
                <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 1.5, borderRadius: 1 }}>
                  <Typography variant="body2">{q.explanation}</Typography>
                </Alert>
              )}
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task C Complete! Score: {score}/{QUESTIONS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 5 ? 'Outstanding analytical thinking at C1 level!' : 'Good effort! Review the explanations above carefully.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/c1/task/d')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Task D →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
