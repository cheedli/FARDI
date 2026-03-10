import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level B2 - Task A
 * Role-Play Dialogue — Complete dialogue correcting report errors
 * Word Bank: success, challenge, feedback, improve, recommend, evidence
 */

const WORD_BANK = ['success', 'challenge', 'feedback', 'improve', 'recommend', 'evidence']

const DIALOGUE = [
  { speaker: 'Ms. Mabrouki', text: 'Report problem?' },
  {
    speaker: 'You',
    template: ['Too positive — no [', '].'],
    gaps: [{ id: 'g1', correct: 'challenge' }]
  },
  { speaker: 'SKANDER', text: 'Balance?' },
  {
    speaker: 'You',
    template: ['Add [', '] and [', '] solutions.'],
    gaps: [
      { id: 'g2', correct: 'evidence' },
      { id: 'g3', correct: 'recommend' }
    ]
  }
]

export default function Phase6SP1Step5RemB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = ['g1', 'g2', 'g3']
  const allFilled = allGaps.every(g => answers[g])

  const handleSubmit = async () => {
    let correct = 0
    if (answers['g1'] === 'challenge') correct++
    if (answers['g2'] === 'evidence') correct++
    if (answers['g3'] === 'recommend') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'A', correct, 3, 0, 1) } catch (e) { console.error(e) }
  }

  const renderLine = (line, idx) => {
    if (line.gaps) {
      let gapIdx = 0
      return (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #27ae60, #1e8449)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.75rem', flexShrink: 0 }}>You</Box>
          {line.template.map((part, pi) => {
            if (part === '[') {
              const gap = line.gaps[gapIdx++]
              const isCorrect = submitted && answers[gap.id] === gap.correct
              const isWrong = submitted && answers[gap.id] !== gap.correct
              return (
                <React.Fragment key={pi}>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select value={answers[gap.id] || ''} onChange={(e) => setAnswers({ ...answers, [gap.id]: e.target.value })} disabled={submitted} displayEmpty>
                      <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                      {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
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
    const bgColor = line.speaker === 'Ms. Mabrouki' ? 'linear-gradient(135deg, #8e44ad, #6c3483)' : 'linear-gradient(135deg, #2980b9, #1a5276)'
    const initials = line.speaker === 'Ms. Mabrouki' ? 'MM' : line.speaker === 'SKANDER' ? 'SK' : 'You'
    return (
      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', flexShrink: 0 }}>{initials}</Box>
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
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Role-Play Dialogue</Typography>
        <Typography variant="body1">Complete the dialogue about correcting report errors</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Role-Play Dialogue! Complete the conversation about correcting a report. Use the word bank to identify the correct problem and what needs to be added. Focus on balanced evaluation and evidence!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2"><strong>Word Bank:</strong> {WORD_BANK.join(', ')}</Typography>
      </Alert>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Context:</strong> A peer's report is too positive — it only mentions good things. You need to explain what problems you identified and what solutions to add.</Typography>
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
            {score === 3 ? 'Perfect! You correctly identified the report problems.' : score >= 2 ? 'Good work!' : 'A balanced report needs both challenges and evidence-based recommendations.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/b2/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
