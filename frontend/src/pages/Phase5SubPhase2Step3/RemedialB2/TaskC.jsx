import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

const MATCHING_PAIRS = [
  { term: 'please', definition: 'Polite request marker' },
  { term: 'thank you', definition: 'Expression of gratitude' },
  { term: 'first', definition: 'Initial step indicator' },
  { term: 'then', definition: 'Sequential connector' },
  { term: 'careful', definition: 'Safety reminder' },
  { term: 'guide', definition: 'Direction provider' },
  { term: 'welcome', definition: 'Warm greeting' },
  { term: 'help', definition: 'Assistance offer' }
]

const DEFINITIONS = MATCHING_PAIRS.map(p => p.definition)

export default function Phase5SubPhase2Step3RemedialB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/2/step/3/remedial/b2/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (term, definition) => {
    setMatches(prev => ({ ...prev, [term]: definition }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => {
      if (matches[pair.term] === pair.definition) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_b2_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'B2', 'C', correctCount, 8, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3/remedial/b2/task/d')
  }

  const allMatched = Object.keys(matches).length === MATCHING_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 3: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task C: Kahoot Match</Typography>
            <Typography variant="body1">Match 8 terms to advanced definitions</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Kahoot Match! Match each instruction term to its advanced definition. Choose the best match for each term!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {MATCHING_PAIRS.map((pair, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <Box sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}><strong>{pair.term}</strong></Typography>
                    <FormControl component="fieldset">
                      <RadioGroup value={matches[pair.term] || ''} onChange={(e) => handleMatch(pair.term, e.target.value)}>
                        {DEFINITIONS.map((def, idx) => (
                          <FormControlLabel key={idx} value={def} control={<Radio />} label={def} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Box
              component="button" onClick={handleSubmit} disabled={!allMatched}
              sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.blue.border, cursor: allMatched ? 'pointer' : 'not-allowed',
                opacity: allMatched ? 1 : 0.5, width: '100%',
                transition: 'all 0.15s',
                '&:hover': allMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
              }}
            >Submit Answers</Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button" onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >Next: Task D →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
