import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level C1 - Task B
 * Writing: Write an 8-sentence analytical explanation of the purpose and structure of a post-event report
 */

const GUIDED_QUESTIONS = [
  { label: '1. Primary purpose', example: 'Example: The primary purpose is to provide an objective evaluation of the event.' },
  { label: '2. Role of evidence', example: 'Example: Evidence supports claims with verifiable data and participant feedback.' },
  { label: '3. Balance importance', example: 'Example: Documenting both successes and failures ensures a credible, comprehensive account.' },
  { label: '4. Feedback integration', example: 'Example: Incorporating stakeholder input enriches the evaluation with real-world perspectives.' },
  { label: '5. Recommendations value', example: 'Example: Actionable recommendations transform lessons learned into concrete improvements.' },
  { label: '6. Transparency benefit', example: 'Example: Transparent reporting builds institutional trust and stakeholder confidence.' },
  { label: '7. Continuous improvement', example: 'Example: A well-structured report drives organizational learning and future performance.' },
  { label: '8. Long-term impact', example: 'Example: Systematic documentation enhances the quality of future events over time.' }
]

export default function Phase6SP1Step3RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 2, context: 'remedial_c1' })
  const [sentences, setSentences] = useState(Array(GUIDED_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (idx, val) => {
    const updated = [...sentences]; updated[idx] = val; setSentences(updated)
  }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().split(/\s+/).length >= 5).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_c1_taskb_score', filled.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'B', filled, GUIDED_QUESTIONS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)
  const wordCount = sentences.join(' ').split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level C1</Typography>
        <Typography variant="h6">Task B: Analytical Writing</Typography>
        <Typography variant="body1">Write an 8-sentence analytical explanation of the purpose and structure of a post-event report</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Write a sophisticated analytical explanation. Each sentence should address a different dimension of why and how post-event reports are structured. Use formal language and complex sentence structures." />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>C1 Tips:</strong> Use academic vocabulary (transparent, credible, actionable, stakeholder). Avoid contractions. Demonstrate analytical depth — not just what, but why and how. Use connectors (furthermore, consequently, thereby).
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {GUIDED_QUESTIONS.map((q, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#27ae60', mb: 0.5 }}>{q.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>{q.example}</Typography>
            <TextField fullWidth size="small" multiline rows={2} value={sentences[idx]} onChange={(e) => handleChange(idx, e.target.value)} disabled={submitted} placeholder="Write your analytical sentence here..." sx={{ backgroundColor: submitted ? '#f5f5f5' : 'white' }} />
          </Paper>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Total words: {wordCount} (aim for 120+ words)</Typography>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allFilled} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Submit My Analytical Explanation
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task B Complete! Score: {score}/{GUIDED_QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/c1/task/c')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
