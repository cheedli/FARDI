import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const PAIRS = [
  { mistake: 'report bad', correction: 'report could be better' },
  { mistake: 'feedbak', correction: 'feedback' },
  { mistake: 'no good', correction: 'not strong' },
  { mistake: 'add more', correction: 'suggestion: add more' },
  { mistake: 'thank', correction: 'thank you' },
  { mistake: 'weak', correction: 'area to improve' },
  { mistake: 'sugestion', correction: 'suggestion' },
  { mistake: 'improv', correction: 'improve' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP2Step5RemA2TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/5/remedial/a2/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_a2' })
  const shuffledCorrections = useMemo(() => shuffle(PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedMistake, setSelectedMistake] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const matchedMistakes = new Set(Object.keys(matches).map(Number))
  const matchedCorrections = new Set(Object.values(matches).map(Number))

  const handleMistakeClick = (idx) => {
    if (submitted) return
    if (matchedMistakes.has(idx)) {
      const m = { ...matches }
      delete m[idx]
      setMatches(m)
      return
    }
    setSelectedMistake(idx)
  }

  const handleCorrectionClick = (corrIdx) => {
    if (submitted || selectedMistake === null) return
    const m = { ...matches }
    Object.keys(m).forEach(k => { if (m[k] === corrIdx) delete m[k] })
    m[selectedMistake] = corrIdx
    setMatches(m)
    setSelectedMistake(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(matches).forEach(([mIdx, cIdx]) => {
      if (PAIRS[parseInt(mIdx)].correction === shuffledCorrections[parseInt(cIdx)].correction) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_a2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'A', correct, PAIRS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial A2 — Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Feedback Rescue: Match Mistakes to Corrections</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Click a feedback mistake on the left, then click its correct version on the right to match them. Click a matched mistake to unselect it.</Typography>
          </Box>
        </motion.div>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.red.border, textAlign: 'center', mb: 1 }}>Mistakes</Typography>
                <Stack spacing={1.5}>
                  {PAIRS.map((p, idx) => (
                    <Box key={idx} onClick={() => handleMistakeClick(idx)} sx={{ p: 1.5, borderRadius: '12px', border: `2px solid`, borderColor: selectedMistake === idx ? P.orange.border : matchedMistakes.has(idx) ? P.green.border : P.blue.border, bgcolor: selectedMistake === idx ? P.orange.bg : matchedMistakes.has(idx) ? P.green.bg : P.blue.bg, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: P.red.border }}>"{p.mistake}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', pt: 4 }}>
                <Typography variant="h4" color="text.secondary">→</Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.green.border, textAlign: 'center', mb: 1 }}>Corrections</Typography>
                <Stack spacing={1.5}>
                  {shuffledCorrections.map((item, cIdx) => (
                    <Box key={cIdx} onClick={() => handleCorrectionClick(cIdx)} sx={{ p: 1.5, borderRadius: '12px', border: `2px solid`, borderColor: matchedCorrections.has(cIdx) ? P.green.border : selectedMistake !== null ? P.orange.border : P.blue.border, bgcolor: matchedCorrections.has(cIdx) ? P.green.bg : P.blue.bg, cursor: selectedMistake !== null ? 'pointer' : 'default', textAlign: 'center', transition: 'all 0.15s' }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: P.green.shadow }}>"{item.correction}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            <Box component="button" onClick={handleSubmit} disabled={matchedMistakes.size < PAIRS.length} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: matchedMistakes.size < PAIRS.length ? 'not-allowed' : 'pointer', opacity: matchedMistakes.size < PAIRS.length ? 0.6 : 1, '&:hover': matchedMistakes.size >= PAIRS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
              Submit ({matchedMistakes.size}/{PAIRS.length} matched)
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Feedback Rescue Complete! Score: {score}/{PAIRS.length}</Typography>
              <Box sx={{ mt: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {PAIRS.map((p, idx) => {
                  const cIdx = matches[idx]
                  const isCorrect = cIdx !== undefined && shuffledCorrections[cIdx]?.correction === p.correction
                  return (
                    <Box key={idx} sx={{ bgcolor: isCorrect ? P.green.border : P.red.border, color: 'white', px: 1.5, py: 0.4, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      "{p.mistake}" → "{p.correction}"
                    </Box>
                  )
                })}
              </Box>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/a2/task/b')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
