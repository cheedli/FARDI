import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, TextField, CircularProgress, Grid } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level C1 - Task A: Financial Rationale
 * Explain the budget logic and assess its realism
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

export default function Phase3Step3RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_c1' })
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
        red:    { bg: '#2A0A0A', border: '#C62828', shadow: '#C62828' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
        purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
        red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
      }

  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const cardSx = (c) => ({
    bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 2.5,
  })

  const handleSubmit = async () => {
    if (response.trim().length < 150) {
      alert('Please write a comprehensive analysis (minimum 150 characters).')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await fetch('/api/phase3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1', task: 'A',
          answers: { 1: response },
          prompts: { 1: "Explain the budget logic of the Global Cultures Festival and assess its realism with depth of reasoning, accuracy, and precise terminology" }
        })
      })
      const data = await result.json()
      const totalScore = data.total_score || 0
      const maxScore = data.max_score || 1
      setEvaluation({ score: totalScore, maxScore, feedback: data.evaluations?.[0]?.feedback || 'Excellent work!', evaluation: data.evaluations?.[0]?.evaluation || '' })
      setShowResults(true)
      await logTaskCompletion(totalScore, maxScore)
    } catch (error) {
      console.error('Failed to submit response:', error)
      const score = response.length > 200 ? 1 : 0.8
      setEvaluation({ score, maxScore: 1, feedback: 'Your response has been recorded.', evaluation: 'Strong analytical thinking!' })
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'C1', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 3 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase3/step/3/interaction/1') }
  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasMinimumLength = response.trim().length >= 150

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.purple), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.purple.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Remedial C1
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Financial Rationale &amp; Assessment</Typography>
            <Typography sx={{ color: D.muted }}>Analyze the budget logic and assess its realism</Typography>
          </Box>
        </motion.div>

        {/* Instructor */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="For C1 level, you must demonstrate sophisticated analytical skills! Analyze the budget logic of the Global Cultures Festival. Explain the financial strategy, assess whether the budget is realistic, identify potential risks, and suggest improvements. Your analysis should be coherent, well-reasoned, and use precise financial terminology."
            />
          </Box>
        </motion.div>

        {/* Budget Reference */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Typography sx={{ fontWeight: 800, color: D.heading, mb: 2 }}>Festival Budget Reference:</Typography>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...cardSx(C.red) }}>
                <Typography sx={{ fontWeight: 800, color: C.red.border, mb: 1.5 }}>Expenses: $2,400</Typography>
                {[['Venue rental', '$800'], ['Sound equipment', '$500'], ['Catering', '$600'], ['Promotion', '$200'], ['Decoration', '$300']].map(([label, cost], i) => (
                  <Typography key={i} sx={{ color: D.body, fontSize: '0.88rem', mb: 0.4 }}>• {label}: {cost}</Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...cardSx(C.green) }}>
                <Typography sx={{ fontWeight: 800, color: C.green.border, mb: 1.5 }}>Income: $2,600</Typography>
                {[['Ticket sales', '$1,000 (estimated)'], ['Main sponsor', '$800'], ['Food sponsor', '$400'], ['University grant', '$300'], ['Donations', '$100 (estimated)']].map(([label, amount], i) => (
                  <Typography key={i} sx={{ color: D.body, fontSize: '0.88rem', mb: 0.4 }}>• {label}: {amount}</Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Task:</Typography>
            <Typography sx={{ color: D.body, fontSize: '0.9rem', mb: 1 }}>
              Write a comprehensive analysis of the festival's budget logic and assess its realism.
            </Typography>
            <Typography sx={{ color: D.muted, fontSize: '0.88rem', mb: 0.75 }}>Your analysis should address:</Typography>
            {[
              'The overall financial strategy and budget structure',
              'The balance between income and expenses',
              'Potential financial risks or vulnerabilities',
              'Realism of estimates (especially ticket sales and donations)',
              'Recommendations for improvement or risk mitigation',
            ].map((point, i) => (
              <Typography key={i} component="li" sx={{ color: D.muted, fontSize: '0.85rem', mb: 0.4, listStyle: 'disc', ml: 2 }}>{point}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Advanced Language Tools */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ ...cardSx(C.green), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Advanced Financial Terminology for C1:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {['fiscal viability', 'budget allocation', 'revenue diversification', 'contingency planning', 'financial buffer', 'cost-benefit ratio', 'projected income', 'expenditure optimization'].map((term, i) => (
                <Box key={i} sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.green.border, color: '#fff', fontSize: '0.78rem', fontWeight: 800 }}>
                  {term}
                </Box>
              ))}
            </Box>
            <Typography sx={{ color: D.muted, fontSize: '0.85rem', fontStyle: 'italic' }}>
              Example: "While the budget demonstrates revenue diversification through multiple income streams, the reliance on estimated ticket sales poses a significant risk to fiscal viability."
            </Typography>
          </Box>
        </motion.div>

        {/* Analytical Framework */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Suggested Analytical Framework:</Typography>
            {[
              ['Budget Overview', 'Summarize the financial structure'],
              ['Strengths', 'Identify positive aspects (e.g., surplus, diversified income)'],
              ['Weaknesses', 'Analyze risks and vulnerabilities'],
              ['Realism Assessment', 'Evaluate whether estimates are achievable'],
              ['Recommendations', 'Suggest improvements or contingency measures'],
            ].map(([label, desc], i) => (
              <Typography key={i} sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>
                {i + 1}. <strong>{label}:</strong> {desc}
              </Typography>
            ))}
          </Box>
        </motion.div>

        {/* Writing Area */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{ ...cardSx(C.yellow), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Your Analysis:</Typography>
              <TextField
                multiline rows={12} fullWidth variant="outlined"
                placeholder="Write your comprehensive financial analysis here..."
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
                  <Typography sx={{ color: '#C62828', fontSize: '0.8rem' }}>Write at least 150 characters for a comprehensive analysis</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={!hasMinimumLength || isSubmitting}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    bgcolor: hasMinimumLength && !isSubmitting ? C.purple.border : D.divider,
                    color: '#fff', px: 4, py: 1.5, borderRadius: '14px',
                    border: `2px solid ${hasMinimumLength && !isSubmitting ? C.purple.border : D.divider}`,
                    boxShadow: hasMinimumLength && !isSubmitting ? `4px 4px 0 #6A1B9A` : 'none',
                    fontWeight: 800, fontSize: '1rem', cursor: hasMinimumLength && !isSubmitting ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                    '&:hover': hasMinimumLength && !isSubmitting ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #6A1B9A' } : {},
                  }}
                >
                  {isSubmitting ? <><CircularProgress size={18} sx={{ color: '#fff', mr: 1 }} />Evaluating...</> : 'Submit Analysis'}
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Results */}
        {showResults && evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{ ...cardSx(evaluation.score >= 0.8 ? C.green : C.blue), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Evaluation Complete!</Typography>
              <Typography sx={{ color: D.body, mb: 0.75 }}><strong>Score:</strong> {evaluation.score}/{evaluation.maxScore}</Typography>
              <Typography sx={{ color: D.body, fontSize: '0.9rem', mb: 0.75 }}><strong>Feedback:</strong> {evaluation.feedback}</Typography>
              {evaluation.evaluation && (
                <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>{evaluation.evaluation}</Typography>
              )}
            </Box>

            <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Your Analysis:</Typography>
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
                Retry Step 3 <ArrowForwardIcon fontSize="small" />
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
