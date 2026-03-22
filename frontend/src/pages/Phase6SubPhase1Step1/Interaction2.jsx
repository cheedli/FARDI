import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Stack
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1: Engage
 * Interaction 2: Festival Reflection Writing
 * Write 3-5 sentences about what went well and what was challenging
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const TARGET_VOCABULARY = [
  'success', 'challenge', 'achievement', 'strength', 'weakness', 'positive', 'negative'
]

const PAST_TENSE_VERBS = [
  'was', 'were', 'had', 'achieved', 'faced', 'improved', 'learned',
  'helped', 'went', 'showed', 'provided', 'worked', 'felt', 'made'
]

function fallbackEvaluate(text) {
  const textLower = text.toLowerCase()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length

  const pastTenseCount = PAST_TENSE_VERBS.filter(v => textLower.includes(v)).length
  const vocabCount = TARGET_VOCABULARY.filter(v => textLower.includes(v)).length
  const sentenceCount = sentences.length

  const hasSuccess = textLower.includes('success') || textLower.includes('well') ||
                     textLower.includes('positive') || textLower.includes('achievement') ||
                     textLower.includes('strength')
  const hasChallenge = textLower.includes('challenge') || textLower.includes('difficult') ||
                       textLower.includes('problem') || textLower.includes('weakness') ||
                       textLower.includes('negative')

  let score = 1
  let level = 'A2'
  let feedback = ''
  let strengths = []
  let improvements = []

  if (
    wordCount >= 40 && sentenceCount >= 4 && pastTenseCount >= 4 &&
    vocabCount >= 4 && hasSuccess && hasChallenge
  ) {
    score = 4
    level = 'C1'
    feedback = 'Excellent reflection! Your writing demonstrates sophisticated language use with varied past tense, rich evaluation vocabulary, and a balanced analysis of successes and challenges.'
    strengths = ['Sophisticated vocabulary range', 'Strong past tense usage', 'Well-balanced reflection with both successes and challenges']
    improvements = ['Consider adding specific evidence or examples to support your points']
  } else if (
    wordCount >= 25 && sentenceCount >= 3 && pastTenseCount >= 3 &&
    vocabCount >= 3 && hasSuccess && hasChallenge
  ) {
    score = 3
    level = 'B2'
    feedback = 'Very good reflection! You have written clearly about both successes and challenges using past tense and evaluation vocabulary.'
    strengths = ['Good use of past tense', 'Covers both success and challenge', 'Clear evaluation language']
    improvements = ['Try to add more specific vocabulary like "achievement" or "strength"', 'Aim for more varied sentence structures']
  } else if (
    wordCount >= 15 && sentenceCount >= 3 && pastTenseCount >= 2 &&
    vocabCount >= 2 && (hasSuccess || hasChallenge)
  ) {
    score = 2
    level = 'B1'
    feedback = 'Good reflection! You have written some sentences about the festival using past tense. Try to include both a success and a challenge in your reflection.'
    strengths = ['Uses past tense correctly', 'Shows understanding of reflection writing']
    improvements = ['Include both a success AND a challenge', 'Use more evaluation vocabulary', 'Aim for at least 3-5 sentences']
  } else if (wordCount >= 5 && sentenceCount >= 1) {
    score = 1
    level = 'A2'
    feedback = 'You have started your reflection. Keep going! Try to write more sentences about what went well and what was challenging during the festival.'
    strengths = ['Made an attempt at reflection writing']
    improvements = ['Write at least 3 sentences', 'Use past tense (was, were, had, achieved)', 'Include a success and a challenge']
  }

  return { score, level, feedback, strengths, improvements }
}

export default function Phase6SP1Step1Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'main' })
  const [reflection, setReflection] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const wordCount = reflection.split(/\s+/).filter(w => w.length > 0).length
  const vocabUsed = TARGET_VOCABULARY.filter(v => reflection.toLowerCase().includes(v))

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your reflection before submitting.',
        strengths: [],
        improvements: ['Write at least 3 sentences about the festival']
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase6API.evaluateReflection61(reflection.trim())

      if (result && result.data) {
        const data = result.data
        const evalResult = {
          success: true,
          score: data.score || 1,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          strengths: data.strengths || [],
          improvements: data.improvements || []
        }
        setEvaluation(evalResult)
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step1_interaction2_score', evalResult.score.toString())
        sessionStorage.setItem('phase6_sp1_step1_interaction2_level', evalResult.level)
      } else if (result && result.score !== undefined) {
        const evalResult = {
          success: true,
          score: result.score || 1,
          level: result.level || 'A2',
          feedback: result.feedback || 'Good work!',
          strengths: result.strengths || [],
          improvements: result.improvements || []
        }
        setEvaluation(evalResult)
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step1_interaction2_score', evalResult.score.toString())
        sessionStorage.setItem('phase6_sp1_step1_interaction2_level', evalResult.level)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const fallback = fallbackEvaluate(reflection)
      setEvaluation({ success: fallback.score > 0, ...fallback })
      setSubmitted(fallback.score > 0)
      if (fallback.score > 0) {
        sessionStorage.setItem('phase6_sp1_step1_interaction2_score', fallback.score.toString())
        sessionStorage.setItem('phase6_sp1_step1_interaction2_level', fallback.level)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/1/interaction/3')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 1: Engage - Interaction 2
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Share your festival reflection in writing
            </Typography>
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
              speaker="SKANDER"
              message="After the game, think about the festival: What was your favorite moment? What was difficult? How did it make you feel?"
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '16px',
            boxShadow: `3px 3px 0 ${P.blue.shadow}`,
            p: 2,
            mb: 3,
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start'
          }}>
            <InfoIcon sx={{ color: P.blue.border, mt: 0.3, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Instructions:
              </Typography>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                Share 3–5 sentences about one success and one challenge from the festival. Use past tense.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: P.blue.shadow }}>
                <strong>Hint:</strong> Start with "My favorite moment was…" or "The most difficult part was… because…"
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Vocabulary Reference */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.teal.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.teal.shadow }}>
                Target Vocabulary
              </Typography>
            </Box>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {TARGET_VOCABULARY.map((term, idx) => (
                <Box
                  key={idx}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: vocabUsed.includes(term) ? P.green.bg : 'transparent',
                    border: `2px solid ${vocabUsed.includes(term) ? P.green.border : P.teal.border}`,
                    borderRadius: '12px',
                    boxShadow: `2px 2px 0 ${vocabUsed.includes(term) ? P.green.shadow : P.teal.shadow}`,
                    fontWeight: 'bold',
                    color: vocabUsed.includes(term) ? P.green.shadow : P.teal.shadow,
                    transition: 'all 0.15s'
                  }}
                >
                  {term}
                </Box>
              ))}
            </Stack>
            {vocabUsed.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1, color: P.teal.shadow }}>
                Using {vocabUsed.length} / {TARGET_VOCABULARY.length} target words
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Writing Area */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Your Festival Reflection
            </Typography>

            <Box sx={{
              bgcolor: P.yellow.bg,
              border: `2px solid ${P.yellow.border}`,
              borderRadius: '12px',
              p: 2,
              mb: 2
            }}>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                <strong>Assessment Focus:</strong> Past tense usage, evaluation vocabulary,
                balanced reflection (success + challenge), sentence count (3-5 sentences)
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="My favorite moment was the traditional dances because they were beautiful. The most difficult part was the lighting problem, but we fixed it. I felt proud of what our team achieved..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Words: {wordCount} | Vocabulary used: {vocabUsed.length}/{TARGET_VOCABULARY.length}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: wordCount >= 25 ? P.green.shadow : 'text.secondary' }}
              >
                {wordCount >= 25 ? 'Good length!' : `Aim for at least 25 words`}
              </Typography>
            </Box>

            {!submitted && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !reflection.trim()}
                sx={{
                  cursor: loading || !reflection.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !reflection.trim() ? 0.6 : 1,
                  width: '100%',
                  py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  '&:hover': { transform: loading || !reflection.trim() ? 'none' : 'translate(-2px,-2px)', boxShadow: loading || !reflection.trim() ? `4px 4px 0 ${P.green.shadow}` : `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                {loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                {loading ? 'Evaluating...' : 'Submit Reflection'}
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Evaluation Results */}
        {evaluation && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.orange.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.orange.shadow}`,
              p: 3,
              mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 40,
                    color: evaluation.success ? P.green.border : P.orange.border,
                    mr: 2
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.shadow : P.orange.shadow }}>
                    {evaluation.success ? 'Reflection Evaluated!' : 'Keep Trying'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: {evaluation.score}/4
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {evaluation.feedback}
              </Typography>

              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
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
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
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
                    cursor: 'pointer',
                    width: '100%',
                    py: 1.5,
                    mt: 2,
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
                  Continue to Interaction 3
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
