import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
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

export default function Phase3Step1Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 3, context: 'main' })
  const [userSentence, setUserSentence] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [estimatedLevel, setEstimatedLevel] = useState(null)

  const handleSubmit = () => {
    if (!userSentence.trim()) {
      setFeedback({ type: 'error', message: 'Please write a sentence before submitting.' })
      return
    }

    const sentence = userSentence.toLowerCase()
    const wordCount = userSentence.trim().split(/\s+/).length
    const containsBudget = sentence.includes('budget')

    if (!containsBudget) {
      setFeedback({ type: 'warning', message: 'Your sentence should include the word "budget". Please try again.' })
      return
    }

    let level = 'A1'
    let score = 1
    if (wordCount >= 12 && (sentence.includes('because') || sentence.includes('while') || sentence.includes('ensure'))) {
      level = 'C1'; score = 5
    } else if (wordCount >= 8 && (sentence.includes('help') || sentence.includes('manage') || sentence.includes('avoid'))) {
      level = 'B2'; score = 4
    } else if (wordCount >= 6 && (sentence.includes('because') || sentence.includes('to'))) {
      level = 'B1'; score = 3
    } else if (wordCount >= 4) {
      level = 'A2'; score = 2
    }

    setEstimatedLevel(level)
    setSubmitted(true)
    setFeedback({ type: 'success', message: 'Great! Your sentence has been recorded. This demonstrates your ability to use financial vocabulary in context.' })

    sessionStorage.setItem('phase3_step1_int3_score', score.toString())
    console.log(`[Phase 3 Step 1 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
  }

  const handleNext = () => {
    const int1Score = parseInt(sessionStorage.getItem('phase3_step1_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase3_step1_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase3_step1_int3_score') || '0')
    const totalScore = int1Score + int2Score + int3Score
    const totalMax = 21
    const percentage = (totalScore / totalMax) * 100

    sessionStorage.setItem('phase3_step1_total_score', totalScore.toString())
    sessionStorage.setItem('phase3_step1_total_max', totalMax.toString())
    sessionStorage.setItem('phase3_step1_percentage', percentage.toFixed(2))

    console.log(`[Phase 3 Step 1 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)
    navigate('/phase3/step/1/score')
  }

  const wordCount = userSentence.trim().split(/\s+/).filter(w => w).length
  const feedbackColor = feedback?.type === 'error' ? D.red : feedback?.type === 'warning' ? D.orange : D.green

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Phase Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 — Step 1: Interaction 3
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Guided Sentence Production
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
                  Now let's use one key word in context. Choose the word 'budget' and write one sentence about our festival.
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
              Write one sentence using the word <Box component="span" fontWeight={800}>"budget"</Box> to talk about the festival.
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted, mt: 0.5 }}>
              Mode: Individual &nbsp;|&nbsp; Output: 1 sentence only
            </Typography>
          </Box>
        </motion.div>

        {/* Input Area */}
        {!submitted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3, bgcolor: D.cardBg, border: `2px solid ${D.divider}`, boxShadow: `4px 4px 0 ${D.divider}` }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
                Your sentence:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder="Write one sentence using the word 'budget' about the Global Cultures Festival..."
                variant="outlined"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: D.muted }}>
                  Word count: {wordCount}
                </Typography>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={!userSentence.trim()}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2.5, py: 1,
                    bgcolor: D.blue.bg, color: D.blue.border,
                    border: `2px solid ${D.blue.border}`,
                    borderRadius: '14px',
                    boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    opacity: !userSentence.trim() ? 0.5 : 1,
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: !userSentence.trim() ? 'none' : 'translate(-2px,-2px)', boxShadow: !userSentence.trim() ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                  }}
                >
                  <SendIcon fontSize="small" />
                  Submit Sentence
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Submitted Response */}
        {submitted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ ...clay(D.green), p: { xs: 2, md: 2.5 }, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
                Your Response:
              </Typography>
              <Typography variant="body1" sx={{ color: D.body, fontStyle: 'italic', mb: 1.5 }}>
                "{userSentence}"
              </Typography>
              {estimatedLevel && (
                <Box sx={{
                  display: 'inline-block',
                  px: 1.75, py: 0.4, borderRadius: '50px',
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  fontSize: '0.8rem', fontWeight: 800, color: D.green.border,
                }}>
                  Estimated Level: {estimatedLevel}
                </Box>
              )}
            </Box>
          </motion.div>
        )}

        {/* Feedback */}
        {feedback && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ ...clay(feedbackColor), p: { xs: 2, md: 2.5 }, mb: 3 }}>
              <Typography variant="body2" fontWeight={600} sx={{ color: feedbackColor.border }}>
                {feedback.message}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Assessment Focus */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Box sx={{ ...clay(D.yellow), p: { xs: 2, md: 2.5 }, mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
              Assessment Focus
            </Typography>
            {['Correct use of "budget"', 'Sentence completeness', 'Relevance to event planning'].map((item, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>• {item}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Complete Button */}
        {submitted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 4, py: 1.5,
                  bgcolor: D.green.bg, color: D.green.border,
                  border: `2px solid ${D.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Complete Step 1
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
