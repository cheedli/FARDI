import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

const GUIDED_QUESTIONS = [
  { label: '1. Main purpose', example: 'Example: To summarize what happened at the event.' },
  { label: '2. Show success', example: 'Example: To show the achievements and positive outcomes.' },
  { label: '3. Show challenge', example: 'Example: To be honest about problems that occurred.' },
  { label: '4. Use feedback', example: 'Example: To use opinions from guests to improve.' },
  { label: '5. Find strength', example: 'Example: To identify what we did well as a team.' },
  { label: '6. Find weakness', example: 'Example: To see what areas need improvement.' },
  { label: '7. Recommend', example: 'Example: To suggest better ideas for the next event.' },
  { label: '8. Help future', example: 'Example: To make the next event even better.' }
]

export default function Phase6SP1Step3RemedialB2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/3/remedial/b2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 2, context: 'remedial_b2' })
  const [sentences, setSentences] = useState(Array(GUIDED_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleChange = (idx, val) => { const updated = [...sentences]; updated[idx] = val; setSentences(updated) }

  const handleSubmit = async () => {
    const filled = sentences.filter(s => s.trim().split(/\s+/).length >= 3).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'B', filled, GUIDED_QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = sentences.every(s => s.trim().length > 0)
  const wordCount = sentences.join(' ').split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Explain Expedition</Typography>
            <Typography variant="body1" color="text.secondary">Write 8 sentences explaining why we write a post-event report</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Explain Expedition! Write a sentence for each reason why we write a post-event report. Use complete sentences with B2-level vocabulary." />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3, p: 2 }}>
            <Typography variant="body2"><strong>Tips:</strong> Use purpose language ("To...", "In order to..."). Be specific. Use report vocabulary (success, challenge, feedback, improve, recommend).</Typography>
          </Box>
        </motion.div>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {GUIDED_QUESTIONS.map((q, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.03 }}>
              <Box sx={{ ...cardSx(P.blue), p: 2.5 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: P.blue.border, mb: 0.5 }}>{q.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{q.example}</Typography>
                <TextField fullWidth size="small" value={sentences[idx]} onChange={(e) => handleChange(idx, e.target.value)} disabled={submitted} placeholder="Write your sentence here..." />
              </Box>
            </motion.div>
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Total words: {wordCount}</Typography>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit My Explanation
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task B Complete! Score: {score}/{GUIDED_QUESTIONS.length}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/b2/task/c')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Next: Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
