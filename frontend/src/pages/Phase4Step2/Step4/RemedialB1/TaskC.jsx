import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Alert,
  Container,
  Link,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const QUESTIONS = [
  { question: 'What is a hashtag used for?', options: ['Use # for search', 'Delete a post', 'Send a message'], correct: 0 },
  { question: 'What is a caption?', options: ['A photo filter', 'Words under photo', 'A video clip'], correct: 1 },
  { question: 'What is an emoji for?', options: ['Show feeling', 'Tag a person', 'Share a link'], correct: 0 },
  { question: 'What does "tag" mean?', options: ['Delete a comment', 'Mention person', 'Block someone'], correct: 1 },
  { question: 'What is a call-to-action?', options: ['A phone number', 'Tell to do', 'A video call'], correct: 1 },
  { question: 'What does "viral" mean?', options: ['Post is deleted', 'Spread fast', 'Post is private'], correct: 1 },
]

export default function Phase4_2Step4RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 4, interaction: 3, context: 'remedial_b1' })
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

  const [selectedAnswers, setSelectedAnswers] = useState(Array(6).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const checkAnswer = (questionIndex) => selectedAnswers[questionIndex] === QUESTIONS[questionIndex].correct

  const handleSubmit = () => {
    let correctCount = 0
    selectedAnswers.forEach((answer, index) => { if (answer === QUESTIONS[index].correct) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase4_2_step4_b1_taskC', correctCount.toString())
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 4, level: 'B1', task: 'C', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/4/remedial/b1/results') }

  const allAnswered = selectedAnswers.every(answer => answer !== null)
  const passThreshold = 5

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task C: Wordshake Quiz</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Test your knowledge! Answer these questions about social media terms." />
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}><strong>Instructions:</strong> Answer 6 multiple-choice questions about social media terms.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.teal.shadow }}><strong>Scoring:</strong> 1 point per correct answer. Need {passThreshold}/6 to pass.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.green.shadow, mb: 1 }}>Wordshake Practice</Typography>
            <Typography variant="body2" sx={{ color: P.green.shadow, mb: 1 }}>Want more practice? Try the British Council's Wordshake game!</Typography>
            <Link href="https://learnenglish.britishcouncil.org/games/wordshake" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: P.green.shadow }}>
              Play Wordshake <OpenInNewIcon fontSize="small" />
            </Link>
          </Box>

          <Box sx={{ mb: 4 }}>
            {QUESTIONS.map((q, qIndex) => {
              let cardBg = P.teal.bg, cardBorder = P.teal.border, cardShadow = P.teal.shadow
              if (showResults) {
                cardBg = checkAnswer(qIndex) ? P.green.bg : P.red.bg
                cardBorder = checkAnswer(qIndex) ? P.green.border : P.red.border
                cardShadow = checkAnswer(qIndex) ? P.green.shadow : P.red.shadow
              } else if (selectedAnswers[qIndex] !== null) {
                cardBg = P.blue.bg; cardBorder = P.blue.border; cardShadow = P.blue.shadow
              }
              return (
                <Box key={qIndex} sx={{ bgcolor: cardBg, border: `2px solid ${cardBorder}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${cardShadow}`, p: 3, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Q{qIndex + 1}: {q.question}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {q.options.map((option, oIndex) => {
                      const isSelected = selectedAnswers[qIndex] === oIndex
                      const isCorrectOption = showResults && oIndex === q.correct
                      const isWrongSelected = showResults && isSelected && oIndex !== q.correct
                      return (
                        <Box key={oIndex} component="button" onClick={() => !showResults && handleAnswerChange(qIndex, oIndex)} sx={{
                          bgcolor: isCorrectOption ? P.green.bg : isWrongSelected ? P.red.bg : isSelected ? P.purple.bg : 'white',
                          border: `2px solid ${isCorrectOption ? P.green.border : isWrongSelected ? P.red.border : isSelected ? P.purple.border : P.teal.border}`,
                          borderRadius: '10px', px: 2, py: 1, textAlign: 'left', cursor: showResults ? 'default' : 'pointer',
                          fontWeight: isCorrectOption ? 'bold' : 'normal',
                          color: isCorrectOption ? P.green.shadow : isWrongSelected ? P.red.shadow : isSelected ? P.purple.shadow : 'inherit',
                          '&:hover': { bgcolor: showResults ? undefined : P.blue.bg },
                        }}>
                          <Typography variant="body1">{option}</Typography>
                        </Box>
                      )
                    })}
                  </Box>
                  {showResults && !checkAnswer(qIndex) && (
                    <Alert severity="info" sx={{ mt: 2 }}>Correct answer: {q.options[q.correct]}</Alert>
                  )}
                </Box>
              )
            })}
          </Box>

          {showResults && (
            <Box sx={{
              bgcolor: score >= passThreshold ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= passThreshold ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= passThreshold ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography sx={{ color: score >= passThreshold ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {score >= passThreshold ? `Excellent! You scored ${score}/6 points!` : `You got ${score}/6 correct. Need ${passThreshold}/6 to pass. Review the answers!`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.5 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>Submit Answers</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Results <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
