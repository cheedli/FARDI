import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoIcon from '@mui/icons-material/Info'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import CampaignIcon from '@mui/icons-material/Campaign'
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
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4 - Level B2 - Task A: Revised Pitch with Feedback
 * Write a sponsor pitch, then revise it based on guided feedback
 */

export default function Phase3Step4RemedialB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_b2' })
  const [firstDraft, setFirstDraft] = useState('')
  const [revision, setRevision] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const handleSubmitFirstDraft = () => setShowFeedback(true)

  const handleSubmitRevision = () => {
    const revisionWords = revision.trim().split(/\s+/).length
    const revisionLower = revision.toLowerCase()

    const hasComparison = /\b(unlike|compared to|different|unique|special|better than)\b/.test(revisionLower)
    const hasEmphasis = /\b(excellent|perfect|ideal|great|amazing|outstanding)\b/.test(revisionLower)
    const hasBenefits = /\b(visibility|brand|image|logo|promotion|exposure)\b/.test(revisionLower)
    const hasValues = /\b(diversity|culture|values|mission|align|support)\b/.test(revisionLower)
    const hasCallToAction = /\b(please|join|partner|consider|invite|collaborate)\b/.test(revisionLower)

    let score = 0, feedback = ''
    if (revisionWords >= 40) score += 2
    else if (revisionWords >= 25) score += 1
    if (hasComparison) score += 1
    if (hasEmphasis) score += 1
    if (hasBenefits && hasValues) score += 2
    else if (hasBenefits || hasValues) score += 1
    if (hasCallToAction) score += 1

    if (score >= 6) {
      feedback = 'Excellent! Your revised pitch is persuasive, well-structured, and includes comparison, benefits, and a call to action. Very professional!'
    } else if (score >= 4) {
      feedback = 'Good revision! Your pitch is more persuasive. Consider adding more comparison or emphasis to make it even stronger.'
    } else {
      feedback = "Your revision shows improvement. Try to add more persuasive elements: comparison ('unlike other events'), emphasis ('perfect opportunity'), and clear benefits."
    }

    setEvaluation({ score, maxScore: 8, feedback })
    setShowResults(true)
    logTaskCompletion(score, 8)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B2', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 4 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase3/step/4/remedial/c1/taskA')
  window.__remedialSkip = handleNext
  const passThreshold = 5

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: D.cardBg,
      '& fieldset': { borderColor: D.divider },
      '&:hover fieldset': { borderColor: D.purple.border },
    },
    '& .MuiInputBase-input': { color: D.body },
    '& .MuiInputLabel-root': { color: D.muted },
  }

  const firstDraftWordCount = firstDraft.trim().split(/\s+/).filter(w => w.length > 0).length
  const revisionWordCount = revision.trim().split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.purple.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.teal.bg, border: `2px solid ${D.teal.border}`, color: D.teal.border }}>B2 Level</Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Remedial Practice</Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>Phase 3 Step 4 — Remedial Practice</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>Level B2 — Task A: Revised Sponsor Pitch</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's create a persuasive sponsor pitch! First, write a draft. Then, I'll give you feedback and you'll revise it to make it more convincing using persuasion strategies."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
              <Typography variant="body1" fontWeight={800} sx={{ color: D.heading }}>Instructions:</Typography>
            </Box>
            {['1. Write a first draft of your sponsor pitch (20+ words)', '2. Review the feedback about persuasion strategies', '3. Revise your pitch using persuasive language'].map((t, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>{t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* First Draft */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CampaignIcon sx={{ color: D.heading }} />
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>First Draft — Sponsor Pitch</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
              Write your initial sponsor pitch for the Global Cultures Festival.
            </Typography>
            <TextField
              fullWidth multiline rows={6}
              placeholder="Dear [Company Name], we are organizing the Global Cultures Festival and would like to invite you to be our sponsor. We need funding because..."
              value={firstDraft}
              onChange={(e) => setFirstDraft(e.target.value)}
              disabled={showFeedback}
              sx={inputSx}
            />
            <Typography variant="caption" sx={{ color: D.muted, mt: 1, display: 'block' }}>
              Words: {firstDraftWordCount}
            </Typography>
            {!showFeedback && (
              <Box
                component="button"
                onClick={handleSubmitFirstDraft}
                disabled={firstDraftWordCount < 20}
                sx={{
                  mt: 2, px: 3, py: 1,
                  bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.9rem', cursor: firstDraftWordCount < 20 ? 'not-allowed' : 'pointer',
                  color: D.blue.border, opacity: firstDraftWordCount < 20 ? 0.6 : 1,
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit Draft for Feedback
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Feedback */}
        {showFeedback && !showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.yellow.shadow}`, p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TipsAndUpdatesIcon sx={{ color: D.yellow.border }} />
                <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>Feedback: Persuasion Strategies</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
                To make your pitch more persuasive, consider adding:
              </Typography>
              {[
                ['Comparison', '"Unlike other events, our festival..."'],
                ['Emphasis', 'Use words like "perfect," "ideal," "excellent opportunity"'],
                ['Clear Benefits', 'Visibility, brand image, logo placement, values alignment'],
                ['Values Alignment', "Connect sponsor's values to festival mission"],
                ['Call to Action', '"We invite you to partner with us," "Please consider supporting"'],
              ].map(([label, text], i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ color: D.yellow.border, fontWeight: 800, flexShrink: 0 }}>•</Typography>
                  <Typography variant="body2" sx={{ color: D.body }}>
                    <strong>{label}:</strong> {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        )}

        {/* Revision */}
        {showFeedback && !showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.green.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.green.border, mb: 1 }}>Revised Pitch — Apply Feedback</Typography>
              <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
                Revise your pitch using the persuasion strategies above.
              </Typography>
              <TextField
                fullWidth multiline rows={8}
                placeholder="Use your first draft and improve it with persuasive language. Add comparison, emphasis, clear benefits, and a call to action..."
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                sx={inputSx}
              />
              <Typography variant="caption" sx={{ color: D.muted, mt: 1, display: 'block' }}>
                Words: {revisionWordCount} (Aim for 40+ words)
              </Typography>
              <Box
                component="button"
                onClick={handleSubmitRevision}
                disabled={revisionWordCount < 25}
                sx={{
                  mt: 2, px: 3, py: 1,
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '0.9rem', cursor: revisionWordCount < 25 ? 'not-allowed' : 'pointer',
                  color: D.green.border, opacity: revisionWordCount < 25 ? 0.6 : 1,
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Submit Revised Pitch
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Results */}
        {showResults && evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{
              bgcolor: evaluation.score >= passThreshold ? D.green.bg : D.yellow.bg,
              border: `2px solid ${evaluation.score >= passThreshold ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.score >= passThreshold ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Box sx={{ display: 'inline-flex', px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, mb: 2, bgcolor: D.cardBg, border: `2px solid ${evaluation.score >= passThreshold ? D.green.border : D.yellow.border}`, color: evaluation.score >= passThreshold ? D.green.border : D.yellow.border }}>
                Score: {evaluation.score}/{evaluation.maxScore}
              </Box>
              <Typography variant="body1" sx={{ color: D.body }}>{evaluation.feedback}</Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        {showResults && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
              Continue to C1 Practice <ArrowForwardIcon fontSize="small" />
            </Box>
          </Box>
        )}

      </Container>
    </Box>
  )
}
