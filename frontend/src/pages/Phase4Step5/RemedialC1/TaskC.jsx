import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Level C1 - Task C: Quizlet Live
 * Answer 6 advanced questions one by one with detailed responses
 * Score: +1 per correctly answered question (6 total)
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

const QUESTIONS = [
  { id: 1, question: 'What is the primary aim of promotional advertising according to video 1?', expectedAnswer: 'To drive sales and increase brand recognition, though effectiveness depends on execution quality.', keywords: ['drive sales', 'brand recognition', 'effectiveness', 'execution', 'quality'] },
  { id: 2, question: 'How does video 1 describe the components of persuasive advertising?', expectedAnswer: 'It is rooted in ethos (credibility), pathos (emotion), and logos (logic), creating balance without coercion.', keywords: ['ethos', 'pathos', 'logos', 'credibility', 'emotion', 'logic', 'balance', 'coercion'] },
  { id: 3, question: 'What advantage and risk do targeted/personalized strategies present?', expectedAnswer: 'They enhance relevance by addressing specific needs, but raise ethical concerns about data privacy.', keywords: ['enhance', 'relevance', 'addressing', 'needs', 'ethical', 'data privacy', 'concerns'] },
  { id: 4, question: 'Why does video 1 emphasize originality and creativity?', expectedAnswer: 'They distinguish ads in saturated markets, ensuring memorability and emotional resonance.', keywords: ['distinguish', 'saturated', 'markets', 'memorability', 'emotional', 'resonance'] },
  { id: 5, question: 'What does consistent messaging achieve, and what is the potential drawback?', expectedAnswer: 'It reinforces brand identity and trust, but excessive rigidity may limit adaptability.', keywords: ['reinforces', 'brand identity', 'trust', 'rigidity', 'limit', 'adaptability'] },
  { id: 6, question: 'How does dramatisation in video 2 contribute to ad effectiveness?', expectedAnswer: 'Through structured storytelling with clear goals and obstacles, it creates emotional depth and captivates viewers.', keywords: ['structured', 'storytelling', 'goals', 'obstacles', 'emotional', 'depth', 'captivates', 'viewers'] },
]

export default function Phase4Step5RemedialC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_c1' })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckAnswer = async () => {
    const question = QUESTIONS[currentQuestion]
    const userAnswerTrimmed = userAnswer.trim()
    setFeedback({ type: 'info', message: 'Evaluating your answer...' })
    try {
      const response = await fetch('/api/phase4/step5/remedial/evaluate-question', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', question: question.question, userAnswer: userAnswerTrimmed, expectedAnswer: question.expectedAnswer, keywords: question.keywords, questionIndex: currentQuestion }) })
      const data = await response.json()
      const pointsEarned = data.correct ? 1 : 0
      if (data.correct) { setScore(score + pointsEarned); setFeedback({ type: 'success', message: `Excellent C1-level answer! Quiz continues! +${pointsEarned} point` }) }
      else { setFeedback({ type: 'error', message: data.feedback || 'Not quite C1 level. Focus on: detailed explanations, sophisticated vocabulary, and video references.' }) }
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) { setCurrentQuestion(currentQuestion + 1); setUserAnswer(''); setFeedback(null) }
        else { const finalScore = data.correct ? score + 1 : score; sessionStorage.setItem('phase4_step5_remedial_c1_taskC_score', finalScore); logTaskCompletion(finalScore); setGameCompleted(true); setFeedback(null) }
      }, 2000)
    } catch (error) {
      const userLower = userAnswerTrimmed.toLowerCase()
      const keywordMatches = question.keywords.filter(k => userLower.includes(k.toLowerCase())).length
      const keywordThreshold = Math.ceil(question.keywords.length * 0.6)
      const hasLength = userAnswerTrimmed.length >= 30
      const hasVideoRef = userLower.includes('video')
      const pointsEarned = (keywordMatches >= keywordThreshold && hasLength && hasVideoRef) ? 1 : 0
      if (pointsEarned > 0) { setScore(score + pointsEarned); setFeedback({ type: 'success', message: `Good C1-level answer! Quiz continues! +${pointsEarned} point` }) }
      else { setFeedback({ type: 'error', message: 'Remember to provide detailed answers with key concepts, reference the videos, and use sophisticated vocabulary.' }) }
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) { setCurrentQuestion(currentQuestion + 1); setUserAnswer(''); setFeedback(null) }
        else { const finalScore = pointsEarned > 0 ? score + 1 : score; sessionStorage.setItem('phase4_step5_remedial_c1_taskC_score', finalScore); logTaskCompletion(finalScore); setGameCompleted(true); setFeedback(null) }
      }, 2000)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'C', score: finalScore, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/c1/taskD')
  window.__remedialSkip = handleContinue
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const canSubmit = userAnswer.trim().length >= 30

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task C: Quizlet Live 🎯</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Live quiz challenge! Answer advanced questions with detail and sophistication.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Welcome to Quizlet Live! 🎯 You have 6 advanced questions to answer, one at a time. Your mission: provide detailed, sophisticated answers with references to the videos. Each correct C1-level answer earns you 1 point!" />
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.teal.shadow, mb: 1 }}>🎯 What to Include (C1 Level):</Typography>
            <Stack spacing={0.75}>
              {[['Video References:', 'Mention specific videos (video 1, video 2) in your answers'], ['Key Concepts:', 'Use keywords from the expected answers'], ['Sophisticated Vocabulary:', 'Advanced words and precise expressions'], ['Detail:', 'Write at least 30 characters with complete explanations'], ['Nuance:', 'Explain both advantages and drawbacks where applicable']].map(([l, d]) => (
                <Typography key={l} variant="body2" sx={{ color: P.teal.shadow }}><strong>{l}</strong> {d}</Typography>
              ))}
            </Stack>
          </Box>

          {!gameCompleted ? (
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border } }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.purple.shadow}`, px: 2, py: 0.75 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.shadow }}>Question {currentQuestion + 1} / {QUESTIONS.length}</Typography>
                </Box>
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.green.shadow}`, px: 2, py: 0.75 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score} / {QUESTIONS.length}</Typography>
                </Box>
              </Stack>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 1 }}>❓ Question:</Typography>
                <Typography variant="h6" sx={{ color: P.blue.border }}>{QUESTIONS[currentQuestion].question}</Typography>
              </Box>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>✏️ Your C1-level answer (provide detailed, sophisticated response with video references):</Typography>
              <TextField fullWidth multiline rows={4} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} disabled={feedback !== null} placeholder="Provide a detailed, sophisticated answer with references to the videos..." variant="outlined" autoFocus sx={{ mb: 2 }} />

              {feedback && (
                <Box sx={{ bgcolor: feedback.type === 'success' ? P.green.bg : feedback.type === 'info' ? P.blue.bg : P.red.bg, border: `2px solid ${feedback.type === 'success' ? P.green.border : feedback.type === 'info' ? P.blue.border : P.red.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${feedback.type === 'success' ? P.green.shadow : feedback.type === 'info' ? P.blue.shadow : P.red.shadow}`, p: 2, mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: feedback.type === 'success' ? P.green.shadow : feedback.type === 'info' ? P.blue.shadow : P.red.shadow }}>{feedback.message}</Typography>
                </Box>
              )}

              {!feedback && (
                <Box component="button" onClick={handleCheckAnswer} disabled={!canSubmit}
                  sx={{ display: 'block', width: '100%', bgcolor: canSubmit ? P.green.bg : P.yellow.bg, border: `2px solid ${canSubmit ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${canSubmit ? P.green.shadow : P.yellow.shadow}`, p: 2, cursor: canSubmit ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: canSubmit ? P.green.shadow : P.yellow.shadow, opacity: canSubmit ? 1 : 0.6, '&:hover': canSubmit ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {} }}>
                  {canSubmit ? 'Check Answer ✓' : 'Write at least 30 characters'}
                </Box>
              )}
            </Box>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.green.shadow }}>🎯 Quizlet Live Complete!</Typography>
                <Typography variant="h5" sx={{ color: P.green.border, mt: 1 }}>Score: {score} / 6</Typography>
                <Typography variant="body1" sx={{ color: P.green.shadow, mt: 1 }}>{score === 6 ? 'Perfect C1-level answers! All questions answered with sophistication!' : score >= 4 ? 'Great job! Strong C1-level responses!' : 'Good effort! Keep practicing C1 comprehension skills!'}</Typography>
              </Box>
              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task D →</Box>
              </Stack>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
