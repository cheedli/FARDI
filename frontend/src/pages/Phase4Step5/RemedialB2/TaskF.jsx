import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial B2 - Task F: Grammar Role-Quest
 * Complete 6 lines with passive voice
 * Score: +1 for each correct passive (6 total)
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

const PASSIVE_SENTENCES = [
  { id: 1, sentence: 'Poster _____ (design) with gatefold.', correctAnswer: 'is designed', alternatives: ['was designed'] },
  { id: 2, sentence: 'Animation _____ (use) for video.', correctAnswer: 'is used', alternatives: ['was used'] },
  { id: 3, sentence: 'Jingle _____ (add) for music.', correctAnswer: 'is added', alternatives: ['was added'] },
  { id: 4, sentence: 'Dramatisation _____ (employ) for story.', correctAnswer: 'is employed', alternatives: ['is used', 'was employed'] },
  { id: 5, sentence: 'Sketch _____ (draw) for plan.', correctAnswer: 'is drawn', alternatives: ['was drawn'] },
  { id: 6, sentence: 'Clip _____ (include) for segment.', correctAnswer: 'is included', alternatives: ['was included'] },
]

export default function Phase4Step5RemedialB2TaskF() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 6, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))

  const checkAnswer = (id) => {
    const userAnswer = answers[id]?.toLowerCase().trim()
    const sentence = PASSIVE_SENTENCES.find(s => s.id === id)
    return userAnswer === sentence.correctAnswer.toLowerCase() || sentence.alternatives.some(alt => userAnswer === alt.toLowerCase())
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []
    PASSIVE_SENTENCES.forEach(sentence => {
      const isCorrect = checkAnswer(sentence.id)
      if (isCorrect) correctCount++
      evaluationResults.push({ id: sentence.id, sentence: sentence.sentence, userAnswer: answers[sentence.id] || '', correctAnswer: sentence.correctAnswer, isCorrect })
    })
    setResults(evaluationResults); setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_b2_taskF_score', correctCount)
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: correctCount })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'F', score: correctCount, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/b2/results')
  const allFilled = PASSIVE_SENTENCES.every(s => answers[s.id] && answers[s.id].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task F: Grammar Role-Quest 🎭</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Complete 6 sentences using passive voice!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Final task! Welcome to the Grammar Role-Quest! 🎭 Complete each sentence using the passive voice. Use the verb provided in parentheses and conjugate it correctly for passive voice." />
          </Box>

          {!submitted ? (
            <Box>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {PASSIVE_SENTENCES.map((sentence, index) => (
                  <Box key={sentence.id} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: P.teal.border, mb: 0.5 }}>Sentence {index + 1}</Typography>
                    <Typography variant="h6" sx={{ color: P.teal.shadow, mb: 2 }}>{sentence.sentence}</Typography>
                    <TextField fullWidth label="Fill in the blank (passive voice)" value={answers[sentence.id] || ''} onChange={(e) => handleAnswerChange(sentence.id, e.target.value)} placeholder="Type your answer here (e.g., is designed, is used, is added)..." variant="outlined" helperText="Use passive voice form" />
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="center">
                <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                  sx={{ bgcolor: allFilled ? P.green.bg : P.yellow.bg, border: `2px solid ${allFilled ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${allFilled ? P.green.shadow : P.yellow.shadow}`, px: 5, py: 1.5, cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: allFilled ? P.green.shadow : P.yellow.shadow, opacity: allFilled ? 1 : 0.6, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {} }}>
                  {allFilled ? 'Submit Grammar Role-Quest 🎭' : 'Fill All Sentences First'}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score >= 5 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                  {score === 6 ? '🎭 Perfect Passive Voice! 🎭' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
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
                        {result.sentence.replace('_____', `[${result.userAnswer || '?'}]`)}
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>✓ Correct answer: {result.correctAnswer}</Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                  View Final Results →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
