import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Grid, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level B1 - Task D: Tense Odyssey
 * Grammar Exercise - Mixed Tenses/Conditionals for social media contexts
 */

const SENTENCES = [
  { id: 1, prompt: 'Hashtag use for viral', correctAnswer: 'would have been', hint: 'Past conditional - what could have happened', fullSentence: 'Hashtag use for viral ___ better if targeted.', explanation: 'Use "would have been" for hypothetical past situations' },
  { id: 2, prompt: 'Caption is short', correctAnswer: 'has proven', hint: 'Present perfect - result from past to now', fullSentence: 'Caption is short ___ effective.', explanation: 'Use "has proven" to show ongoing effectiveness' },
  { id: 3, prompt: 'Emoji add emotion', correctAnswer: 'if used', hint: 'Conditional - when/if situation', fullSentence: 'Emoji add emotion ___ sparingly.', explanation: 'Use "if used" for conditional statements' },
  { id: 4, prompt: 'Call-to-action drive conversion', correctAnswer: 'would increase', hint: 'Conditional future - what would happen', fullSentence: 'Call-to-action drive conversion ___ if clear.', explanation: 'Use "would increase" for hypothetical future results' },
  { id: 5, prompt: 'Tagging reach more', correctAnswer: 'had been', hint: 'Past perfect - completed past action', fullSentence: 'Tagging reach more ___ used wisely.', explanation: 'Use "had been" for completed past actions' },
  { id: 6, prompt: 'Viral spread fast', correctAnswer: 'might happen', hint: 'Modal - possibility in future', fullSentence: 'Viral spread fast ___ with good content.', explanation: 'Use "might happen" for possible future events' }
]

export default function Phase4_2RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 4, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showHints, setShowHints] = useState({})
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const handleAnswerChange = (id, value) => { setAnswers({ ...answers, [id]: value.toLowerCase().trim() }) }
  const toggleHint = (id) => { setShowHints({ ...showHints, [id]: !showHints[id] }) }

  const evaluateAnswer = (userAnswer, correctAnswer) => {
    const userWords = userAnswer.toLowerCase().trim().split(/\s+/)
    const correctWords = correctAnswer.toLowerCase().trim().split(/\s+/)
    const matches = correctWords.filter(word => userWords.includes(word))
    return matches.length === correctWords.length
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (evaluateAnswer(answers[sentence.id] || '', sentence.correctAnswer)) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / SENTENCES.length) * 10
    sessionStorage.setItem('phase4_2_remedial_b1_taskD_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskD_max', '10')
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B1', task: 'D', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/1/remedial/b1/taskE') }
  window.__remedialSkip = handleNext
  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1: Engage - Remedial Practice</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B1 - Task D: Tense Odyssey</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Complete sentences with correct mixed tenses and conditionals!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Time to master mixed tenses! Fill in the blanks with the correct verb forms. Use conditionals, present perfect, past perfect, and modals. Click 'Show Hint' if you need help!" />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Complete each sentence with the correct verb tense or conditional form.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Evaluation:</strong> Your answer must include the correct tense/conditional words.</Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {SENTENCES.map(sentence => {
              const isCorrect = evaluateAnswer(answers[sentence.id] || '', sentence.correctAnswer)
              return (
                <Grid item xs={12} key={sentence.id}>
                  <Box sx={{
                    bgcolor: showResults ? (isCorrect ? P.green.bg : P.red.bg) : P.orange.bg,
                    border: `2px solid ${showResults ? (isCorrect ? P.green.border : P.red.border) : P.orange.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                    p: 3,
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      {sentence.id}. {sentence.fullSentence}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Context: <em>{sentence.prompt}</em></Typography>
                    <TextField fullWidth size="medium" placeholder="Type your answer here (e.g., would have been)"
                      value={answers[sentence.id] || ''} onChange={(e) => handleAnswerChange(sentence.id, e.target.value)} disabled={showResults} />

                    {!showResults && (
                      <Box component="button" onClick={() => toggleHint(sentence.id)} sx={{
                        mt: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '8px',
                        px: 2, py: 0.5, cursor: 'pointer', color: P.yellow.shadow, fontSize: '0.85rem', fontWeight: 600
                      }}>
                        {showHints[sentence.id] ? 'Hide Hint' : 'Show Hint'}
                      </Box>
                    )}

                    {showHints[sentence.id] && !showResults && (
                      <Box sx={{ mt: 2, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" sx={{ color: P.blue.shadow }}><strong>Hint:</strong> {sentence.hint}</Typography>
                      </Box>
                    )}

                    {showResults && (
                      <Box sx={{ mt: 2, bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                        {isCorrect ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: P.green.shadow }} />
                            <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>Correct! <strong>{sentence.correctAnswer}</strong></Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography sx={{ color: P.red.shadow, fontWeight: 600 }}>Your answer: <strong>{answers[sentence.id] || '(empty)'}</strong></Typography>
                            <Typography sx={{ color: P.red.shadow, fontWeight: 600 }}>Correct answer: <strong>{sentence.correctAnswer}</strong></Typography>
                          </Box>
                        )}
                        <Typography variant="caption" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow, display: 'block', mt: 1 }}>{sentence.explanation}</Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{ bgcolor: score === SENTENCES.length ? P.green.bg : P.yellow.bg, border: `2px solid ${score === SENTENCES.length ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === SENTENCES.length ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: score === SENTENCES.length ? P.green.shadow : P.yellow.shadow }}>
                {score === SENTENCES.length ? `Perfect! All ${SENTENCES.length} sentences completed correctly!` : `You got ${score}/${SENTENCES.length} correct. Review the explanations above!`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Answers</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task E</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
