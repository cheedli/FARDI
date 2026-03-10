import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Chip, LinearProgress, Avatar } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GavelIcon from '@mui/icons-material/Gavel'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial C1 - Task G: Debate Duel Advanced
 * Debate grammar game - 6 debate lines using subjunctives/modals with social media terms
 * Score: +1 for each correct subjunctive/modal (6 total)
 */

const DEBATE_LINES = [
  {
    id: 1,
    debater: 'Content Ethics Advocate',
    avatar: '⚖️',
    before: 'It is essential that hashtag use',
    infinitive: 'to be',
    after: 'balanced.',
    answer: 'be',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood after "it is essential that" - use base form'
  },
  {
    id: 2,
    debater: 'Engagement Truth Defender',
    avatar: '🛡️',
    before: 'Caption strategy',
    infinitive: 'to mislead',
    after: 'if not authentic.',
    answer: 'might mislead',
    grammarType: 'Modal',
    concept: 'Modal "might" for possibility'
  },
  {
    id: 3,
    debater: 'Privacy Guardian',
    avatar: '🔒',
    before: 'Viral content',
    infinitive: 'to respect',
    after: 'user privacy.',
    answer: 'should respect',
    grammarType: 'Modal',
    concept: 'Modal "should" for recommendation/obligation'
  },
  {
    id: 4,
    debater: 'Innovation Champion',
    avatar: '💡',
    before: 'Original emoji use',
    infinitive: 'to prize',
    after: 'in creative posts.',
    answer: 'be prized',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood with passive voice - use base form "be"'
  },
  {
    id: 5,
    debater: 'Authenticity Voice',
    avatar: '🎭',
    before: 'Story design',
    infinitive: 'to demand',
    after: 'authentic goals.',
    answer: 'demand',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood - use base form'
  },
  {
    id: 6,
    debater: 'Principle Keeper',
    avatar: '👑',
    before: 'Ethical tagging',
    infinitive: 'to remain',
    after: 'priority despite trends.',
    answer: 'remain',
    grammarType: 'Subjunctive',
    concept: 'Subjunctive mood - use base form'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 lines

export default function Phase4_2Step3RemedialC1TaskG() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 7, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentLine = DEBATE_LINES[currentLineIndex]

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
    if (currentLineIndex < DEBATE_LINES.length - 1) {
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
    const evaluatedResults = DEBATE_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const correctAnswer = line.answer.toLowerCase()

      // Check if answer is correct - must have an answer and match exactly
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer

      return {
        lineId: line.id,
        debater: line.debater,
        before: line.before,
        after: line.after,
        userAnswer: answers[line.id] || '(No answer provided)',
        correctAnswer: line.answer,
        isCorrect: isCorrect,
        grammarType: line.grammarType,
        concept: line.concept
      }
    })

    setResults(evaluatedResults)

    // Calculate score
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)

    // Save score
    sessionStorage.setItem('phase4_2_step3_remedial_c1_taskG_score', totalScore)

    // Log completion
    await logTaskCompletion(totalScore)

    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'G',
          score: finalScore,
          max_score: 6,
          completed: true
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
          background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
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
            <GavelIcon sx={{ fontSize: 80, color: '#8e44ad', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>
              ⚖️ Debate Duel Advanced
            </Typography>
            <Typography variant="h6" sx={{ color: '#5a6c7d', mb: 3 }}>
              Level C1 - Task G: Subjunctives & Modals
            </Typography>
          </Box>

          <CharacterMessage character="Content Ethics Advocate" message="Welcome to the Debate Duel! Master advanced grammar by using subjunctives and modals in 6 powerful social media debate statements." />

          <Box sx={{ mt: 4, mb: 4, p: 3, bgcolor: '#e8eaf6', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#3f51b5', mb: 2 }}>
              📋 Debate Rules
            </Typography>
            <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>✏️ Complete 6 Debate Lines:</strong> Use correct subjunctives and modals
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>📚 Grammar Focus:</strong> Subjunctive mood and modal verbs (might, should, must)
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>⏱️ Time Limit:</strong> 5 minutes total
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>🏆 Scoring:</strong> +1 for each correct form (max 6 points)
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3cd', borderRadius: 2, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ color: '#856404', fontWeight: 600, mb: 1 }}>
              💡 Grammar Tips:
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
              • <strong>Subjunctive:</strong> Use base form after "it is essential that" (e.g., "he be", not "he is")
            </Typography>
            <Typography variant="body2" sx={{ color: '#856404' }}>
              • <strong>Modals:</strong> might/should/must + base verb (e.g., "might mislead", "should respect")
            </Typography>
          </Box>

          <Button
            onClick={() => setGameStarted(true)}
            variant="contained"
            size="large"
            startIcon={<GavelIcon />}
            sx={{
              fontSize: '1.3rem',
              py: 2,
              px: 6,
              background: 'linear-gradient(45deg, #8e44ad 30%, #3498db 90%)',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(142, 68, 173, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7d3c98 30%, #2980b9 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(142, 68, 173, 0.5)'
              }
            }}
          >
            Start Debate Duel
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
          background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
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
              Debate Complete!
            </Typography>
            <Typography variant="h4" sx={{ color: score >= 5 ? '#27ae60' : score >= 3 ? '#f39c12' : '#e74c3c', fontWeight: 700 }}>
              Score: {score}/6
            </Typography>
          </Box>

          <Stack spacing={3}>
            {results.map((result) => (
              <Paper
                key={result.lineId}
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
                      {result.debater}
                    </Typography>
                    <Chip
                      label={result.grammarType}
                      size="small"
                      sx={{ mt: 0.5, bgcolor: '#8e44ad', color: 'white', fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                    Debate Statement:
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
                    <Typography sx={{ color: '#27ae60', fontWeight: 600 }}>
                      {result.before} {result.correctAnswer} {result.after}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7f8c8d', mt: 1, display: 'block' }}>
                      {result.concept}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => navigate('/phase4_2/step/3/remedial/c1/taskH')}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #8e44ad 30%, #3498db 90%)',
                fontWeight: 700,
                px: 4
              }}
            >
              Continue to Task H →
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Game screen
  const progress = ((currentLineIndex + 1) / DEBATE_LINES.length) * 100

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
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
              ⚖️ Debate Duel Advanced
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
                background: 'linear-gradient(90deg, #8e44ad 0%, #3498db 100%)',
                borderRadius: 2
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              Debate Line {currentLineIndex + 1} of {DEBATE_LINES.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
        </Box>

        {/* Current Line */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 3,
            background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#8e44ad', width: 60, height: 60, fontSize: '2rem' }}>
              {currentLine.avatar}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                {currentLine.debater}
              </Typography>
              <Chip
                label={currentLine.grammarType}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Paper sx={{ p: 3, bgcolor: 'white' }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 2 }}>
              Complete the debate statement:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
                {currentLine.after}"
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block' }}>
              Grammar: {currentLine.concept}
            </Typography>
          </Paper>
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handlePrevious}
            disabled={currentLineIndex === 0}
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderColor: '#8e44ad',
              color: '#8e44ad',
              '&:hover': {
                borderColor: '#6c3483',
                bgcolor: 'rgba(142, 68, 173, 0.1)'
              }
            }}
          >
            ← Previous
          </Button>

          {currentLineIndex === DEBATE_LINES.length - 1 ? (
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
                background: 'linear-gradient(45deg, #8e44ad 30%, #3498db 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7d3c98 30%, #2980b9 90%)'
                }
              }}
            >
              Next →
            </Button>
          )}
        </Box>

        {/* Progress indicator for all lines */}
        <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {DEBATE_LINES.map((line, idx) => (
            <Chip
              key={line.id}
              label={`${idx + 1}`}
              onClick={() => setCurrentLineIndex(idx)}
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                bgcolor: idx === currentLineIndex ? '#8e44ad' : answers[line.id] ? '#27ae60' : '#e0e0e0',
                color: idx === currentLineIndex || answers[line.id] ? 'white' : '#7f8c8d',
                '&:hover': {
                  bgcolor: idx === currentLineIndex ? '#7d3c98' : answers[line.id] ? '#229954' : '#d0d0d0'
                }
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
