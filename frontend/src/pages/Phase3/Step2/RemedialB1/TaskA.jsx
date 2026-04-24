import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BuildIcon from '@mui/icons-material/Build'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level B1 - Task A: Short Explanation
 * Write 4-5 sentences explaining why sponsorship is important
 */

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

function clay(c) {
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
  }
}

export default function Phase3Step2RemedialB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase3/step/2/remedial/b2/taskA') }, [])
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_b1' })
  const [explanation, setExplanation] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleTextChange = (e) => {
    const text = e.target.value
    setExplanation(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    logTaskCompletion(Math.min(sentenceCount, 5), 5)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'A', score, max_score: maxScore, time_taken: 0, step: 2 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase3/step/2/remedial/b2/taskA')
  }

  const isComplete = wordCount >= 60 && sentenceCount >= 4

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <BuildIcon sx={{ fontSize: 40, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 Step 2 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level B1 — Task A: Short Explanation
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Now for a more detailed task! Explain why sponsorship is important for events. Write 4-5 sentences with clear reasons and examples."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 2.5, mb: 3 }}>
            <Typography variant="body1" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
              Instructions: Write 4-5 sentences explaining why sponsorship is important.
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mb: 0.75 }}>What to include:</Typography>
            {[
              'Why events need sponsors',
              'What sponsors provide',
              'Benefits for the event',
              'An example if possible',
            ].map((t, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>• {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Writing Area */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...clay({ bg: D.cardBg, border: D.divider, shadow: D.divider }), p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
              Your Explanation
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={explanation}
              onChange={handleTextChange}
              placeholder="Write your explanation here... Explain why sponsorship is important for events. Include reasons, benefits, and examples."
              variant="outlined"
              disabled={showResults}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: D.pageBg,
                  color: D.body,
                  '& fieldset': { borderColor: D.divider },
                  '&:hover fieldset': { borderColor: D.blue.border },
                  '&.Mui-focused fieldset': { borderColor: D.blue.border },
                },
                '& .MuiInputBase-input': { color: D.body },
                '& .MuiInputBase-input::placeholder': { color: D.muted, opacity: 1 },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: D.muted }}>
                Words: {wordCount} | Sentences: {sentenceCount} | Target: 4-5 sentences (approx. 60-100 words)
              </Typography>
              {isComplete && !showResults && (
                <Box component="span" sx={{
                  px: 1.25, py: 0.25, borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800,
                  bgcolor: D.green.bg, color: D.green.border, border: `2px solid ${D.green.border}`,
                }}>
                  ✓ Ready to submit!
                </Box>
              )}
            </Box>
          </Box>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Box sx={{ ...clay(D.green), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Great Explanation!</Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                You wrote {sentenceCount} sentences with {wordCount} words. Your explanation demonstrates good understanding of sponsorship importance.
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
              disabled={!isComplete}
              sx={{
                bgcolor: isComplete ? D.blue.bg : D.divider,
                color: isComplete ? D.blue.border : D.muted,
                border: `2px solid ${isComplete ? D.blue.border : D.divider}`,
                borderRadius: '14px',
                boxShadow: isComplete ? `4px 4px 0 ${D.blue.shadow}` : 'none',
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: isComplete ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': isComplete ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` } : {},
              }}
            >
              Submit Explanation
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleNext}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: D.green.bg, color: D.green.border,
                border: `2px solid ${D.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Continue to B2 Practice <ArrowForwardIcon />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
