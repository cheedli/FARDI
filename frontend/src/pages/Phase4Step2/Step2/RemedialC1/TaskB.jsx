import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Container, Stack } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level C1 - Task B: Analytical Writing
 * Write 8-sentence analysis of post effectiveness with guided questions
 */

const GUIDED_QUESTIONS = [
  'How do hashtags impact post discoverability and reach?',
  'What role does the caption play in engaging the audience?',
  'Why are emojis important for visual communication?',
  'How does tagging users increase engagement?',
  'What makes a call-to-action effective?',
  'How do these elements work together to create viral potential?',
  'What metrics would you use to measure post success?',
  'How can you optimize posts for maximum engagement?'
]

export default function Phase4_2Step2RemedialC1TaskB() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 2, context: 'remedial_c1' })
  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setAnalysis(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = Math.min((sentenceCount / 8) * 10, 10)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskB_score', score.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskB_max', '10')
    logTaskCompletion(sentenceCount, 8)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'B', score: score, max_score: maxScore, content: analysis })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => { navigate('/phase4_2/step/2/remedial/c1/taskC') }
  window.__remedialSkip = handleNext
  const isComplete = sentenceCount >= 8

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>
              Level C1 - Task B: Analytical Writing
            </Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Write a sophisticated analysis of Instagram post effectiveness. Use the guided questions below to structure your 8-sentence analysis. Demonstrate critical thinking, precise terminology, and examine multiple perspectives on what makes social media posts successful."
            />
          </Box>

          {/* Guided Questions */}
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Guided Questions (Answer each in your analysis):
            </Typography>
            <Stack spacing={1}>
              {GUIDED_QUESTIONS.map((question, idx) => (
                <Box key={idx} sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `1px solid ${P.purple.border}`, borderRadius: '10px', p: 1.5 }}>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}>
                    {idx + 1}. {question}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              <strong>Instructions:</strong> Write an 8-sentence analysis addressing each guided question above. Use sophisticated vocabulary and demonstrate critical thinking about post effectiveness.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}>
              <strong>Key terms to include:</strong> hashtag strategy, caption engagement, emoji psychology, user tagging, call-to-action effectiveness, viral potential, analytics metrics, optimization techniques.
            </Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.yellow.shadow }}>
              Your Analysis
            </Typography>
            <TextField
              fullWidth multiline rows={16}
              value={analysis}
              onChange={handleTextChange}
              placeholder="Write your analytical essay here... Address each of the 8 guided questions in a well-structured analysis."
              variant="outlined"
              disabled={showResults}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDark ? '#1a1a2e' : 'white',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.yellow.border, borderWidth: 2 },
                  '&:hover fieldset': { borderColor: P.yellow.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.yellow.shadow },
                  '& textarea': { color: isDark ? '#eee' : '#1a252f', fontWeight: 500, fontSize: '1.05rem' }
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>
                Words: {wordCount} | Sentences: {sentenceCount} | Target: 8 sentences
              </Typography>
              {isComplete && !showResults && (
                <Typography variant="caption" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>
                  Ready to submit!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Results */}
          {showResults && (
            <Box sx={{
              bgcolor: isComplete ? P.green.bg : P.yellow.bg,
              border: `2px solid ${isComplete ? P.green.border : P.yellow.border}`,
              borderRadius: '16px',
              boxShadow: `3px 3px 0 ${isComplete ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: isComplete ? P.green.shadow : P.yellow.shadow }}>
                {isComplete ? 'Excellent Analytical Writing!' : 'Good Start!'}
              </Typography>
              <Typography sx={{ color: isComplete ? P.green.shadow : P.yellow.shadow }}>
                You wrote {sentenceCount} sentences with {wordCount} words.
                {isComplete ? ' Your analysis demonstrates advanced critical thinking and sophisticated use of social media terminology.' : ' Try to reach the 8-sentence target for full credit.'}
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={sentenceCount < 6} sx={{
                bgcolor: sentenceCount >= 6 ? P.green.bg : P.blue.bg,
                border: `2px solid ${sentenceCount >= 6 ? P.green.border : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${sentenceCount >= 6 ? P.green.shadow : P.blue.shadow}`,
                px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: sentenceCount >= 6 ? 'pointer' : 'not-allowed',
                color: sentenceCount >= 6 ? P.green.shadow : P.blue.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': sentenceCount >= 6 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {},
              }}>
                Submit Analysis
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.blue.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
              }}>
                <ArrowForwardIcon /> Continue to Task C
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
