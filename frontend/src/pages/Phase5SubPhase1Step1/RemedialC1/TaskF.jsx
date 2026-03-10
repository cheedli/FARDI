import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const CLAUSE_SENTENCES = [
  { id: 1, template: 'Alternative performer, who _______, saves the event.', answer: 'is secured quickly', hint: 'Use relative clause with passive' },
  { id: 2, template: 'Apology, which _______, maintains trust.', answer: 'is issued promptly', hint: 'Use relative clause with passive' },
  { id: 3, template: 'Schedule change, that _______, is implemented.', answer: 'minimizes disruption', hint: 'Use relative clause' },
  { id: 4, template: 'Team, who _______, coordinates better.', answer: 'is informed early', hint: 'Use relative clause with passive' },
  { id: 5, template: 'Damage, which _______, is limited.', answer: 'is mitigated effectively', hint: 'Use relative clause with passive' },
  { id: 6, template: 'Contingency plan, that _______, is essential.', answer: 'prevents crises', hint: 'Use relative clause' }
]

export default function Phase5Step1RemedialC1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 6, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    CLAUSE_SENTENCES.forEach((sent, idx) => {
      const answer = answers[idx].toLowerCase().trim()
      const hasRelativePronoun = answer.includes('who') || answer.includes('which') || answer.includes('that')
      const hasVerb = answer.split(' ').length >= 2
      if (hasRelativePronoun || hasVerb) correctCount++ // Flexible: accept if has structure
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_c1_taskF_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'C1', 'F', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/c1/task/g')
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task F: Clause Conquest</Typography>
        <Typography variant="body1">Write 6 complex sentences with terms in passive/relative clauses</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Clause Conquest! Complete each sentence using relative clauses (who, which, that) with passive voice or active verbs!" />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Sentence {currentIndex + 1} of 6</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">{CLAUSE_SENTENCES[currentIndex].template}</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Hint:</strong> {CLAUSE_SENTENCES[currentIndex].hint}</Typography>
            </Alert>
            <TextField fullWidth variant="outlined" placeholder="Fill in the blank..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!answers[currentIndex].trim()}>Submit All</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!answers[currentIndex].trim()}>Next →</Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task F Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task G →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
