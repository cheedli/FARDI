import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level B1 - Task C: Wordshake Quiz
 * Multiple choice questions on social media terms
 */

const QUESTIONS = [
  { question: 'What is a hashtag used for?', options: ['Make post seen by more people', 'Delete a post', 'Send a message'], correct: 0 },
  { question: 'What is a caption?', options: ['A photo filter', 'Words under a photo', 'A video clip'], correct: 1 },
  { question: 'What is an emoji for?', options: ['Show feeling or emotion', 'Tag a person', 'Share a link'], correct: 0 },
  { question: 'What does "tag" mean?', options: ['Delete a comment', 'Mention a person with @', 'Block someone'], correct: 1 },
  { question: 'What is a call-to-action?', options: ['A phone number', 'Tell people to do something', 'A video call'], correct: 1 },
  { question: 'How long does a story last?', options: ['1 hour', 'Forever', '24 hours'], correct: 2 }
]

export default function Phase4_2Step3RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_b1' })
  const [selectedAnswers, setSelectedAnswers] = useState(Array(6).fill(null))
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
    sessionStorage.setItem('phase4_2_step3_b1_taskC', correctCount.toString())
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'B1', task: 'C', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase4_2/step/3/remedial/b1/taskD') }

  const allAnswered = selectedAnswers.every(answer => answer !== null)
  const passThreshold = 5

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>Phase 4.2 Step 3 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task C: Wordshake Quiz</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Test your knowledge! Answer these questions about social media terms." />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1"><strong>Instructions:</strong> Answer 6 multiple-choice questions about social media terms.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><strong>Evaluation:</strong> Each correct answer earns 1 point. You need {passThreshold}/6 to pass.</Typography>
          </Box>

          {/* Questions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            {QUESTIONS.map((q, qIndex) => {
              const correct = checkAnswer(qIndex)
              let bg = P.orange.bg; let border = P.orange.border; let shadow = P.orange.shadow
              if (showResults && correct) { bg = P.green.bg; border = P.green.border; shadow = P.green.shadow }
              else if (showResults && !correct) { bg = P.red.bg; border = P.red.border; shadow = P.red.shadow }
              else if (selectedAnswers[qIndex] !== null) { bg = P.blue.bg; border = P.blue.border; shadow = P.blue.shadow }

              return (
                <Box key={qIndex} sx={{ bgcolor: bg, border: `2px solid ${border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${shadow}`, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.blue.shadow }}>
                    Question {qIndex + 1}: {q.question}
                  </Typography>
                  <RadioGroup
                    value={selectedAnswers[qIndex] !== null ? selectedAnswers[qIndex] : ''}
                    onChange={(e) => handleAnswerChange(qIndex, parseInt(e.target.value))}
                  >
                    {q.options.map((option, oIndex) => {
                      const isCorrectOption = oIndex === q.correct
                      const isSelectedWrong = showResults && oIndex === selectedAnswers[qIndex] && oIndex !== q.correct
                      return (
                        <FormControlLabel
                          key={oIndex}
                          value={oIndex}
                          control={<Radio />}
                          label={option}
                          disabled={showResults}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: showResults && isCorrectOption ? P.green.shadow : showResults && isSelectedWrong ? P.red.shadow : 'inherit',
                              fontWeight: showResults && isCorrectOption ? 'bold' : 'normal'
                            }
                          }}
                        />
                      )
                    })}
                  </RadioGroup>
                  {showResults && !correct && (
                    <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', mt: 2, p: 1.5 }}>
                      <Typography variant="body2">Correct answer: <strong>{q.options[q.correct]}</strong></Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Results */}
          {showResults && (
            <Box sx={{
              bgcolor: score >= passThreshold ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= passThreshold ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= passThreshold ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {score >= passThreshold
                  ? `Excellent! You scored ${score}/6 points!`
                  : `You got ${score}/6 correct. You need at least ${passThreshold}/6 to pass. Review the answers!`}
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: allAnswered ? 'pointer' : 'not-allowed', color: P.orange.shadow, opacity: allAnswered ? 1 : 0.5,
                '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none' }
              }}>Submit Answers</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Continue to Task D <ArrowForwardIcon /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
