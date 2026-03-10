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
 * Phase 4 Step 3 Interaction 3: Sushi Spell Game
 * Students play Sushi Spell to practice spelling advertising vocabulary,
 * then explain the connection between the game, a word, and the videos
 */

const VOCABULARY_WORDS = [
  'persuasive', 'targeted', 'creative', 'dramatisation',
  'goal', 'obstacles', 'friction'
]

export default function Phase4Step3Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'main' })
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Game completed:', result)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please explain how to use Sushi Spell with one of the vocabulary words.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/evaluate-game-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question: 'How would you use Sushi Spell to practice one vocabulary word from the videos?',
          answer: answer.trim(),
          vocabularyWords: VOCABULARY_WORDS,
          expectedElements: ['game', 'word', 'video', 'spelling', 'practice'],
          level: 'B1'
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'B1',
          feedback: data.feedback || 'Good explanation!'
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase4_step3_interaction3_score', data.score || 1)
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: data.feedback || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation
      const answerLower = answer.toLowerCase()

      // Check if mentions a vocabulary word
      const mentionsWord = VOCABULARY_WORDS.some(word => answerLower.includes(word))
      const mentionsGame = answerLower.includes('sushi') || answerLower.includes('spell') || answerLower.includes('game')
      const mentionsVideo = answerLower.includes('video') || answerLower.includes('first') || answerLower.includes('second')
      const mentionsPractice = answerLower.includes('practice') || answerLower.includes('learn') || answerLower.includes('spell')

      let score = 1 // A1 baseline
      let level = 'A1'

      const wordCount = answer.split(/\s+/).length

      if (mentionsWord && mentionsGame && mentionsVideo && wordCount >= 15) {
        score = 5 // C1
        level = 'C1'
      } else if (mentionsWord && mentionsGame && (mentionsVideo || mentionsPractice) && wordCount >= 12) {
        score = 4 // B2
        level = 'B2'
      } else if (mentionsWord && (mentionsGame || mentionsPractice) && wordCount >= 8) {
        score = 3 // B1
        level = 'B1'
      } else if (mentionsWord && wordCount >= 5) {
        score = 2 // A2
        level = 'A2'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback: score >= 3
          ? 'Good explanation! You connected the game, word, and videos well.'
          : 'Good start! Try to explain how the game helps with a specific word from the videos.'
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step3_interaction3_score', score)
      console.log(`[Phase 4 Step 3 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // Calculate total score from all 3 interactions
    const score1 = parseInt(sessionStorage.getItem('phase4_step3_interaction1_score') || '0')
    const score2 = parseInt(sessionStorage.getItem('phase4_step3_interaction2_score') || '0')
    const score3 = parseInt(sessionStorage.getItem('phase4_step3_interaction3_score') || '0')
    const totalScore = score1 + score2 + score3

    // Store total score
    sessionStorage.setItem('phase4_step3_total_score', totalScore)

    // Check if student should proceed: I3 (sentence production) score >= 3 means B1+ level
    const shouldProceed = score3 >= 3
    if (shouldProceed) {
      console.log(`[Phase 4 Step 3] I3 score ${score3}/5 >= 3 (B1+). Proceeding to Step 4.`)
      navigate('/phase4/step/4')
      return
    }

    // Route to remedial phase based on total score
    // A1: <=3, A2: <=6, B1: <=9, B2: <=12, C1: <=15
    let remedialPath = ''

    if (totalScore <= 3) {
      remedialPath = '/phase4/step/3/remedial/a1/task/a'
    } else if (totalScore <= 6) {
      remedialPath = '/phase4/step/3/remedial/a2/task/a'
    } else if (totalScore <= 9) {
      remedialPath = '/phase4/step/3/remedial/b1/task/a'
    } else if (totalScore <= 12) {
      remedialPath = '/phase4/step/3/remedial/b2/task/a'
    } else {
      // totalScore <= 15 (C1 level)
      remedialPath = '/phase4/step/3/remedial/c1/task/a'
    }

    console.log(`[Phase 4 Step 3 - TOTAL] Score: ${totalScore}/15 | I3 score: ${score3}/5 (below B1, routing to remedial)`)
    console.log(`[Phase 4 Step 3] Routing to: ${remedialPath}`)
    navigate(remedialPath)
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Interaction 3
        </Typography>
        <Typography variant="body1">
          Use Sushi Spell game to practice advertising vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Use a game to explain more terms from the videos."
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
        <SushiSpellGame onComplete={handleGameComplete} />
      </Box>

      {/* Question Section - Only show after game is completed */}
      {gameResult && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Question: How would you use Sushi Spell to practice one vocabulary word from the videos?
          </Typography>

          {gameResult.foundWords.length > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>You spelled these words:</strong> {gameResult.foundWords.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Pick one of these words and explain how practicing it in Sushi Spell helps you remember it from the videos!
              </Typography>
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Example: Use Sushi Spell to practice spelling 'targeted' because it's timed and the first video mentioned specific audiences..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            sx={{ mb: 2 }}
          />

          {!submitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Answer'}
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
            backgroundColor: evaluation.success ? 'success.lighter' : 'warning.lighter',
            border: '2px solid',
            borderColor: evaluation.success ? 'success.main' : 'warning.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: evaluation.success ? 'success.main' : 'warning.main',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'}>
                {evaluation.success ? 'Answer Submitted!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: {evaluation.score}/5
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {submitted && (() => {
            const score1 = parseInt(sessionStorage.getItem('phase4_step3_interaction1_score') || '0')
            const score2 = parseInt(sessionStorage.getItem('phase4_step3_interaction2_score') || '0')
            const score3 = parseInt(sessionStorage.getItem('phase4_step3_interaction3_score') || '0')
            const totalScore = score1 + score2 + score3

            let assignedLevel = ''
            if (totalScore <= 3) assignedLevel = 'A1'
            else if (totalScore <= 6) assignedLevel = 'A2'
            else if (totalScore <= 9) assignedLevel = 'B1'
            else if (totalScore <= 12) assignedLevel = 'B2'
            else assignedLevel = 'C1'

            return (
              <>
                <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: 'info.lighter' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Overall Performance Summary
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>Interaction 1 (Persuasive):</strong> {score1}/5 points
                    </Typography>
                    <Typography variant="body2">
                      <strong>Interaction 2 (Dramatisation):</strong> {score2}/5 points
                    </Typography>
                    <Typography variant="body2">
                      <strong>Interaction 3 (Game Connection):</strong> {score3}/5 points
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                      <strong>Total Score: {totalScore}/15</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Assigned Level: {assignedLevel}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {score3 >= 3
                        ? 'Great job! You will proceed to the next step.'
                        : `You will now proceed to ${assignedLevel}-level activities.`}
                    </Typography>
                  </Stack>
                </Paper>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleContinue}
                  size="large"
                  fullWidth
                >
                  {score3 >= 3 ? 'Continue to Step 4' : `Continue to ${assignedLevel} Activities`}
                </Button>
              </>
            )
          })()}
        </Paper>
      )}
    </Box>
  )
}
