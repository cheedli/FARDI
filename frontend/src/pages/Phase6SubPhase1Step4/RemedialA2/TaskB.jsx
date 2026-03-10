import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 - Level A2 - Task B
 * Fill Frenzy: Fill 6 gaps with report words from the word bank
 * (Step 4: Elaborate — writing actual report sections)
 */

const WORD_BANK = ['success', 'challenge', 'feedback', 'improve', 'recommend', 'summary']

const SENTENCES = [
  { before: 'Festival was', blank: 'success', after: '.' },
  { before: 'Lighting was', blank: 'challenge', after: '.' },
  { before: 'We need', blank: 'feedback', after: '.' },
  { before: 'We can', blank: 'improve', after: '.' },
  { before: 'I', blank: 'recommend', after: 'more help.' },
  { before: 'Write', blank: 'summary', after: '.' }
]

export default function Phase6SP1Step4RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    SENTENCES.forEach((s, i) => { if (answers[i] === s.blank) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_a2_taskb_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(4, 'A2', 'B', correct, SENTENCES.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = SENTENCES.every((_, i) => answers[i])

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice - Level A2</Typography>
        <Typography variant="h6">Task B: Fill Frenzy</Typography>
        <Typography variant="body1">Fill 6 gaps with report words from the word bank</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Fill Frenzy! Choose the correct word from the word bank to complete each sentence about our festival report." />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f0faf4' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {WORD_BANK.map(w => (
            <Paper key={w} elevation={1} sx={{ px: 2, py: 0.5, backgroundColor: '#27ae60', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">{w}</Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {SENTENCES.map((s, idx) => {
          const isCorrect = submitted && answers[idx] === s.blank
          return (
            <Paper key={idx} elevation={1} sx={{
              p: 2.5, borderRadius: 2,
              border: submitted ? '2px solid' : '1px solid #e0e0e0',
              borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : '#e0e0e0',
              display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap'
            }}>
              <Typography variant="body1" fontWeight={500}>{idx + 1}. {s.before}</Typography>
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty sx={{ backgroundColor: 'white' }}>
                  <MenuItem value=""><em>choose...</em></MenuItem>
                  {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="body1" fontWeight={500}>{s.after}</Typography>
              {submitted && !isCorrect && <Typography variant="body2" color="error" fontWeight="bold">✗ Correct: {s.blank}</Typography>}
              {isCorrect && <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 'bold' }}>✓</Typography>}
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Check My Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task B Complete! Score: {score}/{SENTENCES.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/4/remedial/a2/task/c')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
