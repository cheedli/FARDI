import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  TextField, Divider
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const SENTENCES = [
  {
    faulty: 'Report bad.',
    model: 'Your report is nice.',
    keyword: 'nice',
  },
  {
    faulty: 'Add more.',
    model: 'Suggestion: please add more.',
    keyword: 'suggestion',
  },
  {
    faulty: 'Thank.',
    model: 'Thank you.',
    keyword: 'thank you',
  },
  {
    faulty: 'No good.',
    model: 'Positive point: good summary.',
    keyword: 'positive',
  },
  {
    faulty: 'Weak.',
    model: 'Area to improve: add evidence.',
    keyword: 'improve',
  },
  {
    faulty: 'Sugestion.',
    model: 'Suggestion: add numbers.',
    keyword: 'suggestion',
  },
  {
    faulty: 'Improv.',
    model: 'You can improve this part.',
    keyword: 'improve',
  },
  {
    faulty: 'Good job.',
    model: 'Overall good job!',
    keyword: 'overall',
  },
]

export default function Phase6SP2Step5RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_b1' })
  const [inputs, setInputs] = useState(Array(SENTENCES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allFilled = inputs.every(v => v.trim() !== '')

  const handleChange = (index, value) => {
    setInputs(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = SENTENCES.filter(
      (s, i) => inputs[i].toLowerCase().includes(s.keyword)
    ).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'B', correct, 8, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial B1 — Task B</Typography>
        <Typography variant="body1">Writing Proposals — Rewrite 8 faulty feedback sentences correctly.</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
          Instructions: Each sentence below is written incorrectly. Type your corrected version in the input box. After submitting, the model answer will be revealed. Your answer is accepted if it contains the key improvement word.
        </Typography>
      </Paper>

      {SENTENCES.map((s, index) => {
        const userInput = inputs[index]
        const isCorrect = submitted && userInput.toLowerCase().includes(s.keyword)
        const isWrong = submitted && !userInput.toLowerCase().includes(s.keyword)

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <EditNoteIcon sx={{ color: '#8e44ad', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#6c3483' }}>
                Sentence {index + 1}
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#ede7f6', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#555', mb: 0.5 }}>Faulty version:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#8e44ad' }}>
                "{s.faulty}"
              </Typography>
            </Paper>

            <TextField
              fullWidth
              size="small"
              label="Your corrected version"
              value={userInput}
              onChange={e => handleChange(index, e.target.value)}
              disabled={submitted}
              placeholder="Type the corrected sentence here..."
              sx={{
                mb: submitted ? 1.5 : 0,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#8e44ad' },
                },
                '& label.Mui-focused': { color: '#8e44ad' },
              }}
            />

            {submitted && (
              <>
                <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 1 }}>
                  {isCorrect ? (
                    <Typography variant="body2" fontWeight="bold">
                      Correct! Your correction includes the key improvement.
                    </Typography>
                  ) : (
                    <Typography variant="body2" fontWeight="bold">
                      Needs improvement — key word missing: "{s.keyword}"
                    </Typography>
                  )}
                </Alert>
                <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 1, mt: 1, border: '1px solid #a5d6a7' }}>
                  <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Model answer: "{s.model}"
                  </Typography>
                </Paper>
              </>
            )}
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit All Corrections
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2, mt: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task B Complete! Score: {score}/8</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 8
              ? 'Perfect! You corrected all 8 faulty feedback sentences.'
              : score >= 6
              ? 'Great work! Review the sentences you missed and compare with the model answers above.'
              : score >= 4
              ? 'Good effort! Study the model answers carefully to understand formal feedback structure.'
              : 'Keep practising — focus on using key words like "Suggestion:", "Positive point:", and "Area to improve:".'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b1/task/c')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task C
          </Button>
        </Paper>
      )}
    </Box>
  )
}
