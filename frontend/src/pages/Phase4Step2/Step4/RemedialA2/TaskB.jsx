import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Alert,
  Card,
  CardContent,
  Container,
  Stack,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level A2 - Task B: Fill Quest
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
  { id: 8, text: 'Click the ___ button to show you love it.', answer: 'like', level: 'Level 8' },
]

export default function Phase4_2Step4RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 4, interaction: 2, context: 'remedial_a2' })
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

  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

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
    sessionStorage.setItem('phase4_2_step4_a2_taskB', correctCount.toString())
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: '4_remedial', level: 'A2', task: 'B', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/a2/taskC')
  }

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())
  const completedLevels = SENTENCES.filter(s => answers[s.id]?.trim()).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>Level A2 - Task B: Fill Quest</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage speaker="Emna" message="Welcome to Fill Quest! Complete each level by filling in the blanks with the correct social media terms. Finish all 8 levels to complete your quest!" />
          </Box>

          {/* Quest Progress */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: P.blue.shadow }}>Quest Progress: {completedLevels}/8 Levels</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {SENTENCES.map((s, idx) => (
                  <Box key={idx} sx={{
                    width: 30, height: 30, borderRadius: '50%',
                    bgcolor: answers[s.id]?.trim() ? P.green.border : P.blue.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '0.8rem',
                  }}>
                    {idx + 1}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Complete each sentence by selecting the correct word from the dropdown menu.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Scoring:</strong> 1 point per correct answer (Pass: 6/8)</Typography>
          </Box>

          {/* Word Bank */}
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: P.green.shadow, fontWeight: 'bold' }}>📚 Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {WORD_BANK.map((word, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow,
                  display: 'inline-block', mb: 1,
                }}>{word}</Box>
              ))}
            </Stack>
          </Box>

          {/* Quest Levels */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {SENTENCES.map((sentence) => {
              const isCorrect = answers[sentence.id] === sentence.answer
              const isAnswered = answers[sentence.id]
              let cardBg = 'white', cardBorder = P.teal.border
              if (showResults) {
                cardBg = isCorrect ? P.green.bg : P.red.bg
                cardBorder = isCorrect ? P.green.border : P.red.border
              } else if (isAnswered) {
                cardBg = P.blue.bg
                cardBorder = P.blue.border
              }

              return (
                <Grid item xs={12} key={sentence.id}>
                  <Box sx={{ bgcolor: cardBg, border: `2px solid ${cardBorder}`, borderRadius: '16px', p: 2, boxShadow: `3px 3px 0 ${cardBorder}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box component="span" sx={{
                        bgcolor: isAnswered ? P.blue.bg : P.yellow.bg,
                        border: `2px solid ${isAnswered ? P.blue.border : P.yellow.border}`,
                        borderRadius: '999px', px: 2, py: 0.5,
                        fontSize: '0.85rem', fontWeight: 700,
                        color: isAnswered ? P.blue.shadow : P.yellow.shadow,
                        display: 'inline-block',
                      }}>{sentence.level}</Box>
                      {showResults && isCorrect && <CheckCircleIcon sx={{ color: P.green.shadow }} />}
                    </Box>

                    <Typography variant="h6" sx={{ color: P.blue.shadow, mb: 2 }}>
                      {sentence.text.replace('___', '______')}
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Select
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                        disabled={showResults}
                        displayEmpty
                        sx={{ backgroundColor: 'white' }}
                      >
                        <MenuItem value="" disabled><em>Select a word...</em></MenuItem>
                        {WORD_BANK.map((word, idx) => (
                          <MenuItem key={idx} value={word}>{word}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {showResults && (
                      <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
                        {isCorrect ? (
                          <Typography>✅ Correct! <strong>{sentence.level}</strong> completed!</Typography>
                        ) : (
                          <Typography>Your answer: <strong>{answers[sentence.id] || '(empty)'}</strong> | Correct answer: <strong>{sentence.answer}</strong></Typography>
                        )}
                      </Alert>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{
              bgcolor: score >= 6 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 6 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ color: score >= 6 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {score >= 6 ? '🎉 Quest Complete!' : 'Quest Incomplete'}
              </Typography>
              <Typography sx={{ color: score >= 6 ? P.green.shadow : P.yellow.shadow }}>Levels Completed: <strong>{score}/{SENTENCES.length}</strong></Typography>
              <Typography sx={{ color: score >= 6 ? P.green.shadow : P.yellow.shadow }}>
                {score >= 6 ? 'Congratulations! You have mastered the Fill Quest!' : 'You need at least 6/8 correct. Review the word meanings and try again!'}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allAnswered ? 'not-allowed' : 'pointer', color: P.blue.shadow, opacity: !allAnswered ? 0.5 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>Complete Quest</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task C <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
