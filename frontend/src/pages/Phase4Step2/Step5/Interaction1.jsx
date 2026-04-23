import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Box, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step5Interaction1() {
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

  const [faultyPost, setFaultyPost] = useState('')
  const [correctedPost, setCorrectedPost] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const userLevel = sessionStorage.getItem('user_level') || 'B1'
    setLevel(userLevel)

    const faultyPosts = {
      A2: "Festival is fun. Come March 8. #Globol #Festivel",
      B1: "Join Globel Cultures Festival! Music food dance. Tag frend! #Festival #Fun",
      B2: "Ready for world tour? Globel Cultures Festival March 8. Tag freinds! #GlobalCulturesFest #TunisEvnts",
      C1: "Immerse yourself in globel unity: Global Cultures Festival March 8. Tag felllow explorers. #GlobalCulturesFestival #DiversityInAction"
    }

    setFaultyPost(faultyPosts[userLevel] || faultyPosts.B1)
  }, [])

  const handleSubmit = async () => {
    if (!correctedPost.trim()) {
      setFeedback('Please enter your spelling-corrected version.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step5/evaluate-spelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_post: faultyPost,
          corrected_post: correctedPost,
          level: level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setFeedback(data.feedback)
        setSubmitted(true)

        sessionStorage.setItem('phase4_2_step5_spelling_corrected', correctedPost)
        sessionStorage.setItem('phase4_2_step5_int1_score', data.score.toString())
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step5_score') || '0')
        sessionStorage.setItem('phase4_2_step5_score', (currentScore + data.score).toString())
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
    navigate('/phase4_2/step/5/interaction/2')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Interaction 1: Spelling Correction
            </Typography>
          </Box>

          <CharacterMessage
            character="MS. MABROUKI"
            message="Here are faulty social media posts with mistakes. First, focus only on spelling mistakes—correct them."
          />

          <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.red.shadow, mb: 2 }}>
              Faulty Post (Contains Spelling Errors)
            </Typography>
            <Box sx={{ p: 2, bgcolor: isDark ? '#1a0000' : 'white', border: `2px solid ${P.red.border}`, borderRadius: '12px' }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {faultyPost}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.teal.shadow, mb: 2 }}>
              Your Task: Correct Spelling Mistakes Only
            </Typography>
            <Typography variant="body1" paragraph>
              Carefully read the faulty post above and correct all spelling mistakes. Focus only on misspelled words—don't change grammar or structure yet.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Spelling-Corrected Post"
              placeholder="Type your spelling-corrected version here..."
              value={correctedPost}
              onChange={(e) => setCorrectedPost(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={handleSubmit} disabled={loading || submitted || !correctedPost.trim()} sx={{
                bgcolor: (loading || submitted || !correctedPost.trim()) ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                border: `2px solid ${(loading || submitted || !correctedPost.trim()) ? '#999' : P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${(loading || submitted || !correctedPost.trim()) ? '#999' : P.orange.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (loading || submitted || !correctedPost.trim()) ? 'not-allowed' : 'pointer',
                color: (loading || submitted || !correctedPost.trim()) ? '#999' : P.orange.shadow,
                minWidth: 150,
                '&:hover': !loading && !submitted && correctedPost.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                '&:active': !loading && !submitted && correctedPost.trim() ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
              }}>
                {loading ? <CircularProgress size={24} /> : 'Submit Correction'}
              </Box>
            </Box>
          </Box>

          {feedback && (
            <Box sx={{ bgcolor: score >= 3 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 3 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 3 ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: score >= 3 ? P.green.shadow : P.yellow.shadow }}>
                Evaluation Results
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Score:</strong> {score}/5 points
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Level:</strong> {level}
              </Typography>
              <Typography variant="body1">
                <strong>Feedback:</strong> {feedback}
              </Typography>
            </Box>
          )}

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
                Continue to Grammar Correction
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step5Interaction1
