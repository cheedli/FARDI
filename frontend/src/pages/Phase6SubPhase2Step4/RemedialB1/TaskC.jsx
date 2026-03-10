import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  {
    question: 'Feedback means?',
    options: ['Comments', 'Problems', 'Mistakes'],
    correct: 0,
  },
  {
    question: 'Positive means?',
    options: ['Bad things', 'Good things', 'Challenges'],
    correct: 1,
  },
  {
    question: 'Suggestion means?',
    options: ['Idea to improve', 'Problem', 'Criticism'],
    correct: 0,
  },
  {
    question: 'Strength means?',
    options: ['Bad part', 'Challenge', 'Good part'],
    correct: 2,
  },
  {
    question: 'Weakness means?',
    options: ['Need to improve', 'Achievement', 'Positive point'],
    correct: 0,
  },
  {
    question: 'Polite means?',
    options: ['Angry', 'Be nice', 'Specific'],
    correct: 1,
  },
]

export default function Phase6SP2Step4RemB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_b1' })
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
    sessionStorage.setItem('phase6_sp2_step4_remedial_b1_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(4, 'B1', 'C', correct, 6, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Step 4: Remedial B1 — Task C
        </Typography>
        <Typography variant="body1">Quiz Game — Feedback Terms (6 Questions)</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Choose the correct meaning for each feedback term. There are 6 questions.
      </Alert>

      {QUESTIONS.map((q, idx) => {
        const isAnswered = answers[idx] !== undefined
        const isCorrect = submitted && parseInt(answers[idx]) === q.correct
        const isWrong = submitted && parseInt(answers[idx]) !== q.correct

        return (
          <Paper
            key={idx}
            elevation={2}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 2,
              border: submitted ? '2px solid' : '1px solid #e0d0f0',
              borderColor: submitted
                ? isCorrect
                  ? '#27ae60'
                  : '#e74c3c'
                : '#e0d0f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip
                label={`${idx + 1}`}
                size="small"
                sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold' }}
              />
              <Typography variant="body1" fontWeight="bold">
                {q.question}
              </Typography>
              {submitted && isCorrect && (
                <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 20, ml: 'auto' }} />
              )}
            </Box>

            <RadioGroup
              value={answers[idx] !== undefined ? answers[idx].toString() : ''}
              onChange={(e) => {
                if (!submitted) setAnswers({ ...answers, [idx]: e.target.value })
              }}
            >
              {q.options.map((opt, oi) => {
                const isThisCorrect = submitted && oi === q.correct
                const isThisSelected = submitted && parseInt(answers[idx]) === oi
                const isThisWrong = isThisSelected && !isThisCorrect

                return (
                  <FormControlLabel
                    key={oi}
                    value={oi.toString()}
                    control={<Radio disabled={submitted} />}
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          color: isThisCorrect
                            ? '#27ae60'
                            : isThisWrong
                            ? '#e74c3c'
                            : 'text.primary',
                          fontWeight: isThisCorrect ? 'bold' : 'normal',
                        }}
                      >
                        {opt}
                        {isThisCorrect && ' ✓'}
                        {isThisWrong && ' ✗'}
                      </Typography>
                    }
                  />
                )
              })}
            </RadioGroup>
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
          sx={{
            background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Submit Answers
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task C Complete! Score: {score}/6
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 6
              ? 'Perfect! You have mastered all feedback vocabulary terms.'
              : score >= 4
              ? 'Well done! Review the highlighted answers above.'
              : 'Good effort! Study the feedback terms and try the quiz again.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/a')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Continue to Remedial B2 — Task A
          </Button>
        </Paper>
      )}
    </Box>
  )
}
