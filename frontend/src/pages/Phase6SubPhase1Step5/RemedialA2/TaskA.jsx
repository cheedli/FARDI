import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

const PAIRS = [
  { wrong: 'succes', correct: 'success' },
  { wrong: 'challange', correct: 'challenge' },
  { wrong: 'feedbak', correct: 'feedback' },
  { wrong: 'improv', correct: 'improve' },
  { wrong: 'recomend', correct: 'recommend' },
  { wrong: 'sumary', correct: 'summary' },
  { wrong: 'achievment', correct: 'achievement' },
  { wrong: 'evidance', correct: 'evidence' }
]

export default function Phase6SP1Step5RemA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledCorrect] = useState(() => [...PAIRS.map(p => p.correct)].sort(() => Math.random() - 0.5))

  const handleWrongClick = (wrong) => {
    if (submitted) return
    setSelected(wrong === selected ? null : wrong)
  }

  const handleCorrectClick = (correct) => {
    if (submitted || !selected) return
    setMatches({ ...matches, [selected]: correct })
    setSelected(null)
  }

  const allMatched = Object.keys(matches).length === PAIRS.length

  const handleSubmit = async () => {
    let correct = 0
    PAIRS.forEach(p => { if (matches[p.wrong] === p.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'A', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Spelling Rescue</Typography>
            <Typography variant="body1" color="text.secondary">Match 8 misspelled words to their correct spellings</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Spelling Rescue! Match each misspelled word on the left to its correct spelling on the right. Click a misspelled word, then click the correct spelling to match them!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2">Click a word on the left (misspelled), then click the correct spelling on the right to match them.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Wrong column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.red.border }}>Misspelled Words:</Typography>
              <Stack spacing={1}>
                {PAIRS.map((p) => {
                  const isMatched = !!matches[p.wrong]
                  return (
                    <Box
                      key={p.wrong}
                      onClick={() => handleWrongClick(p.wrong)}
                      sx={{
                        px: 2, py: 1, borderRadius: '12px',
                        border: `2px solid ${isMatched ? P.green.border : selected === p.wrong ? P.orange.border : P.red.border}`,
                        bgcolor: isMatched ? P.green.bg : selected === p.wrong ? P.orange.bg : P.red.bg,
                        cursor: (submitted || isMatched) ? 'default' : 'pointer',
                        fontFamily: 'monospace', fontWeight: 'bold',
                        color: isMatched ? P.green.border : selected === p.wrong ? P.orange.border : P.red.border,
                        transition: 'all 0.15s ease',
                        '&:hover': (!submitted && !isMatched) ? { transform: 'translate(-1px,-1px)' } : {},
                      }}
                    >
                      {p.wrong}
                    </Box>
                  )
                })}
              </Stack>
            </Box>
            {/* Correct column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Correct Spellings:</Typography>
              <Stack spacing={1}>
                {shuffledCorrect.map((correct) => {
                  const isUsed = Object.values(matches).includes(correct)
                  return (
                    <Box
                      key={correct}
                      onClick={() => handleCorrectClick(correct)}
                      sx={{
                        px: 2, py: 1, borderRadius: '12px',
                        border: `2px solid ${isUsed ? P.green.border : selected ? P.teal.border : 'rgba(0,0,0,0.15)'}`,
                        bgcolor: isUsed ? P.green.bg : selected ? P.teal.bg : P.pageBg,
                        cursor: (submitted || isUsed) ? 'default' : 'pointer',
                        fontFamily: 'monospace', fontWeight: 'bold',
                        color: isUsed ? P.green.border : selected ? P.teal.border : 'text.primary',
                        transition: 'all 0.15s ease',
                        '&:hover': (!submitted && !isUsed) ? { transform: 'translate(-1px,-1px)' } : {},
                      }}
                    >
                      {correct}
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ mt: 3 }}>
          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allMatched}
              sx={{
                width: '100%', py: 1.5,
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                cursor: !allMatched ? 'not-allowed' : 'pointer',
                opacity: !allMatched ? 0.5 : 1,
                fontWeight: 'bold', fontSize: '1rem',
                color: P.orange.border,
                '&:hover': allMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              Submit Matches
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task A Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{PAIRS.length} correct matches</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {score >= 7 ? 'Excellent spelling accuracy!' : score >= 5 ? 'Good work! Keep practicing spelling.' : 'Keep working on spelling — these words are important for reports.'}
                </Typography>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/1/step/5/remedial/a2/task/b')}
                  sx={{
                    mt: 2, px: 6, py: 1.5,
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '16px',
                    boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s ease',
                  }}
                >
                  Next: Task B →
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  )
}
