import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const QUESTIONS = [
  { id: 1, sentence: '"Pleese welcom" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 2, sentence: '"Furst chek" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 3, sentence: '"Then guied" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 4, sentence: '"Be cairful" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 5, sentence: '"Thankk you" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 0 },
  { id: 6, sentence: '"Help peoples" error?', options: ['Spelling', 'Grammar', 'Structure'], correct: 1 }
]

export default function Phase5SubPhase2Step5RemedialB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, value) => setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) correctCount++ })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b1_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(5, 'B1', 'C', correctCount, 6, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }
  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(5, 'B1'))
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 5: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task C: Wordshake Quiz</Typography>
            <Typography variant="body1">Identify error type in 6 sentences</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Wordshake Quiz! Identify the type of error in each sentence. Is it spelling, grammar, or structure?" />
          </Box>
          {!submitted ? (
            <>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {QUESTIONS.map((q) => (
                  <Box key={q.id} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 3 }}>
                    <Typography variant="h6" gutterBottom>Question {q.id}: {q.sentence}</Typography>
                    <FormControl component="fieldset">
                      <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                        {q.options.map((option, idx) => <FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />)}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
              </Stack>
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered}
                sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Submit Answers
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task C Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue}
                  sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                  Continue to Score Calculation →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
