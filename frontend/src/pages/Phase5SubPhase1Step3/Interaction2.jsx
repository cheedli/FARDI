import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress, Link } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import ArticleIcon from '@mui/icons-material/Article'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const EXPECTED_EXAMPLES = {
  A2: 'Transparent is tell truth.',
  B1: 'Transparent communication means telling people the truth about the problem and what we are doing, like the Twitter post said "lights broken but we fix soon" because it makes people not worried.',
  B2: 'Transparent communication involves openly sharing accurate information about the crisis (problem + actions being taken), as seen in the Twitter update that clearly stated the issue and resolution timeline, because it builds trust and reduces anxiety.',
  C1: 'Transparent communication in crisis situations entails full, timely, and honest disclosure of the issue, response measures, and expected outcomes (e.g., "technical failure - backup lighting activated - event proceeds in 25 minutes"), as both examples demonstrate, thereby mitigating misinformation, preserving stakeholder trust, and transforming potential disruption into an opportunity for demonstrating reliability and accountability.'
}

const EXAMPLE_LINKS = [
  { url: 'https://www.sendible.com/insights/your-guide-to-social-media-crisis-management', label: 'Example 1: Social Media Crisis Management Guide' },
  { url: 'https://theeventscalendar.com/blog/event-cancellation-announcement-examples/', label: 'Example 2: Event Cancellation Announcement Examples' }
]

export default function Phase5Step3Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 2, context: 'main' })
  const [examplesRead, setExamplesRead] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleExamplesReady = () => {
    setExamplesRead(true)
  }

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please explain transparent communication.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateTransparent(explanation.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          example_reference_detected: data.example_reference_detected || false,
          purpose_explained: data.purpose_explained || false
        })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step3_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step3_interaction2_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const explanationLower = explanation.toLowerCase()
      const wordCount = explanation.split(/\s+/).length
      const hasTransparent = explanationLower.includes('transparent')
      const hasTruth = ['truth', 'honest', 'open'].some(w => explanationLower.includes(w))
      const hasExample = ['twitter', 'email', 'example', 'text', 'post'].some(w => explanationLower.includes(w))
      const hasPurpose = ['trust', 'panic', 'worried', 'anxiety', 'because'].some(w => explanationLower.includes(w))
      let score = 2, level = 'A2'
      if (wordCount <= 5 && hasTransparent && hasTruth) { score = 2; level = 'A2' }
      else if (wordCount <= 25 && hasTransparent && hasTruth && hasExample) { score = 3; level = 'B1' }
      else if (wordCount <= 50 && hasTransparent && hasTruth && hasExample && hasPurpose) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your explanation shows ${level} level understanding.`, example_reference_detected: hasExample, purpose_explained: hasPurpose })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step3_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step3_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/interaction/3')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 3: Explain - Interaction 2
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explain 'transparent' communication in a crisis
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Lilia"
              message="Now read these two real crisis communication examples. Listen for: transparent, reassure, immediate, resolve, communicate, update. After reading, explain 'transparent' communication in a crisis."
            />
          </Box>
        </motion.div>

        {!examplesRead && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArticleIcon sx={{ fontSize: 36, color: P.orange.border, mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.orange.border }}>
                  Step 1: Read Examples
                </Typography>
              </Box>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Read these examples of crisis communication. Look for: transparent, reassure, immediate, resolve, communicate, update.
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={2}>
                {EXAMPLE_LINKS.map((example, idx) => (
                  <Link key={idx} href={example.url} target="_blank" rel="noopener noreferrer" underline="none">
                    <Box sx={{
                      ...cardSx(P.blue),
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                    }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: P.blue.border }}>{example.label} →</Typography>
                    </Box>
                  </Link>
                ))}
              </Stack>
              <Box
                component="button"
                onClick={handleExamplesReady}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                I've Read the Examples - Continue
              </Box>
            </Box>
          </motion.div>
        )}

        {examplesRead && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 2: Explain 'Transparent' Communication
              </Typography>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: P.teal.border }}>
                    Define 'transparent' communication and describe its purpose, using examples from the texts. Include "It means tell truth..." and reference one example (e.g., "We tell you the problem and solution").
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ...cardSx(P.yellow), mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.yellow.border }}>
                  Expected Response Examples (by level):
                </Typography>
                <Stack spacing={1}>
                  {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                    <Box key={level}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{level}:</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }} color="text.secondary">"{example}"</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                placeholder="Write your explanation of 'transparent' communication here, referencing the examples..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !explanation.trim()}
                sx={{
                  width: '100%',
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  py: 1.5,
                  cursor: loading || !explanation.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.orange.border,
                  opacity: loading || !explanation.trim() ? 0.6 : 1,
                  '&:hover': !loading && explanation.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} />}
                {loading ? 'Evaluating...' : 'Submit Explanation'}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(evaluation.success ? P.green : P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.yellow.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.border : P.yellow.border }}>
                    {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">{evaluation.feedback}</Typography>
              {evaluation.example_reference_detected && (
                <Box sx={{ ...cardSx(P.green), mb: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Great! You referenced examples from the texts.</Typography>
                </Box>
              )}
              {evaluation.purpose_explained && (
                <Box sx={{ ...cardSx(P.green), mb: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Excellent! You explained the purpose of transparent communication.</Typography>
                </Box>
              )}
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.green.border,
                  mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Interaction 3
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
