import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, Edit } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A1 - Task C: Sentence Builder
 * Form 6 simple sentences using advertising terms
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCE_PROMPTS = [
  {
    term: 'promotional',
    hint: 'The ad is ___.',
    correctAnswer: 'The ad is promotional.',
    alternativeAnswers: ['The ad is promotional', 'Ad is promotional.', 'Ad is promotional']
  },
  {
    term: 'persuasive',
    hint: 'Ad is ___.',
    correctAnswer: 'Ad is persuasive.',
    alternativeAnswers: ['The ad is persuasive.', 'The ad is persuasive', 'Ad is persuasive']
  },
  {
    term: 'targeted',
    hint: 'Group is ___.',
    correctAnswer: 'Group is targeted.',
    alternativeAnswers: ['The group is targeted.', 'The group is targeted', 'Group is targeted']
  },
  {
    term: 'original',
    hint: 'Idea is ___.',
    correctAnswer: 'Idea is original.',
    alternativeAnswers: ['The idea is original.', 'The idea is original', 'Idea is original']
  },
  {
    term: 'creative',
    hint: 'Be ___.',
    correctAnswer: 'Be creative.',
    alternativeAnswers: ['Be creative']
  },
  {
    term: 'dramatisation',
    hint: 'Video has ___.',
    correctAnswer: 'Video has dramatisation.',
    alternativeAnswers: ['The video has dramatisation.', 'The video has dramatisation', 'Video has dramatisation']
  }
]

export default function RemedialA1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_a1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

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
    // Normalize answer: lowercase, trim, remove extra spaces and punctuation
    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')

    // Normalize term (flexible spelling - ignore minor mistakes)
    const termNormalized = prompt.term.toLowerCase()

    // Check for flexible spelling variations (simple Levenshtein-like check)
    const hasTermOrClose = (text, term) => {
      // Exact match
      if (text.includes(term)) return true

      // Check for common misspellings (1-2 character difference)
      const words = text.split(' ')
      for (const word of words) {
        // If word length is similar and shares most characters
        if (Math.abs(word.length - term.length) <= 2) {
          let matches = 0
          const minLen = Math.min(word.length, term.length)
          for (let i = 0; i < minLen; i++) {
            if (word[i] === term[i]) matches++
          }
          // Accept if 80%+ characters match in order
          if (matches >= minLen * 0.8) return true
        }
      }
      return false
    }

    // Must contain the term (or close spelling)
    const containsTerm = hasTermOrClose(normalized, termNormalized)

    // Must have correct verb structure for present simple
    const hasVerb = normalized.includes('is') || normalized.includes('be') ||
                    normalized.includes('has') || normalized.includes('are')

    // Must be a simple sentence (3-10 words)
    const wordCount = normalized.split(' ').length
    const isSimple = wordCount >= 3 && wordCount <= 10

    // Accept if: has term + has verb + is simple sentence
    if (containsTerm && hasVerb && isSimple) {
      return true
    }

    return false
  }

  const handleSubmit = async () => {
    // Prepare all sentences for single API call
    const sentences = userAnswers.map((answer, index) => ({
      term: SENTENCE_PROMPTS[index].term,
      hint: SENTENCE_PROMPTS[index].hint,
      userAnswer: answer,
      correctAnswer: SENTENCE_PROMPTS[index].correctAnswer
    }))

    try {
      // Single API call to evaluate all 6 sentences at once
      const response = await fetch('/api/phase4/evaluate-simple-sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          sentences: sentences
        })
      })

      const data = await response.json()

      if (data.success && data.results) {
        // Use AI results
        const checkResults = data.results.map((result, index) => ({
          userAnswer: userAnswers[index],
          correctAnswer: SENTENCE_PROMPTS[index].correctAnswer,
          isCorrect: result.isCorrect
        }))

        setResults(checkResults)
        const correctCount = checkResults.filter(r => r.isCorrect).length
        setScore(correctCount)
        setSubmitted(true)

        // Store result for Step 3
        sessionStorage.setItem('remedial_step3_a1_taskC_score', correctCount)

        // Log to backend
        await logTaskCompletion(correctCount)
      } else {
        // Fallback to local evaluation
        await handleSubmitLocal()
      }
    } catch (error) {
      console.error('AI evaluation error:', error)
      // Fallback to local evaluation
      await handleSubmitLocal()
    }
  }

  const handleSubmitLocal = async () => {
    // Fallback: local evaluation
    const checkResults = userAnswers.map((answer, index) => {
      const isCorrect = checkAnswer(answer, SENTENCE_PROMPTS[index])
      return {
        userAnswer: answer,
        correctAnswer: SENTENCE_PROMPTS[index].correctAnswer,
        isCorrect
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result for Step 3
    sessionStorage.setItem('remedial_step3_a1_taskC_score', correctCount)

    // Log to backend
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'C',
          step: 2,
          score: score,
          max_score: SENTENCE_PROMPTS.length,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 3 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step3_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step3_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step3_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= 18 // 18/22 = ~82%

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 2 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Term Treasure Hunt):', taskAScore, '/8')
    console.log('Task B (Fill Quest):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/22')
    console.log('PASS THRESHOLD: 18/22')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to next phase')
    } else {
      console.log('❌ FAILED - Student will repeat Step 3 Remedial Level A1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/step3/remedial/a1/final-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 3 Final A1 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A1 scores
      sessionStorage.removeItem('remedial_step3_a1_taskA_score')
      sessionStorage.removeItem('remedial_step3_a1_taskB_score')
      sessionStorage.removeItem('remedial_step3_a1_taskC_score')

      if (passed) {
        // Navigate to dashboard or next phase
        navigate('/dashboard')
      } else {
        // Restart from Task A
        navigate('/phase4/step3/remedial/a1/taskA')
      }
    }, 5000) // 5 second delay
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task C: Sentence Builder 🏗️
        </Typography>
        <Typography variant="body1">
          Build simple sentences using advertising terms! Stack sentences like blocks - correct grammar stacks higher!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Great work on the Fill Quest! Now let's build sentences! 🏗️ You need to write 6 simple sentences using the advertising terms. Look at each hint and write a complete sentence. Remember: use present simple tense (is, has, be). Don't worry about small spelling mistakes - focus on making clear, simple sentences!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {SENTENCE_PROMPTS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? 'success.main' :
                                    idx === currentIndex ? 'primary.main' : 'grey.300'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Sentence Builder */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Term: <strong>{currentPrompt.term}</strong>
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Hint: {currentPrompt.hint}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Write your sentence here"
                placeholder="Type a simple sentence using the term..."
                value={userAnswers[currentIndex]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: <Edit sx={{ mr: 1, color: 'action.disabled' }} />
                }}
              />
            </Box>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>

              {currentIndex < SENTENCE_PROMPTS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex]}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={userAnswers.some(answer => !answer)}
                >
                  Submit All Sentences
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to sentence:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {SENTENCE_PROMPTS.map((prompt, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{ minWidth: 40 }}
                >
                  {idx + 1} {userAnswers[idx] && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : !showFinalResults ? (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
            <Typography variant="h4" gutterBottom color="success.dark">
              {score === SENTENCE_PROMPTS.length ? '🏗️ Perfect Builder! 🏗️' : '🌟 Good Work! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of {SENTENCE_PROMPTS.length} points!
            </Typography>
            {score === SENTENCE_PROMPTS.length && (
              <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
                Amazing! All your sentences are correct!
              </Typography>
            )}
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sentence Review:
            </Typography>
            <Stack spacing={2}>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  severity={result.isCorrect ? 'success' : 'error'}
                  icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                >
                  <Typography variant="body2">
                    <strong>Sentence {index + 1} ({SENTENCE_PROMPTS[index].term}):</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your answer: "{result.userAnswer}"
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Correct example: <strong>{result.correctAnswer}</strong>
                    </Typography>
                  )}
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              View Final Results
            </Button>
          </Stack>
        </Box>
      ) : (
        /* Final Results - Pass/Fail */
        <Paper
          elevation={8}
          sx={{
            p: 5,
            textAlign: 'center',
            backgroundColor: finalScore.passed ? 'success.main' : 'warning.main',
            color: 'white'
          }}
        >
          <Typography variant="h3" gutterBottom fontWeight="bold">
            {finalScore.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h5" gutterBottom>
              Phase 4 Step 3 - Remedial A1 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Term Treasure Hunt): {finalScore.taskA} / 8
            </Typography>
            <Typography variant="h6">
              Task B (Fill Quest): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h6">
              Task C (Sentence Builder): {finalScore.taskC} / 6
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 22
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 18 / 22
            </Typography>
          </Box>

          {finalScore.passed ? (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ✅ You have passed Step 3 Remedial A1!
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Proceeding to dashboard...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ❌ Score below passing threshold
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Restarting Step 3 Remedial A1 to help you improve...
              </Typography>
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
            Redirecting in 5 seconds...
          </Typography>
        </Paper>
      )}
    </Box>
  )
}
