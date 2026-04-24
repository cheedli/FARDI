import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const FAULTY_TEXT = 'Lighting fail bad. We fix soon but maybe delay. Announce now. Backup use but not sure work. Thank patience. Festival maybe ok. Update later. Sorry issue.'
const CORRECTED_EXAMPLE = 'A temporary technical malfunction has affected the main stage lighting system. Our response team has promptly engaged the contingency protocol, with the backup array now deployed-restoration is anticipated within 20-25 minutes. We are communicating this transparently to eliminate uncertainty. While minor delays are possible, the festival program remains fundamentally intact. We sincerely thank you for your patience and understanding during this brief interruption. We remain fully committed to delivering the high-quality experience you expect. Further updates will be provided in real time. We apologize for any inconvenience and appreciate your continued support.'

export default function Phase5Step5RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [correctedText, setCorrectedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    const words = correctedText.trim().split(/\s+/).filter(w => w.length > 0)
    const hasAdvancedVocab = ['malfunction', 'contingency', 'protocol', 'deployed', 'anticipated', 'transparently', 'fundamentally', 'committed', 'stakeholder'].some(word => correctedText.toLowerCase().includes(word))
    const hasPolite = ['sincerely', 'appreciate', 'apologize', 'patience', 'understanding', 'value'].some(word => correctedText.toLowerCase().includes(word))
    const hasCoherence = ['while', 'with', 'furthermore', 'however', 'therefore', 'meanwhile'].some(word => correctedText.toLowerCase().includes(word))
    const hasTimeline = ['within', 'minutes', 'anticipated', 'expected', 'shortly'].some(word => correctedText.toLowerCase().includes(word))
    let correctCount = 0
    if (words.length >= 80) correctCount++
    if (hasAdvancedVocab) correctCount++
    if (hasPolite) correctCount++
    if (hasCoherence) correctCount++
    if (hasTimeline) correctCount++
    if (correctedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length >= 6) correctCount++
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_c1_taskB_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(5, 'C1', 'B', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/5/remedial/c1/task/c') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task B: Analysis Odyssey</Typography>
            <Typography variant="body1">Fully correct/rewrite 8-sentence faulty crisis message with C1 sophistication</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Fully rewrite the faulty crisis message with C1-level sophistication, strategic tone, and nuanced language!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.red.border }}>Faulty Text:</Typography>
              <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>"{FAULTY_TEXT}"</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Example corrected version:</strong> {CORRECTED_EXAMPLE}</Typography>
              </Box>
              <TextField fullWidth multiline rows={12} variant="outlined" label="Your Sophisticated Corrected/Enhanced Text" placeholder="Write your C1-level corrected and enhanced version here (8+ sentences, 80+ words, advanced vocabulary)..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
              <Box component="button" onClick={handleSubmit} disabled={!correctedText.trim()} sx={{ ...clay(P.orange), cursor: 'pointer', width: '100%', opacity: !correctedText.trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit</Typography>
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Task C →</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
