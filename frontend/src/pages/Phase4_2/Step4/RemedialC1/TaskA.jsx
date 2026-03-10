import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DebateDuelGame from '../../../../components/DebateDuelGame.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level C1 - Task A: Debate Simulation
 * Advanced dialogue on post strategies with sophisticated terminology
 */

const DEBATE_LINES = [
  {
    speaker: 'Opponent',
    template: 'Are [____] truly essential for discoverability?',
    blanks: ['hashtag']
  },
  {
    speaker: 'You',
    template: 'Absolutely, they amplify reach when paired with compelling [____].',
    blanks: ['caption']
  },
  {
    speaker: 'Opponent',
    template: 'What role do emojis and visuals play?',
    blanks: []
  },
  {
    speaker: 'You',
    template: '[____] adds emotional tone, while [____] potential drives shares.',
    blanks: ['emoji', 'viral']
  },
  {
    speaker: 'Opponent',
    template: 'How do you optimize for measurable outcomes?',
    blanks: []
  },
  {
    speaker: 'You',
    template: 'Strategic [____] creates [____] and drives conversions.',
    blanks: ['call-to-action', 'engagement']
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
  'hashtag',
  'caption',
  'viral',
  'engagement',
  'emoji',
  'call-to-action',
  'analytics',
  'impressions',
  'conversion',
  'targeting'
])

export default function Phase4_2Step4RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Debate Simulation completed:', result)

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

    sessionStorage.setItem('phase4_2_step4_c1_taskA_score', correctWordsCount)
    sessionStorage.setItem('phase4_2_step4_c1_taskA_won', result.won)

    console.log('Stored in sessionStorage:', {
      score: sessionStorage.getItem('phase4_2_step4_c1_taskA_score'),
      won: sessionStorage.getItem('phase4_2_step4_c1_taskA_won')
    })

    logTaskCompletion(correctWordsCount, result.won)

    setTimeout(() => {
      navigate('/phase4_2/step/4/remedial/c1/taskB')
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
          phase: '4.2',
          step: 4,
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
        <Typography variant="h3" gutterBottom fontWeight="bold">Debate Simulation</Typography>
        <Typography variant="h5" gutterBottom>Phase 4.2 Step 4 - Level C1 - Task A</Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Engage in an advanced debate about post strategies using sophisticated social media terminology!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="This is C1 level - demonstrate advanced argumentation! Use sophisticated social media terminology including hashtag strategy, viral dynamics, engagement metrics, compelling captions, expressive emojis, and strategic call-to-action. Score 3/4 to pass!"
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
