import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LinkIcon from '@mui/icons-material/Link'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const PAIRS = [
  { id: 1, term: 'positive', definition: 'Praise good parts' },
  { id: 2, term: 'strength', definition: 'What is good' },
  { id: 3, term: 'weakness', definition: 'What needs work' },
  { id: 4, term: 'suggestion', definition: 'Idea to improve' },
  { id: 5, term: 'improve', definition: 'Make better' },
  { id: 6, term: 'feedback', definition: 'Comments' },
  { id: 7, term: 'polite', definition: 'Be nice' },
  { id: 8, term: 'specific', definition: 'Give clear examples' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP2Step4RemB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_b2' })
  const [shuffledDefs] = useState(() => shuffle(PAIRS))
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDef, setSelectedDef] = useState(null)
  const [matched, setMatched] = useState({})
  const [wrongPair, setWrongPair] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const matchedTermIds = new Set(Object.keys(matched).map(Number))
  const matchedDefIds = new Set(Object.values(matched).map(Number))

  const handleTermClick = (pair) => {
    if (submitted || matchedTermIds.has(pair.id)) return
    setSelectedTerm(pair)
    setWrongPair(null)
    if (selectedDef) attemptMatch(pair, selectedDef)
  }

  const handleDefClick = (pair) => {
    if (submitted || matchedDefIds.has(pair.id)) return
    setSelectedDef(pair)
    setWrongPair(null)
    if (selectedTerm) attemptMatch(selectedTerm, pair)
  }

  const attemptMatch = (term, def) => {
    if (term.id === def.id) {
      setMatched(prev => ({ ...prev, [term.id]: def.id }))
      setSelectedTerm(null)
      setSelectedDef(null)
    } else {
      setWrongPair({ termId: term.id, defId: def.id })
      setTimeout(() => { setSelectedTerm(null); setSelectedDef(null); setWrongPair(null) }, 800)
    }
  }

  const allMatched = matchedTermIds.size === PAIRS.length

  const handleSubmit = async () => {
    const correct = matchedTermIds.size
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'C', correct, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const getTermSx = (pair) => {
    const isMatched = matchedTermIds.has(pair.id)
    const isSelected = selectedTerm?.id === pair.id
    const isWrong = wrongPair?.termId === pair.id
    if (isMatched) return { bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}` }
    if (isSelected) return { bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}` }
    if (isWrong) return { bgcolor: P.red.border, color: 'white', border: `2px solid ${P.red.shadow}` }
    return { bgcolor: P.blue.bg, color: 'text.primary', border: `2px solid ${P.blue.border}` }
  }

  const getDefSx = (pair) => {
    const isMatched = matchedDefIds.has(pair.id)
    const isSelected = selectedDef?.id === pair.id
    const isWrong = wrongPair?.defId === pair.id
    if (isMatched) return { bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}` }
    if (isSelected) return { bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}` }
    if (isWrong) return { bgcolor: P.red.border, color: 'white', border: `2px solid ${P.red.shadow}` }
    return { bgcolor: P.blue.bg, color: 'text.primary', border: `2px solid ${P.blue.border}` }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial B2 — Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Matching Game: Feedback Terms to Functions</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Click a term on the left, then click its matching function on the right to create a pair.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.orange.border, textAlign: 'center' }}>Terms</Typography>
              {PAIRS.map((pair) => {
                const isMatched = matchedTermIds.has(pair.id)
                return (
                  <Box key={pair.id} onClick={() => handleTermClick(pair)} sx={{ ...getTermSx(pair), borderRadius: '12px', boxShadow: isMatched ? 'none' : `3px 3px 0 ${P.blue.shadow}`, p: 1.5, textAlign: 'center', cursor: isMatched || submitted ? 'default' : 'pointer', transition: 'all 0.2s', userSelect: 'none', opacity: isMatched ? 0.85 : 1 }}>
                    <Typography variant="body1" fontWeight="bold">{pair.term}</Typography>
                  </Box>
                )
              })}
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
              {PAIRS.map((pair) => (
                <Box key={pair.id} sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
                  {matchedTermIds.has(pair.id) && <LinkIcon sx={{ color: P.green.border, fontSize: 20 }} />}
                </Box>
              ))}
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.orange.border, textAlign: 'center' }}>Functions</Typography>
              {shuffledDefs.map((pair) => {
                const isMatched = matchedDefIds.has(pair.id)
                return (
                  <Box key={pair.id} onClick={() => handleDefClick(pair)} sx={{ ...getDefSx(pair), borderRadius: '12px', boxShadow: isMatched ? 'none' : `3px 3px 0 ${P.blue.shadow}`, p: 1.5, textAlign: 'center', cursor: isMatched || submitted ? 'default' : 'pointer', transition: 'all 0.2s', userSelect: 'none', opacity: isMatched ? 0.85 : 1 }}>
                    <Typography variant="body1">{pair.definition}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: P.orange.border, color: 'white', fontWeight: 'bold', px: 3, py: 1, borderRadius: '12px', fontSize: '0.95rem' }}>{matchedTermIds.size} / 8 matched</Box>
          </Box>
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allMatched} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allMatched ? 'not-allowed' : 'pointer', opacity: !allMatched ? 0.6 : 1, '&:hover': allMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            {allMatched ? 'Submit Matches' : `Match all 8 pairs to continue`}
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Score: {score}/8</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 8 ? 'Perfect! All 8 terms matched correctly.' : `You matched ${score} out of 8 terms correctly.`}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/d')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task D
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
