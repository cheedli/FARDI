import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial B1 - Task E: Tense Time Travel
 * Grammar exercise - Convert ONLY the verb from present to past tense
 * 6 sentences - students write only the verb
 * Bonus task worth 6 points
 */

const SENTENCES = [
  {
    id: 1,
    beforeVerb: 'The ad',
    verb: 'is',
    afterVerb: 'promotional.',
    correctPastVerb: 'was',
    hint: 'Change "is" to past tense'
  },
  {
    id: 2,
    beforeVerb: 'Persuasive advertising',
    verb: 'uses',
    afterVerb: 'ethos, pathos, and logos.',
    correctPastVerb: 'used',
    hint: 'Change "uses" to past tense'
  },
  {
    id: 3,
    beforeVerb: 'Targeted advertising',
    verb: 'is',
    afterVerb: 'for a specific group.',
    correctPastVerb: 'was',
    hint: 'Change "is" to past tense'
  },
  {
    id: 4,
    beforeVerb: 'Original content',
    verb: 'is',
    afterVerb: 'new and unique.',
    correctPastVerb: 'was',
    hint: 'Change "is" to past tense'
  },
  {
    id: 5,
    beforeVerb: 'Creative design',
    verb: 'makes',
    afterVerb: 'ads memorable.',
    correctPastVerb: 'made',
    hint: 'Change "makes" to past tense'
  },
  {
    id: 6,
    beforeVerb: 'Ethical advertising',
    verb: 'is',
    afterVerb: 'honest and fair.',
    correctPastVerb: 'was',
    hint: 'Change "is" to past tense'
  }
]

export default function RemedialB1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 5, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const [showHints, setShowHints] = useState(false)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const checkAnswer = (studentAnswer, correctAnswer) => {
    // Normalize: trim, lowercase
    return studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  }

  const handleSubmit = () => {
    let score = 0
    const feedback = SENTENCES.map(sentence => {
      const studentAnswer = answers[sentence.id] || ''
      const isCorrect = checkAnswer(studentAnswer, sentence.correctPastVerb)

      if (isCorrect) {
        score += 1
      }

      return {
        id: sentence.id,
        beforeVerb: sentence.beforeVerb,
        verb: sentence.verb,
        afterVerb: sentence.afterVerb,
        studentAnswer,
        correctAnswer: sentence.correctPastVerb,
        isCorrect
      }
    })

    setResults({ score, feedback })
    setSubmitted(true)

    // Save score
    sessionStorage.setItem('remedial_step3_b1_taskE_score', score)

    logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'E',
          step: 2,
          score: score,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step3/remedial/b1/taskF')
  }

  const allAnswered = SENTENCES.every(s => answers[s.id] && answers[s.id].trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task E: Tense Time Travel ⏰ (BONUS)
        </Typography>
        <Typography variant="body1">
          Convert 6 verbs from present to past tense!
        </Typography>
        <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(255, 152, 0, 0.9)' }}>
          <strong>Bonus Task:</strong> This is an optional task worth 6 bonus points. Complete it to boost your total score!
        </Alert>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time to travel back in time! 🕰️ For each sentence, write ONLY the verb in past tense. For example, if you see 'The ad IS promotional', you should write 'was' in the box. Complete all 6 correctly for 6 bonus points!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Hint Toggle */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowHints(!showHints)}
              sx={{
                borderColor: '#34495e',
                color: '#34495e',
                '&:hover': { borderColor: '#2c3e50', backgroundColor: 'rgba(52, 73, 94, 0.1)' }
              }}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
          </Box>

          {/* Sentences */}
          <Stack spacing={3}>
            {SENTENCES.map((sentence, index) => (
              <Paper
                key={sentence.id}
                elevation={3}
                sx={{
                  p: 3,
                  borderLeft: '4px solid #34495e',
                  backgroundColor: '#ecf0f1'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50' }} fontWeight="bold">
                  Sentence {index + 1}
                </Typography>

                {showHints && (
                  <Alert severity="info" sx={{ mb: 2, backgroundColor: '#d6eaf8' }}>
                    💡 Hint: {sentence.hint}
                  </Alert>
                )}

                {/* Sentence with blank for verb */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                    {sentence.beforeVerb}
                  </Typography>

                  <Paper
                    sx={{
                      px: 1,
                      py: 0.5,
                      backgroundColor: '#95a5a6',
                      display: 'inline-block'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'white', textDecoration: 'line-through', fontStyle: 'italic' }}>
                      {sentence.verb}
                    </Typography>
                  </Paper>

                  <TextField
                    value={answers[sentence.id] || ''}
                    onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                    placeholder="past tense"
                    variant="outlined"
                    size="small"
                    disabled={submitted}
                    sx={{
                      width: 150,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        '& fieldset': {
                          borderColor: '#34495e',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: '#2c3e50'
                        },
                        '& input': {
                          color: '#2c3e50'
                        }
                      }
                    }}
                  />

                  <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                    {sentence.afterVerb}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block' }}>
                  Original: {sentence.beforeVerb} <strong>{sentence.verb}</strong> {sentence.afterVerb}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {/* Submit Button */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)' }
              }}
            >
              Submit All Answers
            </Button>

            {!allAnswered && (
              <Typography variant="caption" display="block" color="error" sx={{ mt: 1 }}>
                Please answer all 6 verbs before submitting
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}>
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Time Travel Complete! 🎉
              </Typography>
              <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                  {results.score} / 6
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Bonus Points Earned
                </Typography>
              </Paper>
            </Box>
          </Paper>

          {/* Detailed Feedback */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50' }} fontWeight="bold">
              Detailed Feedback
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {results.feedback.map((item, index) => (
                <Paper
                  key={item.id}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: '4px solid',
                    borderColor: item.isCorrect ? '#27ae60' : '#e74c3c',
                    backgroundColor: item.isCorrect ? '#d5f4e6' : '#fadbd8'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                      Sentence {index + 1}
                    </Typography>
                    {item.isCorrect ? (
                      <CheckCircleIcon sx={{ color: '#27ae60' }} />
                    ) : (
                      <CancelIcon sx={{ color: '#e74c3c' }} />
                    )}
                  </Stack>

                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#2c3e50' }}>
                      {item.beforeVerb}
                    </Typography>

                    <Paper
                      sx={{
                        px: 2,
                        py: 0.5,
                        backgroundColor: item.isCorrect ? '#27ae60' : '#e74c3c',
                        display: 'inline-block'
                      }}
                    >
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {item.studentAnswer || '(empty)'}
                      </Typography>
                    </Paper>

                    <Typography variant="body1" sx={{ color: '#2c3e50' }}>
                      {item.afterVerb}
                    </Typography>
                  </Box>

                  {!item.isCorrect && (
                    <Alert severity="error" sx={{ mt: 2, backgroundColor: '#f8d7da' }}>
                      <strong>Correct Answer:</strong> {item.correctAnswer}
                      <br />
                      <Typography variant="caption">
                        Full sentence: {item.beforeVerb} <strong>{item.correctAnswer}</strong> {item.afterVerb}
                      </Typography>
                    </Alert>
                  )}
                </Paper>
              ))}
            </Stack>
          </Paper>

          {/* Continue Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)' }
              }}
            >
              Continue to Task F (Bonus) →
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
