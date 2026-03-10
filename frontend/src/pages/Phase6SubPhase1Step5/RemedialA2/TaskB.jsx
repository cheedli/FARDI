import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level A2 - Task B
 * Gap Fill: "Fill Quest" — Fill 8 spelling-corrected gaps
 */

const GAPS = [
  { id: 0, sentence: 'Festival was ___', options: ['success', 'succes', 'sucess'], correct: 'success', explanation: '"Success" — one c, two s.' },
  { id: 1, sentence: 'Lighting was ___', options: ['challange', 'challenge', 'chalenge'], correct: 'challenge', explanation: '"Challenge" — ch-a-l-l-e-n-g-e.' },
  { id: 2, sentence: 'We need ___', options: ['feedbak', 'feeback', 'feedback'], correct: 'feedback', explanation: '"Feedback" — feed + back.' },
  { id: 3, sentence: 'We can ___', options: ['improv', 'improve', 'inprove'], correct: 'improve', explanation: '"Improve" — i-m-p-r-o-v-e.' },
  { id: 4, sentence: 'I ___ more help', options: ['recomend', 'reccomend', 'recommend'], correct: 'recommend', explanation: '"Recommend" — re-c-o-m-m-e-n-d.' },
  { id: 5, sentence: 'Write ___', options: ['sumary', 'summary', 'summery'], correct: 'summary', explanation: '"Summary" — s-u-m-m-a-r-y.' },
  { id: 6, sentence: 'Big ___', options: ['achievment', 'achievement', 'achevement'], correct: 'achievement', explanation: '"Achievement" — achieve + ment.' },
  { id: 7, sentence: 'Use ___', options: ['evidance', 'evidence', 'evidense'], correct: 'evidence', explanation: '"Evidence" — e-v-i-d-e-n-c-e.' }
]

export default function Phase6SP1Step5RemA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach(g => { if (answers[g.id] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'B', correct, GAPS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Fill Quest</Typography>
        <Typography variant="body1">Choose the correctly spelled word for each gap</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Fill Quest! Choose the correctly spelled word for each blank. Only one option in each question has the correct spelling!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> Select the correctly spelled word for each sentence. Watch out — each question has two common spelling mistakes!</Typography>
      </Alert>

      <Stack spacing={2}>
        {GAPS.map((g) => (
          <Paper key={g.id} elevation={1} sx={{ p: 2.5, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (answers[g.id] === g.correct ? 'success.main' : 'error.main') : '#e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">{g.id + 1}. {g.sentence}</Typography>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={answers[g.id] || ''} onChange={(e) => setAnswers({ ...answers, [g.id]: e.target.value })} disabled={submitted} displayEmpty>
                  <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                  {g.options.map((opt, oi) => <MenuItem key={oi} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            {submitted && (
              <Typography variant="body2" color={answers[g.id] === g.correct ? 'success.main' : 'error.main'}>
                {answers[g.id] === g.correct ? '✓ Correct! ' : `✗ Correct answer: "${g.correct}". `}
                {g.explanation}
              </Typography>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < GAPS.length} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GAPS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 7 ? 'Excellent! You know how to spell these report words!' : score >= 5 ? 'Good work! Review the explanations above.' : 'Keep practicing — correct spelling is important for professional reports.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/a2/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
