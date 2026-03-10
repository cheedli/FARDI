import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level B2 — Task D
 * Spell & Explain: spell 6 report terms and write how to use each in a report
 */

const TERMS = [
  { term: 'exceeded', usage: 'Used to show results were better than the target (e.g. "Attendance exceeded expectations.")' },
  { term: 'highlight', usage: 'Used to draw attention to key achievements (e.g. "The report highlights three main successes.")' },
  { term: 'encountered', usage: 'Used to introduce a challenge (e.g. "The team encountered technical difficulties.")' },
  { term: 'recommend', usage: 'Used in the recommendations section (e.g. "It is recommended that future events...")' },
  { term: 'evidence', usage: 'Used to support claims (e.g. "Evidence from participant surveys suggests...")' },
  { term: 'evaluation', usage: 'Used to describe the overall assessment (e.g. "This evaluation concludes that...")' },
]

export default function Phase6SP1Step4RemB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(TERMS.length).fill(''))
  const [usages, setUsages] = useState(Array(TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [spellResults, setSpellResults] = useState([])
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const results = TERMS.map((t, i) => spellings[i].trim().toLowerCase() === t.term)
    const spellScore = results.filter(Boolean).length
    const usageScore = usages.filter(u => u.trim().split(/\s+/).length >= 4).length
    const total = Math.round((spellScore + usageScore) / 2)
    setSpellResults(results)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'D', total, TERMS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && usages.every(u => u.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B2</Typography>
        <Typography variant="h6">Task D: Spell &amp; Explain</Typography>
        <Typography variant="body1">Spell 6 report terms and explain how to use them</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        For each term: (1) type the correct spelling, (2) write a short sentence showing how you would use it in a post-event report (at least 4 words).
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {TERMS.map((t, idx) => (
          <Paper
            key={idx}
            elevation={1}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '2px solid',
              borderColor: submitted
                ? spellResults[idx] ? '#27ae60' : '#f44336'
                : '#e0e0e0',
              backgroundColor: submitted
                ? spellResults[idx] ? '#f0faf4' : '#fff5f5'
                : 'white'
            }}
          >
            <Typography variant="subtitle2" color="#27ae60" fontWeight="bold" sx={{ mb: 1 }}>
              Term {idx + 1}
            </Typography>

            {/* Spelling */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70 }}>Spelling:</Typography>
              <TextField
                size="small"
                value={spellings[idx]}
                onChange={(e) => {
                  const updated = [...spellings]
                  updated[idx] = e.target.value
                  setSpellings(updated)
                }}
                disabled={submitted}
                placeholder="Type the word..."
                sx={{ minWidth: 200 }}
              />
              {submitted && (
                <Typography variant="body2" sx={{ color: spellResults[idx] ? '#27ae60' : '#f44336', fontWeight: 'bold' }}>
                  {spellResults[idx] ? '✓ Correct!' : `✗ Answer: ${t.term}`}
                </Typography>
              )}
            </Box>

            {/* Usage */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70, mt: 1 }}>Use it:</Typography>
              <TextField
                size="small"
                multiline
                rows={2}
                value={usages[idx]}
                onChange={(e) => {
                  const updated = [...usages]
                  updated[idx] = e.target.value
                  setUsages(updated)
                }}
                disabled={submitted}
                placeholder="Write a sentence using this word in a report..."
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>

            {submitted && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Example use: {t.usage}
              </Typography>
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
          Submit
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task D Complete! Score: {score}/{TERMS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 5 ? 'Excellent! You know these report terms well.' : 'Good effort! Review the example uses above and keep practising.'}
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
