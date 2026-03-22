import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

const PAIRS = [
  { term: 'success', definition: 'Positive outcome' },
  { term: 'challenge', definition: 'Difficulty faced' },
  { term: 'feedback', definition: 'Participant opinions' },
  { term: 'improve', definition: 'Enhance future' },
  { term: 'recommend', definition: 'Suggest action' },
  { term: 'evidence', definition: 'Numbers & quotes' },
  { term: 'summary', definition: 'Short overview' },
  { term: 'balance', definition: 'Show good & bad' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP1Step2RemedialB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'remedial_b2' })
  const shuffledDefs = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, origIdx: i }))), [])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const matchedTerms = new Set(Object.keys(matches).map(Number))
  const matchedDefIndices = new Set(Object.values(matches).map(Number))

  const handleTermClick = (idx) => {
    if (submitted) return
    if (matchedTerms.has(idx)) { const m = { ...matches }; delete m[idx]; setMatches(m); return }
    setSelectedTerm(idx)
  }
  const handleDefClick = (defIdx) => {
    if (submitted || selectedTerm === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === defIdx) delete m[k] })
    m[selectedTerm] = defIdx
    setMatches(m)
    setSelectedTerm(null)
  }
  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([termIdx, defIdx]) => {
      if (PAIRS[parseInt(termIdx)].term === shuffledDefs[parseInt(defIdx)].term) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'B2', 'C', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Matching Game</Typography>
            <Typography variant="body1" color="text.secondary">Match 8 report terms to their functions</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Match each report term on the left to its correct definition on the right. Click a term, then click its matching definition." />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3, p: 2 }}>
                <Typography variant="body2">Click a term (left) to select it, then click its matching definition (right). Click a matched term to unselect it.</Typography>
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.blue.border }}>Terms</Typography>
                    <Stack spacing={1.5}>
                      {PAIRS.map((p, idx) => (
                        <Box key={idx} onClick={() => handleTermClick(idx)} sx={{ ...cardSx(selectedTerm === idx ? P.green : matchedTerms.has(idx) ? P.teal : P.blue), p: 1.5, cursor: 'pointer', textAlign: 'center', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s ease' }}>
                          <Typography variant="body1" fontWeight="bold">{p.term}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" color="text.secondary">→</Typography>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: P.blue.border }}>Definitions</Typography>
                    <Stack spacing={1.5}>
                      {shuffledDefs.map((item, dIdx) => (
                        <Box key={dIdx} onClick={() => handleDefClick(dIdx)} sx={{ ...cardSx(matchedDefIndices.has(dIdx) ? P.teal : P.yellow), p: 1.5, cursor: selectedTerm !== null ? 'pointer' : 'default', '&:hover': selectedTerm !== null ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.yellow.shadow}` } : {}, transition: 'all 0.15s ease' }}>
                          <Typography variant="body2">{item.definition}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
                <Box component="button" onClick={handleSubmit} disabled={matchedTerms.size < PAIRS.length} sx={{ width: '100%', mt: 3, ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                  Check My Answers
                </Box>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: P.green.border }}>Task C Complete!</Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Score: {score}/{PAIRS.length}</Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Correct Answers:</Typography>
              <Stack spacing={1}>
                {PAIRS.map((p, idx) => {
                  const defIdx = matches[idx]
                  const isCorrect = defIdx !== undefined && shuffledDefs[defIdx]?.term === p.term
                  return (
                    <Box key={idx} sx={{ p: 1, borderRadius: '12px', bgcolor: isCorrect ? P.green.bg : '#FEF2F2', border: `1px solid ${isCorrect ? P.green.border : '#EF4444'}` }}>
                      <Typography variant="body2">{isCorrect ? '✓' : '✗'} <strong>{p.term}</strong> → {p.definition}</Typography>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
            <Stack direction="row" justifyContent="flex-end">
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b2/task/d')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Next: Task D →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
