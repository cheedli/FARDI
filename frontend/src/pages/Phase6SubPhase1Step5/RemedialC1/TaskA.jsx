import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level C1 - Task A
 * Debate Simulation — Simulate dialogue correcting advanced report errors
 * Word Bank: balanced evaluation, evidence-based, actionable, transparency
 */

const WORD_BANK = ['balanced evaluation', 'evidence-based', 'actionable', 'transparency']

const DIALOGUE = [
  { speaker: 'Opponent', text: 'Report too positive?' },
  {
    speaker: 'You',
    template: ['Lacks [', '].'],
    gaps: [{ id: 'g1', correct: 'balanced evaluation' }]
  },
  { speaker: 'Opponent', text: 'Why evidence?' },
  {
    speaker: 'You',
    template: ['Needs [', '] analysis for [', '] and [', '] recommendations.'],
    gaps: [
      { id: 'g2', correct: 'evidence-based' },
      { id: 'g3', correct: 'transparency' },
      { id: 'g4', correct: 'actionable' }
    ]
  }
]

export default function Phase6SP1Step5RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = ['g1', 'g2', 'g3', 'g4']
  const allFilled = allGaps.every(g => answers[g])

  const handleSubmit = async () => {
    let correct = 0
    if (answers['g1'] === 'balanced evaluation') correct++
    if (answers['g2'] === 'evidence-based') correct++
    if (answers['g3'] === 'transparency') correct++
    if (answers['g4'] === 'actionable') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'A', correct, 4, 0, 1) } catch (e) { console.error(e) }
  }

  const renderLine = (line, idx) => {
    if (line.gaps) {
      let gapIdx = 0
      return (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2, p: 1.5, backgroundColor: '#f0fdf4', borderRadius: 1, borderLeft: '3px solid #27ae60' }}>
          <Typography variant="body2" color="success.dark" fontWeight="bold" sx={{ mr: 1 }}>You:</Typography>
          {line.template.map((part, pi) => {
            if (part === '[') {
              const gap = line.gaps[gapIdx++]
              const isCorrect = submitted && answers[gap.id] === gap.correct
              const isWrong = submitted && answers[gap.id] !== gap.correct
              return (
                <React.Fragment key={pi}>
                  <FormControl size="small" sx={{ minWidth: 170 }}>
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
    return (
      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2, p: 1.5, backgroundColor: '#fef3f2', borderRadius: 1, borderLeft: '3px solid #e74c3c' }}>
        <Typography variant="body2" color="error.dark" fontWeight="bold" sx={{ minWidth: 80 }}>{line.speaker}:</Typography>
        <Typography variant="body1">"{line.text}"</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task A: Debate Simulation</Typography>
        <Typography variant="body1">Defend evidence-based, balanced report writing using advanced terminology</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Debate Simulation! An opponent challenges your report writing. Use advanced terminology to defend your approach. Use the word bank to argue for evidence-based, transparent, and balanced reporting!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2"><strong>Word Bank:</strong> {WORD_BANK.join(' | ')}</Typography>
      </Alert>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Scenario:</strong> Your opponent claims your report is biased and too positive. Defend the need for balanced, evidence-based reporting with actionable recommendations.</Typography>
      </Alert>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        {DIALOGUE.map((line, idx) => renderLine(line, idx))}
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allFilled} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Debate Response
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task A Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/4</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 4 ? 'Perfect! You argued for balanced, evidence-based reporting with precision.' : score >= 3 ? 'Excellent! Strong use of C1 terminology.' : 'Good effort! Review the correct terms — they are key for professional report writing.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/c1/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
