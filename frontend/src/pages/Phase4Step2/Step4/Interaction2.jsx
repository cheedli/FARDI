import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step4Interaction2() {
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

  const [tweet1, setTweet1] = useState('')
  const [tweet2, setTweet2] = useState('')
  const [tweet3, setTweet3] = useState('')
  const [tweet4, setTweet4] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!tweet1.trim() || !tweet2.trim()) {
      setFeedback('Please write at least the first 2 tweets.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const tweets = [tweet1, tweet2, tweet3, tweet4].filter(t => t.trim())
      const response = await fetch('/api/phase4/4_2/step4/evaluate-twitter-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweets })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        sessionStorage.setItem('phase4_2_step4_twitter_thread', JSON.stringify(tweets))
        sessionStorage.setItem('phase4_2_step4_int2_score', data.score.toString())
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')
        sessionStorage.setItem('phase4_2_step4_score', (currentScore + data.score).toString())
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
    navigate('/phase4_2/step/4/interaction/3')
  }

  const tweetFields = [
    { label: 'Tweet 1', value: tweet1, setter: setTweet1, required: true, placeholder: '🚨 Global Cultures Festival is almost here! 🌍 March 8 – Student Center 1/3' },
    { label: 'Tweet 2', value: tweet2, setter: setTweet2, required: true, placeholder: 'Live music, traditional dances, global food & workshops await! 2/3' },
    { label: 'Tweet 3', value: tweet3, setter: setTweet3, required: false, placeholder: 'Tag friends & join us! RSVP in bio. #GlobalCulturesFest 3/3' },
    { label: 'Tweet 4', value: tweet4, setter: setTweet4, required: false, placeholder: 'Can\'t wait to celebrate diversity together! ❤️' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Interaction 2: Write a Twitter/X Thread
            </Typography>
          </Box>

          <CharacterMessage
            character="Emna"
            message="Now, write a short Twitter/X thread (2-4 tweets) using this guided template with examples."
          />

          {/* Template */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.teal.shadow }}>
              Twitter/X Thread Template
            </Typography>
            {[
              { label: 'Tweet 1 (Hook/Announcement): Exciting news about the festival!', example: 'Example: 🚨 Global Cultures Festival is almost here! 🌍 March 8 – Student Center 1/3' },
              { label: 'Tweet 2 (Details): Describe main attractions.', example: 'Example: Live music, traditional dances, global food & workshops await! 2/3' },
              { label: 'Tweet 3 (Call-to-Action + Tag): Tell people what to do.', example: 'Example: Tag friends & join us! RSVP in bio. #GlobalCulturesFest 3/3' },
              { label: 'Tweet 4 (optional Closing): Final reminder or emotion.', example: 'Example: Can\'t wait to celebrate diversity together! ❤️' },
            ].map(({ label, example }, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.teal.shadow }}>{label}</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.teal.border, ml: 2 }}>{example}</Typography>
              </Box>
            ))}
          </Box>

          {/* Hint */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>
              Hint: Use thread numbering (1/4, 2/4) and include hashtags/CTA.
            </Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
              Check for grammar (tense consistency), spelling, and structure (tweet length ~280 chars, logical sequence).
            </Typography>
          </Box>

          {/* Tweet Fields */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>
              Your Twitter/X Thread
            </Typography>

            {tweetFields.map(({ label, value, setter, required, placeholder }, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{
                    bgcolor: required ? P.blue.bg : P.purple.bg,
                    border: `2px solid ${required ? P.blue.border : P.purple.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700,
                    color: required ? P.blue.shadow : P.purple.shadow,
                    display: 'inline-block', mr: 1,
                  }}>{label}</Box>
                  <Typography variant="body2" color="text.secondary">
                    {required ? 'Required' : 'Optional'} • {value.length}/280 chars
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  disabled={submitted}
                  error={value.length > 280}
                />
              </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || submitted || !tweet1.trim() || !tweet2.trim() || tweet1.length > 280 || tweet2.length > 280}
                sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: loading || submitted || !tweet1.trim() || !tweet2.trim() ? 'not-allowed' : 'pointer',
                  color: P.orange.shadow,
                  opacity: loading || submitted || !tweet1.trim() || !tweet2.trim() ? 0.5 : 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Thread'}
              </Box>
            </Box>
          </Box>

          {feedback && (
            <Box sx={{
              bgcolor: score >= 4 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 4 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= 4 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 4 ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                Evaluation Results
              </Typography>
              <Typography variant="body1" paragraph><strong>Score:</strong> {score}/5 points</Typography>
              <Typography variant="body1" paragraph><strong>CEFR Level:</strong> {level}</Typography>
              <Typography variant="body1"><strong>Feedback:</strong> {feedback}</Typography>
            </Box>
          )}

          {submitted && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 6, py: 2, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}
              >
                Continue to Interaction 3
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step4Interaction2
