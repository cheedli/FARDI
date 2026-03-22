import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial C1 - Task D: Clause Conquest
 * Complete 6 complex sentences with passive/relative clauses
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

const CLAUSE_SENTENCES = [
  { id: 1, parts: [{ text: 'Promotional advertising, which', error: false }, { text: 'primarily/design', error: true, correct: 'is primarily designed' }, { text: 'to drive sales,', error: false }, { text: 'show', error: true, correct: 'has been shown' }, { text: 'in video 1 to be most effective when supported by persuasive techniques.', error: false }] },
  { id: 2, parts: [{ text: 'The gatefold layout, which', error: false }, { text: 'use', error: true, correct: 'is used' }, { text: 'to unfold narrative depth in posters, would be enhanced if it', error: false }, { text: 'combine', error: true, correct: 'were combined' }, { text: 'with targeted imagery.', error: false }] },
  { id: 3, parts: [{ text: 'Dramatisation, by which emotional stories', error: false }, { text: 'convey', error: true, correct: 'are conveyed' }, { text: 'through relatable characters,', error: false }, { text: 'employ', error: true, correct: 'is employed' }, { text: 'in video 2 to overcome viewer indifference.', error: false }] },
  { id: 4, parts: [{ text: 'Persuasive appeals, which', error: false }, { text: 'root', error: true, correct: 'are rooted' }, { text: 'in ethos, pathos, and logos,', error: false }, { text: 'integrate', error: true, correct: 'have been integrated' }, { text: 'seamlessly in the commercials analyzed in video 1.', error: false }] },
  { id: 5, parts: [{ text: 'Consistent branding, which', error: false }, { text: 'maintain', error: true, correct: 'is maintained' }, { text: 'across platforms, would have been undermined if ethical considerations', error: false }, { text: 'ignore', error: true, correct: 'had been ignored' }, { text: '.', error: false }] },
  { id: 6, parts: [{ text: 'Creative execution, which', error: false }, { text: 'distinguish', error: true, correct: 'distinguishes' }, { text: 'memorable advertisements,', error: false }, { text: 'recommend', error: true, correct: 'is recommended' }, { text: 'in video 1 as a way to reduce audience friction.', error: false }] },
]

export default function RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completions, setCompletions] = useState(CLAUSE_SENTENCES.map(s => s.parts.filter(p => p.error).map(() => '')))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentSentence = CLAUSE_SENTENCES[currentIndex]
  const handleCompletionChange = (errorIndex, value) => { const n = [...completions]; n[currentIndex][errorIndex] = value; setCompletions(n) }
  const handleNext = () => { if (currentIndex < CLAUSE_SENTENCES.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkCompletion = (userCompletions, sentence) => {
    const errors = sentence.parts.filter(p => p.error)
    let correctCount = 0
    userCompletions.forEach((userAnswer, idx) => {
      const correct = errors[idx].correct.toLowerCase().trim()
      const user = userAnswer.toLowerCase().trim()
      if (user === correct || (correct.includes(user) && user.length >= correct.length * 0.7)) correctCount++
    })
    return correctCount === errors.length
  }

  const handleSubmit = async () => {
    const checkResults = completions.map((userCompletions, index) => ({
      isCorrect: checkCompletion(userCompletions, CLAUSE_SENTENCES[index]),
      userCompletions,
      sentence: CLAUSE_SENTENCES[index]
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('remedial_step4_c1_taskD_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'D', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/c1/results')
  const allFilled = completions[currentIndex].every(c => c.trim().length > 0)
  const allComplete = completions.every(c => c.every(a => a.trim().length > 0))
  const progress = ((currentIndex + 1) / CLAUSE_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task D: Clause Conquest ⚔️</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Complete complex sentences with passive voice and relative clauses!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Clause Conquest! Fill in the blanks with correct passive voice or relative clause forms. Use sophisticated grammar structures like 'is designed', 'has been shown', 'are conveyed', etc." />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Sentence {currentIndex + 1} of {CLAUSE_SENTENCES.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 4, mb: 3 }}>
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                    {currentSentence.parts.map((part, partIndex) => {
                      if (!part.error) {
                        return <Typography key={partIndex} variant="h6" component="span" sx={{ color: P.green.shadow }}>{part.text}{' '}</Typography>
                      } else {
                        const errorIndex = currentSentence.parts.slice(0, partIndex).filter(p => p.error).length
                        return (
                          <Box key={partIndex} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" component="span" sx={{ color: P.teal.border, fontWeight: 'bold', fontStyle: 'italic' }}>({part.text})</Typography>
                            <TextField size="small" value={completions[currentIndex][errorIndex] || ''} onChange={(e) => handleCompletionChange(errorIndex, e.target.value)} placeholder="..." variant="outlined" sx={{ minWidth: '160px', '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }} />
                          </Box>
                        )
                      }
                    })}
                  </Box>
                </Box>

                <Stack direction="row" justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < CLAUSE_SENTENCES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!allFilled} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: allFilled ? 1 : 0.4 }}>Next Sentence →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!allComplete} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1, cursor: allComplete ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.green.shadow, opacity: allComplete ? 1 : 0.5 }}>Submit Conquest ⚔️</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to sentence:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {CLAUSE_SENTENCES.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 36, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem' }}>
                      {idx + 1} {completions[idx].every(c => c.trim()) && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '⚔️ Perfect Conquest! ⚔️' : '🌟 Conquest Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Clause Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => {
                    const sentence = result.sentence
                    const errors = sentence.parts.filter(p => p.error)
                    return (
                      <Box key={index} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.yellow.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Sentence {index + 1}</Typography>
                        {errors.map((error, errIdx) => (
                          <Box key={errIdx} sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Your answer: <strong>{result.userCompletions[errIdx] || '(empty)'}</strong></Typography>
                            {result.userCompletions[errIdx].toLowerCase().trim() !== error.correct.toLowerCase().trim() && (
                              <Typography variant="body2" sx={{ color: P.green.shadow }}>Correct: <strong>{error.correct}</strong></Typography>
                            )}
                          </Box>
                        ))}
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
