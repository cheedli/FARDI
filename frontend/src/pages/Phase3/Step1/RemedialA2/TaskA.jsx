import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

const SENTENCE_PROMPTS = [
  { id: 1, prompt: 'We need a sponsor because ____.', hint: 'Think about why events need money from sponsors' },
  { id: 2, prompt: 'A budget is important because ____.', hint: 'Think about what a budget helps us do' },
  { id: 3, prompt: 'We sell tickets because ____.', hint: 'Think about why we ask people to pay for entry' },
]

export default function Phase3RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluations, setEvaluations] = useState({})
  const [totalScore, setTotalScore] = useState(0)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    setIsEvaluating(true)
    try {
      const promptsMap = {}
      SENTENCE_PROMPTS.forEach(item => { promptsMap[item.id] = item.prompt })

      const response = await fetch('/api/phase3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'A', answers, prompts: promptsMap })
      })

      const result = await response.json()
      if (result.success) {
        const evalMap = {}
        result.evaluations.forEach(evaluation => { evalMap[evaluation.id] = evaluation })
        setEvaluations(evalMap)
        setTotalScore(result.total_score)
        setShowResults(true)
        await logTaskCompletion(result.total_score, result.max_score)
      } else {
        console.error('Evaluation failed:', result.error)
        alert('Failed to evaluate answers. Please try again.')
      }
    } catch (error) {
      console.error('Failed to evaluate:', error)
      alert('Failed to evaluate answers. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'A', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase3/step/1/remedial/a2/taskB') }
  window.__remedialSkip = handleNext

  const isComplete = SENTENCE_PROMPTS.every(p => answers[p.id]?.trim().length > 0)
  const allCorrect = totalScore === SENTENCE_PROMPTS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level A2 — Task A: Sentence Completion
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="EMNA" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Emna
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Let's practice explaining reasons! Complete each sentence using 'because' to give a reason.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.teal.border, mb: 0.5 }}>
              Instructions
            </Typography>
            <Typography variant="body2" sx={{ color: D.body }}>
              Complete each sentence by writing a reason after "because".
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted, mt: 0.5 }}>
              Example: We need a sponsor because <em>events cost money</em>.
            </Typography>
          </Box>
        </motion.div>

        {/* Sentence Completion Tasks */}
        <Box sx={{ mb: 4 }}>
          {SENTENCE_PROMPTS.map((item, index) => {
            const evalResult = showResults && evaluations[item.id]
            const isCorrect = evalResult && evaluations[item.id].score === 1
            const c = evalResult ? (isCorrect ? D.green : D.orange) : { bg: D.cardBg, border: D.divider, shadow: D.divider }
            return (
              <motion.div key={item.id} variants={fadeUp} initial="hidden" animate="visible" custom={3 + index}>
                <Box sx={{ ...clay(c), p: { xs: 2, md: 2.5 }, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading, mb: 0.5 }}>
                    {index + 1}. {item.prompt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{
                      px: 1.25, py: 0.3, borderRadius: '50px',
                      bgcolor: D.yellow.bg, border: `1px solid ${D.yellow.border}`,
                      fontSize: '0.75rem', fontWeight: 700, color: D.yellow.border,
                    }}>
                      Hint: {item.hint}
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={answers[item.id] || ''}
                    onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                    placeholder="Complete the sentence..."
                    variant="outlined"
                    disabled={showResults}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  {evalResult && (
                    <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '12px', bgcolor: isCorrect ? D.green.bg : D.orange.bg, border: `1px solid ${isCorrect ? D.green.border : D.orange.border}` }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: D.body }}>
                        Score: {evaluations[item.id].score}/1
                      </Typography>
                      <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                        {evaluations[item.id].evaluation}
                      </Typography>
                      <Typography variant="body2" sx={{ color: D.muted, mt: 0.5, fontStyle: 'italic' }}>
                        {evaluations[item.id].feedback}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Results Summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{ ...clay(allCorrect ? D.green : D.blue), p: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={700} sx={{ color: allCorrect ? D.green.border : D.blue.border }}>
                Total Score: {totalScore}/{SENTENCE_PROMPTS.length} —{' '}
                {allCorrect
                  ? 'Excellent work! You provided good reasons for all sentences.'
                  : 'Good effort! Review the feedback above to see how you can improve.'}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!showResults ? (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!isComplete || isEvaluating}
                sx={{
                  px: 3, py: 1.25,
                  bgcolor: D.blue.bg, color: D.blue.border,
                  border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  opacity: (!isComplete || isEvaluating) ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: (!isComplete || isEvaluating) ? 'none' : 'translate(-2px,-2px)', boxShadow: (!isComplete || isEvaluating) ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                {isEvaluating ? 'Evaluating...' : 'Submit Answers'}
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 3, py: 1.25,
                  bgcolor: D.green.bg, color: D.green.border,
                  border: `2px solid ${D.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Complete Task
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
