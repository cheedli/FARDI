import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Card, CardContent, Alert, TextField, CircularProgress, Chip, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CreateIcon from '@mui/icons-material/Create'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Interaction 3: Justification Practice
 * Task: Write 3-5 sentences explaining a budget item, using connectors
 */

const BUDGET_ITEMS = [
  {
    id: 'venue',
    name: 'Venue Rental',
    cost: '$800',
    icon: '🏢',
    prompt: 'Explain why the festival needs to rent a venue and how this cost impacts the budget.',
    keyPoints: [
      'Why is a venue necessary?',
      'What does the venue provide?',
      'How does this cost affect the overall budget?'
    ]
  },
  {
    id: 'sound',
    name: 'Sound System',
    cost: '$500',
    icon: '🔊',
    prompt: 'Explain why sound equipment is needed and how it will be funded.',
    keyPoints: [
      'Why is sound equipment important?',
      'What will it be used for?',
      'How will we pay for it?'
    ]
  },
  {
    id: 'promotion',
    name: 'Promotion & Marketing',
    cost: '$200',
    icon: '📣',
    prompt: 'Explain why the festival needs to spend money on promotion and what results we expect.',
    keyPoints: [
      'Why is promotion necessary?',
      'What kind of promotion will we do?',
      'What impact will it have?'
    ]
  }
]

const REQUIRED_CONNECTORS = ['because', 'so', 'due to']

export default function Phase3Step3Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 3, context: 'main' })
  const [selectedItem, setSelectedItem] = useState(null)
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleItemSelect = (itemId) => {
    if (showResults) return
    setSelectedItem(itemId)
    setResponse('')
    setEvaluation(null)
  }

  const handleSubmit = async () => {
    if (!selectedItem || !response.trim() || response.trim().length < 20) {
      alert('Please write at least 3-5 sentences (minimum 20 characters).')
      return
    }

    setIsSubmitting(true)

    try {
      // Check for connector usage
      const textLower = response.toLowerCase()
      const usedConnectors = REQUIRED_CONNECTORS.filter(connector =>
        textLower.includes(connector)
      )

      // Send to backend for AI evaluation
      const result = await fetch('/api/phase3/interaction/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 3,
          interaction: 3,
          response: response,
          item: selectedItem,
          type: 'justification'
        })
      })

      const data = await result.json()

      // Calculate score based on AI assessment and connector usage
      let score = data.assessment?.score || 2 // Default to A2 if AI fails

      // Bonus for using connectors
      if (usedConnectors.length >= 1) {
        score = Math.min(score + 1, 5) // Cap at C1 (5)
      }

      setEvaluation({
        score: score,
        level: getLevelFromScore(score),
        feedback: data.assessment?.feedback || 'Good explanation!',
        usedConnectors: usedConnectors,
        assessment: data.assessment
      })

      setShowResults(true)

      // Store result
      sessionStorage.setItem('phase3_step3_int3_score', score.toString())
      sessionStorage.setItem('phase3_step3_int3_max', '5')

      // Log to backend
      await logTaskCompletion(score, 5)

    } catch (error) {
      console.error('Failed to submit response:', error)
      // Fallback evaluation
      const textLower = response.toLowerCase()
      const usedConnectors = REQUIRED_CONNECTORS.filter(connector =>
        textLower.includes(connector)
      )

      let score = response.length > 100 ? 3 : 2 // Simple fallback
      if (usedConnectors.length >= 1) score = Math.min(score + 1, 5)

      setEvaluation({
        score: score,
        level: getLevelFromScore(score),
        feedback: 'Your response has been recorded. Good work!',
        usedConnectors: usedConnectors
      })
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLevelFromScore = (score) => {
    const levels = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1' }
    return levels[score] || 'A2'
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 3,
          interaction: 3,
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
    // Calculate overall Step 3 score
    const int1Score = parseInt(sessionStorage.getItem('phase3_step3_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase3_step3_int2_score') || '0')
    const int3Score = evaluation?.score || 0

    const totalScore = int1Score + int2Score + int3Score
    const totalMax = 15 // 5 + 5 + 5
    const percentage = (totalScore / totalMax) * 100

    sessionStorage.setItem('phase3_step3_total_score', totalScore.toString())
    sessionStorage.setItem('phase3_step3_total_max', totalMax.toString())
    sessionStorage.setItem('phase3_step3_percentage', percentage.toFixed(2))

    console.log(`[Phase 3 Step 3 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)

    // Navigate to ScoreCalculation page for backend-driven routing
    navigate('/phase3/step/3/score')
  }

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasMinimumLength = response.trim().length >= 20

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3 Step 3: Explain
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 3: Justification Practice
        </Typography>
        <Typography variant="body1">
          Write an explanation for a budget item
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Excellent progress! Now it's time to practice writing your own explanations. Choose one budget item below and write 3-5 sentences explaining why it's necessary and how it affects the budget. Try to use at least one connector (because, so, or due to)."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Choose one budget item below
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. Write 3-5 sentences explaining it
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          3. Use at least one connector: <strong>because</strong>, <strong>so</strong>, or <strong>due to</strong>
        </Typography>
        <Typography variant="body2">
          4. Explain clearly why the cost exists and how it impacts the budget
        </Typography>
      </Paper>

      {/* Connector Reference */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Helpful Connectors:</strong>
        </Typography>
        <Stack direction="row" spacing={1}>
          {REQUIRED_CONNECTORS.map((connector, index) => (
            <Chip
              key={index}
              label={connector}
              color="info"
              size="small"
            />
          ))}
        </Stack>
      </Paper>

      {/* Budget Item Selection */}
      {!selectedItem && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Choose a Budget Item to Explain:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {BUDGET_ITEMS.map(item => (
              <Card
                key={item.id}
                elevation={3}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    borderColor: 'primary.main',
                    borderWidth: 2
                  }
                }}
                onClick={() => handleItemSelect(item.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h2">{item.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cost: {item.cost}
                      </Typography>
                    </Box>
                    <Button variant="outlined" color="primary">
                      Select
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Writing Area */}
      {selectedItem && !showResults && (
        <Box sx={{ mb: 4 }}>
          <Card elevation={3}>
            <CardContent>
              {/* Selected Item Display */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h2">
                  {BUDGET_ITEMS.find(i => i.id === selectedItem)?.icon}
                </Typography>
                <Box>
                  <Typography variant="h6">
                    {BUDGET_ITEMS.find(i => i.id === selectedItem)?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cost: {BUDGET_ITEMS.find(i => i.id === selectedItem)?.cost}
                  </Typography>
                </Box>
              </Box>

              {/* Prompt */}
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <CreateIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1rem' }} />
                  <strong>Task:</strong> {BUDGET_ITEMS.find(i => i.id === selectedItem)?.prompt}
                </Typography>
              </Alert>

              {/* Key Points to Address */}
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
                  <strong>Consider these points:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 3, my: 1 }}>
                  {BUDGET_ITEMS.find(i => i.id === selectedItem)?.keyPoints.map((point, index) => (
                    <Typography key={index} component="li" variant="body2" sx={{ color: '#000' }}>
                      {point}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Text Area */}
              <TextField
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                placeholder="Write your explanation here (3-5 sentences)..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              />

              {/* Word Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color={hasMinimumLength ? 'success.main' : 'text.secondary'}>
                  Words: {wordCount} | Characters: {response.length}
                </Typography>
                {!hasMinimumLength && (
                  <Typography variant="caption" color="error">
                    Write at least 20 characters
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedItem(null)}
                  disabled={isSubmitting}
                >
                  Choose Different Item
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!hasMinimumLength || isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  sx={{ flex: 1 }}
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit Explanation'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Results */}
      {showResults && evaluation && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Evaluation Complete!
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Level:</strong> {evaluation.level} ({evaluation.score}/5 points)
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Feedback:</strong> {evaluation.feedback}
            </Typography>
            {evaluation.usedConnectors.length > 0 && (
              <Typography variant="body2">
                ✓ You used these connectors: <strong>{evaluation.usedConnectors.join(', ')}</strong>
              </Typography>
            )}
            {evaluation.usedConnectors.length === 0 && (
              <Typography variant="body2" color="warning.main">
                Note: Try using connectors (because, so, due to) to improve your explanations!
              </Typography>
            )}
          </Alert>

          {/* Show user's response */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Response:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                  {response}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleContinue}
              endIcon={<ArrowForwardIcon />}
            >
              Complete Step 3
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
