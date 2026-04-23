import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Container, Stack } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level C1 - Task D: Critique Game
 * Critique 6 post elements with nuanced analysis
 */

const POST_ELEMENTS = [
  { id: 1, element: 'Hashtag Strategy', description: 'Using #food #yummy #delicious #tasty #foodie #instafood #foodporn #foodstagram #foodlover #foodgasm', prompt: 'Critique this hashtag strategy with nuanced analysis:' },
  { id: 2, element: 'Caption', description: 'Check out this event! It will be awesome. Come join us.', prompt: 'Critique this caption and suggest improvements:' },
  { id: 3, element: 'Emoji Usage', description: 'Global Cultures Festival 😀😀😀😀😀😀😀😀😀😀', prompt: 'Critique this emoji usage and suggest better alternatives:' },
  { id: 4, element: 'Call-to-Action', description: 'Maybe you could come if you want to.', prompt: 'Critique this call-to-action and rewrite it more effectively:' },
  { id: 5, element: 'Tagging Strategy', description: 'No user tags or location tags included in the post.', prompt: 'Critique this lack of tagging and explain its impact:' },
  { id: 6, element: 'Overall Post Coherence', description: 'A post with great visuals but generic caption, random hashtags, excessive emojis, weak CTA, and no tags.', prompt: 'Provide a comprehensive critique of this post structure:' }
]

export default function Phase4_2Step2RemedialC1TaskD() {
  const navigate = useNavigate()
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleCritiqueChange = (id, text) => { setCritiques({ ...critiques, [id]: text }) }

  const handleSubmit = () => {
    setShowResults(true)
    let totalScore = 0
    POST_ELEMENTS.forEach(element => {
      const critique = critiques[element.id] || ''
      const wordCount = critique.trim().split(/\s+/).filter(w => w.length > 0).length
      totalScore += Math.min(wordCount / 30, 1.67)
    })
    const finalScore = Math.min(totalScore, 10)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskD_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskD_max', '10')
    logTaskCompletion(finalScore, 10)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'D', score: score, max_score: maxScore, critiques: critiques })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase4_2/step/2/remedial/c1/taskE') }

  const allCompleted = POST_ELEMENTS.every(element => {
    const critique = critiques[element.id] || ''
    return critique.trim().split(/\s+/).filter(w => w.length > 0).length >= 25
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>
              Level C1 - Task D: Critique Game
            </Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Demonstrate your mastery by providing nuanced critiques of these Instagram post elements. Analyze each element critically, identify weaknesses, and suggest sophisticated improvements. This requires advanced analytical thinking and deep understanding of social media strategy."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              <strong>Instructions:</strong> Critique each of the 6 post elements with detailed, nuanced analysis (minimum 25 words each).
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}>
              <strong>What to include:</strong> Identify weaknesses, explain impact on engagement, suggest specific improvements, and justify your recommendations.
            </Typography>
          </Box>

          {/* Critique Tasks */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            {POST_ELEMENTS.map((element, index) => {
              const wordCount = (critiques[element.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
              const isReady = wordCount >= 25
              return (
                <Box key={element.id} sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                    Element {index + 1} of {POST_ELEMENTS.length}: {element.element}
                  </Typography>

                  <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: P.orange.shadow, display: 'block', mb: 1 }}>
                      POST ELEMENT TO CRITIQUE:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.orange.shadow }}>
                      {element.description}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}>
                    {element.prompt}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={4}
                    value={critiques[element.id] || ''}
                    onChange={(e) => handleCritiqueChange(element.id, e.target.value)}
                    placeholder="Write your detailed critique here... Identify specific weaknesses, analyze the impact on engagement and reach, and suggest concrete improvements with justification."
                    variant="outlined" disabled={showResults}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDark ? '#1a1a2e' : 'white',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: isReady ? P.green.border : P.yellow.border },
                        '& textarea': { color: isDark ? '#eee' : '#1a252f' }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: isReady ? P.green.shadow : (isDark ? '#aaa' : '#666'), fontWeight: isReady ? 'bold' : 'normal' }}>
                    Words: {wordCount} {isReady && '✓'}
                  </Typography>
                </Box>
              )
            })}
          </Stack>

          {/* Results */}
          {showResults && (
            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.green.shadow }}>
                Critique Task Complete!
              </Typography>
              <Typography sx={{ color: P.green.shadow }}>
                You've provided nuanced critiques for all {POST_ELEMENTS.length} post elements. Excellent demonstration of advanced analytical thinking and social media strategy expertise!
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allCompleted} sx={{
                bgcolor: allCompleted ? P.green.bg : P.blue.bg,
                border: `2px solid ${allCompleted ? P.green.border : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${allCompleted ? P.green.shadow : P.blue.shadow}`,
                px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: allCompleted ? 'pointer' : 'not-allowed',
                color: allCompleted ? P.green.shadow : P.blue.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': allCompleted ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
              }}>
                Submit Critiques
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.blue.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
              }}>
                <ArrowForwardIcon /> Continue to Task E
              </Box>
            )}
            {!showResults && !allCompleted && (
              <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', textAlign: 'center' }}>
                Please complete all critiques (minimum 25 words each)
              </Typography>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
