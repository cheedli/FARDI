import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const QUESTIONS = [
  { question: 'What does "success" mean?', options: ['Good result', 'Big problem', 'Short text'], correct: 0, explanation: 'Success = Good result. When something goes well, it is a success!' },
  { question: 'What does "challenge" mean?', options: ['Happy feeling', 'Problem', 'List of people'], correct: 1, explanation: 'Challenge = Problem. A challenge is something difficult to deal with.' },
  { question: 'What does "feedback" mean?', options: ['A long report', 'A type of event', 'What people say'], correct: 2, explanation: 'Feedback = What people say. Feedback is the opinions and comments people give.' },
  { question: 'What does "improve" mean?', options: ['Make better', 'Write a summary', 'Find a problem'], correct: 0, explanation: 'Improve = Make better. When we improve, we make something better than before.' },
  { question: 'What does "recommend" mean?', options: ['Count people', 'Suggest', 'Fix a problem'], correct: 1, explanation: 'Recommend = Suggest. When you recommend something, you suggest it to others.' },
  { question: 'What does "summary" mean?', options: ['A list of challenges', 'A long description', 'Short story'], correct: 2, explanation: 'Summary = Short story/overview. A summary gives the main points in a short text.' }
]

export default function Phase6SP1Step2RemedialB1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase1RemedialNextUrl(2, 'B1').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Quiz Game</Typography>
            <Typography variant="body1" color="text.secondary">Answer 6 questions on report terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Quiz time! Choose the correct meaning for each report word. Read each question carefully and select the best answer." />
          </Box>
        </motion.div>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => {
            const isCorrect = submitted && parseInt(answers[idx]) === q.correct
            const isWrong = submitted && parseInt(answers[idx]) !== q.correct
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.03 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? P.green : P.red) : P.blue), p: 2.5 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
                  <RadioGroup value={answers[idx] !== undefined ? answers[idx].toString() : ''} onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}>
                    {q.options.map((opt, oi) => (
                      <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} size="small" />}
                        label={<Typography variant="body2" sx={{ color: submitted && oi === q.correct ? P.green.border : 'inherit', fontWeight: submitted && oi === q.correct ? 'bold' : 'normal' }}>{opt}</Typography>} />
                    ))}
                  </RadioGroup>
                  {submitted && (
                    <Box sx={{ ...cardSx(isCorrect ? P.green : P.red), mt: 1, p: 1.5 }}>
                      <Typography variant="body2">{q.explanation}</Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Stack>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task C Complete! Score: {score}/{QUESTIONS.length}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score >= 5 ? 'Excellent! You know your report terms!' : 'Good effort! Review the explanations and keep practicing.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(2, 'B1'))} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
