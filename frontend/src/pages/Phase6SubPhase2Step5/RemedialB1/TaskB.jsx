import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const SENTENCES = [
  { faulty: 'Report bad.', model: 'Your report is nice.', keyword: 'nice' },
  { faulty: 'Add more.', model: 'Suggestion: please add more.', keyword: 'suggestion' },
  { faulty: 'Thank.', model: 'Thank you.', keyword: 'thank you' },
  { faulty: 'No good.', model: 'Positive point: good summary.', keyword: 'positive' },
  { faulty: 'Weak.', model: 'Area to improve: add evidence.', keyword: 'improve' },
  { faulty: 'Sugestion.', model: 'Suggestion: add numbers.', keyword: 'suggestion' },
  { faulty: 'Improv.', model: 'You can improve this part.', keyword: 'improve' },
  { faulty: 'Good job.', model: 'Overall good job!', keyword: 'overall' },
]

export default function Phase6SP2Step5RemB1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_b1' })
  const [inputs, setInputs] = useState(Array(SENTENCES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const allFilled = inputs.every(v => v.trim() !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = SENTENCES.filter((s, i) => inputs[i].toLowerCase().includes(s.keyword)).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'B', correct, 8, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial B1 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Writing Proposals — Rewrite 8 faulty feedback sentences correctly.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Each sentence below is written incorrectly. Type your corrected version in the input box. After submitting, the model answer will be revealed. Your answer is accepted if it contains the key improvement word.</Typography>
          </Box>
        </motion.div>

        {SENTENCES.map((s, index) => {
          const userInput = inputs[index]
          const isCorrect = submitted && userInput.toLowerCase().includes(s.keyword)
          const isWrong = submitted && !userInput.toLowerCase().includes(s.keyword)
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.04 }}>
              <Box sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <EditNoteIcon sx={{ color: P.orange.border, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold">Sentence {index + 1}</Typography>
                </Box>
                <Box sx={{ ...cardSx(P.purple), p: 2, mb: 2, borderRadius: '12px' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Faulty version:</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: P.orange.border }}>"{s.faulty}"</Typography>
                </Box>
                <TextField fullWidth size="small" label="Your corrected version" value={userInput} onChange={e => { const updated = [...inputs]; updated[index] = e.target.value; setInputs(updated) }} disabled={submitted} placeholder="Type the corrected sentence here..." sx={{ mb: submitted ? 1.5 : 0 }} />
                {submitted && (
                  <>
                    <Box sx={{ ...cardSx(isCorrect ? P.green : P.red), p: 2, mt: 1, borderRadius: '12px' }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.red.border }}>
                        {isCorrect ? 'Correct! Your correction includes the key improvement.' : `Needs improvement — key word missing: "${s.keyword}"`}
                      </Typography>
                    </Box>
                    <Box sx={{ ...cardSx(P.green), p: 2, mt: 1, borderRadius: '12px' }}>
                      <Typography variant="body2" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Model answer: "{s.model}"</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allFilled ? 'not-allowed' : 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit All Corrections
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task B Complete! Score: {score}/8</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 8 ? 'Perfect! You corrected all 8 faulty feedback sentences.' : score >= 6 ? 'Great work! Review the sentences you missed and compare with the model answers above.' : score >= 4 ? 'Good effort! Study the model answers carefully to understand formal feedback structure.' : 'Keep practising — focus on using key words like "Suggestion:", "Positive point:", and "Area to improve:".'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b1/task/c')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task C
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
