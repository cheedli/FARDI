import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Box, CircularProgress, Divider, Link } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { requestPhase42StepScore } from '../shared/routing.js'

function Phase4_2Step5Interaction3() {
  const navigate = useNavigate()
  useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/5/remedial/a2/taskA') }, [])
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

  const [grammarCorrectedPost, setGrammarCorrectedPost] = useState('')
  const [enhancedPost, setEnhancedPost] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const userLevel = sessionStorage.getItem('user_level') || 'B1'
    setLevel(userLevel)

    const grammarCorrected = sessionStorage.getItem('phase4_2_step5_grammar_corrected') || ''
    if (!grammarCorrected) {
      navigate('/phase4_2/step/5/interaction/2')
      return
    }
    setGrammarCorrectedPost(grammarCorrected)
  }, [navigate])

  const handleSubmit = async () => {
    if (!enhancedPost.trim()) {
      setFeedback('Please enter your enhanced version.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step5/evaluate-enhancement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grammar_corrected: grammarCorrectedPost,
          enhanced_post: enhancedPost,
          level: level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setFeedback(data.feedback)
        setSubmitted(true)

        sessionStorage.setItem('phase4_2_step5_final_post', enhancedPost)
        sessionStorage.setItem('phase4_2_step5_int3_score', data.score.toString())
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step5_score') || '0')
        const finalTotalScore = currentScore + data.score
        sessionStorage.setItem('phase4_2_step5_score', finalTotalScore.toString())
        setTotalScore(finalTotalScore)

        logInteraction(finalTotalScore)
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

  const logInteraction = async (finalScore) => {
    try {
      await fetch('/api/phase4/4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: '4.2',
          step: 5,
          interaction: 3,
          total_score: finalScore,
          max_score: 15,
          level: level
        })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleFinish = async () => {
    const int1Score = parseInt(sessionStorage.getItem('phase4_2_step5_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase4_2_step5_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step5_int3_score') || '0')

    try {
      const data = await requestPhase42StepScore(5, {
        interaction1_score: int1Score,
        interaction2_score: int2Score,
        interaction3_score: int3Score,
      })
      sessionStorage.setItem('phase4_2_step5_total_score', data.total.score.toString())
      sessionStorage.setItem('phase4_2_step5_total_max', data.total.max_score.toString())
      sessionStorage.setItem('phase4_2_step5_next_url', data.total.next_url)
      sessionStorage.setItem('phase4_2_step5_remedial_level', data.total.remedial_level)
      navigate(data.total.next_url)
    } catch (error) {
      console.error('Failed to calculate Phase 4.2 Step 5 routing:', error)
      alert('Unable to calculate the next route right now. Please try again.')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Interaction 3: Enhancement (Coherence, Tone, Vocabulary)
            </Typography>
          </Box>

          <CharacterMessage
            character="RYAN"
            message="Excellent grammar! Now, improve coherence/cohesion, tone, vocabulary, hashtags, emoji, and CTA in the corrected posts—reorder/add connectors/enhance words for better flow and engagement."
          />

          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.green.shadow, mb: 2 }}>
              Your Grammar-Corrected Post
            </Typography>
            <Box sx={{ p: 2, bgcolor: isDark ? '#001a00' : 'white', border: `2px solid ${P.green.border}`, borderRadius: '12px' }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {grammarCorrectedPost}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.orange.shadow, mb: 2 }}>
              Your Task: Enhance for Maximum Engagement
            </Typography>
            <Typography variant="body1" paragraph>
              Transform your grammar-corrected post into a compelling, engaging social media post by improving:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
              <Box>
                <Typography variant="body2">✓ Coherence &amp; Cohesion</Typography>
                <Typography variant="body2">✓ Tone &amp; Voice</Typography>
                <Typography variant="body2">✓ Vocabulary Richness</Typography>
              </Box>
              <Box>
                <Typography variant="body2">✓ Strategic Hashtags</Typography>
                <Typography variant="body2">✓ Engaging Emojis</Typography>
                <Typography variant="body2">✓ Strong Call-to-Action</Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Enhanced Post"
              placeholder="Type your enhanced, engaging version here..."
              value={enhancedPost}
              onChange={(e) => setEnhancedPost(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={handleSubmit} disabled={loading || submitted || !enhancedPost.trim()} sx={{
                bgcolor: (loading || submitted || !enhancedPost.trim()) ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${(loading || submitted || !enhancedPost.trim()) ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${(loading || submitted || !enhancedPost.trim()) ? '#999' : P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (loading || submitted || !enhancedPost.trim()) ? 'not-allowed' : 'pointer',
                color: (loading || submitted || !enhancedPost.trim()) ? '#999' : P.blue.shadow,
                minWidth: 150,
                '&:hover': !loading && !submitted && enhancedPost.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                '&:active': !loading && !submitted && enhancedPost.trim() ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` } : {}
              }}>
                {loading ? <CircularProgress size={24} /> : 'Submit Enhancement'}
              </Box>
            </Box>
          </Box>

          {feedback && (
            <Box sx={{ bgcolor: score >= 3 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 3 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 3 ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Evaluation Results
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Enhancement Score:</strong> {score}/5 points
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Total Score (All Steps):</strong> {totalScore}/15 points
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
            <>
              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.purple.shadow, mb: 2 }}>
                  Bonus Practice: Wordshake Game
                </Typography>
                <Typography variant="body1" paragraph>
                  Want to practice more vocabulary? Play the British Council Wordshake game to reinforce key social media terms!
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  <strong>Focus on these terms:</strong> strength, weakness, engagement, persuasive, viral
                </Typography>
                <Link
                  href="https://learnenglish.britishcouncil.org/games/wordshake"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '1rem', fontWeight: 'bold', color: P.purple.shadow }}
                >
                  Play Wordshake on British Council
                </Link>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Opens in new window
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: P.green.shadow }}>
                    Congratulations!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You've completed Phase 4.2 Step 5: Evaluate
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3, color: P.green.shadow }}>
                    Final Score: {totalScore}/15 points
                  </Typography>
                </Box>
                <Box component="button" onClick={handleFinish} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 6, py: 2, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>
                  Return to Dashboard
                </Box>
              </Box>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step5Interaction3
