import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, Stack, Chip, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level C1 - Task D
 * Critique Game: "Critique Kahoot" — Critique/fix 6 advanced report weaknesses
 */

const WEAKNESSES = [
  {
    id: 1,
    label: 'Overly positive',
    example: '"The festival was amazing in every way. Everything was perfect and everyone loved it."',
    critique: 'Lacks credibility',
    fix: 'Balanced evaluation',
    explanation: 'Overly positive reports lose credibility. Readers expect honest assessment of both successes and challenges. Balanced evaluation builds trust and demonstrates intellectual honesty.'
  },
  {
    id: 2,
    label: 'No evidence',
    example: '"Many people came and they were satisfied."',
    critique: 'Subjective',
    fix: 'Add data/quotes',
    explanation: 'Without evidence (numbers, quotes, surveys), claims are subjective. Add: "Over 200 participants attended and 87% rated satisfaction as excellent (post-event survey)."'
  },
  {
    id: 3,
    label: 'Vague recommendations',
    example: '"We should do better next time."',
    critique: 'Unusable',
    fix: 'Make actionable',
    explanation: 'Vague recommendations cannot be implemented. Make them specific: "It is recommended that future events implement 15-minute transition buffers between all scheduled activities."'
  },
  {
    id: 4,
    label: 'Informal tone',
    example: '"The show was super cool and the food was yummy!"',
    critique: 'Unprofessional',
    fix: 'Use formal language',
    explanation: 'Informal language ("super cool", "yummy") is inappropriate for professional reports. Use formal alternatives: "The performances were well-received" and "The catering was highly regarded."'
  },
  {
    id: 5,
    label: 'Poor cohesion',
    example: '"The festival succeeded. Problems occurred. Feedback received. Improvements needed."',
    critique: 'Hard to follow',
    fix: 'Add connectors',
    explanation: 'Reports without connectors are choppy and hard to follow. Use logical connectors: "The festival achieved notable success; however, several logistical challenges were encountered. In addition, participant feedback highlighted areas for improvement."'
  },
  {
    id: 6,
    label: 'No stakeholder focus',
    example: '"We all worked very hard and are proud of what we did."',
    critique: 'Misses purpose',
    fix: 'Address audience needs',
    explanation: 'Reports must serve the needs of stakeholders (sponsors, administrators, future planners). Address what they need to know: outcomes achieved, value delivered, and what will improve next time.'
  }
]

export default function Phase6SP1Step5RemC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [revealed, setRevealed] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleReveal = (id) => {
    setRevealed({ ...revealed, [id]: true })
  }

  const handleSubmit = async () => {
    let correct = 0
    WEAKNESSES.forEach(w => { if ((critiques[w.id] || '').trim().split(/\s+/).filter(Boolean).length >= 5) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taskd_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'D', correct, WEAKNESSES.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAttempted = WEAKNESSES.every(w => (critiques[w.id] || '').trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task D: Critique Kahoot</Typography>
        <Typography variant="body1">Critique and fix 6 advanced weaknesses in report writing</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Critique Kahoot! For each report weakness below, write your critique explaining WHY it's a problem and HOW to fix it. Then reveal the expert feedback to compare. Use sophisticated C1 language in your critiques!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> For each weakness: (1) Read the example text, (2) Write your own critique (minimum 5 words), (3) Click "Reveal" to see the expert feedback. Your score is based on the quality of your own critique attempt.</Typography>
      </Alert>

      <Stack spacing={3}>
        {WEAKNESSES.map((w) => (
          <Paper key={w.id} elevation={2} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">{w.id}. {w.label}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`Critique: ${w.critique}`} color="error" size="small" />
                <Chip label={`Fix: ${w.fix}`} color="success" size="small" />
              </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff5f5', borderLeft: '4px solid #e74c3c' }}>
              <Typography variant="caption" color="error.main" fontWeight="bold">Weak Report Example:</Typography>
              <Typography variant="body2" fontStyle="italic">{w.example}</Typography>
            </Paper>

            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Your Critique:</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={critiques[w.id] || ''}
              onChange={(e) => setCritiques({ ...critiques, [w.id]: e.target.value })}
              disabled={submitted}
              placeholder="Explain why this is a weakness and how to fix it..."
              sx={{ mb: 2 }}
            />

            {!revealed[w.id] && !submitted ? (
              <Button size="small" variant="outlined" onClick={() => handleReveal(w.id)} sx={{ color: '#8e44ad', borderColor: '#8e44ad' }}>
                Reveal Expert Feedback
              </Button>
            ) : (
              <Alert severity="success">
                <Typography variant="body2" fontWeight="bold">Expert Feedback:</Typography>
                <Typography variant="body2">{w.explanation}</Typography>
              </Alert>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAttempted} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit All Critiques
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task D Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{WEAKNESSES.length} substantial critiques</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 5 ? 'Outstanding! You have deep analytical understanding of professional report quality.' : score >= 4 ? 'Excellent! Strong critical analysis skills.' : 'Good effort! Compare your critiques with the expert feedback above.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Continue to Sub-Phase 2 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
