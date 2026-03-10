import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Card, CardContent, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Interaction 1: Guided Explanation (Teacher Modeling)
 * Task Type: Noticing & Explanation
 * Students underline the reason in cause-effect sentences
 */

const SENTENCES = [
  {
    id: 1,
    fullSentence: "We need a sponsor because the stage and sound system are expensive.",
    reason: "because the stage and sound system are expensive",
    explanation: "This part explains WHY they need a sponsor - the reason is that the equipment costs a lot of money."
  },
  {
    id: 2,
    fullSentence: "The budget has many expenses so we must find sponsors.",
    reason: "The budget has many expenses",
    explanation: "This is the REASON (cause) that leads to the result of finding sponsors."
  },
  {
    id: 3,
    fullSentence: "We sell tickets because we need income for the event.",
    reason: "because we need income for the event",
    explanation: "This explains WHY they sell tickets - the reason is they need money."
  },
  {
    id: 4,
    fullSentence: "The venue is expensive so ticket sales alone are not enough.",
    reason: "The venue is expensive",
    explanation: "This is the CAUSE that makes ticket sales insufficient - the high venue cost."
  },
  {
    id: 5,
    fullSentence: "We need careful planning because our budget is limited.",
    reason: "because our budget is limited",
    explanation: "This explains WHY planning is needed - the reason is the limited budget."
  },
  {
    id: 6,
    fullSentence: "Sponsors help the festival so we can afford better equipment.",
    reason: "Sponsors help the festival",
    explanation: "This is the CAUSE that allows better equipment - sponsor support."
  },
  {
    id: 7,
    fullSentence: "We create a budget because we need to control our spending.",
    reason: "because we need to control our spending",
    explanation: "This explains WHY we create a budget - to manage expenses."
  },
  {
    id: 8,
    fullSentence: "Ticket prices are low so many students can attend.",
    reason: "Ticket prices are low",
    explanation: "This is the CAUSE that allows many students to attend - affordable prices."
  }
]

export default function Phase3Step3Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'main' })
  const [selectedText, setSelectedText] = useState({}) // { sentenceId: selectedText }
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleTextSelection = (sentenceId) => {
    const selection = window.getSelection()
    const selectedStr = selection.toString().trim()

    if (selectedStr && !showResults) {
      setSelectedText({
        ...selectedText,
        [sentenceId]: selectedStr
      })
    }
  }

  const checkIfReasonSelected = (userSelection, correctReason) => {
    // Normalize strings for comparison
    const normalize = (str) => str.toLowerCase().replace(/[.,!?]/g, '').trim()
    const userNorm = normalize(userSelection)
    const correctNorm = normalize(correctReason)

    // Check if user selected text contains the key parts of the reason
    // More lenient matching - user gets credit if they selected the core reason
    return userNorm.includes(correctNorm) || correctNorm.includes(userNorm)
  }

  const handleSubmit = () => {
    let correctCount = 0

    SENTENCES.forEach(sentence => {
      const userSelection = selectedText[sentence.id] || ''
      if (checkIfReasonSelected(userSelection, sentence.reason)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store result
    sessionStorage.setItem('phase3_step3_int1_score', correctCount.toString())
    sessionStorage.setItem('phase3_step3_int1_max', SENTENCES.length.toString())

    // Log to backend
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 3,
          interaction: 1,
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
    navigate('/app/phase3/step/3/interaction/2')
  }

  const allSentencesAttempted = Object.keys(selectedText).length === SENTENCES.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3 Step 3: Explain
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 1: Guided Explanation
        </Typography>
        <Typography variant="body1">
          Underline the reason in each sentence
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's practice identifying the REASON in cause-effect sentences. For each sentence below, use your mouse to select (underline) the part that explains WHY or shows the CAUSE. Look for phrases with 'because' or the part before 'so' that explains the reason."
        />
      </Paper>

      {/* Example */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📌 Example:
        </Typography>
        <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, mb: 2 }}>
          <Typography variant="body1" sx={{ color: '#000' }}>
            We need a sponsor <Box component="span" sx={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>because the stage and sound system are expensive</Box>.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#000' }}>
          The highlighted part is the <strong>reason</strong> - it explains WHY they need a sponsor.
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: '#000' }}>
          • Read each sentence carefully
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: '#000' }}>
          • Use your mouse to <strong>select (highlight)</strong> the part that shows the REASON or CAUSE
        </Typography>
        <Typography variant="body2" sx={{ color: '#000' }}>
          • Your selection will be saved automatically
        </Typography>
      </Paper>

      {/* Progress */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Sentences Completed: {Object.keys(selectedText).length}/{SENTENCES.length}
          </Typography>
        </Box>
      )}

      {/* Sentences */}
      <Box sx={{ mb: 4 }}>
        {SENTENCES.map((sentence, index) => {
          const userSelection = selectedText[sentence.id] || ''
          const isCorrect = showResults && checkIfReasonSelected(userSelection, sentence.reason)
          const hasSelection = userSelection.length > 0

          return (
            <Card
              key={sentence.id}
              elevation={3}
              sx={{
                mb: 3,
                border: showResults ? (isCorrect ? 3 : 2) : hasSelection ? 2 : 1,
                borderColor: showResults
                  ? isCorrect
                    ? 'success.main'
                    : 'error.main'
                  : hasSelection
                    ? 'primary.main'
                    : 'grey.300',
                backgroundColor: showResults && isCorrect ? 'success.lighter' : 'white'
              }}
            >
              <CardContent>
                {/* Sentence Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Sentence {index + 1}
                  </Typography>
                  {showResults && (
                    isCorrect ?
                      <CheckCircleIcon color="success" fontSize="large" /> :
                      <CancelIcon color="error" fontSize="large" />
                  )}
                </Box>

                {/* Sentence to select from */}
                <Paper
                  sx={{
                    p: 3,
                    mb: 2,
                    backgroundColor: '#f9f9f9',
                    border: 2,
                    borderColor: hasSelection ? 'primary.main' : 'grey.300',
                    cursor: showResults ? 'default' : 'text',
                    userSelect: showResults ? 'none' : 'text'
                  }}
                  onMouseUp={() => !showResults && handleTextSelection(sentence.id)}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      color: '#000'
                    }}
                  >
                    {sentence.fullSentence}
                  </Typography>
                </Paper>

                {/* Show user's selection */}
                {hasSelection && (
                  <Alert severity={showResults ? (isCorrect ? "success" : "error") : "info"} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>You selected:</strong> "{userSelection}"
                    </Typography>
                  </Alert>
                )}

                {/* Hint (only before results) */}
                {!showResults && !hasSelection && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Select text above with your mouse, then it will be saved automatically
                    </Typography>
                  </Alert>
                )}

                {/* Show correct answer after submission */}
                {showResults && (
                  <Alert severity={isCorrect ? "success" : "info"} sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Correct reason:</strong> "{sentence.reason}"
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                      {sentence.explanation}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Overall Results */}
      {showResults && (
        <Alert
          severity={score === SENTENCES.length ? "success" : score >= 6 ? "info" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{SENTENCES.length} correct
          </Typography>
          <Typography>
            {score === SENTENCES.length
              ? "Perfect! You have excellent understanding of cause-effect relationships!"
              : score >= 6
                ? "Great work! You understand how to identify reasons in sentences."
                : "Good effort! Review the correct answers above to improve your understanding."}
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
            disabled={!allSentencesAttempted}
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
