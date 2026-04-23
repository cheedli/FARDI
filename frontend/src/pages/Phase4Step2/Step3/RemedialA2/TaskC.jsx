import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Container, TextField, CircularProgress
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level A2 - Task C: Sentence Builder
 * Write 6 simple sentences using social media terms
 * Client-side evaluation with basic grammar checks
 */

const PROMPTS = [
  {
    id: 1,
    term: 'Hashtag',
    instruction: 'Write a sentence about hashtag.',
    expectedWords: ['hashtag', '#', 'is']
  },
  {
    id: 2,
    term: 'Caption',
    instruction: 'Write a sentence about caption.',
    expectedWords: ['caption', 'is', 'word']
  },
  {
    id: 3,
    term: 'Emoji',
    instruction: 'Write a sentence about emoji.',
    expectedWords: ['emoji', 'is', 'smile']
  },
  {
    id: 4,
    term: 'Tag',
    instruction: 'Write a sentence about tag.',
    expectedWords: ['tag', 'is', '@']
  },
  {
    id: 5,
    term: 'Call-to-action',
    instruction: 'Write a sentence about call-to-action.',
    expectedWords: ['call', 'action', 'is', 'do']
  },
  {
    id: 6,
    term: 'Post',
    instruction: 'Write a sentence about post.',
    expectedWords: ['post', 'is', 'picture']
  }
]

export default function Phase4_2Step3RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})
  const [isEvaluating, setIsEvaluating] = useState(false)

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

  const handleSentenceChange = (id, value) => {
    setSentences({ ...sentences, [id]: value })
  }

  const evaluateSentence = (sentence, prompt) => {
    if (!sentence || sentence.trim().length < 5) {
      return { correct: false, feedback: 'Sentence is too short. Write a complete sentence.' }
    }

    const lower = sentence.toLowerCase()
    const words = lower.split(/\s+/).filter(w => w.length > 0)

    if (words.length < 3) {
      return { correct: false, feedback: 'Sentence needs more words. Write at least 3 words.' }
    }

    const hasSimpleVerb = lower.includes('is') || lower.includes('are') || lower.includes('am')

    if (!hasSimpleVerb) {
      return { correct: false, feedback: 'Use simple present tense. Try using "is" in your sentence.' }
    }

    const termWords = prompt.term.toLowerCase().split(/[-\s]+/)
    const hasTerm = termWords.some(tw => lower.includes(tw))

    if (!hasTerm) {
      return { correct: false, feedback: `Your sentence should be about: ${prompt.term}` }
    }

    const hasCapital = /^[A-Z]/.test(sentence.trim())
    const hasPunctuation = /[.!?]$/.test(sentence.trim())

    if (!hasCapital) {
      return { correct: false, feedback: 'Start your sentence with a capital letter.' }
    }

    if (!hasPunctuation) {
      return { correct: false, feedback: 'End your sentence with punctuation (. ! ?)' }
    }

    const hasExpectedWord = prompt.expectedWords.some(ew => {
      const cleanWord = ew.replace(/[^a-z0-9@#]/gi, '')
      return lower.includes(cleanWord.toLowerCase())
    })

    if (!hasExpectedWord) {
      return { correct: false, feedback: `Try to explain what ${prompt.term} means or does.` }
    }

    return { correct: true, feedback: 'Good sentence! Simple and clear!' }
  }

  const handleSubmit = async () => {
    setIsEvaluating(true)

    const results = {}
    let correctCount = 0

    PROMPTS.forEach(prompt => {
      const result = evaluateSentence(sentences[prompt.id], prompt)
      results[prompt.id] = result
      if (result.correct) correctCount++
    })

    setEvaluation(results)
    setIsEvaluating(false)
    setShowResults(true)

    sessionStorage.setItem('phase4_2_step3_a2_taskC', correctCount.toString())
    logTaskCompletion(correctCount, PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'A2', task: 'C', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleFinish = () => { navigate('/phase4_2/step/3/remedial/a2/results') }

  const allAnswered = PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>Phase 4.2 Step 3 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>Level A2 - Task C: Sentence Builder</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ryan" message="Let's build simple sentences! Write one sentence about each social media term. Use simple present tense and keep it clear!" />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1"><strong>Instructions:</strong> Write a simple sentence for each term. Explain what it is or what it does.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><strong>Requirements:</strong> At least 3 words, use "is" or simple verb, start with capital, end with punctuation.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Reference:</strong>{' '}
              <a href="https://www.eslgamesplus.com/sentence-building-exercises/" target="_blank" rel="noopener noreferrer" style={{ color: P.blue.border }}>
                ESL Games Plus Sentence Builder
              </a>
            </Typography>
          </Box>

          {/* Sentence Prompts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {PROMPTS.map(prompt => {
              const result = evaluation[prompt.id]
              let bg = P.orange.bg; let border = P.orange.border; let shadow = P.orange.shadow
              if (showResults && result?.correct) { bg = P.green.bg; border = P.green.border; shadow = P.green.shadow }
              else if (showResults && result && !result.correct) { bg = P.red.bg; border = P.red.border; shadow = P.red.shadow }
              else if (sentences[prompt.id]?.trim()) { bg = P.blue.bg; border = P.blue.border; shadow = P.blue.shadow }

              return (
                <Grid item xs={12} key={prompt.id}>
                  <Box sx={{ bgcolor: bg, border: `2px solid ${border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${shadow}`, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box component="span" sx={{
                        bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                        borderRadius: '999px', px: 2, py: 0.3,
                        fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow
                      }}>{prompt.term}</Box>
                      {showResults && result?.correct && <CheckCircleIcon sx={{ color: P.green.border }} />}
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary' }}>
                      {prompt.instruction}
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Write your sentence here..."
                      value={sentences[prompt.id] || ''}
                      onChange={(e) => handleSentenceChange(prompt.id, e.target.value)}
                      disabled={showResults || isEvaluating}
                      sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px', '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '1rem' } }}
                    />

                    {showResults && result && (
                      <Box sx={{
                        bgcolor: result.correct ? P.green.bg : P.red.bg,
                        border: `1px solid ${result.correct ? P.green.border : P.red.border}`,
                        borderRadius: '8px', mt: 2, p: 1.5
                      }}>
                        <Typography variant="body2">{result.feedback}</Typography>
                        {!result.correct && (
                          <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                            Hint: {prompt.instruction}
                          </Typography>
                        )}
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
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Perfect! All {PROMPTS.length} sentences are well written!
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Sentences Correct: {correctCount}/{PROMPTS.length}
                  </Typography>
                  <Typography>Review the feedback and examples. Remember to use simple present tense!</Typography>
                </>
              )}
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered || isEvaluating} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (allAnswered && !isEvaluating) ? 'pointer' : 'not-allowed',
                color: P.orange.shadow, opacity: (allAnswered && !isEvaluating) ? 1 : 0.5,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: (allAnswered && !isEvaluating) ? 'translate(-2px,-2px)' : 'none', boxShadow: (allAnswered && !isEvaluating) ? `5px 5px 0 ${P.orange.shadow}` : `3px 3px 0 ${P.orange.shadow}` }
              }}>
                {isEvaluating ? <><CircularProgress size={18} sx={{ color: P.orange.shadow }} /> Evaluating...</> : 'Submit Sentences'}
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleFinish} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>View Final Results <ArrowForwardIcon /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
