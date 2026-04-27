import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 2 - Remedial A2 - Task A: Dialogue Adventure
 * Complete dialogue explaining video terms (8 blanks)
 * Score: +1 for each correct word (8 total)
 */

const WORD_BANK = [
  'promotional', 'sell', 'persuasive', 'convince',
  'targeted', 'group', 'original', 'new'
]

const DIALOGUE_SENTENCES = [
  'Lilia: What is promotional?',
  'You: _______ is to _______.',
  'Ms. Mabrouki: Persuasive?',
  'You: _______ is to _______.',
  'You: _______ for _______.',
  'You: _______ is _______ idea.'
]

const CORRECT_ANSWERS = [
  'promotional', 'sell',
  'persuasive', 'convince',
  'targeted', 'group',
  'original', 'new'
]

export default function RemedialA2TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/2/remedial/a2/taskB') }, [])
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    let answerIndex = 0
    DIALOGUE_SENTENCES.forEach((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        const userAnswer = answers[key]?.toLowerCase().trim()
        const correctAnswer = CORRECT_ANSWERS[answerIndex]?.toLowerCase()
        if (userAnswer === correctAnswer) correctCount++
        answerIndex++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_a2_taskA_score', finalScore)
    await logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'A', step: 2, score: score, max_score: 8, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 Task A completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/2/remedial/a2/taskB')
  }

  const allFilled = (() => {
    return DIALOGUE_SENTENCES.every((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        if (!answers[key]) return false
      }
      return true
    })
  })()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 - Step 2: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A2 - Task A: Dialogue Adventure
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Complete the dialogue to adventure through the story! Fill in the blanks to help explain video terms.
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Welcome to the Dialogue Adventure! You're having a conversation about video terms with Lilia and me. Fill in the blanks using the word bank below. Click a word from the Word Bank, then click the blank space where it belongs."
            />
          </Box>

          {/* Gap Fill Game */}
          {!submitted && (
            <Box>
              <GapFillStory
                templates={DIALOGUE_SENTENCES}
                wordBank={WORD_BANK}
                answers={answers}
                onChange={handleAnswerChange}
              />
            </Box>
          )}

          {/* Submit Button */}
          {!submitted && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{
                bgcolor: allFilled ? P.blue.bg : 'grey.200',
                border: `2px solid ${allFilled ? P.blue.border : '#ccc'}`,
                borderRadius: '12px',
                boxShadow: allFilled ? `3px 3px 0 ${P.blue.shadow}` : 'none',
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: allFilled ? 'pointer' : 'not-allowed',
                color: allFilled ? P.blue.shadow : 'grey.500',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                '&:active': allFilled ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` } : {},
              }}>
                {allFilled ? 'Submit Dialogue' : 'Fill All Gaps First'}
              </Box>
            </Stack>
          )}

          {/* Results */}
          {submitted && (
            <Box>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mt: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  {score === 8 ? 'Perfect Adventure!' : 'Good Work!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  You scored {score} out of 8 points!
                </Typography>
              </Box>

              {/* Dialogue Review */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 3, mt: 3,
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Dialogue Review:
                </Typography>
                <Stack spacing={2}>
                  {DIALOGUE_SENTENCES.map((sentence, sentenceIndex) => {
                    const blankCount = (sentence.match(/_______/g) || []).length
                    if (blankCount === 0) {
                      return (
                        <Box key={sentenceIndex} sx={{
                          bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                          borderRadius: '12px', p: 2,
                        }}>
                          <Typography variant="body1" sx={{ color: P.blue.shadow }}>{sentence}</Typography>
                        </Box>
                      )
                    }
                    let answerStartIndex = 0
                    for (let i = 0; i < sentenceIndex; i++) {
                      answerStartIndex += (DIALOGUE_SENTENCES[i].match(/_______/g) || []).length
                    }
                    let displaySentence = sentence
                    let allCorrect = true
                    for (let i = 0; i < blankCount; i++) {
                      const key = `g_${sentenceIndex}_${i}`
                      const userAnswer = answers[key]?.trim() || '(empty)'
                      const correctAnswer = CORRECT_ANSWERS[answerStartIndex + i]
                      const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase()
                      if (!isCorrect) allCorrect = false
                      displaySentence = displaySentence.replace('_______', `"${userAnswer}"`)
                    }
                    return (
                      <Box key={sentenceIndex} sx={{
                        bgcolor: allCorrect ? P.green.bg : P.red.bg,
                        border: `2px solid ${allCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '12px', p: 2,
                      }}>
                        <Typography variant="body2" sx={{ color: allCorrect ? P.green.shadow : P.red.shadow }}>
                          {displaySentence}
                        </Typography>
                        {!allCorrect && (
                          <Typography variant="caption" sx={{ color: P.red.shadow, opacity: 0.8, display: 'block', mt: 1 }}>
                            {blankCount === 1 ? (
                              <>Correct: <strong>{CORRECT_ANSWERS[answerStartIndex]}</strong></>
                            ) : (
                              <>Correct: <strong>{CORRECT_ANSWERS.slice(answerStartIndex, answerStartIndex + blankCount).join(', ')}</strong></>
                            )}
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  Next: Expand Empire →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
