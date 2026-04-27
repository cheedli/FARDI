import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Container, Stack
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level C1 - Task C: Advanced Quiz
 * 6 questions with detailed answers and justifications
 */

const QUESTIONS = [
  { id: 1, question: 'What is the primary purpose of using hashtags in Instagram posts?', options: ['To make posts look professional', 'To increase discoverability and reach new audiences', 'To show trending topics', 'To categorize personal content'], correct: 'To increase discoverability and reach new audiences' },
  { id: 2, question: 'Which element of a caption is most effective for driving engagement?', options: ['Length of the caption', 'Use of technical jargon', 'Compelling storytelling and emotional connection', 'Number of emojis used'], correct: 'Compelling storytelling and emotional connection' },
  { id: 3, question: 'Why are emojis considered powerful in social media communication?', options: ['They reduce character count', 'They convey emotion and enhance visual appeal', 'They are required by Instagram', 'They replace the need for captions'], correct: 'They convey emotion and enhance visual appeal' },
  { id: 4, question: 'What makes a call-to-action (CTA) effective in Instagram posts?', options: ['Using ALL CAPS for emphasis', 'Being vague to create curiosity', 'Being clear, specific, and action-oriented', 'Placing it at the beginning of the caption'], correct: 'Being clear, specific, and action-oriented' },
  { id: 5, question: 'How does tagging users in posts contribute to engagement?', options: ['It automatically increases follower count', 'It notifies tagged users and expands reach to their networks', 'It improves post quality', 'It reduces spam detection'], correct: 'It notifies tagged users and expands reach to their networks' },
  { id: 6, question: 'Which metric best indicates true audience engagement beyond vanity metrics?', options: ['Number of followers', 'Post impressions', 'Comment quality and conversation depth', 'Profile visits'], correct: 'Comment quality and conversation depth' }
]

export default function Phase4_2Step2RemedialC1TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, answer) => { setAnswers({ ...answers, [questionId]: answer }) }
  const handleJustificationChange = (questionId, text) => { setJustifications({ ...justifications, [questionId]: text }) }

  const handleSubmit = () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const normalizedScore = (correctCount / QUESTIONS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskC_score', normalizedScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskC_max', '10')
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'C', score: score, max_score: maxScore, answers: answers, justifications: justifications })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase4_2/step/2/remedial/c1/taskD') }
  window.__remedialSkip = handleNext
  const allAnswered = QUESTIONS.every(q => answers[q.id])
  const allJustified = QUESTIONS.every(q => justifications[q.id] && justifications[q.id].trim().length > 20)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>
              Level C1 - Task C: Advanced Quiz with Justifications
            </Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Answer these advanced questions about Instagram post strategies. For each question, select the best answer AND write a justification explaining your reasoning using sophisticated terminology."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              <strong>Instructions:</strong> Answer all 6 questions and provide justifications for each answer (minimum 20 words per justification).
            </Typography>
          </Box>

          {/* Questions */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            {QUESTIONS.map((q, index) => (
              <Box key={q.id} sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Question {index + 1} of {QUESTIONS.length}
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: isDark ? '#eee' : '#1a252f', mb: 2 }}>
                  {q.question}
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                  <RadioGroup value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                    {q.options.map((option) => {
                      const isSelected = answers[q.id] === option
                      const isCorrectOption = option === q.correct
                      let optionBg = 'transparent'
                      if (showResults && isSelected) {
                        optionBg = isCorrectOption ? P.green.bg : P.red.bg
                      }
                      return (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                          disabled={showResults}
                          sx={{ mb: 1, p: 1, borderRadius: '10px', bgcolor: optionBg }}
                        />
                      )
                    })}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ borderTop: `1px solid ${P.yellow.border}`, pt: 2, mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: P.yellow.shadow }}>
                    Justify your answer (minimum 20 words):
                  </Typography>
                  <TextField
                    fullWidth multiline rows={3}
                    value={justifications[q.id] || ''}
                    onChange={(e) => handleJustificationChange(q.id, e.target.value)}
                    placeholder="Explain why you chose this answer using specific examples and terminology..."
                    variant="outlined" disabled={showResults}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDark ? '#1a1a2e' : 'white',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: P.yellow.border },
                        '& textarea': { color: isDark ? '#eee' : '#1a252f' }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>
                    Words: {justifications[q.id]?.trim().split(/\s+/).filter(w => w.length > 0).length || 0}
                  </Typography>
                </Box>

                {showResults && (
                  <Box sx={{
                    bgcolor: answers[q.id] === q.correct ? P.green.bg : P.red.bg,
                    border: `2px solid ${answers[q.id] === q.correct ? P.green.border : P.red.border}`,
                    borderRadius: '12px', p: 2, mt: 2,
                    display: 'flex', alignItems: 'center', gap: 1
                  }}>
                    {answers[q.id] === q.correct ? (
                      <><CheckCircleIcon sx={{ color: P.green.shadow }} /><Typography sx={{ color: P.green.shadow }}>Correct! {q.correct}</Typography></>
                    ) : (
                      <><CancelIcon sx={{ color: P.red.shadow }} /><Typography sx={{ color: P.red.shadow }}>Incorrect. Correct answer: {q.correct}</Typography></>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{
              bgcolor: score >= 5 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`,
              borderRadius: '16px',
              boxShadow: `3px 3px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                Quiz Complete!
              </Typography>
              <Typography sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                You scored {score}/{QUESTIONS.length} ({((score / QUESTIONS.length) * 100).toFixed(0)}%)
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered || !allJustified} sx={{
                bgcolor: allAnswered && allJustified ? P.green.bg : P.blue.bg,
                border: `2px solid ${allAnswered && allJustified ? P.green.border : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${allAnswered && allJustified ? P.green.shadow : P.blue.shadow}`,
                px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: allAnswered && allJustified ? 'pointer' : 'not-allowed',
                color: allAnswered && allJustified ? P.green.shadow : P.blue.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': allAnswered && allJustified ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
              }}>
                Submit Quiz
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.blue.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
              }}>
                <ArrowForwardIcon /> Continue to Task D
              </Box>
            )}
            {!showResults && !allAnswered && (
              <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', textAlign: 'center' }}>
                Please answer all questions before submitting
              </Typography>
            )}
            {!showResults && allAnswered && !allJustified && (
              <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', textAlign: 'center' }}>
                Please provide justifications for all questions (minimum 20 words each)
              </Typography>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
