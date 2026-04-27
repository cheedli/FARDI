import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Grid,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level A2 - Task C: Sentence Builder
 * Write 6 simple sentences for a social media post
 */

const PROMPTS = [
  { id: 1, prompt: 'Festival fun', instruction: 'Write a sentence about having fun at a festival.' },
  { id: 2, prompt: 'Come March 8', instruction: 'Write a sentence inviting people to come on March 8.' },
  { id: 3, prompt: 'Use hashtag', instruction: 'Write a sentence about using a hashtag.' },
  { id: 4, prompt: 'Add emoji', instruction: 'Write a sentence about adding an emoji to your post.' },
  { id: 5, prompt: 'Tag friend', instruction: 'Write a sentence about tagging a friend.' },
  { id: 6, prompt: 'Post photo', instruction: 'Write a sentence about posting a photo.' }
]

export default function Phase4_2Step2RemedialA2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/2/remedial/a2/results') }, [])
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})

  const handleSentenceChange = (id, value) => setSentences({ ...sentences, [id]: value })

  const evaluateSentence = (sentence, prompt) => {
    if (!sentence || sentence.trim().length < 5) return { correct: false, feedback: 'Sentence is too short. Write a complete sentence.' }
    const lower = sentence.toLowerCase()
    const words = lower.split(/\s+/).filter(w => w.length > 0)
    if (words.length < 4) return { correct: false, feedback: 'Sentence needs more words. Try to write at least 4 words.' }
    const promptWords = prompt.prompt.toLowerCase().split(/\s+/)
    const hasRelevantWord = promptWords.some(pw => words.some(w => w.includes(pw) || pw.includes(w)))
    if (!hasRelevantWord) return { correct: false, feedback: `Your sentence should be about: ${prompt.prompt}` }
    if (!/^[A-Z]/.test(sentence.trim())) return { correct: false, feedback: 'Start your sentence with a capital letter.' }
    if (!/[.!?]$/.test(sentence.trim())) return { correct: false, feedback: 'End your sentence with punctuation (. ! ?)' }
    return { correct: true, feedback: 'Good sentence!' }
  }

  const handleSubmit = () => {
    const results = {}
    let correctCount = 0
    PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })
    setEvaluation(results)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskC_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskC_max', '10')
    logTaskCompletion(correctCount, PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'A2', task: 'C', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleFinish = () => navigate('/phase4_2/step/2/remedial/a2/results')

  const allAnswered = PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>
              Level A2 - Task C: Sentence Builder
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Write simple sentences for a social media post about a festival! Remember to start with a capital letter and end with punctuation."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 2, mb: 3
          }}>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              <strong>Instructions:</strong> Write a simple sentence for each prompt.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow }}>
              <strong>Requirements:</strong> At least 4 words, start with capital letter, end with punctuation.
            </Typography>
          </Box>

          {/* Sentence Prompts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {PROMPTS.map(prompt => {
              const result = evaluation[prompt.id]
              const isCorrect = result?.correct

              return (
                <Grid item xs={12} key={prompt.id}>
                  <Box sx={{
                    bgcolor: showResults ? (isCorrect ? P.green.bg : P.red.bg) : (isDark ? '#1a1a2e' : 'white'),
                    border: `2px solid ${showResults ? (isCorrect ? P.green.border : P.red.border) : P.orange.border}`,
                    borderRadius: '20px',
                    boxShadow: `3px 3px 0 ${showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      {prompt.id}. {prompt.prompt}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: isDark ? '#aaa' : '#666' }}>
                      {prompt.instruction}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Write your sentence here..."
                      value={sentences[prompt.id] || ''}
                      onChange={(e) => handleSentenceChange(prompt.id, e.target.value)}
                      disabled={showResults}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: isDark ? '#1a1a2e' : 'white',
                          borderRadius: '12px',
                          '& fieldset': { borderColor: P.orange.border },
                          '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                        }
                      }}
                    />
                    {showResults && result && (
                      <Box sx={{
                        mt: 2, p: 2,
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        border: `1px solid ${isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', gap: 1
                      }}>
                        {isCorrect && <CheckCircleIcon sx={{ color: P.green.shadow }} />}
                        <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                          {result.feedback}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{
              bgcolor: correctCount === PROMPTS.length ? P.green.bg : P.yellow.bg,
              border: `2px solid ${correctCount === PROMPTS.length ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${correctCount === PROMPTS.length ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              {correctCount === PROMPTS.length ? (
                <Typography sx={{ color: P.green.shadow, fontWeight: 700 }}>
                  Perfect! All {PROMPTS.length} sentences are well written!
                </Typography>
              ) : (
                <Typography sx={{ color: P.yellow.shadow }}>
                  You got {correctCount}/{PROMPTS.length} correct. Review the feedback!
                </Typography>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: !allAnswered ? (isDark ? '#2a2a3e' : '#e5e7eb') : P.blue.bg,
                border: `2px solid ${!allAnswered ? (isDark ? '#444' : '#d1d5db') : P.blue.border}`,
                borderRadius: '12px', boxShadow: !allAnswered ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: !allAnswered ? (isDark ? '#555' : '#9ca3af') : P.blue.shadow,
                opacity: !allAnswered ? 0.6 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': !allAnswered ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': !allAnswered ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` }
              }}>
                Submit Sentences
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleFinish} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                View Results <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
