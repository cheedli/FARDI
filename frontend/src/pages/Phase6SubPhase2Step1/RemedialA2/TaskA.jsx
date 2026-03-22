import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Grid, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
}

const PAIRS = [
  { word: 'feedback', definition: 'What people say about your work' },
  { word: 'positive', definition: 'Good things' },
  { word: 'suggestion', definition: 'Idea to make better' },
  { word: 'strength', definition: 'Good part' },
  { word: 'weakness', definition: 'Bad part / area to improve' },
  { word: 'improve', definition: 'Make better' },
]

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

export default function Phase6SP2Step1RemA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'remedial_a2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const matchedWords = new Set(Object.keys(matches).map(Number))
  const matchedDefs = new Set(Object.values(matches).map(Number))

  const handleWordClick = (idx) => {
    if (submitted) return
    if (matchedWords.has(idx)) { const m = { ...matches }; delete m[idx]; setMatches(m); return }
    setSelectedWord(idx)
  }
  const handleDefClick = (defIdx) => {
    if (submitted || selectedWord === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === defIdx) delete m[k] })
    m[selectedWord] = defIdx
    setMatches(m)
    setSelectedWord(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([wIdx, dIdx]) => {
      if (PAIRS[parseInt(wIdx)].word === shuffledDefs[parseInt(dIdx)].word) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'A2', 'A', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>
              Step 1: Remedial A2 — Task A
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Match Race: Peer Feedback Words
            </Typography>
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                Click a feedback word, then click its matching definition.
              </Alert>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ ...cardSx(P.blue), p: 2 }}>
                    <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.blue.border }}>Feedback Words</Typography>
                    <Stack spacing={1.5}>
                      {PAIRS.map((p, idx) => (
                        <Box
                          key={idx}
                          component="button"
                          onClick={() => handleWordClick(idx)}
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            border: '2px solid',
                            borderColor: selectedWord === idx ? P.purple.border : matchedWords.has(idx) ? P.green.border : P.blue.border,
                            bgcolor: selectedWord === idx ? P.purple.bg : matchedWords.has(idx) ? P.green.bg : P.blue.bg,
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            width: '100%',
                            transition: 'all 0.15s',
                            '&:hover': { transform: 'translate(-1px,-1px)' },
                          }}
                        >
                          {p.word}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'text.secondary' }}>→</Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Box sx={{ ...cardSx(P.blue), p: 2 }}>
                    <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.blue.border }}>Definitions</Typography>
                    <Stack spacing={1.5}>
                      {shuffledDefs.map((item, dIdx) => (
                        <Box
                          key={dIdx}
                          component="button"
                          onClick={() => handleDefClick(dIdx)}
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            border: '2px solid',
                            borderColor: matchedDefs.has(dIdx) ? P.green.border : selectedWord !== null ? P.purple.border : P.blue.border,
                            bgcolor: matchedDefs.has(dIdx) ? P.green.bg : P.blue.bg,
                            cursor: selectedWord !== null ? 'pointer' : 'default',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                            fontSize: '0.9rem',
                            width: '100%',
                            transition: 'all 0.15s',
                          }}
                        >
                          {item.definition}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={matchedWords.size < PAIRS.length}
                  sx={{
                    px: 5, py: 1.5,
                    borderRadius: '16px',
                    border: `2px solid ${P.orange.border}`,
                    bgcolor: P.orange.bg,
                    boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: matchedWords.size < PAIRS.length ? 'not-allowed' : 'pointer',
                    opacity: matchedWords.size < PAIRS.length ? 0.5 : 1,
                    '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                    transition: 'all 0.15s',
                  }}
                >
                  Submit
                </Box>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.green.shadow }}>
                Task A Complete! Score: {score}/{PAIRS.length}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/1/remedial/a2/task/b')}
                sx={{
                  mt: 2, px: 5, py: 1.5,
                  borderRadius: '16px',
                  border: `2px solid ${P.green.border}`,
                  bgcolor: P.green.bg,
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
