import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3: Explain - Interaction 3
 * Sushi Spell + explain one spelled term's importance in a post-event report
 */

const TARGET_WORDS = ['success', 'challenge', 'feedback', 'improve', 'achievement', 'strength', 'weakness', 'recommend', 'summary', 'positive', 'negative', 'evidence']

export default function Phase6SP1Step3Int3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 3, context: 'main' })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp1_step3_interaction3_score', score.toString())
    try { await phase6API.trackGame(3, 3, gameData, 1) } catch (e) { console.error('Track failed:', e) }
    setTimeout(() => navigate('/phase6/subphase/1/step/3/score'), 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Explain - Interaction 3</Typography>
        <Typography variant="body1">Sushi Spell - Practise report and reflection terms from the video</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ryan"
          message="To practise more report and reflection terms from the video, play 'Sushi Spell' individually for 2 minutes and spell as many words as you can. Try longer words like 'achievement' or 'recommend' for higher scores!"
        />
      </Paper>
      <SushiSpellGame step={3} interaction={3} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
    </Box>
  )
}
