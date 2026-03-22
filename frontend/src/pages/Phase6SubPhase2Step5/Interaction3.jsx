import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
}

const SAMPLE_TEXT = "The festival had many visitors last week. Students were very excited and they participated in all activities. The organizers planned well and every booth was successful. We recommend improvements for next time."

export default function Phase6SP2Step5Int3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'main' })
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    if (!text.trim()) return
    const wordCount = text.split(/\s+/).length
    const formalWords = ['evidence', 'recommend', 'achieved', 'conclude', 'furthermore', 'however', 'specifically', 'analysis'].filter(w => text.toLowerCase().includes(w)).length
    const s = wordCount > SAMPLE_TEXT.split(/\s+/).length * 1.2 && formalWords >= 2 ? 4 : formalWords >= 1 ? 3 : wordCount >= 20 ? 2 : 1
    setScore(s)
    sessionStorage.setItem('phase6_sp2_step5_interaction3_score', s.toString())
    try { await phase6API.trackGame(5, 3, { completed: true, score: s }, 2) } catch (e) { console.error(e) }
    setSubmitted(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 5: Evaluate - Interaction 3</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Enhancement Task</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: P.teal.shadow }}>
              Ryan: "Excellent! Now restructure the feedback into the positive sandwich format and make all suggestions specific and actionable."
            </Typography>
            <Box sx={{ ...cardSx(P.orange), mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: P.orange.shadow }}>Original Text (corrected):</Typography>
              <Typography variant="body1">{SAMPLE_TEXT}</Typography>
            </Box>
            <TextField fullWidth multiline rows={6} value={text} onChange={(e) => setText(e.target.value)} disabled={submitted} placeholder="Write your enhanced version here..." sx={{ mb: 2 }} />
            {!submitted ? (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!text.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.blue.border,
                  color: 'white',
                  border: `2px solid ${P.blue.shadow}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: !text.trim() ? 'not-allowed' : 'pointer',
                  opacity: !text.trim() ? 0.6 : 1,
                  '&:hover': text.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                  transition: 'all 0.15s',
                }}
              >
                Submit Enhanced Version
              </Box>
            ) : (
              <Box>
                <Box sx={{ ...cardSx(P.green), mb: 2 }}>
                  <Typography variant="body1" sx={{ color: P.green.shadow }}>
                    Score: {score}/4 - {score >= 3 ? 'Excellent enhancement!' : 'Good effort!'}
                  </Typography>
                </Box>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/2/step/5/score')}
                  sx={{
                    width: '100%',
                    bgcolor: P.green.border,
                    color: 'white',
                    border: `2px solid ${P.green.shadow}`,
                    borderRadius: '14px',
                    boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s',
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
