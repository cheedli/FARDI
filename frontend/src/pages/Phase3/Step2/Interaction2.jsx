import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Card, CardContent, Radio, RadioGroup, FormControlLabel, Alert, Collapse, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Interaction 2: Funding Choice Game
 * Scenario-Based Selection: Choose the best funding option for each situation
 */

const SCENARIOS = [
  {
    id: 1,
    situation: "The festival needs money for sound equipment.",
    options: [
      { id: 'a', text: 'Ticket sales', isCorrect: false },
      { id: 'b', text: 'Sponsor donation', isCorrect: true },
      { id: 'c', text: 'Volunteer work', isCorrect: false }
    ],
    explanation: "Sponsor donation is best because sound equipment requires upfront cash payment. Ticket sales come later, and volunteer work doesn't provide money.",
    icon: '🔊'
  },
  {
    id: 2,
    situation: "The committee needs to pay for venue rental before the event.",
    options: [
      { id: 'a', text: 'Wait for ticket sales', isCorrect: false },
      { id: 'b', text: 'University grant', isCorrect: true },
      { id: 'c', text: 'Donations after the event', isCorrect: false }
    ],
    explanation: "A university grant is best because it provides money upfront before the event. Ticket sales and donations come too late for early expenses.",
    icon: '🏢'
  },
  {
    id: 3,
    situation: "The festival wants to cover ongoing small expenses during the event.",
    options: [
      { id: 'a', text: 'Ticket sales', isCorrect: true },
      { id: 'b', text: 'One-time sponsor', isCorrect: false },
      { id: 'c', text: 'Future donations', isCorrect: false }
    ],
    explanation: "Ticket sales are best because they provide continuous income during the event that can cover small ongoing expenses.",
    icon: '🎫'
  },
  {
    id: 4,
    situation: "The committee needs promotional materials but has limited cash.",
    options: [
      { id: 'a', text: 'Cash sponsor', isCorrect: false },
      { id: 'b', text: 'In-kind sponsor (printing company)', isCorrect: true },
      { id: 'c', text: 'Ticket presales', isCorrect: false }
    ],
    explanation: "An in-kind sponsor is best because a printing company can provide materials directly without needing cash payment.",
    icon: '📄'
  },
  {
    id: 5,
    situation: "The festival has unexpected extra costs after planning the budget.",
    options: [
      { id: 'a', text: 'Emergency donations', isCorrect: true },
      { id: 'b', text: 'Reduce ticket prices', isCorrect: false },
      { id: 'c', text: 'Cancel the event', isCorrect: false }
    ],
    explanation: "Emergency donations are best because they can provide quick additional funding. Reducing ticket prices would decrease income, making the problem worse.",
    icon: '🚨'
  }
]

export default function Phase3Step2Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 2, context: 'main' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (scenarioId, optionId) => {
    setAnswers({
      ...answers,
      [scenarioId]: optionId
    })
  }

  const handleJustificationChange = (scenarioId, text) => {
    setJustifications({
      ...justifications,
      [scenarioId]: text
    })
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    SCENARIOS.forEach(scenario => {
      const userAnswer = answers[scenario.id]
      const correctOption = scenario.options.find(opt => opt.isCorrect)
      if (userAnswer === correctOption.id) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store result
    sessionStorage.setItem('phase3_step2_int2_score', correctCount.toString())
    sessionStorage.setItem('phase3_step2_int2_max', SCENARIOS.length.toString())

    // Log to backend
    logTaskCompletion(correctCount, SCENARIOS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 2,
          interaction: 2,
          score: score,
          max_score: maxScore,
          time_taken: 0,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/2/interaction/3')
  }

  const allAnswered = Object.keys(answers).length === SCENARIOS.length

  // Check user level based on justifications
  const hasJustifications = Object.values(justifications).some(j => j && j.trim().length > 10)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3 Step 2: Explore
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 2: Funding Choice Game
        </Typography>
        <Typography variant="body1">
          Choose the best funding option for each situation
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now let's apply what we learned! For each situation below, choose the most appropriate funding source. Think about timing, availability, and practicality."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Read each scenario carefully
        </Typography>
        <Typography variant="body2">
          • Choose the best funding option for each situation
        </Typography>
      </Paper>

      {/* Score Display */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Scenarios Answered: {Object.keys(answers).length}/{SCENARIOS.length}
          </Typography>
        </Box>
      )}

      {/* Scenarios */}
      <Box sx={{ mb: 4 }}>
        {SCENARIOS.map((scenario, index) => {
          const userAnswer = answers[scenario.id]
          const correctOption = scenario.options.find(opt => opt.isCorrect)
          const isCorrect = showResults && userAnswer === correctOption.id
          const isAnswered = userAnswer !== undefined

          return (
            <Card
              key={scenario.id}
              elevation={3}
              sx={{
                mb: 3,
                border: showResults ? (isCorrect ? 3 : 2) : isAnswered ? 2 : 1,
                borderColor: showResults
                  ? isCorrect
                    ? 'success.main'
                    : 'error.main'
                  : isAnswered
                    ? 'primary.main'
                    : 'grey.300',
                backgroundColor: showResults && isCorrect ? 'success.lighter' : 'white'
              }}
            >
              <CardContent>
                {/* Scenario Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    {scenario.icon}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Scenario {index + 1}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {scenario.situation}
                    </Typography>
                  </Box>
                  {showResults && isCorrect && <CheckCircleIcon color="success" fontSize="large" />}
                </Box>

                {/* Options */}
                <RadioGroup
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswerChange(scenario.id, e.target.value)}
                >
                  {scenario.options.map(option => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio disabled={showResults} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>{option.text}</Typography>
                          {showResults && option.isCorrect && (
                            <CheckCircleIcon color="success" fontSize="small" />
                          )}
                        </Box>
                      }
                      sx={{
                        backgroundColor:
                          showResults && option.isCorrect
                            ? 'success.lighter'
                            : showResults && userAnswer === option.id && !option.isCorrect
                              ? 'error.lighter'
                              : 'transparent',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        my: 0.5
                      }}
                    />
                  ))}
                </RadioGroup>

                {/* Show explanation after submission */}
                {showResults && (
                  <Collapse in={showResults}>
                    <Alert severity={isCorrect ? "success" : "info"} sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Explanation:</strong> {scenario.explanation}
                      </Typography>
                    </Alert>
                  </Collapse>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert
          severity={score === SCENARIOS.length ? "success" : score >= 4 ? "info" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{SCENARIOS.length} correct
          </Typography>
          <Typography>
            {score === SCENARIOS.length
              ? "Perfect! You have excellent understanding of funding sources!"
              : score >= 4
                ? "Great work! You understand how to match funding sources to needs."
                : "Good try! Review the explanations to learn more about choosing funding sources."}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Answers
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleContinue}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Next Activity
          </Button>
        )}
      </Box>
    </Box>
  )
}
