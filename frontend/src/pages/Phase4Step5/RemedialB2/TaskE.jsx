import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial B2 - Task E: Conditional Challenge
 * Complete 6 conditional sentences using second conditional form
 * Score: +1 for each correct conditional (6 total)
 */

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

const CONDITIONAL_PROMPTS = [
  { id: 1, prompt: 'If gatefold _____ (use), poster would have more space.', correctAnswer: 'were used', alternatives: ['was used', 'is used'], explanation: 'Second conditional requires past subjunctive form' },
  { id: 2, prompt: 'Animation _____ (engage) viewers if dynamic.', correctAnswer: 'would engage', alternatives: ['will engage', 'engages'], explanation: 'Second conditional requires "would + base verb"' },
  { id: 3, prompt: 'Jingle _____ (be) memorable if catchy.', correctAnswer: 'would be memorable', alternatives: ['is memorable', 'will be memorable'], explanation: 'Second conditional requires "would + be"' },
  { id: 4, prompt: 'Dramatisation _____ (captivate) if scripted well.', correctAnswer: 'would captivate', alternatives: ['captivates', 'will captivate'], explanation: 'Second conditional requires "would + base verb"' },
  { id: 5, prompt: 'Sketch _____ (help) planning if detailed.', correctAnswer: 'would help', alternatives: ['helps', 'will help'], explanation: 'Second conditional requires "would + base verb"' },
  { id: 6, prompt: 'Clip _____ (show) key moments if short.', correctAnswer: 'would show', alternatives: ['shows', 'will show'], explanation: 'Second conditional requires "would + base verb"' },
]

export default function Phase4Step5RemedialB2TaskE() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 5, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))

  const checkAnswer = (id) => {
    const userAnswer = answers[id]?.toLowerCase().trim()
    const prompt = CONDITIONAL_PROMPTS.find(p => p.id === id)
    return userAnswer === prompt.correctAnswer.toLowerCase() || prompt.alternatives.some(alt => userAnswer === alt.toLowerCase())
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []
    CONDITIONAL_PROMPTS.forEach(prompt => {
      const isCorrect = checkAnswer(prompt.id)
      if (isCorrect) correctCount++
      evaluationResults.push({ id: prompt.id, prompt: prompt.prompt, userAnswer: answers[prompt.id] || '', correctAnswer: prompt.correctAnswer, isCorrect, explanation: prompt.explanation })
    })
    setResults(evaluationResults); setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_b2_taskE_score', correctCount)
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: correctCount })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'E', score: correctCount, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/b2/taskF')
  const allFilled = CONDITIONAL_PROMPTS.every(p => answers[p.id] && answers[p.id].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task E: Conditional Challenge 🎯</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Complete 6 conditional sentences using second conditional form!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Time for the Conditional Challenge! 🎯 Complete each sentence using the second conditional (hypothetical situations). Use the verb provided in parentheses and conjugate it correctly for second conditional form." />
          </Box>

          {!submitted ? (
            <Box>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {CONDITIONAL_PROMPTS.map((prompt, index) => (
                  <Box key={prompt.id} sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.purple.shadow}`, p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: P.purple.border, mb: 0.5 }}>Sentence {index + 1}</Typography>
                    <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 2 }}>{prompt.prompt}</Typography>
                    <TextField fullWidth label="Fill in the blank" value={answers[prompt.id] || ''} onChange={(e) => handleAnswerChange(prompt.id, e.target.value)} placeholder="Type your answer here (e.g., were used, would engage, would be memorable)..." variant="outlined" helperText="Use second conditional form" />
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="center">
                <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                  sx={{ bgcolor: allFilled ? P.green.bg : P.yellow.bg, border: `2px solid ${allFilled ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${allFilled ? P.green.shadow : P.yellow.shadow}`, px: 5, py: 1.5, cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: allFilled ? P.green.shadow : P.yellow.shadow, opacity: allFilled ? 1 : 0.6, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {} }}>
                  {allFilled ? 'Submit Conditional Challenge 🎯' : 'Fill All Sentences First'}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score >= 5 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                  {score === 6 ? '🎯 Perfect Conditionals! 🎯' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
                </Typography>
                <Typography variant="h6" sx={{ color: score >= 5 ? P.green.border : P.yellow.border, mt: 1 }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={result.id} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`, p: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>Sentence {index + 1}:</Typography>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>
                        {result.prompt.replace('_____', `[${result.userAnswer || '?'}]`)}
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>✓ Correct answer: {result.correctAnswer}</Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>{result.explanation}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                  Continue to Task F →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
