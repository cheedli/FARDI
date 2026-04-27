import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 3 - Remedial C1 - Task C: Tense Odyssey
 * Rewrite 6 sentences using mixed tenses and conditionals
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

const TENSE_EXERCISES = [
  { id: 1, original: 'Originality is new', modelAnswer: 'While originality has always been valued in advertising, it would have stood out more if it had been combined with creative execution as video 1 suggests.', hints: ['present perfect: has been valued', 'third conditional: would have stood out... if it had been combined'] },
  { id: 2, original: 'Persuasive uses ethos/pathos/logos', modelAnswer: 'Persuasive techniques, which have been used effectively since early campaigns, would convince audiences more powerfully if pathos were balanced with strong ethos.', hints: ['present perfect: have been used', 'second conditional: would convince... if pathos were balanced'] },
  { id: 3, original: 'Targeted is for specific group', modelAnswer: 'Targeted advertising had already become more precise by the time video 1 was made, and it would increase relevance even further if personalization were applied ethically.', hints: ['past perfect: had become', 'second conditional: would increase... if personalization were applied'] },
  { id: 4, original: 'Consistent is same style', modelAnswer: 'Consistent messaging has proven to build long-term trust, but it would fail if the brand had ignored cultural shifts.', hints: ['present perfect: has proven', 'third conditional: would fail... if had ignored'] },
  { id: 5, original: 'Dramatisation is story', modelAnswer: 'Dramatisation, as video 2 demonstrated, was employed to create emotional engagement, and it would captivate viewers more deeply if obstacles had been more relatable.', hints: ['past simple: was employed', 'third conditional: would captivate... if had been'] },
  { id: 6, original: 'Ethical is honest', modelAnswer: 'Ethical advertising remains essential today, and it would have prevented backlash if brands had avoided exaggeration in the past.', hints: ['present simple: remains', 'third conditional: would have prevented... if had avoided'] },
]

export default function RemedialC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rewrites, setRewrites] = useState(Array(TENSE_EXERCISES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentExercise = TENSE_EXERCISES[currentIndex]
  const handleRewriteChange = (value) => { const n = [...rewrites]; n[currentIndex] = value; setRewrites(n) }
  const handleNext = () => { if (currentIndex < TENSE_EXERCISES.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkRewrite = (userRewrite) => {
    const userLower = userRewrite.toLowerCase().trim()
    const hasPresentPerfect = userLower.includes('has') || userLower.includes('have')
    const hasPastPerfect = userLower.includes('had')
    const hasConditional = userLower.includes('would')
    const wordCount = userRewrite.split(/\s+/).length
    const hasComplexStructure = (hasPresentPerfect || hasPastPerfect) && hasConditional
    return wordCount >= 15 && hasComplexStructure
  }

  const handleSubmit = async () => {
    const checkResults = rewrites.map((rewrite, index) => ({
      isCorrect: checkRewrite(rewrite),
      userRewrite: rewrite,
      modelAnswer: TENSE_EXERCISES[index].modelAnswer
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('remedial_step4_c1_taskC_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'C', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/3/remedial/c1/taskD')
  window.__remedialSkip = handleContinue
  const allFilled = rewrites.every(r => r.trim().length > 0)
  const progress = ((currentIndex + 1) / TENSE_EXERCISES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task C: Tense Odyssey ⏳</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Rewrite simple sentences using mixed tenses and conditionals.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Tense Odyssey! Transform simple sentences into sophisticated ones using perfect tenses (present perfect, past perfect) and conditionals (second/third conditional). Show analytical depth!" />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Sentence {currentIndex + 1} of {TENSE_EXERCISES.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
                <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: P.yellow.shadow }}>Simple sentence:</Typography>
                  <Typography variant="h6" fontWeight="medium" sx={{ color: P.yellow.shadow }}>"{currentExercise.original}"</Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Rewrite using mixed tenses and conditionals:</Typography>
                <TextField fullWidth multiline rows={4} value={rewrites[currentIndex]} onChange={(e) => handleRewriteChange(e.target.value)}
                  placeholder="Rewrite with perfect tenses and conditionals..."
                  helperText={`Word count: ${rewrites[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for at least 20 words)`} />

                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.teal.shadow }}>💡 Grammar hints:</Typography>
                  {currentExercise.hints.map((hint, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: P.teal.border }}>• {hint}</Typography>
                  ))}
                </Box>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < TENSE_EXERCISES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!rewrites[currentIndex].trim()} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: rewrites[currentIndex].trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: rewrites[currentIndex].trim() ? 1 : 0.4 }}>Next Sentence →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1, cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.green.shadow, opacity: allFilled ? 1 : 0.5 }}>Submit Odyssey ⏳</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to sentence:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {TENSE_EXERCISES.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 36, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem' }}>
                      {idx + 1} {rewrites[idx].trim() && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '⏳ Perfect Odyssey! ⏳' : '🌟 Odyssey Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Tense Review:</Typography>
                <Stack spacing={2}>
                  {TENSE_EXERCISES.map((exercise, index) => {
                    const result = results[index]
                    return (
                      <Box key={index} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.yellow.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Original: "{exercise.original}"</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Your rewrite: "{result.userRewrite}"</Typography>
                        {!result.isCorrect && <Typography variant="body2" sx={{ mt: 0.5, color: P.green.shadow }}>Model answer: <strong>{result.modelAnswer}</strong></Typography>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task D →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
