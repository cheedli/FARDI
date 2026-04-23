import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, CircularProgress, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import CreateIcon from '@mui/icons-material/Create'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'
import { requestPhase42TaskBScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Task B: Explain Expedition
 * Write an 8-sentence explanation of social media post elements
 * 8 guided questions to answer
 * AI evaluation for content quality at B2 level
 * Score: 0-8 points based on quality
 */

const GUIDED_QUESTIONS = [
  'What is the purpose of a hashtag in your post?',
  'How should you write an effective caption?',
  'What function do emojis serve in social media posts?',
  'Why is a call-to-action important in your post?',
  'How does tagging other accounts benefit your post?',
  'What effect does posting timing have on engagement?',
  'Why is visual quality important for social media?',
  'How do you measure engagement metrics effectively?'
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 2, context: 'remedial_b2' })
  const [explanation, setExplanation] = useState('')
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

  const handleTextChange = (e) => {
    const text = e.target.value
    setExplanation(text)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      const data = await requestPhase42TaskBScore(3, 'B2', {
        paragraph: explanation,
        expected_sentences: 8,
        topic: 'social media post elements',
        guided_questions: GUIDED_QUESTIONS,
      })

      setScore(data.score)
      setFeedback(data.feedback)
      sessionStorage.setItem('phase4_2_step3_b2_taskB', data.score)

      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2', level: 'B2', task: 'B', step: 3,
          score: data.score, max_score: 8, completed: true
        })
      })
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('Evaluation failed. Please try again.')
      setEvaluating(false)
      return
    }

    setSubmitted(true)
    setEvaluating(false)
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/3/remedial/b2/taskC')
  }

  const canSubmit = sentenceCount >= 8 && explanation.trim().length >= 200

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 3 - Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task B: Explain Expedition</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>Write an 8-sentence explanation of social media post elements!</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Time to demonstrate your writing skills! Write a well-structured explanation (8 sentences minimum) about the key elements of social media posts. Answer the guided questions below in your explanation. Use clear examples and explain your ideas thoroughly with B2-level language!"
            />
          </Box>

          {/* Guided Questions */}
          <Box sx={{
            bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 3, mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <QuizIcon sx={{ fontSize: 28, color: P.green.shadow }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.green.shadow }}>
                Guided Questions to Answer
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
              Include answers to these 8 questions in your explanation:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {GUIDED_QUESTIONS.map((question, idx) => (
                <Box key={idx} sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', p: 2
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    <strong>{idx + 1}.</strong> {question}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Writing Prompt */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CreateIcon sx={{ fontSize: 28, color: P.blue.shadow }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>Writing Prompt</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              <strong>Topic:</strong> What are the key elements that make a social media post effective?
            </Typography>
            <Typography variant="body2">
              Write a comprehensive explanation that covers hashtag strategy, caption writing, emoji usage,
              calls-to-action, tagging benefits, posting timing, visual quality, and engagement measurement.
            </Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>Your Explanation</Typography>

            <TextField
              fullWidth multiline rows={16}
              value={explanation}
              onChange={handleTextChange}
              placeholder="Write your explanation here... Answer each of the 8 guided questions above."
              variant="outlined"
              disabled={submitted || evaluating}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                  borderRadius: '12px',
                  fontSize: '1.05rem',
                  lineHeight: 1.8
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Box component="span" sx={{
                  bgcolor: sentenceCount >= 8 ? P.green.bg : P.yellow.bg,
                  border: `2px solid ${sentenceCount >= 8 ? P.green.border : P.yellow.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700,
                  color: sentenceCount >= 8 ? P.green.shadow : P.yellow.shadow
                }}>
                  Sentences: {sentenceCount} / 8
                </Box>
                <Box component="span" sx={{
                  bgcolor: explanation.length >= 200 ? P.green.bg : P.teal.bg,
                  border: `2px solid ${explanation.length >= 200 ? P.green.border : P.teal.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700,
                  color: explanation.length >= 200 ? P.green.shadow : P.teal.shadow
                }}>
                  Characters: {explanation.length} / 200+
                </Box>
              </Box>
              {canSubmit && !submitted && (
                <Typography variant="body1" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>
                  Ready to submit!
                </Typography>
              )}
            </Box>

            {sentenceCount < 8 && explanation.length > 50 && !submitted && (
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', p: 2, mt: 2
              }}>
                <Typography variant="body2">
                  You need at least {8 - sentenceCount} more sentence{8 - sentenceCount !== 1 ? 's' : ''}. Keep writing!
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                Progress: {Math.min(100, (sentenceCount / 8) * 100).toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (sentenceCount / 8) * 100)}
                sx={{
                  height: 10, borderRadius: 1,
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 1 }
                }}
              />
            </Box>
          </Box>

          {/* Results */}
          {submitted && (
            <Box sx={{
              bgcolor: score >= 6 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 6 ? P.green.shadow : P.yellow.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: score >= 6 ? P.green.border : P.yellow.border, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: score >= 6 ? P.green.shadow : P.yellow.shadow }}>
                {score >= 6 ? 'Excellent Work!' : 'Good Effort!'}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: score >= 6 ? P.green.border : P.yellow.border }}>
                {score} / 8
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.7, mb: 2 }}>Points Earned</Typography>
              <Box sx={{
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
                borderRadius: '12px', p: 2, mt: 2
              }}>
                <Typography variant="body2">
                  Sentences: {sentenceCount} | Characters: {explanation.length} | Words: {explanation.trim().split(/\s+/).length}
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: score >= 6 ? P.green.bg : P.yellow.bg,
                border: `1px solid ${score >= 6 ? P.green.border : P.yellow.border}`,
                borderRadius: '12px', p: 2, mt: 2
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <strong>Feedback:</strong> {feedback}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!submitted && (
              <Box component="button" onClick={handleSubmit}
                disabled={!canSubmit || evaluating}
                sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: (canSubmit && !evaluating) ? 'pointer' : 'not-allowed',
                  color: P.orange.shadow, opacity: (canSubmit && !evaluating) ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', gap: 1,
                  '&:hover': { transform: (canSubmit && !evaluating) ? 'translate(-2px,-2px)' : 'none', boxShadow: (canSubmit && !evaluating) ? `5px 5px 0 ${P.orange.shadow}` : undefined }
                }}>
                {evaluating ? <><CircularProgress size={18} sx={{ color: P.orange.shadow }} /> Evaluating...</> : canSubmit ? 'Submit Explanation' : `Write ${8 - sentenceCount} More Sentences`}
              </Box>
            )}
            {submitted && (
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Continue to Task C: Kahoot Match <ArrowForwardIcon /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
