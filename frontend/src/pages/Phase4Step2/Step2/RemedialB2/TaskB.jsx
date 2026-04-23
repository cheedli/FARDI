import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, LinearProgress, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CreateIcon from '@mui/icons-material/Create'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import { useProgressSave } from '../../../../hooks/useProgressSave'
import { requestPhase42TaskBScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 2 - Remedial B2 - Task B: Explain Expedition
 * Write an 8-sentence explanation of planning a social media post
 * 8 guided questions to answer (from spec document)
 * AI evaluation for content quality
 * Score: 0-10 points based on quality
 */

const GUIDED_QUESTIONS = [
  'What role does a hashtag play in your post?',
  'How long should your caption be?',
  'Why should you include emojis?',
  'What is a call-to-action and why is it important?',
  'When is the best time to post?',
  'How do you measure engagement?',
  'What makes content go viral?',
  'How should you respond to comments?'
]

export default function RemedialB2TaskB() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 2, context: 'remedial_b2' })
  const [explanation, setExplanation] = useState('')
  const [sentenceCount, setSentenceCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleTextChange = (e) => {
    const text = e.target.value
    setExplanation(text)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    try {
      const data = await requestPhase42TaskBScore(2, 'B2', {
        paragraph: explanation,
        expected_sentences: 8,
        topic: 'planning a social media post',
        guided_questions: GUIDED_QUESTIONS,
      })

      setScore(data.score)
      setFeedback(data.feedback)
      sessionStorage.setItem('remedial_phase4_2_step2_b2_taskB_score', data.score)
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'B', step: 2, score: data.score, max_score: 10, completed: true })
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
    navigate('/phase4_2/step/2/remedial/b2/taskC')
  }

  const canSubmit = sentenceCount >= 8 && explanation.trim().length >= 200

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Phase 4.2 - Step 2: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Level B2 - Task B: Explain Expedition
            </Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>
              Write an 8-sentence explanation about planning a social media post!
            </Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Time to showcase your writing skills! Write a well-structured explanation (8 sentences minimum) about how to plan an effective social media post. Answer the guided questions below in your explanation. Use clear examples and explain your ideas thoroughly!"
            />
          </Box>

          {/* Guided Questions */}
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <QuizIcon sx={{ fontSize: 32, color: P.green.shadow }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.shadow }}>
                Guided Questions to Answer
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: P.green.shadow, fontWeight: 500, mb: 2 }}>
              Include answers to these 8 questions in your explanation:
            </Typography>
            <Stack spacing={1}>
              {GUIDED_QUESTIONS.map((question, idx) => (
                <Box key={idx} sx={{
                  bgcolor: isDark ? '#1a1a2e' : 'white',
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '12px',
                  p: 2,
                  borderLeft: `4px solid ${P.green.border}`
                }}>
                  <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#2c3e50', fontWeight: 500 }}>
                    <strong>{idx + 1}.</strong> {question}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Writing Prompt */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CreateIcon sx={{ fontSize: 32, color: P.blue.shadow }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Writing Prompt
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: P.blue.shadow, fontWeight: 500, mb: 2 }}>
              <strong>Topic:</strong> How do you plan an effective social media post?
            </Typography>
            <Typography variant="body2" sx={{ color: P.blue.shadow }}>
              Write a comprehensive explanation that covers hashtag strategy, caption writing, emoji usage,
              calls-to-action, posting times, engagement measurement, viral content strategies, and comment management.
            </Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Your Explanation
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={16}
              value={explanation}
              onChange={handleTextChange}
              placeholder="Write your explanation here... Answer each of the 8 guided questions above. Start with an introduction, develop your ideas with specific strategies and examples, and conclude with a strong statement about effective social media post planning."
              variant="outlined"
              disabled={submitted || evaluating}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDark ? '#1a1a2e' : 'white',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.yellow.border, borderWidth: 2 },
                  '&:hover fieldset': { borderColor: P.yellow.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.yellow.shadow },
                  '& textarea': { color: isDark ? '#eee' : '#1a252f', fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.8 }
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Box sx={{
                  bgcolor: sentenceCount >= 8 ? P.green.bg : P.orange.bg,
                  border: `2px solid ${sentenceCount >= 8 ? P.green.border : P.orange.border}`,
                  borderRadius: '10px', px: 2, py: 0.5,
                  color: sentenceCount >= 8 ? P.green.shadow : P.orange.shadow,
                  fontWeight: 'bold', fontSize: '0.9rem'
                }}>
                  Sentences: {sentenceCount} / 8
                </Box>
                <Box sx={{
                  bgcolor: explanation.length >= 200 ? P.green.bg : P.blue.bg,
                  border: `2px solid ${explanation.length >= 200 ? P.green.border : P.blue.border}`,
                  borderRadius: '10px', px: 2, py: 0.5,
                  color: explanation.length >= 200 ? P.green.shadow : P.blue.shadow,
                  fontWeight: 'bold', fontSize: '0.9rem'
                }}>
                  Characters: {explanation.length} / 200+
                </Box>
              </Stack>
              {canSubmit && !submitted && (
                <Typography variant="body1" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>
                  Ready to submit!
                </Typography>
              )}
            </Box>

            {sentenceCount < 8 && explanation.length > 50 && !submitted && (
              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                  You need at least {8 - sentenceCount} more sentence{8 - sentenceCount !== 1 ? 's' : ''}. Keep writing!
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: P.yellow.shadow, fontWeight: 600 }}>
                Progress: {Math.min(100, (sentenceCount / 8) * 100).toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (sentenceCount / 8) * 100)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Box>

          {/* Results */}
          {submitted && (
            <Box sx={{
              bgcolor: score >= 8 ? P.green.bg : P.orange.bg,
              border: `3px solid ${score >= 8 ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= 8 ? P.green.shadow : P.orange.shadow}`,
              p: 4, mb: 3
            }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: score >= 8 ? P.green.shadow : P.orange.shadow, mb: 1 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: score >= 8 ? P.green.shadow : P.orange.shadow }}>
                  {score >= 8 ? 'Excellent Work!' : 'Good Effort!'}
                </Typography>
                <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${score >= 8 ? P.green.border : P.orange.border}`, borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 2 }}>
                  <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 8 ? P.green.shadow : P.orange.shadow }}>
                    {score} / 10
                  </Typography>
                  <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#666' }}>
                    Points Earned
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${score >= 8 ? P.green.border : P.orange.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ color: score >= 8 ? P.green.shadow : P.orange.shadow, fontWeight: 500 }}>
                  <strong>Feedback:</strong> {feedback}
                </Typography>
              </Box>

              <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `1px solid ${score >= 8 ? P.green.border : P.orange.border}`, borderRadius: '12px', p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark ? '#ccc' : '#2c3e50', mb: 1 }}>
                  Your Statistics:
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#34495e' }}>
                  Sentences: {sentenceCount} | Characters: {explanation.length} | Words: {explanation.trim().split(/\s+/).length}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={!canSubmit || evaluating} sx={{
                bgcolor: canSubmit && !evaluating ? P.green.bg : P.blue.bg,
                border: `2px solid ${canSubmit && !evaluating ? P.green.border : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${canSubmit && !evaluating ? P.green.shadow : P.blue.shadow}`,
                px: 6, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: canSubmit && !evaluating ? 'pointer' : 'not-allowed',
                color: canSubmit && !evaluating ? P.green.shadow : P.blue.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': canSubmit && !evaluating ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
                '&:active': { transform: 'translate(0,0)' }
              }}>
                {evaluating ? 'Evaluating...' : canSubmit ? 'Submit Explanation' : `Write ${8 - sentenceCount} More Sentences`}
              </Box>
            )}
            {submitted && (
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 6, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.blue.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)' }
              }}>
                Continue to Task C: Matching Game
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
