import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial C1 - Task G: Correction Crusade
 * Fix 6 sentences with advanced grammar errors (mixed error types)
 * Score: +1 for each correctly fixed sentence (6 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const CRUSADE_SENTENCES = [
  { id: 1, faulty: 'The committee have decided that each member present their findings individually.', correctAnswer: 'The committee has decided that each member present their findings individually.', errors: ['Subject-verb agreement: "committee" (collective noun) takes singular verb "has"'] },
  { id: 2, faulty: 'Neither the marketing team nor the creative director were aware of the budget constraints.', correctAnswer: 'Neither the marketing team nor the creative director was aware of the budget constraints.', errors: ['Neither...nor agreement: verb agrees with nearest subject "director" (singular = was)'] },
  { id: 3, faulty: 'The data suggests that consumer behaviour patterns has shifted dramatically over the past decade.', correctAnswer: 'The data suggest that consumer behaviour patterns have shifted dramatically over the past decade.', errors: ['Subject-verb agreement: "data" (plural) takes "suggest"; "patterns" takes "have shifted"'] },
  { id: 4, faulty: 'It is imperative that the brand maintains its integrity while adapting to market trends.', correctAnswer: 'It is imperative that the brand maintain its integrity while adapting to market trends.', errors: ['Subjunctive: after "it is imperative that", use base form "maintain" not "maintains"'] },
  { id: 5, faulty: 'The analysis, along with supplementary reports, demonstrate the effectiveness of targeted advertising.', correctAnswer: 'The analysis, along with supplementary reports, demonstrates the effectiveness of targeted advertising.', errors: ['Subject-verb agreement: "along with" does not change subject; "analysis" (singular) takes "demonstrates"'] },
  { id: 6, faulty: 'Had the campaign been launched earlier, it would have generated more significant impact than it actually had.', correctAnswer: 'Had the campaign been launched earlier, it would have generated more significant impact than it actually did.', errors: ['Verb consistency: "had" should be "did" to avoid redundancy with "would have"'] }
]

export default function Phase4Step5RemedialC1TaskG() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 7, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(() => {
    const initial = {}
    CRUSADE_SENTENCES.forEach(s => { initial[s.id] = s.faulty })
    return initial
  })
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []
    const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').replace(/[""]/g, '"').trim()
    for (const sentence of CRUSADE_SENTENCES) {
      const userAnswer = answers[sentence.id] || sentence.faulty
      const isCorrect = normalize(userAnswer) === normalize(sentence.correctAnswer)
      if (isCorrect) correctCount++
      evaluationResults.push({ id: sentence.id, faulty: sentence.faulty, userAnswer, correctAnswer: sentence.correctAnswer, isCorrect, errors: sentence.errors })
    }
    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_c1_taskG_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score })
    try {
      await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'G', score, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allFilled = CRUSADE_SENTENCES.every(s => (answers[s.id] && answers[s.id].trim()) || s.faulty)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border, mb: 1 }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Level C1 - Task G: Correction Crusade ⚔️</Typography>
            <Typography>Fix 6 sentences with advanced mixed grammar errors!</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage
              character="LILIA"
              message="Welcome to the Correction Crusade! ⚔️ You have 6 sentences with advanced grammar errors including subject-verb agreement, subjunctive mood, and more. Your mission: completely rewrite each sentence fixing all errors. Each correctly fixed sentence earns you 1 point!"
            />
          </Box>

          <Box sx={{ ...cardSx('red'), mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: P.red.border, mb: 2 }}>⚔️ What to Fix (C1 Level - Mixed Errors):</Typography>
            <Stack spacing={1}>
              <Typography variant="body2"><strong>Collective Nouns:</strong> committee/team + singular verb (has, is, was)</Typography>
              <Typography variant="body2"><strong>Neither...Nor:</strong> Verb agrees with the nearest subject</Typography>
              <Typography variant="body2"><strong>Data (plural):</strong> data suggest/show (not suggests/shows)</Typography>
              <Typography variant="body2"><strong>Interrupting Phrases:</strong> "along with/as well as" doesn't change subject number</Typography>
              <Typography variant="body2"><strong>Subjunctive:</strong> "it is imperative that" + base form</Typography>
            </Stack>
          </Box>

          {!submitted && (
            <Stack spacing={3} sx={{ mb: 3 }}>
              {CRUSADE_SENTENCES.map((sentence, index) => (
                <Box key={sentence.id} sx={cardSx('teal')}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Sentence {index + 1}</Typography>
                  <TextField
                    fullWidth multiline rows={3}
                    label="Fix the grammar errors"
                    value={answers[sentence.id]}
                    onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                    placeholder="Modify this sentence to fix all grammar errors..."
                    variant="outlined"
                    helperText="Fix all advanced grammar issues for C1 accuracy"
                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.teal.border } } }}
                  />
                </Box>
              ))}
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allFilled}
                sx={{
                  ...cardSx('orange'),
                  cursor: allFilled ? 'pointer' : 'not-allowed',
                  opacity: allFilled ? 1 : 0.6,
                  width: '100%', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                  '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
                }}
              >
                {allFilled ? 'Submit Correction Crusade ⚔️' : 'Fix All Sentences First'}
              </Box>
            </Stack>
          )}

          {submitted && (
            <Stack spacing={3}>
              <Box sx={cardSx(score >= 5 ? 'green' : 'yellow')}>
                <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800, color: score >= 5 ? P.green.border : P.yellow.border }}>
                  {score === 6 ? '⚔️ Perfect Crusade Victory! ⚔️' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 1 }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={cardSx('blue')}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={result.id} sx={{ p: 2, bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>Sentence {index + 1}: {result.isCorrect ? '✅' : '❌'}</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.red.border, mb: 0.5 }}>Faulty: {result.faulty}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Your answer: {result.userAnswer || '(no answer)'}</Typography>
                      {!result.isCorrect && (
                        <>
                          <Typography variant="body2" sx={{ color: P.green.border, fontWeight: 700, mt: 0.5 }}>✓ Expected correction: {result.correctAnswer}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>Error: {result.errors[0]}</Typography>
                        </>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box
                component="button"
                onClick={() => navigate('/phase4/step/5/remedial/c1/results')}
                sx={{ ...cardSx('green'), width: '100%', cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}
              >
                Continue to Results →
              </Box>
            </Stack>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
