import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const TERMS = [
  { word: 'feedback', usageExample: '"I gave feedback on the report by explaining what was good and what to improve."' },
  { word: 'constructive', usageExample: '"My feedback was constructive — it offered specific ways to improve."' },
  { word: 'suggestion', usageExample: '"My suggestion is to add more evidence to the Challenges section."' },
  { word: 'strength', usageExample: '"A strength of your report is the clear and well-organized summary."' },
  { word: 'weakness', usageExample: '"One weakness is that the recommendations are too vague."' },
  { word: 'polite', usageExample: '"I tried to be polite by starting with something positive before giving suggestions."' },
]

export default function Phase6SP2Step4RemB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(TERMS.map(() => ''))
  const [usages, setUsages] = useState(TERMS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleSubmit = async () => {
    let total = 0
    TERMS.forEach((term, i) => {
      const spellScore = spellings[i].trim().toLowerCase() === term.word.toLowerCase() ? 1 : 0
      const useScore = wordCount(usages[i]) >= 5 ? 1 : 0
      total += spellScore + useScore
    })
    const finalScore = Math.round(total / 2)
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taskd_score', finalScore.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'D', finalScore, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = spellings.every((s) => s.trim().length > 0) && usages.every((u) => u.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial B2 — Task D</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Spell & Explain — Peer Feedback Vocabulary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">For each peer feedback term: (1) spell it correctly in the first box, and (2) write a sentence explaining how you would use it in feedback in the second box.</Typography>
          </Box>
        </motion.div>

        {TERMS.map((term, idx) => {
          const isCorrectSpelling = submitted && spellings[idx].trim().toLowerCase() === term.word.toLowerCase()
          const isWrongSpelling = submitted && spellings[idx].trim().toLowerCase() !== term.word.toLowerCase()
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ bgcolor: P.orange.border, color: 'white', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}>{idx + 1}</Box>
                  <Typography variant="subtitle1" fontWeight="bold">Term #{idx + 1}</Typography>
                  {submitted && (
                    <Box sx={{ ml: 'auto', bgcolor: isCorrectSpelling ? P.green.border : P.red.border, color: 'white', px: 1.5, py: 0.3, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {isCorrectSpelling ? 'Correct spelling' : 'Wrong spelling'}
                    </Box>
                  )}
                </Box>

                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Spell the term:</Typography>
                <TextField fullWidth value={spellings[idx]} onChange={(e) => { const updated = [...spellings]; updated[idx] = e.target.value; setSpellings(updated) }} disabled={submitted} placeholder="Type the spelling here..." size="small" sx={{ mb: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: isCorrectSpelling ? P.green.border : isWrongSpelling ? P.red.border : undefined, borderWidth: submitted ? 2 : 1 } }} />
                {isWrongSpelling && <Typography variant="body2" sx={{ color: P.red.border, mb: 1 }}>Correct spelling: <strong>{term.word}</strong></Typography>}

                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, mt: 1 }}>How would you use it in peer feedback?</Typography>
                <TextField fullWidth multiline rows={2} value={usages[idx]} onChange={(e) => { const updated = [...usages]; updated[idx] = e.target.value; setUsages(updated) }} disabled={submitted} placeholder="Write a sentence showing how to use this term in feedback..." sx={{ mb: 1 }} />
                <Typography variant="caption" color={wordCount(usages[idx]) >= 5 ? 'success.main' : 'text.secondary'}>
                  Words: {wordCount(usages[idx])} {wordCount(usages[idx]) >= 5 ? '' : '(aim for 5+)'}
                </Typography>

                {submitted && (
                  <Box sx={{ ...cardSx(P.green), p: 2, mt: 2, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>Example usage:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{term.usageExample}</Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAttempted} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAttempted ? 'not-allowed' : 'pointer', opacity: !allAttempted ? 0.6 : 1, '&:hover': allAttempted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit All Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task D Complete! Score: {score}/6</Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={(score / 6) * 100} sx={{ height: 10, borderRadius: 5, backgroundColor: P.green.bg, '& .MuiLinearProgress-bar': { backgroundColor: P.green.border } }} />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 6 ? 'Perfect! You have mastered all six peer feedback terms.' : score >= 4 ? 'Well done! Review the example usages above to reinforce your understanding.' : 'Study the example usages carefully and practise spelling these key terms.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(4, 'B2'))} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
