import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SentenceBuilder from '../../../components/exercises/SentenceBuilder.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Level A2 - Task B: Sentence Expansion
 * Expand 8 sentences for poster/video descriptions
 * Score: +1 per correctly expanded sentence (8 total)
 */

const SENTENCE_BUILDER_EXERCISE = {
  instruction: 'Expand each sentence by adding the missing details',
  templates: [
    'Gatefold is ___.',
    'Lettering is ___.',
    'Animation is ___.',
    'Jingle is ___.',
    'Dramatisation is ___.',
    'Sketch is ___.',
    'Clip is ___.',
    'Storytelling is ___.'
  ],
  correct_answers: [
    'Gatefold is fold in poster.',
    'Lettering is text on poster.',
    'Animation is move in video.',
    'Jingle is song in video.',
    'Dramatisation is story act.',
    'Sketch is plan draw.',
    'Clip is short part.',
    'Storytelling is tell story.'
  ]
}

export default function Phase4Step4RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_a2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const handleGameComplete = (result) => {
    // SentenceBuilder now awards 1 point per correct sentence
    const finalScore = result.score || 0

    console.log('[Phase 4 Step 4] A2 Task B - Sentence Expansion completed')
    console.log('[Phase 4 Step 4] A2 Task B - Score:', finalScore, '/ 8')

    setScore(finalScore)
    sessionStorage.setItem('phase4_step4_remedial_a2_taskB_score', finalScore)
    logTaskCompletion(finalScore)
    setGameCompleted(true)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'B',
          score: score,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A2 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/a2/taskC')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 4: Apply - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task B: Expand Empire
        </Typography>
        <Typography variant="body1">
          Expand sentences to build your empire - add details to each term!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="MS. MABROUKI"
          message="Welcome to the Expand Empire! Build your knowledge empire by expanding simple sentences. Drag words to complete each sentence with the right details. Each correct expansion earns you 1 point and adds to your empire!"
        />
      </Paper>

      {/* Sentence Builder Game */}
      {!gameCompleted && (
        <Box>
          <SentenceBuilder
            exercise={SENTENCE_BUILDER_EXERCISE}
            onComplete={handleGameComplete}
          />
        </Box>
      )}

      {/* Navigation */}
      {gameCompleted && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
          >
            Next: Task C (Connector Quest) →
          </Button>
        </Stack>
      )}
    </Box>
  )
}
