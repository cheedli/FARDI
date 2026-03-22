import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B2 - Task C
 * Matching Game: "Kahoot Match"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const MATCHING_PAIRS = [
  { term: 'success', definition: 'Positive result / achievement' },
  { term: 'challenge', definition: 'Difficult part / obstacle' },
  { term: 'feedback', definition: 'Opinions from participants' },
  { term: 'improve', definition: 'Make something better next time' },
  { term: 'strength', definition: 'What we did well' },
  { term: 'weakness', definition: 'Area that needs work' },
  { term: 'recommend', definition: 'Suggest future action' },
  { term: 'summary', definition: 'Short overview of the event' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP1Step1RemB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_b2' })
  const shuffledDefs = useMemo(() => shuffle(MATCHING_PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [correctSet, setCorrectSet] = useState(new Set())

  const matchedTermIndices = new Set(Object.keys(matches).map(Number))
  const matchedDefIndices = new Set(Object.values(matches).map(Number))

  const handleTermClick = (idx) => {
    if (submitted) return
    if (matchedTermIndices.has(idx)) {
      const newMatches = { ...matches }
      delete newMatches[idx]
      setMatches(newMatches)
      return
    }
    setSelectedTerm(idx)
  }

  const handleDefClick = (defIdx) => {
    if (submitted || selectedTerm === null) return
    const newMatches = { ...matches }
    const existing = Object.keys(newMatches).find(k => newMatches[k] === defIdx)
    if (existing !== undefined) delete newMatches[existing]
    newMatches[selectedTerm] = defIdx
    setMatches(newMatches)
    setSelectedTerm(null)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const correct = new Set()
    Object.entries(matches).forEach(([termIdx, defIdx]) => {
      const termItem = MATCHING_PAIRS[parseInt(termIdx)]
      const defItem = shuffledDefs[parseInt(defIdx)]
      if (termItem.term === defItem.term) {
        correctCount++
        correct.add(parseInt(termIdx))
      }
    })
    setScore(correctCount)
    setCorrectSet(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b2_taskc_score', correctCount.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'C', correctCount, MATCHING_PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allMatched = matchedTermIndices.size === MATCHING_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task C: Kahoot Match</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Match 8 report/reflection terms to their correct function</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Kahoot Match! Match 8 report/reflection terms to their correct function or definition. Click a term on the left, then click its matching definition on the right. Match all 8 to win!"
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: P.blue.shadow }}>
            <strong>How to play:</strong> Click a term on the left to select it, then click the matching definition on the right.
            Match all 8 pairs before submitting.
          </Typography>
        </Box>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Box sx={{
                  bgcolor: P.purple.bg,
                  border: `2px solid ${P.purple.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                  p: 2
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center" sx={{ color: P.purple.shadow }}>Terms</Typography>
                  <Stack spacing={1.5}>
                    {MATCHING_PAIRS.map((pair, idx) => {
                      const isMatched = matchedTermIndices.has(idx)
                      const isSelected = selectedTerm === idx
                      return (
                        <Box key={idx} onClick={() => handleTermClick(idx)} sx={{
                          p: 1.5, borderRadius: '12px', border: '2px solid',
                          borderColor: isSelected ? P.purple.border : isMatched ? P.green.border : P.yellow.border,
                          bgcolor: isSelected ? P.purple.bg : isMatched ? P.green.bg : P.yellow.bg,
                          boxShadow: `2px 2px 0 ${isSelected ? P.purple.shadow : isMatched ? P.green.shadow : P.yellow.shadow}`,
                          cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                          '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.purple.shadow}` }
                        }}>
                          <Typography variant="body1" fontWeight="bold" sx={{ color: isMatched ? P.green.shadow : P.purple.shadow }}>{pair.term}</Typography>
                          {isMatched && <Typography variant="caption" sx={{ color: P.green.shadow }}>(matched)</Typography>}
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" color="text.secondary">→</Typography>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{
                  bgcolor: P.teal.bg,
                  border: `2px solid ${P.teal.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${P.teal.shadow}`,
                  p: 2
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center" sx={{ color: P.teal.shadow }}>Definitions</Typography>
                  <Stack spacing={1.5}>
                    {shuffledDefs.map((item, defIdx) => {
                      const isMatched = matchedDefIndices.has(defIdx)
                      const matchedTermIdx = Object.keys(matches).find(k => matches[k] === defIdx)
                      const matchedTerm = matchedTermIdx !== undefined ? MATCHING_PAIRS[parseInt(matchedTermIdx)].term : null
                      return (
                        <Box key={defIdx} onClick={() => handleDefClick(defIdx)} sx={{
                          p: 1.5, borderRadius: '12px', border: '2px solid',
                          borderColor: isMatched ? P.green.border : selectedTerm !== null ? P.purple.border : P.teal.border,
                          bgcolor: isMatched ? P.green.bg : selectedTerm !== null ? P.purple.bg : P.teal.bg,
                          boxShadow: `2px 2px 0 ${isMatched ? P.green.shadow : P.teal.shadow}`,
                          cursor: selectedTerm !== null ? 'pointer' : 'default', transition: 'all 0.15s',
                          '&:hover': selectedTerm !== null ? { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.purple.shadow}` } : {}
                        }}>
                          <Typography variant="body2" sx={{ color: isMatched ? P.green.shadow : P.teal.shadow }}>{item.definition}</Typography>
                          {matchedTerm && <Box sx={{ display: 'inline-block', mt: 0.5, px: 1, py: 0.25, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: P.green.shadow }}>{matchedTerm}</Box>}
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {!submitted && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allMatched}
              sx={{
                cursor: allMatched ? 'pointer' : 'not-allowed',
                opacity: allMatched ? 1 : 0.6,
                px: 6, py: 1.5,
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                fontSize: '1rem', fontWeight: 'bold', color: P.orange.shadow,
                '&:hover': { transform: allMatched ? 'translate(-2px,-2px)' : 'none', boxShadow: allMatched ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s'
              }}
            >
              Submit Answers
            </Box>
            {!allMatched && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Match all {MATCHING_PAIRS.length} pairs before submitting ({matchedTermIndices.size}/{MATCHING_PAIRS.length} matched)
              </Typography>
            )}
          </Box>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>Score: {score}/{MATCHING_PAIRS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score === MATCHING_PAIRS.length ? 'Perfect! All 8 terms matched correctly!' : score >= 6 ? 'Well done! Great understanding of report vocabulary.' : 'Good effort! Review the correct matches below.'}
              </Typography>
            </Box>

            <Box sx={{
              bgcolor: P.blue.bg,
              border: `2px solid ${P.blue.border}`,
              borderRadius: '16px',
              boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Correct Matches</Typography>
              <Grid container spacing={2}>
                {MATCHING_PAIRS.map((pair, idx) => {
                  const isCorrect = correctSet.has(idx)
                  return (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{
                        p: 1.5, borderRadius: '12px',
                        border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        boxShadow: `2px 2px 0 ${isCorrect ? P.green.shadow : P.red.shadow}`,
                        display: 'flex', alignItems: 'center', gap: 1
                      }}>
                        {isCorrect ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} /> : <CancelIcon sx={{ color: P.red.border, fontSize: 20 }} />}
                        <Box>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>{pair.term}</Typography>
                          <Typography variant="caption" color="text.secondary">{pair.definition}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            <Stack direction="row" justifyContent="flex-end">
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/1/remedial/b2/task/d')}
                sx={{
                  cursor: 'pointer', px: 4, py: 1.5,
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Next: Task D →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
