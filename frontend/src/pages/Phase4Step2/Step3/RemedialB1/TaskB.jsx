import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, CircularProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'
import { requestPhase42TaskBScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 3 - Level B1 - Task B: Definition Duel
 * Write definitions with examples for 8 social media terms
 */

const TERMS = [
  { term: 'hashtag', example: 'Hashtag is # to make post seen more' },
  { term: 'caption', example: 'Caption is text under photo to explain' },
  { term: 'emoji', example: 'Emoji is picture to show feeling' },
  { term: 'tag', example: 'Tag is @ to mention person' },
  { term: 'call-to-action', example: 'Call-to-action is words to tell people do something' },
  { term: 'post', example: 'Post is photo and words you share' },
  { term: 'story', example: 'Story is photo that goes away after 24 hours' },
  { term: 'like', example: 'Like is heart button to show you enjoy post' }
]

export default function Phase4_2Step3RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 2, context: 'remedial_b1' })
  const [definitions, setDefinitions] = useState(Array(8).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const handleInputChange = (index, value) => {
    const newDefinitions = [...definitions]
    newDefinitions[index] = value
    setDefinitions(newDefinitions)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await requestPhase42TaskBScore(3, 'B1', {
        definitions: definitions.map((def, idx) => ({ term: TERMS[idx].term, definition: def })),
      })

      setScore(result.score)
      setFeedback(result.feedback || [])
      setShowResults(true)
      sessionStorage.setItem('phase4_2_step3_b1_taskB', result.score.toString())
      logTaskCompletion(result.score, 8)
    } catch (error) {
      console.error('Failed to evaluate:', error)
      alert('Failed to evaluate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'B1', task: 'B', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase4_2/step/3/remedial/b1/taskC') }

  const allFilled = definitions.every(def => def.trim() !== '')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>Phase 4.2 Step 3 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task B: Definition Duel</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Write simple definitions for these social media terms. Include examples to show you understand!" />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1"><strong>Instructions:</strong> Write a definition with an example for each of the 8 social media terms.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><strong>Evaluation:</strong> AI will check for B1 grammar and simple examples. Each good definition earns 1 point.</Typography>
          </Box>

          {/* Gamification banner */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.yellow.shadow, mb: 0.5 }}>Definition Duel</Typography>
            <Typography variant="body2">Battle it out! Write the clearest definitions to win!</Typography>
          </Box>

          {/* Examples */}
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: P.green.shadow }}>Example Answers:</Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>"Hashtag is # to make post seen more"</Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"Caption is text under photo to explain"</Typography>
          </Box>

          {/* Term inputs */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            {TERMS.map((item, index) => {
              const fb = feedback[index]
              let bg = P.orange.bg; let border = P.orange.border; let shadow = P.orange.shadow
              if (showResults && fb?.correct) { bg = P.green.bg; border = P.green.border; shadow = P.green.shadow }
              else if (showResults && fb && !fb.correct) { bg = P.yellow.bg; border = P.yellow.border; shadow = P.yellow.shadow }
              else if (definitions[index]?.trim()) { bg = P.blue.bg; border = P.blue.border; shadow = P.blue.shadow }

              return (
                <Box key={index} sx={{ bgcolor: bg, border: `2px solid ${border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${shadow}`, p: 3 }}>
                  <Box component="span" sx={{
                    bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                    borderRadius: '999px', px: 2, py: 0.3,
                    fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                    display: 'inline-block', mb: 2
                  }}>{index + 1}. {item.term}</Box>
                  <TextField
                    fullWidth multiline rows={2}
                    placeholder="Write your definition with an example..."
                    value={definitions[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={showResults || loading}
                    sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  {showResults && fb && (
                    <Box sx={{
                      bgcolor: fb.correct ? P.green.bg : P.yellow.bg,
                      border: `1px solid ${fb.correct ? P.green.border : P.yellow.border}`,
                      borderRadius: '8px', mt: 2, p: 1.5
                    }}>
                      <Typography variant="body2">{fb.comment}</Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Results summary */}
          {showResults && (
            <Box sx={{
              bgcolor: score >= 6 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 6 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {score >= 6 ? `Great work! You scored ${score}/8 points!` : `You got ${score}/8 correct. Review the feedback above!`}
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allFilled || loading} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (allFilled && !loading) ? 'pointer' : 'not-allowed',
                color: P.orange.shadow, opacity: (allFilled && !loading) ? 1 : 0.5,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: (allFilled && !loading) ? 'translate(-2px,-2px)' : 'none' }
              }}>
                {loading ? <><CircularProgress size={18} sx={{ color: P.orange.shadow }} /> Evaluating...</> : 'Submit Definitions'}
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Continue to Task C <ArrowForwardIcon /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
