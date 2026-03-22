import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const ERROR_PAIRS = [
  { error: '"Pleese"', errorType: 'Spelling', correction: 'please' },
  { error: '"Furst"', errorType: 'Spelling', correction: 'first' },
  { error: '"Guied"', errorType: 'Spelling', correction: 'guide' },
  { error: '"Cairful"', errorType: 'Spelling', correction: 'careful' },
  { error: '"Thankk"', errorType: 'Spelling', correction: 'thank' },
  { error: '"Peoples"', errorType: 'Grammar', correction: 'people' },
  { error: 'No sequencing', errorType: 'Structure', correction: 'Add first/then' },
  { error: 'No politeness', errorType: 'Tone', correction: 'Add please/thank you' }
]

const CORRECTIONS = ERROR_PAIRS.map(p => p.correction)

export default function Phase5SubPhase2Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (error, correction) => setMatches(prev => ({ ...prev, [error]: correction }))
  const handleSubmit = async () => {
    let correctCount = 0
    ERROR_PAIRS.forEach(pair => { if (matches[pair.error] === pair.correction) correctCount++ })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b2_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(5, 'B2', 'C', correctCount, 8, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/5/remedial/b2/task/d')
  const allMatched = Object.keys(matches).length === ERROR_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 5: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task C: Matching Game</Typography>
            <Typography variant="body1">Match 8 error types to corrections</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each error to its correction. Choose the best match!" />
          </Box>
          {!submitted ? (
            <>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {ERROR_PAIRS.map((pair, idx) => (
                  <Box key={idx} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 3 }}>
                    <Typography variant="h6" gutterBottom><strong>{pair.error}</strong> ({pair.errorType}) → ?</Typography>
                    <FormControl component="fieldset">
                      <RadioGroup value={matches[pair.error] || ''} onChange={(e) => handleMatch(pair.error, e.target.value)}>
                        {CORRECTIONS.map((corr, i) => <FormControlLabel key={i} value={corr} control={<Radio />} label={corr} />)}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
              </Stack>
              <Box component="button" onClick={handleSubmit} disabled={!allMatched}
                sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Submit Answers
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task C Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue}
                  sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                  Next: Task D →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
