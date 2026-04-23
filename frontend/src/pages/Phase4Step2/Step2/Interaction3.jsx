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
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { requestPhase42StepScore } from '../shared/routing.js'

/**
 * Phase 4.2 Step 2 - Interaction 3: Revise & Improve
 * Play Sushi Spell again, then improve ONE sentence from original caption using a new term
 */

const TARGET_WORDS = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action']

export default function Phase4_2Step2Interaction3() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [revision, setRevision] = useState('')
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

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Sushi Spell completed:', result)
    setGameCompleted(true)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!revision.trim()) {
      alert('Please provide your revised sentence.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step2/evaluate-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          interaction: 3,
          revision: revision.trim(),
          original_caption: originalCaption
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
        sessionStorage.setItem('phase4_2_step2_int3_score', data.score || 1)
        sessionStorage.setItem('phase4_2_step2_int3_revision', revision.trim())
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

      const revisionLower = revision.toLowerCase()
      const wordCount = revision.trim().split(/\s+/).length

      const hasSocialTerm = /\b(hashtag|emoji|tag|call-to-action|cta|engagement|viral|reach|organic|immersive|experience|community|network|amplif|discover)\b/i.test(revision)
      const showsImprovement = /\b(add|replace|improve|change|use|integrate|include|enhance)\b/i.test(revision)
      const hasSophisticatedVocab = /\b(immersive|experience|authentic|network effects|global community|amplif|organic reach|strategic|viral loop)\b/i.test(revision)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      if (wordCount >= 12 && hasSocialTerm && showsImprovement && hasSophisticatedVocab) {
        score = 5
        level = 'C1'
        feedback = 'Outstanding! Your revision demonstrates sophisticated understanding of social media marketing. You integrated advanced vocabulary and showed how to strategically improve engagement. This shows C1-level mastery of promotional writing and social media strategy.'
      } else if (wordCount >= 10 && hasSocialTerm && showsImprovement &&
               (revisionLower.includes('immersive') || revisionLower.includes('experience') ||
                revisionLower.includes('appeal') || revisionLower.includes('engagement'))) {
        score = 4
        level = 'B2'
        feedback = 'Excellent! Your revision shows strategic thinking about how to improve the post. You used strong social media vocabulary to create more compelling content. To reach C1, integrate concepts like "network effects" or "viral loops" into your revision.'
      } else if (wordCount >= 8 && hasSocialTerm && showsImprovement) {
        score = 3
        level = 'B1'
        feedback = 'Good! You clearly showed how to improve the caption and used social media vocabulary. To reach B2, use more sophisticated terms like "immersive experience", "authentic", or "compelling content".'
      } else if (wordCount >= 5 && (hasSocialTerm || showsImprovement)) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You attempted to revise the caption. To improve, be more specific about WHAT you would change and WHY. Use social media terms like "engagement", "call-to-action", or "hashtag".'
      } else if (wordCount >= 3) {
        score = 1
        level = 'A1'
        feedback = 'Basic attempt. Try to explain HOW you would improve a sentence from your caption. Example: "Add call-to-action: Join us!" or "Replace fun with immersive experience".'
      } else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a longer revision. Show how you would improve ONE sentence from your caption using new social media vocabulary. Example: "Replace \'fun festival\' with \'immersive cultural experience\' for stronger appeal."'
      }

      setEvaluation({ success: score > 0, score, level, feedback })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step2_int3_score', score)
        sessionStorage.setItem('phase4_2_step2_int3_revision', revision.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    const int1Score = parseInt(sessionStorage.getItem('phase4_2_step2_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase4_2_step2_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step2_int3_score') || '0')
    try {
      const data = await requestPhase42StepScore(2, {
        interaction1_score: int1Score,
        interaction2_score: int2Score,
        interaction3_score: int3Score,
      })
      sessionStorage.setItem('phase4_2_step2_total_score', data.total.score.toString())
      sessionStorage.setItem('phase4_2_step2_total_max', data.total.max_score.toString())
      sessionStorage.setItem('phase4_2_step2_next_url', data.total.next_url)
      sessionStorage.setItem('phase4_2_step2_remedial_level', data.total.remedial_level)
      navigate(data.total.next_url)
    } catch (error) {
      console.error('Failed to calculate Phase 4.2 Step 2 routing:', error)
      alert('Unable to calculate the next route right now. Please try again.')
    }
  }

  const wordCount = revision.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasImprovement = /\b(add|replace|improve|change|integrate)\b/i.test(revision)
  const hasTerm = /\b(hashtag|emoji|tag|call-to-action|engagement|viral|immersive|experience)\b/i.test(revision)

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
              Step 2: Explore - Interaction 3
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Revise & improve your post
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Emna"
              message="Revise your post after the game."
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
                1. Play Sushi Spell again to practice social media vocabulary
              </Typography>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                2. Improve ONE sentence from your original caption using a new term
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
                Your Original Instagram Caption:
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

          {/* Sushi Spell Game */}
          {!gameCompleted && (
            <Box sx={{ mb: 4 }}>
              <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
            </Box>
          )}

          {/* Game Complete Message */}
          {gameCompleted && !submitted && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="body1" sx={{ color: P.green.shadow, fontWeight: 700 }}>
                ✓ Sushi Spell completed! You spelled {gameResult?.foundWords?.length || 0} words. Now revise your caption below.
              </Typography>
            </Box>
          )}

          {/* Revision Area */}
          {gameCompleted && !submitted && (
            <Box sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Revise & Improve Your Caption
              </Typography>

              {/* Example Revisions */}
              <Box sx={{
                bgcolor: P.green.bg, border: `1px solid ${P.green.border}`,
                borderRadius: '12px', p: 2, mb: 3
              }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example Revisions:
                </Typography>
                <Stack spacing={1}>
                  {[
                    { level: 'A2', text: '"Add emoji 😊"' },
                    { level: 'B1', text: '"Add call-to-action: \'Join us!\'"' },
                    { level: 'B2', text: '"Replace \'fun\' with \'immersive experience\' for stronger appeal."' },
                    { level: 'C1', text: '"Integrate \'network effects\' into CTA: \'Tag friends to expand our global community!\'"' },
                  ].map(ex => (
                    <Typography key={ex.level} variant="body2" sx={{ color: isDark ? '#ccc' : '#444' }}>
                      <strong style={{ color: P.green.shadow }}>{ex.level}:</strong> {ex.text}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Show how you would improve ONE sentence from your caption. Use new social media vocabulary you learned from Sushi Spell..."
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
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
                    bgcolor: hasImprovement ? P.green.bg : P.yellow.bg,
                    border: `2px solid ${hasImprovement ? P.green.border : P.yellow.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.8rem', fontWeight: 700,
                    color: hasImprovement ? P.green.shadow : P.yellow.shadow,
                    display: 'inline-block'
                  }}>
                    {hasImprovement ? '✓ Shows improvement' : 'Add improvement'}
                  </Box>
                  <Box component="span" sx={{
                    bgcolor: hasTerm ? P.green.bg : P.yellow.bg,
                    border: `2px solid ${hasTerm ? P.green.border : P.yellow.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.8rem', fontWeight: 700,
                    color: hasTerm ? P.green.shadow : P.yellow.shadow,
                    display: 'inline-block'
                  }}>
                    {hasTerm ? '✓ Uses new term' : 'Use new term'}
                  </Box>
                </Stack>
              </Box>

              <Box component="button" onClick={handleSubmit} disabled={loading || !revision.trim()} sx={{
                bgcolor: loading || !revision.trim() ? (isDark ? '#2a2a3e' : '#e5e7eb') : P.teal.bg,
                border: `2px solid ${loading || !revision.trim() ? (isDark ? '#444' : '#d1d5db') : P.teal.border}`,
                borderRadius: '12px',
                boxShadow: loading || !revision.trim() ? 'none' : `3px 3px 0 ${P.teal.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: loading || !revision.trim() ? 'not-allowed' : 'pointer',
                color: loading || !revision.trim() ? (isDark ? '#555' : '#9ca3af') : P.teal.shadow,
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                opacity: loading || !revision.trim() ? 0.6 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': loading || !revision.trim() ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.teal.shadow}` },
                '&:active': loading || !revision.trim() ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.teal.shadow}` }
              }}>
                {loading ? <CircularProgress size={20} /> : 'Submit Revision'}
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
                    {evaluation.success ? 'Revision Submitted!' : 'Try Again'}
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

              {/* Show user's revision */}
              <Box sx={{
                p: 2, mb: 2,
                bgcolor: isDark ? '#1a1a2e' : 'white',
                border: `1px solid ${evaluation.success ? P.green.border : P.red.border}`,
                borderRadius: '12px'
              }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: isDark ? '#ccc' : '#333' }}>
                  Your Revision:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: isDark ? '#e0e0e0' : '#000' }}>
                  {revision}
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
                Return to Dashboard
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
