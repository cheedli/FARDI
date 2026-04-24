import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const WORD_BANK = ['success', 'challenge', 'feedback', 'recommend', 'summary', 'improve']

export default function Phase6SP1Step2RemedialB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/2/remedial/b1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    if (answers[0] === 'success') correct++
    if (answers[1] === 'challenge') correct++
    if (answers[2] === 'recommend') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'B1', 'A', correct, 3, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = answers[0] && answers[1] && answers[2]

  const GapSelect = ({ gapIdx }) => (
    <FormControl size="small" sx={{ minWidth: 130 }}>
      <Select value={answers[gapIdx] || ''} onChange={(e) => !submitted && setAnswers({ ...answers, [gapIdx]: e.target.value })} disabled={submitted} displayEmpty sx={{ bgcolor: 'white' }}>
        <MenuItem value=""><em>choose...</em></MenuItem>
        {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Negotiation Gap Fill</Typography>
            <Typography variant="body1" color="text.secondary">Fill gaps in a dialogue planning a report summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Read the dialogue between students planning their report. Fill in the missing words to complete the conversation correctly." />
          </Box>
        </motion.div>

        {/* Word Bank */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {WORD_BANK.map(w => <Box key={w} sx={{ bgcolor: P.green.border, color: 'white', px: 2, py: 0.5, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>{w}</Box>)}
            </Stack>
          </Box>
        </motion.div>

        {/* Dialogue */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Dialogue:</Typography>
            <Stack spacing={2}>
              {/* SKANDER */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: P.purple.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">SK</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.purple), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">SKANDER</Typography>
                  <Typography variant="body1">What write first?</Typography>
                </Box>
              </Box>

              {/* You - gap 0 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.green), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">You</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    <Typography variant="body1">Write about</Typography>
                    <GapSelect gapIdx={0} />
                    <Typography variant="body1">first.</Typography>
                  </Box>
                  {submitted && answers[0] !== 'success' && <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: success</Typography>}
                </Box>
              </Box>

              {/* Emna */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: P.orange.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">EM</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.yellow), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Emna</Typography>
                  <Typography variant="body1">Then?</Typography>
                </Box>
              </Box>

              {/* You - gaps 1, 2 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.green), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">You</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    <Typography variant="body1">Then write</Typography>
                    <GapSelect gapIdx={1} />
                    <Typography variant="body1">and</Typography>
                    <GapSelect gapIdx={2} />
                    <Typography variant="body1">.</Typography>
                  </Box>
                  {submitted && (answers[1] !== 'challenge' || answers[2] !== 'recommend') && (
                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: challenge and recommend</Typography>
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Check My Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task A Complete! Score: {score}/3</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 3 ? 'Perfect! Excellent sequencing!' : 'Good effort! Review the correct terms and continue.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b1/task/b')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Next: Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
