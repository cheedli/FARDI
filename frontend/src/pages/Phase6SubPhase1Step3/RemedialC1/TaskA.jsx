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
 * Phase 6 SubPhase 1 Step 3 - Level C1 - Task A
 * Debate Simulation: Simulate dialogue on the value of a balanced report
 * Word Bank: balanced evaluation, transparency, continuous improvement, evidence-based, actionable recommendations
 */

const WORD_BANK = [
  'balanced evaluation',
  'transparency',
  'continuous improvement',
  'evidence-based',
  'actionable recommendations'
]

const CORRECT_ANSWERS = {
  0: 'balanced evaluation',
  1: 'transparency',
  2: 'evidence-based',
  3: 'continuous improvement'
}

export default function Phase6SP1Step3RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, val]) => {
      if (answers[parseInt(key)] === val) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_c1_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'A', correct, Object.keys(CORRECT_ANSWERS).length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = Object.keys(CORRECT_ANSWERS).every(k => answers[parseInt(k)])

  const GapSelect = ({ gapIdx }) => {
    const correct = CORRECT_ANSWERS[gapIdx]
    const isCorrect = submitted && answers[gapIdx] === correct
    return (
      <FormControl size="small" sx={{ minWidth: 190 }}>
        <Select
          value={answers[gapIdx] || ''}
          onChange={(e) => !submitted && setAnswers({ ...answers, [gapIdx]: e.target.value })}
          disabled={submitted}
          displayEmpty
          sx={{ backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white' }}
        >
          <MenuItem value=""><em>choose...</em></MenuItem>
          {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level C1</Typography>
        <Typography variant="h6">Task A: Debate Simulation</Typography>
        <Typography variant="body1">Simulate a dialogue defending the value of a balanced report</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="In this C1-level debate, defend the professional importance of balanced reporting. Use the advanced terminology from the word bank." />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f0faf4' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>Advanced Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {WORD_BANK.map(w => (
            <Paper key={w} elevation={1} sx={{ px: 2, py: 0.5, backgroundColor: '#27ae60', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">{w}</Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          {/* Skeptic Line 1 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">SK</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#fdecea' }}>
              <Typography variant="caption" color="text.secondary">Skeptic</Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"Why show weaknesses in the report? It is embarrassing."</Typography>
            </Paper>
          </Box>

          {/* You - gaps 0, 1 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <GapSelect gapIdx={0} />
                <Typography variant="body1">shows</Typography>
                <GapSelect gapIdx={1} />
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (answers[0] !== 'balanced evaluation' || answers[1] !== 'transparency') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: "Balanced evaluation shows transparency."</Typography>
              )}
            </Paper>
          </Box>

          {/* Skeptic Line 2 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">SK</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#fdecea' }}>
              <Typography variant="caption" color="text.secondary">Skeptic</Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"Just successes. Weaknesses damage our reputation."</Typography>
            </Paper>
          </Box>

          {/* You - gaps 2, 3 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography variant="body1">No —</Typography>
                <GapSelect gapIdx={2} />
                <Typography variant="body1">weaknesses drive</Typography>
                <GapSelect gapIdx={3} />
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (answers[2] !== 'evidence-based' || answers[3] !== 'continuous improvement') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: "No — evidence-based weaknesses drive continuous improvement."</Typography>
              )}
            </Paper>
          </Box>
        </Stack>
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Submit My Debate Responses
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task A Complete! Score: {score}/4</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/c1/task/b')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
