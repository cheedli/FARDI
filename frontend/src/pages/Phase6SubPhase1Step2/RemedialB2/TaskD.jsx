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
 * Phase 6 SubPhase 1 Step 2 - Level B2 - Task D
 * Spell & Explain: Spell and explain 6 report terms
 */

const TERMS = [
  { term: 'success', definition: 'Positive result — when the event or action went well' },
  { term: 'challenge', definition: 'Problem — a difficult situation that needed to be addressed' },
  { term: 'feedback', definition: 'Comments — the opinions and reactions of participants' },
  { term: 'improve', definition: 'Do better — to make something better for next time' },
  { term: 'recommend', definition: 'Suggest — to propose an action for the future' },
  { term: 'summary', definition: 'Overview — a short description of the main points' }
]

export default function Phase6SP1Step2RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(TERMS.length).fill(''))
  const [explanations, setExplanations] = useState(Array(TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [spellResults, setSpellResults] = useState([])

  const handleSpellingChange = (idx, val) => {
    const updated = [...spellings]
    updated[idx] = val
    setSpellings(updated)
  }

  const handleExplanationChange = (idx, val) => {
    const updated = [...explanations]
    updated[idx] = val
    setExplanations(updated)
  }

  const handleSubmit = async () => {
    const results = TERMS.map((t, i) => spellings[i].trim().toLowerCase() === t.term)
    const spellScore = results.filter(Boolean).length
    const explainScore = explanations.filter(e => e.trim().split(/\s+/).length >= 3).length
    const total = Math.round((spellScore + explainScore) / 2)
    setSpellResults(results)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b2_taskd_score', total.toString())
    try {
      await phase6API.logRemedialActivity(2, 'B2', 'D', total, TERMS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && explanations.every(e => e.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B2</Typography>
        <Typography variant="h6">Task D: Spell &amp; Explain</Typography>
        <Typography variant="body1">Spell and explain 6 report terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Spell each report term correctly, then write a short explanation of what it means. This will help you remember these important words for your report!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          For each term: (1) Type the correct spelling, (2) Write a short explanation in your own words (at least 3 words).
        </Typography>
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {TERMS.map((t, idx) => (
          <Paper
            key={idx}
            elevation={1}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: submitted ? '2px solid' : '1px solid #e0e0e0',
              borderColor: submitted
                ? spellResults[idx] ? '#27ae60' : '#f44336'
                : '#e0e0e0',
              backgroundColor: submitted
                ? spellResults[idx] ? '#f0faf4' : '#fff5f5'
                : 'white'
            }}
          >
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#27ae60', mb: 1 }}>
              Term {idx + 1}:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">Spelling:</Typography>
              <TextField
                size="small"
                value={spellings[idx]}
                onChange={(e) => handleSpellingChange(idx, e.target.value)}
                disabled={submitted}
                placeholder="Type the word..."
                sx={{ minWidth: 200, backgroundColor: 'white' }}
              />
              {submitted && (
                <Typography variant="body2" sx={{ color: spellResults[idx] ? '#27ae60' : '#f44336', fontWeight: 'bold' }}>
                  {spellResults[idx] ? '✓ Correct!' : `✗ Answer: ${t.term}`}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Explanation:</Typography>
              <TextField
                size="small"
                multiline
                rows={2}
                value={explanations[idx]}
                onChange={(e) => handleExplanationChange(idx, e.target.value)}
                disabled={submitted}
                placeholder="Explain what this word means..."
                sx={{ flex: 1, minWidth: 200, backgroundColor: 'white' }}
              />
            </Box>
            {submitted && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Definition: {t.definition}
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
          Submit Spellings & Explanations
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task D Complete! Score: {score}/{TERMS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 5 ? 'Excellent! You know these terms well!' : 'Good effort! Review the definitions and keep practicing.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/1')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Next Phase →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
