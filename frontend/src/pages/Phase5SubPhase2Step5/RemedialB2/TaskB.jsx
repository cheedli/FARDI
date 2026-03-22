import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const FAULTY_TEXT = 'Welcom gests. Chek ticket. Guied to booth. Be cairful. Help peoples. Thankk you. Smyle. Good job.'

const CORRECTED_EXAMPLE = `First, please warmly welcome guests: "Welcome to the Global Cultures Festival!" Then, politely check their tickets or registration. Next, guide them clearly to the correct booth or area. Be careful and safety-conscious with queues and pathways. Offer help if guests have questions. Thank each person for coming and for their cooperation. Smile and stay positive - your friendly attitude makes a big difference. You are doing a great job!`

export default function Phase5SubPhase2Step5RemedialB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 2, context: 'remedial_b2' })
  const [correctedText, setCorrectedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const sentences = correctedText.trim().split(/[.!?]+/).filter(s => s.trim().length > 0)
    let correctCount = 0
    if (sentences.length >= 8) correctCount++
    if (correctedText.toLowerCase().includes('please') || correctedText.toLowerCase().includes('thank')) correctCount++
    if (correctedText.toLowerCase().includes('first') || correctedText.toLowerCase().includes('then') || correctedText.toLowerCase().includes('next')) correctCount++
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b2_taskB_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(5, 'B2', 'B', correctCount, 3, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/5/remedial/b2/task/c')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 5: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task B: Analysis Odyssey</Typography>
            <Typography variant="body1">Fully correct/rewrite 8-sentence faulty volunteer instructions. Coherent B2-level rewrite!</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Analysis Odyssey! Rewrite the faulty instructions completely. Make them coherent, polite, sequenced, and clear. Write at least 8 sentences!" />
          </Box>
          {!submitted ? (
            <>
              <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '14px', boxShadow: `3px 3px 0 ${P.red.shadow}`, p: 2, mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.red.shadow }}>Faulty Text:</Typography>
                <Typography variant="body2" component="pre" sx={{ mt: 1, fontFamily: 'monospace' }}>{FAULTY_TEXT}</Typography>
              </Box>
              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Example corrected version:</strong></Typography>
                <Typography variant="body2" component="pre" sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>{CORRECTED_EXAMPLE}</Typography>
              </Box>
              <TextField fullWidth multiline rows={10} variant="outlined" label="Your Corrected Version (at least 8 sentences)" placeholder="First, please warmly welcome guests..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
              <Box component="button" onClick={handleSubmit} disabled={!correctedText.trim()}
                sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Submit Correction
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task B Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 3</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue}
                  sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                  Next: Task C →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
