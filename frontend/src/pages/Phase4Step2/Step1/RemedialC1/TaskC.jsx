import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level C1 - Task C: Advanced Quiz with Justifications
 */

const QUESTIONS = [
  { id: 1, question: 'Which metric best measures authentic audience engagement in influencer marketing?', options: ['Total follower count', 'Engagement rate and comment quality', 'Number of posts', 'Profile views'], correct: 'Engagement rate and comment quality' },
  { id: 2, question: 'What is the primary advantage of organic reach over paid advertising?', options: ['Faster results', 'Guaranteed visibility', 'Higher authenticity and trust', 'Lower cost per view'], correct: 'Higher authenticity and trust' },
  { id: 3, question: 'In social media analytics, what does "conversion rate" specifically measure?', options: ['Percentage of viewers who like content', 'Percentage of users who take desired action', 'Total number of shares', 'Average time spent viewing'], correct: 'Percentage of users who take desired action' },
  { id: 4, question: 'Which factor is most critical for content to achieve viral status?', options: ['High production budget', 'Celebrity endorsement', 'Emotional resonance and shareability', 'Professional photography'], correct: 'Emotional resonance and shareability' },
  { id: 5, question: 'What distinguishes micro-influencers from macro-influencers in marketing strategy?', options: ['Content quality', 'Posting frequency', 'Niche audience with higher engagement', 'Number of platforms used'], correct: 'Niche audience with higher engagement' },
  { id: 6, question: 'How does A/B testing optimize social media campaigns?', options: ['Increases post frequency', 'Compares two versions to identify better performance', 'Reduces advertising costs', 'Expands audience demographics'], correct: 'Compares two versions to identify better performance' }
]

export default function Phase4_2RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
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

  const handleAnswerChange = (questionId, answer) => setAnswers({ ...answers, [questionId]: answer })
  const handleJustificationChange = (questionId, text) => setJustifications({ ...justifications, [questionId]: text })

  const handleSubmit = () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const normalizedScore = (correctCount / QUESTIONS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_c1_taskC_score', normalizedScore.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_c1_taskC_max', '10')
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'C', score, max_score: maxScore, answers, justifications })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id])
  const allJustified = QUESTIONS.every(q => justifications[q.id] && justifications[q.id].trim().length > 20)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task C: Advanced Quiz with Justifications</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="EMNA" message="Answer these advanced questions about social media promotion strategies. For each question, select the best answer AND write a justification explaining your reasoning using sophisticated terminology." />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Answer all 6 questions and provide justifications for each answer (minimum 20 words per justification).</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {QUESTIONS.map((q, index) => {
              const isCorrect = answers[q.id] === q.correct
              const cardColor = showResults ? (isCorrect ? P.green : P.red) : P.blue
              return (
                <Box key={q.id} sx={{ bgcolor: cardColor.bg, border: `2px solid ${cardColor.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${cardColor.shadow}`, p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: cardColor.shadow }}>Question {index + 1} of {QUESTIONS.length}</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: cardColor.shadow }}>{q.question}</Typography>

                  <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                    <RadioGroup value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                      {q.options.map((option) => {
                        let optBg = 'transparent'
                        if (showResults) {
                          if (option === q.correct) optBg = P.green.bg
                          else if (answers[q.id] === option) optBg = P.red.bg
                        }
                        return (
                          <FormControlLabel key={option} value={option} control={<Radio disabled={showResults} sx={{ color: cardColor.border, '&.Mui-checked': { color: cardColor.shadow } }} />}
                            label={<Typography sx={{ color: cardColor.shadow }}>{option}</Typography>}
                            sx={{ mb: 0.5, p: 0.5, borderRadius: '8px', bgcolor: optBg, transition: 'background 0.2s' }}
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ height: 1, bgcolor: cardColor.border, mb: 2, opacity: 0.4 }} />

                  <Typography variant="subtitle2" gutterBottom sx={{ color: cardColor.shadow }}>Justify your answer (minimum 20 words):</Typography>
                  <TextField fullWidth multiline rows={3} value={justifications[q.id] || ''} onChange={(e) => handleJustificationChange(q.id, e.target.value)}
                    placeholder="Explain why you chose this answer using specific examples and terminology..."
                    variant="outlined" disabled={showResults} sx={{ mb: 0.5, '& .MuiOutlinedInput-root': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', '& fieldset': { borderColor: cardColor.border } } }}
                  />
                  <Typography variant="caption" sx={{ color: (justifications[q.id]?.trim().split(/\s+/).filter(w => w.length > 0).length || 0) >= 20 ? P.green.shadow : cardColor.shadow, fontWeight: (justifications[q.id]?.trim().split(/\s+/).filter(w => w.length > 0).length || 0) >= 20 ? 'bold' : 'normal' }}>
                    Words: {justifications[q.id]?.trim().split(/\s+/).filter(w => w.length > 0).length || 0}
                    {(justifications[q.id]?.trim().split(/\s+/).filter(w => w.length > 0).length || 0) >= 20 && ' ✓'}
                  </Typography>

                  {showResults && (
                    <Box sx={{ bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow }} /> : <CancelIcon sx={{ color: P.red.shadow }} />}
                      <Typography sx={{ color: isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 600 }}>
                        {isCorrect ? `Correct! ${q.correct}` : `Incorrect. Correct answer: ${q.correct}`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {showResults && (
            <Box sx={{ bgcolor: score >= 5 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>Quiz Complete!</Typography>
              <Typography sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>You scored {score}/{QUESTIONS.length} ({((score / QUESTIONS.length) * 100).toFixed(0)}%)</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 4 }}>
            {!showResults && (
              <>
                <Box component="button" onClick={handleSubmit} disabled={!allAnswered || !allJustified} sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered || !allJustified ? 'not-allowed' : 'pointer',
                  color: P.blue.shadow, opacity: !allAnswered || !allJustified ? 0.6 : 1,
                  '&:hover': allAnswered && allJustified ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                }}>Submit Quiz</Box>
                {!allAnswered && <Typography variant="body2" sx={{ color: 'text.secondary' }}>Please answer all questions before submitting</Typography>}
                {allAnswered && !allJustified && <Typography variant="body2" sx={{ color: 'text.secondary' }}>Please provide justifications for all questions (minimum 20 words each)</Typography>}
              </>
            )}
            {showResults && (
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/c1/taskD')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task D</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
