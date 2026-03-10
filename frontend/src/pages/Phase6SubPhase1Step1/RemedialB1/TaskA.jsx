import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B1 - Task A
 * Negotiation Gap Fill: Fill gaps in a reflection dialogue
 */

const DIALOGUE = [
  { speaker: 'SKANDER', text: 'Success?', isGap: false },
  { speaker: 'You', text: 'Success was ___ because ___', gaps: [
    { id: 'a', options: ['dances', 'lighting', 'food problem'], correct: 'dances', hint: 'What was the success?' },
    { id: 'b', options: ['beautiful', 'difficult', 'broken'], correct: 'beautiful', hint: 'Why was it successful?' }
  ], isGap: true },
  { speaker: 'Emna', text: 'Challenge?', isGap: false },
  { speaker: 'You', text: 'Challenge was ___ but we ___', gaps: [
    { id: 'c', options: ['lighting', 'dances', 'food'], correct: 'lighting', hint: 'What was the challenge?' },
    { id: 'd', options: ['fixed', 'failed', 'ignored'], correct: 'fixed', hint: 'What did you do?' }
  ], isGap: true }
]

export default function Phase6SP1Step1RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = DIALOGUE.filter(d => d.isGap).flatMap(d => d.gaps)
  const allAnswered = allGaps.every(g => answers[g.id])

  const handleSubmit = async () => {
    let correct = 0
    allGaps.forEach(g => { if (answers[g.id] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'A', correct, allGaps.length, 0, 1) } catch (e) { console.error(e) }
  }

  const renderLine = (line, lineIdx) => {
    if (!line.isGap) {
      return (
        <Paper key={lineIdx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body2" color="text.secondary" fontWeight="bold">{line.speaker}:</Typography>
          <Typography variant="body1" fontStyle="italic">"{line.text}"</Typography>
        </Paper>
      )
    }

    // Build the display with gaps
    const parts = line.text.split('___')
    return (
      <Paper key={lineIdx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#e8f4fd' }}>
        <Typography variant="body2" color="primary" fontWeight="bold" sx={{ mb: 1 }}>{line.speaker} (your turn):</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {parts.map((part, pi) => (
            <React.Fragment key={pi}>
              <Typography variant="body1">{part}</Typography>
              {pi < line.gaps.length && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={answers[line.gaps[pi].id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [line.gaps[pi].id]: e.target.value })}
                    disabled={submitted}
                    displayEmpty
                    renderValue={(v) => v || '___'}
                  >
                    {line.gaps[pi].options.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {submitted && pi < line.gaps.length && answers[line.gaps[pi].id] !== line.gaps[pi].correct && (
                <Typography variant="body2" color="error" sx={{ fontStyle: 'italic' }}>
                  (correct: {line.gaps[pi].correct})
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task A: Negotiation Gap Fill</Typography>
        <Typography variant="body1">Fill gaps in a reflection dialogue using past tense</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="Let's practise talking about the festival! Fill in the gaps in this dialogue using the correct words. Use past tense and give good reasons!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> Fill in the gaps in the dialogue below. Select the correct word from each dropdown.
          Use past tense and include reasons.
        </Typography>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {DIALOGUE.map(renderLine)}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Dialogue
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task A Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{allGaps.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === allGaps.length ? 'Perfect! All gaps filled correctly!' : 'Good effort! Review the correct answers above.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/b1/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
