import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level C1 - Task C
 * Advanced Quiz: 6 questions on report concepts for C1 level
 */

const QUESTIONS = [
  {
    question: 'What is the purpose of including weaknesses in a post-event report?',
    options: [
      'To embarrass the organizing team',
      'Enable improvement — honest documentation drives learning and better future performance',
      'To satisfy format requirements only'
    ],
    correct: 1,
    explanation: 'Including weaknesses enables improvement: honest documentation of what went wrong provides the necessary basis for targeted, evidence-based recommendations that genuinely drive performance enhancement.'
  },
  {
    question: 'What role does evidence play in ensuring report credibility?',
    options: [
      'It ensures credibility — data and quotes support claims objectively',
      'It increases the word count of the report',
      'It replaces the need for stakeholder input'
    ],
    correct: 0,
    explanation: 'Evidence (attendance data, feedback quotes, comparative statistics) ensures credibility by grounding claims in verifiable reality — transforming subjective assessment into objective, defensible findings.'
  },
  {
    question: 'Why is it important to maintain balance in a post-event report?',
    options: [
      'To please all readers equally',
      'To demonstrate objectivity — showing both successes and failures fairly',
      'To avoid mentioning any problems'
    ],
    correct: 1,
    explanation: 'Balance demonstrates objectivity: a report that documents both successes and failures with equal rigor is perceived as credible and analytically sound — stakeholders trust it because it reflects reality rather than selective promotion.'
  },
  {
    question: 'Why is feedback integration important in a post-event report?',
    options: [
      'It captures real impact — direct participant perspectives provide authentic evidence',
      'It makes the report longer and more impressive',
      'It replaces the need for quantitative data'
    ],
    correct: 0,
    explanation: 'Feedback integration captures real impact: participant perspectives provide authentic evidence of how the event was actually experienced, offering qualitative depth that quantitative data alone cannot capture.'
  },
  {
    question: 'What standard must recommendations in a post-event report meet?',
    options: [
      'They must be written by management only',
      'They must be inspirational and motivating',
      'Actionable & specific — clear, implementable steps that stakeholders can act upon'
    ],
    correct: 2,
    explanation: 'Recommendations must be actionable and specific: vague suggestions ("do better next time") have no practical value. Effective recommendations identify what, who, when, and how — enabling immediate institutional action.'
  },
  {
    question: 'What is the optimal tone for a professional post-event report?',
    options: [
      'Objective & constructive — analytical without emotion or bias',
      'Enthusiastic and promotional to motivate stakeholders',
      'Apologetic and self-critical to show humility'
    ],
    correct: 0,
    explanation: 'The optimal tone is objective and constructive: professional reporting maintains analytical distance, presenting facts, evidence, and balanced assessments without emotional language, personal bias, or excessive self-promotion or self-criticism.'
  }
]

export default function Phase6SP1Step3RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_c1_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'C', correct, QUESTIONS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level C1</Typography>
        <Typography variant="h6">Task C: Advanced Quiz</Typography>
        <Typography variant="body1">Answer 6 questions on the strategic purpose of professional report concepts</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="This advanced quiz tests not just your knowledge of report terms, but your understanding of their strategic purpose and professional function. Think analytically!" />
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, idx) => {
          const isCorrect = submitted && parseInt(answers[idx]) === q.correct
          return (
            <Paper key={idx} elevation={1} sx={{
              p: 2.5, borderRadius: 2,
              border: submitted ? '2px solid' : '1px solid #e0e0e0',
              borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : '#e0e0e0',
              backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white'
            }}>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
              <RadioGroup value={answers[idx] !== undefined ? answers[idx].toString() : ''} onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}>
                {q.options.map((opt, oi) => (
                  <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} size="small" />}
                    label={<Typography variant="body2" sx={{ color: submitted && oi === q.correct ? '#27ae60' : 'inherit', fontWeight: submitted && oi === q.correct ? 'bold' : 'normal' }}>{opt}</Typography>} />
                ))}
              </RadioGroup>
              {submitted && (
                <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 1, py: 0.5 }}>
                  <Typography variant="body2"><strong>Explanation:</strong> {q.explanation}</Typography>
                </Alert>
              )}
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task C Complete! Score: {score}/{QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/c1/task/d')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Next: Task D →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
