import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, CircularProgress, Stack, Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Interaction 1: Sushi Spell + Caption Writing
 */

const TARGET_WORDS = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action']

export default function Phase4_2Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [caption, setCaption] = useState('')
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

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: result })
    console.log('Sushi Spell completed:', result)
    setGameCompleted(true)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!caption.trim()) {
      alert('Please write your Instagram caption.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/phase4/4_2/step2/evaluate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interaction: 1, caption: caption.trim() })
      })
      const data = await response.json()
      if (data.success !== false) {
        setEvaluation({ success: true, score: data.score || 1, level: data.level || 'A1', feedback: data.feedback || 'Good work!', details: data.details || {} })
        setSubmitted(true)
        sessionStorage.setItem('phase4_2_step2_int1_score', data.score || 1)
        sessionStorage.setItem('phase4_2_step2_int1_caption', caption.trim())
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A1', feedback: data.feedback || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const sentences = caption.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const sentenceCount = sentences.length
      const wordCount = caption.trim().split(/\s+/).length
      const captionLower = caption.toLowerCase()
      const hasHashtag = /#\w+/.test(caption)
      const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(caption)
      const mentionsEvent = /\b(festival|global cultures|march|event|celebration)\b/i.test(caption)
      const hasCTA = /\b(join|tag|come|save|register|rsvp|don't miss)\b/i.test(caption)
      const hasDetails = /\b(march 8|march 8th|student center|food|music|art|culture)\b/i.test(caption)
      let score = 0; let level = 'Below A1'; let feedback = ''
      if (sentenceCount >= 5 && wordCount >= 50 && mentionsEvent && hasHashtag && hasCTA && (captionLower.includes('immerse') || captionLower.includes('experience') || captionLower.includes('celebrate') || captionLower.includes('opportunity') || captionLower.includes('authentic') || captionLower.includes('unique'))) {
        score = 5; level = 'C1'; feedback = 'Outstanding! Your caption demonstrates sophisticated social media writing with strategic language, engaging hooks, and professional CTAs. You effectively used descriptive vocabulary to create an immersive experience. This shows C1-level mastery of promotional writing.'
      } else if (sentenceCount >= 4 && wordCount >= 35 && mentionsEvent && hasHashtag && hasCTA && hasDetails) {
        score = 4; level = 'B2'; feedback = 'Excellent! Your caption is engaging and includes key social media elements: hashtags, call-to-action, and specific details. You created an attractive post that would drive engagement. To reach C1, use more sophisticated vocabulary (e.g., "immerse", "authentic experience", "connect across borders").'
      } else if (sentenceCount >= 3 && wordCount >= 20 && mentionsEvent && (hasHashtag || hasCTA)) {
        score = 3; level = 'B1'; feedback = 'Good! Your caption clearly explains the festival and includes social media elements like hashtags or a call-to-action. To improve, add more specific details (date, location, what to expect) and use both hashtags AND a CTA.'
      } else if (sentenceCount >= 2 && mentionsEvent) {
        score = 2; level = 'A2'; feedback = 'Good start! You wrote a basic caption about the festival. To improve, add: 1) Specific details (date, location), 2) A hashtag (#GlobalFestival), 3) A call-to-action (Tag a friend!), and 4) Maybe an emoji 😊'
      } else if (sentenceCount >= 1 && wordCount >= 5) {
        score = 1; level = 'A1'; feedback = 'You made a basic attempt. Try to write more! Include: what the festival is, when it is (March 8), why people should come, a hashtag, and ask people to tag friends.'
      } else {
        score = 0; level = 'Below A1'; feedback = 'Please write a longer caption (at least 3 sentences). Tell people about the Global Cultures Festival on March 8, add a hashtag like #GlobalCultures, and ask them to tag friends!'
      }
      setEvaluation({ success: score > 0, score, level, feedback })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step2_int1_score', score)
        sessionStorage.setItem('phase4_2_step2_int1_caption', caption.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => { navigate('/phase4_2/step/2/interaction/2') }
  window.__remedialSkip = handleContinue

  const wordCount = caption.trim().split(/\s+/).filter(w => w.length > 0).length
  const sentenceCount = caption.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2: Marketing & Promotion (Social Media Focus)</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Step 2: Explore - Interaction 1</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Play Sushi Spell, then write your Instagram caption</Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Play Sushi Spell to activate vocabulary, then write a short caption for an Instagram post about our Global Cultures Festival!" />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="body2" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>Instructions:</Typography>
            <Typography variant="body2" sx={{ mb: 1, color: P.yellow.shadow }}>1. Play Sushi Spell to practice spelling social media terms</Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}>2. Write a 3–6 sentence Instagram caption for the Global Cultures Festival (March 8)</Typography>
          </Box>

          {/* Sushi Spell Game */}
          {!gameCompleted && (
            <Box sx={{ mb: 4 }}>
              <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
            </Box>
          )}

          {/* Game Complete Message */}
          {gameCompleted && !submitted && (
            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
              <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>
                ✓ Sushi Spell completed! You spelled {gameResult?.foundWords?.length || 0} words. Now write your Instagram caption below.
              </Typography>
            </Box>
          )}

          {/* Caption Writing Area */}
          {gameCompleted && !submitted && (
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>Write Your Instagram Caption</Typography>

              <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>Caption Tips:</Typography>
                <Stack spacing={0.5}>
                  {[
                    '• Mention the festival name and date (March 8)',
                    '• Include what people can experience (food, music, art, cultures)',
                    '• Add hashtags like #GlobalCultures #Festival',
                    '• Include a call-to-action (Tag a friend! Save the date!)',
                    '• Use emojis to make it visually appealing 🌍✨🎉'
                  ].map(tip => (
                    <Typography key={tip} variant="body2" sx={{ color: P.green.shadow }}>{tip}</Typography>
                  ))}
                </Stack>
              </Box>

              <TextField
                fullWidth multiline rows={8} variant="outlined"
                placeholder="Write your Instagram caption here... Remember to include the event details, hashtags, and a call-to-action!"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                sx={{ mb: 2, backgroundColor: 'white' }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#555' }}>
                  Words: {wordCount} | Sentences: {sentenceCount}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {[
                    { test: /#\w+/.test(caption), yes: '✓ Has hashtag', no: 'Add hashtag' },
                    { test: /[\u{1F300}-\u{1F9FF}]/u.test(caption), yes: '✓ Has emoji', no: 'Add emoji' }
                  ].map((item, i) => (
                    <Box key={i} component="span" sx={{
                      bgcolor: item.test ? P.green.bg : P.yellow.bg,
                      border: `2px solid ${item.test ? P.green.border : P.yellow.border}`,
                      borderRadius: '999px', px: 2, py: 0.5,
                      fontSize: '0.8rem', fontWeight: 700,
                      color: item.test ? P.green.shadow : P.yellow.shadow,
                      display: 'inline-block'
                    }}>{item.test ? item.yes : item.no}</Box>
                  ))}
                </Stack>
              </Box>

              <Box component="button" onClick={handleSubmit} disabled={loading || !caption.trim()} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: loading || !caption.trim() ? 'not-allowed' : 'pointer',
                color: P.green.shadow, width: '100%',
                opacity: loading || !caption.trim() ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                {loading ? <CircularProgress size={20} /> : 'Submit Caption'}
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
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, fontWeight: 'bold' }}>
                    {evaluation.success ? 'Caption Submitted!' : 'Try Again'}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    {[`Level: ${evaluation.level}`, `Score: +${evaluation.score} point${evaluation.score !== 1 ? 's' : ''}`].map(lbl => (
                      <Box key={lbl} component="span" sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '999px', px: 2, py: 0.5,
                        fontSize: '0.85rem', fontWeight: 700, color: P.blue.shadow, display: 'inline-block'
                      }}>{lbl}</Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: evaluation.success ? P.green.shadow : P.red.shadow }}>
                {evaluation.feedback}
              </Typography>

              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>Your Instagram Caption:</Typography>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>{caption}</Typography>
                </Box>
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
