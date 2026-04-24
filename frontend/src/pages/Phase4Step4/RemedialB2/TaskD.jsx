import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Task D: Error Correction Game
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

const ERROR_SENTENCES = [
  {
    id: 1,
    parts: [
      { text: 'Promotional advertising', error: false },
      { text: 'are', error: true, correct: 'is' },
      { text: 'to sell but it', error: false },
      { text: 'lack', error: true, correct: 'lacks' },
      { text: 'persuasive.', error: false }
    ],
    fullCorrect: 'Promotional advertising is to sell but it lacks persuasive.',
    hints: ['subject-verb agreement: are → is', 'singular verb: lack → lacks']
  },
  {
    id: 2,
    parts: [
      { text: 'The gatefold which', error: false },
      { text: 'provide', error: true, correct: 'provides' },
      { text: 'space in posters', error: false },
      { text: 'are', error: true, correct: 'is highly' },
      { text: 'effective.', error: false }
    ],
    fullCorrect: 'The gatefold which provides space in posters is highly effective.',
    hints: ['provides (singular)', 'is highly (singular verb)']
  },
  {
    id: 3,
    parts: [
      { text: 'Dramatisation in video 2', error: false },
      { text: 'were', error: true, correct: 'was' },
      { text: 'used to engage but it', error: false },
      { text: 'feel', error: true, correct: 'felt' },
      { text: 'contrived.', error: false }
    ],
    fullCorrect: 'Dramatisation in video 2 was used to engage but it felt contrived.',
    hints: ['singular verb: were → was', 'past tense: feel → felt']
  },
  {
    id: 4,
    parts: [
      { text: 'Persuasive appeals which', error: false },
      { text: 'is', error: true, correct: 'are' },
      { text: 'based on ethos pathos logos', error: false },
      { text: 'is', error: true, correct: 'are' },
      { text: 'powerful.', error: false }
    ],
    fullCorrect: 'Persuasive appeals which are based on ethos pathos logos are powerful.',
    hints: ['plural verb: is → are (first)', 'plural verb: is → are (second)']
  },
  {
    id: 5,
    parts: [
      { text: 'Targeted ads', error: false },
      { text: 'has', error: true, correct: 'have' },
      { text: 'become more precise but raise ethical', error: false },
      { text: 'issue', error: true, correct: 'issues' },
      { text: '.', error: false }
    ],
    fullCorrect: 'Targeted ads have become more precise but raise ethical issues.',
    hints: ['have (plural)', 'issues (plural)']
  },
  {
    id: 6,
    parts: [
      { text: 'Creative execution', error: false },
      { text: 'stand', error: true, correct: 'stands' },
      { text: 'out but', error: false },
      { text: 'need', error: true, correct: 'needs' },
      { text: 'consistent with brand.', error: false }
    ],
    fullCorrect: 'Creative execution stands out but needs consistent with brand.',
    hints: ['singular verb: stand → stands', 'singular verb: need → needs']
  }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [corrections, setCorrections] = useState(ERROR_SENTENCES.map(s => s.parts.filter(p => p.error).map(() => '')))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentSentence = ERROR_SENTENCES[currentIndex]
  const handleCorrectionChange = (errorIndex, value) => { const n = [...corrections]; n[currentIndex][errorIndex] = value; setCorrections(n) }
  const handleNext = () => { if (currentIndex < ERROR_SENTENCES.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkCorrection = (userCorrections, sentence) => {
    const errors = sentence.parts.filter(p => p.error)
    let correctCount = 0
    userCorrections.forEach((userAnswer, idx) => {
      const correct = errors[idx].correct.toLowerCase().trim()
      const user = userAnswer.toLowerCase().trim()
      if (user === correct || (correct.includes(user) && user.length >= correct.length * 0.7)) correctCount++
    })
    return correctCount === errors.length
  }

  const handleSubmit = async () => {
    const checkResults = corrections.map((userCorrections, index) => ({
      isCorrect: checkCorrection(userCorrections, ERROR_SENTENCES[index]),
      userCorrections,
      sentence: ERROR_SENTENCES[index]
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b2_taskD_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'D', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b2/results')
  window.__remedialSkip = handleContinue
  const allFilled = corrections[currentIndex].every(c => c.trim().length > 0)
  const allComplete = corrections.every(c => c.every(a => a.trim().length > 0))
  const progress = ((currentIndex + 1) / ERROR_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task D: Correction Crusade 🔧</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Replace the crossed-out errors with correct words!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Time to become an error detective! You'll see sentences with errors crossed out. Write the correct word or phrase in the blank space next to each error. Pay attention to subject-verb agreement, verb tense, and missing words!" />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Sentence {currentIndex + 1} of {ERROR_SENTENCES.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 4, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.red.shadow, mb: 2 }}>Correct the errors:</Typography>

                <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                    {currentSentence.parts.map((part, partIndex) => {
                      if (!part.error) {
                        return (
                          <Typography key={partIndex} variant="h6" component="span" sx={{ color: P.yellow.shadow }}>{part.text}{' '}</Typography>
                        )
                      } else {
                        const errorIndex = currentSentence.parts.slice(0, partIndex).filter(p => p.error).length
                        return (
                          <Box key={partIndex} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" component="span" sx={{ textDecoration: 'line-through', color: P.red.border, fontWeight: 'bold' }}>{part.text}</Typography>
                            <TextField size="small" value={corrections[currentIndex][errorIndex] || ''} onChange={(e) => handleCorrectionChange(errorIndex, e.target.value)} placeholder="..." variant="outlined" sx={{ minWidth: '120px', '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }} />
                          </Box>
                        )
                      }
                    })}
                  </Box>
                </Box>

                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.teal.shadow }}>💡 Hints:</Typography>
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {currentSentence.hints.map((hint, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: P.teal.border }}>• {hint}</Typography>
                    ))}
                  </Stack>
                </Box>

                <Stack direction="row" justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < ERROR_SENTENCES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!allFilled} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: allFilled ? 1 : 0.4 }}>Next Sentence →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!allComplete} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1, cursor: allComplete ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.green.shadow, opacity: allComplete ? 1 : 0.5 }}>Submit Corrections 🔧</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to sentence:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {ERROR_SENTENCES.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 36, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem' }}>
                      {idx + 1} {corrections[idx].every(c => c.trim()) && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '🔧 Perfect Corrections! 🔧' : '🌟 Crusade Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Correction Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => {
                    const sentence = result.sentence
                    const errors = sentence.parts.filter(p => p.error)
                    return (
                      <Box key={index} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.yellow.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Sentence {index + 1}</Typography>
                        {errors.map((error, errIdx) => (
                          <Box key={errIdx} sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>
                              Error: <span style={{ textDecoration: 'line-through', color: P.red.border }}>{error.text}</span> → Your answer: <strong>{result.userCorrections[errIdx] || '(empty)'}</strong>
                            </Typography>
                            {result.userCorrections[errIdx].toLowerCase().trim() !== error.correct.toLowerCase().trim() && (
                              <Typography variant="body2" sx={{ color: P.green.shadow }}>Correct: <strong>{error.correct}</strong></Typography>
                            )}
                          </Box>
                        ))}
                        <Box sx={{ mt: 1 }}>
                          {sentence.hints.map((hint, idx) => (
                            <Typography key={idx} variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow, display: 'block' }}>• {hint}</Typography>
                          ))}
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>View Final Results →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
