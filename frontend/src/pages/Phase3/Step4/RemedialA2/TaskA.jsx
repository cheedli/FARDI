import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useProgressSave } from '../../../../hooks/useProgressSave'

// ── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
  muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4 - Level A2 - Task A: Sentence-guided Pitch
 * Complete sponsor pitch sentences using "because" or "so"
 */

const SENTENCE_STARTERS = [
  { id: 1, prompt: 'We need a sponsor because...', hint: 'Why do you need a sponsor? (e.g., costs are high, we need money)', keywords: ['cost', 'money', 'expensive', 'need', 'high', 'budget'] },
  { id: 2, prompt: 'The festival is important because...', hint: 'Why is the festival important? (e.g., celebrates culture, brings students together)', keywords: ['culture', 'student', 'celebrate', 'important', 'learn', 'diversity'] },
  { id: 3, prompt: 'Your company will benefit because...', hint: 'How will the sponsor benefit? (e.g., logo on posters, good image)', keywords: ['logo', 'poster', 'visibility', 'image', 'brand', 'promotion', 'see'] },
  { id: 4, prompt: 'We have many costs, so...', hint: 'What is the result of having many costs? (e.g., we need funding, we ask for help)', keywords: ['need', 'funding', 'sponsor', 'help', 'support', 'money'] },
  { id: 5, prompt: 'Students will see your logo, so...', hint: 'What is the result of students seeing the logo? (e.g., they know your company, good for your brand)', keywords: ['know', 'company', 'brand', 'good', 'remember', 'visibility'] },
]

export default function Phase3Step4RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})

  const handleAnswerChange = (id, value) => setAnswers({ ...answers, [id]: value })

  const handleSubmit = async () => {
    const evals = {}
    let totalScore = 0

    SENTENCE_STARTERS.forEach(sentence => {
      const answer = answers[sentence.id]?.trim() || ''
      const answerLower = answer.toLowerCase()
      const hasLength = answer.length >= 5
      const hasKeyword = sentence.keywords.some(keyword => answerLower.includes(keyword))
      const isCorrect = hasLength && (hasKeyword || answer.length >= 10)
      evals[sentence.id] = {
        correct: isCorrect,
        feedback: isCorrect ? 'Good! Your sentence makes sense.' : 'Try to complete the sentence with a logical reason or result.'
      }
      if (isCorrect) totalScore++
    })

    setEvaluation(evals)
    setShowResults(true)
    logTaskCompletion(totalScore, SENTENCE_STARTERS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 4 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/app/dashboard')

  const allAnswered = SENTENCE_STARTERS.every(s => answers[s.id]?.trim()?.length >= 5)
  const score = Object.values(evaluation).filter(e => e.correct).length
  const passThreshold = 4

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: D.cardBg,
      '& fieldset': { borderColor: D.divider },
      '&:hover fieldset': { borderColor: D.green.border },
    },
    '& .MuiInputBase-input': { color: D.body },
    '& .MuiInputLabel-root': { color: D.muted },
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.green.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, color: D.blue.border }}>A2 Level</Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Remedial Practice</Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>Phase 3 Step 4 — Remedial Practice</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>Level A2 — Task A: Sentence-guided Pitch</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Let's practice writing sponsor pitch sentences! Complete each sentence using 'because' or 'so'. Think about why you need a sponsor and what they will gain."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
              <Typography variant="body1" fontWeight={800} sx={{ color: D.heading }}>Instructions: Complete each sentence to create a sponsor pitch.</Typography>
            </Box>
            {[
              '• Use "because" to explain a reason',
              '• Use "so" to show a result',
            ].map((t, i) => <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>{t}</Typography>)}
            <Box sx={{ mt: 1, display: 'inline-flex', px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
              Passing score: Minimum 4/5 sentences completed logically
            </Box>
          </Box>
        </motion.div>

        {/* Sentence Completion */}
        <Box sx={{ mb: 4 }}>
          {SENTENCE_STARTERS.map((sentence, index) => {
            const evalResult = evaluation[sentence.id]
            const cardColor = showResults ? (evalResult?.correct ? D.green : D.red) : { bg: D.cardBg, border: D.divider, shadow: D.divider }
            return (
              <motion.div key={sentence.id} variants={fadeUp} initial="hidden" animate="visible" custom={3 + index}>
                <Box sx={{ bgcolor: cardColor.bg, border: `2px solid ${cardColor.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${cardColor.shadow}`, p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, color: D.blue.border }}>
                      Sentence {index + 1}
                    </Box>
                    {showResults && (evalResult?.correct
                      ? <CheckCircleIcon sx={{ color: D.green.border }} />
                      : <WarningAmberIcon sx={{ color: D.red.border }} />
                    )}
                  </Box>

                  <Box sx={{ p: 2, bgcolor: D.pageBg, border: `2px solid ${D.divider}`, borderRadius: '14px', mb: 2 }}>
                    <Typography variant="body1" fontWeight={800} sx={{ color: D.heading }}>{sentence.prompt}</Typography>
                  </Box>

                  <TextField
                    fullWidth multiline rows={2}
                    placeholder={sentence.hint}
                    value={answers[sentence.id] || ''}
                    onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                    disabled={showResults}
                    sx={{ ...inputSx, mb: 1 }}
                  />

                  <Typography variant="caption" sx={{ color: D.muted }}>Hint: {sentence.hint}</Typography>

                  {showResults && evalResult && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: evalResult.correct ? D.green.border : D.red.border, mb: 1 }}>
                        {evalResult.feedback}
                      </Typography>
                      {answers[sentence.id] && (
                        <Box sx={{ p: 2, bgcolor: D.cardBg, border: `1px solid ${D.divider}`, borderRadius: '10px' }}>
                          <Typography variant="body2" sx={{ color: D.body }}>
                            <strong>Your complete sentence:</strong><br />
                            {sentence.prompt} {answers[sentence.id]}
                          </Typography>
                        </Box>
                      )}
                      {!answers[sentence.id] && (
                        <Typography variant="body2" sx={{ color: D.muted, fontStyle: 'italic' }}>(No answer provided)</Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Results Summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
            <Box sx={{
              bgcolor: score >= passThreshold ? D.green.bg : D.yellow.bg,
              border: `2px solid ${score >= passThreshold ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= passThreshold ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Box sx={{ display: 'inline-flex', px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, mb: 1, bgcolor: D.cardBg, border: `2px solid ${score >= passThreshold ? D.green.border : D.yellow.border}`, color: score >= passThreshold ? D.green.border : D.yellow.border }}>
                Score: {score}/{SENTENCE_STARTERS.length}
              </Box>
              <Typography variant="body1" sx={{ color: D.body }}>
                {score === SENTENCE_STARTERS.length
                  ? 'Perfect! All sentences completed well!'
                  : score >= passThreshold
                    ? `Great job! You passed with ${score} correct sentences.`
                    : `You need ${passThreshold} correct sentences to pass. Review your answers and try again if needed.`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                px: 4, py: 1.5,
                bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: D.green.border, opacity: !allAnswered ? 0.6 : 1,
                '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Submit Sentences
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleNext}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 4, py: 1.5,
                bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer', color: D.green.border,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Complete A2 Task <ArrowForwardIcon fontSize="small" />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
