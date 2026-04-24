import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B1 - Task B
 * Writing Proposals: Write 6 sentences reflecting on the festival
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const GUIDED_QUESTIONS = [
  { id: 0, question: 'Best moment?', example: 'Best moment was dances.' },
  { id: 1, question: 'Why was it the best?', example: 'Because beautiful.' },
  { id: 2, question: 'What was difficult?', example: 'Lighting problem.' },
  { id: 3, question: 'How did you fix it?', example: 'Used backup.' },
  { id: 4, question: 'How did you feel?', example: 'I felt proud.' },
  { id: 5, question: 'How can you improve?', example: 'Plan better next time.' }
]

export default function Phase6SP1Step1RemB1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/1/remedial/b1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_QUESTIONS.every(q => (answers[q.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_QUESTIONS.forEach(q => {
      const words = (answers[q.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 2) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'B', correct, GUIDED_QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task B: Writing Proposals</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Write 6 sentences reflecting on the festival using past tense</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Emna"
              message="Now write 6 sentences about the festival! Answer each question below with a complete sentence. Use past tense (was, were, felt, fixed) and try to give reasons."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: P.blue.shadow }}>
            <strong>Instructions:</strong> Write a complete sentence to answer each question. Use past tense.
            Look at the example for each question to help you.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {GUIDED_QUESTIONS.map((q) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + q.id * 0.04 }}>
              <Box sx={{
                bgcolor: P.yellow.bg,
                border: `2px solid ${P.yellow.border}`,
                borderRadius: '14px',
                boxShadow: `2px 2px 0 ${P.yellow.shadow}`,
                p: 2.5
              }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, color: P.yellow.shadow }}>
                  {q.id + 1}. {q.question}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
                  Example: {q.example}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  disabled={submitted}
                  placeholder="Write your sentence here..."
                />
              </Box>
            </motion.div>
          ))}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              opacity: allAnswered ? 1 : 0.6,
              width: '100%',
              mt: 3,
              py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              fontSize: '1rem',
              fontWeight: 'bold',
              color: P.orange.shadow,
              '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none', boxShadow: allAnswered ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s'
            }}
          >
            Submit Writing
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3,
              mt: 3,
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>Score: {score}/{GUIDED_QUESTIONS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 5 ? 'Excellent! Great use of past tense and reflection language!' : 'Good work! Keep practising sentence writing.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/1/remedial/b1/task/c')}
                sx={{
                  cursor: 'pointer',
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Next: Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
