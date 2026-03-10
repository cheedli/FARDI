import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import RolePlayRPGGame from '../../../components/RolePlayRPGGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task A: Role-Play Dialogue (Advanced)
 * Complete an advanced dialogue on attraction with poster/video and terms
 * Gamified as "Role-Play RPG" - level up character with correct terms
 */

// Dialogue structure based on the requirements
const DIALOGUE_LINES = [
  {
    speaker: 'Ms. Mabrouki',
    template: 'Poster or video?',
    blanks: [] // No blanks - NPC dialogue
  },
  {
    speaker: 'You',
    template: '[____] as [____] with [____]; [____] for [____] [____] content.',
    blanks: ['poster', 'eye-catcher', 'slogan', 'video', 'feature', 'engaging']
  },
  {
    speaker: 'Ryan',
    template: 'Use [____] [____].',
    blanks: ['targeted', 'billboard']
  }
]

// Word bank with all required terms
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const WORD_BANK = shuffleArray([
  'poster',
  'eye-catcher',
  'video',
  'feature',
  'targeted',
  'engaging',
  'slogan',
  'billboard'
])

export default function RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_b2' })

  const handleGameComplete = (result) => {
    console.log('B2 Role-Play RPG completed:', result)

    // Store result
    const score = result.score || 0
    const level = result.level || 1
    const xp = result.experiencePoints || 0

    sessionStorage.setItem('remedial_b2_taskA_score', score)
    sessionStorage.setItem('remedial_b2_taskA_level', level)
    sessionStorage.setItem('remedial_b2_taskA_xp', xp)

    // Log to backend
    logTaskCompletion(score, level, xp)

    // Navigate directly to Task B
    setTimeout(() => {
      navigate('/phase4/remedial/b2/taskB')
    }, 1500)
  }

  const logTaskCompletion = async (score, level, xp) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'A',
          score: score,
          max_score: 8, // 8 total blanks (6 from You + 2 from Ryan)
          character_level: level,
          experience_points: xp,
          completed: true
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

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Advanced Marketing Strategy
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task A: Role-Play RPG
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Role-play a marketing strategy meeting and level up your character by using the correct professional terms!
        </Typography>
      </Paper>

      {/* Instructions Card */}
      <Card elevation={3} sx={{ mb: 3, backgroundColor: 'info.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="info.dark">
            Your Mission
          </Typography>
          <Typography variant="body1" paragraph>
            You're in a high-level marketing strategy meeting with Ms. Mabrouki and Ryan. Your goal is to complete the dialogue using advanced marketing terminology.
          </Typography>
        </CardContent>
      </Card>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Welcome to B2 level! This is an advanced marketing discussion. Pay attention to how professionals discuss campaign strategies using specific terminology. Use the word bank to complete your responses and level up your character!"
        />
      </Paper>

      {/* Role-Play RPG Game */}
      <Box>
        <RolePlayRPGGame
          dialogueLines={DIALOGUE_LINES}
          wordBank={WORD_BANK}
          onComplete={handleGameComplete}
          characterName="Marketing Expert"
          scenario="High-Level Marketing Campaign Strategy Meeting"
        />
      </Box>
    </Box>
  )
}
