import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task B
 * Writing: "Executive Summary Odyssey"
 * Write an 8-sentence formal paragraph for the "Conclusion & Recommendations" section
 */

const GUIDED_STRUCTURE = [
  { id: 0, point: 'Overall assessment of success', placeholder: 'The Global Cultures Festival achieved substantial success in promoting intercultural dialogue...' },
  { id: 1, point: 'Key achievement / impact', placeholder: 'The most impactful achievement was the high level of authentic cross-cultural engagement...' },
  { id: 2, point: 'Most significant challenge & response', placeholder: 'While the last-minute stage lighting failure posed a significant logistical challenge...' },
  { id: 3, point: 'Main strength of the project', placeholder: 'A core strength lay in the exceptional teamwork and adaptability demonstrated under pressure.' },
  { id: 4, point: 'Primary area requiring improvement', placeholder: 'However, time management and contingency planning require substantial enhancement.' },
  { id: 5, point: 'Summary of participant/stakeholder feedback', placeholder: 'Feedback highlighted appreciation for diversity but noted that the programme felt overly dense.' },
  { id: 6, point: 'Strategic recommendation #1', placeholder: 'It is strongly recommended that future events implement stricter time buffers between activities.' },
  { id: 7, point: 'Strategic recommendation #2 (long-term)', placeholder: 'Long-term, establishing a permanent risk-management protocol would significantly elevate organisational resilience.' }
]

export default function Phase6SP1Step1RemC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_c1' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_STRUCTURE.every(s => (sentences[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_STRUCTURE.forEach(s => {
      const words = (sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 10) correct++ // C1 sentences should be more substantial
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'B', correct, GUIDED_STRUCTURE.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Executive Summary Odyssey</Typography>
        <Typography variant="body1">Write an 8-sentence formal "Conclusion & Recommendations" section</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Executive Summary Odyssey! Write one sophisticated sentence for each point below to create a formal 'Conclusion & Recommendations' section for the post-event report. Use advanced vocabulary, formal tone, and evidence-based language!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> Write one formal sentence per point. Use sophisticated vocabulary
          (substantial, impactful, pivotal, contingency, resilience, strategic), formal connectors
          (while, however, furthermore, it is recommended), and evidence-based language. Aim for 10+ words per sentence.
        </Typography>
      </Alert>

      <Stack spacing={2}>
        {GUIDED_STRUCTURE.map((s) => (
          <Paper key={s.id} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {s.id + 1}. {s.point}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={sentences[s.id] || ''}
              onChange={(e) => setSentences({ ...sentences, [s.id]: e.target.value })}
              disabled={submitted}
              placeholder={s.placeholder}
            />
            {submitted && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Words: {(sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length}
              </Typography>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Executive Summary
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GUIDED_STRUCTURE.length} substantial sentences</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 7 ? 'Outstanding! A sophisticated and formal executive summary!' : score >= 5 ? 'Well done! Keep developing your formal writing skills.' : 'Good effort! Focus on using more sophisticated vocabulary and longer sentences.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/c1/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
