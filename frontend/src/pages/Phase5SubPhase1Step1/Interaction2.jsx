import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

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

/**
 * Phase 5 Step 1: Engage
 * Interaction 2: Solution Suggestion
 * SKANDER: "The singer canceled! How can we solve this last-minute problem?"
 * Students suggest a solution with problem-solving vocabulary
 */

const TARGET_VOCABULARY = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

const EXPECTED_EXAMPLES = {
  A1: 'Find new singer.',
  A2: 'Find alternative singer because urgent.',
  B1: 'We can find another singer as an alternative because it is urgent and keeps the program.',
  B2: 'I suggest finding a backup performer or local talent as a quick alternative, since this solution is urgent and maintains the event quality.',
  C1: 'A feasible solution would be to secure a substitute artist immediately while sending an apologetic update to attendees, ensuring minimal disruption and preserving trust.'
}

export default function Phase5Step1Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 2, context: 'main' })
  const [solution, setSolution] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!solution.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please suggest a solution to the problem.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateSolution(solution.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work!',
          vocabulary_used: data.vocabulary_used || [],
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase5_step1_interaction2_score', data.score || 1)
        sessionStorage.setItem('phase5_step1_interaction2_level', data.level || 'A1')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: result.error || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on keywords
      const solutionLower = solution.toLowerCase()
      const hasSolution = solutionLower.includes('solution') ||
                         solutionLower.includes('find') ||
                         solutionLower.includes('alternative') ||
                         solutionLower.includes('fix')
      const hasAlternative = solutionLower.includes('alternative') ||
                            solutionLower.includes('backup') ||
                            solutionLower.includes('substitute')
      const hasUrgent = solutionLower.includes('urgent') ||
                       solutionLower.includes('quick') ||
                       solutionLower.includes('immediately')
      const hasReasoning = solutionLower.includes('because') ||
                         solutionLower.includes('since') ||
                         solutionLower.includes('so that')

      const wordCount = solution.split(/\s+/).length
      const vocabularyCount = TARGET_VOCABULARY.filter(term =>
        solutionLower.includes(term)
      ).length

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Sophisticated solution
      if (wordCount >= 20 && vocabularyCount >= 3 && hasAlternative && hasReasoning &&
          (solutionLower.includes('feasible') || solutionLower.includes('secure') ||
           solutionLower.includes('mitigate') || solutionLower.includes('preserve'))) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your solution demonstrates sophisticated problem-solving with advanced vocabulary and strategic thinking. You provided a comprehensive approach that considers multiple aspects of the situation.'
      }
      // B2: 4 points - Detailed solution
      else if (wordCount >= 15 && vocabularyCount >= 2 && hasAlternative && hasReasoning) {
        score = 4
        level = 'B2'
        feedback = 'Very good! Your solution is detailed and logical, using multiple vocabulary terms effectively. You showed good reasoning and consideration of the problem.'
      }
      // B1: 3 points - Clear solution with reasoning
      else if (wordCount >= 10 && vocabularyCount >= 2 && hasSolution && hasReasoning) {
        score = 3
        level = 'B1'
        feedback = 'Good! You provided a clear solution with reasoning and used problem-solving vocabulary. Try to include more details about why your solution works.'
      }
      // A2: 2 points - Simple solution with vocabulary
      else if (wordCount >= 5 && vocabularyCount >= 1 && hasSolution) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You suggested a solution and used some vocabulary. Try to add reasoning with "because" or "since" to explain why your solution works.'
      }
      // A1: 1 point - Basic solution mention
      else if (hasSolution && wordCount >= 3) {
        score = 1
        level = 'A1'
        feedback = 'You mentioned a solution. Try to use vocabulary terms like "alternative", "urgent", or "solution" and explain why it works with "because".'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please suggest a solution to the problem. Use vocabulary terms like "alternative", "urgent", or "solution" and explain why it works.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback,
        vocabulary_used: TARGET_VOCABULARY.filter(term => solutionLower.includes(term))
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase5_step1_interaction2_score', score)
        sessionStorage.setItem('phase5_step1_interaction2_level', level)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/interaction/3')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.blue.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.blue.shadow}>
              Step 1: Engage - Interaction 2
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Suggest a solution to the last-minute problem
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="SKANDER"
              message="The singer canceled! How can we solve this last-minute problem for the festival?"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '16px',
            p: 2.5, mb: 3,
            display: 'flex', alignItems: 'flex-start', gap: 1.5,
          }}>
            <InfoIcon sx={{ color: P.blue.border, mt: 0.25 }} />
            <Box>
              <Typography variant="body2" gutterBottom fontWeight={700} color={P.blue.shadow}>
                Instructions:
              </Typography>
              <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.primary'}>
                Suggest one solution (e.g., find alternative performer, change schedule) and explain why it works.
                Use vocabulary terms like: <strong>{TARGET_VOCABULARY.join(', ')}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                <strong>Hint:</strong> Start with "We can..." or "I suggest..." and use "because" to explain your reasoning.
              </Typography>
            </Box>
          </Box>

          {/* Vocabulary Reference */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.yellow.shadow, mr: 1.5 }} />
              <Typography variant="h6" fontWeight={700} color={P.teal.shadow}>
                Problem-Solving Vocabulary
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {TARGET_VOCABULARY.map((term, idx) => (
                <Box key={idx} sx={{
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '999px',
                  px: 2, py: 0.5,
                  fontWeight: 700, fontSize: '0.85rem',
                  color: P.blue.shadow,
                }}>
                  {term}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Expected Response Examples */}
          <Box sx={{
            bgcolor: P.yellow.bg,
            border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom color={P.yellow.shadow}>
              Expected Response Examples (by level):
            </Typography>
            <Stack spacing={1}>
              {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight={700} color={P.yellow.shadow}>
                    {level}:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2, color: isDark ? 'rgba(255,255,255,0.8)' : 'text.primary' }}>
                    "{example}"
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Writing Area */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.orange.shadow}>
              Your Solution Suggestion
            </Typography>

            <Box sx={{
              bgcolor: P.yellow.bg,
              border: `2px solid ${P.yellow.border}`,
              borderRadius: '12px',
              p: 2, mb: 2,
            }}>
              <Typography variant="body2" color={P.yellow.shadow} fontWeight={600}>
                <strong>Assessment Focus:</strong> Grammar (connectors like "because"),
                Problem-solving language, Logical reasoning, Vocabulary usage
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Example: We can find another singer as an alternative because it is urgent and keeps the program running..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color={isDark ? 'rgba(255,255,255,0.5)' : 'text.secondary'}>
                Words: {solution.split(/\s+/).filter(w => w.length > 0).length} |
                Vocabulary used: {TARGET_VOCABULARY.filter(term =>
                  solution.toLowerCase().includes(term)
                ).length}/{TARGET_VOCABULARY.length}
              </Typography>
            </Box>

            {!submitted && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !solution.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                  py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: loading || !solution.trim() ? 'not-allowed' : 'pointer',
                  color: P.blue.shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  opacity: loading || !solution.trim() ? 0.6 : 1,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': !loading && solution.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                }}
              >
                {loading ? <CircularProgress size={20} /> : <LightbulbIcon />}
                {loading ? 'Evaluating...' : 'Submit Solution'}
              </Box>
            )}
          </Box>

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.orange.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700} color={evaluation.success ? P.green.shadow : P.orange.shadow}>
                    {evaluation.success ? 'Solution Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: isDark ? 'rgba(255,255,255,0.85)' : 'text.primary' }}>
                {evaluation.feedback}
              </Typography>

              {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600} color={evaluation.success ? P.green.shadow : P.orange.shadow}>
                    Vocabulary Terms Used:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.vocabulary_used.map((term, idx) => (
                      <Box key={idx} sx={{
                        bgcolor: P.green.bg,
                        border: `2px solid ${P.green.border}`,
                        borderRadius: '999px', px: 2, py: 0.5,
                        fontSize: '0.8rem', fontWeight: 700,
                        color: P.green.shadow,
                      }}>
                        {term}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600} color={P.green.shadow}>
                    Strengths:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {evaluation.strengths.map((strength, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">{strength}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {evaluation.improvements && evaluation.improvements.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600} color={P.orange.shadow}>
                    Suggestions for Improvement:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {evaluation.improvements.map((improvement, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">{improvement}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {submitted && (
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    width: '100%',
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '12px',
                    boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    py: 1.5, mt: 2,
                    fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer',
                    color: P.green.shadow,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  }}
                >
                  Continue to Interaction 3
                </Box>
              )}
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
