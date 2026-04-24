import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const WORD_BANK = ['balanced evaluation', 'transparency', 'continuous improvement', 'evidence-based', 'actionable']
const CORRECT_ANSWERS = { 0: 'balanced evaluation', 1: 'transparency', 2: 'evidence-based', 3: 'continuous improvement' }

export default function Phase6SP1Step2RemedialC1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/2/remedial/c1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, val]) => { if (answers[parseInt(key)] === val) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'C1', 'A', correct, Object.keys(CORRECT_ANSWERS).length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = Object.keys(CORRECT_ANSWERS).every(k => answers[parseInt(k)])

  const GapSelect = ({ gapIdx }) => {
    const correct = CORRECT_ANSWERS[gapIdx]
    const isCorrect = submitted && answers[gapIdx] === correct
    return (
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select value={answers[gapIdx] || ''} onChange={(e) => !submitted && setAnswers({ ...answers, [gapIdx]: e.target.value })} disabled={submitted} displayEmpty sx={{ bgcolor: submitted ? (isCorrect ? P.green.bg : P.red.bg) : 'white' }}>
          <MenuItem value=""><em>choose...</em></MenuItem>
          {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Debate Simulation</Typography>
            <Typography variant="body1" color="text.secondary">Simulate a dialogue defending the value of balanced reporting</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="In this debate simulation, a skeptic questions the value of a balanced report. Fill in the gaps with the correct advanced terms to defend professional report writing." />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Word Bank (Advanced Terms):</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {WORD_BANK.map(w => <Box key={w} sx={{ bgcolor: P.green.border, color: 'white', px: 2, py: 0.5, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>{w}</Box>)}
            </Stack>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Debate:</Typography>
            <Stack spacing={2}>
              {/* Skeptic Line 1 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">SK</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.red), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Skeptic</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"Why show weaknesses in the report? It makes us look bad."</Typography>
                </Box>
              </Box>
              {/* You - gaps 0, 1 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.green), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">You</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    <GapSelect gapIdx={0} />
                    <Typography variant="body1">shows</Typography>
                    <GapSelect gapIdx={1} />
                    <Typography variant="body1">.</Typography>
                  </Box>
                  {submitted && (answers[0] !== 'balanced evaluation' || answers[1] !== 'transparency') && (
                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: "Balanced evaluation shows transparency."</Typography>
                  )}
                </Box>
              </Box>
              {/* Skeptic Line 2 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">SK</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.red), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Skeptic</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"Just write the successes. No one wants to read about problems."</Typography>
                </Box>
              </Box>
              {/* You - gaps 2, 3 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.green), flex: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary">You</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    <Typography variant="body1">No —</Typography>
                    <GapSelect gapIdx={2} />
                    <Typography variant="body1">analysis drives</Typography>
                    <GapSelect gapIdx={3} />
                    <Typography variant="body1">.</Typography>
                  </Box>
                  {submitted && (answers[2] !== 'evidence-based' || answers[3] !== 'continuous improvement') && (
                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: "No — evidence-based analysis drives continuous improvement."</Typography>
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>
        </motion.div>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit My Debate Responses
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task A Complete! Score: {score}/4</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 4 ? 'Excellent! Perfect use of advanced report vocabulary!' : 'Good effort! Review the advanced terms and their meanings.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/2/remedial/c1/task/b')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Next: Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
