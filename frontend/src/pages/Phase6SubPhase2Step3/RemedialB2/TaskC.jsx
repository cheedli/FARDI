import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LinkIcon from '@mui/icons-material/Link'
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
  { id: 1, term: 'constructive', definition: 'Helpful criticism' },
  { id: 2, term: 'specific', definition: 'Clear and exact' },
  { id: 3, term: 'balanced', definition: 'Positive and negative' },
  { id: 4, term: 'suggestion', definition: 'Idea to improve' },
  { id: 5, term: 'improve', definition: 'Make better' },
  { id: 6, term: 'polite', definition: 'Be kind' },
  { id: 7, term: 'empathy', definition: 'Understand feelings' },
  { id: 8, term: 'actionable', definition: 'Can be done' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function Phase6SP2Step3RemB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/3/remedial/b2/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 3, context: 'remedial_b2' })
  const [shuffledDefs] = useState(() => shuffle(PAIRS))
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDef, setSelectedDef] = useState(null)
  const [matched, setMatched] = useState({})
  const [wrongPair, setWrongPair] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

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
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'C', correct, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const getTermColor = (pair) => {
    if (matchedTermIds.has(pair.id)) return P.green
    if (selectedTerm?.id === pair.id) return P.purple
    if (wrongPair?.termId === pair.id) return P.red
    return P.teal
  }

  const getDefColor = (pair) => {
    if (matchedDefIds.has(pair.id)) return P.green
    if (selectedDef?.id === pair.id) return P.purple
    if (wrongPair?.defId === pair.id) return P.red
    return P.teal
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial B2 - Task C</Typography>
            <Typography>Matching Game: Feedback Terms to Definitions</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Click a term on the left, then click its matching definition on the right to create a pair.</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* Terms column */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.purple.border, mb: 0.5, textAlign: 'center' }}>Terms</Typography>
              {PAIRS.map((pair) => {
                const col = getTermColor(pair)
                const isMatched = matchedTermIds.has(pair.id)
                return (
                  <Box
                    key={pair.id}
                    component="button"
                    onClick={() => handleTermClick(pair)}
                    sx={{
                      p: 1.5, borderRadius: '12px', cursor: isMatched || submitted ? 'default' : 'pointer',
                      bgcolor: col.bg, border: `2px solid ${col.border}`,
                      boxShadow: isMatched ? 'none' : `2px 2px 0 ${col.shadow}`,
                      textAlign: 'center', fontWeight: 700, transition: 'all 0.2s', userSelect: 'none',
                      opacity: isMatched ? 0.85 : 1,
                      '&:hover': isMatched || submitted ? {} : { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${col.shadow}` },
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{pair.term}</Typography>
                  </Box>
                )
              })}
            </Box>

            {/* Center connector */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
              {PAIRS.map((pair) => (
                <Box key={pair.id} sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
                  {matchedTermIds.has(pair.id) && <LinkIcon sx={{ color: P.green.border, fontSize: 20 }} />}
                </Box>
              ))}
            </Box>

            {/* Definitions column */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.purple.border, mb: 0.5, textAlign: 'center' }}>Definitions</Typography>
              {shuffledDefs.map((pair) => {
                const col = getDefColor(pair)
                const isMatched = matchedDefIds.has(pair.id)
                return (
                  <Box
                    key={pair.id}
                    component="button"
                    onClick={() => handleDefClick(pair)}
                    sx={{
                      p: 1.5, borderRadius: '12px', cursor: isMatched || submitted ? 'default' : 'pointer',
                      bgcolor: col.bg, border: `2px solid ${col.border}`,
                      boxShadow: isMatched ? 'none' : `2px 2px 0 ${col.shadow}`,
                      textAlign: 'center', transition: 'all 0.2s', userSelect: 'none',
                      opacity: isMatched ? 0.85 : 1,
                      '&:hover': isMatched || submitted ? {} : { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${col.shadow}` },
                    }}
                  >
                    <Typography variant="body1">{pair.definition}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '12px', fontWeight: 700 }}>
              {matchedTermIds.size} / 8 matched
            </Box>
          </Box>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allMatched}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: allMatched ? 'pointer' : 'not-allowed', opacity: allMatched ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': allMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              {allMatched ? 'Submit Matches' : `Match all 8 pairs to continue`}
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700 }}>Score: {score}/8</Typography>
              <Typography sx={{ mt: 1, mb: 2 }}>
                {score === 8 ? 'Perfect! All 8 terms matched correctly.' : `You matched ${score} out of 8 terms correctly.`}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b2/task/d')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task D
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
