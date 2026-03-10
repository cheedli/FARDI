import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const TERMS = [
  {
    word: 'feedback',
    usageExample: '"I gave feedback on the report by explaining what was good and what to improve."',
  },
  {
    word: 'constructive',
    usageExample: '"My feedback was constructive — it offered specific ways to improve."',
  },
  {
    word: 'suggestion',
    usageExample: '"My suggestion is to add more evidence to the Challenges section."',
  },
  {
    word: 'strength',
    usageExample: '"A strength of your report is the clear and well-organized summary."',
  },
  {
    word: 'weakness',
    usageExample: '"One weakness is that the recommendations are too vague."',
  },
  {
    word: 'polite',
    usageExample: '"I tried to be polite by starting with something positive before giving suggestions."',
  },
]

export default function Phase6SP2Step4RemB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(TERMS.map(() => ''))
  const [usages, setUsages] = useState(TERMS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [spellingResults, setSpellingResults] = useState([])

  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleSubmit = async () => {
    const results = TERMS.map((term, i) => spellings[i].trim().toLowerCase() === term.word.toLowerCase())
    setSpellingResults(results)

    let total = 0
    TERMS.forEach((term, i) => {
      const spellScore = spellings[i].trim().toLowerCase() === term.word.toLowerCase() ? 1 : 0
      const useScore = wordCount(usages[i]) >= 5 ? 1 : 0
      total += spellScore + useScore
    })

    // avg out of 6 (1 spell + 1 usage per term = 2 points, 6 terms = 12 max → scale to /6)
    const finalScore = Math.round(total / 2)
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taskd_score', finalScore.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'D', finalScore, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = spellings.every((s) => s.trim().length > 0) && usages.every((u) => u.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial B2 — Task D</Typography>
        <Typography variant="body1">Spell & Explain — Peer Feedback Vocabulary</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        For each peer feedback term: (1) spell it correctly in the first box, and (2) write a sentence explaining how you would use it in feedback in the second box.
      </Alert>

      {TERMS.map((term, idx) => {
        const isCorrectSpelling = submitted && spellings[idx].trim().toLowerCase() === term.word.toLowerCase()
        const isWrongSpelling = submitted && spellings[idx].trim().toLowerCase() !== term.word.toLowerCase()
        return (
          <Paper key={idx} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0d0f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip label={`${idx + 1}`} size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold' }} />
              <Typography variant="subtitle1" fontWeight="bold" color="#6c3483">
                Term #{idx + 1}
              </Typography>
              {submitted && (
                <Chip
                  label={isCorrectSpelling ? 'Correct spelling' : 'Wrong spelling'}
                  size="small"
                  color={isCorrectSpelling ? 'success' : 'error'}
                  sx={{ ml: 'auto' }}
                />
              )}
            </Box>

            <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Spell the term:</Typography>
            <TextField
              fullWidth
              value={spellings[idx]}
              onChange={(e) => {
                const updated = [...spellings]
                updated[idx] = e.target.value
                setSpellings(updated)
              }}
              disabled={submitted}
              placeholder="Type the spelling here..."
              size="small"
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isCorrectSpelling ? '#27ae60' : isWrongSpelling ? '#e74c3c' : undefined,
                  borderWidth: submitted ? 2 : 1,
                },
              }}
            />
            {isWrongSpelling && (
              <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                Correct spelling: <strong>{term.word}</strong>
              </Typography>
            )}

            <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, mt: 1 }}>How would you use it in peer feedback?</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={usages[idx]}
              onChange={(e) => {
                const updated = [...usages]
                updated[idx] = e.target.value
                setUsages(updated)
              }}
              disabled={submitted}
              placeholder="Write a sentence showing how to use this term in feedback..."
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color={wordCount(usages[idx]) >= 5 ? 'success.main' : 'text.secondary'}>
              Words: {wordCount(usages[idx])} {wordCount(usages[idx]) >= 5 ? '' : '(aim for 5+)'}
            </Typography>

            {submitted && (
              <Paper elevation={0} sx={{ p: 2, mt: 2, backgroundColor: '#e8f5e9', borderRadius: 1, borderLeft: '4px solid #27ae60' }}>
                <Typography variant="body2" fontWeight="bold" color="success.dark" gutterBottom>Example usage:</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{term.usageExample}</Typography>
              </Paper>
            )}
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAttempted}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit All Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task D Complete! Score: {score}/6</Typography>
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={(score / 6) * 100} sx={{ height: 10, borderRadius: 5, backgroundColor: '#d0f0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }} />
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 6 ? 'Perfect! You have mastered all six peer feedback terms.' : score >= 4 ? 'Well done! Review the example usages above to reinforce your understanding.' : 'Study the example usages carefully and practise spelling these key terms.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Step 5
          </Button>
        </Paper>
      )}
    </Box>
  )
}
