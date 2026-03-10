import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DebateDuelGame from '../../../components/DebateDuelGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const DEBATE_LINES = [
  {
    speaker: 'Opponent',
    template: 'Poster best?',
    blanks: []
  },
  {
    speaker: 'You',
    template: 'Poster for [____] with [____]; video for [____] [____].',
    blanks: ['geotargeting', 'slogan', 'viral', 'remarketing']
  }
]

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const WORD_BANK = shuffleArray([
  'surrogate',
  'guerilla',
  'remarketing',
  'geotargeting',
  'infomercial',
  'viral',
  'slogan'
])

export default function RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Debate Duel completed:', result)

    // Count correct words from completedLines
    let correctWordsCount = 0
    if (result.completedLines) {
      result.completedLines.forEach(line => {
        if (line.validation) {
          correctWordsCount += line.validation.filter(v => v === true).length
        }
      })
    }

    console.log(`Task A Score: ${correctWordsCount} correct words out of 4`)

    sessionStorage.setItem('remedial_c1_taskA_score', correctWordsCount)
    sessionStorage.setItem('remedial_c1_taskA_won', result.won)

    console.log('✅ Stored in sessionStorage:', {
      score: sessionStorage.getItem('remedial_c1_taskA_score'),
      won: sessionStorage.getItem('remedial_c1_taskA_won')
    })

    logTaskCompletion(correctWordsCount, result.won)

    setTimeout(() => {
      navigate('/phase4/remedial/c1/taskB')
    }, 1500)
  }

  const logTaskCompletion = async (score, won) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'A',
          score: score,
          max_score: 4,
          won: won,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)', color: 'white' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">⚔️ Debate Duel</Typography>
        <Typography variant="h5" gutterBottom>Level C1 - Task A: Advanced Marketing Debate</Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Duel with an AI opponent! Win rounds by using advanced marketing terms correctly.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="This is C1 level - the most advanced! Use sophisticated marketing terminology like geotargeting, remarketing, and viral strategy. Each correct term wins you a round!"
        />
      </Paper>

      <Box>
        <DebateDuelGame
          debateLines={DEBATE_LINES}
          wordBank={WORD_BANK}
          onComplete={handleGameComplete}
        />
      </Box>
    </Box>
  )
}
