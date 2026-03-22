import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Grid, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A2 - Task B: Expand Quest
 */

const SENTENCE_PROMPTS = [
  { id: 1, prompt: 'Post has hashtag.', connector: 'because', example: 'Post has hashtag because viral.' },
  { id: 2, prompt: 'Caption is words.', connector: 'and', example: 'Caption is words and emoji.' },
  { id: 3, prompt: 'Story has photo.', connector: 'because', example: 'Story has photo because memory.' },
  { id: 4, prompt: 'Friend likes post.', connector: 'and', example: 'Friend likes post and shares.' },
  { id: 5, prompt: 'Tag is important.', connector: 'because', example: 'Tag is important because search.' },
  { id: 6, prompt: 'Emoji shows feeling.', connector: 'and', example: 'Emoji shows feeling and color.' },
  { id: 7, prompt: 'Share is fast.', connector: 'because', example: 'Share is fast because click.' },
  { id: 8, prompt: 'Profile has name.', connector: 'and', example: 'Profile has name and picture.' }
]

export default function Phase4_2RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})
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

  const evaluateSentence = (sentence, originalPrompt, expectedConnector) => {
    if (!sentence || sentence.trim().length < originalPrompt.length + 5) return { correct: false, feedback: 'Sentence is too short - you need to expand it!' }
    const lower = sentence.toLowerCase()
    const hasConnector = lower.includes('because') || lower.includes('and')
    if (!hasConnector) return { correct: false, feedback: 'Must include "because" or "and"' }
    const promptWords = originalPrompt.toLowerCase().replace('.', '').split(' ')
    const startsCorrectly = promptWords.every(word => lower.includes(word))
    if (!startsCorrectly) return { correct: false, feedback: 'Must start with the original sentence' }
    const connectorIndex = Math.max(lower.indexOf('because'), lower.indexOf('and'))
    const afterConnector = sentence.slice(connectorIndex).trim()
    const wordsAfter = afterConnector.split(/\s+/).length
    if (wordsAfter < 2) return { correct: false, feedback: 'Add more detail after the connector' }
    return { correct: true, feedback: 'Good expansion!' }
  }

  const handleSubmit = () => {
    const results = {}
    let correctCount = 0
    SENTENCE_PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt.prompt, prompt.connector)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })
    setEvaluation(results)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / SENTENCE_PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_a2_taskB_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_remedial_a2_taskB_max', '10')
    logTaskCompletion(correctCount, SENTENCE_PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'A2', task: 'B', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/1/remedial/a2/taskC') }
  const allAnswered = SENTENCE_PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level A2 - Task B: Expand Quest</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Expand these sentences by adding 'because' or 'and' with more detail! Make your sentences longer and more interesting!" />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Expand each sentence by adding "because" or "and" with logical detail. Look at the examples!</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Evaluation:</strong> Must add connector ("because" or "and") and logical detail.</Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {SENTENCE_PROMPTS.map(prompt => {
              const result = evaluation[prompt.id]
              return (
                <Grid item xs={12} key={prompt.id}>
                  <Box sx={{
                    bgcolor: showResults ? (result?.correct ? P.green.bg : P.red.bg) : P.orange.bg,
                    border: `2px solid ${showResults ? (result?.correct ? P.green.border : P.red.border) : P.orange.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${showResults ? (result?.correct ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                    p: 3,
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (result?.correct ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      {prompt.id}. Expand: "{prompt.prompt}"
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Example: <em>{prompt.example}</em></Typography>
                    <TextField fullWidth multiline rows={2} placeholder="Write your expanded sentence here..."
                      value={sentences[prompt.id] || ''} onChange={(e) => setSentences({ ...sentences, [prompt.id]: e.target.value })} disabled={showResults} />
                    {showResults && result && (
                      <Box sx={{ mt: 2, bgcolor: result.correct ? P.green.bg : P.red.bg, border: `2px solid ${result.correct ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {result.correct && <CheckCircleIcon sx={{ color: P.green.shadow }} />}
                          <Typography sx={{ color: result.correct ? P.green.shadow : P.red.shadow, fontWeight: 600 }}>{result.feedback}</Typography>
                        </Box>
                        {!result.correct && <Typography variant="caption" display="block" sx={{ mt: 1, color: P.red.shadow }}>Example: {prompt.example}</Typography>}
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{ bgcolor: correctCount === SENTENCE_PROMPTS.length ? P.green.bg : P.yellow.bg, border: `2px solid ${correctCount === SENTENCE_PROMPTS.length ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${correctCount === SENTENCE_PROMPTS.length ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: correctCount === SENTENCE_PROMPTS.length ? P.green.shadow : P.yellow.shadow }}>
                {correctCount === SENTENCE_PROMPTS.length ? `Perfect! All ${SENTENCE_PROMPTS.length} sentences are correctly expanded!` : `You got ${correctCount}/${SENTENCE_PROMPTS.length} correct. Review the feedback and try to add more detail!`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Sentences</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
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
