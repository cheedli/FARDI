import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level C1 - Task D
 * Critique Game: Critique 6 common report weaknesses and fixes
 */

const WEAKNESSES = [
  {
    weakness: 'Only successes reported',
    critique: 'Lacks credibility',
    fix: 'Include a balanced view',
    description: 'A report that only lists successes appears biased and untrustworthy to stakeholders.'
  },
  {
    weakness: 'No evidence provided',
    critique: 'Subjective and unverifiable',
    fix: 'Add data & quotes',
    description: 'Claims without supporting data or participant quotes cannot be verified or acted upon effectively.'
  },
  {
    weakness: 'Vague recommendations',
    critique: 'Unusable by decision-makers',
    fix: 'Make recommendations specific',
    description: '"Do better next time" provides no guidance. Specific steps (who, what, when) are essential.'
  },
  {
    weakness: 'Poor structure',
    critique: 'Difficult to read and navigate',
    fix: 'Use clear headings and sections',
    description: 'An unstructured report forces readers to search for information, reducing usability and impact.'
  },
  {
    weakness: 'Emotional or biased tone',
    critique: 'Unprofessional and unreliable',
    fix: 'Maintain an objective tone',
    description: 'Emotional language undermines credibility. Professional reports present facts analytically, not emotionally.'
  },
  {
    weakness: 'No future focus',
    critique: 'Wastes the learning opportunity',
    fix: 'End with forward-looking recommendations',
    description: 'A report without recommendations fails its primary purpose: to drive continuous improvement for future events.'
  }
]

export default function Phase6SP1Step3RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(WEAKNESSES.length).fill(''))
  const [fixes, setFixes] = useState(Array(WEAKNESSES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (idx, val) => {
    const updated = [...critiques]; updated[idx] = val; setCritiques(updated)
  }
  const handleFixChange = (idx, val) => {
    const updated = [...fixes]; updated[idx] = val; setFixes(updated)
  }

  const handleSubmit = async () => {
    const critFilled = critiques.filter(c => c.trim().split(/\s+/).length >= 2).length
    const fixFilled = fixes.filter(f => f.trim().split(/\s+/).length >= 2).length
    const total = Math.round((critFilled + fixFilled) / 2)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_c1_taskd_score', total.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'D', total, WEAKNESSES.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = critiques.every(c => c.trim().length > 0) && fixes.every(f => f.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level C1</Typography>
        <Typography variant="h6">Task D: Critique Game</Typography>
        <Typography variant="body1">Critique 6 common report weaknesses and propose fixes</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="You are the expert reviewer! For each common report weakness, write a professional critique explaining why it is a problem, then propose a specific fix. Use sophisticated analytical language." />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>Instructions:</strong> For each weakness: (1) Write a critique explaining WHY it is problematic, (2) Propose a specific FIX. After submitting, compare with the model answers.
      </Alert>

      <Stack spacing={3} sx={{ mb: 3 }}>
        {WEAKNESSES.map((item, idx) => (
          <Paper key={idx} elevation={2} sx={{
            p: 3, borderRadius: 2,
            border: submitted ? '2px solid #27ae60' : '1px solid #e0e0e0',
            backgroundColor: submitted ? '#f0faf4' : 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip label={`Weakness ${idx + 1}`} size="small" sx={{ backgroundColor: '#c0392b', color: 'white' }} />
              <Typography variant="body1" fontWeight="bold" color="error">{item.weakness}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Your critique (Why is this a problem?):</Typography>
              <TextField fullWidth size="small" multiline rows={2} value={critiques[idx]} onChange={(e) => handleCritiqueChange(idx, e.target.value)} disabled={submitted} placeholder="Write your critique here..." sx={{ backgroundColor: 'white' }} />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Your fix (How to improve it?):</Typography>
              <TextField fullWidth size="small" multiline rows={2} value={fixes[idx]} onChange={(e) => handleFixChange(idx, e.target.value)} disabled={submitted} placeholder="Propose your fix here..." sx={{ backgroundColor: 'white' }} />
            </Box>

            {submitted && (
              <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#e8f5e9', borderRadius: 1, border: '1px solid #27ae60' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>Model Answer:</Typography>
                <Typography variant="body2"><strong>Critique:</strong> {item.critique} — {item.description}</Typography>
                <Typography variant="body2"><strong>Fix:</strong> {item.fix}</Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allFilled} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Submit My Critiques & Fixes
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task D Complete! Score: {score}/{WEAKNESSES.length}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>Excellent! You have completed all C1 remedial tasks for Step 3.</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1')} size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Continue to Next Phase →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
