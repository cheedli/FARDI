import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const TARGET_WORDS = ['please', 'thank you', 'first', 'then', 'next', 'careful', 'safety', 'guide', 'welcome', 'help', 'queue']

export default function Phase5SubPhase2Step3Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 3, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    sessionStorage.setItem('phase5_subphase2_step3_interaction3_score', '1')
    setTimeout(() => {
      navigate('/phase5/subphase/2/step/3/score')
    }, 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 3: Explain - Interaction 3
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="You heard many important instruction terms in the videos! To practise more, play 'Sushi Spell' individually for 2 minutes and spell as many words as you can from these target words: please, thank you, first, then, next, careful, safety, guide, welcome, help, queue."
        />
      </Paper>

      <SushiSpellGame
        step={3}
        interaction={3}
        subphase={2}
        targetTime={120}
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
