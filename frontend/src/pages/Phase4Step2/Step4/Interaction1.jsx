import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Divider
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step4Interaction1() {
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

  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!caption.trim() || !hashtags.trim()) {
      setFeedback('Please write both a caption and hashtags.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step4/evaluate-instagram-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, hashtags })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        sessionStorage.setItem('phase4_2_step4_instagram_caption', caption)
        sessionStorage.setItem('phase4_2_step4_instagram_hashtags', hashtags)
        sessionStorage.setItem('phase4_2_step4_int1_score', data.score.toString())
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
    navigate('/phase4_2/step/4/interaction/2')
  }

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
              Interaction 1: Write an Instagram Post
            </Typography>
          </Box>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="First, write an Instagram post (caption + hashtags) using this guided template with examples."
          />

          {/* Template */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.teal.shadow }}>
              Instagram Caption Template
            </Typography>

            {[
              { label: 'Sentence 1 (Hook/Opening): Start with something exciting about the festival.', example: 'Example: Get ready to travel the world without leaving Tunis! 🌍' },
              { label: 'Sentence 2-3 (Details/What to expect): Describe 2-3 main attractions.', example: 'Example: Enjoy live music, traditional dances, delicious international food, and cultural workshops.' },
              { label: 'Sentence 4 (Call-to-Action): Tell people what to do.', example: 'Example: Join us on March 8 at Student Center – tag a friend who loves culture!' },
              { label: 'Sentence 5 (Closing/Emotion): End with feeling or reminder.', example: 'Example: Don\'t miss this unforgettable day of global unity! ❤️' },
            ].map(({ label, example }, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.teal.shadow }}>{label}</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.teal.border, ml: 2 }}>{example}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.teal.shadow }}>
                Hashtags (5-10): Add relevant hashtags at the end.
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.teal.border, ml: 2 }}>
                Example: #GlobalCulturesFestival #Festival2025 #TunisEvents #CulturalCelebration #JoinUs
              </Typography>
            </Box>
          </Box>

          {/* Hint */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>
              Hint: Use the examples as models—change words, add your festival details.
            </Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
              Check for grammar (agreement, tense), spelling, and structure (flow, CTA placement) before submitting.
            </Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>
              Your Instagram Post
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              label="Instagram Caption (4-8 sentences)"
              placeholder="Get ready to travel the world without leaving Tunis! 🌍..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={submitted}
              sx={{ mb: 3 }}
              helperText={`${caption.split(/[.!?]+/).filter(s => s.trim()).length} sentences • ${caption.split(' ').filter(w => w).length} words`}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Hashtags (5-10 hashtags)"
              placeholder="#GlobalCulturesFestival #Festival2025 #TunisEvents..."
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              disabled={submitted}
              helperText={`${hashtags.split('#').filter(h => h.trim()).length - 1} hashtags`}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || submitted || !caption.trim() || !hashtags.trim()}
                sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: loading || submitted || !caption.trim() || !hashtags.trim() ? 'not-allowed' : 'pointer',
                  color: P.orange.shadow, opacity: loading || submitted || !caption.trim() || !hashtags.trim() ? 0.5 : 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Post'}
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
              <Typography variant="body1" paragraph>
                <strong>Score:</strong> {score}/5 points
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>CEFR Level:</strong> {level}
              </Typography>
              <Typography variant="body1">
                <strong>Feedback:</strong> {feedback}
              </Typography>
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
                Continue to Interaction 2
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step4Interaction1
