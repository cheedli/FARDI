import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  Select, MenuItem, FormControl, InputLabel, Divider
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const BLANKS = [
  {
    id: 'BLANK1',
    options: ['nice', 'bad', 'wrong'],
    correct: 'nice',
  },
  {
    id: 'BLANK2',
    options: ['suggestion', 'problem', 'mistake'],
    correct: 'suggestion',
  },
]

export default function Phase6SP2Step5RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({ BLANK1: '', BLANK2: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = answers.BLANK1 !== '' && answers.BLANK2 !== ''

  const handleChange = (blankId, value) => {
    setAnswers(prev => ({ ...prev, [blankId]: value }))
  }

  const handleSubmit = async () => {
    if (!allAnswered) return
    const correct = BLANKS.filter(b => answers[b.id] === b.correct).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'A', correct, 2, 0, 2) } catch (e) { console.error(e) }
  }

  const blank1Correct = submitted && answers.BLANK1 === 'nice'
  const blank2Correct = submitted && answers.BLANK2 === 'suggestion'

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial B1 — Task A</Typography>
        <Typography variant="body1">Negotiation Gap Fill — Complete the feedback dialogue with the correct words.</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
          Instructions: Read the feedback dialogue below. Select the correct word from each dropdown to complete the conversation appropriately.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#6c3483' }}>
          Feedback Dialogue
        </Typography>

        {/* Line 1 — Peer */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8e44ad', minWidth: 52, pt: 0.5 }}>Peer:</Typography>
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#ede7f6', borderRadius: 1, flex: 1 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"My report?"</Typography>
          </Paper>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Line 2 — You with BLANK1 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8e44ad', minWidth: 52 }}>You:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1">"It is</Typography>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>BLANK 1</InputLabel>
              <Select
                value={answers.BLANK1}
                label="BLANK 1"
                onChange={e => handleChange('BLANK1', e.target.value)}
                disabled={submitted}
                sx={{
                  bgcolor: submitted
                    ? blank1Correct ? '#e8f5e9' : '#ffebee'
                    : 'white',
                }}
              >
                {BLANKS[0].options.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1">."</Typography>
          </Box>
        </Box>

        {submitted && (
          <Alert severity={blank1Correct ? 'success' : 'error'} sx={{ mb: 2, ml: 7 }}>
            {blank1Correct
              ? 'Correct! "nice" is the appropriate positive adjective for feedback.'
              : 'Incorrect — the correct answer is "nice". Peer feedback should use positive, encouraging language.'}
          </Alert>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Line 3 — Peer */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8e44ad', minWidth: 52, pt: 0.5 }}>Peer:</Typography>
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#ede7f6', borderRadius: 1, flex: 1 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Improve?"</Typography>
          </Paper>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Line 4 — You with BLANK2 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8e44ad', minWidth: 52 }}>You:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>BLANK 2</InputLabel>
              <Select
                value={answers.BLANK2}
                label="BLANK 2"
                onChange={e => handleChange('BLANK2', e.target.value)}
                disabled={submitted}
                sx={{
                  bgcolor: submitted
                    ? blank2Correct ? '#e8f5e9' : '#ffebee'
                    : 'white',
                }}
              >
                {BLANKS[1].options.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1">: please add numbers."</Typography>
          </Box>
        </Box>

        {submitted && (
          <Alert severity={blank2Correct ? 'success' : 'error'} sx={{ mb: 2, ml: 7 }}>
            {blank2Correct
              ? 'Correct! "Suggestion" is the right word to introduce a constructive recommendation.'
              : 'Incorrect — the correct answer is "Suggestion". Use "Suggestion:" to introduce a recommendation politely.'}
          </Alert>
        )}
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2, mt: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task A Complete! Score: {score}/2</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 2
              ? 'Perfect! You correctly completed the feedback dialogue.'
              : score === 1
              ? 'Good effort! Review the incorrect blank above and note the correct word.'
              : 'Review both answers above — focus on using positive and constructive feedback language.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b1/task/b')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task B
          </Button>
        </Paper>
      )}
    </Box>
  )
}
