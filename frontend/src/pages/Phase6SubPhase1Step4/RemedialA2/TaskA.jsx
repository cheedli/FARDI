import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const PAIRS = [
  { word: 'success', definition: 'when something goes well' },
  { word: 'challenge', definition: 'something difficult to deal with' },
  { word: 'achievement', definition: 'something you accomplished' },
  { word: 'strength', definition: 'something you are good at' },
  { word: 'weakness', definition: 'something you need to improve' },
  { word: 'feedback', definition: 'comments or opinions about work' }
]

function shuffle(arr) { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]] } return a }

export default function Phase6SP1Step4RemA2TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/4/remedial/a2/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'remedial_a2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p,i) => ({...p, idx: i}))), [])
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedWords = new Set(Object.keys(matches).map(Number))
  const matchedDefs = new Set(Object.values(matches).map(Number))

  const handleWordClick = (idx) => { if (submitted) return; if (matchedWords.has(idx)) { const m = {...matches}; delete m[idx]; setMatches(m); return }; setSelectedWord(idx) }
  const handleDefClick = (defIdx) => {
    if (submitted || selectedWord === null) return
    const m = {...matches}
    Object.keys(m).forEach(k => { if (m[k] === defIdx) delete m[k] })
    m[selectedWord] = defIdx
    setMatches(m)
    setSelectedWord(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([wIdx, dIdx]) => { if (PAIRS[parseInt(wIdx)].word === shuffledDefs[parseInt(dIdx)].word) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'A2', 'A', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Step 4: Remedial A2 - Task A
            </Typography>
            <Typography variant="body1" color="text.secondary">Match to Report Sections</Typography>
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
                <Typography variant="body2">Click a word, then click its matching definition.</Typography>
              </Box>
            </motion.div>

            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Box sx={{ ...cardSx(P.purple) }}>
                  <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.purple.border }}>Words</Typography>
                  <Stack spacing={1.5}>
                    {PAIRS.map((p, idx) => (
                      <Box key={idx} onClick={() => handleWordClick(idx)} sx={{
                        p: 1.5, borderRadius: '12px',
                        border: `2px solid`,
                        borderColor: selectedWord === idx ? P.purple.border : matchedWords.has(idx) ? P.green.border : 'rgba(0,0,0,0.15)',
                        bgcolor: selectedWord === idx ? P.purple.bg : matchedWords.has(idx) ? P.green.bg : P.pageBg,
                        cursor: 'pointer', textAlign: 'center', fontWeight: 'bold',
                        boxShadow: selectedWord === idx ? `2px 2px 0 ${P.purple.shadow}` : 'none',
                        transition: 'all 0.15s ease',
                      }}>
                        <Typography variant="body1" fontWeight="bold">{p.word}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" color="text.secondary">→</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ ...cardSx(P.green) }}>
                  <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.green.border }}>Definitions</Typography>
                  <Stack spacing={1.5}>
                    {shuffledDefs.map((item, dIdx) => (
                      <Box key={dIdx} onClick={() => handleDefClick(dIdx)} sx={{
                        p: 1.5, borderRadius: '12px',
                        border: `2px solid`,
                        borderColor: matchedDefs.has(dIdx) ? P.green.border : selectedWord !== null ? P.purple.border : 'rgba(0,0,0,0.15)',
                        bgcolor: matchedDefs.has(dIdx) ? P.green.bg : P.pageBg,
                        cursor: selectedWord !== null ? 'pointer' : 'default',
                        transition: 'all 0.15s ease',
                      }}>
                        <Typography variant="body2">{item.definition}</Typography>
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
                  px: 6, py: 1.5,
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  cursor: matchedWords.size < PAIRS.length ? 'not-allowed' : 'pointer',
                  opacity: matchedWords.size < PAIRS.length ? 0.5 : 1,
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.orange.border,
                  '&:hover': matchedWords.size >= PAIRS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
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
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task A Complete! Score: {score}/{PAIRS.length}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/a2/task/b')}
                sx={{
                  px: 6, py: 1.5, mt: 2,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
