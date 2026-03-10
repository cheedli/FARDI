import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Chip, LinearProgress, Avatar } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BuildIcon from '@mui/icons-material/Build'
import ErrorIcon from '@mui/icons-material/Error'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Remedial C1 - Task H: Correction Crusade
 * Error correction game - Fix 6 sentences with verb agreement errors
 * Inspired by ESL Games Plus error correction games
 * Score: +1 for each correct correction (6 total)
 */

const ERROR_SENTENCES = [
  {
    id: 1,
    crusader: 'Grammar Detective',
    avatar: '🔍',
    before: 'Instagram strategy',
    infinitive: 'to be',
    wrongWord: 'are',
    after: 'crucial.',
    answer: 'is',
    errorType: 'Subject-Verb Agreement',
    concept: 'Singular subject "strategy" requires singular verb "is"'
  },
  {
    id: 2,
    crusader: 'Syntax Fixer',
    avatar: '🔧',
    before: 'Hashtag optimization',
    infinitive: 'to require',
    wrongWord: 'require',
    after: 'research.',
    answer: 'requires',
    errorType: 'Subject-Verb Agreement',
    concept: 'Singular subject "optimization" requires third-person singular "requires"'
  },
  {
    id: 3,
    crusader: 'Error Hunter',
    avatar: '🎯',
    before: 'Target audience',
    infinitive: 'to be',
    wrongWord: 'are',
    after: 'specific.',
    answer: 'is',
    errorType: 'Subject-Verb Agreement',
    concept: 'Singular subject "audience" requires singular verb "is"'
  },
  {
    id: 4,
    crusader: 'Correction Master',
    avatar: '⚡',
    before: 'Caption quality',
    infinitive: 'to be',
    wrongWord: 'are',
    after: 'important.',
    answer: 'is',
    errorType: 'Subject-Verb Agreement',
    concept: 'Singular subject "quality" requires singular verb "is"'
  },
  {
    id: 5,
    crusader: 'Grammar Guardian',
    avatar: '🛡️',
    before: 'Viral posts',
    infinitive: 'to need',
    wrongWord: 'needs',
    after: 'engagement.',
    answer: 'need',
    errorType: 'Subject-Verb Agreement',
    concept: 'Plural subject "posts" requires plural verb "need"'
  },
  {
    id: 6,
    crusader: 'Accuracy Champion',
    avatar: '👑',
    before: 'Content creation',
    infinitive: 'to be',
    wrongWord: 'are',
    after: 'essential.',
    answer: 'is',
    errorType: 'Subject-Verb Agreement',
    concept: 'Singular subject "creation" requires singular verb "is"'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

export default function Phase4_2Step2RemedialC1TaskH() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 8, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = ERROR_SENTENCES[currentSentenceIndex]

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
    if (currentSentenceIndex < ERROR_SENTENCES.length - 1) {
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
    const evaluatedResults = ERROR_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()

      // Check if answer is correct - must have an answer and match exactly
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer

      return {
        sentenceId: sentence.id,
        crusader: sentence.crusader,
        before: sentence.before,
        wrongWord: sentence.wrongWord,
        after: sentence.after,
        userAnswer: answers[sentence.id] || '(No answer provided)',
        correctAnswer: sentence.answer,
        isCorrect: isCorrect,
        errorType: sentence.errorType,
        concept: sentence.concept
      }
    })

    setResults(evaluatedResults)

    // Calculate score
    const rawScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(rawScore)

    // Save score
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskH_score', rawScore)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskH_max', '6')

    // Log completion
    await logTaskCompletion(rawScore)

    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskH', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 2,
          level: 'C1',
          task: 'H',
          score: finalScore,
          max_score: 6,
          completed: true,
          time_taken: TIME_LIMIT - timeLeft
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: 700,
            width: '100%',
            padding: 6,
            textAlign: 'center',
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 4
          }}
        >
          <Box sx={{ mb: 3 }}>
            <BuildIcon sx={{ fontSize: 80, color: '#e74c3c', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>
              🔧 Correction Crusade
            </Typography>
            <Typography variant="h6" sx={{ color: '#5a6c7d', mb: 3 }}>
              Level C1 - Task H: Error Correction
            </Typography>
          </Box>

          <CharacterMessage speaker="Emna" direction="left">
            Welcome to Correction Crusade! Hunt down and fix 6 grammar errors in Instagram strategy sentences. Each sentence has ONE wrong verb that needs correction!
          </CharacterMessage>

          <Box sx={{ mt: 4, mb: 4, p: 3, bgcolor: '#ffe8e6', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#c0392b', mb: 2 }}>
              🎯 Mission Objectives
            </Typography>
            <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>🔍 Find & Fix Errors:</strong> Each sentence has ONE verb that's wrong
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>✏️ Write Correct Form:</strong> Use the infinitive hint to conjugate correctly
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>⏱️ Time Limit:</strong> 5 minutes total
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>🏆 Scoring:</strong> +1 for each correct fix (max 6 points)
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3cd', borderRadius: 2, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ color: '#856404', fontWeight: 600, mb: 1 }}>
              💡 Grammar Focus:
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
              • Check if the subject is singular or plural
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
              • Singular subjects: use "is", "requires", "needs" (with -s/-es)
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
              • Plural subjects: use "are", "require", "need" (no -s)
            </Typography>
          </Box>

          <Button
            onClick={() => setGameStarted(true)}
            variant="contained"
            size="large"
            startIcon={<BuildIcon />}
            sx={{
              fontSize: '1.3rem',
              py: 2,
              px: 6,
              background: 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(231, 76, 60, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #c0392b 30%, #a93226 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(231, 76, 60, 0.5)'
              }
            }}
          >
            Start Correction Crusade
          </Button>
        </Paper>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && submitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          padding: 3
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: 900,
            margin: '0 auto',
            padding: 4,
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 4
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: '#f39c12', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>
              Crusade Complete!
            </Typography>
            <Typography variant="h4" sx={{ color: score >= 5 ? '#27ae60' : score >= 3 ? '#f39c12' : '#e74c3c', fontWeight: 700 }}>
              Score: {score}/6
            </Typography>
          </Box>

          <Stack spacing={3}>
            {results.map((result) => (
              <Paper
                key={result.sentenceId}
                elevation={3}
                sx={{
                  p: 3,
                  borderLeft: `6px solid ${result.isCorrect ? '#27ae60' : '#e74c3c'}`,
                  bgcolor: result.isCorrect ? '#d5f4e6' : '#fadbd8'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: result.isCorrect ? '#27ae60' : '#e74c3c', width: 40, height: 40 }}>
                    {result.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      {result.crusader}
                    </Typography>
                    <Chip
                      label={result.errorType}
                      size="small"
                      sx={{ mt: 0.5, bgcolor: '#e74c3c', color: 'white', fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                    Original Sentence (with error):
                  </Typography>
                  <Typography sx={{ color: '#e74c3c', fontSize: '1.1rem', fontStyle: 'italic' }}>
                    {result.before} <span style={{ textDecoration: 'line-through', fontWeight: 700 }}>{result.wrongWord}</span> {result.after}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                    Your Correction:
                  </Typography>
                  <Typography sx={{ color: '#2c3e50', fontSize: '1.1rem' }}>
                    {result.before} <strong style={{ color: result.isCorrect ? '#27ae60' : '#e74c3c' }}>{result.userAnswer}</strong> {result.after}
                  </Typography>
                </Box>

                {!result.isCorrect && (
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Correct Answer:
                    </Typography>
                    <Typography sx={{ color: '#27ae60', fontWeight: 600, mb: 1 }}>
                      {result.before} {result.correctAnswer} {result.after}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                      💡 {result.concept}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => navigate('/phase4_2/step/2/remedial/c1/results')}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
                fontWeight: 700,
                px: 4
              }}
            >
              View Final Results →
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Game screen
  const progress = ((currentSentenceIndex + 1) / ERROR_SENTENCES.length) * 100

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        padding: 3
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 4,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 4
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>
              🔧 Correction Crusade
            </Typography>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(timeLeft)}
              color={timeLeft < 60 ? 'error' : 'primary'}
              sx={{ fontSize: '1.1rem', fontWeight: 700, px: 2 }}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 2,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)',
                borderRadius: 2
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              Sentence {currentSentenceIndex + 1} of {ERROR_SENTENCES.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
        </Box>

        {/* Current Sentence */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 3,
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#e74c3c', width: 60, height: 60, fontSize: '2rem' }}>
              {currentSentence.avatar}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                {currentSentence.crusader}
              </Typography>
              <Chip
                label={currentSentence.errorType}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Paper sx={{ p: 3, bgcolor: 'white' }}>
            <Box sx={{ mb: 2, p: 2, bgcolor: '#ffe8e6', borderRadius: 1, border: '2px solid #e74c3c' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ErrorIcon sx={{ color: '#e74c3c' }} />
                <Typography variant="body2" sx={{ color: '#c0392b', fontWeight: 700 }}>
                  FIND THE ERROR:
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontStyle: 'italic' }}>
                "{currentSentence.before} <span style={{ textDecoration: 'line-through', color: '#e74c3c', fontWeight: 700 }}>{currentSentence.wrongWord}</span> {currentSentence.after}"
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 2 }}>
              Fix the error - write the correct form:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                "{currentSentence.before}
              </Typography>

              <TextField
                value={answers[currentSentence.id] || ''}
                onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                placeholder={currentSentence.infinitive}
                variant="outlined"
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#d5f4e6',
                    '& fieldset': {
                      borderColor: '#27ae60',
                      borderWidth: 3
                    },
                    '&:hover fieldset': {
                      borderColor: '#229954'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#229954'
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
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handlePrevious}
            disabled={currentSentenceIndex === 0}
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderColor: '#e74c3c',
              color: '#e74c3c',
              '&:hover': {
                borderColor: '#c0392b',
                bgcolor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            ← Previous
          </Button>

          {currentSentenceIndex === ERROR_SENTENCES.length - 1 ? (
            <Button
              onClick={handleSubmitAll}
              variant="contained"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #27ae60 30%, #229954 90%)',
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(45deg, #229954 30%, #1e8449 90%)'
                }
              }}
            >
              Submit All →
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c0392b 30%, #a93226 90%)'
                }
              }}
            >
              Next →
            </Button>
          )}
        </Box>

        {/* Progress indicator for all sentences */}
        <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {ERROR_SENTENCES.map((sentence, idx) => (
            <Chip
              key={sentence.id}
              label={`${idx + 1}`}
              onClick={() => setCurrentSentenceIndex(idx)}
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                bgcolor: idx === currentSentenceIndex ? '#e74c3c' : answers[sentence.id] ? '#27ae60' : '#e0e0e0',
                color: idx === currentSentenceIndex || answers[sentence.id] ? 'white' : '#7f8c8d',
                '&:hover': {
                  bgcolor: idx === currentSentenceIndex ? '#c0392b' : answers[sentence.id] ? '#229954' : '#d0d0d0'
                }
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
