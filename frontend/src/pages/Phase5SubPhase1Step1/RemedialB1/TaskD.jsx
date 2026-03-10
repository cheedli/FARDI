import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Card, CardContent, CardActionArea } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Remedial B1 - Task D: Quizlet Flashcards
 * Flip flashcards to match problem-solving terms
 */

const FLASHCARDS = [
  { term: 'alternative', definition: 'Another choice', id: 1 },
  { term: 'urgent', definition: 'Very important now', id: 2 },
  { term: 'solution', definition: 'Way to fix', id: 3 },
  { term: 'sorry', definition: 'Apology', id: 4 },
  { term: 'cancel', definition: 'Stop plan', id: 5 },
  { term: 'change', definition: 'Make different', id: 6 },
  { term: 'fix', definition: 'Solve problem', id: 7 },
  { term: 'problem', definition: 'Something wrong', id: 8 }
]

export default function Phase5Step1RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 4, context: 'remedial_b1' })
  const [flipped, setFlipped] = useState({})
  const [matched, setMatched] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleFlip = (id) => {
    if (matched.has(id)) return
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleMatch = (id) => {
    setMatched(prev => new Set([...prev, id]))
  }

  const handleSubmit = async () => {
    const correctCount = matched.size
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_b1_taskD_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(1, 'B1', 'D', correctCount, 8, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/b1/task/e')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task D: Quizlet Flashcards</Typography>
        <Typography variant="body1">Flip flashcards to match problem-solving terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quizlet Flashcards! Click each card to flip it and see the term or definition. Match all 8 pairs correctly!" />
      </Paper>

      {!submitted ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            {FLASHCARDS.map((card) => (
              <Card key={card.id} elevation={3} sx={{ minHeight: 150 }}>
                <CardActionArea onClick={() => handleFlip(card.id)} sx={{ height: '100%', p: 2 }}>
                  <CardContent>
                    {flipped[card.id] ? (
                      <Typography variant="body1" align="center">{card.definition}</Typography>
                    ) : (
                      <Typography variant="h6" align="center" color="primary">{card.term}</Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
          <Button variant="contained" color="primary" onClick={handleSubmit} size="large" fullWidth>Submit</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task D Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task E →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
