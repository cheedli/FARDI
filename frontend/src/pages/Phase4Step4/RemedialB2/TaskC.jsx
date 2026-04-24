import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Task C: Debate Grammar Duel (Subjunctives/Modals)
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

const GRAMMAR_SENTENCES = [
  { id: 1, sentence: 'It is crucial that promotional advertising ___ balanced with ethical considerations so as not to alienate the audience.', options: ['be','is','being','to be'], correctAnswer: 'be', explanation: 'Use present subjunctive "be" after "It is crucial that..." (formal requirement expression)' },
  { id: 2, sentence: 'Persuasive techniques ___ incorporate pathos only when they are supported by credible ethos, as video 1 illustrates.', options: ['should','shall','would','could'], correctAnswer: 'should', explanation: 'Use modal "should" to express recommendation or advisability' },
  { id: 3, sentence: 'If targeted strategies ___ applied without respect for privacy, they ___ erode consumer trust in the long term.', options: ['are / will','were / might','had been / would have','are / would'], correctAnswer: 'were / might', explanation: 'Use second conditional (were + might) for hypothetical situations' },
  { id: 4, sentence: 'It is essential that originality ___ prioritized in creative execution, lest advertisements become forgettable.', options: ['be','is','should be','will be'], correctAnswer: 'be', explanation: 'Use present subjunctive "be" after "It is essential that..."' },
  { id: 5, sentence: 'Dramatisation ___ captivate viewers more deeply if obstacles ___ portrayed as authentic rather than contrived.', options: ['will / are','could / were','can / will be','might / are'], correctAnswer: 'could / were', explanation: 'Use modal "could" + second conditional "were" for hypothetical improvement' },
  { id: 6, sentence: 'Ethical advertising ___ remain a non-negotiable priority, even when commercial pressures threaten to compromise integrity.', options: ['must','should','might','could'], correctAnswer: 'must', explanation: 'Use modal "must" to express strong necessity or obligation' }
]

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(GRAMMAR_SENTENCES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentSentence = GRAMMAR_SENTENCES[currentIndex]
  const handleAnswerSelect = (answer) => { const n = [...userAnswers]; n[currentIndex] = answer; setUserAnswers(n) }
  const handleNext = () => { if (currentIndex < GRAMMAR_SENTENCES.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => ({
      userAnswer: answer, correctAnswer: GRAMMAR_SENTENCES[index].correctAnswer,
      isCorrect: answer === GRAMMAR_SENTENCES[index].correctAnswer,
      explanation: GRAMMAR_SENTENCES[index].explanation
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b2_taskC_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'C', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b2/taskD')
  window.__remedialSkip = handleContinue
  const progress = ((currentIndex + 1) / GRAMMAR_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task C: Debate Grammar Duel ⚔️</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Master advanced grammar: subjunctives and modals!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Advanced grammar time! You'll practice subjunctives (it is crucial that...) and modals (should, must, might, could). These structures are essential for sophisticated, formal writing. Choose carefully!" />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Question {currentIndex + 1} of {GRAMMAR_SENTENCES.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3 }}>
                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderLeft: `5px solid ${P.teal.border}`, borderRadius: '12px', p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ color: P.teal.shadow }}>{currentSentence.sentence}</Typography>
                </Box>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {currentSentence.options.map((option) => {
                    const isSelected = userAnswers[currentIndex] === option
                    return (
                      <Box key={option} component="button" onClick={() => handleAnswerSelect(option)} sx={{
                        p: 2, textAlign: 'left', fontSize: '1.05rem', fontWeight: 'medium',
                        bgcolor: isSelected ? P.green.border : P.green.bg,
                        border: `2px solid ${isSelected ? P.green.shadow : P.green.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                        cursor: 'pointer', color: isSelected ? '#fff' : P.green.shadow,
                        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
                      }}>
                        {option}
                      </Box>
                    )
                  })}
                </Stack>

                {/* Live score */}
                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'center' }}>
                  <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 1 }}>
                    {GRAMMAR_SENTENCES.map((s, idx) => {
                      const answered = userAnswers[idx] !== ''
                      const isCorrect = answered && userAnswers[idx] === s.correctAnswer
                      return (
                        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                          <Typography variant="caption" sx={{ color: P.teal.shadow }}>Q{idx + 1}</Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: !answered ? 'text.secondary' : isCorrect ? P.green.shadow : P.red.shadow }}>
                            {!answered ? '-' : isCorrect ? '✓' : '✗'}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: P.teal.shadow }}>
                    SCORE: {userAnswers.filter((a, idx) => a === GRAMMAR_SENTENCES[idx].correctAnswer).length}/{GRAMMAR_SENTENCES.length}
                  </Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < GRAMMAR_SENTENCES.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: userAnswers[currentIndex] ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: userAnswers[currentIndex] ? 1 : 0.4, '&:hover': userAnswers[currentIndex] ? { transform: 'translate(-2px,-2px)' } : {} }}>Next →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(a => !a)} sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, px: 3, py: 1, cursor: userAnswers.some(a => !a) ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.yellow.shadow, opacity: userAnswers.some(a => !a) ? 0.4 : 1 }}>Submit Duel ⚔️</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to question:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {GRAMMAR_SENTENCES.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 36, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem' }}>
                      {idx + 1} {userAnswers[idx] && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '⚔️ Perfect Grammar Duel! ⚔️' : '🌟 Duel Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Grammar Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={index} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        {result.isCorrect ? <CheckCircle sx={{ color: P.green.border, flexShrink: 0 }} /> : <Cancel sx={{ color: P.red.border, flexShrink: 0 }} />}
                        <Box>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>Question {index + 1}</Typography>
                          <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>Your answer: <strong>{result.userAnswer}</strong></Typography>
                          {!result.isCorrect && <Typography variant="body2" sx={{ color: P.red.shadow }}>Correct: <strong>{result.correctAnswer}</strong></Typography>}
                          <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>💡 {result.explanation}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
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
