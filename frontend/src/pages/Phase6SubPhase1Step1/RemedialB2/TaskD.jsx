import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B2 - Task D
 * Spelling & Explain: "Spell & Report Quest"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const TERMS = [
  { id: 0, term: 'success', explanation: 'Positive result of the event' },
  { id: 1, term: 'challenge', explanation: 'Difficult problem we faced' },
  { id: 2, term: 'feedback', explanation: 'Comments from guests' },
  { id: 3, term: 'improve', explanation: 'Do better next time' },
  { id: 4, term: 'recommend', explanation: 'Suggest what to change' },
  { id: 5, term: 'achievement', explanation: 'Something we did very well' }
]

export default function Phase6SP1Step1RemB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState({})
  const [explanations, setExplanations] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [correctSpellings, setCorrectSpellings] = useState(new Set())
  const [score, setScore] = useState(0)

  const allAnswered = TERMS.every(t => (spellings[t.id] || '').trim().length > 0 && (explanations[t.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    const correctSet = new Set()
    TERMS.forEach(t => {
      const spelledCorrectly = (spellings[t.id] || '').trim().toLowerCase() === t.term
      const hasExplanation = (explanations[t.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 3
      if (spelledCorrectly) {
        correctSet.add(t.id)
        correct += 0.5
      }
      if (hasExplanation) correct += 0.5
    })
    const finalScore = Math.round(correct)
    setCorrectSpellings(correctSet)
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b2_taskd_score', finalScore.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'D', finalScore, TERMS.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task D: Spell & Report Quest</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Spell and explain 6 key report/reflection terms</Typography>
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
              speaker="Ms. Mabrouki"
              message="Spell & Report Quest! For each term, type the correct spelling AND write a short explanation of what it means in a post-event report. Both spelling AND explanation count toward your score!"
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
            <strong>Instructions:</strong> For each term below, (1) type the correct spelling and (2) write a short explanation
            (at least 3 words) of what the term means in the context of a post-event report.
          </Typography>
        </Box>

        <Stack spacing={3}>
          {TERMS.map((t) => {
            const isSpelledCorrect = submitted && (spellings[t.id] || '').trim().toLowerCase() === t.term
            const isSpelledWrong = submitted && !isSpelledCorrect
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + t.id * 0.04 }}>
                <Box sx={{
                  bgcolor: submitted ? (isSpelledCorrect ? P.green.bg : P.red.bg) : P.yellow.bg,
                  border: `2px solid ${submitted ? (isSpelledCorrect ? P.green.border : P.red.border) : P.yellow.border}`,
                  borderRadius: '14px',
                  boxShadow: `2px 2px 0 ${submitted ? (isSpelledCorrect ? P.green.shadow : P.red.shadow) : P.yellow.shadow}`,
                  p: 2.5
                }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: P.orange.shadow }}>Term {t.id + 1}</Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, color: P.orange.shadow }}>1. Spell the term:</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={spellings[t.id] || ''}
                        onChange={(e) => setSpellings({ ...spellings, [t.id]: e.target.value })}
                        disabled={submitted}
                        placeholder="Type the spelling here..."
                        error={isSpelledWrong}
                      />
                      {submitted && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          {isSpelledCorrect
                            ? <><CheckCircleIcon sx={{ color: P.green.border, fontSize: 16 }} /><Typography variant="caption" sx={{ color: P.green.shadow }}>Correct spelling!</Typography></>
                            : <><CancelIcon sx={{ color: P.red.border, fontSize: 16 }} /><Typography variant="caption" sx={{ color: P.red.shadow }}>Correct: "{t.term}"</Typography></>
                          }
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, color: P.orange.shadow }}>2. Explain in your own words:</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={explanations[t.id] || ''}
                        onChange={(e) => setExplanations({ ...explanations, [t.id]: e.target.value })}
                        disabled={submitted}
                        placeholder="What does this mean in a post-event report?"
                      />
                      {submitted && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Model explanation: {t.explanation}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </motion.div>
            )
          })}
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
              mt: 3, py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              fontSize: '1rem', fontWeight: 'bold', color: P.orange.shadow,
              '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none', boxShadow: allAnswered ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s'
            }}
          >
            Submit All Terms
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mt: 3, textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>Score: {score}/{TERMS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 5 ? 'Excellent! Great spelling and explanations!' : 'Good effort! Review the model explanations above.'}
              </Typography>
              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(1, 'B2'))}
                sx={{
                  cursor: 'pointer', mt: 2, px: 4, py: 1.5,
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
