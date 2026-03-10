import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip, LinearProgress, Avatar } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import ExploreIcon from '@mui/icons-material/Explore'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task E: Tense Odyssey
 * Mixed tenses grammar exercise - Complete 6 sentences using different tenses
 * Inspired by ESL Games Plus mixed tenses games
 * Score: +1 for each correct tense (6 total)
 */

const TENSE_SENTENCES = [
  {
    id: 1,
    odyssey: 'Odyssey 1',
    character: 'Marketing Historian',
    avatar: '📜',
    before: 'Promotional is to sell',
    infinitive: 'to use',
    answer: 'has been used',
    tenseType: 'Present Perfect',
    after: 'since early ads.',
    concept: 'present perfect for actions started in past and continuing'
  },
  {
    id: 2,
    odyssey: 'Odyssey 2',
    character: 'Video Analyst',
    avatar: '📹',
    before: 'Persuasive uses logos',
    infinitive: 'to use',
    answer: 'used',
    tenseType: 'Simple Past',
    after: 'in video 1.',
    concept: 'simple past for completed action in video'
  },
  {
    id: 3,
    odyssey: 'Odyssey 3',
    character: 'Data Scientist',
    avatar: '📊',
    before: 'Targeted group is specific',
    infinitive: 'to become',
    answer: 'has become',
    tenseType: 'Present Perfect',
    after: 'more with data.',
    concept: 'present perfect for change over time'
  },
  {
    id: 4,
    odyssey: 'Odyssey 4',
    character: 'Campaign Director',
    avatar: '🎬',
    before: 'Original idea is new',
    infinitive: 'to be',
    answer: 'was',
    tenseType: 'Simple Past',
    after: 'key in past campaigns.',
    concept: 'simple past for historical campaigns'
  },
  {
    id: 5,
    odyssey: 'Odyssey 5',
    character: 'Creative Director',
    avatar: '🎨',
    before: 'Creative ads make memorable',
    infinitive: 'to stand',
    answer: 'have always stood',
    tenseType: 'Present Perfect',
    after: 'out.',
    concept: 'present perfect with "always" for ongoing truth'
  },
  {
    id: 6,
    odyssey: 'Odyssey 6',
    character: 'Ethics Officer',
    avatar: '⚖️',
    before: 'Ethical is honest',
    infinitive: 'to remain',
    answer: 'remains',
    tenseType: 'Simple Present',
    after: 'important today.',
    concept: 'simple present for current truth/fact'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

export default function RemedialC1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 5, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = TENSE_SENTENCES[currentSentenceIndex]

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
    if (currentSentenceIndex < TENSE_SENTENCES.length - 1) {
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
    const evaluatedResults = TENSE_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()

      // Check if answer is correct (allow some flexibility)
      // IMPORTANT: Must have an answer (not empty) to be correct
      const isCorrect = userAnswer.length > 0 && (
        userAnswer === correctAnswer ||
        userAnswer === correctAnswer.replace(' ', '') ||
        correctAnswer.includes(userAnswer) ||
        userAnswer.includes(correctAnswer)
      )

      return {
        sentenceId: sentence.id,
        odyssey: sentence.odyssey,
        character: sentence.character,
        avatar: sentence.avatar,
        userAnswer: answers[sentence.id] || '',
        correctAnswer: sentence.answer,
        tenseType: sentence.tenseType,
        isCorrect: isCorrect,
        fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}`
      }
    })

    setResults(evaluatedResults)

    // Calculate score
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)

    // Save score
    sessionStorage.setItem('remedial_step3_c1_taskE_score', totalScore)
    await logTaskCompletion(totalScore)

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
          level: 'C1',
          task: 'E',
          step: 2,
          score: finalScore,
          max_score: 6,
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
    navigate('/dashboard')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = TENSE_SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level C1 - Task E: Tense Odyssey 🗺️
          </Typography>
          <Typography variant="body1">
            Mixed tenses grammar exercise - Master verb tenses with video contexts!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Tense Odyssey! 🗺️ Embark on a journey through different verb tenses. Complete 6 sentences using the correct tense (present perfect, simple past, simple present, etc.). Each correct tense = 1 point. Total: 6 points! Ready to navigate through time? 🚀"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)' }}>
          <ExploreIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Tense Odyssey
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Odysseys • Mixed Tenses • 5 Minutes • Navigate Through Time!
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.95)', maxWidth: 700, mx: 'auto' }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
                📚 Grammar Focus: Mixed Tenses
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', textAlign: 'left' }}>
                <strong>Tenses You'll Use:</strong><br />
                • <strong>Present Perfect:</strong> has/have + past participle (for ongoing or recent actions)<br />
                • <strong>Simple Past:</strong> verb + -ed (for completed actions)<br />
                • <strong>Simple Present:</strong> base verb (for facts/routines)<br />
                <br />
                <strong>Context Clues:</strong><br />
                • "since early ads" → Present Perfect<br />
                • "in video 1" → Simple Past<br />
                • "today" → Simple Present
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
            START ODYSSEY! 🎮
          </Button>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 6

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4 - Step 3: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level C1 - Task E: Tense Odyssey - Results 🏆
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {perfectScore ? 'Odyssey Mastered! 🎉' : 'Odyssey Complete! 🎊'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#8e44ad' }}>
                {score} / 6
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Correct Tenses
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You mastered all mixed tenses! Grammar champion! 🌟
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#8e44ad' }} fontWeight="bold">
            Tense Review
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
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', backgroundColor: '#8e44ad' }}>
                    {result.avatar}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={result.odyssey}
                        sx={{
                          backgroundColor: '#8e44ad',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={result.tenseType}
                        sx={{
                          backgroundColor: '#3498db',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      {result.isCorrect ? (
                        <Chip
                          label="+1 Point"
                          icon={<CheckCircleIcon />}
                          sx={{
                            backgroundColor: '#27ae60',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      ) : (
                        <Chip
                          label="+0 Points"
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
                    Correct Sentence:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                      "{result.fullSentence}"
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                    Your Answer:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="h6" component="div" sx={{ color: result.isCorrect ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                      "{TENSE_SENTENCES[index].before} <span style={{
                        textDecoration: 'underline',
                        backgroundColor: result.isCorrect ? '#d5f4e6' : '#fadbd8',
                        padding: '2px 8px'
                      }}>{result.userAnswer || '(no answer)'}</span> {TENSE_SENTENCES[index].after}"
                    </Typography>
                  </Paper>
                </Box>

                {!result.isCorrect && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                      <strong>Remember:</strong> {TENSE_SENTENCES[index].concept}
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
            Complete C1 Remedial →
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with Timer */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {currentSentence.odyssey} / 6
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
          value={(currentSentenceIndex + 1) / TENSE_SENTENCES.length * 100}
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
          <strong>Instructions:</strong> Fill in the blank with the correct verb tense based on the context. Navigate between odysseys using the arrows below.
        </Typography>
      </Alert>

      {/* Current Sentence */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #8e44ad' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '2.5rem', backgroundColor: '#8e44ad' }}>
            {currentSentence.avatar}
          </Avatar>
          <Box>
            <Chip
              label={currentSentence.odyssey}
              sx={{
                backgroundColor: '#8e44ad',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                py: 2.5,
                mb: 1
              }}
            />
            <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              {currentSentence.character} says:
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #8e44ad' }}>
          <RecordVoiceOverIcon sx={{ fontSize: 40, color: '#8e44ad', mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
              "{currentSentence.before}
            </Typography>

            <TextField
              value={answers[currentSentence.id] || ''}
              onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
              placeholder={currentSentence.infinitive}
              variant="outlined"
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f3e5f5',
                  '& fieldset': {
                    borderColor: '#8e44ad',
                    borderWidth: 3
                  },
                  '&:hover fieldset': {
                    borderColor: '#6c3483'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6c3483'
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
              {currentSentence.after}"
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
            borderColor: '#8e44ad',
            color: '#8e44ad',
            borderWidth: 2,
            '&:hover': { borderColor: '#6c3483', backgroundColor: '#f3e5f5', borderWidth: 2 }
          }}
        >
          ← Previous Odyssey
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleNext}
          disabled={currentSentenceIndex === TENSE_SENTENCES.length - 1}
          sx={{
            borderColor: '#8e44ad',
            color: '#8e44ad',
            borderWidth: 2,
            '&:hover': { borderColor: '#6c3483', backgroundColor: '#f3e5f5', borderWidth: 2 }
          }}
        >
          Next Odyssey →
        </Button>
      </Stack>

      {/* Progress Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Odyssey Progress:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {TENSE_SENTENCES.map((sentence, index) => (
            <Chip
              key={sentence.id}
              label={`O${index + 1}`}
              avatar={<Avatar sx={{ fontSize: '1.2rem' }}>{sentence.avatar}</Avatar>}
              onClick={() => setCurrentSentenceIndex(index)}
              sx={{
                backgroundColor: answers[sentence.id]?.trim()
                  ? index === currentSentenceIndex
                    ? '#27ae60'
                    : '#8e44ad'
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
              ? 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)'
              : '#bdc3c7',
            '&:hover': {
              background: allAnswered
                ? 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)'
                : '#95a5a6'
            }
          }}
        >
          {allAnswered ? 'Complete Odyssey! 🗺️' : `Answer All First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
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
