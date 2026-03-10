import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Interaction 3: Sushi Spell Game
 * Practice spelling social media vocabulary using Sushi Spell
 */

// Target words for Phase 4.2 - Social Media vocabulary
const TARGET_WORDS = [
  'hashtag',
  'caption',
  'viral',
  'engagement',
  'emoji',
  'tag',
  'story',
  'call-to-action'
]

export default function Phase4_2Step1Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'main' })
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Sushi Spell Game completed:', result)
    setGameResult(result)

    // Store result - score based on words found
    const score = result.foundWords?.length || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase4_2_step1_int3_score', score)
    sessionStorage.setItem('phase4_2_step1_int3_time', timeElapsed)
    sessionStorage.setItem('phase4_2_step1_int3_words', JSON.stringify(result.foundWords || []))

    // Log to backend
    logGameCompletion(score, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (score, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          step: 1,
          interaction: 3,
          score: score,
          max_score: TARGET_WORDS.length,
          time_taken: timeElapsed,
          found_words: foundWords,
          completed: true,
          game_type: 'sushi_spell'
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 3 (Sushi Spell) logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    // Calculate total score from all 3 interactions in Step 1
    const int1Score = parseInt(sessionStorage.getItem('phase4_2_step1_interaction1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase4_2_step1_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step1_int3_score') || '0')

    const totalScore = int1Score + int2Score + int3Score
    const totalMax = int1Score + 5 + TARGET_WORDS.length // Wordshake score varies, int2 max=5, int3 max=8
    const percentage = (totalScore / totalMax) * 100

    // Store total score for Step 1
    sessionStorage.setItem('phase4_2_step1_total_score', totalScore.toString())
    sessionStorage.setItem('phase4_2_step1_total_max', totalMax.toString())
    sessionStorage.setItem('phase4_2_step1_percentage', percentage.toFixed(2))

    console.log(`[Phase 4.2 Step 1 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)

    // Route based on 80% threshold
    if (percentage >= 80) {
      console.log('[Phase 4.2 Step 1] ≥80% → Proceeding to Step 2')
      navigate('/app/phase4_2/step/2/interaction/1')
    } else {
      console.log('[Phase 4.2 Step 1] <80% → Need to retry')
      alert(`Your score was ${percentage.toFixed(1)}%. You need 80% or higher to proceed to Step 2. Please review the material and try again.`)
      navigate('/app/phase4_2/step/1/interaction/1')
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 3
        </Typography>
        <Typography variant="body1">
          Practice spelling social media vocabulary using Sushi Spell
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="To practise more social media terms, let's play another quick individual game!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
          How to Play:
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            • Click letters as they fall to spell words
          </Typography>
          <Typography variant="body2">
            • Think of words related to social media: hashtag, caption, viral, engagement, emoji, tag, story, call-to-action
          </Typography>
          <Typography variant="body2">
            • Longer words give more points!
          </Typography>
          <Typography variant="body2">
            • Click "Submit Word" when you're ready to check your spelling
          </Typography>
        </Stack>
      </Paper>

      {/* Hint */}
      {!gameResult && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Hint:</strong> Try longer words like "call-to-action" or "engagement" for higher scores.
          </Typography>
        </Alert>
      )}

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 4 }}>
        <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
      </Box>

      {/* Results Display */}
      {gameResult && (
        <>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 3,
              backgroundColor: 'success.lighter',
              border: 2,
              borderColor: 'success.main'
            }}
          >
            <Typography variant="h4" gutterBottom textAlign="center" color="success.dark">
              🎮 Game Complete!
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h5" gutterBottom textAlign="center">
                Your Performance
              </Typography>

              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" color="success.main">
                  {gameResult.foundWords?.length || 0}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Words Found
                </Typography>
              </Box>

              {gameResult.foundWords && gameResult.foundWords.length > 0 && (
                <Box sx={{ my: 3 }}>
                  <Typography variant="subtitle1" gutterBottom textAlign="center" fontWeight="bold">
                    Words You Spelled:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }} useFlexGap>
                    {gameResult.foundWords.map((word, index) => (
                      <Alert key={index} severity="success" sx={{ mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {word}
                        </Typography>
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {gameResult.foundWords && gameResult.foundWords.length >= 5 && (
              <Typography variant="h6" textAlign="center" color="success.dark" sx={{ mt: 2 }}>
                ✨ Excellent spelling skills!
              </Typography>
            )}
          </Paper>

          {/* Continue Button */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
              fullWidth
            >
              Complete Step 1 - Return to Dashboard
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
