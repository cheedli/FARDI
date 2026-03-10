import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'

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
    // Calculate total score from all 3 interactions
    const interaction1Score = parseInt(sessionStorage.getItem('phase4_step4_interaction1_score') || '0')
    const interaction2Score = parseInt(sessionStorage.getItem('phase4_step4_interaction2_score') || '0')
    const interaction3Score = parseInt(sessionStorage.getItem('phase4_step4_interaction3_score') || '0')

    const totalScore = interaction1Score + interaction2Score + interaction3Score

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - INTERACTION SUMMARY')
    console.log('='.repeat(60))
    console.log('Interaction 1 Score:', interaction1Score, '/5')
    console.log('Interaction 2 Score:', interaction2Score, '/5')
    console.log('Interaction 3 Score:', interaction3Score, '/5')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/15')
    console.log('='.repeat(60))

    // Check if student should proceed: I3 (sentence production) score >= 3 means B1+ level
    const shouldProceed = interaction3Score >= 3
    if (shouldProceed) {
      console.log(`→ I3 score ${interaction3Score}/5 >= 3 (B1+). Proceeding to Step 5.`)
      console.log('='.repeat(60) + '\n')
      navigate('/phase4/step/5')
      return
    }

    // Route based on total score:
    // 0-3 pts → Remedial A1
    // 4-6 pts → Remedial A2
    // 7-9 pts → Remedial B1
    // 10-12 pts → Remedial B2
    // 13-15 pts → Remedial C1

    if (totalScore <= 3) {
      console.log('→ Routing to Remedial A1 (0-3 points)')
      navigate('/phase4/step/4/remedial/a1/taskA')
    } else if (totalScore <= 6) {
      console.log('→ Routing to Remedial A2 (4-6 points)')
      navigate('/phase4/step/4/remedial/a2/taskA')
    } else if (totalScore <= 9) {
      console.log('→ Routing to Remedial B1 (7-9 points)')
      navigate('/phase4/step/4/remedial/b1/taskA')
    } else if (totalScore <= 12) {
      console.log('→ Routing to Remedial B2 (10-12 points)')
      navigate('/phase4/step/4/remedial/b2/taskA')
    } else {
      console.log('→ Routing to Remedial C1 (13-15 points)')
      navigate('/phase4/step/4/remedial/c1/taskA')
    }
    console.log('='.repeat(60) + '\n')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Apply - Interaction 3
        </Typography>
        <Typography variant="body1">
          Polish your writing with vocabulary integration
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="To polish your writing, play a game and integrate terms."
        />
      </Paper>

      {/* Vocabulary Words */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
          Vocabulary Words to Practice:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {VOCABULARY_WORDS.map((word, index) => (
            <Chip key={index} label={word} color="secondary" />
          ))}
        </Stack>
      </Paper>

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 4 }}>
        <SushiSpellGame
          targetWords={VOCABULARY_WORDS}
          onComplete={handleGameComplete}
        />
      </Box>

      {/* Question Section - Only show after game is completed */}
      {gameResult && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Write a revised sentence using one vocabulary term you spelled
          </Typography>

          {gameResult.foundWords.length > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>You spelled these words:</strong> {gameResult.foundWords.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Pick one of these words and write a sentence showing how you revised/fixed it in your poster description or video script!
              </Typography>
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom fontWeight="bold">
              Hint:
            </Typography>
            <Typography variant="body2">
              Use Sushi Spell for "animation" because... then add to your script.
            </Typography>
          </Alert>

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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !revisedSentence.trim()}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Revised Sentence'}
            </Button>
          )}
        </Paper>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'success.lighter',
            border: '2px solid',
            borderColor: 'success.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: 'success.main',
                mr: 2
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="success.dark">
                Vocabulary Integration Complete!
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                Score: {evaluation.score}/5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CEFR Level: {evaluation.level}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.details && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Evaluation Details:
              </Typography>
              {evaluation.details.usedTerm && (
                <Typography variant="body2">
                  Vocabulary Term Used: {evaluation.details.usedTerm}
                </Typography>
              )}
              {evaluation.details.grammar && (
                <Typography variant="body2">
                  Grammar: {evaluation.details.grammar}
                </Typography>
              )}
              {evaluation.details.structure && (
                <Typography variant="body2">
                  Structure: {evaluation.details.structure}
                </Typography>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            {(evaluation?.score || 0) >= 3 ? 'Continue to Step 5' : 'Continue to Remedial Activities'}
          </Button>
        </Paper>
      )}
    </Box>
  )
}
