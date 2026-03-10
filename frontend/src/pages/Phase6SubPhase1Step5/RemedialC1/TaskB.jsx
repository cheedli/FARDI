import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level C1 - Task B
 * Writing: "Analysis Odyssey" — Fully correct/rewrite 8-sentence faulty report section at C1 level
 */

const FAULTY_TEXT = 'Festival good. Many people come. Dances nice. Food good. Lights problem bad. We fix fast. People happy. Next time better.'

const MODEL_ANSWER = `The Global Cultures Festival achieved its core objectives of promoting intercultural dialogue, attracting over 200 participants and generating overwhelmingly positive qualitative feedback. High-impact elements — authentic performances and diverse cuisine — facilitated meaningful cross-cultural engagement. While a technical lighting failure presented a notable challenge, the rapid deployment of contingency protocols ensured continuity. Core organizational strengths included exceptional team resilience. However, schedule density reduced opportunities for deeper interaction, as noted in feedback. Evidence from attendance figures and participant comments supports the need for extended transition periods. It is strongly recommended that future iterations incorporate stricter time buffers. Long-term, formalizing a comprehensive risk-management framework would significantly enhance event quality.`

const GUIDED_POINTS = [
  { id: 0, point: 'Festival achieved core objectives (mention intercultural dialogue + 200+ participants)', placeholder: 'The Global Cultures Festival achieved its core objectives...' },
  { id: 1, point: 'High-impact elements (authentic performances + diverse cuisine)', placeholder: 'High-impact elements — authentic performances...' },
  { id: 2, point: 'Technical lighting failure + contingency deployed', placeholder: 'While a technical lighting failure presented...' },
  { id: 3, point: 'Core organizational strength (team resilience)', placeholder: 'Core organizational strengths included...' },
  { id: 4, point: 'Challenge: schedule density (from feedback)', placeholder: 'However, schedule density reduced...' },
  { id: 5, point: 'Evidence supporting need for improvement', placeholder: 'Evidence from attendance figures and participant comments...' },
  { id: 6, point: 'Strong recommendation for future events', placeholder: 'It is strongly recommended that future iterations...' },
  { id: 7, point: 'Long-term strategic framework recommendation', placeholder: 'Long-term, formalizing a comprehensive risk-management framework...' }
]

export default function Phase6SP1Step5RemC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_c1' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_POINTS.every(s => (sentences[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_POINTS.forEach(s => {
      const words = (sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 10) correct++ // C1 requires more substantial sentences
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'B', correct, GUIDED_POINTS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Rewrite 8 faulty sentences at C1 level with sophisticated language and balance</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Analysis Odyssey! Transform this informal, unbalanced report into a sophisticated C1-level document. Use advanced vocabulary (substantial, pivotal, contingency, resilience, stakeholder), formal connectors (while, however, furthermore), and evidence-based language. Aim for 10+ words per sentence!"
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 2.5, mb: 3, backgroundColor: '#fff5f5', borderLeft: '4px solid #e74c3c', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="error.main" fontWeight="bold" gutterBottom>Faulty Text to Transform:</Typography>
        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{FAULTY_TEXT}</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>C1 Instructions:</strong> Each sentence must be 10+ words. Use sophisticated vocabulary, formal structure (passive voice where appropriate), evidence-based language, and logical connectors. Balance successes and challenges.</Typography>
      </Alert>

      <Stack spacing={2}>
        {GUIDED_POINTS.map((s) => (
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
              <Typography variant="caption" color={((sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 10) ? 'success.main' : 'warning.main'} sx={{ display: 'block', mt: 0.5 }}>
                Words: {(sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length} {((sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 10) ? '✓' : '(aim for 10+)'}
              </Typography>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit C1 Analysis
        </Button>
      ) : (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: '#f0faf4', borderLeft: '4px solid #27ae60', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom>C1 Model Answer:</Typography>
            <Typography variant="body2" sx={{ lineHeight: 2 }}>{MODEL_ANSWER}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GUIDED_POINTS.length} sophisticated sentences</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 7 ? 'Outstanding! A sophisticated and balanced C1-level report.' : score >= 5 ? 'Well done! Compare your sentences with the model answer above.' : 'Good effort! Focus on using 10+ words with sophisticated vocabulary per sentence.'}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/c1/task/c')} size="large"
              sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
              Next: Task C →
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
