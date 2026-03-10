import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level B1 - Task A
 * Negotiation Gap Fill — Fill gaps correcting grammar/structure in report dialogue
 */

const DIALOGUE = [
  { speaker: 'SKANDER', text: 'Summary?' },
  {
    speaker: 'You',
    template: ['[', '] was performances.'],
    gaps: [{ id: 'g1', options: ['Success', 'Fail', 'Problem'], correct: 'Success' }]
  },
  { speaker: 'Emna', text: 'Challenge?' },
  {
    speaker: 'You',
    template: ['[', '] was lighting but we [', '] it.'],
    gaps: [
      { id: 'g2', options: ['Challenge', 'Happy', 'Success'], correct: 'Challenge' },
      { id: 'g3', options: ['fixed', 'fix', 'fixing'], correct: 'fixed' }
    ]
  }
]

export default function Phase6SP1Step5RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = ['g1', 'g2', 'g3']
  const allFilled = allGaps.every(g => answers[g])

  const handleSubmit = async () => {
    let correct = 0
    if (answers['g1'] === 'Success') correct++
    if (answers['g2'] === 'Challenge') correct++
    if (answers['g3'] === 'fixed') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'A', correct, 3, 0, 1) } catch (e) { console.error(e) }
  }

  const renderLine = (line, idx) => {
    if (line.gaps) {
      let gapIdx = 0
      return (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #27ae60, #1e8449)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0 }}>You</Box>
          {line.template.map((part, pi) => {
            if (part === '[') {
              const gap = line.gaps[gapIdx++]
              const isCorrect = submitted && answers[gap.id] === gap.correct
              const isWrong = submitted && answers[gap.id] !== gap.correct
              return (
                <React.Fragment key={pi}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={answers[gap.id] || ''} onChange={(e) => setAnswers({ ...answers, [gap.id]: e.target.value })} disabled={submitted}
                      sx={{ borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : undefined }}>
                      <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                      {gap.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {submitted && isWrong && <Typography variant="caption" color="error">→ {gap.correct}</Typography>}
                </React.Fragment>
              )
            }
            return <Typography key={pi} variant="body1">{part}</Typography>
          })}
        </Box>
      )
    }
    const isInstructor = line.speaker !== 'You'
    return (
      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: isInstructor ? 'linear-gradient(135deg, #2980b9, #1a5276)' : 'linear-gradient(135deg, #27ae60, #1e8449)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', flexShrink: 0 }}>
          {line.speaker === 'SKANDER' ? 'SK' : line.speaker === 'Emna' ? 'EM' : 'You'}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">{line.speaker}</Typography>
          <Typography variant="body1">"{line.text}"</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task A: Negotiation Gap Fill</Typography>
        <Typography variant="body1">Fill the gaps to correct grammar/structure in the report dialogue</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Negotiation Gap Fill! Complete the dialogue by choosing the correct word for each gap. Focus on correct past tense and proper report vocabulary structure."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> SKANDER and Emna ask about the report. Complete your responses using correct past tense and report vocabulary.</Typography>
      </Alert>

      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f9fef9', borderRadius: 2 }}>
        {DIALOGUE.map((line, idx) => renderLine(line, idx))}
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allFilled} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Dialogue
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task A Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/3</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 3 ? 'Perfect! Correct past tense and vocabulary.' : score >= 2 ? 'Good work! Review the corrections above.' : 'Keep practicing — focus on past tense verbs in reports.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/b1/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
