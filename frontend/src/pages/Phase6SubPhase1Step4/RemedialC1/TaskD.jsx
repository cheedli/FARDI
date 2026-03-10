import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack, Chip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level C1 — Task D
 * Critique Kahoot: identify the weakness and suggest a C1-level fix for 5 flawed report extracts
 */

const WEAKNESSES = [
  {
    extract: '"The event was very successful and everyone was happy with it."',
    weakness: 'Vague & subjective — no evidence, no measurable outcome',
    fix: '"The event achieved a 91% participant satisfaction rate, as recorded in post-event surveys (n=158)."',
    critiqueChip: 'No evidence',
    fixChip: 'Add quantitative data'
  },
  {
    extract: '"We had some problems but we fixed them quickly."',
    weakness: 'Informal register; lacks specificity about the challenge and resolution',
    fix: '"A technical malfunction in the audio system was identified during the opening session and resolved within 15 minutes by the on-site technical team."',
    critiqueChip: 'Informal + vague',
    fixChip: 'Specify challenge & resolution'
  },
  {
    extract: '"It is recommended that we do better next time."',
    weakness: 'Recommendation not linked to a specific finding; not actionable',
    fix: '"In light of the low engagement scores recorded in the afternoon sessions, it is recommended that future events incorporate interactive workshops in place of extended lecture formats."',
    critiqueChip: 'Not evidence-based',
    fixChip: 'Link to finding & specify action'
  },
  {
    extract: '"The speakers were good and talked about interesting things."',
    weakness: 'Adjectives ("good", "interesting") are subjective and imprecise at C1 level',
    fix: '"The invited speakers delivered sessions that were rated as highly relevant by 84% of attendees, with particular commendation given to the panel discussion on sustainable event management."',
    critiqueChip: 'Subjective adjectives',
    fixChip: 'Use specific, evidence-backed praise'
  },
  {
    extract: '"Overall, the event was a big success and we will do it again."',
    weakness: 'Conclusion lacks evaluative balance — no acknowledgement of areas for growth',
    fix: '"Overall, the event substantially met its stated objectives; however, the challenges identified in time management and catering logistics present clear opportunities for improvement in future iterations."',
    critiqueChip: 'No balance',
    fixChip: 'Acknowledge growth areas'
  },
]

export default function Phase6SP1Step4RemC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(WEAKNESSES.length).fill(''))
  const [revealed, setRevealed] = useState(Array(WEAKNESSES.length).fill(false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleReveal = (idx) => {
    const updated = [...revealed]
    updated[idx] = true
    setRevealed(updated)
  }

  const handleSubmit = async () => {
    const filled = critiques.filter(c => c.trim().split(/\s+/).length >= 5).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taskd_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'D', filled, WEAKNESSES.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = critiques.every(c => c.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level C1</Typography>
        <Typography variant="h6">Task D: Critique Kahoot</Typography>
        <Typography variant="body1">Identify weaknesses and suggest C1-level fixes for flawed report extracts</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Read each flawed report extract. Write your own critique (at least 5 words explaining what is wrong), then reveal the expert feedback and model fix to compare.
      </Alert>

      <Stack spacing={3} sx={{ mb: 3 }}>
        {WEAKNESSES.map((w, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 3, borderRadius: 2, borderLeft: '4px solid #27ae60' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Extract {idx + 1}</Typography>

            {/* Flawed extract */}
            <Paper sx={{ p: 1.5, mb: 1.5, backgroundColor: '#fff3e0', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#c0392b' }}>
                {w.extract}
              </Typography>
            </Paper>

            {/* Weakness chips hint */}
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Chip label={`Problem type: ${w.critiqueChip}`} size="small" sx={{ backgroundColor: '#e74c3c', color: 'white' }} />
              <Chip label={`Fix strategy: ${w.fixChip}`} size="small" sx={{ backgroundColor: '#27ae60', color: 'white' }} />
            </Stack>

            {/* Student critique input */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Your critique:</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={critiques[idx]}
              onChange={(e) => {
                const updated = [...critiques]
                updated[idx] = e.target.value
                setCritiques(updated)
              }}
              disabled={submitted}
              placeholder="Explain what is wrong with this extract..."
              sx={{ mb: 1.5 }}
            />

            {/* Reveal button */}
            {!revealed[idx] ? (
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleReveal(idx)}
                sx={{ color: '#27ae60', borderColor: '#27ae60' }}
              >
                Reveal Expert Feedback
              </Button>
            ) : (
              <Stack spacing={1}>
                <Paper sx={{ p: 1.5, backgroundColor: '#fff5f5', borderRadius: 1, border: '1px solid #e74c3c' }}>
                  <Typography variant="body2" color="error" fontWeight="bold">Weakness: {w.weakness}</Typography>
                </Paper>
                <Paper sx={{ p: 1.5, backgroundColor: '#f0faf4', borderRadius: 1, border: '1px solid #27ae60' }}>
                  <Typography variant="body2" sx={{ color: '#1e8449', fontWeight: 'bold' }}>
                    ✓ Model fix: {w.fix}
                  </Typography>
                </Paper>
              </Stack>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Submit Critiques
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task D Complete! Score: {score}/{WEAKNESSES.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 4 ? 'Excellent critical analysis at C1 level!' : 'Good effort! Review the expert feedback and model fixes above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/5')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Step 5 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
