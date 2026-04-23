import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, RadioGroup, FormControlLabel, Radio, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const ERROR_TYPES = ['Spelling', 'Tone', 'Grammar', 'Structure', 'Vocabulary', 'Formality']
const QUESTIONS = [
  { sentence: '"Your reprot shows good understanding."', correctType: 'Spelling', explanation: '"reprot" should be "report" — always proofread key nouns.' },
  { sentence: '"This part is kinda weak, you know?"', correctType: 'Tone', explanation: '"kinda" and "you know" are informal — peer feedback must maintain a professional tone.' },
  { sentence: '"The report demonstrate good analysis."', correctType: 'Grammar', explanation: 'Subject-verb agreement error — "demonstrates" is required after "The report".' },
  { sentence: '"Good. Challenges. Recommendations. Better."', correctType: 'Structure', explanation: 'Feedback must be written in full, coherent sentences, not isolated words.' },
  { sentence: '"The writing is nice and the ideas are cool."', correctType: 'Vocabulary', explanation: '"nice" and "cool" are too informal — use "well-structured" and "insightful" instead.' },
  { sentence: '"Hey, your report is pretty good but fix some stuff."', correctType: 'Formality', explanation: '"Hey" and "fix some stuff" are inappropriate for formal academic peer feedback.' },
]

export default function Phase6SP2Step5RemB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const allAnswered = answers.every(a => a !== '')

  const handleSubmit = async () => {
    if (!allAnswered) return
    const correct = answers.filter((a, i) => a === QUESTIONS[i].correctType).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial B1 — Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Wordshake Quiz — Identify the Error Type in Peer Feedback Sentences</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Read each peer feedback sentence and identify the main type of error. Choose from: Spelling, Tone, Grammar, Structure, Vocabulary, Formality.</Typography>
          </Box>
        </motion.div>

        {QUESTIONS.map((q, index) => {
          const userAnswer = answers[index]
          const isCorrect = submitted && userAnswer === q.correctType
          const isWrong = submitted && userAnswer !== q.correctType
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
              <Box sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue), mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Question {index + 1}</Typography>
                <Box sx={{ ...cardSx(P.purple), p: 2, mb: 2, borderRadius: '12px' }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{q.sentence}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>What type of error does this sentence contain?</Typography>
                <RadioGroup value={userAnswer} onChange={e => { const updated = [...answers]; updated[index] = e.target.value; setAnswers(updated) }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {ERROR_TYPES.map(type => (
                      <FormControlLabel key={type} value={type} control={<Radio size="small" disabled={submitted} />} label={type} />
                    ))}
                  </Box>
                </RadioGroup>
                <Collapse in={submitted}>
                  <Box sx={{ ...cardSx(isCorrect ? P.green : P.yellow), p: 2, mt: 2, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.yellow.shadow }}>
                      {isCorrect ? 'Correct!' : `Incorrect — the error type is: ${q.correctType}`}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{q.explanation}</Typography>
                  </Box>
                </Collapse>
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.6 : 1, '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit All Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task C Complete! Score: {score}/6</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 6 ? 'Perfect score! You can identify all error types with confidence.' : score >= 4 ? 'Good work! Review the error types you missed above.' : 'Keep practising — review the 6 error types: Spelling, Tone, Grammar, Structure, Vocabulary, Formality.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(5, 'B1'))} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
