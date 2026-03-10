import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Stack, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task A
 * Debate Simulation: "Report Defense Debate"
 * Defend the value of writing a balanced post-event report to a skeptical sponsor
 */

const WORD_BANK = [
  'balanced evaluation', 'lessons learned', 'stakeholder accountability',
  'continuous improvement', 'evidence-based', 'transparency', 'actionable recommendations'
]

const DIALOGUE = [
  { speaker: 'Skeptical Sponsor', text: 'Why do we need a report with weaknesses?' },
  {
    speaker: 'You',
    template: 'A ___ shows ___ and builds trust.',
    gaps: [
      { id: 'g1', options: ['balanced evaluation', 'simple summary', 'positive report'], correct: 'balanced evaluation' },
      { id: 'g2', options: ['transparency', 'weakness', 'evidence-based'], correct: 'transparency' }
    ]
  },
  { speaker: 'Skeptical Sponsor', text: 'Just tell us it was good.' },
  {
    speaker: 'You',
    template: 'Identifying ___ allows ___ and ___.',
    gaps: [
      { id: 'g3', options: ['lessons learned', 'good results', 'stakeholder accountability'], correct: 'lessons learned' },
      { id: 'g4', options: ['continuous improvement', 'balanced evaluation', 'transparency'], correct: 'continuous improvement' },
      { id: 'g5', options: ['actionable recommendations', 'evidence-based', 'stakeholder accountability'], correct: 'actionable recommendations' }
    ]
  },
  { speaker: 'Skeptical Sponsor', text: "Isn't that negative?" },
  {
    speaker: 'You',
    template: 'No — honest analysis with ___ strengths and weaknesses demonstrates ___.',
    gaps: [
      { id: 'g6', options: ['evidence-based', 'balanced evaluation', 'continuous improvement'], correct: 'evidence-based' },
      { id: 'g7', options: ['stakeholder accountability', 'transparency', 'lessons learned'], correct: 'stakeholder accountability' }
    ]
  }
]

export default function Phase6SP1Step1RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = DIALOGUE.filter(d => d.gaps).flatMap(d => d.gaps)
  const allAnswered = allGaps.every(g => answers[g.id])

  const handleSubmit = async () => {
    let correct = 0
    allGaps.forEach(g => { if (answers[g.id] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'A', correct, allGaps.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task A: Report Defense Debate</Typography>
        <Typography variant="body1">Defend the value of a balanced post-event report to a skeptical sponsor</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Report Defense Debate! You need to convince a skeptical sponsor why your post-event report should include weaknesses and challenges. Use the advanced vocabulary words below to complete the debate!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2"><strong>Advanced Word Bank:</strong></Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
          {WORD_BANK.map(w => <Chip key={w} label={w} size="small" sx={{ backgroundColor: '#8e44ad', color: 'white' }} />)}
        </Stack>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {DIALOGUE.map((line, idx) => {
          if (!line.gaps) {
            return (
              <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" fontWeight="bold" color="text.secondary">{line.speaker}:</Typography>
                <Typography variant="body1" fontStyle="italic">"{line.text}"</Typography>
              </Paper>
            )
          }
          const parts = line.template.split('___')
          return (
            <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#fdf0ff' }}>
              <Typography variant="body2" fontWeight="bold" color="secondary" sx={{ mb: 1 }}>{line.speaker} (your turn):</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                {parts.map((part, pi) => (
                  <React.Fragment key={pi}>
                    <Typography variant="body1">{part}</Typography>
                    {pi < line.gaps.length && (
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                          value={answers[line.gaps[pi].id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [line.gaps[pi].id]: e.target.value })}
                          disabled={submitted}
                          displayEmpty
                          renderValue={(v) => v || '___'}
                        >
                          {line.gaps[pi].options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
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
        })}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Debate
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task A Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{allGaps.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 6 ? 'Outstanding! Excellent use of advanced reporting vocabulary!' : 'Good work! Review the correct terms and their usage.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/c1/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
