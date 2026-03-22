import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Grid, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
}

const PAIRS = [
  { word: 'feedback', definition: 'Speech bubble' },
  { word: 'positive', definition: 'Happy face' },
  { word: 'suggestion', definition: 'Idea light bulb' },
  { word: 'strength', definition: 'Muscle' },
  { word: 'weakness', definition: 'Broken chain' },
  { word: 'improve', definition: 'Arrow up' }
]

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

export default function Phase6SP2Step4RemA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_a2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedWords = new Set(Object.keys(matches).map(Number))
  const matchedDefs = new Set(Object.values(matches).map(Number))

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

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
    sessionStorage.setItem('phase6_sp2_step4_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'A2', 'A', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial A2 - Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Match Race: Feedback Words</Typography>
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
                <Typography variant="body2">Click a feedback word, then click its matching picture/description.</Typography>
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ ...cardSx(P.blue) }}>
                    <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.blue.border }}>Feedback Words</Typography>
                    <Stack spacing={1.5}>
                      {PAIRS.map((p, idx) => (
                        <Box key={idx} onClick={() => handleWordClick(idx)} sx={{
                          p: 1.5, borderRadius: '12px', border: '2px solid',
                          borderColor: selectedWord === idx ? P.orange.border : matchedWords.has(idx) ? P.green.border : P.blue.border,
                          bgcolor: selectedWord === idx ? P.orange.bg : matchedWords.has(idx) ? P.green.bg : P.blue.bg,
                          cursor: 'pointer', textAlign: 'center',
                          boxShadow: selectedWord === idx ? `3px 3px 0 ${P.orange.shadow}` : `2px 2px 0 ${P.blue.shadow}`,
                          transition: 'all 0.15s',
                        }}>
                          <Typography variant="body1" fontWeight="bold">{p.word}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">→</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ ...cardSx(P.green) }}>
                    <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.green.border }}>Pictures / Descriptions</Typography>
                    <Stack spacing={1.5}>
                      {shuffledDefs.map((item, dIdx) => (
                        <Box key={dIdx} onClick={() => handleDefClick(dIdx)} sx={{
                          p: 1.5, borderRadius: '12px', border: '2px solid',
                          borderColor: matchedDefs.has(dIdx) ? P.green.border : selectedWord !== null ? P.orange.border : P.green.border,
                          cursor: selectedWord !== null ? 'pointer' : 'default',
                          bgcolor: matchedDefs.has(dIdx) ? P.green.bg : P.green.bg,
                          boxShadow: `2px 2px 0 ${P.green.shadow}`,
                          transition: 'all 0.15s',
                        }}>
                          <Typography variant="body2">{item.definition}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={matchedWords.size < PAIRS.length}
                sx={{
                  ...cardSx(P.orange),
                  cursor: matchedWords.size < PAIRS.length ? 'not-allowed' : 'pointer',
                  opacity: matchedWords.size < PAIRS.length ? 0.6 : 1,
                  px: 6,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.shadow,
                  '&:hover': matchedWords.size >= PAIRS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s',
                }}
              >
                Submit
              </Box>
            </Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task A Complete! Score: {score}/{PAIRS.length}</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/4/remedial/a2/task/b')}
                sx={{
                  mt: 2, bgcolor: P.green.border, color: 'white',
                  border: `2px solid ${P.green.shadow}`, borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4,
                  fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
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
