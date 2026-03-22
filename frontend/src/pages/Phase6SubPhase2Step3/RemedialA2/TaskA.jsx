import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const PAIRS = [
  { word: 'feedback', definition: 'What people say about work' },
  { word: 'positive', definition: 'Good things' },
  { word: 'suggestion', definition: 'Idea to make better' },
  { word: 'strength', definition: 'Good part' },
  { word: 'weakness', definition: 'Bad part / needs work' },
  { word: 'improve', definition: 'Make better' },
  { word: 'polite', definition: 'Be nice and kind' },
  { word: 'helpful', definition: 'Good to use / useful' }
]

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

export default function Phase6SP2Step3RemA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_a2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedWords = new Set(Object.keys(matches).map(Number))
  const matchedDefs = new Set(Object.values(matches).map(Number))

  const handleWordClick = (idx) => {
    if (submitted) return
    if (matchedWords.has(idx)) { const m = { ...matches }; delete m[idx]; setMatches(m); return }
    setSelectedWord(idx)
  }
  const handleDefClick = (dIdx) => {
    if (submitted || selectedWord === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === dIdx) delete m[k] })
    m[selectedWord] = dIdx
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
    sessionStorage.setItem('phase6_sp2_step3_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'A2', 'A', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial A2 - Task A</Typography>
            <Typography>Term Treasure Hunt: Match Feedback Words to Definitions</Typography>
          </Box>

          {!submitted ? (
            <>
              <Box sx={{ ...cardSx('blue'), mb: 3 }}>
                <Typography variant="body2">Click a feedback word, then click its matching definition.</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                {/* Words column */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ ...cardSx('purple'), mb: 2 }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}>Feedback Words</Typography>
                    <Stack spacing={1.5}>
                      {PAIRS.map((p, idx) => (
                        <Box
                          key={idx}
                          component="button"
                          onClick={() => handleWordClick(idx)}
                          sx={{
                            p: 1.5, borderRadius: '12px', border: '2px solid',
                            borderColor: selectedWord === idx ? P.purple.border : matchedWords.has(idx) ? P.green.border : P.teal.border,
                            bgcolor: selectedWord === idx ? P.purple.bg : matchedWords.has(idx) ? P.green.bg : 'transparent',
                            cursor: 'pointer', textAlign: 'center', fontWeight: 700, transition: 'all 0.15s',
                            '&:hover': { transform: 'translate(-1px,-1px)' }
                          }}
                        >
                          {p.word}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>→</Box>

                {/* Definitions column */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ ...cardSx('teal'), mb: 2 }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}>Definitions</Typography>
                    <Stack spacing={1.5}>
                      {shuffledDefs.map((item, dIdx) => (
                        <Box
                          key={dIdx}
                          component="button"
                          onClick={() => handleDefClick(dIdx)}
                          sx={{
                            p: 1.5, borderRadius: '12px', border: '2px solid',
                            borderColor: matchedDefs.has(dIdx) ? P.green.border : selectedWord !== null ? P.purple.border : P.teal.border,
                            bgcolor: matchedDefs.has(dIdx) ? P.green.bg : 'transparent',
                            cursor: selectedWord !== null ? 'pointer' : 'default',
                            transition: 'all 0.15s',
                            '&:hover': selectedWord !== null ? { transform: 'translate(-1px,-1px)' } : {}
                          }}
                        >
                          <Typography variant="body2">{item.definition}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Box
                component="button"
                onClick={handleSubmit}
                disabled={matchedWords.size < PAIRS.length}
                sx={{
                  ...cardSx('orange'),
                  width: '100%', cursor: matchedWords.size < PAIRS.length ? 'not-allowed' : 'pointer',
                  opacity: matchedWords.size < PAIRS.length ? 0.6 : 1,
                  textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                  '&:hover': matchedWords.size >= PAIRS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
                }}
              >
                Submit
              </Box>
            </>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 2 }}>Task A Complete! Score: {score}/{PAIRS.length}</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/a2/task/b')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task B
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
