import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, Stack, TextField, Alert } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const TERMS = [
  { id: 1, word: 'hashtag', hint: 'Symbol for categorizing (#)' },
  { id: 2, word: 'caption', hint: 'Text describing a post' },
  { id: 3, word: 'emoji', hint: 'Visual emotion icon' },
  { id: 4, word: 'tag', hint: 'Mention someone (@)' },
  { id: 5, word: 'call-to-action', hint: 'Prompt to take action (CTA)' },
  { id: 6, word: 'viral', hint: 'Content spreading rapidly' }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 4, interaction: 4, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState({})

  const handleSpellingChange = (termId, value) => {
    setAnswers(prev => ({ ...prev, [termId]: { ...prev[termId], spelling: value } }))
  }

  const handleExplanationChange = (termId, value) => {
    setAnswers(prev => ({ ...prev, [termId]: { ...prev[termId], explanation: value } }))
  }

  const handleSubmit = () => {
    let totalScore = 0
    const newResults = {}
    TERMS.forEach(term => {
      const answer = answers[term.id] || {}
      const spelling = (answer.spelling || '').trim().toLowerCase()
      const explanation = (answer.explanation || '').trim()
      const spellingCorrect = spelling === term.word.toLowerCase()
      const explanationCorrect = explanation.length >= 15
      newResults[term.id] = { spellingCorrect, explanationCorrect, userSpelling: answer.spelling || '', userExplanation: answer.explanation || '' }
      if (spellingCorrect) totalScore++
      if (explanationCorrect) totalScore++
    })
    setScore(totalScore)
    setResults(newResults)
    setSubmitted(true)
    sessionStorage.setItem('phase4_2_step4_b2_taskD', totalScore)
    fetch('/api/phase4/remedial/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'D', step: 4, score: totalScore, max_score: 12, completed: true })
    }).catch(err => console.error('Log error:', err))
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: totalScore })
  }

  const handleContinue = () => { navigate('/phase4_2/step/4/remedial/b2/results') }
  window.__remedialSkip = handleContinue

  const allAnswered = TERMS.every(term => {
    const answer = answers[term.id] || {}
    return (answer.spelling || '').trim().length > 0 && (answer.explanation || '').trim().length >= 15
  })

  const passed = score >= 9

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task D: Spelling & Explain</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Spell each term correctly and write an explanation (at least 15 characters). Each term has 2 points: 1 for correct spelling + 1 for good explanation. Total: 12 points!" />
          </Box>

          {/* Terms */}
          <Stack spacing={3} sx={{ mb: 3 }}>
            {TERMS.map((term, index) => {
              const answer = answers[term.id] || {}
              const result = results[term.id]

              return (
                <Box key={term.id} sx={{
                  bgcolor: submitted ? (result?.spellingCorrect && result?.explanationCorrect ? P.green.bg : P.yellow.bg) : P.teal.bg,
                  border: `2px solid ${submitted ? (result?.spellingCorrect && result?.explanationCorrect ? P.green.border : P.yellow.border) : P.teal.border}`,
                  borderRadius: '16px', p: 3,
                  boxShadow: `3px 3px 0 ${submitted ? (result?.spellingCorrect && result?.explanationCorrect ? P.green.shadow : P.yellow.shadow) : P.teal.shadow}`,
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Term {index + 1}: {term.hint}</Typography>

                  {/* Spelling */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: P.orange.shadow, mb: 1 }}>Spell the term:</Typography>
                    <TextField
                      fullWidth
                      value={answer.spelling || ''}
                      onChange={(e) => handleSpellingChange(term.id, e.target.value)}
                      placeholder="Type the spelling here..."
                      variant="outlined"
                      disabled={submitted}
                    />
                    {submitted && result && (
                      <Alert severity={result.spellingCorrect ? 'success' : 'error'} sx={{ mt: 1 }}>
                        {result.spellingCorrect
                          ? <Typography variant="body2" sx={{ fontWeight: 600 }}>Correct spelling! (+1 point)</Typography>
                          : <Typography variant="body2" sx={{ fontWeight: 600 }}>Incorrect. Correct spelling: <strong>{term.word}</strong></Typography>
                        }
                      </Alert>
                    )}
                  </Box>

                  {/* Explanation */}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: P.orange.shadow, mb: 1 }}>Explain what it means:</Typography>
                    <TextField
                      fullWidth multiline rows={2}
                      value={answer.explanation || ''}
                      onChange={(e) => handleExplanationChange(term.id, e.target.value)}
                      placeholder="Write your explanation here (minimum 15 characters)..."
                      variant="outlined"
                      disabled={submitted}
                    />
                    <Box component="span" sx={{
                      display: 'inline-block', mt: 1,
                      bgcolor: (answer.explanation || '').length >= 15 ? P.green.bg : P.yellow.bg,
                      border: `2px solid ${(answer.explanation || '').length >= 15 ? P.green.border : P.yellow.border}`,
                      borderRadius: '999px', px: 2, py: 0.25, fontSize: '0.8rem', fontWeight: 700,
                      color: (answer.explanation || '').length >= 15 ? P.green.shadow : P.yellow.shadow,
                    }}>{(answer.explanation || '').length} characters</Box>
                    {submitted && result && (
                      <Alert severity={result.explanationCorrect ? 'success' : 'warning'} sx={{ mt: 1 }}>
                        {result.explanationCorrect
                          ? <Typography variant="body2" sx={{ fontWeight: 600 }}>Good explanation! (+1 point)</Typography>
                          : <Typography variant="body2" sx={{ fontWeight: 600 }}>Too short. Add more detail.</Typography>
                        }
                      </Alert>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Stack>

          {/* Results */}
          {submitted && (
            <Box sx={{
              bgcolor: passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${passed ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.yellow.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              {passed ? <CheckCircleIcon sx={{ fontSize: 48, color: P.green.shadow, mb: 1 }} /> : <EmojiEventsIcon sx={{ fontSize: 48, color: P.yellow.shadow, mb: 1 }} />}
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                {passed ? 'Excellent Work!' : 'Good Effort!'}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.yellow.shadow }}>{score} / 12</Typography>
              <Typography variant="body1" sx={{ color: passed ? P.green.shadow : P.yellow.shadow, mt: 1 }}>
                {passed ? 'You passed this task! Great spelling and explanations.' : 'Keep practicing your spelling and explanations.'}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allAnswered ? 'not-allowed' : 'pointer', color: P.purple.shadow, opacity: !allAnswered ? 0.5 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.purple.shadow}` },
              }}>{allAnswered ? 'Submit All Answers' : 'Complete All Terms First'}</Box>
            )}
            {submitted && (
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Results <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
