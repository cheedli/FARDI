import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
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
  { word: 'please', definition: 'Polite word' },
  { word: 'thank you', definition: 'Say after help' },
  { word: 'first', definition: 'Number 1 step' },
  { word: 'then', definition: 'Next step' },
  { word: 'careful', definition: 'Be safe' },
  { word: 'help', definition: 'Give hand' }
]

export default function Phase5SubPhase2Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (word, definition) => setMatches(prev => ({ ...prev, [word]: definition }))
  const calculateScore = () => MATCHING_PAIRS.filter(p => matches[p.word] === p.definition).length

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_a2_taskA_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(2, 'A2', 'A', finalScore, 6, 2) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/2/remedial/a2/task/b')
  const allMatched = Object.keys(matches).length === MATCHING_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 2: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task A: Match Race</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Match 6 instruction words to their definitions. Race against time!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Match Race! Match each instruction word to its definition. Click a word, then click its matching definition. Complete all matches to finish!" />
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: P.orange.border }}>Match the Words to Definitions</Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {MATCHING_PAIRS.map((pair, idx) => (
                <Box key={idx} sx={{ ...clay(P.blue) }}>
                  <Typography variant="body1" gutterBottom><strong>{pair.word}</strong> → {matches[pair.word] || '______'}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {MATCHING_PAIRS.map((p, i) => (
                      <Box key={i} component="button" onClick={() => handleMatch(pair.word, p.definition)} disabled={submitted}
                        sx={{ ...clay(matches[pair.word] === p.definition ? P.orange : P.blue), ...hoverLift(matches[pair.word] === p.definition ? P.orange : P.blue), cursor: 'pointer', px: 2, py: 0.5, fontSize: '0.8rem', fontWeight: 'bold', color: matches[pair.word] === p.definition ? P.orange.border : P.blue.border, transition: 'all 0.15s' }}>
                        {p.definition}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={handleSubmit} disabled={!allMatched}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 6, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', opacity: !allMatched ? 0.5 : 1 }}>
                Submit Answers
              </Box>
            </Box>
          </motion.div>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task A Complete!</Typography>
              <Typography variant="h6">Score: {score} / 6</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>{score >= 6 ? 'Excellent! All matches correct!' : "Good work! Let's continue to the next task."}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>
                Next: Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
