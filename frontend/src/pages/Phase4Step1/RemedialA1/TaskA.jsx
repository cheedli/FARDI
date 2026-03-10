import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level A1 - Task A: Drag and Drop Matching
 * Timed drag-and-drop game for basic promotion vocabulary
 */

const BASE_URL = import.meta.env.BASE_URL || '/'

const VOCABULARY_PAIRS = [
  {
    word: 'poster',
    definition: 'Paper advertisement with pictures and words',
    image: `${BASE_URL}images/phase4/poster.png`
  },
  {
    word: 'video',
    definition: 'Moving advertisement or promotional clip',
    image: `${BASE_URL}images/phase4/video.png`
  },
  {
    word: 'slogan',
    definition: 'Catchy phrase or short sentence for promotion',
    image: `${BASE_URL}images/phase4/slogan.png`
  },
  {
    word: 'billboard',
    definition: 'Large outdoor advertising sign',
    image: `${BASE_URL}images/phase4/billboard.jpg`
  },
  {
    word: 'commercial',
    definition: 'Short TV or radio advertisement',
    image: `${BASE_URL}images/phase4/commercial.png`
  },
  {
    word: 'eye-catcher',
    definition: 'Something bright or attractive that gets attention',
    image: `${BASE_URL}images/phase4/eye-catcher.png`
  },
  {
    word: 'feature',
    definition: 'Highlight or main part shown in an ad',
    image: `${BASE_URL}images/phase4/feature.png`
  },
  {
    word: 'ad',
    definition: 'Short for advertisement (any promotion)',
    image: `${BASE_URL}images/phase4/ad.png`
  }
]

export default function RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Task A completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_a1_taskA_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeTaken || 0)
  }

  const logTaskCompletion = async (score, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'A',
          score: score,
          max_score: 8,
          time_taken: timeTaken
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task B
    navigate('/phase4/remedial/a1/taskB')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task A: Vocabulary Matching Puzzle
        </Typography>
        <Typography variant="body1">
          Drag images to match them with the correct definitions. Complete all 8 matches within 1 minute and submit!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Let's practice matching promotion words with their pictures! Drag each image from the left side to its matching definition on the right. You have 1 minute to complete all matches, then click Submit. Good luck!"
        />
      </Paper>

      {/* Drag and Drop Game */}
      {!gameCompleted && (
        <Box>
          <DragDropMatchingGame
            pairs={VOCABULARY_PAIRS}
            duration={60}
            onComplete={handleGameComplete}
          />
        </Box>
      )}

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        {gameCompleted && (
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
          >
            Continue to Next Task
          </Button>
        )}
      </Stack>
    </Box>
  )
}
