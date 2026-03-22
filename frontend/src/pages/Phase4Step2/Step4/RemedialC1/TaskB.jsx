import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level C1 - Task B: Analysis Writing (8 sentences)
 * Analyze post effectiveness with guided questions
 */

const GUIDED_QUESTIONS = [
  'How do strategic hashtags amplify reach and discoverability?',
  'What role does a compelling caption play in audience engagement?',
  'Why do emojis function as emotional cues in posts?',
  'How does a call-to-action create behavioral triggers?',
  'What benefits does strategic tagging provide for network expansion?',
  'How do timing and visual quality affect post performance?',
  'What analytics metrics measure post effectiveness?',
  'How can data-driven optimization amplify post impact?'
]

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

export default function Phase4_2Step4RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [aiScore, setAiScore] = useState(null)
  const [aiFeedback, setAiFeedback] = useState('')
  const [evaluating, setEvaluating] = useState(false)

  const handleTextChange = (e) => {
    const text = e.target.value
    setAnalysis(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'C1',
          task: 'B',
          text: analysis,
          criteria: 'sophisticated analytical paragraph on post effectiveness with cohesive argumentation'
        })
      })

      const data = await response.json()
      setAiScore(data.score || 0)
      setAiFeedback(data.feedback || 'Analysis evaluated.')
      sessionStorage.setItem('phase4_2_step4_c1_taskB_score', data.score || 0)
    } catch (error) {
      console.error('AI evaluation failed:', error)
      const fallbackScore = Math.min((sentenceCount / 8) * 8, 8)
      setAiScore(fallbackScore)
      setAiFeedback('Evaluated based on sentence count.')
      sessionStorage.setItem('phase4_2_step4_c1_taskB_score', fallbackScore)
    }

    setEvaluating(false)
    setShowResults(true)
    logTaskCompletion()
  }

  const logTaskCompletion = async () => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: aiScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'C1',
          task: 'B',
          score: aiScore,
          max_score: 8,
          content: analysis
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/c1/taskC')
  }

  const isComplete = sentenceCount >= 8

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task B: Analysis Writing</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Write a sophisticated 8-sentence analytical paragraph on post effectiveness. Use the guided questions and examples to structure your analysis with advanced vocabulary, precise terminology, and cohesive argumentation. Score 7/8 to pass!"
            />
          </Box>

          {/* Guided Questions */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.blue.shadow }}>
              Guided Questions (Answer each in your analysis):
            </Typography>
            {GUIDED_QUESTIONS.map((question, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2, color: P.blue.shadow }}>
                {idx + 1}. {question}
              </Typography>
            ))}
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}>
              <strong>Instructions:</strong> Write an 8-sentence analytical paragraph addressing each guided question. Use sophisticated vocabulary and demonstrate critical thinking.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.teal.shadow }}>
              <strong>Key terms to include:</strong> strategic hashtags, compelling captions, emotional cues, behavioral triggers, network expansion, analytics metrics, optimization.
            </Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.purple.shadow }}>
              Your Analytical Paragraph
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={16}
              value={analysis}
              onChange={handleTextChange}
              placeholder="Write your analytical paragraph here... Address how strategic hashtags amplify reach, how compelling captions engage audiences, why emojis function as emotional cues, how CTAs trigger behavior, how tagging expands networks, how timing/quality affect performance, which metrics measure effectiveness, and how optimization amplifies impact."
              variant="outlined"
              disabled={showResults}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box component="span" sx={{
                bgcolor: isComplete ? P.green.bg : P.yellow.bg,
                border: `2px solid ${isComplete ? P.green.border : P.yellow.border}`,
                borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.8rem', fontWeight: 700,
                color: isComplete ? P.green.shadow : P.yellow.shadow, display: 'inline-block',
              }}>
                Words: {wordCount} | Sentences: {sentenceCount} | Target: 8 sentences
              </Box>
              {isComplete && !showResults && (
                <Box component="span" sx={{ color: P.green.shadow, fontWeight: 700, fontSize: '0.9rem' }}>
                  Ready to submit!
                </Box>
              )}
            </Box>
          </Box>

          {/* Results */}
          {showResults && (
            <Box sx={{
              bgcolor: aiScore >= 7 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${aiScore >= 7 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${aiScore >= 7 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: aiScore >= 7 ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                {aiScore >= 7 ? 'Excellent Analytical Writing!' : 'Good Effort!'}
              </Typography>
              <Typography variant="body1" sx={{ color: aiScore >= 7 ? P.green.shadow : P.yellow.shadow }}>
                AI Score: {aiScore}/8 points
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: aiScore >= 7 ? P.green.shadow : P.yellow.shadow }}>
                {aiFeedback}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={sentenceCount < 6 || evaluating} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: sentenceCount < 6 || evaluating ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: sentenceCount < 6 || evaluating ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>
                {evaluating ? <><CircularProgress size={18} />&nbsp;Evaluating...</> : 'Submit Analysis'}
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task C <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
