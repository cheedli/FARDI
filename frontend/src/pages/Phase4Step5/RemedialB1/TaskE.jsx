import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial B1 - Task E: Tense Time Travel
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

const SENTENCES = [
  { id: 1, faulty: 'Poster have gatefold yesterday.', blank: 'Poster _____ gatefold yesterday.', correct: 'had', hint: 'Change "have" to past tense' },
  { id: 2, faulty: 'Video use animation last week.', blank: 'Video _____ animation last week.', correct: 'used', hint: 'Change "use" to past tense' },
  { id: 3, faulty: 'Slogan was catchy.', blank: 'Slogan _____ catchy.', correct: 'is', hint: 'Change to present tense for general truth' },
  { id: 4, faulty: 'Clip show dancing.', blank: 'Clip _____ dancing.', correct: 'showed', hint: 'Change "show" to past tense' },
  { id: 5, faulty: 'Jingle play music.', blank: 'Jingle _____ music.', correct: 'played', hint: 'Change "play" to past tense' },
  { id: 6, faulty: 'Dramatisation tell story.', blank: 'Dramatisation _____ story.', correct: 'told', hint: 'Change "tell" to past tense' },
]

export default function Phase4Step5RemedialB1TaskE() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 5, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))
  const checkAnswer = (id) => answers[id]?.toLowerCase().trim() === SENTENCES.find(s => s.id === id).correct.toLowerCase()

  const handleSubmit = async () => {
    let correctCount = 0
    SENTENCES.forEach(s => { if (checkAnswer(s.id)) correctCount++ })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_b1_taskE_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B1', task: 'E', score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/b1/taskF')
  const allFilled = SENTENCES.every(s => answers[s.id] && answers[s.id].trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B1 - Task E: Tense Time Travel ⏰</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Travel through time! Correct tense and coherence in 6 sentences.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Time to travel through tenses! ⏰ For each sentence, fill in the blank with the correct verb tense. Pay attention to time indicators like 'yesterday', 'last week', or present truths. Fix verb tenses to make the sentences coherent!" />
          </Box>

          {!submitted ? (
            <Box>
              <Stack spacing={3}>
                {SENTENCES.map((sentence) => (
                  <Box key={sentence.id} sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: P.yellow.shadow }}>Sentence {sentence.id}</Typography>
                      <Box sx={{ bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '6px', px: 1, py: 0.25 }}>
                        <Typography variant="caption" sx={{ color: P.red.border, fontWeight: 'bold' }}>Faulty</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body1" sx={{ color: P.red.border, mb: 2, fontStyle: 'italic' }}>❌ {sentence.faulty}</Typography>
                    <Typography variant="h6" sx={{ color: P.yellow.shadow, mb: 2 }}>{sentence.blank}</Typography>
                    <TextField fullWidth label="Type the correct verb tense" value={answers[sentence.id] || ''} onChange={(e) => handleAnswerChange(sentence.id, e.target.value)} placeholder="Enter correct verb form..." variant="outlined" helperText={sentence.hint} />
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ bgcolor: allFilled ? P.green.bg : P.yellow.bg, border: `2px solid ${allFilled ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${allFilled ? P.green.shadow : P.yellow.shadow}`, px: 4, py: 1.5, cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: allFilled ? P.green.shadow : P.yellow.shadow, opacity: allFilled ? 1 : 0.6 }}>
                  {allFilled ? 'Submit Time Travel ⏰' : 'Fill All Sentences First'}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '⏰ Perfect Time Travel! ⏰' : '🌟 Time Travel Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {SENTENCES.map((sentence) => {
                    const isCorrect = checkAnswer(sentence.id)
                    return (
                      <Box key={sentence.id} sx={{ bgcolor: isCorrect ? P.green.bg : P.yellow.bg, border: `2px solid ${isCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.yellow.shadow }}>Sentence {sentence.id}:</Typography>
                        <Typography variant="body2" sx={{ color: P.red.border, mb: 0.5 }}>❌ Faulty: {sentence.faulty}</Typography>
                        <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.yellow.shadow }}>Your answer: {sentence.blank.replace('_____', '[' + (answers[sentence.id] || '?') + ']')}</Typography>
                        {!isCorrect && <Typography variant="body2" sx={{ mt: 0.5, color: P.green.shadow, fontWeight: 'bold' }}>✓ Correct: {sentence.blank.replace('_____', sentence.correct)}</Typography>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task F →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
