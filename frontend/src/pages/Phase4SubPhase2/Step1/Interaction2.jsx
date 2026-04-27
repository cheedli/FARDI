import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, CircularProgress,
  Stack, Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Interaction 2: Social Media Post Discussion
 */

const GLOSSARY_TERMS = [
  'hashtag', 'caption', 'call-to-action', 'engagement',
  'viral', 'tag', 'emoji', 'story'
]

export default function Phase4_2Step1Interaction2() {
  const navigate = useNavigate()
  useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/1/interaction/3') }, [])
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 2, context: 'main' })
  const [response, setResponse] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = async () => {
    if (!response.trim()) {
      alert('Please write your social media post idea.')
      return
    }
    setLoading(true)
    try {
      const apiResponse = await fetch('/api/phase4_2/step1/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interaction: 2, response: response.trim() })
      })
      const data = await apiResponse.json()
      if (data.success !== false) {
        setEvaluation({ success: true, score: data.score || 1, level: data.level || 'A1', feedback: data.feedback || 'Good work!', details: data.details || {} })
        setSubmitted(true)
        sessionStorage.setItem('phase4_2_step1_int2_score', data.score || 1)
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A1', feedback: data.feedback || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const responseLower = response.toLowerCase()
      const wordCount = response.trim().split(/\s+/).length
      const sentenceCount = response.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const mentionsPost = /\b(post|caption|instagram|twitter|facebook|social media)\b/i.test(response)
      const mentionsHashtag = /\b(hashtag|#)\b/i.test(response)
      const mentionsEmoji = /\b(emoji)\b/i.test(response) || /[\u{1F300}-\u{1F9FF}]/u.test(response)
      const mentionsCallToAction = /\b(call-to-action|call to action|join|visit|tag|share|save)\b/i.test(response)
      const mentionsEngagement = /\b(engagement|viral|like|share|comment|reach|audience|people)\b/i.test(response)
      const termsUsed = GLOSSARY_TERMS.filter(term => {
        const regex = new RegExp('\\b' + term.replace(/-/g, '[-\\s]') + '\\b', 'i')
        return regex.test(response)
      }).length
      const hasReasoning = /\b(because|since|so|to|for|will|can|make|increase|attract|drive)\b/i.test(response)
      const hasComparison = /\b(like the example|similar to|based on|inspired by)\b/i.test(response)
      const hasStrategicThinking = /\b(strategy|discoverability|conversions|emotional connection|brand|visibility|reach|amplify)\b/i.test(response)
      const hasAdvancedVocab = /\b(leverage|optimize|maximize|resonate|cultivate|foster|enhance|align|strategic)\b/i.test(response)
      let score = 0
      let level = 'Below A1'
      let feedback = ''
      if (wordCount >= 20 && termsUsed >= 3 && mentionsPost && hasReasoning && (hasStrategicThinking || hasAdvancedVocab) && (mentionsCallToAction || mentionsEngagement)) {
        score = 5; level = 'C1'; feedback = 'Excellent! Your response demonstrates sophisticated understanding of social media strategy. You used advanced terminology to analyze how posts work, explained strategic elements like hashtag discoverability or call-to-action conversions, and showed deep insight into audience engagement mechanics. This reflects C1-level analytical and persuasive writing.'
      } else if (wordCount >= 15 && termsUsed >= 2 && mentionsPost && hasReasoning && (hasComparison || mentionsEngagement || mentionsCallToAction)) {
        score = 4; level = 'B2'; feedback = 'Very good! You provided a detailed explanation of a social media post idea with clear reasoning. You referenced the examples effectively, used multiple social media terms, and explained how specific elements (hashtags, emojis, calls-to-action) work to drive engagement. To reach C1, incorporate more strategic language about brand alignment or conversion mechanics.'
      } else if (wordCount >= 10 && termsUsed >= 1 && mentionsPost && hasReasoning && (mentionsHashtag || mentionsCallToAction || mentionsEngagement)) {
        score = 3; level = 'B1'; feedback = 'Good! You clearly explained a social media post idea and provided reasoning for why it would work. You used at least one key term and connected it to engagement or reach. To improve, add more details about specific elements (hashtags, emojis, captions) and explain their strategic purpose.'
      } else if (wordCount >= 5 && hasReasoning && (mentionsPost || mentionsHashtag || mentionsEmoji)) {
        score = 2; level = 'A2'; feedback = 'Good start! You suggested a basic social media post idea and used a connector (like "because"). Try to expand by mentioning specific elements: What hashtags would you use? What would the caption say? Why would it attract people?'
      } else if (wordCount >= 2 && (mentionsPost || mentionsHashtag)) {
        score = 1; level = 'A1'; feedback = 'You made a basic attempt. Try to write more: Start with "Like the example, we can make a post with..." then add details about hashtags, captions, or emojis, and explain why it would work.'
      } else {
        score = 0; level = 'Below A1'; feedback = 'Please suggest a social media post idea. Start with "Like the example, we can make a post with..." and mention elements like hashtags, captions, or calls-to-action.'
      }
      setEvaluation({ success: score > 0, score, level, feedback, termsUsed })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step1_int2_score', score)
        console.log(`[Phase 4.2 Step 1 - Interaction 2] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/1/interaction/3')
  }

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2: Marketing &amp; Promotion (Social Media Focus)
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 1: Engage - Interaction 2
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Discuss Social Media Post Ideas
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="SKANDER"
              message="Great! Now that we've activated some vocabulary with the game, inspired by the social media examples, how can posts attract our audience for the Global Cultures Festival?"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, display: 'flex', gap: 1, alignItems: 'flex-start',
          }}>
            <InfoIcon sx={{ color: P.blue.shadow, mt: 0.5 }} />
            <Box>
              <Typography variant="body2" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Instructions:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: P.blue.shadow }}>
                Suggest one idea for a social media post (Instagram caption, Twitter thread, etc.) based on the examples, and explain why it works.
              </Typography>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                Incorporate social media vocabulary terms: hashtag, caption, call-to-action, engagement, viral, tag, emoji, story
              </Typography>
            </Box>
          </Box>

          {/* Vocabulary Reference */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              <TipsAndUpdatesIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Use These Social Media Terms:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {GLOSSARY_TERMS.map((term, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.yellow.shadow,
                  display: 'inline-block', mt: 1
                }}>{term}</Box>
              ))}
            </Stack>
          </Box>

          {/* Writing Area */}
          {!submitted && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Your Social Media Post Idea
              </Typography>

              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', p: 2, mb: 2,
              }}>
                <Typography variant="body2" sx={{ color: P.green.shadow }}>
                  <strong>Hint:</strong> Start with "Like the example, we can make a post with..."
                </Typography>
              </Box>

              <TextField
                fullWidth multiline rows={6} variant="outlined"
                placeholder="Suggest a social media post idea and explain why it would attract the audience..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ color: P.orange.shadow }}>
                  Words: {wordCount}
                </Typography>
                <Box component="span" sx={{
                  bgcolor: wordCount >= 10 ? P.green.bg : P.yellow.bg,
                  border: `2px solid ${wordCount >= 10 ? P.green.border : P.yellow.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700,
                  color: wordCount >= 10 ? P.green.shadow : P.yellow.shadow,
                  display: 'inline-block'
                }}>{wordCount >= 10 ? '✓ Good length' : 'Try to write at least 10 words'}</Box>
              </Box>

              <Box component="button" onClick={handleSubmit} disabled={loading || !response.trim()} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: loading || !response.trim() ? 'not-allowed' : 'pointer',
                color: P.green.shadow, width: '100%',
                opacity: loading || !response.trim() ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                {loading ? <CircularProgress size={24} /> : 'Submit Response'}
              </Box>
            </Box>
          )}

          {/* Evaluation Results */}
          {evaluation && submitted && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.yellow.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.shadow : P.yellow.shadow, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                    {evaluation.success ? 'Response Submitted!' : 'Try Again'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    <Box component="span" sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.blue.shadow, display: 'inline-block' }}>Level: {evaluation.level}</Box>
                    <Box component="span" sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow, display: 'inline-block' }}>Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}</Box>
                    {evaluation.termsUsed !== undefined && (
                      <Box component="span" sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.teal.shadow, display: 'inline-block' }}>Terms Used: {evaluation.termsUsed}</Box>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                {evaluation.feedback}
              </Typography>

              {/* Show user's response */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '12px', p: 2, mb: 2,
              }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Your Response:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: P.yellow.shadow }}>
                  {response}
                </Typography>
              </Box>

              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, width: '100%',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Next Activity
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
