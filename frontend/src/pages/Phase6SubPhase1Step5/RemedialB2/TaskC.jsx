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
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const PAIRS = [
  { error: '"Succes"', errorType: 'Spelling', correction: 'success' },
  { error: '"Come"', errorType: 'Tense', correction: 'came' },
  { error: '"Nice"', errorType: 'Vocabulary', correction: 'well-received' },
  { error: '"Problem bad"', errorType: 'Tone', correction: 'challenge' },
  { error: '"We fix"', errorType: 'Tense', correction: 'was fixed' },
  { error: '"People happy"', errorType: 'Formality', correction: 'guests were satisfied' },
  { error: '"Next time good"', errorType: 'Recommendation', correction: 'recommend improvements' },
  { error: 'No balance', errorType: 'Structure', correction: 'include challenges' }
]

export default function Phase6SP1Step5RemB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [selectedError, setSelectedError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledCorrections] = useState(() => [...PAIRS.map(p => p.correction)].sort(() => Math.random() - 0.5))

  const handleErrorClick = (idx) => {
    if (submitted || matches[idx] !== undefined) return
    setSelectedError(idx === selectedError ? null : idx)
  }

  const handleCorrectionClick = (correction) => {
    if (submitted || selectedError === null) return
    setMatches({ ...matches, [selectedError]: correction })
    setSelectedError(null)
  }

  const allMatched = Object.keys(matches).length === PAIRS.length

  const handleSubmit = async () => {
    let correct = 0
    PAIRS.forEach((p, i) => { if (matches[i] === p.correction) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'C', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const isUsed = (correction) => Object.values(matches).includes(correction)

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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Error Matching Game</Typography>
            <Typography variant="body1" color="text.secondary">Match 8 report errors to their correct alternatives</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Error Matching Game! On the left are 8 error types found in a report. On the right are the correct alternatives. Click an error, then click its correction to match them!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2">Click an error on the left, then click the correct alternative on the right to match them.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            {/* Errors column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.red.border }}>Report Errors:</Typography>
              <Stack spacing={1}>
                {PAIRS.map((p, idx) => {
                  const isMatched = matches[idx] !== undefined
                  const isCorrectMatch = submitted && matches[idx] === p.correction
                  const isWrongMatch = submitted && isMatched && matches[idx] !== p.correction
                  return (
                    <Box
                      key={idx}
                      onClick={() => handleErrorClick(idx)}
                      sx={{
                        px: 2, py: 1.5, borderRadius: '12px',
                        border: `2px solid ${isCorrectMatch ? P.green.border : isWrongMatch ? P.red.border : selectedError === idx ? P.orange.border : isMatched ? P.green.border : P.red.border}`,
                        bgcolor: isCorrectMatch ? P.green.bg : isWrongMatch ? P.red.bg : selectedError === idx ? P.orange.bg : isMatched ? P.green.bg : P.red.bg,
                        cursor: (submitted || isMatched) ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': (!submitted && !isMatched) ? { transform: 'translate(-1px,-1px)' } : {},
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.red.border }}>{p.error}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.errorType}</Typography>
                      {isMatched && <Typography variant="caption" sx={{ display: 'block', color: isCorrectMatch ? P.green.border : P.red.border }}>→ {matches[idx]}</Typography>}
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            {/* Corrections column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Correct Alternatives:</Typography>
              <Stack spacing={1}>
                {shuffledCorrections.map((correction) => {
                  const used = isUsed(correction)
                  return (
                    <Box
                      key={correction}
                      onClick={() => handleCorrectionClick(correction)}
                      sx={{
                        px: 2, py: 1.5, borderRadius: '12px',
                        border: `2px solid ${used ? P.green.border : selectedError !== null ? P.teal.border : 'rgba(0,0,0,0.15)'}`,
                        bgcolor: used ? P.green.bg : selectedError !== null ? P.teal.bg : P.pageBg,
                        cursor: (submitted || used) ? 'default' : 'pointer',
                        fontFamily: 'monospace', fontWeight: 'bold',
                        color: used ? P.green.border : selectedError !== null ? P.teal.border : 'text.primary',
                        transition: 'all 0.15s ease',
                        '&:hover': (!submitted && !used) ? { transform: 'translate(-1px,-1px)' } : {},
                      }}
                    >
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{correction}</Typography>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </Box>
        </motion.div>

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
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{PAIRS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 7 ? 'Excellent! You can identify and correct all report error types.' : score >= 5 ? 'Good work! Review the correct matches above.' : 'Good effort! Focus on recognizing formality, tense, and vocabulary issues.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/1')}
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
                Continue to Sub-Phase 2 →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
