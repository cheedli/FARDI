import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, FormControl, Select, MenuItem, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const PAIRS = [
  { error: '"Your reprot is good."', correct: '"Your report demonstrates a strong command of formal register."' },
  { error: '"The chalenge part is ok."', correct: '"The Challenges section provides an honest account of the difficulties encountered."' },
  { error: '"You should recomend better things."', correct: '"I recommend including more specific, measurable targets in the Recommendations section."' },
  { error: '"The feedbak is nice."', correct: '"The feedback is well-structured and demonstrates careful attention to the positive sandwich approach."' },
  { error: '"Do better on grammer."', correct: '"To enhance grammatical accuracy, I suggest reviewing subject-verb agreement throughout."' },
  { error: '"The sucesses are good but short."', correct: '"The Successes section is well-identified; further development with specific data would strengthen its impact."' },
]

const ALL_OPTIONS = PAIRS.map(p => p.correct)

export default function Phase6SP2Step5RemB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_b2' })
  const [selections, setSelections] = useState(Array(PAIRS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleChange = (index, value) => {
    setSelections(prev => { const updated = [...prev]; updated[index] = value; return updated })
  }

  const allFilled = selections.every(s => s !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = selections.filter((s, i) => s === PAIRS[i].correct).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial B2 — Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Error Matching Game — Match Each Flawed Sentence to Its Corrected Version</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">For each flawed feedback sentence, select the correct formal version from the dropdown. Each correct version is used only once.</Typography>
          </Box>
        </motion.div>

        {PAIRS.map((pair, index) => {
          const userSelection = selections[index]
          const isCorrect = submitted && userSelection === pair.correct
          const isWrong = submitted && userSelection !== pair.correct
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
              <Box sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue), mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: P.blue.border }}>Sentence {index + 1}</Typography>
                <Box sx={{ ...cardSx(P.red), p: 2, mb: 2, borderRadius: '12px' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.red.border, mb: 0.5 }}>Flawed version:</Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{pair.error}</Typography>
                </Box>
                <FormControl fullWidth disabled={submitted} size="small">
                  <Select
                    value={userSelection}
                    onChange={e => handleChange(index, e.target.value)}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: submitted ? (isCorrect ? P.green.border : P.red.border) : undefined,
                        borderWidth: submitted ? 2 : 1,
                      }
                    }}
                  >
                    <MenuItem value=""><em>Select the correct version...</em></MenuItem>
                    {ALL_OPTIONS.map((opt, oi) => (
                      <MenuItem key={oi} value={opt} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        <Typography variant="body2">{opt}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {submitted && (
                  <Box sx={{ ...cardSx(isCorrect ? P.green : P.yellow), p: 2, mt: 2, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.yellow.shadow }}>
                      {isCorrect ? 'Correct match!' : 'Incorrect.'}
                    </Typography>
                    {isWrong && <Typography variant="body2" sx={{ mt: 0.5 }}>The correct match is: {pair.correct}</Typography>}
                  </Box>
                )}
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Matches
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task C Complete! Score: {score}/6</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 6 ? 'Perfect! You matched all flawed sentences to their correct formal versions.' : score >= 4 ? 'Good work! Review the mismatched pairs above to consolidate your understanding.' : 'Keep practising — focus on identifying spelling errors, vague language, and informal register.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(5, 'B2'))} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Complete SubPhase 2
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
