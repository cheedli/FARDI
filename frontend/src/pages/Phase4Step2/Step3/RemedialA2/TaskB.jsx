import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Container,
  Select, MenuItem, FormControl
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level A2 - Task B: Fill Quest
 */

const WORD_BANK = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action', 'post', 'story', 'like']

const SENTENCES = [
  { id: 1, text: 'Use ___ #Festival to find posts.', answer: 'hashtag', level: 'Level 1' },
  { id: 2, text: 'Write a good ___ under your photo.', answer: 'caption', level: 'Level 2' },
  { id: 3, text: 'Add a happy ___ to show your feeling.', answer: 'emoji', level: 'Level 3' },
  { id: 4, text: '___ your friend with @ symbol.', answer: 'tag', level: 'Level 4' },
  { id: 5, text: 'Use a ___ like "Click here!" to get action.', answer: 'call-to-action', level: 'Level 5' },
  { id: 6, text: 'Make a ___ with picture and text.', answer: 'post', level: 'Level 6' },
  { id: 7, text: 'Watch my ___ - it disappears in 24 hours!', answer: 'story', level: 'Level 7' },
  { id: 8, text: 'Click the ___ button to show you love it.', answer: 'like', level: 'Level 8' }
]

export default function Phase4_2Step3RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const handleAnswerChange = (id, value) => {
    setAnswers({ ...answers, [id]: value.toLowerCase().trim() })
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (answers[sentence.id] === sentence.answer) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase4_2_step3_a2_taskB', correctCount.toString())
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'A2', task: 'B', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase4_2/step/3/remedial/a2/taskC') }
  window.__remedialSkip = handleNext

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())
  const completedLevels = SENTENCES.filter(s => answers[s.id]?.trim()).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>Phase 4.2 Step 3 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>Level A2 - Task B: Fill Quest</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Lilia" message="Welcome to Fill Quest! Complete each level by filling in the blanks with the correct social media terms. Finish all 8 levels to complete your quest!" />
          </Box>

          {/* Progress */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: P.blue.shadow }}>Quest Progress: {completedLevels}/8 Levels</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {SENTENCES.map((s, idx) => (
                  <Box key={idx} sx={{
                    width: 30, height: 30, borderRadius: '50%',
                    bgcolor: answers[s.id]?.trim() ? P.green.border : 'grey.300',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '0.8rem'
                  }}>{idx + 1}</Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1"><strong>Instructions:</strong> Complete each sentence by selecting the correct word from the word bank.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><strong>Scoring:</strong> 1 point per correct answer (Pass: 6/8)</Typography>
          </Box>

          {/* Word Bank */}
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.green.shadow }}>Word Bank:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {WORD_BANK.map((word, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow, display: 'inline-block'
                }}>{word}</Box>
              ))}
            </Box>
          </Box>

          {/* Sentences */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {SENTENCES.map((sentence) => {
              const isCorrect = answers[sentence.id] === sentence.answer
              const isAnswered = answers[sentence.id]
              let bg = P.orange.bg; let border = P.orange.border; let shadow = P.orange.shadow
              if (showResults && isCorrect) { bg = P.green.bg; border = P.green.border; shadow = P.green.shadow }
              else if (showResults && !isCorrect) { bg = P.red.bg; border = P.red.border; shadow = P.red.shadow }
              else if (isAnswered) { bg = P.blue.bg; border = P.blue.border; shadow = P.blue.shadow }

              return (
                <Grid item xs={12} key={sentence.id}>
                  <Box sx={{ bgcolor: bg, border: `2px solid ${border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${shadow}`, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box component="span" sx={{
                        bgcolor: isAnswered ? P.blue.bg : P.yellow.bg,
                        border: `2px solid ${isAnswered ? P.blue.border : P.yellow.border}`,
                        borderRadius: '999px', px: 2, py: 0.3,
                        fontSize: '0.85rem', fontWeight: 700,
                        color: isAnswered ? P.blue.shadow : P.yellow.shadow
                      }}>{sentence.level}</Box>
                      {showResults && isCorrect && <CheckCircleIcon sx={{ color: P.green.border }} />}
                    </Box>

                    <Typography variant="h6" sx={{ color: P.blue.shadow, mb: 2 }}>
                      {sentence.text.replace('___', '______')}
                    </Typography>

                    <FormControl fullWidth>
                      <Select
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                        disabled={showResults}
                        displayEmpty
                        sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px' }}
                      >
                        <MenuItem value="" disabled><em>Select a word...</em></MenuItem>
                        {WORD_BANK.map((word, idx) => (
                          <MenuItem key={idx} value={word}>{word}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {showResults && (
                      <Box sx={{
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        border: `1px solid ${isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '8px', mt: 2, p: 1
                      }}>
                        <Typography variant="body2">
                          {isCorrect ? `Correct! ${sentence.level} completed!` : `Your answer: ${answers[sentence.id] || '(empty)'} | Correct: ${sentence.answer}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {/* Results summary */}
          {showResults && (
            <Box sx={{
              bgcolor: score >= 6 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 6 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{score >= 6 ? 'Quest Complete!' : 'Quest Incomplete'}</Typography>
              <Typography>Levels Completed: <strong>{score}/{SENTENCES.length}</strong></Typography>
              <Typography>{score >= 6 ? 'Congratulations! You have mastered the Fill Quest!' : 'You need at least 6/8 correct. Review the word meanings and try again!'}</Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: allAnswered ? 'pointer' : 'not-allowed', color: P.orange.shadow, opacity: allAnswered ? 1 : 0.5,
                '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none', boxShadow: allAnswered ? `5px 5px 0 ${P.orange.shadow}` : `3px 3px 0 ${P.orange.shadow}` }
              }}>Complete Quest</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Continue to Task C <ArrowForwardIcon /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
