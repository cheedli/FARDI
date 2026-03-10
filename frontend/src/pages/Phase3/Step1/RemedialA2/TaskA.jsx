import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level A2 - Task A: Sentence Completion
 * Complete sentences using "because"
 */

const SENTENCE_PROMPTS = [
  {
    id: 1,
    prompt: 'We need a sponsor because ____.',
    hint: 'Think about why events need money from sponsors'
  },
  {
    id: 2,
    prompt: 'A budget is important because ____.',
    hint: 'Think about what a budget helps us do'
  },
  {
    id: 3,
    prompt: 'We sell tickets because ____.',
    hint: 'Think about why we ask people to pay for entry'
  }
]

export default function Phase3RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [evaluations, setEvaluations] = useState({})
  const [totalScore, setTotalScore] = useState(0)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value
    })
  }

  const handleSubmit = async () => {
    setIsEvaluating(true)

    try {
      // Create prompts map for evaluation context
      const promptsMap = {}
      SENTENCE_PROMPTS.forEach(item => {
        promptsMap[item.id] = item.prompt
      })

      // Call LLM evaluation endpoint
      const response = await fetch('/api/phase3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'A',
          answers: answers,
          prompts: promptsMap
        })
      })

      const result = await response.json()

      if (result.success) {
        // Store evaluations by ID for easy lookup
        const evalMap = {}
        result.evaluations.forEach(evaluation => {
          evalMap[evaluation.id] = evaluation
        })
        setEvaluations(evalMap)
        setTotalScore(result.total_score)
        setShowResults(true)

        // Log task completion
        await logTaskCompletion(result.total_score, result.max_score)
      } else {
        console.error('Evaluation failed:', result.error)
        alert('Failed to evaluate answers. Please try again.')
      }
    } catch (error) {
      console.error('Failed to evaluate:', error)
      alert('Failed to evaluate answers. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase3/step/1/remedial/a2/taskB')
  }

  const isComplete = SENTENCE_PROMPTS.every(p => answers[p.id]?.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task A: Sentence Completion
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Let's practice explaining reasons! Complete each sentence using 'because' to give a reason."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Complete each sentence by writing a reason after "because".
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Example:</strong> We need a sponsor because <em>events cost money</em>.
        </Typography>
      </Paper>

      {/* Sentence Completion Tasks */}
      <Box sx={{ mb: 4 }}>
        {SENTENCE_PROMPTS.map((item, index) => (
          <Paper key={item.id} elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {index + 1}. {item.prompt}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              💡 {item.hint}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[item.id] || ''}
              onChange={(e) => handleAnswerChange(item.id, e.target.value)}
              placeholder="Complete the sentence..."
              variant="outlined"
              disabled={showResults}
            />
            {showResults && evaluations[item.id] && (
              <Box sx={{ mt: 2 }}>
                <Alert severity={evaluations[item.id].score === 1 ? "success" : "warning"}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Your answer:</strong> {answers[item.id]}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Score:</strong> {evaluations[item.id].score}/1
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Evaluation:</strong> {evaluations[item.id].evaluation}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {evaluations[item.id].feedback}
                  </Typography>
                </Alert>
              </Box>
            )}
          </Paper>
        ))}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity={totalScore === SENTENCE_PROMPTS.length ? "success" : "info"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Task Complete!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Total Score:</strong> {totalScore}/{SENTENCE_PROMPTS.length}
          </Typography>
          <Typography>
            {totalScore === SENTENCE_PROMPTS.length
              ? "Excellent work! You provided good reasons for all sentences."
              : "Good effort! Review the feedback above to see how you can improve."}
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
            disabled={!isComplete || isEvaluating}
          >
            {isEvaluating ? 'Evaluating...' : 'Submit Answers'}
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Complete Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
