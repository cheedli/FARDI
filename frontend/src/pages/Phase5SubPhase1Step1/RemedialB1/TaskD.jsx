import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Remedial B1 - Task D: Quizlet Flashcards
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const FLASHCARDS = [
  { term: 'alternative', definition: 'Another choice', id: 1 },
  { term: 'urgent', definition: 'Very important now', id: 2 },
  { term: 'solution', definition: 'Way to fix', id: 3 },
  { term: 'sorry', definition: 'Apology', id: 4 },
  { term: 'cancel', definition: 'Stop plan', id: 5 },
  { term: 'change', definition: 'Make different', id: 6 },
  { term: 'fix', definition: 'Solve problem', id: 7 },
  { term: 'problem', definition: 'Something wrong', id: 8 }
]

export default function Phase5Step1RemedialB1TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/1/remedial/b1/task/e') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 4, context: 'remedial_b1' })
  const [flipped, setFlipped] = useState({})
  const [matched, setMatched] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleFlip = (id) => {
    if (matched.has(id)) return
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleMatch = (id) => {
    setMatched(prev => new Set([...prev, id]))
  }

  const handleSubmit = async () => {
    const correctCount = matched.size
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_b1_taskD_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'B1', 'D', correctCount, 8, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/b1/task/e')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Step 1: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task D: Quizlet Flashcards</Typography>
            <Typography variant="body1">Flip flashcards to match problem-solving terms</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quizlet Flashcards! Click each card to flip it and see the term or definition. Match all 8 pairs correctly!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2, mb: 3 }}>
                {FLASHCARDS.map((card) => {
                  const isMatched = matched.has(card.id)
                  const isFlipped = flipped[card.id]
                  const col = isMatched ? P.green : (isFlipped ? P.purple : P.blue)
                  return (
                    <Box
                      key={card.id}
                      component="button"
                      onClick={() => handleFlip(card.id)}
                      sx={{
                        bgcolor: col.bg, border: `2px solid ${col.border}`,
                        borderRadius: '16px', boxShadow: `4px 4px 0 ${col.shadow}`,
                        minHeight: 120, p: 2, cursor: isMatched ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                        '&:hover': !isMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${col.shadow}` } : {}
                      }}
                    >
                      {isFlipped ? (
                        <Typography variant="body1" align="center">{card.definition}</Typography>
                      ) : (
                        <Typography variant="h6" align="center" sx={{ color: col.border }}>{card.term}</Typography>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </motion.div>
            <Box
              component="button"
              onClick={handleSubmit}
              sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.blue.border, cursor: 'pointer', width: '100%',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
              }}
            >
              Submit
            </Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Next: Task E →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
