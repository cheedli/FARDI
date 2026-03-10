import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip, LinearProgress, Avatar } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task F: Grammar Role-Play
 * Role-play grammar exercise - Complete 6 lines with passive voice using social media terms
 * Inspired by Duolingo's quest-based learning
 * Score: +1 for each correct passive sentence (6 total, converted to /10 scale)
 */

const ROLE_PLAY_LINES = [
  {
    id: 1,
    quest: 'Quest 1',
    character: 'Social Media Manager',
    avatar: '📱',
    before: 'The hashtag',
    answer: 'is used',
    infinitive: 'to use',
    after: 'for categorization.',
    concept: 'passive voice with hashtag usage'
  },
  {
    id: 2,
    quest: 'Quest 2',
    character: 'Content Creator',
    avatar: '✍️',
    before: 'The caption',
    answer: 'is written',
    infinitive: 'to write',
    after: 'to engage readers.',
    concept: 'passive voice with caption creation'
  },
  {
    id: 3,
    quest: 'Quest 3',
    character: 'Viral Marketing Specialist',
    avatar: '🚀',
    before: 'Viral content',
    answer: 'is shared',
    infinitive: 'to share',
    after: 'millions of times daily.',
    concept: 'passive voice (plural) with viral content'
  },
  {
    id: 4,
    quest: 'Quest 4',
    character: 'Engagement Analyst',
    avatar: '📊',
    before: 'User engagement',
    answer: 'is measured',
    infinitive: 'to measure',
    after: 'by likes and comments.',
    concept: 'passive voice with engagement metrics'
  },
  {
    id: 5,
    quest: 'Quest 5',
    character: 'Brand Ambassador',
    avatar: '🎯',
    before: 'A call-to-action',
    answer: 'is included',
    infinitive: 'to include',
    after: 'to drive conversions.',
    concept: 'passive voice with CTA strategy'
  },
  {
    id: 6,
    quest: 'Quest 6',
    character: 'Story Strategist',
    avatar: '📖',
    before: 'Stories',
    answer: 'are posted',
    infinitive: 'to post',
    after: 'for 24-hour visibility.',
    concept: 'passive voice (plural) with stories feature'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 lines

export default function RemedialB2TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 6, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentLine = ROLE_PLAY_LINES[currentLineIndex]

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

  const handleAnswerChange = (lineId, value) => {
    setAnswers({
      ...answers,
      [lineId]: value
    })
  }

  const handleNext = () => {
    if (currentLineIndex < ROLE_PLAY_LINES.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1)
    }
  }

  const handleSubmitAll = async () => {
    setSubmitted(true)

    // Evaluate each answer
    const evaluatedResults = ROLE_PLAY_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const correctAnswer = line.answer.toLowerCase()

      // Check if answer is correct (allow some flexibility)
      const isCorrect = userAnswer === correctAnswer ||
                       userAnswer === correctAnswer.replace(' ', '') ||
                       userAnswer.includes(correctAnswer)

      return {
        lineId: line.id,
        quest: line.quest,
        character: line.character,
        avatar: line.avatar,
        userAnswer: answers[line.id] || '',
        correctAnswer: line.answer,
        isCorrect: isCorrect,
        fullLine: `${line.before} ${line.answer} ${line.after}`
      }
    })

    setResults(evaluatedResults)

    // Calculate score (6 correct = 10 points)
    const correctCount = evaluatedResults.filter(r => r.isCorrect).length
    const finalScore = Math.round((correctCount / 6) * 10)
    setScore(finalScore)

    // Save score
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskF_score', finalScore)
    await logTaskCompletion(finalScore)

    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          level: 'B2',
          task: 'F',
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
    navigate('/phase4_2/step1/remedial/b2/results')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = ROLE_PLAY_LINES.every(l => answers[l.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task F: Grammar Role-Play
          </Typography>
          <Typography variant="body1">
            Role-play grammar exercise - Master passive voice through character dialogues!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Grammar Role-Play! You'll play different social media roles and complete their dialogues using the passive voice. Fill in 6 role-play lines with the correct passive form (is/are + past participle). Each correct line earns points towards your final score of 10! Ready to start your quest?"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <TheaterComedyIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Grammar Role-Play
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Quests • 6 Characters • 5 Minutes • Complete the Passive Voice!
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.95)', maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
                Grammar Focus: Passive Voice
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', textAlign: 'left' }}>
                <strong>Structure:</strong><br />
                • Subject + is/are + past participle (+ by + agent)<br />
                • Use "is" for singular subjects<br />
                • Use "are" for plural subjects<br />
                <br />
                <strong>Example:</strong><br />
                "The hashtag <u>is used</u> for discovery."<br />
                "Posts <u>are created</u> daily."
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
            START QUEST!
          </Button>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 10

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task F: Grammar Role-Play - Results
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {perfectScore ? 'Quest Mastered!' : 'Quest Complete!'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#9b59b6' }}>
                {score} / 10
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You mastered all passive voice lines! Grammar champion!
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9b59b6' }} fontWeight="bold">
            Role-Play Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {results.map((result, index) => (
              <Paper
                key={result.lineId}
                elevation={2}
                sx={{
                  p: 3,
                  borderLeft: '4px solid',
                  borderColor: result.isCorrect ? '#27ae60' : '#e74c3c',
                  backgroundColor: result.isCorrect ? '#d5f4e6' : '#fadbd8'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', backgroundColor: '#9b59b6' }}>
                    {result.avatar}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={result.quest}
                        sx={{
                          backgroundColor: '#9b59b6',
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
                    <Typography variant="subtitle1" sx={{ color: '#34495e', fontWeight: 600, mt: 0.5 }}>
                      {result.character}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                    Correct Line:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                      "{result.fullLine}"
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
                      "{ROLE_PLAY_LINES[index].before} <span style={{
                        textDecoration: 'underline',
                        backgroundColor: result.isCorrect ? '#d5f4e6' : '#fadbd8',
                        padding: '2px 8px'
                      }}>{result.userAnswer || '(no answer)'}</span> {ROLE_PLAY_LINES[index].after}"
                    </Typography>
                  </Paper>
                </Box>

                {!result.isCorrect && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                      <strong>Remember:</strong> Use is/are + past participle for passive voice
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
            View Final Results
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with Timer */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {currentLine.quest} / 6
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
          value={(currentLineIndex + 1) / ROLE_PLAY_LINES.length * 100}
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
          <strong>Instructions:</strong> Fill in the blank with the correct passive voice form (is/are + past participle). Navigate between quests using the arrows below.
        </Typography>
      </Alert>

      {/* Current Role-Play Line */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #9b59b6' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '2.5rem', backgroundColor: '#9b59b6' }}>
            {currentLine.avatar}
          </Avatar>
          <Box>
            <Chip
              label={currentLine.quest}
              sx={{
                backgroundColor: '#9b59b6',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                py: 2.5,
                mb: 1
              }}
            />
            <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              {currentLine.character} says:
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #9b59b6' }}>
          <RecordVoiceOverIcon sx={{ fontSize: 40, color: '#9b59b6', mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
              "{currentLine.before}
            </Typography>

            <TextField
              value={answers[currentLine.id] || ''}
              onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
              placeholder={currentLine.infinitive}
              variant="outlined"
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f3e5f5',
                  '& fieldset': {
                    borderColor: '#9b59b6',
                    borderWidth: 3
                  },
                  '&:hover fieldset': {
                    borderColor: '#8e44ad'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8e44ad'
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
              {currentLine.after}"
            </Typography>
          </Box>
        </Paper>

        <Alert severity="success" sx={{ mt: 3, backgroundColor: '#d4edda' }}>
          <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 500 }}>
            <strong>Concept:</strong> {currentLine.concept}
          </Typography>
        </Alert>
      </Paper>

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handlePrevious}
          disabled={currentLineIndex === 0}
          sx={{
            borderColor: '#9b59b6',
            color: '#9b59b6',
            borderWidth: 2,
            '&:hover': { borderColor: '#8e44ad', backgroundColor: '#f3e5f5', borderWidth: 2 }
          }}
        >
          Previous Quest
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleNext}
          disabled={currentLineIndex === ROLE_PLAY_LINES.length - 1}
          sx={{
            borderColor: '#9b59b6',
            color: '#9b59b6',
            borderWidth: 2,
            '&:hover': { borderColor: '#8e44ad', backgroundColor: '#f3e5f5', borderWidth: 2 }
          }}
        >
          Next Quest
        </Button>
      </Stack>

      {/* Progress Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Quest Progress:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {ROLE_PLAY_LINES.map((line, index) => (
            <Chip
              key={line.id}
              label={`Q${index + 1}`}
              avatar={<Avatar sx={{ fontSize: '1.2rem' }}>{line.avatar}</Avatar>}
              onClick={() => setCurrentLineIndex(index)}
              sx={{
                backgroundColor: answers[line.id]?.trim()
                  ? index === currentLineIndex
                    ? '#27ae60'
                    : '#9b59b6'
                  : index === currentLineIndex
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
              ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
              : '#bdc3c7',
            '&:hover': {
              background: allAnswered
                ? 'linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)'
                : '#95a5a6'
            }
          }}
        >
          {allAnswered ? 'Complete Quest!' : `Answer All Lines First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
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
