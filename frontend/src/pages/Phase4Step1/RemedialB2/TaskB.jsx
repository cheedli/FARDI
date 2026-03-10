import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CompareQuestGame from '../../../components/CompareQuestGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task B: Compare Quest Writing
 * Write an 8-sentence paragraph comparing promotion methods (posters and videos)
 * Each strong comparison unlocks an advanced vocabulary level
 */

const GUIDED_QUESTIONS = [
  {
    id: 1,
    question: 'How do posters and videos differ in reach?'
  },
  {
    id: 2,
    question: 'Compare eye-catchers in each.'
  },
  {
    id: 3,
    question: 'Slogan vs jingle?'
  },
  {
    id: 4,
    question: 'Cost and production.'
  },
  {
    id: 5,
    question: 'Audience engagement.'
  },
  {
    id: 6,
    question: 'Distribution differences.'
  },
  {
    id: 7,
    question: 'Long-term effect.'
  },
  {
    id: 8,
    question: 'When to choose one over the other.'
  }
]

const GLOSSARY_TERMS = [
  'billboard',
  'eye-catcher',
  'feature',
  'slogan',
  'jingle',
  'viral',
  'layout',
  'animation',
  'dramatisation',
  'commercial',
  'flyers',
  'leaflets',
  'penetration',
  'geotargeting',
  'influencer'
]

const EVALUATION_CRITERIA = {
  requiresB2Structure: true,
  requiresComparativeLanguage: ['while', 'whereas', 'better than', 'compared to', 'unlike', 'in contrast'],
  minGlossaryTerms: 6,
  requiresCoherence: true,
  requiresTopicSentence: true
}

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_b2' })

  const handleGameComplete = (result) => {
    console.log('B2 Compare Quest completed:', result)

    // Store result
    const score = result.score || 0
    const level = result.vocabularyLevel || 1
    const skipped = result.skipped || 0

    sessionStorage.setItem('remedial_b2_taskB_score', score)
    sessionStorage.setItem('remedial_b2_taskB_level', level)
    sessionStorage.setItem('remedial_b2_taskB_skipped', skipped)

    // Log to backend
    logTaskCompletion(score, level, result.answers)

    // Navigate to Task C
    setTimeout(() => {
      navigate('/phase4/remedial/b2/taskC')
    }, 1500)
  }

  const logTaskCompletion = async (score, level, answers) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'B',
          score: score,
          max_score: GUIDED_QUESTIONS.length,
          vocabulary_level: level,
          answers: answers,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task B completion logged to backend')
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
          Compare Quest: Posters vs Videos
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Comparison Writing
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Write strong comparisons to unlock advanced vocabulary levels and earn your comparison badge!
        </Typography>
      </Paper>

      {/* Instructions Card */}
      <Card elevation={3} sx={{ mb: 3, backgroundColor: 'info.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="info.dark">
            Your Quest
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Answer 8 guided questions to build a complete comparison paragraph about promotion methods. Each strong comparison unlocks a new vocabulary level!
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
            Success Criteria:
          </Typography>
          <ul style={{ marginTop: 0 }}>
            <li>Use comparative language (while, whereas, better than, compared to, etc.)</li>
            <li>Include at least 6 glossary terms in your answers</li>
            <li>Create coherent comparisons with clear logic</li>
            <li>Show understanding of both promotion methods</li>
          </ul>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Tip: You can skip questions, but answered questions help you level up!
          </Typography>
        </CardContent>
      </Card>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="This is advanced comparison writing! Think about the differences between posters and videos from multiple angles: reach, cost, engagement, distribution, and impact. Use comparative language and marketing terminology to build strong, professional comparisons."
        />
      </Paper>

      {/* Compare Quest Game */}
      <Box>
        <CompareQuestGame
          questions={GUIDED_QUESTIONS}
          glossaryTerms={GLOSSARY_TERMS}
          onComplete={handleGameComplete}
          evaluationCriteria={EVALUATION_CRITERIA}
        />
      </Box>
    </Box>
  )
}
