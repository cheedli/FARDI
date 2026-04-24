import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const WORD_BANK = ['good', 'please', 'suggestion', 'thank you', 'nice', 'improve', 'positive', 'helpful']
const GAPS = [
  { sentence: 'Your work is ___', answer: 'good' },
  { sentence: '___ add more.', answer: 'please' },
  { sentence: 'My ___ is...', answer: 'suggestion' },
  { sentence: '___!', answer: 'thank you' },
  { sentence: 'It is ___.', answer: 'nice' },
  { sentence: 'You can ___.', answer: 'improve' },
  { sentence: '___ feedback.', answer: 'positive' },
  { sentence: 'Very ___.', answer: 'helpful' }
]

export default function Phase6SP2Step5RemA2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/5/remedial/a2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const usedWords = new Set(Object.values(answers))

  const handleWordClick = (word) => {
    if (submitted) return
    const firstEmpty = GAPS.findIndex((_, i) => !answers[i])
    if (firstEmpty === -1) return
    if (usedWords.has(word)) return
    setAnswers(prev => ({ ...prev, [firstEmpty]: word }))
  }

  const handleRemoveAnswer = (gapIdx) => {
    if (submitted) return
    setAnswers(prev => {
      const next = { ...prev }
      delete next[gapIdx]
      return next
    })
  }

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach((g, i) => { if (answers[i] === g.answer) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = Object.keys(answers).length === GAPS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial A2 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Fill Quest: Complete the Polite Phrases</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Click a word from the word bank to place it in the next empty gap. Click a filled gap to remove its answer.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Word Bank</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {WORD_BANK.map((word) => (
                <Box key={word} onClick={() => handleWordClick(word)} sx={{ bgcolor: usedWords.has(word) || submitted ? 'transparent' : P.purple.border, color: usedWords.has(word) || submitted ? 'text.secondary' : 'white', border: `2px solid ${usedWords.has(word) ? P.purple.bg : P.purple.border}`, fontWeight: 'bold', px: 2, py: 0.5, borderRadius: '10px', fontSize: '0.875rem', cursor: submitted || usedWords.has(word) ? 'default' : 'pointer', opacity: usedWords.has(word) ? 0.5 : 1, transition: 'all 0.15s' }}>
                  {word}
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {GAPS.map((g, idx) => {
              const filled = answers[idx]
              const isCorrect = submitted && filled === g.answer
              const isWrong = submitted && filled !== g.answer
              const display = g.sentence.replace('___', filled ? `[${filled}]` : '[___]')
              return (
                <Box key={idx} sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : filled ? P.orange : P.blue), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 2 }}>
                  <Typography variant="body1" fontWeight="medium">{idx + 1}. {display}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {filled && !submitted && (
                      <Box onClick={() => handleRemoveAnswer(idx)} sx={{ bgcolor: P.red.border, color: 'white', px: 1.5, py: 0.3, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                        Remove "{filled}"
                      </Box>
                    )}
                    {isWrong && <Typography variant="body2" sx={{ color: P.red.border }}>Correct: <strong>{g.answer}</strong></Typography>}
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit ({Object.keys(answers).length}/{GAPS.length} filled)
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Fill Quest Complete! Score: {score}/{GAPS.length}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/a2/task/c')} sx={{ mt: 2, bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task C
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
