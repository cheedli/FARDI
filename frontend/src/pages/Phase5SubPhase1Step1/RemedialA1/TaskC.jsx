import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A1 - Task C: Simple Sentence Writing
 * Write 6 very simple sentences about the problem, gamified as "Sentence Builder"
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCE_PROMPTS = [
  {
    term: 'problem',
    hint: 'Singer has ___.',
    correctAnswer: 'Singer has problem.',
    alternativeAnswers: ['Singer has problem', 'Singer has a problem.', 'Singer has a problem']
  },
  {
    term: 'cancel',
    hint: 'We cancel ___.',
    correctAnswer: 'We cancel singer.',
    alternativeAnswers: ['We cancel the singer.', 'We cancel the singer', 'We cancel singer']
  },
  {
    term: 'change',
    hint: '___ time.',
    correctAnswer: 'Change time.',
    alternativeAnswers: ['Change the time.', 'Change the time', 'Change time']
  },
  {
    term: 'solution',
    hint: 'Find ___.',
    correctAnswer: 'Find solution.',
    alternativeAnswers: ['Find a solution.', 'Find a solution', 'Find solution']
  },
  {
    term: 'sorry',
    hint: 'Say ___.',
    correctAnswer: 'Say sorry.',
    alternativeAnswers: ['Say sorry', 'Say sorry.']
  },
  {
    term: 'fix',
    hint: '___ problem.',
    correctAnswer: 'Fix problem.',
    alternativeAnswers: ['Fix the problem.', 'Fix the problem', 'Fix problem']
  }
]

export default function Phase5Step1RemedialA1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_a1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [showFinalResults, setShowFinalResults] = useState(false)

  const currentPrompt = SENTENCE_PROMPTS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCE_PROMPTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkAnswer = (userAnswer, prompt) => {
    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    const termNormalized = prompt.term.toLowerCase()

    const hasTerm = normalized.includes(termNormalized)
    const hasBasicStructure = normalized.split(' ').length >= 2

    return hasTerm && hasBasicStructure
  }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const prompt = SENTENCE_PROMPTS[index]
      const isCorrect = checkAnswer(answer, prompt)
      return {
        userAnswer: answer,
        correctAnswer: prompt.correctAnswer,
        isCorrect
      }
    })

    const correctCount = checkResults.filter(r => r.isCorrect).length
    setResults(checkResults)
    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase5_step1_remedial_a1_taskC_score', correctCount.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A1', 'C', correctCount, 6, 0)
      console.log('[Phase 5 Step 1] A1 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total A1 score
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6 // 22 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 18
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 5 STEP 1 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Match Race):', taskAScore, '/8')
    console.log('Task B (Fill Frenzy):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Dashboard/Next Phase')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      await phase5API.calculateRemedialScore(1, 'A1', {
        task_a_score: taskAScore,
        task_b_score: taskBScore,
        task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      // Navigate to dashboard or next phase
      navigate('/dashboard')
    } else {
      // Repeat A1 remedial
      navigate('/phase5/subphase/1/step/1/remedial/a1/task/a')
    }
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A1
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task C: Sentence Builder
        </Typography>
        <Typography variant="body1">
          Write 6 very simple sentences about the problem
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Excellent work! Now let's build sentences. Write a simple sentence for each term. Use the hint to help you. Remember: simple present tense and basic meaning!"
        />
      </Paper>

      {!submitted ? (
        <>
          {/* Progress */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>

          {/* Current Sentence */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Term: <strong>{currentPrompt.term}</strong>
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Hint:</strong> {currentPrompt.hint}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder={`Write a simple sentence using "${currentPrompt.term}"...`}
              value={userAnswers[currentIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>
              {currentIndex === SENTENCE_PROMPTS.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!userAnswers[currentIndex].trim()}
                >
                  Submit All Sentences
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex].trim()}
                >
                  Next →
                </Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          {/* Results */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Results: {score} / {SENTENCE_PROMPTS.length} Correct
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {results.map((result, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: result.isCorrect ? 'success.lighter' : 'error.lighter',
                    border: '1px solid',
                    borderColor: result.isCorrect ? 'success.main' : 'error.main'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {result.isCorrect ? (
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                    ) : (
                      <Cancel sx={{ color: 'error.main', mr: 1 }} />
                    )}
                    <Typography variant="subtitle2" fontWeight="bold">
                      Sentence {index + 1}: {SENTENCE_PROMPTS[index].term}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Your answer:</strong> {result.userAnswer || '(empty)'}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="success.dark">
                      <strong>Example:</strong> {result.correctAnswer}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
          >
            Continue to Final Results →
          </Button>
        </>
      )}
    </Box>
  )
}
