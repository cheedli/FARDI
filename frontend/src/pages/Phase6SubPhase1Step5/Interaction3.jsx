import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#EFF6FF',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1D4ED8' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const SAMPLE_TEXT = "The festival had many visitors last week. Students were very excited and they participated in all activities. The organizers planned well and every booth was successful. We recommend improvements for next time."

export default function Phase6SP1Step5Int3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'main' })
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    if (!text.trim()) return
    const wordCount = text.split(/\s+/).length
    const formalWords = ['evidence', 'recommend', 'achieved', 'conclude', 'furthermore', 'however', 'specifically', 'analysis'].filter(w => text.toLowerCase().includes(w)).length
    const s = wordCount > SAMPLE_TEXT.split(/\s+/).length * 1.2 && formalWords >= 2 ? 4 : formalWords >= 1 ? 3 : wordCount >= 20 ? 2 : 1
    setScore(s)
    sessionStorage.setItem('phase6_sp1_step5_interaction3_score', s.toString())
    try { await phase6API.trackGame(5, 3, { completed: true, score: s }, 1) } catch (e) { console.error(e) }
    setSubmitted(true)
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 5: Evaluate — Interaction 3</Typography>
            <Typography variant="body1" color="text.secondary">Enhancement Task</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ryan"
              message="Excellent grammar! Now improve coherence/cohesion, tone, formality, balance, evidence use, vocabulary, and overall effectiveness in the corrected texts. Make tone formal and objective; add connectors (however, therefore, in addition); balance successes and challenges; include evidence."
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: P.orange.border, fontWeight: 'bold' }}>Original Text (corrected):</Typography>
            <Typography variant="body1">{SAMPLE_TEXT}</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <TextField
              fullWidth multiline rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitted}
              placeholder="Write your enhanced version here..."
              sx={{ mb: 2 }}
            />
            {!submitted ? (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!text.trim()}
                sx={{
                  width: '100%', py: 1.5,
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                  cursor: !text.trim() ? 'not-allowed' : 'pointer',
                  opacity: !text.trim() ? 0.5 : 1,
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.blue.border,
                  '&:hover': text.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                Submit Enhanced Version
              </Box>
            ) : (
              <Box>
                <Box sx={{ mb: 2, p: 1.5, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ color: P.green.border, fontWeight: 'bold' }}>
                    Score: {score}/4 — {score >= 3 ? 'Excellent enhancement!' : 'Good effort!'}
                  </Typography>
                </Box>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/1/step/5/score')}
                  sx={{
                    width: '100%', py: 1.5,
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '16px',
                    boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    cursor: 'pointer',
                    fontWeight: 'bold', fontSize: '1rem',
                    color: P.green.border,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s ease',
                  }}
                >
                  Continue to Score
                </Box>
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
