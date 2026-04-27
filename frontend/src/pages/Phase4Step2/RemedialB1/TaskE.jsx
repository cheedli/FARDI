import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
}

/**
 * Phase 4 Step 2 - Remedial B1 - Task E: Tense Time Travel
 * Bonus task worth 6 points
 */

const SENTENCES = [
  { id: 1, beforeVerb: 'The ad', verb: 'is', afterVerb: 'promotional.', correctPastVerb: 'was', hint: 'Change "is" to past tense' },
  { id: 2, beforeVerb: 'Persuasive advertising', verb: 'uses', afterVerb: 'ethos, pathos, and logos.', correctPastVerb: 'used', hint: 'Change "uses" to past tense' },
  { id: 3, beforeVerb: 'Targeted advertising', verb: 'is', afterVerb: 'for a specific group.', correctPastVerb: 'was', hint: 'Change "is" to past tense' },
  { id: 4, beforeVerb: 'Original content', verb: 'is', afterVerb: 'new and unique.', correctPastVerb: 'was', hint: 'Change "is" to past tense' },
  { id: 5, beforeVerb: 'Creative design', verb: 'makes', afterVerb: 'ads memorable.', correctPastVerb: 'made', hint: 'Change "makes" to past tense' },
  { id: 6, beforeVerb: 'Ethical advertising', verb: 'is', afterVerb: 'honest and fair.', correctPastVerb: 'was', hint: 'Change "is" to past tense' }
]

export default function RemedialB1TaskE() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/2/remedial/b1/taskF') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 5, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const [showHints, setShowHints] = useState(false)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))
  const checkAnswer = (studentAnswer, correctAnswer) => studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()

  const handleSubmit = () => {
    let score = 0
    const feedback = SENTENCES.map(sentence => {
      const studentAnswer = answers[sentence.id] || ''
      const isCorrect = checkAnswer(studentAnswer, sentence.correctPastVerb)
      if (isCorrect) score += 1
      return { id: sentence.id, beforeVerb: sentence.beforeVerb, verb: sentence.verb, afterVerb: sentence.afterVerb, studentAnswer, correctAnswer: sentence.correctPastVerb, isCorrect }
    })
    setResults({ score, feedback })
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_b1_taskE_score', score)
    logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'E', step: 2, score, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allAnswered = SENTENCES.every(s => answers[s.id] && answers[s.id].trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 2: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom>Level B1 - Task E: Tense Time Travel ⏰ (BONUS)</Typography>
            <Typography variant="body1">Convert 6 verbs from present to past tense!</Typography>
            <Box sx={{ ...cardSx('yellow'), mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                ⭐ Bonus Task: This is an optional task worth 6 bonus points. Complete it to boost your total score!
              </Typography>
            </Box>
          </Box>

          {/* Character */}
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Time to travel back in time! 🕰️ For each sentence, write ONLY the verb in past tense. For example, if you see 'The ad IS promotional', you should write 'was' in the box. Complete all 6 correctly for 6 bonus points!" />
          </Box>

          {!submitted ? (
            <Box>
              {/* Hint Toggle */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  component="button"
                  onClick={() => setShowHints(!showHints)}
                  sx={{
                    ...cardSx('teal'), cursor: 'pointer', px: 3, py: 1,
                    fontWeight: 'bold', fontSize: '0.85rem', color: P.teal.border, transition: 'all 0.2s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` }
                  }}
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Box>
              </Box>

              <Stack spacing={3}>
                {SENTENCES.map((sentence, index) => (
                  <Box key={sentence.id} sx={{ ...cardSx('blue') }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Sentence {index + 1}</Typography>

                    {showHints && (
                      <Box sx={{ ...cardSx('teal'), mb: 2, p: 2 }}>
                        <Typography variant="body2">💡 Hint: {sentence.hint}</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Typography variant="h6">{sentence.beforeVerb}</Typography>
                      <Box sx={{ px: 1, py: 0.5, bgcolor: 'rgba(0,0,0,0.15)', borderRadius: '8px', display: 'inline-block' }}>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', fontStyle: 'italic' }}>{sentence.verb}</Typography>
                      </Box>
                      <TextField
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                        placeholder="past tense"
                        variant="outlined"
                        size="small"
                        disabled={submitted}
                        sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem' } }}
                      />
                      <Typography variant="h6">{sentence.afterVerb}</Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Original: {sentence.beforeVerb} <strong>{sentence.verb}</strong> {sentence.afterVerb}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  sx={{
                    ...cardSx('green'), cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.5 : 1,
                    px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem', color: P.green.border, transition: 'all 0.2s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                  }}
                >
                  Submit All Answers
                </Box>
                {!allAnswered && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: P.red.border }}>
                    Please answer all 6 verbs before submitting
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Results */}
              <Box sx={{ ...cardSx('teal'), mb: 3, textAlign: 'center', p: 5 }}>
                <AccessTimeIcon sx={{ fontSize: 72, mb: 2, color: P.teal.border }} />
                <Typography variant="h3" gutterBottom fontWeight="bold">Time Travel Complete! 🎉</Typography>
                <Box sx={{ ...cardSx('yellow'), maxWidth: 280, mx: 'auto', my: 3 }}>
                  <Typography variant="h2" fontWeight="bold">{results.score} / 6</Typography>
                  <Typography variant="h6" color="text.secondary">Bonus Points Earned</Typography>
                </Box>
              </Box>

              <Box sx={{ ...cardSx('blue'), mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">Detailed Feedback</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {results.feedback.map((item, index) => (
                    <Box
                      key={item.id}
                      sx={{
                        bgcolor: item.isCorrect ? P.green.bg : P.red.bg,
                        border: `2px solid ${item.isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '16px', p: 3,
                        boxShadow: `3px 3px 0 ${item.isCorrect ? P.green.shadow : P.red.shadow}`,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Sentence {index + 1}</Typography>
                        {item.isCorrect ? <CheckCircleIcon sx={{ color: P.green.border }} /> : <CancelIcon sx={{ color: P.red.border }} />}
                      </Stack>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Typography variant="body1">{item.beforeVerb}</Typography>
                        <Box sx={{ px: 2, py: 0.5, bgcolor: item.isCorrect ? P.green.border : P.red.border, borderRadius: '8px' }}>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>{item.studentAnswer || '(empty)'}</Typography>
                        </Box>
                        <Typography variant="body1">{item.afterVerb}</Typography>
                      </Box>
                      {!item.isCorrect && (
                        <Box sx={{ ...cardSx('red'), p: 2, mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Correct Answer:</strong> {item.correctAnswer}<br />
                            <Typography component="span" variant="caption">
                              Full sentence: {item.beforeVerb} <strong>{item.correctAnswer}</strong> {item.afterVerb}
                            </Typography>
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="button"
                  onClick={() => navigate('/phase4/step/2/remedial/b1/taskF')}
                  sx={{
                    ...cardSx('orange'), cursor: 'pointer', px: 6, py: 2,
                    fontWeight: 'bold', fontSize: '1.1rem', color: P.orange.border, transition: 'all 0.2s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
                  }}
                >
                  Continue to Task F (Bonus) →
                </Box>
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
