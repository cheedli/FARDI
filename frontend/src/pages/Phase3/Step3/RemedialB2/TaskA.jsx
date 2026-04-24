import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, TextField, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level B2 - Task A: Structured Explanation
 * Write a paragraph explaining two costs and how they are funded
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

export default function Phase3Step3RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_b2' })
  const muiTheme = useTheme()
  const dark = muiTheme.palette.mode === 'dark'

  const D = dark
    ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
    : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }

  const C = dark
    ? {
        green:  { bg: '#1B2E1B', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#0D1B2A', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#2A1500', border: '#F57C00', shadow: '#F57C00' },
        purple: { bg: '#1E0A26', border: '#8E24AA', shadow: '#8E24AA' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
        purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
      }

  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const cardSx = (c) => ({
    bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 2.5,
  })

  const handleSubmit = async () => {
    if (response.trim().length < 100) {
      alert('Please write a well-developed paragraph (minimum 100 characters).')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await fetch('/api/phase3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2', task: 'A',
          answers: { 1: response },
          prompts: { 1: "Write a paragraph explaining two costs and how they are funded, using comparison and cohesion" }
        })
      })
      const data = await result.json()
      const totalScore = data.total_score || 0
      const maxScore = data.max_score || 1
      setEvaluation({ score: totalScore, maxScore, feedback: data.evaluations?.[0]?.feedback || 'Good work!', evaluation: data.evaluations?.[0]?.evaluation || '' })
      setShowResults(true)
      await logTaskCompletion(totalScore, maxScore)
    } catch (error) {
      console.error('Failed to submit response:', error)
      const score = response.length > 150 ? 1 : 0.7
      setEvaluation({ score, maxScore: 1, feedback: 'Your response has been recorded.', evaluation: 'Good effort!' })
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B2', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 3 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase3/step/3/remedial/c1/taskA') }
  window.__remedialSkip = handleNext
  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasMinimumLength = response.trim().length >= 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.orange), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.orange.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Remedial B2
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Structured Explanation</Typography>
            <Typography sx={{ color: D.muted }}>Write a paragraph explaining two costs and their funding sources</Typography>
          </Box>
        </motion.div>

        {/* Instructor */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="For B2 level, you need to write well-structured explanations! Write a clear paragraph that explains TWO different costs from the festival budget and describes how each one is funded. Use comparison words like 'while' or 'whereas' to show differences, and make sure your paragraph flows smoothly."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Task:</Typography>
            <Typography sx={{ color: D.body, fontSize: '0.9rem', mb: 1 }}>
              Write a paragraph explaining two budget costs and their funding sources.
            </Typography>
            {[
              'Choose TWO costs (e.g., venue rental, sound equipment, catering, promotion)',
              'Explain how EACH cost is funded',
              'Use comparison language: while, whereas, more/less than',
              'Ensure good cohesion with connectors: because, so, however, in addition',
            ].map((t, i) => (
              <Typography key={i} sx={{ color: D.muted, fontSize: '0.88rem', mb: 0.5 }}>• {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Language Tools */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...cardSx(C.green), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Useful Language for B2:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {['while', 'whereas', 'however', 'in addition', 'furthermore', 'more expensive than'].map((word, i) => (
                <Box key={i} sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.green.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>
                  {word}
                </Box>
              ))}
            </Box>
            <Typography sx={{ color: D.muted, fontSize: '0.85rem', fontStyle: 'italic' }}>
              Example: "The venue rental costs $800, while the sound equipment requires $500. <strong>Whereas</strong> the venue is covered by a university grant, the sound system is funded through sponsor donations."
            </Typography>
          </Box>
        </motion.div>

        {/* Paragraph Should Include */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ ...cardSx(C.purple), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Your paragraph should include:</Typography>
            <Box component="ul" sx={{ pl: 2.5, my: 0 }}>
              {['Introduction of the two costs', 'Explanation of funding source for each', 'Comparison or contrast between them', 'Smooth transitions and logical flow'].map((point, i) => (
                <Typography key={i} component="li" sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>{point}</Typography>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Writing Area */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <Box sx={{ ...cardSx(C.yellow), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Your Answer:</Typography>
              <TextField
                multiline rows={10} fullWidth variant="outlined"
                placeholder="Write your structured paragraph here..."
                value={response} onChange={(e) => setResponse(e.target.value)} disabled={isSubmitting}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: D.cardBg, color: D.body, borderRadius: '12px',
                    '& fieldset': { borderColor: D.divider },
                    '&:hover fieldset': { borderColor: C.yellow.border },
                    '&.Mui-focused fieldset': { borderColor: C.yellow.border },
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: hasMinimumLength ? C.green.border : D.muted, fontSize: '0.85rem' }}>
                  Words: {wordCount} | Characters: {response.length}
                </Typography>
                {!hasMinimumLength && (
                  <Typography sx={{ color: '#C62828', fontSize: '0.8rem' }}>Write at least 100 characters</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={!hasMinimumLength || isSubmitting}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    bgcolor: hasMinimumLength && !isSubmitting ? C.orange.border : D.divider,
                    color: '#fff', px: 4, py: 1.5, borderRadius: '14px',
                    border: `2px solid ${hasMinimumLength && !isSubmitting ? C.orange.border : D.divider}`,
                    boxShadow: hasMinimumLength && !isSubmitting ? `4px 4px 0 #E65100` : 'none',
                    fontWeight: 800, fontSize: '1rem', cursor: hasMinimumLength && !isSubmitting ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                    '&:hover': hasMinimumLength && !isSubmitting ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #E65100' } : {},
                  }}
                >
                  {isSubmitting ? <><CircularProgress size={18} sx={{ color: '#fff', mr: 1 }} />Evaluating...</> : 'Submit Answer'}
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Results */}
        {showResults && evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <Box sx={{ ...cardSx(evaluation.score >= 0.8 ? C.green : C.blue), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Evaluation Complete!</Typography>
              <Typography sx={{ color: D.body, mb: 0.75 }}><strong>Score:</strong> {evaluation.score}/{evaluation.maxScore}</Typography>
              <Typography sx={{ color: D.body, fontSize: '0.9rem', mb: 0.75 }}><strong>Feedback:</strong> {evaluation.feedback}</Typography>
              {evaluation.evaluation && (
                <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>{evaluation.evaluation}</Typography>
              )}
            </Box>

            <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Your Response:</Typography>
              <Box sx={{ bgcolor: D.cardBg, borderRadius: '12px', p: 2 }}>
                <Typography sx={{ color: D.body, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{response}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  bgcolor: C.green.border, color: '#fff',
                  px: 4, py: 1.5, borderRadius: '14px',
                  border: `2px solid ${C.green.border}`,
                  boxShadow: `4px 4px 0 #2E7D32`,
                  fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #2E7D32' },
                }}
              >
                Continue to C1 Practice <ArrowForwardIcon fontSize="small" />
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
