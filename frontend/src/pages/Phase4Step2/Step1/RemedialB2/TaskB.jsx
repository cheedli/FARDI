import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CreateIcon from '@mui/icons-material/Create'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task B: Writing
 * Write an 8-sentence paragraph on effective social media posts
 * AI evaluation for content quality
 * Score: 0-10 points based on quality
 */

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_b2' })
  const [paragraph, setParagraph] = useState('')
  const [sentenceCount, setSentenceCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const handleTextChange = (e) => {
    const text = e.target.value
    setParagraph(text)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    try {
      const response = await fetch('/api/phase4/remedial/evaluate-writing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B2', task: 'B', paragraph, expected_sentences: 8, topic: 'effective social media posts' })
      })
      const data = await response.json()
      if (data.success) {
        setScore(data.score); setFeedback(data.feedback)
        sessionStorage.setItem('remedial_phase4_2_step1_b2_taskB_score', data.score)
        await fetch('/api/phase4/remedial/log', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'B', step: 1, score: data.score, max_score: 10, completed: true })
        })
      } else {
        const fallbackScore = sentenceCount >= 8 ? 7 : Math.floor((sentenceCount / 8) * 7)
        setScore(fallbackScore); setFeedback('Good effort! Try to include more details about social media strategies.')
        sessionStorage.setItem('remedial_phase4_2_step1_b2_taskB_score', fallbackScore)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const fallbackScore = sentenceCount >= 8 ? 7 : Math.floor((sentenceCount / 8) * 7)
      setScore(fallbackScore); setFeedback('Good effort! Your paragraph shows understanding of social media concepts.')
      sessionStorage.setItem('remedial_phase4_2_step1_b2_taskB_score', fallbackScore)
    }
    setSubmitted(true); setEvaluating(false)
  }

  const canSubmit = sentenceCount >= 8 && paragraph.trim().length >= 200

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 - Step 1: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B2 - Task B: Writing</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Write an 8-sentence paragraph on effective social media posts!</Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS_MABROUKI" message="Time to showcase your writing skills! Write a well-structured paragraph (8 sentences minimum) about what makes social media posts effective. Include details about hashtags, captions, engagement, and calls-to-action. Use clear examples and explain your ideas thoroughly!" />
          </Box>

          {/* Writing Prompt */}
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CreateIcon sx={{ fontSize: 28, color: P.green.shadow }} />
              <Typography variant="h6" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Writing Prompt</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: P.green.shadow, fontWeight: 500, mb: 1 }}><strong>Topic:</strong> What makes a social media post effective?</Typography>
            <Typography variant="body2" sx={{ color: P.green.shadow, mb: 0.5 }}><strong>Include:</strong></Typography>
            <Box component="ul" sx={{ color: P.green.shadow, mt: 0.5, pl: 2 }}>
              {['The role of hashtags in discovery','How captions engage readers','Why emojis matter','The importance of calls-to-action','Tagging and engagement strategies','The power of stories','When content goes viral','Best practices for posting'].map((item, i) => (
                <li key={i}><Typography variant="body2" sx={{ color: P.green.shadow }}>{item}</Typography></li>
              ))}
            </Box>
          </Box>

          {/* Writing Area */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow, fontWeight: 'bold' }}>Your Paragraph</Typography>
            <TextField fullWidth multiline rows={14} value={paragraph} onChange={handleTextChange}
              placeholder="Write your paragraph here... Start with a clear topic sentence, develop your ideas with examples, and conclude with a strong statement about effective social media posting."
              variant="outlined" disabled={submitted || evaluating}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#1a2a4a' : 'white', '& fieldset': { borderColor: P.blue.border, borderWidth: 2 }, '&:hover fieldset': { borderColor: P.blue.shadow }, '&.Mui-focused fieldset': { borderColor: P.blue.shadow } } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ bgcolor: sentenceCount >= 8 ? P.green.bg : P.yellow.bg, border: `2px solid ${sentenceCount >= 8 ? P.green.border : P.yellow.border}`, borderRadius: '20px', px: 1.5, py: 0.25 }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: sentenceCount >= 8 ? P.green.shadow : P.yellow.shadow }}>Sentences: {sentenceCount} / 8</Typography>
                </Box>
                <Box sx={{ bgcolor: paragraph.length >= 200 ? P.green.bg : P.teal.bg, border: `2px solid ${paragraph.length >= 200 ? P.green.border : P.teal.border}`, borderRadius: '20px', px: 1.5, py: 0.25 }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: paragraph.length >= 200 ? P.green.shadow : P.teal.shadow }}>Characters: {paragraph.length} / 200+</Typography>
                </Box>
              </Box>
              {canSubmit && !submitted && (
                <Typography variant="body2" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Ready to submit!</Typography>
              )}
            </Box>

            {sentenceCount < 8 && paragraph.length > 50 && !submitted && (
              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ color: P.blue.shadow }}>You need at least {8 - sentenceCount} more sentence{8 - sentenceCount !== 1 ? 's' : ''}. Keep writing!</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: P.blue.shadow, fontWeight: 600 }}>Progress: {Math.min(100, (sentenceCount / 8) * 100).toFixed(0)}%</Typography>
              <Box sx={{ height: 10, borderRadius: '5px', bgcolor: isDark ? '#1a2a4a' : '#e0e0e0', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${Math.min(100, (sentenceCount / 8) * 100)}%`, bgcolor: P.blue.border, transition: 'width 0.3s', borderRadius: '5px' }} />
              </Box>
            </Box>
          </Box>

          {/* Results */}
          {submitted && (
            <Box sx={{ bgcolor: score >= 8 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 8 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 8 ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: score >= 8 ? P.green.shadow : P.yellow.shadow, mb: 1 }} />
                <Typography variant="h4" gutterBottom sx={{ color: score >= 8 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                  {score >= 8 ? 'Excellent Work!' : 'Good Effort!'}
                </Typography>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 2, border: `2px solid ${score >= 8 ? P.green.border : P.yellow.border}` }}>
                  <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 8 ? P.green.shadow : P.yellow.shadow }}>{score} / 10</Typography>
                  <Typography variant="h6" sx={{ color: score >= 8 ? P.green.shadow : P.yellow.shadow }}>Points Earned</Typography>
                </Box>
              </Box>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ color: score >= 8 ? P.green.shadow : P.yellow.shadow, fontWeight: 500 }}><strong>Feedback:</strong> {feedback}</Typography>
              </Box>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 2 }}>
                <Typography variant="subtitle2" sx={{ color: score >= 8 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold', mb: 0.5 }}>Your Statistics:</Typography>
                <Typography variant="body2" sx={{ color: score >= 8 ? P.green.shadow : P.yellow.shadow }}>
                  Sentences: {sentenceCount} | Characters: {paragraph.length} | Words: {paragraph.trim().split(/\s+/).length}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={!canSubmit || evaluating} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: (!canSubmit || evaluating) ? 'not-allowed' : 'pointer',
                color: P.green.shadow, opacity: (!canSubmit || evaluating) ? 0.6 : 1,
                '&:hover': (!canSubmit || evaluating) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>{evaluating ? 'Evaluating...' : canSubmit ? 'Submit Paragraph' : `Write ${8 - sentenceCount} More Sentences`}</Box>
            )}
            {submitted && (
              <Box component="button" onClick={() => navigate('/phase4_2/step1/remedial/b2/taskC')} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.blue.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task C: Matching Game</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
