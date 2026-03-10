import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 1 - Interaction 2: Sushi Spell Game
 * Practice spelling sponsorship and budgeting vocabulary using Sushi Spell
 */

// Target words for Phase 3 - Sponsorship & Budgeting vocabulary
const TARGET_WORDS = [
  'sponsor',
  'budget',
  'funding',
  'expense',
  'donation',
  'ticket',
  'profit',
  'cost'
]

export default function Phase3Step1Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 2, context: 'main' })
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: result })
    console.log('Sushi Spell Game completed:', result)
    setGameResult(result)

    // Store result - score based on words found
    const score = result.foundWords?.length || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase3_step1_int2_score', score)
    sessionStorage.setItem('phase3_step1_int2_time', timeElapsed)
    sessionStorage.setItem('phase3_step1_int2_words', JSON.stringify(result.foundWords || []))

    // Log to backend
    logGameCompletion(score, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (score, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          step: 1,
          interaction: 2,
          score: score,
          max_score: 8,
          time_taken: timeElapsed,
          found_words: foundWords,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 2 completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/1/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 2
        </Typography>
        <Typography variant="body1">
          Practice spelling financial vocabulary using Sushi Spell
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="SKANDER"
          message="Time for a fun spelling challenge! Play Sushi Spell to practice your financial vocabulary. Create words from the letters that fall. The longer the word, the more points you earn!"
        />
      </Paper>

      {/* Instructions - WITHOUT showing target words */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
          How to Play:
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            • Click letters as they fall to spell words
          </Typography>
          <Typography variant="body2">
            • Think of words related to sponsorship, budgets, and funding
          </Typography>
          <Typography variant="body2">
            • Longer words give more points!
          </Typography>
          <Typography variant="body2">
            • Click "Submit Word" when you're ready to check your spelling
          </Typography>
        </Stack>
      </Paper>

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 4 }}>
        <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
      </Box>

      {/* Results Display - Show after game completion */}
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
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }}>
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
            >
              Continue to Next Activity
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
