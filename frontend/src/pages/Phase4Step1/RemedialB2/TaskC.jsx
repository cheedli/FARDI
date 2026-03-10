import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellAdvancedGame from '../../../components/SushiSpellAdvancedGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task C: Sushi Spell Advanced
 * Spell and match 8 advanced marketing terms to scenarios
 * Gamified vocabulary matching game
 */

const ADVANCED_TERMS = [
  {
    term: 'viral',
    scenario: 'Video spread'
  },
  {
    term: 'slogan',
    scenario: 'Poster phrase'
  },
  {
    term: 'billboard',
    scenario: 'Outdoor advertising'
  },
  {
    term: 'jingle',
    scenario: 'Catchy tune'
  },
  {
    term: 'engaging',
    scenario: 'Holds attention'
  },
  {
    term: 'targeted',
    scenario: 'Specific audience'
  },
  {
    term: 'commercial',
    scenario: 'Paid advertisement'
  },
  {
    term: 'influencer',
    scenario: 'Social media promoter'
  }
]

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_b2' })

  const handleGameComplete = (result) => {
    console.log('B2 Sushi Spell completed:', result)

    // Store result
    const score = result.score || 0
    const timeElapsed = result.timeElapsed || 0

    sessionStorage.setItem('remedial_b2_taskC_score', score)
    sessionStorage.setItem('remedial_b2_taskC_time', timeElapsed)

    // Log to backend
    logTaskCompletion(score, timeElapsed, result.spelledTerms)

    // Navigate to Task D
    setTimeout(() => {
      navigate('/phase4/remedial/b2/taskD')
    }, 1500)
  }

  const logTaskCompletion = async (score, timeElapsed, spelledTerms) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'C',
          score: score,
          max_score: ADVANCED_TERMS.length,
          time_taken: timeElapsed,
          spelled_terms: spelledTerms,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task C completion logged to backend')
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
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          🍣 Sushi Spell Advanced
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task C: Vocabulary Matching
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Spell advanced marketing terms by selecting letters, then match them to their scenarios!
        </Typography>
      </Paper>

      {/* Instructions Card */}
      <Card elevation={3} sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            How to Play
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This game is inspired by British Council's Sushi Spell. You'll see a scenario, and you need to spell the matching marketing term!
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
            Game Rules:
          </Typography>
          <ul style={{ marginTop: 0 }}>
            <li>Read the scenario carefully</li>
            <li>Click letters from the Sushi Belt to spell the term</li>
            <li>Click on spelled letters to remove them if you make a mistake</li>
            <li>Click Submit when you think you've spelled it correctly</li>
            <li>Complete all 8 terms to win!</li>
          </ul>
        </CardContent>
      </Card>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Welcome to Sushi Spell Advanced! This game tests your spelling AND your understanding of marketing vocabulary. Match each scenario to the correct term by spelling it out. Pay attention - some letters are extras to make it more challenging!"
        />
      </Paper>

      {/* Vocabulary Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="info.dark">
          Terms You'll Spell:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          viral • slogan • billboard • jingle • engaging • targeted • commercial • influencer
        </Typography>
      </Paper>

      {/* Sushi Spell Game */}
      <Box>
        <SushiSpellAdvancedGame
          terms={ADVANCED_TERMS}
          onComplete={handleGameComplete}
        />
      </Box>
    </Box>
  )
}
