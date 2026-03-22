import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, TextField, LinearProgress, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ExploreIcon from '@mui/icons-material/Explore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

/**
 * Phase 4 Step 3 - Remedial B2 - Task B: Explain Expedition
 * Write 8 explanations with video references
 * Score: 8 pts
 */

const QUESTIONS = [
  { id: 1, term: 'Promotional', question: 'Explain the promotional purpose of advertising.', guidedPrompt: 'Think about: What is the main goal? How does it relate to selling? What did Video 1 say?', expectedConcepts: ['sell', 'promote', 'video 1', 'advertising'] },
  { id: 2, term: 'Persuasive Techniques', question: 'Explain persuasive techniques in advertising.', guidedPrompt: 'Think about: What are the three appeals? How do they work? What examples did Video 1 show?', expectedConcepts: ['ethos', 'pathos', 'logos', 'convince', 'video 1'] },
  { id: 3, term: 'Targeted Audience', question: 'Explain what targeted audience means in advertising.', guidedPrompt: 'Think about: Who is the audience? Why focus on specific groups? What did Video 1 advise?', expectedConcepts: ['specific', 'group', 'audience', 'video 1'] },
  { id: 4, term: 'Original and Creative', question: 'Explain why ads should be original and creative.', guidedPrompt: 'Think about: What makes ads memorable? Why is creativity important? What did Video 1 highlight?', expectedConcepts: ['memorable', 'creative', 'original', 'video 1'] },
  { id: 5, term: 'Consistent Message', question: 'Explain why consistent messaging is important in advertising.', guidedPrompt: 'Think about: What does consistent mean? Why keep the same style? What did Video 1 recommend?', expectedConcepts: ['consistent', 'same', 'style', 'video 1'] },
  { id: 6, term: 'Personalized Ads', question: 'Explain what personalized advertising means.', guidedPrompt: 'Think about: How are ads customized? Who are they for? What did Video 1 explain?', expectedConcepts: ['personalized', 'individual', 'customize', 'video 1'] },
  { id: 7, term: 'Ethical Advertising', question: 'Explain why ethical advertising is important.', guidedPrompt: 'Think about: What makes advertising ethical? Why does it matter? What did Video 1 stress?', expectedConcepts: ['honest', 'fair', 'ethical', 'video 1'] },
  { id: 8, term: 'Dramatisation', question: 'Explain dramatisation in advertising.', guidedPrompt: 'Think about: What is dramatisation? How does it use story elements? What did Video 2 show?', expectedConcepts: ['story', 'goal', 'obstacle', 'video 2', 'character'] }
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))
  const handleNext = () => { if (currentQuestionIndex < QUESTIONS.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1) }
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1) }

  const evaluateAnswers = async () => {
    setEvaluating(true)
    try {
      const response = await fetch('/api/phase4/step3/remedial/b2/evaluate-explanations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ explanations: QUESTIONS.map(q => ({ term: q.term, question: q.question, answer: answers[q.id] || '', expectedConcepts: q.expectedConcepts })) })
      })
      const data = await response.json()
      if (data.success) {
        setResults(data.results)
        setSubmitted(true)
        sessionStorage.setItem('remedial_step3_b2_taskB_score', data.total_score)
        await logTaskCompletion(data.total_score)
      } else { alert('Failed to evaluate answers. Please try again.') }
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('An error occurred during evaluation. Please try again.')
    } finally { setEvaluating(false) }
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'B', step: 2, score, max_score: 8, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] && answers[q.id].trim().length >= 10)
  const getTotalScore = () => !results ? 0 : results.filter(r => r.score === 1).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom>Level B2 - Task B: Explain Expedition 🗺️</Typography>
            <Typography variant="body1">Write detailed explanations with video references. Depth discovers new levels!</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Explain Expedition! 🗺️ Write detailed explanations for 8 advertising concepts. Each explanation should reference the videos (Video 1 or Video 2) and show B2-level depth. The more detailed and well-referenced your explanations, the deeper you explore! Aim for at least 2-3 sentences per question." />
          </Box>

          {!submitted ? (
            <Box>
              {/* Progress */}
              <Box sx={{ ...cardSx('orange'), mb: 3, p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</Typography>
                  <Typography variant="body2">{Object.keys(answers).filter(id => answers[id]?.trim().length >= 30).length} / {QUESTIONS.length} completed</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={(currentQuestionIndex + 1) / QUESTIONS.length * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 4 } }} />
              </Box>

              {/* Current Question */}
              <Box sx={{ ...cardSx('blue'), mb: 3, minHeight: 400 }}>
                <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Box sx={{ bgcolor: P.orange.border, borderRadius: '12px', px: 2, py: 0.5 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>Question {currentQuestionIndex + 1}</Typography>
                  </Box>
                  <ExploreIcon sx={{ color: P.orange.border, fontSize: 28 }} />
                </Stack>

                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>{QUESTIONS[currentQuestionIndex].term}</Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>{QUESTIONS[currentQuestionIndex].question}</Typography>

                <Box sx={{ ...cardSx('teal'), mb: 3, p: 2 }}>
                  <Typography variant="body2" fontWeight={500}>💡 {QUESTIONS[currentQuestionIndex].guidedPrompt}</Typography>
                </Box>

                <TextField
                  fullWidth multiline rows={6}
                  value={answers[QUESTIONS[currentQuestionIndex].id] || ''}
                  onChange={(e) => handleAnswerChange(QUESTIONS[currentQuestionIndex].id, e.target.value)}
                  placeholder="Write your detailed explanation here... (Include video references and specific concepts)"
                  variant="outlined" disabled={submitted}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: P.blue.border, borderWidth: 2 } } }}
                />
                <Typography variant="body2" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  {answers[QUESTIONS[currentQuestionIndex].id]?.length || 0} characters • Minimum 30 characters (aim for 100+ for full detail)
                </Typography>
              </Box>

              {/* Navigation */}
              <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 2 }}>
                <Box component="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}
                  sx={{
                    ...cardSx('blue'), cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentQuestionIndex === 0 ? 0.4 : 1,
                    px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.blue.border, transition: 'all 0.2s',
                    '&:hover': currentQuestionIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
                  }}
                >
                  ← Previous
                </Box>

                {currentQuestionIndex < QUESTIONS.length - 1 ? (
                  <Box component="button" onClick={handleNext}
                    sx={{
                      ...cardSx('orange'), cursor: 'pointer',
                      px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
                    }}
                  >
                    Next →
                  </Box>
                ) : (
                  <Box component="button" onClick={evaluateAnswers} disabled={!allAnswered || evaluating}
                    sx={{
                      ...cardSx('green'), cursor: (!allAnswered || evaluating) ? 'not-allowed' : 'pointer',
                      opacity: (!allAnswered || evaluating) ? 0.5 : 1,
                      px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 1,
                      '&:hover': (allAnswered && !evaluating) ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {}
                    }}
                  >
                    {evaluating ? <><CircularProgress size={16} sx={{ color: P.green.border }} /> Evaluating...</> : <><AutoAwesomeIcon fontSize="small" /> {allAnswered ? 'Submit All 🗺️' : 'Complete All First'}</>}
                  </Box>
                )}
              </Stack>

              {currentQuestionIndex === QUESTIONS.length - 1 && !allAnswered && (
                <Box sx={{ ...cardSx('yellow'), p: 2 }}>
                  <Typography variant="body2" fontWeight={500}>⚠️ Please write at least 30 characters for each explanation before submitting. Use the Previous button to review earlier questions.</Typography>
                </Box>
              )}

              {evaluating && (
                <Box sx={{ ...cardSx('blue'), mt: 3, textAlign: 'center' }}>
                  <LinearProgress sx={{ borderRadius: 1, height: 8, mb: 2, '& .MuiLinearProgress-bar': { bgcolor: P.blue.border } }} />
                  <Typography variant="body1" fontWeight={500}>AI is evaluating your explanations for depth, detail, and video references...</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              {/* Results */}
              <Box sx={{ ...cardSx('orange'), mb: 3, textAlign: 'center', p: 5 }}>
                <ExploreIcon sx={{ fontSize: 80, mb: 2, color: P.orange.border }} />
                <Typography variant="h3" gutterBottom fontWeight="bold">
                  {getTotalScore() === 8 ? '🗺️ Complete Expedition! 🗺️' : '🌟 Expedition Complete! 🌟'}
                </Typography>
                <Box sx={{ ...cardSx('yellow'), maxWidth: 300, mx: 'auto', my: 3 }}>
                  <Typography variant="h2" fontWeight="bold" sx={{ color: P.orange.border }}>{getTotalScore()} / 8</Typography>
                  <Typography variant="h6" color="text.secondary">Points Earned</Typography>
                </Box>
                <Typography variant="body1">
                  {getTotalScore() === 8 && '🏆 Perfect! You explored every depth with detailed, well-referenced explanations!'}
                  {getTotalScore() >= 6 && getTotalScore() < 8 && '🌟 Great expedition! You showed strong B2-level explanations.'}
                  {getTotalScore() < 6 && '💪 Good effort! Review the feedback to improve depth and video references.'}
                </Typography>
              </Box>

              {/* Detailed Feedback */}
              <Box sx={{ ...cardSx('blue'), mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">AI Evaluation Results</Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  {results && results.map((result, index) => (
                    <Box key={index} sx={{
                      bgcolor: result.score === 1 ? P.green.bg : P.red.bg,
                      border: `2px solid ${result.score === 1 ? P.green.border : P.red.border}`,
                      borderRadius: '16px', p: 3,
                      boxShadow: `3px 3px 0 ${result.score === 1 ? P.green.shadow : P.red.shadow}`,
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Question {index + 1}: {result.term}</Typography>
                        {result.score === 1 ? <CheckCircleIcon sx={{ color: P.green.border }} /> : <CancelIcon sx={{ color: P.red.border }} />}
                      </Stack>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Your explanation:</Typography>
                      <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '12px', p: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{answers[QUESTIONS[index].id]}"</Typography>
                      </Box>
                      <Box sx={{ bgcolor: result.score === 1 ? P.green.bg : P.yellow.bg, border: `1px solid ${result.score === 1 ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight={500}><strong>AI Feedback:</strong> {result.feedback}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Box component="button" onClick={() => navigate('/phase4/step3/remedial/b2/taskC')}
                  sx={{
                    ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                    fontSize: '1.1rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                  }}
                >
                  Continue to Task C: Kahoot Match →
                </Box>
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
