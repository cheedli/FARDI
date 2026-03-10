import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import WordshakeC1Game from '../../../components/WordshakeC1Game.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level C1 - Task C: Advanced Wordshake + Sentence Writing
 * Find 6 advanced marketing terms, then use each in a contextual sentence
 * Two-phase game: Word finding + Sentence writing with AI evaluation
 */

const TARGET_WORDS = [
  'guerilla',
  'surrogate',
  'remarketing',
  'geotargeting',
  'infomercial',
  'viral'
]

export default function RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Wordshake Challenge completed:', result)

    // For remedial scoring, only count word-finding score (6 words max)
    const taskScore = result.wordFindingScore

    console.log(`Task C Score: ${taskScore} words found out of 6`)

    sessionStorage.setItem('remedial_c1_taskC_score', taskScore)
    sessionStorage.setItem('remedial_c1_taskC_wordScore', result.wordFindingScore)
    sessionStorage.setItem('remedial_c1_taskC_sentenceScore', result.sentenceScore)

    console.log('✅ Task C Score stored in sessionStorage:', {
      taskScore: sessionStorage.getItem('remedial_c1_taskC_score'),
      wordScore: sessionStorage.getItem('remedial_c1_taskC_wordScore'),
      sentenceScore: sessionStorage.getItem('remedial_c1_taskC_sentenceScore')
    })

    logTaskCompletion(taskScore, result)

    setTimeout(() => {
      navigate('/phase4/remedial/c1/taskD')
    }, 2000)
  }

  const logTaskCompletion = async (taskScore, result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: taskScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'C',
          score: taskScore,
          max_score: 6,
          word_finding_score: result.wordFindingScore,
          sentence_score: result.sentenceScore,
          sentences: result.sentences,
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
        <Typography variant="h3" gutterBottom fontWeight="bold">
          =$ Advanced Wordshake Challenge
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task C: Find Words & Write Sentences
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Find 6 advanced marketing terms in the grid, then use each in a professional marketing sentence!
        </Typography>
      </Paper>

      {/* Instructions Card */}
      <Card elevation={3} sx={{ mb: 3, backgroundColor: 'info.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="info.dark">
            Two-Phase Challenge
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Phase 1: Word Finding (5 minutes)</strong>
          </Typography>
          <ul style={{ marginTop: 0, marginBottom: 16 }}>
            <li>Click adjacent letters in the grid to form words</li>
            <li>Find all 6 advanced marketing terms: guerilla, surrogate, remarketing, geotargeting, infomercial, viral</li>
            <li>Letters can be horizontal, vertical, or diagonal</li>
          </ul>
          <Typography variant="body1" paragraph>
            <strong>Phase 2: Sentence Writing</strong>
          </Typography>
          <ul style={{ marginTop: 0 }}>
            <li>Write a sentence using each found word in a marketing context</li>
            <li>Your sentences will be evaluated by AI for contextual appropriateness</li>
            <li>Use C1-level vocabulary and professional language</li>
          </ul>
        </CardContent>
      </Card>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Welcome to C1 Task C! First, find the 6 advanced marketing terms hidden in the grid. Then, demonstrate your mastery by using each term in a sophisticated marketing sentence. This combines vocabulary recognition with contextual application - essential skills for C1 level!"
        />
      </Paper>

      {/* Wordshake Game */}
      <Box>
        <WordshakeC1Game
          targetWords={TARGET_WORDS}
          duration={300}
          onComplete={handleGameComplete}
        />
      </Box>
    </Box>
  )
}
