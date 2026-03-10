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
 * Phase 6 SubPhase 1 Step 2 - Level C1 - Task C
 * Advanced Quiz: Create and answer quiz on 6 report concepts
 */

const QUESTIONS = [
  {
    question: 'What is the primary purpose of including balanced evaluation in a post-event report?',
    options: [
      'To make the report longer',
      'Credibility & improvement — it builds trust and enables genuine learning',
      'To impress stakeholders with positive results only'
    ],
    correct: 1,
    explanation: 'Balanced evaluation serves credibility (stakeholders trust honest reports) and improvement (acknowledging weaknesses enables genuine learning and future enhancement).'
  },
  {
    question: 'What is the role of evidence in a professional post-event report?',
    options: [
      'It supports claims with verifiable data and quotes',
      'It makes the report look more official',
      'It replaces the need for recommendations'
    ],
    correct: 0,
    explanation: 'Evidence (attendance figures, feedback quotes, comparative data) supports claims with verifiable, objective data — transforming subjective opinions into credible findings.'
  },
  {
    question: 'What must recommendations in a professional report be?',
    options: [
      'General and inspirational',
      'Written in passive voice only',
      'Actionable & specific — with clear, implementable steps'
    ],
    correct: 2,
    explanation: 'Actionable and specific recommendations provide clear, implementable steps that stakeholders can act upon. Vague recommendations ("do better next time") have no practical value.'
  },
  {
    question: 'What is the strategic value of transparency in report writing?',
    options: [
      'It limits criticism from stakeholders',
      'Builds trust — demonstrating intellectual honesty and accountability',
      'It reduces the need for evidence'
    ],
    correct: 1,
    explanation: 'Transparency builds trust by demonstrating intellectual honesty and accountability — stakeholders value reports that acknowledge limitations rather than glossing over them.'
  },
  {
    question: 'How do "lessons learned" contribute to organizational value?',
    options: [
      'They drive future success — transforming experience into institutional knowledge',
      'They explain past mistakes without implications',
      'They are included only for formal compliance'
    ],
    correct: 0,
    explanation: 'Lessons learned drive future success by transforming experience into institutional knowledge — each documented lesson becomes a resource for future event planning and organizational improvement.'
  },
  {
    question: 'What does a "stakeholder focus" in a post-event report ensure?',
    options: [
      'The report is only positive',
      'The report addresses the needs and interests of the audience',
      'The report is written by committee'
    ],
    correct: 1,
    explanation: 'A stakeholder focus ensures the report addresses the specific needs, interests, and concerns of its audience — sponsors, university leadership, team members — making it relevant and actionable for each group.'
  }
]

export default function Phase6SP1Step2RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correct) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_c1_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(2, 'C1', 'C', correct, QUESTIONS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level C1</Typography>
        <Typography variant="h6">Task C: Advanced Quiz</Typography>
        <Typography variant="body1">Answer 6 advanced questions on report concepts and their strategic purpose</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="This advanced quiz tests your understanding of why professional report concepts matter — not just what they mean. Think about purpose, strategy, and real-world value."
        />
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, idx) => {
          const isCorrect = submitted && parseInt(answers[idx]) === q.correct
          const isWrong = submitted && parseInt(answers[idx]) !== q.correct
          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: submitted ? '2px solid' : '1px solid #e0e0e0',
                borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : '#e0e0e0',
                backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white'
              }}
            >
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                {idx + 1}. {q.question}
              </Typography>
              <RadioGroup
                value={answers[idx] !== undefined ? answers[idx].toString() : ''}
                onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}
              >
                {q.options.map((opt, oi) => (
                  <FormControlLabel
                    key={oi}
                    value={oi.toString()}
                    control={<Radio disabled={submitted} size="small" />}
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          color: submitted && oi === q.correct ? '#27ae60' : 'inherit',
                          fontWeight: submitted && oi === q.correct ? 'bold' : 'normal'
                        }}
                      >
                        {opt}
                      </Typography>
                    }
                  />
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
            {score >= 5 ? 'Excellent! Strong analytical understanding of report concepts!' : 'Good effort! Review the explanations to deepen your understanding.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/1')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Next Phase →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
