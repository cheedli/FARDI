import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const PAIRS = [
  { id: 'success', word: 'success', definition: 'Good result' },
  { id: 'challenge', word: 'challenge', definition: 'Difficult thing' },
  { id: 'feedback', word: 'feedback', definition: 'What people say' },
  { id: 'improve', word: 'improve', definition: 'Make better' },
  { id: 'strength', word: 'strength', definition: 'Good point' },
  { id: 'weakness', word: 'weakness', definition: 'Bad point' },
  { id: 'recommend', word: 'recommend', definition: 'Suggest better' },
  { id: 'summary', word: 'summary', definition: 'Short overview' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function Phase6SP1Step3RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 1, context: 'remedial_a2' })
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledDefs] = useState(() => shuffle(PAIRS.map(p => ({ id: p.id, definition: p.definition }))))

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleWordClick = (wordId) => { if (submitted) return; setSelectedWord(wordId) }
  const handleDefClick = (defId) => { if (submitted || !selectedWord) return; setMatches(prev => ({ ...prev, [selectedWord]: defId })); setSelectedWord(null) }

  const handleSubmit = async () => {
    let correct = 0
    PAIRS.forEach(p => { if (matches[p.id] === p.id) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'A2', 'A', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allMatched = PAIRS.every(p => matches[p.id])
  const matchedDefs = new Set(Object.values(matches))

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Term Treasure Hunt</Typography>
            <Typography variant="body1" color="text.secondary">Match 8 report terms to their simple definitions</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Term Treasure Hunt! Click a word on the left to select it, then click the matching definition on the right. Match all 8 pairs!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3, p: 2 }}>
            <Typography variant="body2">Click a word (left) then click its matching definition (right). Match all 8 pairs to submit.</Typography>
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Words</Typography>
                  <Stack spacing={1}>
                    {PAIRS.map(p => (
                      <Box key={p.id} onClick={() => handleWordClick(p.id)} sx={{ ...cardSx(selectedWord === p.id ? P.green : matches[p.id] ? P.teal : P.blue), p: 1.5, cursor: 'pointer', '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s ease' }}>
                        <Typography variant="body1" fontWeight="bold">{p.word}</Typography>
                        {matches[p.id] && <Typography variant="caption" sx={{ color: P.teal.border, display: 'block', mt: 0.5 }}>{shuffledDefs.find(d => d.id === matches[p.id])?.definition}</Typography>}
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Definitions</Typography>
                  <Stack spacing={1}>
                    {shuffledDefs.map(d => {
                      const alreadyMatched = matchedDefs.has(d.id)
                      return (
                        <Box key={d.id} onClick={() => !alreadyMatched && handleDefClick(d.id)} sx={{ ...cardSx(alreadyMatched ? P.teal : P.yellow), p: 1.5, cursor: alreadyMatched ? 'default' : 'pointer', opacity: alreadyMatched ? 0.6 : 1, '&:hover': !alreadyMatched ? { transform: 'translate(-1px,-1px)', boxShadow: `6px 6px 0 ${P.yellow.shadow}` } : {}, transition: 'all 0.15s ease' }}>
                          <Typography variant="body1">{d.definition}</Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              </Box>
              <Box component="button" onClick={handleSubmit} disabled={!allMatched} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, mt: 3, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Check My Answers
              </Box>
            </Box>
          </motion.div>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: P.green.border }}>Task A Complete!</Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Score: {score}/{PAIRS.length}</Typography>
                </Box>
              </Box>
              <Stack spacing={1} sx={{ mb: 3 }}>
                {PAIRS.map(p => {
                  const isCorrect = matches[p.id] === p.id
                  return (
                    <Box key={p.id} sx={{ ...cardSx(isCorrect ? P.green : P.red), p: 1.5 }}>
                      <Typography variant="body2">{isCorrect ? '✓' : '✗'} <strong>{p.word}</strong> → {p.definition}</Typography>
                    </Box>
                  )
                })}
              </Stack>
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/a2/task/b')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Next: Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
