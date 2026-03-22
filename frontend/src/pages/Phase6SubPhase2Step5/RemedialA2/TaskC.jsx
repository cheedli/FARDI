import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const SENTENCES = [
  { faulty: 'Report bad.', model: 'Your report is good.', keyWord: 'good' },
  { faulty: 'Add more.', model: 'Please add more.', keyWord: 'please' },
  { faulty: 'Thank.', model: 'Thank you.', keyWord: 'thank' },
  { faulty: 'No good.', model: 'It is nice.', keyWord: 'nice' },
  { faulty: 'Improv.', model: 'You can improve.', keyWord: 'improve' },
  { faulty: 'Sugestion.', model: 'Suggestion: add...', keyWord: 'suggestion' }
]

export default function Phase6SP2Step5RemA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_a2' })
  const [inputs, setInputs] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState({})

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleChange = (idx, value) => {
    if (submitted) return
    setInputs(prev => ({ ...prev, [idx]: value }))
  }

  const handleSubmit = async () => {
    let correct = 0
    const newResults = {}
    SENTENCES.forEach((s, i) => {
      const userAnswer = (inputs[i] || '').trim().toLowerCase()
      const passes = userAnswer.includes(s.keyWord.toLowerCase())
      newResults[i] = passes
      if (passes) correct++
    })
    setScore(correct)
    setResults(newResults)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'C', correct, SENTENCES.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = SENTENCES.every((_, i) => (inputs[i] || '').trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial A2 — Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Sentence Builder: Correct the Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Each sentence below uses poor or faulty feedback language. Rewrite it as polite, correct feedback.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {SENTENCES.map((s, idx) => {
              const isCorrect = submitted && results[idx] === true
              const isWrong = submitted && results[idx] === false
              return (
                <Box key={idx} sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue) }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Faulty sentence:</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: P.red.border, mb: 2 }}>"{s.faulty}"</Typography>
                  <TextField fullWidth label={`${idx + 1}. Your correction`} value={inputs[idx] || ''} onChange={(e) => handleChange(idx, e.target.value)} disabled={submitted} placeholder="Type the corrected sentence..." variant="outlined" size="small" />
                  {submitted && (
                    <Box sx={{ mt: 1.5 }}>
                      {isCorrect ? (
                        <Typography variant="body2" sx={{ color: P.green.shadow }} fontWeight="medium">Correct! Your answer contains the key improvement word.</Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: P.red.border }}>Model answer: <strong>"{s.model}"</strong> (key word: <em>{s.keyWord}</em>)</Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Corrections
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Sentence Builder Complete! Score: {score}/{SENTENCES.length}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b1/task/a')} sx={{ mt: 2, bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Remedial B1
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
