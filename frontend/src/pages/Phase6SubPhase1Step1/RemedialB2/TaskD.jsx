import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B2 - Task D
 * Spelling & Explain: "Spell & Report Quest"
 * Spell and briefly explain 6 key report/reflection terms
 */

const TERMS = [
  { id: 0, term: 'success', explanation: 'Positive result of the event' },
  { id: 1, term: 'challenge', explanation: 'Difficult problem we faced' },
  { id: 2, term: 'feedback', explanation: 'Comments from guests' },
  { id: 3, term: 'improve', explanation: 'Do better next time' },
  { id: 4, term: 'recommend', explanation: 'Suggest what to change' },
  { id: 5, term: 'achievement', explanation: 'Something we did very well' }
]

export default function Phase6SP1Step1RemB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState({})
  const [explanations, setExplanations] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [correctSpellings, setCorrectSpellings] = useState(new Set())
  const [score, setScore] = useState(0)

  const allAnswered = TERMS.every(t => (spellings[t.id] || '').trim().length > 0 && (explanations[t.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    const correctSet = new Set()
    TERMS.forEach(t => {
      const spelledCorrectly = (spellings[t.id] || '').trim().toLowerCase() === t.term
      const hasExplanation = (explanations[t.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 3
      if (spelledCorrectly) {
        correctSet.add(t.id)
        correct += 0.5
      }
      if (hasExplanation) correct += 0.5
    })
    const finalScore = Math.round(correct)
    setCorrectSpellings(correctSet)
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b2_taskd_score', finalScore.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'D', finalScore, TERMS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task D: Spell & Report Quest</Typography>
        <Typography variant="body1">Spell and explain 6 key report/reflection terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Spell & Report Quest! For each term, type the correct spelling AND write a short explanation of what it means in a post-event report. Both spelling AND explanation count toward your score!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> For each term below, (1) type the correct spelling and (2) write a short explanation
          (at least 3 words) of what the term means in the context of a post-event report.
        </Typography>
      </Alert>

      <Stack spacing={3}>
        {TERMS.map((t) => {
          const isSpelledCorrect = submitted && (spellings[t.id] || '').trim().toLowerCase() === t.term
          const isSpelledWrong = submitted && !isSpelledCorrect
          return (
            <Paper key={t.id} elevation={1} sx={{ p: 2.5, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (isSpelledCorrect ? 'success.main' : 'error.main') : '#e0e0e0' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Term {t.id + 1}</Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>1. Spell the term:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={spellings[t.id] || ''}
                    onChange={(e) => setSpellings({ ...spellings, [t.id]: e.target.value })}
                    disabled={submitted}
                    placeholder="Type the spelling here..."
                    error={isSpelledWrong}
                  />
                  {submitted && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      {isSpelledCorrect
                        ? <><CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} /><Typography variant="caption" color="success.main">Correct spelling!</Typography></>
                        : <><CancelIcon sx={{ color: 'error.main', fontSize: 16 }} /><Typography variant="caption" color="error.main">Correct: "{t.term}"</Typography></>
                      }
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>2. Explain in your own words:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={explanations[t.id] || ''}
                    onChange={(e) => setExplanations({ ...explanations, [t.id]: e.target.value })}
                    disabled={submitted}
                    placeholder="What does this mean in a post-event report?"
                  />
                  {submitted && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Model explanation: {t.explanation}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit All Terms
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task D Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{TERMS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 5 ? 'Excellent! Great spelling and explanations!' : 'Good effort! Review the model explanations above.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/2')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Continue to Step 2 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
