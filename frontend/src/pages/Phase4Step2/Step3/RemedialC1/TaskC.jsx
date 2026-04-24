import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task C: Quizlet Live (Advanced Quiz)
 * Create and answer quiz on 6 sophisticated social media terms
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

const TERMS = [
  { id: 1, term: 'Hashtag', question: 'What is the primary function of hashtags in social media?', correctAnswer: 'Discoverability amplifier' },
  { id: 2, term: 'Caption', question: 'What is the core purpose of post captions?', correctAnswer: 'Narrative engagement' },
  { id: 3, term: 'Emoji', question: 'What role do emojis play in digital communication?', correctAnswer: 'Emotional cue' },
  { id: 4, term: 'Call-to-Action (CTA)', question: 'How does a call-to-action function in social media posts?', correctAnswer: 'Behavioral trigger' },
  { id: 5, term: 'Tagging', question: 'What is the primary benefit of user tagging?', correctAnswer: 'Network expansion' },
  { id: 6, term: 'Viral Content', question: 'What best describes the dynamic of viral content?', correctAnswer: 'Organic amplification' }
]

export default function Phase4_2Step3RemedialC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/3/remedial/c1/taskD') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleAnswerChange = (id, text) => {
    setAnswers({ ...answers, [id]: text })
  }

  const calculateScore = () => {
    let correctCount = 0
    TERMS.forEach(term => {
      const userAnswer = (answers[term.id] || '').toLowerCase().trim()
      const correctAnswer = term.correctAnswer.toLowerCase().trim()
      const isCorrect = userAnswer.includes(correctAnswer) ||
                       userAnswer.includes(correctAnswer.replace(' ', ''))
      if (isCorrect) correctCount++
    })
    return correctCount
  }

  const handleSubmit = () => {
    const correctCount = calculateScore()
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase4_2_step3_c1_taskC_score', correctCount)
    logTaskCompletion(correctCount, TERMS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', task: 'C', score: score, max_score: maxScore, answers: answers })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/taskD')
  }

  const allAnswered = TERMS.every(term => {
    const answer = answers[term.id] || ''
    return answer.trim().split(/\s+/).filter(w => w.length > 0).length >= 2
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard('orange'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 4.2 · Step 3 · Level C1 · Task C
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>
              Quizlet Live
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Create and answer a sophisticated quiz on 6 social media terms. Provide detailed, precise answers that demonstrate your C1-level understanding of these concepts. Use professional terminology and avoid simplistic definitions."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ ...clayCard('yellow'), mb: 3 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: P.yellow.border }}>Instructions:</Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 0.5 }}>
              Answer each question with detailed, precise responses (minimum 2-3 words each). Focus on the functional role or core purpose of each element.
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 1 }}>
              <strong>Expected answers:</strong> Discoverability amplifier, Narrative engagement, Emotional cue, Behavioral trigger, Network expansion, Organic amplification.
            </Typography>
          </Box>

          {/* Quiz Questions */}
          <Box sx={{ mb: 3 }}>
            {TERMS.map((term, index) => {
              const wordCount = (answers[term.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
              const userAnswer = (answers[term.id] || '').toLowerCase().trim()
              const isCorrect = showResults && (
                userAnswer.includes(term.correctAnswer.toLowerCase()) ||
                userAnswer.includes(term.correctAnswer.toLowerCase().replace(' ', ''))
              )

              return (
                <Box key={term.id} sx={{ ...clayCard('blue'), mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>
                    Question {index + 1} of {TERMS.length}
                  </Typography>

                  <Box sx={{ bgcolor: isDark ? '#1a2a3a' : P.blue.bg, borderRadius: '12px', p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark ? '#ccc' : '#1a252f', mb: 0.5 }}>
                      Term: {term.term}
                    </Typography>
                    <Typography variant="body1" sx={{ color: isDark ? '#ddd' : '#333' }}>{term.question}</Typography>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={answers[term.id] || ''}
                    onChange={(e) => handleAnswerChange(term.id, e.target.value)}
                    placeholder="Provide a detailed, precise answer using professional terminology..."
                    variant="outlined"
                    disabled={showResults}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? '#1a1a2e' : 'white',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: P.blue.border, borderWidth: 2 },
                        '&:hover fieldset': { borderColor: P.blue.shadow },
                        '&.Mui-focused fieldset': { borderColor: P.blue.shadow },
                        '& textarea': { color: isDark ? '#eee' : '#1a252f' }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: wordCount >= 2 ? P.green.border : (isDark ? '#aaa' : '#666'), fontWeight: wordCount >= 2 ? 'bold' : 'normal' }}>
                    Words: {wordCount} {wordCount >= 2 && '✓'}
                  </Typography>

                  {showResults && (
                    <Box sx={{ ...clayCard(isCorrect ? 'green' : 'teal'), mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {isCorrect && <CheckCircleIcon sx={{ color: P.green.border, fontSize: 18 }} />}
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isCorrect ? P.green.border : P.teal.border }}>
                          {isCorrect ? 'Correct!' : 'Expected Answer:'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: isDark ? '#ddd' : '#333' }}>{term.correctAnswer}</Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{ ...clayCard(score >= 5 ? 'green' : 'yellow'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: score >= 5 ? P.green.border : P.yellow.border, mb: 1 }}>
                Quiz Complete!
              </Typography>
              <Typography sx={{ color: isDark ? '#ddd' : '#333' }}>
                You scored {score}/{TERMS.length} ({((score / TERMS.length) * 100).toFixed(0)}%)
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#bbb' : '#555', mt: 1 }}>
                {score >= 5 ? 'Excellent understanding of sophisticated social media terminology!' : 'Review the correct answers and refine your understanding of these concepts.'}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {!showResults && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allAnswered}
                sx={{
                  ...clayCard('blue'),
                  cursor: allAnswered ? 'pointer' : 'not-allowed',
                  opacity: allAnswered ? 1 : 0.5,
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.blue.border,
                  display: 'inline-block',
                  '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                Submit Quiz
              </Box>
            )}
            {showResults && (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task D <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

          {!showResults && !allAnswered && (
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', textAlign: 'center', mt: 2 }}>
              Please answer all questions (minimum 2 words each)
            </Typography>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
