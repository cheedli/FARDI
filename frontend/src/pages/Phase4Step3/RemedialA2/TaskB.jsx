import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, TextField, LinearProgress, CircularProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, TipsAndUpdates } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A2 - Task B: Expand Empire
 * Expand 8 sentences with video terms using LLM evaluation
 * Score: +1 for each correct expansion (8 total)
 */

const SENTENCE_PROMPTS = [
  { prompt: 'Ad is promotional.', expectedExpansion: 'Ad is promotional to sell.', hint: 'Add what promotional does (purpose)' },
  { prompt: 'Persuasive is.', expectedExpansion: 'Persuasive is to convince buy.', hint: 'Complete: persuasive is to... what?' },
  { prompt: 'Targeted for.', expectedExpansion: 'Targeted for specific people.', hint: 'Targeted for which people?' },
  { prompt: 'Original idea.', expectedExpansion: 'Original idea is new.', hint: 'What kind of idea is original?' },
  { prompt: 'Creative ad.', expectedExpansion: 'Creative ad is memorable.', hint: 'What does a creative ad do?' },
  { prompt: 'Dramatisation story.', expectedExpansion: 'Dramatisation story in video.', hint: 'Where is the dramatisation story?' },
  { prompt: 'Goal is.', expectedExpansion: 'Goal is what want.', hint: 'What is a goal?' },
  { prompt: 'Obstacles are.', expectedExpansion: 'Obstacles are problems.', hint: 'What are obstacles?' }
]

export default function RemedialA2TaskB() {
  const navigate = useNavigate()
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [evaluating, setEvaluating] = useState(false)

  const currentPrompt = SENTENCE_PROMPTS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCE_PROMPTS.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const checkRelevantWords = (expansion, index) => {
    const relevantWords = [
      ['sell', 'selling', 'product'],
      ['convince', 'persuade', 'buy'],
      ['specific', 'people', 'group', 'audience'],
      ['new', 'fresh', 'unique'],
      ['memorable', 'remember', 'stands out'],
      ['video', 'commercial', 'advertisement'],
      ['want', 'desire', 'wish', 'aim'],
      ['problems', 'challenges', 'difficulties', 'issues']
    ]
    if (index >= relevantWords.length) return false
    return relevantWords[index].some(word => expansion.toLowerCase().includes(word.toLowerCase()))
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    const expansions = userAnswers.map((answer, index) => ({
      prompt: SENTENCE_PROMPTS[index].prompt,
      userExpansion: answer,
      expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion
    }))
    try {
      const response = await fetch('/api/phase4/evaluate-sentence-expansions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ expansions })
      })
      const data = await response.json()
      if (data.success && data.results) {
        const checkResults = data.results.map((result, index) => ({
          userAnswer: userAnswers[index],
          expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion,
          isCorrect: result.isCorrect,
          feedback: result.feedback
        }))
        setResults(checkResults)
        const correctCount = checkResults.filter(r => r.isCorrect).length
        setScore(correctCount)
        setSubmitted(true)
        sessionStorage.setItem('remedial_step3_a2_taskB_score', correctCount)
        await logTaskCompletion(correctCount)
      } else {
        await handleSubmitLocal()
      }
    } catch (error) {
      console.error('AI evaluation error:', error)
      await handleSubmitLocal()
    } finally {
      setEvaluating(false)
    }
  }

  const handleSubmitLocal = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const expansion = answer.toLowerCase().trim()
      const hasAddition = expansion.length > SENTENCE_PROMPTS[index].prompt.length + 3
      const hasRelevantWords = checkRelevantWords(expansion, index)
      const isCorrect = hasAddition && hasRelevantWords
      return { userAnswer: answer, expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion, isCorrect, feedback: isCorrect ? 'Good expansion!' : 'Try adding more explanation.' }
    })
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_a2_taskB_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'B', step: 2, score: score, max_score: 8, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 Task B completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step3/remedial/a2/taskC')
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

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
              Phase 4 - Step 3: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A2 - Task B: Expand Empire
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Build your empire by expanding sentences! Each expansion is like adding a building to your empire.
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
              message="Great job on the Dialogue Adventure! Now let's expand our empire! You have 8 short sentences. Your task is to expand each one by adding more words to make it more complete. Look at the hints for ideas. Don't worry about perfect grammar - just add simple explanations!"
            />
          </Box>

          {!submitted ? (
            <Box>
              {/* Progress Bar */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 2, mb: 3,
              }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }} gutterBottom>
                  Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{
                  mb: 1, borderRadius: '4px',
                  '& .MuiLinearProgress-bar': { backgroundColor: P.yellow.shadow }
                }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {SENTENCE_PROMPTS.map((_, idx) => (
                    <Box key={idx} sx={{
                      width: '100%', height: 8, borderRadius: 1,
                      backgroundColor: idx < currentIndex ? P.green.shadow :
                                      idx === currentIndex ? P.blue.shadow : 'grey.300'
                    }} />
                  ))}
                </Box>
              </Box>

              {/* Current Sentence Expansion */}
              <Box sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 4, mb: 3,
              }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.orange.shadow }} gutterBottom>
                    Expand this sentence:
                  </Typography>
                  <Box sx={{
                    bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                    borderRadius: '12px', p: 2, display: 'inline-block',
                  }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                      "{currentPrompt.prompt}"
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px', p: 2, mb: 3,
                  display: 'flex', alignItems: 'center', gap: 1,
                }}>
                  <TipsAndUpdates sx={{ color: P.blue.shadow }} />
                  <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                    {currentPrompt.hint}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Your expanded sentence"
                  placeholder="Write a longer, more complete sentence..."
                  value={userAnswers[currentIndex]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  multiline
                  rows={3}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': { borderColor: P.orange.border },
                      '&:hover fieldset': { borderColor: P.orange.shadow },
                      '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                    }
                  }}
                />

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{
                    bgcolor: currentIndex === 0 ? 'grey.200' : P.blue.bg,
                    border: `2px solid ${currentIndex === 0 ? '#ccc' : P.blue.border}`,
                    borderRadius: '12px',
                    boxShadow: currentIndex === 0 ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                    px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    color: currentIndex === 0 ? 'grey.500' : P.blue.shadow,
                    '&:hover': currentIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                    '&:active': currentIndex === 0 ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                  }}>
                    ← Previous
                  </Box>

                  {currentIndex < SENTENCE_PROMPTS.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{
                      bgcolor: !userAnswers[currentIndex] ? 'grey.200' : P.blue.bg,
                      border: `2px solid ${!userAnswers[currentIndex] ? '#ccc' : P.blue.border}`,
                      borderRadius: '12px',
                      boxShadow: !userAnswers[currentIndex] ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: !userAnswers[currentIndex] ? 'not-allowed' : 'pointer',
                      color: !userAnswers[currentIndex] ? 'grey.500' : P.blue.shadow,
                      '&:hover': !userAnswers[currentIndex] ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                      '&:active': !userAnswers[currentIndex] ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                    }}>
                      Next →
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(answer => !answer) || evaluating} sx={{
                      bgcolor: (userAnswers.some(answer => !answer) || evaluating) ? 'grey.200' : P.green.bg,
                      border: `2px solid ${(userAnswers.some(answer => !answer) || evaluating) ? '#ccc' : P.green.border}`,
                      borderRadius: '12px',
                      boxShadow: (userAnswers.some(answer => !answer) || evaluating) ? 'none' : `3px 3px 0 ${P.green.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: (userAnswers.some(answer => !answer) || evaluating) ? 'not-allowed' : 'pointer',
                      color: (userAnswers.some(answer => !answer) || evaluating) ? 'grey.500' : P.green.shadow,
                      display: 'flex', alignItems: 'center', gap: 1,
                      '&:hover': (userAnswers.some(answer => !answer) || evaluating) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                      '&:active': (userAnswers.some(answer => !answer) || evaluating) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                    }}>
                      {evaluating && <CircularProgress size={16} />}
                      {evaluating ? 'Evaluating...' : 'Submit All Expansions'}
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Quick Navigation */}
              <Box sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                p: 2,
              }}>
                <Typography variant="body2" sx={{ color: P.purple.shadow }} gutterBottom>
                  Jump to sentence:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SENTENCE_PROMPTS.map((prompt, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{
                      bgcolor: idx === currentIndex ? P.purple.shadow : P.purple.bg,
                      border: `2px solid ${P.purple.border}`,
                      borderRadius: '8px',
                      px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.8rem', minWidth: 40,
                      cursor: 'pointer',
                      color: idx === currentIndex ? 'white' : P.purple.shadow,
                      '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.purple.shadow}` },
                    }}>
                      {idx + 1} {userAnswers[idx] && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Results */}
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  {score === 8 ? 'Empire Complete!' : 'Good Empire Building!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  You scored {score} out of 8 points!
                </Typography>
              </Box>

              {/* Answer Review */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Expansion Review:
                </Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={index} sx={{
                      bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', p: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {result.isCorrect
                          ? <CheckCircle sx={{ color: P.green.shadow, fontSize: 18 }} />
                          : <Cancel sx={{ color: P.red.shadow, fontSize: 18 }} />}
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                          Sentence {index + 1}: "{SENTENCE_PROMPTS[index].prompt}"
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                        Your expansion: "{result.userAnswer}"
                      </Typography>
                      {result.feedback && (
                        <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, opacity: 0.8, display: 'block', mt: 0.5 }}>
                          {result.feedback}
                        </Typography>
                      )}
                      {!result.isCorrect && (
                        <Typography variant="caption" sx={{ color: P.red.shadow, opacity: 0.8, display: 'block', mt: 0.5 }}>
                          Example: <strong>{result.expectedExpansion}</strong>
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  Next: Connector Quest →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
