import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Alert,
  Container,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level A2 - Task C: Sentence Builder
 */

const PROMPTS = [
  { id: 1, term: 'Festival fun', instruction: 'Write a sentence about a festival. Example: "The festival is fun."', expectedWords: ['festival', 'fun', 'is'] },
  { id: 2, term: 'Come March 8', instruction: 'Write a sentence about a date. Example: "Come to the event on March 8."', expectedWords: ['come', 'march', '8'] },
  { id: 3, term: 'Use hashtag', instruction: 'Write a sentence about using a hashtag. Example: "Use hashtag for posts."', expectedWords: ['use', 'hashtag', 'post'] },
  { id: 4, term: 'Add emoji', instruction: 'Write a sentence about adding an emoji. Example: "Add emoji to show feeling."', expectedWords: ['add', 'emoji', 'show'] },
  { id: 5, term: 'Tag friend', instruction: 'Write a sentence about tagging a friend. Example: "Tag your friend in the photo."', expectedWords: ['tag', 'friend', 'photo'] },
  { id: 6, term: 'Post photo', instruction: 'Write a sentence about posting a photo. Example: "Post a photo on social media."', expectedWords: ['post', 'photo', 'social'] },
]

export default function Phase4_2Step4RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 4, interaction: 3, context: 'remedial_a2' })
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

  const [sentences, setSentences] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState({})
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleSentenceChange = (id, value) => {
    setSentences({ ...sentences, [id]: value })
  }

  const evaluateSentence = (sentence, prompt) => {
    if (!sentence || sentence.trim().length < 5) {
      return { correct: false, feedback: 'Sentence is too short. Write a complete sentence.' }
    }
    const lower = sentence.toLowerCase()
    const words = lower.split(/\s+/).filter(w => w.length > 0)
    if (words.length < 2) {
      return { correct: false, feedback: 'Sentence needs more words. Write at least 2 words.' }
    }
    const hasCapital = /^[A-Z]/.test(sentence.trim())
    const hasPunctuation = /[.!?]$/.test(sentence.trim())
    if (!hasCapital) return { correct: false, feedback: 'Start your sentence with a capital letter.' }
    if (!hasPunctuation) return { correct: false, feedback: 'End your sentence with punctuation (. ! ?)' }
    const hasExpectedWord = prompt.expectedWords.some(ew => {
      const cleanWord = ew.replace(/[^a-z0-9@#]/gi, '')
      return lower.includes(cleanWord.toLowerCase())
    })
    if (!hasExpectedWord) return { correct: false, feedback: `Try to write about: ${prompt.term}` }
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
    sessionStorage.setItem('phase4_2_step4_a2_taskC', correctCount.toString())
    logTaskCompletion(correctCount, PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: '4_remedial', level: 'A2', task: 'C', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleFinish = () => {
    navigate('/phase4_2/step/4/remedial/a2/results')
  }

  const allAnswered = PROMPTS.every(p => sentences[p.id]?.trim())
  const correctCount = Object.values(evaluation).filter(e => e.correct).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>Level A2 - Task C: Sentence Builder</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage speaker="Ryan" message="Let's build simple sentences! Write one sentence for each social media topic. Keep it simple and clear. Look at the examples for help!" />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Write a simple sentence for each topic. Keep it short and simple.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Requirements:</strong> At least 2 words, start with capital, end with punctuation.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Scoring:</strong> 1 point per correct sentence (Pass: 4/6)</Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {PROMPTS.map(prompt => {
              const result = evaluation[prompt.id]
              let cardBg = P.teal.bg, cardBorder = P.teal.border, cardShadow = P.teal.shadow
              if (showResults && result) {
                cardBg = result.correct ? P.green.bg : P.red.bg
                cardBorder = result.correct ? P.green.border : P.red.border
                cardShadow = result.correct ? P.green.shadow : P.red.shadow
              } else if (sentences[prompt.id]?.trim()) {
                cardBg = P.blue.bg; cardBorder = P.blue.border; cardShadow = P.blue.shadow
              }
              return (
                <Grid item xs={12} key={prompt.id}>
                  <Box sx={{ bgcolor: cardBg, border: `2px solid ${cardBorder}`, borderRadius: '16px', p: 3, boxShadow: `3px 3px 0 ${cardShadow}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box component="span" sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.orange.shadow, display: 'inline-block' }}>{prompt.id}. {prompt.term}</Box>
                      {showResults && result?.correct && <CheckCircleIcon sx={{ color: P.green.shadow }} />}
                    </Box>
                    <Typography variant="body2" sx={{ color: P.teal.shadow, fontStyle: 'italic', mb: 2 }}>{prompt.instruction}</Typography>
                    <Box
                      component="textarea"
                      rows={2}
                      placeholder="Write your sentence here..."
                      value={sentences[prompt.id] || ''}
                      onChange={(e) => handleSentenceChange(prompt.id, e.target.value)}
                      disabled={showResults || isEvaluating}
                      sx={{
                        width: '100%', fontFamily: 'inherit', fontSize: '1rem', p: 1.5,
                        border: `2px solid ${cardBorder}`, borderRadius: '10px',
                        bgcolor: 'white', resize: 'vertical', outline: 'none',
                        '&:focus': { border: `2px solid ${P.blue.border}` },
                      }}
                    />
                    {showResults && result && (
                      <Alert severity={result.correct ? 'success' : 'error'} icon={result.correct ? <CheckCircleIcon /> : undefined} sx={{ mt: 2 }}>
                        <Typography>{result.feedback}</Typography>
                        {!result.correct && <Typography variant="caption" display="block" sx={{ mt: 1 }}>Hint: {prompt.instruction}</Typography>}
                      </Alert>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{
              bgcolor: correctCount >= 4 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${correctCount >= 4 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${correctCount >= 4 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ color: correctCount >= 4 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {correctCount >= 4 ? 'Great work! You passed!' : 'Keep practicing!'}
              </Typography>
              <Typography sx={{ color: correctCount >= 4 ? P.green.shadow : P.yellow.shadow }}>
                Correct: <strong>{correctCount}/{PROMPTS.length}</strong>
              </Typography>
              {correctCount < 4 && <Typography sx={{ color: P.yellow.shadow }}>You need at least 4/6 to pass. Review the feedback and examples!</Typography>}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered || isEvaluating} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allAnswered || isEvaluating ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered || isEvaluating ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>
                {isEvaluating ? <><CircularProgress size={18} />&nbsp;Evaluating...</> : 'Submit Sentences'}
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleFinish} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>View Final Results <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
