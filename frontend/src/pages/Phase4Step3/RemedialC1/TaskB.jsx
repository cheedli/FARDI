import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 3 - Remedial C1 - Task B: Quizlet Live Advanced Quiz
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

const QUIZ_QUESTIONS = [
  { id: 1, question: 'What does promotional advertising primarily aim to achieve?', correctAnswer: 'To drive sales and increase brand visibility, as video 1 states.', keywords: ['drive sales', 'increase', 'brand visibility', 'video 1'] },
  { id: 2, question: 'How does video 1 define the components of persuasive advertising?', correctAnswer: 'Through ethos (credibility), pathos (emotion), and logos (logic).', keywords: ['ethos', 'pathos', 'logos', 'credibility', 'emotion', 'logic'] },
  { id: 3, question: 'Why does the video advocate for targeted and personalized strategies?', correctAnswer: 'They increase relevance and effectiveness by addressing specific audience needs.', keywords: ['increase relevance', 'effectiveness', 'specific audience needs', 'addressing'] },
  { id: 4, question: 'What risk does video 1 associate with a lack of originality and creativity?', correctAnswer: 'Ads become forgettable and fail to stand out in saturated media.', keywords: ['forgettable', 'fail', 'stand out', 'saturated media'] },
  { id: 5, question: 'According to video 1, why is consistency across platforms essential?', correctAnswer: 'It reinforces brand identity and builds long-term trust.', keywords: ['reinforces', 'brand identity', 'builds', 'long-term trust'] },
  { id: 6, question: 'How does video 2 illustrate the role of dramatisation in successful ads?', correctAnswer: 'By using relatable characters, clear goals, and obstacles to create emotional engagement.', keywords: ['relatable characters', 'clear goals', 'obstacles', 'emotional engagement'] },
]

export default function RemedialC1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(QUIZ_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentQuestion = QUIZ_QUESTIONS[currentIndex]
  const handleAnswerChange = (value) => { const n = [...answers]; n[currentIndex] = value; setAnswers(n) }
  const handleNext = () => { if (currentIndex < QUIZ_QUESTIONS.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkAnswer = (userAnswer, correctAnswer, keywords) => {
    const userLower = userAnswer.toLowerCase().trim()
    if (userLower === correctAnswer.toLowerCase().trim()) return true
    const matched = keywords.filter(k => userLower.includes(k.toLowerCase()))
    return matched.length >= Math.ceil(keywords.length / 2) && userAnswer.split(' ').length >= 5
  }

  const handleSubmit = async () => {
    const checkResults = answers.map((answer, index) => {
      const q = QUIZ_QUESTIONS[index]
      const isCorrect = checkAnswer(answer, q.correctAnswer, q.keywords)
      return { isCorrect, userAnswer: answer, correctAnswer: q.correctAnswer }
    })
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('remedial_step4_c1_taskB_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'B', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/3/remedial/c1/taskC')
  window.__remedialSkip = handleContinue
  const allFilled = answers.every(a => a.trim().length > 0)
  const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task B: Quizlet Live 🎮</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Answer 6 advanced questions with detailed, sophisticated responses!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to Quizlet Live! Answer each question with detailed, accurate responses using sophisticated vocabulary. Reference video 1 and video 2 where appropriate, and provide specific examples!" />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
                <Box sx={{ bgcolor: P.purple.border, borderRadius: '12px', p: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>Q{currentIndex + 1}: {currentQuestion.question}</Typography>
                </Box>

                <TextField fullWidth multiline rows={4} value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Write your detailed answer here..."
                  helperText={`Word count: ${answers[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for at least 10 words)`} />

                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.teal.shadow }}>💡 Include in your answer:</Typography>
                  <Typography variant="body2" sx={{ color: P.teal.border }}>{currentQuestion.keywords.join(', ')}</Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < QUIZ_QUESTIONS.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!answers[currentIndex].trim()} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: answers[currentIndex].trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: answers[currentIndex].trim() ? 1 : 0.4 }}>Next Question →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1, cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.green.shadow, opacity: allFilled ? 1 : 0.5 }}>Submit Quiz 🎮</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to question:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {QUIZ_QUESTIONS.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 36, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem' }}>
                      {idx + 1} {answers[idx].trim() && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '🎮 Perfect Quiz! 🎮' : '🌟 Quiz Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {QUIZ_QUESTIONS.map((question, index) => {
                    const result = results[index]
                    return (
                      <Box key={index} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.yellow.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Q{index + 1}: {question.question}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: result.isCorrect ? P.green.shadow : P.yellow.shadow }}>Your answer: "{result.userAnswer}"</Typography>
                        {!result.isCorrect && <Typography variant="body2" sx={{ mt: 0.5, color: P.green.shadow }}>Model answer: <strong>{result.correctAnswer}</strong></Typography>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task C →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
