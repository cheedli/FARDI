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
 * Phase 6 SubPhase 1 Step 2 - Level B2 - Task A
 * Role-Play Dialogue: Complete dialogue explaining report terms
 * Word Bank: success, challenge, feedback, improve, recommend, evidence
 * Ms. Mabrouki: "Why balance?" → You: "Show [success] and [challenge] [because] honest."
 * Lilia: "Evidence?" → You: "Use [evidence] like numbers and [feedback]."
 */

const WORD_BANK = ['success', 'challenge', 'feedback', 'improve', 'recommend', 'evidence']

// Gap definitions: [gapIndex]: correctAnswer
const CORRECT_ANSWERS = {
  0: 'success',
  1: 'challenge',
  2: 'because',
  3: 'evidence',
  4: 'feedback'
}

export default function Phase6SP1Step2RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const extendedBank = [...WORD_BANK, 'because']

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, val]) => {
      if (answers[parseInt(key)] === val) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b2_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(2, 'B2', 'A', correct, Object.keys(CORRECT_ANSWERS).length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = Object.keys(CORRECT_ANSWERS).every(k => answers[parseInt(k)])

  const GapSelect = ({ gapIdx }) => {
    const correct = CORRECT_ANSWERS[gapIdx]
    const isCorrect = submitted && answers[gapIdx] === correct
    const isWrong = submitted && answers[gapIdx] !== correct
    return (
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={answers[gapIdx] || ''}
          onChange={(e) => !submitted && setAnswers({ ...answers, [gapIdx]: e.target.value })}
          disabled={submitted}
          displayEmpty
          sx={{
            backgroundColor: 'white',
            borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : undefined
          }}
        >
          <MenuItem value=""><em>choose...</em></MenuItem>
          {extendedBank.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

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
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B2</Typography>
        <Typography variant="h6">Task A: Role-Play Dialogue</Typography>
        <Typography variant="body1">Complete the dialogue explaining report terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Complete the dialogue by choosing the correct words from the word bank. Focus on using the right report vocabulary in context."
        />
      </Paper>

      {/* Word Bank */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f0faf4' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
          Word Bank:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {extendedBank.map(w => (
            <Paper key={w} elevation={1} sx={{ px: 2, py: 0.5, backgroundColor: '#27ae60', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">{w}</Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Dialogue */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
          Dialogue:
        </Typography>
        <Stack spacing={2}>
          {/* Ms. Mabrouki */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">MM</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#e3f2fd' }}>
              <Typography variant="caption" color="text.secondary">Ms. Mabrouki</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>Why balance?</Typography>
            </Paper>
          </Box>

          {/* You - gaps 0, 1, 2 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography variant="body1">Show</Typography>
                <GapSelect gapIdx={0} />
                <Typography variant="body1">and</Typography>
                <GapSelect gapIdx={1} />
                <GapSelect gapIdx={2} />
                <Typography variant="body1">honest.</Typography>
              </Box>
              {submitted && (answers[0] !== 'success' || answers[1] !== 'challenge' || answers[2] !== 'because') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  Correct: Show success and challenge because honest.
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Lilia */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#e67e22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">LI</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#fef9e7' }}>
              <Typography variant="caption" color="text.secondary">Lilia</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>Evidence?</Typography>
            </Paper>
          </Box>

          {/* You - gaps 3, 4 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography variant="body1">Use</Typography>
                <GapSelect gapIdx={3} />
                <Typography variant="body1">like numbers and</Typography>
                <GapSelect gapIdx={4} />
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (answers[3] !== 'evidence' || answers[4] !== 'feedback') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  Correct: Use evidence like numbers and feedback.
                </Typography>
              )}
            </Paper>
          </Box>
        </Stack>
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Check My Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task A Complete! Score: {score}/5
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 4 ? 'Excellent use of report vocabulary!' : 'Good effort! Review the correct terms and continue.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b2/task/b')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
