import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task D: Critique Kahoot (Critique Game)
 * Critique 6 social media elements with nuanced, balanced analysis
 */

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

const ELEMENTS = [
  { id: 1, element: 'Hashtag', expectedCritique: 'Powerful for reach but overuse reduces efficacy' },
  { id: 2, element: 'Caption', expectedCritique: 'Concise is optimal; lengthy captions lose attention' },
  { id: 3, element: 'Emoji', expectedCritique: 'Enhances tone but excess appears unprofessional' },
  { id: 4, element: 'Call-to-Action', expectedCritique: 'Direct CTAs convert; vague ones fail' },
  { id: 5, element: 'Tagging', expectedCritique: 'Strategic tagging expands reach; random tagging annoys' },
  { id: 6, element: 'Viral Content', expectedCritique: 'Highly desirable but largely unpredictable' }
]

export default function Phase4_2Step3RemedialC1TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/3/remedial/c1/taskE') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleCritiqueChange = (id, text) => {
    setCritiques({ ...critiques, [id]: text })
  }

  const evaluateCritique = (userCritique, element) => {
    const critique = userCritique.toLowerCase()
    const positiveIndicators = ['powerful', 'effective', 'enhances', 'optimal', 'desirable', 'strategic', 'expands', 'converts']
    const negativeIndicators = ['overuse', 'excess', 'lengthy', 'vague', 'random', 'unpredictable', 'fails', 'reduces', 'lose']
    const balanceIndicators = ['but', 'however', 'although', 'yet', 'while']
    const hasPositive = positiveIndicators.some(word => critique.includes(word))
    const hasNegative = negativeIndicators.some(word => critique.includes(word))
    const hasBalance = balanceIndicators.some(word => critique.includes(word))
    return (hasPositive && hasNegative) || hasBalance
  }

  const handleSubmit = () => {
    let correctCount = 0
    ELEMENTS.forEach(element => {
      const userCritique = critiques[element.id] || ''
      if (evaluateCritique(userCritique, element.element)) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase4_2_step3_c1_taskD_score', correctCount)
    logTaskCompletion(correctCount, ELEMENTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', task: 'D', score: score, max_score: maxScore, critiques: critiques })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/taskE')
  }

  const allCompleted = ELEMENTS.every(element => {
    const critique = critiques[element.id] || ''
    return critique.trim().split(/\s+/).filter(w => w.length > 0).length >= 8
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard('orange'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 4.2 · Step 3 · Level C1 · Task D
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>
              Critique Kahoot
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Provide nuanced, balanced critiques of 6 social media elements. Each critique should acknowledge both strengths and limitations. Demonstrate sophisticated analytical thinking by examining multiple perspectives. Avoid one-sided judgments!"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ ...clayCard('yellow'), mb: 3 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: P.yellow.border }}>Instructions:</Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 0.5 }}>
              Write balanced critiques for each element (minimum 8 words each). Include both positive aspects and limitations.
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 1 }}>
              <strong>Critique structure:</strong> [Positive aspect] + [Transition word like 'but', 'however'] + [Limitation or caveat]
            </Typography>
          </Box>

          {/* Example Critiques */}
          <Box sx={{ ...clayCard('green'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border, mb: 2 }}>
              Example Balanced Critiques:
            </Typography>
            {ELEMENTS.map((element, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2, color: isDark ? '#ccc' : '#333' }}>
                <strong>{element.element}:</strong> {element.expectedCritique}
              </Typography>
            ))}
          </Box>

          {/* Critique Tasks */}
          <Box sx={{ mb: 3 }}>
            {ELEMENTS.map((element, index) => {
              const wordCount = (critiques[element.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
              const isBalanced = showResults && evaluateCritique(critiques[element.id] || '', element.element)

              return (
                <Box key={element.id} sx={{ ...clayCard('purple'), mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border, mb: 2 }}>
                    Element {index + 1} of {ELEMENTS.length}
                  </Typography>

                  <Box sx={{ bgcolor: isDark ? '#1a1a2e' : P.blue.bg, borderRadius: '12px', p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark ? '#ccc' : '#1a252f' }}>
                      Critique: {element.element}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>
                      Provide a balanced analysis that examines both strengths and limitations
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={critiques[element.id] || ''}
                    onChange={(e) => handleCritiqueChange(element.id, e.target.value)}
                    placeholder="Write a balanced critique that acknowledges both positive aspects and limitations..."
                    variant="outlined"
                    disabled={showResults}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? '#1a1a2e' : 'white',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                        '&:hover fieldset': { borderColor: P.purple.shadow },
                        '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                        '& textarea': { color: isDark ? '#eee' : '#1a252f' }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: wordCount >= 8 ? P.green.border : (isDark ? '#aaa' : '#666'), fontWeight: wordCount >= 8 ? 'bold' : 'normal' }}>
                    Words: {wordCount} {wordCount >= 8 && '✓'}
                  </Typography>

                  {showResults && (
                    <Box sx={{ ...clayCard(isBalanced ? 'green' : 'teal'), mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {isBalanced && <CheckCircleIcon sx={{ color: P.green.border, fontSize: 18 }} />}
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isBalanced ? P.green.border : P.teal.border }}>
                          {isBalanced ? 'Well-balanced critique!' : 'Example balanced critique:'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: isDark ? '#ddd' : '#333' }}>{element.expectedCritique}</Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{ ...clayCard(score >= 5 ? 'green' : 'yellow'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: score >= 5 ? P.green.border : P.yellow.border, mb: 1 }}>
                Critique Task Complete!
              </Typography>
              <Typography sx={{ color: isDark ? '#ddd' : '#333' }}>
                You provided {score}/{ELEMENTS.length} balanced critiques ({((score / ELEMENTS.length) * 100).toFixed(0)}%)
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#bbb' : '#555', mt: 1 }}>
                {score >= 5 ? 'Excellent nuanced analysis with balanced perspectives!' : 'Try to include both strengths and limitations in each critique.'}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {!showResults && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allCompleted}
                sx={{
                  ...clayCard('purple'),
                  cursor: allCompleted ? 'pointer' : 'not-allowed',
                  opacity: allCompleted ? 1 : 0.5,
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.purple.border,
                  display: 'inline-block',
                  '&:hover': allCompleted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                Submit Critiques
              </Box>
            )}
            {showResults && (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task E <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

          {!showResults && !allCompleted && (
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', textAlign: 'center', mt: 2 }}>
              Please complete all critiques (minimum 8 words each)
            </Typography>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
