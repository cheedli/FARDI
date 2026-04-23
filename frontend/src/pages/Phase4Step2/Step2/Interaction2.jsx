import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Interaction 2: Explain Engagement Element
 * Students explain ONE element (hashtag, emoji, or CTA) and why it works
 */

export default function Phase4_2Step2Interaction2() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 2, context: 'main' })
  const [explanation, setExplanation] = useState('')
  const [originalCaption, setOriginalCaption] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const caption = sessionStorage.getItem('phase4_2_step2_int1_caption')
    if (caption) {
      setOriginalCaption(caption)
    } else {
      setOriginalCaption('Sample Instagram caption for testing purposes. Join us at the Global Cultures Festival! 🌍 #GlobalCultures #Festival')
    }
  }, [navigate])

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      alert('Please explain what makes your post engaging.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step2/evaluate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          interaction: 2,
          explanation: explanation.trim(),
          caption: originalCaption
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work!',
          details: data.details || {}
        })
        setSubmitted(true)
        sessionStorage.setItem('phase4_2_step2_int2_score', data.score || 1)
        sessionStorage.setItem('phase4_2_step2_int2_explanation', explanation.trim())
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: data.feedback || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      const explanationLower = explanation.toLowerCase()
      const wordCount = explanation.trim().split(/\s+/).length

      const mentionsHashtag = /\b(hashtag|#)\b/i.test(explanation)
      const mentionsEmoji = /\b(emoji|emoticon|smiley)\b/i.test(explanation)
      const mentionsCTA = /\b(call-to-action|cta|tag|join|come|share|save)\b/i.test(explanation)

      const hasReasoning = /\b(because|since|so|that|makes|creates|helps|increases)\b/i.test(explanation)
      const hasSocialVocab = /\b(viral|engagement|reach|audience|discoverability|conversion|organic|network)\b/i.test(explanation)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      if (wordCount >= 20 && (mentionsHashtag || mentionsEmoji || mentionsCTA) &&
          hasReasoning && hasSocialVocab &&
          (explanationLower.includes('network') || explanationLower.includes('viral loop') ||
           explanationLower.includes('amplif') || explanationLower.includes('organic reach') ||
           explanationLower.includes('strategic'))) {
        score = 5
        level = 'C1'
        feedback = 'Outstanding! Your explanation demonstrates sophisticated understanding of social media strategy. You articulated how engagement elements create network effects and amplify reach. This shows C1-level mastery of marketing vocabulary and strategic thinking.'
      } else if (wordCount >= 15 && (mentionsHashtag || mentionsEmoji || mentionsCTA) &&
               hasReasoning && hasSocialVocab) {
        score = 4
        level = 'B2'
        feedback = 'Excellent! You provided a strategic explanation of how the engagement element works, using appropriate social media vocabulary. To reach C1, discuss broader concepts like network effects, viral loops, or algorithmic amplification.'
      } else if (wordCount >= 10 && (mentionsHashtag || mentionsEmoji || mentionsCTA) &&
               hasReasoning) {
        score = 3
        level = 'B1'
        feedback = 'Good! You clearly explained which element you used and provided reasoning. To improve, use more social media vocabulary terms like "engagement", "reach", "viral", or "organic growth".'
      } else if (wordCount >= 5 && (mentionsHashtag || mentionsEmoji || mentionsCTA)) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You mentioned an engagement element. To improve, explain WHY it works using words like "because", "so", or "helps". Example: "Hashtags help because people can discover the post."'
      } else if (wordCount >= 3) {
        score = 1
        level = 'A1'
        feedback = 'Basic attempt. Try to explain which element (hashtag, emoji, or call-to-action) makes your post engaging and WHY it helps. Use words like "because" or "so".'
      } else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a longer explanation. Mention which element (hashtag, emoji, or CTA) you used and explain why it makes the post engaging. Example: "The hashtag #GlobalCultures helps because more people can find our post."'
      }

      setEvaluation({ success: score > 0, score, level, feedback })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step2_int2_score', score)
        sessionStorage.setItem('phase4_2_step2_int2_explanation', explanation.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/2/interaction/3')
  }

  const wordCount = explanation.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasElement = /\b(hashtag|emoji|call-to-action|cta|tag)\b/i.test(explanation)
  const hasReasoning = /\b(because|since|so|helps|makes)\b/i.test(explanation)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2: Marketing & Promotion (Social Media Focus)
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 2: Explore - Interaction 2
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Explain what makes your post engaging
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="SKANDER"
              message="What makes your post engaging?"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3, display: 'flex', gap: 2, alignItems: 'flex-start'
          }}>
            <InfoIcon sx={{ color: P.yellow.shadow, mt: 0.5, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                Instructions:
              </Typography>
              <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 0.5 }}>
                1. Look at your Instagram caption below
              </Typography>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                2. Explain ONE element (hashtag, emoji, or call-to-action) and WHY it makes your post engaging
              </Typography>
            </Box>
          </Box>

          {/* Show Original Caption */}
          {originalCaption && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Your Instagram Caption:
              </Typography>
              <Box sx={{
                p: 2, bgcolor: isDark ? '#1a1a2e' : 'white',
                border: `1px solid ${P.orange.border}`, borderRadius: '12px'
              }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: isDark ? '#e0e0e0' : '#333' }}>
                  {originalCaption}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Explanation Area */}
          {!submitted && (
            <Box sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Explain Your Engagement Element
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Explain which element (hashtag, emoji, or call-to-action) makes your post engaging and WHY it works..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#1a1a2e' : 'white',
                    borderRadius: '12px',
                    '& fieldset': { borderColor: P.purple.border },
                    '&:hover fieldset': { borderColor: P.purple.shadow },
                    '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>
                  Words: {wordCount}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Box component="span" sx={{
                    bgcolor: hasElement ? P.green.bg : P.yellow.bg,
                    border: `2px solid ${hasElement ? P.green.border : P.yellow.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.8rem', fontWeight: 700,
                    color: hasElement ? P.green.shadow : P.yellow.shadow,
                    display: 'inline-block'
                  }}>
                    {hasElement ? '✓ Mentions element' : 'Add element'}
                  </Box>
                  <Box component="span" sx={{
                    bgcolor: hasReasoning ? P.green.bg : P.yellow.bg,
                    border: `2px solid ${hasReasoning ? P.green.border : P.yellow.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.8rem', fontWeight: 700,
                    color: hasReasoning ? P.green.shadow : P.yellow.shadow,
                    display: 'inline-block'
                  }}>
                    {hasReasoning ? '✓ Has reasoning' : 'Add reasoning'}
                  </Box>
                </Stack>
              </Box>

              <Box component="button" onClick={handleSubmit} disabled={loading || !explanation.trim()} sx={{
                bgcolor: loading || !explanation.trim() ? (isDark ? '#2a2a3e' : '#e5e7eb') : P.teal.bg,
                border: `2px solid ${loading || !explanation.trim() ? (isDark ? '#444' : '#d1d5db') : P.teal.border}`,
                borderRadius: '12px',
                boxShadow: loading || !explanation.trim() ? 'none' : `3px 3px 0 ${P.teal.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: loading || !explanation.trim() ? 'not-allowed' : 'pointer',
                color: loading || !explanation.trim() ? (isDark ? '#555' : '#9ca3af') : P.teal.shadow,
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                opacity: loading || !explanation.trim() ? 0.6 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': loading || !explanation.trim() ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.teal.shadow}` },
                '&:active': loading || !explanation.trim() ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.teal.shadow}` }
              }}>
                {loading ? <CircularProgress size={20} /> : 'Submit Explanation'}
              </Box>
            </Box>
          )}

          {/* Evaluation Results */}
          {evaluation && submitted && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.red.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.red.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.red.shadow}`,
              p: 3, mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.shadow : P.red.shadow, mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow }}>
                    {evaluation.success ? 'Explanation Submitted!' : 'Try Again'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    <Box component="span" sx={{
                      bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                      borderRadius: '999px', px: 2, py: 0.5,
                      fontSize: '0.85rem', fontWeight: 700, color: P.blue.shadow, display: 'inline-block'
                    }}>Level: {evaluation.level}</Box>
                    <Box component="span" sx={{
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '999px', px: 2, py: 0.5,
                      fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow, display: 'inline-block'
                    }}>Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}</Box>
                  </Stack>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: evaluation.success ? P.green.shadow : P.red.shadow }}>
                {evaluation.feedback}
              </Typography>

              {/* Show user's explanation */}
              <Box sx={{
                p: 2, mb: 2,
                bgcolor: isDark ? '#1a1a2e' : 'white',
                border: `1px solid ${evaluation.success ? P.green.border : P.red.border}`,
                borderRadius: '12px'
              }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: isDark ? '#ccc' : '#333' }}>
                  Your Explanation:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: isDark ? '#e0e0e0' : '#000' }}>
                  {explanation}
                </Typography>
              </Box>

              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                <PlayArrowIcon />
                Continue to Next Activity
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
