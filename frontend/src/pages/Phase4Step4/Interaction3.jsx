import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Container,
  useTheme
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 Interaction 3: Vocabulary Integration with Sushi Spell
 * Students play Sushi Spell to spell 5 terms, then write a revised sentence using one of those terms
 */

const VOCABULARY_WORDS = [
  'gatefold',
  'dramatisation',
  'animation',
  'jingle',
  'lettering',
  'sketch'
]

export default function Phase4Step4Interaction3() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'main' })
  const [revisedSentence, setRevisedSentence] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
 
  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Sushi Spell game completed:', result)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!revisedSentence.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please write a revised sentence using one of the vocabulary terms you spelled.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step4/evaluate-vocabulary-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          spelledTerms: gameResult?.foundWords?.join(', ') || '',
          revisedSentence: revisedSentence.trim()
        })
      })

      const data = await response.json()

      // Always show feedback with score
      setEvaluation({
        success: true,
        score: data.score || 0,
        level: data.level || 'A1',
        feedback: data.feedback || 'Good work!',
        details: data.details || {}
      })
      setSubmitted(true)

      // Store score for later
      sessionStorage.setItem('phase4_step4_interaction3_score', data.score || 0)
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on CEFR criteria
      const sentenceLower = revisedSentence.toLowerCase()
      const wordCount = revisedSentence.split(/\s+/).length

      // Check if any vocabulary term is used in the revised sentence
      const usedTerm = VOCABULARY_WORDS.find(term => sentenceLower.includes(term.toLowerCase()))

      // Grammar indicators
      const hasSubjectVerb = /\b(poster|video|script|scene)\s+(has|uses|features|employs|adds|incorporates)\b/i.test(revisedSentence)
      const hasArticles = /\b(a|an|the)\b/i.test(revisedSentence)
      const hasProperStructure = wordCount >= 5

      // Error detection indicators
      const mentionsError = sentenceLower.includes('fixed') || sentenceLower.includes('corrected') ||
                           sentenceLower.includes('revised') || sentenceLower.includes('detected')
      const showsImprovement = sentenceLower.includes('to') && hasSubjectVerb

      // Advanced writing indicators
      const hasComplex = sentenceLower.includes('which') || sentenceLower.includes('that') ||
                        sentenceLower.includes(',')
      const hasAdvancedVocab = sentenceLower.includes('autonomous') || sentenceLower.includes('leverage') ||
                              sentenceLower.includes('incorporate') || sentenceLower.includes('narrative drive')

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Complex sentence with error detection and sophisticated revision
      if (usedTerm && wordCount >= 15 && hasComplex && hasAdvancedVocab && mentionsError) {
        score = 5
        level = 'C1'
        feedback = `Excellent! You successfully spelled "${usedTerm}" in Sushi Spell and leveraged it in a sophisticated revised sentence. Your sentence demonstrates autonomous error detection (identifying run-on sentences or structure issues) and complex grammar with clauses. Outstanding improvement!`
      }
      // B2: 4 points - Well-structured revision with clear improvement
      else if (usedTerm && wordCount >= 10 && hasSubjectVerb && hasArticles && (mentionsError || showsImprovement)) {
        score = 4
        level = 'B2'
        feedback = `Very good! You incorporated "${usedTerm}" from Sushi Spell into a well-structured revised sentence. You showed clear improvement from the original sentence with better grammar and structure. Good work on autonomous correction!`
      }
      // B1: 3 points - Uses term correctly with basic revision
      else if (usedTerm && wordCount >= 8 && hasSubjectVerb && hasProperStructure) {
        score = 3
        level = 'B1'
        feedback = `Good! You used "${usedTerm}" from Sushi Spell in your revised sentence. Your sentence shows improvement with subject-verb agreement and proper structure. Keep working on identifying and fixing errors autonomously.`
      }
      // A2: 2 points - Basic use of term with some structure
      else if (usedTerm && wordCount >= 5 && hasProperStructure) {
        score = 2
        level = 'A2'
        feedback = `Good start! You used "${usedTerm}" in your sentence. Try to show more clearly how you revised/fixed the original sentence. Explain the improvement you made.`
      }
      // A1: 1 point - Very basic attempt
      else if (usedTerm && revisedSentence.trim().length > 0) {
        score = 1
        level = 'A1'
        feedback = 'You made an attempt. Use ONE of the terms you spelled and show how you fixed errors in grammar/spelling/structure.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a revised sentence using one of the vocabulary terms you spelled in the game, showing how you fixed errors.'
      }

      // Always show feedback with score (no retry)
      setEvaluation({
        success: true,
        score,
        level,
        feedback,
        details: {
          usedTerm: usedTerm || 'None detected',
          grammar: hasSubjectVerb ? 'Good subject-verb agreement' : 'Check subject-verb agreement',
          structure: hasProperStructure ? 'Good structure' : 'Sentence needs more development'
        }
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step4_interaction3_score', score)
      console.log(`[Phase 4 Step 4 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    const interaction1Score = parseInt(sessionStorage.getItem('phase4_step4_interaction1_score') || '0')
    const interaction2Score = parseInt(sessionStorage.getItem('phase4_step4_interaction2_score') || '0')
    const interaction3Score = parseInt(sessionStorage.getItem('phase4_step4_interaction3_score') || '0')
    fetch('/api/phase4/step/4/calculate-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3Score
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || 'Failed to calculate Step 4 score')
        }
        const nextUrl = data.data.total.next_url
        sessionStorage.setItem('phase4_step4_next_url', nextUrl)
        sessionStorage.setItem('student_cefr_level', data.data.total.remedial_level.replace('Remedial ', ''))
        navigate(nextUrl)
      })
      .catch(error => {
        console.error('Failed to calculate Step 4 score:', error)
        alert('Error calculating your Step 4 route. Please try again.')
      })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 4: Apply - Interaction 3
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Polish your writing with vocabulary integration
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ryan"
              message="To polish your writing, play a game and integrate terms."
            />
          </Box>

          {/* Vocabulary Words */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Vocabulary Words to Practice:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {VOCABULARY_WORDS.map((word, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                  display: 'inline-block'
                }}>
                  {word}
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Sushi Spell Game */}
          <Box sx={{ mb: 4 }}>
            <SushiSpellGame
              targetWords={VOCABULARY_WORDS}
              onComplete={handleGameComplete}
            />
          </Box>

          {/* Question Section - Only show after game is completed */}
          {gameResult && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Write a revised sentence using one vocabulary term you spelled
              </Typography>

              {gameResult.foundWords.length > 0 && (
                <Box sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `2px 2px 0 ${P.green.shadow}`,
                  p: 2, mb: 2,
                }}>
                  <Typography variant="body2" sx={{ color: P.green.shadow }}>
                    <strong>You spelled these words:</strong> {gameResult.foundWords.join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: P.green.shadow }}>
                    Pick one of these words and write a sentence showing how you revised/fixed it in your poster description or video script!
                  </Typography>
                </Box>
              )}

              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `2px 2px 0 ${P.blue.shadow}`,
                p: 2, mb: 2,
              }}>
                <Typography variant="body2" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                  Hint:
                </Typography>
                <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                  Use Sushi Spell for "animation" because... then add to your script.
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder='Example: Use Sushi Spell for "jingle"—revised script: "Add jingle for music" fixed to "The script adds a jingle for catchy music".'
                value={revisedSentence}
                onChange={(e) => setRevisedSentence(e.target.value)}
                disabled={submitted}
                sx={{ mb: 2 }}
              />

              {!submitted && (
                <Box component="button" onClick={handleSubmit} disabled={loading || !revisedSentence.trim()} sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: (loading || !revisedSentence.trim()) ? 'not-allowed' : 'pointer',
                  color: P.orange.shadow, width: '100%', opacity: (loading || !revisedSentence.trim()) ? 0.6 : 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
                }}>
                  {loading ? <CircularProgress size={24} /> : 'Submit Revised Sentence'}
                </Box>
              )}
            </Box>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.shadow, mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: P.green.shadow }}>
                    Vocabulary Integration Complete!
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: P.blue.shadow }}>
                    Score: {evaluation.score}/5
                  </Typography>
                  <Box component="span" sx={{
                    bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                    display: 'inline-block', mt: 0.5
                  }}>
                    CEFR Level: {evaluation.level}
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: P.green.shadow }}>
                {evaluation.feedback}
              </Typography>

              {evaluation.details && (
                <Box sx={{ mt: 2, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: P.green.shadow }}>
                    Evaluation Details:
                  </Typography>
                  {evaluation.details.usedTerm && (
                    <Typography variant="body2" sx={{ color: P.green.shadow }}>
                      Vocabulary Term Used: {evaluation.details.usedTerm}
                    </Typography>
                  )}
                  {evaluation.details.grammar && (
                    <Typography variant="body2" sx={{ color: P.green.shadow }}>
                      Grammar: {evaluation.details.grammar}
                    </Typography>
                  )}
                  {evaluation.details.structure && (
                    <Typography variant="body2" sx={{ color: P.green.shadow }}>
                      Structure: {evaluation.details.structure}
                    </Typography>
                  )}
                </Box>
              )}

              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.blue.shadow, width: '100%', mt: 3,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` }
              }}>
                {(evaluation?.score || 0) >= 3 ? 'Continue to Step 5' : 'Continue to Remedial Activities'}
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
