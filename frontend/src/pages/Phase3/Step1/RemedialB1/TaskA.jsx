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
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
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

export default function Phase3RemedialB1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_b1' })
  const [writing, setWriting] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setWriting(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    const sentences = writing.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    logTaskCompletion(Math.min(sentences, 5), 5)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'A', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase3/step/1/interaction/1') }

  const sentenceCount = writing.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const isComplete = wordCount >= 40 && sentenceCount >= 4

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
                Level B1 — Task A: Short Writing
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="SKANDER" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Skander
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Let's develop your writing skills! Write 4-5 sentences explaining why events need sponsorship or a budget.
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
              Write 4-5 sentences explaining why events need sponsorship or a budget.
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted, mt: 0.5 }}>
              Tips: Include reasons, examples, and explain the importance of financial planning.
            </Typography>
          </Box>
        </motion.div>

        {/* Writing Area */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...clay({ bg: D.cardBg, border: D.divider, shadow: D.divider }), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
              Your Writing
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={writing}
              onChange={handleTextChange}
              placeholder="Start writing here... Explain why events need financial support and planning."
              variant="outlined"
              disabled={showResults}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: D.muted }}>
                Words: {wordCount} | Sentences: {sentenceCount} | Target: 4-5 sentences (approx. 40-60 words)
              </Typography>
              {isComplete && !showResults && (
                <Box sx={{
                  px: 1.25, py: 0.3, borderRadius: '50px',
                  bgcolor: D.green.bg, border: `1px solid ${D.green.border}`,
                  fontSize: '0.75rem', fontWeight: 800, color: D.green.border,
                }}>
                  Ready to submit!
                </Box>
              )}
            </Box>
          </Box>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ ...clay(D.green), p: { xs: 2, md: 2.5 }, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading, mb: 0.5 }}>
                Excellent Work!
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                You wrote {sentenceCount} sentences with {wordCount} words. Your writing demonstrates your ability to explain financial concepts clearly.
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!showResults ? (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!isComplete}
                sx={{
                  px: 3, py: 1.25,
                  bgcolor: D.blue.bg, color: D.blue.border,
                  border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  opacity: !isComplete ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: !isComplete ? 'none' : 'translate(-2px,-2px)', boxShadow: !isComplete ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit Writing
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
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
                Retry Step 1
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
