import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 2 Step 3 — Level B2 — Task D
 * Spell & Explain: spell 6 peer feedback terms and explain how to use them in feedback
 */

const TERMS = [
  { term: 'constructive', usage: 'Use when describing helpful feedback (e.g. "I aimed to offer constructive suggestions.")' },
  { term: 'specific', usage: 'Use to describe precise feedback (e.g. "My feedback was specific about the vocabulary choices.")' },
  { term: 'balanced', usage: 'Use to show you acknowledged both strengths and weaknesses (e.g. "I tried to give balanced feedback.")' },
  { term: 'empathetic', usage: 'Use to show you considered the writer\'s feelings (e.g. "I tried to be empathetic in my tone.")' },
  { term: 'actionable', usage: 'Use for suggestions the writer can actually apply (e.g. "My recommendations were actionable.")' },
  { term: 'strengthen', usage: 'Use when suggesting an improvement (e.g. "To strengthen your report, consider adding data.")' },
]

export default function Phase6SP2Step3RemB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 4, context: 'remedial_b2' })
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
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'D', total, TERMS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && usages.every(u => u.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Peer Feedback Discussion</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice — Level B2</Typography>
        <Typography variant="h6">Task D: Spell &amp; Explain</Typography>
        <Typography variant="body1">Spell 6 peer feedback terms and explain how to use them</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        For each term: (1) type the correct spelling, (2) write a sentence showing how you would use it when giving or describing peer feedback (at least 4 words).
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
                ? spellResults[idx] ? '#8e44ad' : '#f44336'
                : '#e0e0e0',
              backgroundColor: submitted
                ? spellResults[idx] ? '#f3e5f5' : '#fff5f5'
                : 'white'
            }}
          >
            <Typography variant="subtitle2" color="#8e44ad" fontWeight="bold" sx={{ mb: 1 }}>
              Term {idx + 1}
            </Typography>

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
                <Typography variant="body2" sx={{ color: spellResults[idx] ? '#8e44ad' : '#f44336', fontWeight: 'bold' }}>
                  {spellResults[idx] ? '✓ Correct!' : `✗ Answer: ${t.term}`}
                </Typography>
              )}
            </Box>

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
                placeholder="Write a sentence using this word in feedback..."
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>

            {submitted && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Example: {t.usage}
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
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5', border: '2px solid #8e44ad', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }} gutterBottom>
            Task D Complete! Score: {score}/{TERMS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 5 ? 'Excellent! You know these peer feedback terms well.' : 'Good effort! Review the example uses above and keep practising.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Step 4 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
