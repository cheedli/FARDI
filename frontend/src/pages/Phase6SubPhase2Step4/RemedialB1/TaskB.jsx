import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' } }

const PROMPTS = [
  { question: 'Positive?', example: 'Your summary is good.' },
  { question: 'Strength?', example: 'Strength is clear writing.' },
  { question: 'Weakness?', example: 'Weakness is no numbers.' },
  { question: 'Suggestion?', example: 'Suggestion: add evidence.' },
  { question: 'Improve?', example: 'You can improve formality.' },
  { question: 'Thank?', example: 'Thank you for sharing.' },
]

const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

export default function Phase6SP2Step4RemB1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/4/remedial/b1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(PROMPTS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    const correct = answers.filter((a) => wordCount(a) >= 3).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'B', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = answers.every((a) => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial B1 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Writing Proposals — 6 Sentences Giving Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Answer each guided question with a sentence giving feedback on a report. Write at least 3 words per sentence. An example is shown after you submit.</Typography>
          </Box>
        </motion.div>

        {PROMPTS.map((p, idx) => {
          const wc = wordCount(answers[idx])
          const isSufficient = wc >= 3
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ bgcolor: P.orange.border, color: 'white', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}>{idx + 1}</Box>
                  <Typography variant="subtitle1" fontWeight="bold">{p.question}</Typography>
                </Box>
                <TextField fullWidth multiline rows={2} value={answers[idx]} onChange={(e) => { const updated = [...answers]; updated[idx] = e.target.value; setAnswers(updated) }} disabled={submitted} placeholder="Write your sentence here..." sx={{ mb: 1 }} />
                <Typography variant="caption" color={submitted ? (isSufficient ? 'success.main' : 'error.main') : 'text.secondary'}>
                  Words: {wc} {submitted ? isSufficient ? '(correct — 3+ words)' : '(needs 3+ words)' : '(aim for 3+ words)'}
                </Typography>
                {!submitted && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LightbulbIcon sx={{ color: P.yellow.border, fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary"><strong>Example:</strong> {p.example}</Typography>
                  </Box>
                )}
                <Collapse in={submitted}>
                  <Box sx={{ ...cardSx(P.green), p: 2, mt: 2, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>Example answer:</Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{p.example}</Typography>
                  </Box>
                </Collapse>
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAttempted} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAttempted ? 'not-allowed' : 'pointer', opacity: !allAttempted ? 0.6 : 1, '&:hover': allAttempted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit All Sentences
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task B Complete! Score: {score}/6</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 6 ? 'Excellent! All sentences met the minimum length.' : score >= 4 ? 'Good effort! Compare your sentences with the examples above.' : 'Keep practising — review the example sentences to build confidence.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b1/task/c')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task C
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
