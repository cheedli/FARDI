import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RateReviewIcon from '@mui/icons-material/RateReview'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
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

export default function Phase3RemedialC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_c1' })
  const [critique, setCritique] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setCritique(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    logTaskCompletion(Math.min(sentenceCount, 8), 8)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'C1', task: 'A', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase3/step/2') }
  window.__remedialSkip = handleNext

  const isComplete = wordCount >= 100 && sentenceCount >= 6

  const includePoints = [
    'Financial consequences',
    'Reputational damage',
    'Stakeholder impacts',
    'Sustainability issues',
    'Specific examples of problems that can arise',
  ]

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
                Level C1 — Task A: Critical Reflection
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="MS_MABROUKI" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Ms. Mabrouki
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Now for a more advanced task! Write a critical reflection on why poor budgeting can harm an event. Use precise terminology and analyze the consequences from multiple perspectives.
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
            <Typography variant="body2" sx={{ color: D.body, mb: 1 }}>
              Write a short critique (6-8 sentences) on why poor budgeting can harm an event.
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mb: 0.5 }}>What to include:</Typography>
            {includePoints.map((pt, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.muted }}>• {pt}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Advanced level indicator */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...clay(D.purple), p: { xs: 1.5, md: 2 }, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <RateReviewIcon sx={{ color: D.purple.border, fontSize: 24, flexShrink: 0 }} />
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body }}>
              This is an advanced writing task requiring critical thinking and precise financial terminology. Aim for 6-8 sentences (100-150 words).
            </Typography>
          </Box>
        </motion.div>

        {/* Writing Area */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ ...clay({ bg: D.cardBg, border: D.divider, shadow: D.divider }), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
              Your Critical Reflection
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={critique}
              onChange={handleTextChange}
              placeholder="Write your critical reflection here... Analyze the multiple ways poor budgeting can negatively impact an event, using precise financial terminology and examining consequences from various perspectives."
              variant="outlined"
              disabled={showResults}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: D.muted }}>
                Words: {wordCount} | Sentences: {sentenceCount} | Target: 6-8 sentences (approx. 100-150 words)
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
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <Box sx={{ ...clay(D.green), p: { xs: 2, md: 2.5 }, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading, mb: 0.5 }}>
                Outstanding Critical Analysis!
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                You wrote {sentenceCount} sentences with {wordCount} words. Your critique demonstrates advanced analytical skills and sophisticated use of financial terminology.
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!showResults ? (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
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
                Submit Critique
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
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
                Continue to Step 2
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
