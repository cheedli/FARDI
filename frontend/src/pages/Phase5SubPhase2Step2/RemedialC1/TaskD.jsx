import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const APPROACHES = [
  { id: 1, text: '"Do that thing now."', issue: 'Vague and imprecise language' },
  { id: 2, text: '"Hurry up and check their stuff."', issue: 'Informal and disrespectful tone' },
  { id: 3, text: '"Just tell them to go there."', issue: 'Lacks clarity and direction' },
  { id: 4, text: '"Don\'t mess it up."', issue: 'Negative and unhelpful instruction' },
  { id: 5, text: '"You figure out the problem."', issue: 'Abdication of guidance responsibility' },
  { id: 6, text: '"Whatever, just smile."', issue: 'Dismissive and unprofessional' }
]

export default function Phase5SubPhase2Step2RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 4, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [fixes, setFixes] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const handleCritiqueChange = (value) => { const a = [...critiques]; a[currentIndex] = value; setCritiques(a) }
  const handleFixChange = (value) => { const a = [...fixes]; a[currentIndex] = value; setFixes(a) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const handleSubmit = async () => {
    let c = 0
    APPROACHES.forEach((_, i) => {
      const critiqueOk = critiques[i].trim().split(/\s+/).length >= 4
      const fixWords = fixes[i].trim().split(/\s+/).filter(x => x.length > 0), fixL = fixes[i].toLowerCase()
      const hasProfessional = fixL.includes('please') || fixL.includes('first') || fixL.includes('then') || fixL.includes('carefully') || fixL.includes('professionally')
      if (critiqueOk && fixWords.length >= 8 && hasProfessional) c++
    })
    setScore(c); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_c1_taskD_score', c.toString())
    try { await phase5API.logRemedialActivity(2, 'C1', 'D', c, 6, 2) } catch (e) { console.error(e) }
  }
  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(2, 'C1'))
  const progress = ((currentIndex + 1) / 6) * 100
  const currentFilled = critiques[currentIndex].trim() && fixes[currentIndex].trim()
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 2: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task D: Critique Game</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Critique 6 poor instructions and rewrite them professionally.</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Game! For each poor instruction, write a critique (at least 4 words) identifying the problem, then rewrite it professionally (at least 8 words) using polite or sequencing language." />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Instruction {currentIndex + 1} of 6</Typography>
                <Typography variant="body2" sx={{ color: P.blue.border, fontWeight: 'bold' }}>{Math.round(progress)}% Complete</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Poor Instruction {currentIndex + 1}:</Typography>
              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                <Typography variant="body1" fontStyle="italic">{APPROACHES[currentIndex].text}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>Issue: {APPROACHES[currentIndex].issue}</Typography>
              </Box>
              <TextField fullWidth multiline rows={2} variant="outlined" label="Your critique (what's wrong?)"
                placeholder="Explain what is wrong with this instruction..."
                value={critiques[currentIndex]} onChange={(e) => handleCritiqueChange(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={3} variant="outlined" label="Your professional rewrite"
                placeholder="Rewrite this instruction professionally..."
                value={fixes[currentIndex]} onChange={(e) => handleFixChange(e.target.value)} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                {currentIndex === 5 ? (
                  <Box component="button" onClick={handleSubmit} disabled={!currentFilled}
                    sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.orange.border, transition: 'all 0.15s', opacity: !currentFilled ? 0.5 : 1 }}>Submit All</Box>
                ) : (
                  <Box component="button" onClick={handleNext} disabled={!currentFilled}
                    sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: !currentFilled ? 0.5 : 1 }}>Next →</Box>
                )}
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task D Complete!</Typography>
              <Typography variant="h6">Score: {score} / 6</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>Continue to Step 3 →</Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
