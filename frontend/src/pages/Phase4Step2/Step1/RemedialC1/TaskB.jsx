import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level C1 - Task B: Analytical Writing
 */

export default function Phase4_2RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 2, context: 'remedial_c1' })
  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  }
  const P = isDark ? DARK : LIGHT

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
    sessionStorage.setItem('phase4_2_remedial_c1_taskB_score', score.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_c1_taskB_max', '10')
    logTaskCompletion(sentenceCount, 8)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'B', score, max_score: maxScore, content: analysis })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const isComplete = sentenceCount >= 8

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task B: Analytical Writing</Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="EMNA" message="Write a sophisticated analysis of social media promotion strategies. Use precise terminology, examine multiple perspectives, and demonstrate critical thinking in 8 well-structured sentences." />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Write an 8-sentence analysis comparing and evaluating different social media promotion strategies.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>What to include:</strong> Influencer marketing, organic vs paid reach, engagement metrics, viral content, authenticity, analytics, conversion strategies, and ROI considerations.</Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow, fontWeight: 'bold' }}>Your Analysis</Typography>
            <TextField fullWidth multiline rows={15} value={analysis} onChange={handleTextChange}
              placeholder="Write your analytical essay here... Compare and evaluate different social media promotion strategies, using sophisticated terminology and examining the effectiveness of various approaches."
              variant="outlined" disabled={showResults}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#1a2a4a' : 'white', '& fieldset': { borderColor: P.blue.border, borderWidth: 2 }, '&.Mui-focused fieldset': { borderColor: P.blue.shadow } } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: P.blue.shadow }}>Words: {wordCount} | Sentences: {sentenceCount} | Target: 8 sentences</Typography>
              {isComplete && !showResults && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: P.green.shadow }} />
                  <Typography variant="caption" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Ready to submit!</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Results */}
          {showResults && (
            <Box sx={{ bgcolor: isComplete ? P.green.bg : P.yellow.bg, border: `2px solid ${isComplete ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${isComplete ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: isComplete ? P.green.shadow : P.yellow.shadow }}>
                {isComplete ? 'Excellent Analytical Writing!' : 'Good Start!'}
              </Typography>
              <Typography sx={{ color: isComplete ? P.green.shadow : P.yellow.shadow }}>
                You wrote {sentenceCount} sentences with {wordCount} words.
                {isComplete ? ' Your analysis demonstrates advanced critical thinking and sophisticated use of social media promotion terminology.' : ' Try to reach the 8-sentence target for full credit.'}
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={sentenceCount < 6} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: sentenceCount < 6 ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: sentenceCount < 6 ? 0.6 : 1,
                '&:hover': sentenceCount >= 6 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
              }}>Submit Analysis</Box>
            )}
            {showResults && (
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/c1/taskC')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task C</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
