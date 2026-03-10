import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task E: Conditional Challenge
 * Grammar exercise - Complete 6 conditional sentences with social media terms
 * Gamified challenge with levels (like ESL Games Plus conditionals)
 * Score: +1 for each correct sentence (6 total, converted to /10 scale)
 */

const SENTENCES = [
  {
    id: 1,
    level: 'Level 1',
    before: 'If you use a hashtag, your post',
    answer: 'would reach',
    infinitive: 'to reach',
    after: 'more people.',
    concept: 'hashtags increase discovery and reach'
  },
  {
    id: 2,
    level: 'Level 2',
    before: 'A good caption',
    answer: 'would engage',
    infinitive: 'to engage',
    after: 'readers if it tells a story.',
    concept: 'captions drive engagement through storytelling'
  },
  {
    id: 3,
    level: 'Level 3',
    before: 'If content goes viral, it',
    answer: 'would spread',
    infinitive: 'to spread',
    after: 'rapidly across platforms.',
    concept: 'viral content spreads quickly'
  },
  {
    id: 4,
    level: 'Level 4',
    before: 'Emojis',
    answer: 'would add',
    infinitive: 'to add',
    after: 'emotion if used properly.',
    concept: 'emojis enhance emotional expression'
  },
  {
    id: 5,
    level: 'Level 5',
    before: 'If you tag someone, they',
    answer: 'would see',
    infinitive: 'to see',
    after: 'your post in their notifications.',
    concept: 'tagging increases visibility'
  },
  {
    id: 6,
    level: 'Level 6',
    before: 'A call-to-action',
    answer: 'would drive',
    infinitive: 'to drive',
    after: 'conversions if clear and compelling.',
    concept: 'CTAs motivate user action'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

export default function RemedialB2TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 5, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = SENTENCES[currentSentenceIndex]

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up! Auto-submit
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => {
    setAnswers({
      ...answers,
      [sentenceId]: value
    })
  }

  const handleNext = () => {
    if (currentSentenceIndex < SENTENCES.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1)
    }
  }

  const handleSubmitAll = async () => {
    setSubmitted(true)

    // Evaluate each answer
    const evaluatedResults = SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()

      // Check if answer is correct (allow some flexibility)
      const isCorrect = userAnswer === correctAnswer ||
                       userAnswer === correctAnswer.replace(' ', '') ||
                       userAnswer.includes(correctAnswer)

      return {
        sentenceId: sentence.id,
        level: sentence.level,
        userAnswer: answers[sentence.id] || '',
        correctAnswer: sentence.answer,
        isCorrect: isCorrect,
        fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}`
      }
    })

    setResults(evaluatedResults)

    // Calculate score (6 correct = 10 points)
    const correctCount = evaluatedResults.filter(r => r.isCorrect).length
    const finalScore = Math.round((correctCount / 6) * 10)
    setScore(finalScore)

    // Save score
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskE_score', finalScore)
    await logTaskCompletion(finalScore)

    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          level: 'B2',
          task: 'E',
          step: 1,
          score: finalScore,
          max_score: 10,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleContinue = () => {
    navigate('/phase4_2/step1/remedial/b2/taskF')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task E: Conditional Challenge
          </Typography>
          <Typography variant="body1">
            Grammar exercise - Master conditionals with social media terms!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to the Conditional Challenge! Complete 6 conditional sentences using social media terms. Use the correct conditional form (would + verb) to describe 'what if' scenarios. Each correct sentence = points towards your final score of 10! Ready for the challenge?"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }}>
          <EditNoteIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Conditional Challenge
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Levels • 5 Minutes • Complete the Conditionals!
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.95)', maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
                Grammar Focus: Second Conditional
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', textAlign: 'left' }}>
                <strong>Structure:</strong><br />
                • If + subject + verb (past), subject + would + verb (base)<br />
                • Subject + would + verb (base) + if + subject + verb (past)<br />
                <br />
                <strong>Example:</strong><br />
                "If the post <u>had</u> a hashtag, it <u>would reach</u> more people."
              </Typography>
            </Paper>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            sx={{
              py: 2,
              px: 8,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: '#27ae60',
              color: 'white',
              '&:hover': { backgroundColor: '#229954' }
            }}
          >
            START CHALLENGE!
          </Button>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 10

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task E: Conditional Challenge - Results
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {perfectScore ? 'Perfect Grammar!' : 'Challenge Complete!'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#3498db' }}>
                {score} / 10
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You mastered all conditional sentences! Grammar expert!
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#3498db' }} fontWeight="bold">
            Sentence Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {results.map((result, index) => (
              <Paper
                key={result.sentenceId}
                elevation={2}
                sx={{
                  p: 3,
                  borderLeft: '4px solid',
                  borderColor: result.isCorrect ? '#27ae60' : '#e74c3c',
                  backgroundColor: result.isCorrect ? '#d5f4e6' : '#fadbd8'
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={result.level}
                    sx={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  {result.isCorrect ? (
                    <Chip
                      label="Correct"
                      icon={<CheckCircleIcon />}
                      sx={{
                        backgroundColor: '#27ae60',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  ) : (
                    <Chip
                      label="Incorrect"
                      icon={<CancelIcon />}
                      sx={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                    Correct Sentence:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                      {result.fullSentence}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                    Your Answer:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{
                      color: result.isCorrect ? '#27ae60' : '#e74c3c',
                      fontWeight: 'bold'
                    }}>
                      {SENTENCES[index].before} <span style={{
                        textDecoration: 'underline',
                        backgroundColor: result.isCorrect ? '#d5f4e6' : '#fadbd8',
                        padding: '2px 8px'
                      }}>{result.userAnswer || '(no answer)'}</span> {SENTENCES[index].after}
                    </Typography>
                  </Paper>
                </Box>

                {!result.isCorrect && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                      <strong>Remember:</strong> Use "would" + base verb for the second conditional
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
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)' }
            }}
          >
            Continue to Task F
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with Timer */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {currentSentence.level} / 6
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon />
            <Typography variant="h6" sx={{
              color: timeLeft <= 60 ? '#e74c3c' : 'white',
              fontWeight: timeLeft <= 60 ? 'bold' : 'normal'
            }}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={(currentSentenceIndex + 1) / SENTENCES.length * 100}
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#27ae60'
            }
          }}
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600 }}>
          <strong>Instructions:</strong> Fill in the blank with the correct conditional form (would + verb). Navigate between levels using the arrows below.
        </Typography>
      </Alert>

      {/* Current Sentence */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #3498db' }}>
        <Chip
          label={currentSentence.level}
          sx={{
            backgroundColor: '#3498db',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            py: 2.5,
            mb: 3
          }}
        />

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #3498db' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
              {currentSentence.before}
            </Typography>

            <TextField
              value={answers[currentSentence.id] || ''}
              onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
              placeholder={currentSentence.infinitive}
              variant="outlined"
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fffacd',
                  '& fieldset': {
                    borderColor: '#3498db',
                    borderWidth: 3
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9'
                  },
                  '& input': {
                    color: '#1a252f',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    textAlign: 'center'
                  },
                  '& input::placeholder': {
                    color: '#95a5a6',
                    opacity: 0.8,
                    fontWeight: 500
                  }
                }
              }}
            />

            <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
              {currentSentence.after}
            </Typography>
          </Box>
        </Paper>

        <Alert severity="success" sx={{ mt: 3, backgroundColor: '#d4edda' }}>
          <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 500 }}>
            <strong>Concept:</strong> {currentSentence.concept}
          </Typography>
        </Alert>
      </Paper>

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handlePrevious}
          disabled={currentSentenceIndex === 0}
          sx={{
            borderColor: '#3498db',
            color: '#3498db',
            borderWidth: 2,
            '&:hover': { borderColor: '#2980b9', backgroundColor: '#e8f4f8', borderWidth: 2 }
          }}
        >
          Previous Level
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleNext}
          disabled={currentSentenceIndex === SENTENCES.length - 1}
          sx={{
            borderColor: '#3498db',
            color: '#3498db',
            borderWidth: 2,
            '&:hover': { borderColor: '#2980b9', backgroundColor: '#e8f4f8', borderWidth: 2 }
          }}
        >
          Next Level
        </Button>
      </Stack>

      {/* Progress Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Your Progress:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {SENTENCES.map((sentence, index) => (
            <Chip
              key={sentence.id}
              label={`L${index + 1}`}
              onClick={() => setCurrentSentenceIndex(index)}
              sx={{
                backgroundColor: answers[sentence.id]?.trim()
                  ? index === currentSentenceIndex
                    ? '#27ae60'
                    : '#3498db'
                  : index === currentSentenceIndex
                    ? '#e67e22'
                    : '#95a5a6',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            />
          ))}
        </Stack>
        <Typography variant="body2" sx={{ mt: 2, color: '#7f8c8d' }}>
          Answered: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6
        </Typography>
      </Paper>

      {/* Submit Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmitAll}
          disabled={!allAnswered}
          sx={{
            py: 3,
            px: 8,
            fontSize: '1.3rem',
            fontWeight: 'bold',
            background: allAnswered
              ? 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
              : '#bdc3c7',
            '&:hover': {
              background: allAnswered
                ? 'linear-gradient(135deg, #2980b9 0%, #21618c 100%)'
                : '#95a5a6'
            }
          }}
        >
          {allAnswered ? 'Submit All Answers!' : `Answer All Sentences First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
        </Button>
      </Box>

      {/* Timer Warning */}
      {timeLeft <= 60 && (
        <Alert severity="warning" sx={{ mt: 3, backgroundColor: '#f39c12', color: 'white' }}>
          <strong>Hurry!</strong> Only {timeLeft} seconds left!
        </Alert>
      )}
    </Box>
  )
}
