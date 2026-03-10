import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  RadioGroup, FormControlLabel, Radio, FormControl, Divider
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const ERROR_TYPES = ['Spelling', 'Tone', 'Grammar', 'Structure', 'Vocabulary', 'Formality']

const QUESTIONS = [
  {
    sentence: '"Your reprot shows good understanding."',
    correctType: 'Spelling',
    explanation: '"reprot" should be "report" — always proofread key nouns.',
  },
  {
    sentence: '"This part is kinda weak, you know?"',
    correctType: 'Tone',
    explanation: '"kinda" and "you know" are informal — peer feedback must maintain a professional tone.',
  },
  {
    sentence: '"The report demonstrate good analysis."',
    correctType: 'Grammar',
    explanation: 'Subject-verb agreement error — "demonstrates" is required after "The report".',
  },
  {
    sentence: '"Good. Challenges. Recommendations. Better."',
    correctType: 'Structure',
    explanation: 'Feedback must be written in full, coherent sentences, not isolated words.',
  },
  {
    sentence: '"The writing is nice and the ideas are cool."',
    correctType: 'Vocabulary',
    explanation: '"nice" and "cool" are too informal — use "well-structured" and "insightful" instead.',
  },
  {
    sentence: '"Hey, your report is pretty good but fix some stuff."',
    correctType: 'Formality',
    explanation: '"Hey" and "fix some stuff" are inappropriate for formal academic peer feedback.',
  },
]

export default function Phase6SP2Step5RemB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = answers.every(a => a !== '')

  const handleChange = (index, value) => {
    setAnswers(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const handleSubmit = async () => {
    if (!allAnswered) return
    const correct = answers.filter((a, i) => a === QUESTIONS[i].correctType).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial B1 — Task C</Typography>
        <Typography variant="body1">Wordshake Quiz — Identify the Error Type in Peer Feedback Sentences</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
          Instructions: Read each peer feedback sentence and identify the main type of error. Choose from: Spelling, Tone, Grammar, Structure, Vocabulary, Formality.
        </Typography>
      </Paper>

      {QUESTIONS.map((q, index) => {
        const userAnswer = answers[index]
        const isCorrect = submitted && userAnswer === q.correctType
        const isWrong = submitted && userAnswer !== q.correctType

        return (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 2,
              border: submitted
                ? isCorrect ? '2px solid #27ae60' : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#6c3483' }}>
              Question {index + 1}
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#ede7f6', borderRadius: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{q.sentence}</Typography>
            </Paper>

            <FormControl component="fieldset">
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>What type of error does this sentence contain?</Typography>
              <RadioGroup
                value={userAnswer}
                onChange={e => handleChange(index, e.target.value)}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {ERROR_TYPES.map(type => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={<Radio size="small" disabled={submitted} sx={{ '&.Mui-checked': { color: '#8e44ad' } }} />}
                      label={type}
                    />
                  ))}
                </Box>
              </RadioGroup>
            </FormControl>

            {submitted && (
              <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {isCorrect ? 'Correct!' : `Incorrect — the error type is: ${q.correctType}`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{q.explanation}</Typography>
              </Alert>
            )}
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
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2, mt: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task C Complete! Score: {score}/6</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 6
              ? 'Perfect score! You can identify all error types with confidence.'
              : score >= 4
              ? 'Good work! Review the error types you missed above.'
              : 'Keep practising — review the 6 error types: Spelling, Tone, Grammar, Structure, Vocabulary, Formality.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b2/task/a')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to B2 Task A
          </Button>
        </Paper>
      )}
    </Box>
  )
}
