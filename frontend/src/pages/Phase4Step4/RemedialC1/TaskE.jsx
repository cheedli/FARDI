import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial C1 - Task E: Clause Conquest
 * Rewrite 6 faulty complex sentences correctly
 * Score: +1 for each correctly rewritten sentence (6 total)
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

const COMPLEX_SENTENCES = [
  {
    id: 1,
    faulty: 'Promotional advertising which is primarily designed to drive sales was shown in video 1 to be most effective when it is supported by persuasive techniques.',
    correctAnswer: 'Promotional advertising, which is primarily designed to drive sales, has been shown in video 1 to be most effective when supported by persuasive techniques.',
    keyElements: ['which is primarily designed', 'has been shown', 'when supported by'],
    errorType: 'Comma punctuation + tense + unnecessary wording'
  },
  {
    id: 2,
    faulty: 'The gatefold layout, which are used to unfold narrative depth in posters would be enhanced if it was combined with targeted imagery.',
    correctAnswer: 'The gatefold layout, which is used to unfold narrative depth in posters, would be enhanced if it were combined with targeted imagery.',
    keyElements: ['which is used', 'would be enhanced', 'if it were combined'],
    errorType: 'Relative clause agreement + punctuation + conditional form'
  },
  {
    id: 3,
    faulty: 'Dramatisation, by which emotional stories are conveyed by relatable characters, are employed in video 2 to overcome viewer indifference.',
    correctAnswer: 'Dramatisation, by which emotional stories are conveyed through relatable characters, is employed in video 2 to overcome viewer indifference.',
    keyElements: ['by which', 'are conveyed', 'is employed'],
    errorType: 'Collocation/preposition + subject–verb agreement'
  },
  {
    id: 4,
    faulty: 'Persuasive appeals, which are rooted in ethos, pathos, and logos, have integrated seamlessly in the commercials analyzed video 1.',
    correctAnswer: 'Persuasive appeals, which are rooted in ethos, pathos, and logos, have been integrated seamlessly in the commercials analyzed in video 1.',
    keyElements: ['which are rooted', 'have been integrated', 'analyzed in video 1'],
    errorType: 'Present perfect passive + missing preposition'
  },
  {
    id: 5,
    faulty: 'Consistent branding, which is maintained across platforms, would be undermined if ethical considerations were ignored.',
    correctAnswer: 'Consistent branding, which is maintained across platforms, would have been undermined if ethical considerations had been ignored.',
    keyElements: ['which is maintained', 'would have been undermined', 'had been ignored'],
    errorType: 'Conditional perfect structure (tense consistency)'
  },
  {
    id: 6,
    faulty: 'Creative execution which distinguishes memorable advertisements, recommended in video 1 a way reduce audience friction.',
    correctAnswer: 'Creative execution, which distinguishes memorable advertisements, is recommended in video 1 as a way to reduce audience friction.',
    keyElements: ['which distinguishes', 'is recommended', 'as a way to reduce'],
    errorType: 'Comma punctuation + passive voice + missing connectors'
  }
]

export default function Phase4Step5RemedialC1TaskE() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 5, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    const initial = {}
    for (const s of COMPLEX_SENTENCES) initial[s.id] = s.faulty
    setAnswers(initial)
  }, [])

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []

    for (const sentence of COMPLEX_SENTENCES) {
      const userAnswer = answers[sentence.id] || ''
      const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/["""]/g, '"').trim()
      const isCorrect = normalize(userAnswer) === normalize(sentence.correctAnswer)
      if (isCorrect) correctCount++
      evaluationResults.push({ id: sentence.id, faulty: sentence.faulty, userAnswer, correctAnswer: sentence.correctAnswer, isCorrect, errorType: sentence.errorType })
    }

    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_c1_taskE_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'E', score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/c1/taskF')
  window.__remedialSkip = handleContinue
  const allFilled = COMPLEX_SENTENCES.every(s => answers[s.id] && answers[s.id].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 4: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task E: Clause Conquest 🏆</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Rewrite 6 faulty complex sentences correctly (relative clauses, passives, conditionals, punctuation).</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Clause Conquest 🏆 The sentence is already in the box — your job is to FIX it. Rewrite it into a correct C1-level complex sentence. 1 point per corrected sentence!" />
          </Box>

          {!submitted ? (
            <Box>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {COMPLEX_SENTENCES.map((sentence, index) => (
                  <Box key={sentence.id} sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.purple.shadow}`, p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: P.purple.border, mb: 0.5 }}>Sentence {index + 1}</Typography>
                    <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.blue.shadow}`, p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 0.5 }}>📝 Fix this faulty sentence:</Typography>
                      <Typography variant="body1" sx={{ color: P.blue.border, fontFamily: 'monospace', lineHeight: 1.8 }}>{sentence.faulty}</Typography>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Edit the sentence to correct it"
                      value={answers[sentence.id] || ''}
                      onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                      variant="outlined"
                      helperText="The sentence is pre-filled. Modify it until it is grammatically correct."
                    />
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="center">
                <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                  sx={{ bgcolor: allFilled ? P.green.bg : P.yellow.bg, border: `2px solid ${allFilled ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${allFilled ? P.green.shadow : P.yellow.shadow}`, px: 5, py: 1.5, cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: allFilled ? P.green.shadow : P.yellow.shadow, opacity: allFilled ? 1 : 0.6, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {} }}>
                  {allFilled ? 'Submit Clause Conquest 🏆' : 'Fix All Sentences First'}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score >= 5 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                  {score === 6 ? '🏆 Perfect Clause Mastery! 🏆' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
                </Typography>
                <Typography variant="h6" sx={{ color: score >= 5 ? P.green.border : P.yellow.border, mt: 1 }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={result.id} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.teal.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.teal.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${result.isCorrect ? P.green.shadow : P.teal.shadow}`, p: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.teal.shadow, mb: 0.5 }}>Sentence {index + 1}:</Typography>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.teal.shadow, mb: 0.5, fontFamily: 'monospace' }}>Faulty: {result.faulty}</Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ color: result.isCorrect ? P.green.shadow : P.teal.shadow, mb: 0.5 }}>Your fix: {result.userAnswer || '(no answer)'}</Typography>
                      {result.isCorrect ? (
                        <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow, mt: 0.5 }}>✓ Correct structures</Typography>
                      ) : (
                        <>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.shadow, mt: 0.5 }}>What was wrong: {result.errorType}</Typography>
                          <Typography variant="caption" sx={{ color: P.teal.shadow, display: 'block', mt: 0.5 }}>Expected: {result.correctAnswer}</Typography>
                        </>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task F →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
