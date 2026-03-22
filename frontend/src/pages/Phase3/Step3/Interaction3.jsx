import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, TextField, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CreateIcon from '@mui/icons-material/Create'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Interaction 3: Justification Practice
 * Task: Write 3-5 sentences explaining a budget item, using connectors
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

const BUDGET_ITEMS = [
  { id: 'venue', name: 'Venue Rental', cost: '$800', icon: '🏢', prompt: 'Explain why the festival needs to rent a venue and how this cost impacts the budget.', keyPoints: ['Why is a venue necessary?', 'What does the venue provide?', 'How does this cost affect the overall budget?'] },
  { id: 'sound', name: 'Sound System', cost: '$500', icon: '🔊', prompt: 'Explain why sound equipment is needed and how it will be funded.', keyPoints: ['Why is sound equipment important?', 'What will it be used for?', 'How will we pay for it?'] },
  { id: 'promotion', name: 'Promotion & Marketing', cost: '$200', icon: '📣', prompt: 'Explain why the festival needs to spend money on promotion and what results we expect.', keyPoints: ['Why is promotion necessary?', 'What kind of promotion will we do?', 'What impact will it have?'] },
]

const REQUIRED_CONNECTORS = ['because', 'so', 'due to']

export default function Phase3Step3Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 3, context: 'main' })
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
        purple: { bg: '#1E0A26', border: '#8E24AA', shadow: '#8E24AA' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#2A1500', border: '#F57C00', shadow: '#F57C00' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
        purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
      }

  const [selectedItem, setSelectedItem] = useState(null)
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const cardSx = (c) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    p: 2.5,
  })

  const handleItemSelect = (itemId) => {
    if (showResults) return
    setSelectedItem(itemId)
    setResponse('')
    setEvaluation(null)
  }

  const handleSubmit = async () => {
    if (!selectedItem || !response.trim() || response.trim().length < 20) {
      alert('Please write at least 3-5 sentences (minimum 20 characters).')
      return
    }
    setIsSubmitting(true)
    try {
      const textLower = response.toLowerCase()
      const usedConnectors = REQUIRED_CONNECTORS.filter(connector => textLower.includes(connector))
      const result = await fetch('/api/phase3/interaction/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 3, interaction: 3, response: response, item: selectedItem, type: 'justification' })
      })
      const data = await result.json()
      let score = data.assessment?.score || 2
      if (usedConnectors.length >= 1) score = Math.min(score + 1, 5)
      setEvaluation({ score, level: getLevelFromScore(score), feedback: data.assessment?.feedback || 'Good explanation!', usedConnectors, assessment: data.assessment })
      setShowResults(true)
      sessionStorage.setItem('phase3_step3_int3_score', score.toString())
      sessionStorage.setItem('phase3_step3_int3_max', '5')
      await logTaskCompletion(score, 5)
    } catch (error) {
      console.error('Failed to submit response:', error)
      const textLower = response.toLowerCase()
      const usedConnectors = REQUIRED_CONNECTORS.filter(connector => textLower.includes(connector))
      let score = response.length > 100 ? 3 : 2
      if (usedConnectors.length >= 1) score = Math.min(score + 1, 5)
      setEvaluation({ score, level: getLevelFromScore(score), feedback: 'Your response has been recorded. Good work!', usedConnectors })
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLevelFromScore = (score) => {
    const levels = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1' }
    return levels[score] || 'A2'
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 3, interaction: 3, score: score, max_score: maxScore, time_taken: 0, completed: true })
      })
    } catch (error) { console.error('Failed to log interaction:', error) }
  }

  const handleContinue = () => {
    const int1Score = parseInt(sessionStorage.getItem('phase3_step3_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase3_step3_int2_score') || '0')
    const int3Score = evaluation?.score || 0
    const totalScore = int1Score + int2Score + int3Score
    const totalMax = 15
    const percentage = (totalScore / totalMax) * 100
    sessionStorage.setItem('phase3_step3_total_score', totalScore.toString())
    sessionStorage.setItem('phase3_step3_total_max', totalMax.toString())
    sessionStorage.setItem('phase3_step3_percentage', percentage.toFixed(2))
    console.log(`[Phase 3 Step 3 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)
    navigate('/phase3/step/3/score')
  }

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasMinimumLength = response.trim().length >= 20
  const selectedItemData = BUDGET_ITEMS.find(i => i.id === selectedItem)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.purple), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.purple.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Interaction 3
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Justification Practice</Typography>
            <Typography sx={{ color: D.muted }}>Write an explanation for a budget item</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Excellent progress! Now it's time to practice writing your own explanations. Choose one budget item below and write 3-5 sentences explaining why it's necessary and how it affects the budget. Try to use at least one connector (because, so, or due to)."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...cardSx(C.yellow), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Instructions:</Typography>
            {['Choose one budget item below', 'Write 3-5 sentences explaining it', 'Use at least one connector: because, so, or due to', 'Explain clearly why the cost exists and how it impacts the budget'].map((t, i) => (
              <Typography key={i} sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>{i + 1}. {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Connector Reference */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Helpful Connectors:</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {REQUIRED_CONNECTORS.map((connector, index) => (
                <Box key={index} sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.teal.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>
                  {connector}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Budget Item Selection */}
        {!selectedItem && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 2 }}>Choose a Budget Item to Explain:</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {BUDGET_ITEMS.map((item, i) => (
                <Box
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  sx={{
                    bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px',
                    boxShadow: `4px 4px 0 ${D.divider}`, p: 2.5, cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', borderColor: C.purple.border, boxShadow: `4px 4px 0 ${C.purple.shadow}` },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>{item.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: D.heading }}>{item.name}</Typography>
                      <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>Cost: {item.cost}</Typography>
                    </Box>
                    <Box sx={{ px: 2, py: 0.75, borderRadius: '12px', bgcolor: C.purple.bg, border: `2px solid ${C.purple.border}`, color: C.purple.border, fontWeight: 800, fontSize: '0.85rem' }}>
                      Select
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </motion.div>
        )}

        {/* Writing Area */}
        {selectedItem && !showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ ...cardSx(C.purple), mb: 3 }}>
              {/* Selected item display */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Typography sx={{ fontSize: '2rem' }}>{selectedItemData?.icon}</Typography>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: D.heading }}>{selectedItemData?.name}</Typography>
                  <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>Cost: {selectedItemData?.cost}</Typography>
                </Box>
              </Box>

              {/* Prompt */}
              <Box sx={{ bgcolor: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography sx={{ color: D.body, fontSize: '0.9rem' }}>
                  <CreateIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: '1rem', color: C.blue.border }} />
                  <strong>Task:</strong> {selectedItemData?.prompt}
                </Typography>
              </Box>

              {/* Key Points */}
              <Box sx={{ bgcolor: dark ? '#1A1A2E' : '#F5F5F5', borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography sx={{ color: D.body, fontWeight: 700, fontSize: '0.88rem', mb: 1 }}>Consider these points:</Typography>
                <Box component="ul" sx={{ pl: 2.5, my: 0 }}>
                  {selectedItemData?.keyPoints.map((point, i) => (
                    <Typography key={i} component="li" sx={{ color: D.muted, fontSize: '0.88rem', mb: 0.25 }}>{point}</Typography>
                  ))}
                </Box>
              </Box>

              {/* Text Area */}
              <TextField
                multiline rows={6} fullWidth variant="outlined"
                placeholder="Write your explanation here (3-5 sentences)..."
                value={response} onChange={(e) => setResponse(e.target.value)} disabled={isSubmitting}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: D.cardBg, color: D.body, borderRadius: '12px',
                    '& fieldset': { borderColor: D.divider },
                    '&:hover fieldset': { borderColor: C.purple.border },
                    '&.Mui-focused fieldset': { borderColor: C.purple.border },
                  }
                }}
              />

              {/* Word Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: hasMinimumLength ? C.green.border : D.muted, fontSize: '0.85rem' }}>
                  Words: {wordCount} | Characters: {response.length}
                </Typography>
                {!hasMinimumLength && (
                  <Typography sx={{ color: '#C62828', fontSize: '0.8rem' }}>Write at least 20 characters</Typography>
                )}
              </Box>

              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  component="button"
                  onClick={() => setSelectedItem(null)}
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: 'transparent', color: C.purple.border,
                    px: 2.5, py: 1.25, borderRadius: '12px',
                    border: `2px solid ${C.purple.border}`,
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: C.purple.bg },
                  }}
                >
                  Choose Different Item
                </Box>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={!hasMinimumLength || isSubmitting}
                  sx={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    bgcolor: hasMinimumLength && !isSubmitting ? C.purple.border : D.divider,
                    color: '#fff', px: 3, py: 1.25, borderRadius: '12px',
                    border: `2px solid ${hasMinimumLength && !isSubmitting ? C.purple.border : D.divider}`,
                    boxShadow: hasMinimumLength && !isSubmitting ? `4px 4px 0 #6A1B9A` : 'none',
                    fontWeight: 800, fontSize: '0.95rem', cursor: hasMinimumLength && !isSubmitting ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                    '&:hover': hasMinimumLength && !isSubmitting ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #6A1B9A' } : {},
                  }}
                >
                  {isSubmitting ? <><CircularProgress size={18} sx={{ color: '#fff', mr: 1 }} /> Evaluating...</> : 'Submit Explanation'}
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Results */}
        {showResults && evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ ...cardSx(C.green), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Evaluation Complete!</Typography>
              <Typography sx={{ color: D.body, mb: 0.75 }}><strong>Level:</strong> {evaluation.level} ({evaluation.score}/5 points)</Typography>
              <Typography sx={{ color: D.body, fontSize: '0.9rem', mb: 0.75 }}><strong>Feedback:</strong> {evaluation.feedback}</Typography>
              {evaluation.usedConnectors.length > 0 && (
                <Typography sx={{ color: C.green.border, fontSize: '0.88rem' }}>
                  ✓ You used these connectors: <strong>{evaluation.usedConnectors.join(', ')}</strong>
                </Typography>
              )}
              {evaluation.usedConnectors.length === 0 && (
                <Typography sx={{ color: C.orange?.border || '#F57C00', fontSize: '0.88rem' }}>
                  Note: Try using connectors (because, so, due to) to improve your explanations!
                </Typography>
              )}
            </Box>

            {/* User's response */}
            <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Your Response:</Typography>
              <Box sx={{ bgcolor: D.cardBg, borderRadius: '12px', p: 2 }}>
                <Typography sx={{ color: D.body, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{response}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="button"
                onClick={handleContinue}
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
                Complete Step 3 <ArrowForwardIcon fontSize="small" />
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
