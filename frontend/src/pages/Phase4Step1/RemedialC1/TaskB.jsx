import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CritiqueChallengeGame from '../../../components/CritiqueChallengeGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const CRITIQUE_QUESTIONS = [
  { id: 1, question: 'Analyze poster effectiveness' },
  { id: 2, question: 'Compare poster and video reach' },
  { id: 3, question: 'Evaluate surrogate advertising strategy' },
  { id: 4, question: 'Critique guerilla marketing tactics' },
  { id: 5, question: 'Assess remarketing effectiveness' },
  { id: 6, question: 'Analyze geotargeting benefits' },
  { id: 7, question: 'Compare infomercial vs commercial' },
  { id: 8, question: 'Evaluate viral marketing potential' }
]

const GLOSSARY_TERMS = [
  'surrogate', 'guerilla', 'remarketing', 'geotargeting', 'infomercial', 'viral',
  'billboard', 'eye-catcher', 'slogan', 'targeted', 'engaging', 'commercial'
]

export default function RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Critique Challenge completed:', result)

    sessionStorage.setItem('remedial_c1_taskB_score', result.score)
    sessionStorage.setItem('remedial_c1_taskB_badge', result.badgeLevel)

    console.log('✅ Task B Score stored in sessionStorage:', {
      score: sessionStorage.getItem('remedial_c1_taskB_score'),
      badge: sessionStorage.getItem('remedial_c1_taskB_badge')
    })

    logTaskCompletion(result.score, result.badgeLevel, result.answers)

    setTimeout(() => {
      navigate('/phase4/remedial/c1/taskC')
    }, 1500)
  }

  const logTaskCompletion = async (score, badgeLevel, answers) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'B',
          score: score,
          max_score: CRITIQUE_QUESTIONS.length,
          badge_level: badgeLevel,
          answers: answers,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">🏆 Critique Challenge</Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Write 8 sophisticated critiques using advanced marketing terminology. Earn badges with each excellent critique!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Write nuanced critiques with comparative analysis. Use C1-level vocabulary and demonstrate deep understanding of marketing concepts!"
        />
      </Paper>

      <Box>
        <CritiqueChallengeGame
          questions={CRITIQUE_QUESTIONS}
          glossaryTerms={GLOSSARY_TERMS}
          onComplete={handleGameComplete}
        />
      </Box>
    </Box>
  )
}
