import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const MATCHING_PAIRS = [
  { id: 1, term: 'please', function: 'Makes request polite' },
  { id: 2, term: 'first', function: 'Shows step 1' },
  { id: 3, term: 'then', function: 'Shows next step' },
  { id: 4, term: 'after that', function: 'Shows later step' },
  { id: 5, term: 'be careful', function: 'Safety warning' },
  { id: 6, term: 'help', function: 'Offer support' },
  { id: 7, term: 'guide', function: 'Show direction' },
  { id: 8, term: 'thank you', function: 'Show gratitude' }
]

export default function Phase5SubPhase2Step1RemedialB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledFunctions = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5).map(p => p.function)

  const handleMatch = (termId, functionText) => setMatches(prev => ({ ...prev, [termId]: functionText }))

  const calculateScore = () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => { if (matches[pair.id] === pair.function) correctCount++ })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_b2_taskC_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(1, 'B2', 'C', finalScore, 8, 2) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/1/remedial/b2/task/d')
  const allMatched = MATCHING_PAIRS.every(pair => matches[pair.id])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 1: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task C: Matching Game</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Match 8 instruction words/phrases to their functions. Match correctly to win!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each instruction word or phrase to its function. Select the correct function for each term!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {MATCHING_PAIRS.map((pair) => (
                <Box key={pair.id} sx={{ ...clay(P.blue) }}>
                  <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>{pair.term}</Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={matches[pair.id] || ''} onChange={(e) => handleMatch(pair.id, e.target.value)}>
                      {shuffledFunctions.map((func, idx) => (
                        <FormControlLabel key={idx} value={func} control={<Radio />} label={func} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
            </Stack>
            <Box component="button" onClick={handleSubmit} disabled={!allMatched}
              sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', width: '100%', opacity: !allMatched ? 0.5 : 1 }}>
              Submit Matches
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task C Complete!</Typography>
              <Typography variant="h6">Score: {score} / 8</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>
                Next: Task D →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
