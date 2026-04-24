import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const BLANKS = [
  { id: 'BLANK1', options: ['nice', 'bad', 'wrong'], correct: 'nice' },
  { id: 'BLANK2', options: ['suggestion', 'problem', 'mistake'], correct: 'suggestion' },
]

export default function Phase6SP2Step5RemB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/5/remedial/b1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({ BLANK1: '', BLANK2: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const allAnswered = answers.BLANK1 !== '' && answers.BLANK2 !== ''
  const blank1Correct = submitted && answers.BLANK1 === 'nice'
  const blank2Correct = submitted && answers.BLANK2 === 'suggestion'

  const handleSubmit = async () => {
    if (!allAnswered) return
    const correct = BLANKS.filter(b => answers[b.id] === b.correct).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'A', correct, 2, 0, 2) } catch (e) { console.error(e) }
  }

  const selectSx = (key) => ({
    minWidth: 140,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: submitted ? (answers[key] === BLANKS.find(b => b.id === key)?.correct ? P.green.border : P.red.border) : undefined,
      borderWidth: submitted ? 2 : 1,
    },
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial B1 — Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Negotiation Gap Fill — Complete the feedback dialogue with the correct words.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Read the feedback dialogue below. Select the correct word from each dropdown to complete the conversation appropriately.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Line 1: PEER */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>PEER</Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"My report?"</Typography>
          </Box>

          {/* Line 2: YOU — BLANK1 */}
          <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1">"It is</Typography>
              <FormControl size="small"><Select value={answers.BLANK1} onChange={e => setAnswers({ ...answers, BLANK1: e.target.value })} disabled={submitted} displayEmpty sx={selectSx('BLANK1')}>
                <MenuItem value=""><em>Choose...</em></MenuItem>
                {BLANKS[0].options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select></FormControl>
              <Typography variant="body1">."</Typography>
              {submitted && (blank1Correct ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} /> : <Typography variant="body2" sx={{ color: P.red.border }}>Correct: <strong>nice</strong></Typography>)}
            </Box>
          </Box>

          {submitted && (
            <Box sx={{ ...cardSx(blank1Correct ? P.green : P.red), mb: 2, p: 2 }}>
              <Typography variant="body2" sx={{ color: blank1Correct ? P.green.shadow : P.red.border }}>
                {blank1Correct ? 'Correct! "nice" is the appropriate positive adjective for feedback.' : 'Incorrect — the correct answer is "nice". Peer feedback should use positive, encouraging language.'}
              </Typography>
            </Box>
          )}

          {/* Line 3: PEER */}
          <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>PEER</Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontStyle: 'italic' }}>"Improve?"</Typography>
          </Box>

          {/* Line 4: YOU — BLANK2 */}
          <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.border, textTransform: 'uppercase', letterSpacing: 1 }}>YOU</Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <FormControl size="small"><Select value={answers.BLANK2} onChange={e => setAnswers({ ...answers, BLANK2: e.target.value })} disabled={submitted} displayEmpty sx={selectSx('BLANK2')}>
                <MenuItem value=""><em>Choose...</em></MenuItem>
                {BLANKS[1].options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select></FormControl>
              <Typography variant="body1">: please add numbers."</Typography>
              {submitted && (blank2Correct ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} /> : <Typography variant="body2" sx={{ color: P.red.border }}>Correct: <strong>suggestion</strong></Typography>)}
            </Box>
          </Box>

          {submitted && (
            <Box sx={{ ...cardSx(blank2Correct ? P.green : P.red), mb: 3, p: 2 }}>
              <Typography variant="body2" sx={{ color: blank2Correct ? P.green.shadow : P.red.border }}>
                {blank2Correct ? 'Correct! "Suggestion" is the right word to introduce a constructive recommendation.' : 'Incorrect — the correct answer is "Suggestion". Use "Suggestion:" to introduce a recommendation politely.'}
              </Typography>
            </Box>
          )}
        </motion.div>

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.6 : 1, '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task A Complete! Score: {score}/2</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 2 ? 'Perfect! You correctly completed the feedback dialogue.' : score === 1 ? 'Good effort! Review the incorrect blank above and note the correct word.' : 'Review both answers above — focus on using positive and constructive feedback language.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b1/task/b')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task B
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
