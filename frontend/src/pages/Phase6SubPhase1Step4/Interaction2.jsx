import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Stack,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 - Interaction 2
 * Write the Successes & Challenges section with specific evidence
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

const MINI_TEMPLATE = [
  {
    section: 'Successes',
    lines: [
      '1. [specific achievement with evidence — include numbers or names]',
      '2. [another achievement with details]'
    ]
  },
  {
    section: 'Challenges',
    lines: [
      '1. [specific challenge encountered — what happened and what was its impact]',
      '2. [another challenge with details]'
    ]
  }
]

const TARGET_VOCABULARY = [
  'achieved', 'accomplished', 'demonstrated', 'encountered', 'faced', 'overcome', 'despite'
]

const PAST_TENSE_VERBS = ['was', 'were', 'achieved', 'faced', 'had', 'encountered', 'accomplished',
  'demonstrated', 'overcame', 'resulted', 'attracted', 'exceeded', 'struggled', 'caused', 'impacted']

function fallbackEvaluate(text) {
  const lower = text.toLowerCase()
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length
  const pastTenseCount = PAST_TENSE_VERBS.filter(v => lower.includes(v)).length
  const hasSuccesses = lower.includes('success') || lower.includes('achieved') || lower.includes('accomplished')
  const hasChallenges = lower.includes('challenge') || lower.includes('faced') || lower.includes('encountered') || lower.includes('difficulty')
  const hasNumbers = /\d+/.test(text)
  const hasCapitalisedWords = (text.match(/\b[A-Z][a-z]+\b/g) || []).length > 2

  let score = 1
  if (pastTenseCount >= 2 && hasSuccesses && hasChallenges && wordCount >= 30) score = 2
  if (pastTenseCount >= 3 && hasSuccesses && hasChallenges && (hasNumbers || hasCapitalisedWords) && wordCount >= 50) score = 3
  if (pastTenseCount >= 4 && hasSuccesses && hasChallenges && hasNumbers && hasCapitalisedWords && wordCount >= 70) score = 4

  const levelMap = { 1: 'A2', 2: 'B1', 3: 'B2', 4: 'C1' }
  const feedbackMap = {
    1: 'Your writing covers the basics. Try to add more specific details and ensure you use past tense throughout.',
    2: 'Good effort! You have included successes and challenges. Add specific evidence such as numbers or names to strengthen your report.',
    3: 'Well done! Your section includes specific evidence. To reach C1 level, add more precise quantitative data and sophisticated language.',
    4: 'Excellent work! Your Successes & Challenges section is comprehensive, specific, and well-structured.'
  }

  return {
    score,
    level: levelMap[score],
    feedback: feedbackMap[score],
    strengths: pastTenseCount >= 2 ? ['Good use of past tense'] : [],
    improvements: wordCount < 50 ? ['Add more detail and specific evidence'] : []
  }
}

export default function Phase6SP1Step4Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'main' })
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      setEvaluation({ score: 1, level: 'A2', feedback: 'Please write your Successes & Challenges section before submitting.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase6API.evaluateSuccessesChallenges(trimmed)
      if (result && result.data) {
        const data = result.data
        const score = data.score || 2
        const level = data.level || 'B1'
        setEvaluation({
          score, level,
          feedback: data.feedback || 'Good work on your Successes & Challenges section.',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        sessionStorage.setItem('phase6_sp1_step4_interaction2_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step4_interaction2_level', level)
      } else {
        throw new Error('Invalid response')
      }
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const fallback = fallbackEvaluate(trimmed)
      setEvaluation(fallback)
      sessionStorage.setItem('phase6_sp1_step4_interaction2_score', fallback.score.toString())
      sessionStorage.setItem('phase6_sp1_step4_interaction2_level', fallback.level)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/4/interaction/3')
  }

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection & Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 4: Elaborate - Interaction 2
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Write the Successes &amp; Challenges Section
            </Typography>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{
                width: 50, height: 50, borderRadius: '50%',
                bgcolor: P.teal.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0
              }}>EM</Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Emna</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "Now, write the 'Successes &amp; Challenges' section using the guided template with examples.
                  Follow the template to write a balanced section describing 3 successes and 2-3 challenges with
                  how they were handled. Use past tense, balance positive and negative, and add simple evidence (numbers, quotes)."
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Mini Template */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Section Template</Typography>
            {MINI_TEMPLATE.map((part) => (
              <Box key={part.section} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.orange.border, mb: 0.5 }}>
                  {part.section}:
                </Typography>
                {part.lines.map((line, i) => (
                  <Typography
                    key={i} variant="body2"
                    sx={{
                      ml: 2, p: 0.75, mb: 0.5,
                      bgcolor: P.pageBg,
                      border: `1px dashed ${P.orange.border}`,
                      borderRadius: '8px',
                      fontStyle: 'italic'
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: P.teal.border, mr: 1 }} />
              <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>Writing Instructions:</Typography>
            </Box>
            <Typography variant="body2">• Write at least 2 successes and 2 challenges</Typography>
            <Typography variant="body2">• Use past tense throughout (e.g., "The event attracted...", "The team faced...")</Typography>
            <Typography variant="body2">• Include specific details: numbers (e.g., "500 attendees"), names (e.g., "the lighting team")</Typography>
          </Box>
        </motion.div>

        {/* Target Vocabulary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Try to use these vocabulary words:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {TARGET_VOCABULARY.map((word) => (
                <Box key={word} sx={{
                  px: 1.5, py: 0.5,
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px',
                  boxShadow: `2px 2px 0 ${P.blue.shadow}`,
                }}>
                  <Typography variant="body2" sx={{ color: P.blue.border }}>{word}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Writing Area */}
        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>
                Your Successes &amp; Challenges Section
              </Typography>

              <TextField
                fullWidth multiline rows={8} variant="outlined"
                placeholder={`Successes:\n1.\n2.\n\nChallenges:\n1.\n2. `}
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ color: wordCount >= 40 ? P.green.border : 'text.secondary' }}>
                  Word count: {wordCount} {wordCount >= 40 ? '(good length)' : '(aim for 40+ words)'}
                </Typography>
              </Box>

              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                sx={{
                  width: '100%', py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !text.trim()) ? 0.5 : 1,
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': (!loading && text.trim()) ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                {loading && <CircularProgress size={20} sx={{ color: P.green.border }} />}
                {loading ? 'Evaluating...' : 'Submit Section'}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Evaluation Results */}
        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: P.green.border }}>Section Evaluated!</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: {evaluation.score} / 4
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>

              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <Box sx={{ ...cardSx(P.green), mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">Strengths:</Typography>
                  {evaluation.strengths.map((s, i) => (
                    <Typography key={i} variant="body2">• {s}</Typography>
                  ))}
                </Box>
              )}

              {evaluation.improvements && evaluation.improvements.length > 0 && (
                <Box sx={{ ...cardSx(P.teal), mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">Areas to Improve:</Typography>
                  {evaluation.improvements.map((imp, i) => (
                    <Typography key={i} variant="body2">• {imp}</Typography>
                  ))}
                </Box>
              )}

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%', py: 1.5, mt: 2,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
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
