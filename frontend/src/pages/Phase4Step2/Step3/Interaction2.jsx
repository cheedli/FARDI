import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Link
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step3Interaction2() {
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

  const [ctaExplanation, setCtaExplanation] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!ctaExplanation.trim()) {
      setFeedback('Please enter your explanation of "call-to-action".')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step3/evaluate-cta-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ explanation: ctaExplanation })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        sessionStorage.setItem('phase4_2_step3_int2_score', data.score.toString())
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step3_score') || '0')
        sessionStorage.setItem('phase4_2_step3_score', (currentScore + data.score).toString())
      } else {
        setFeedback(data.error || 'Evaluation failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/interaction/3')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Interaction 2: Understanding Call-to-Action
            </Typography>
          </Box>

          {/* Character Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              character="Lilia"
              message="Now watch these two real social media post examples (first Instagram festival post, then Twitter/X thread). Listen for: hashtag strategy, emoji use, call-to-action, tag, viral potential, engagement. After watching, explain 'call-to-action' (CTA) in social media posts."
            />
          </Box>

          {/* Video Resources */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>
              Video Resources
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Example 1: Instagram Festival Post
              </Typography>
              <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px', border: `1px solid ${P.orange.border}` }}>
                <Link
                  href="https://www.instagram.com/p/examplefestivalcaption/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '1rem' }}
                >
                  View Instagram Post with Hashtags & Emojis
                </Link>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Instagram caption with hashtags & emojis
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Example 2: Twitter/X Thread
              </Typography>
              <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px', border: `1px solid ${P.orange.border}` }}>
                <Link
                  href="https://twitter.com/example/status/examplethread"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '1rem' }}
                >
                  View Twitter Thread with CTA & Tagging
                </Link>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Twitter thread with CTA & tagging
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Listen for:</strong> hashtag strategy, emoji use, call-to-action, tag, viral potential, engagement
            </Typography>
          </Box>

          {/* Task */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.blue.shadow }}>
              Your Task
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              After watching both examples, define "call-to-action" (CTA) and describe its purpose, using examples from the videos/posts.
            </Typography>

            <Box component="span" sx={{
              bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
              borderRadius: '999px', px: 2, py: 0.5,
              fontSize: '0.85rem', fontWeight: 700, color: P.yellow.shadow,
              display: 'inline-block', mb: 2
            }}>
              Hint: Include "It tells people to..." and reference one example (e.g., "Join us!").
            </Box>

            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              label="Explain 'call-to-action' (CTA) in social media posts"
              placeholder="A call-to-action is..."
              value={ctaExplanation}
              onChange={(e) => setCtaExplanation(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={handleSubmit}
                disabled={loading || submitted || !ctaExplanation.trim()}
                sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: (loading || submitted || !ctaExplanation.trim()) ? 'not-allowed' : 'pointer',
                  color: P.orange.shadow, opacity: (loading || submitted || !ctaExplanation.trim()) ? 0.5 : 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
                }}>
                {loading ? <CircularProgress size={24} /> : 'Submit Explanation'}
              </Box>
            </Box>
          </Box>

          {/* Feedback */}
          {feedback && (
            <Box sx={{
              bgcolor: score >= 3 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 3 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 3 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Evaluation Results
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Score:</strong> {score}/5 points
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>CEFR Level:</strong> {level}
              </Typography>
              <Typography variant="body1">
                <strong>Feedback:</strong> {feedback}
              </Typography>
            </Box>
          )}

          {/* Continue */}
          {submitted && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Interaction 3
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step3Interaction2
