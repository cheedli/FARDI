import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip, LinearProgress, Avatar } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BuildIcon from '@mui/icons-material/Build'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 5 - Remedial A2 - Task C: Sentence Builder
 * Grammar exercise - 6 simple social media sentences
 * Gamified sentence correction
 * Score: +1 for each correct sentence (6 total)
 */

const GRAMMAR_SENTENCES = [
  {
    id: 1,
    sentence: 'Sentence 1',
    character: 'Grammar Builder',
    avatar: '🏗️',
    faulty: 'Festival are fun.',
    correct: 'Festival is fun.',
    errorType: 'Subject-Verb Agreement',
    hint: 'Use "is" for singular subject "Festival"'
  },
  {
    id: 2,
    sentence: 'Sentence 2',
    character: 'Preposition Pro',
    avatar: '📍',
    faulty: 'Come March 8!',
    correct: 'Come on March 8!',
    errorType: 'Missing Preposition',
    hint: 'Add preposition "on" before dates'
  },
  {
    id: 3,
    sentence: 'Sentence 3',
    character: 'Article Expert',
    avatar: '📝',
    faulty: 'Use hashtag.',
    correct: 'Use a hashtag.',
    errorType: 'Missing Article',
    hint: 'Add article "a" before singular countable nouns'
  },
  {
    id: 4,
    sentence: 'Sentence 4',
    character: 'Article Master',
    avatar: '✍️',
    faulty: 'Add emogi.',
    correct: 'Add an emoji.',
    errorType: 'Missing Article & Spelling',
    hint: 'Add article "an" before vowel sounds and fix spelling'
  },
  {
    id: 5,
    sentence: 'Sentence 5',
    character: 'Article Ace',
    avatar: '📌',
    faulty: 'Tag frend.',
    correct: 'Tag a friend.',
    errorType: 'Missing Article & Spelling',
    hint: 'Add article "a" and fix spelling of "friend"'
  },
  {
    id: 6,
    sentence: 'Sentence 6',
    character: 'Article Champion',
    avatar: '🎯',
    faulty: 'Post photo.',
    correct: 'Post a photo.',
    errorType: 'Missing Article',
    hint: 'Add article "a" before singular countable nouns'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

export default function Phase4_2Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_a2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = GRAMMAR_SENTENCES[currentSentenceIndex]

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
    if (currentSentenceIndex < GRAMMAR_SENTENCES.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1)
    }
  }

  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().trim().replace(/[.,!?;]/g, '')
    const s2 = str2.toLowerCase().trim().replace(/[.,!?;]/g, '')

    if (s1 === s2) return 1.0

    const words1 = s1.split(/\s+/)
    const words2 = s2.split(/\s+/)

    let matchCount = 0
    const maxLength = Math.max(words1.length, words2.length)

    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) {
        matchCount++
      }
    }

    return matchCount / maxLength
  }

  const handleSubmitAll = async () => {
    setSubmitted(true)

    // Evaluate each answer
    const evaluatedResults = GRAMMAR_SENTENCES.map(sentence => {
      const userAnswer = answers[sentence.id] || ''
      const similarity = calculateSimilarity(userAnswer, sentence.correct)
      const isCorrect = similarity >= 0.85

      return {
        sentenceId: sentence.id,
        sentence: sentence.sentence,
        character: sentence.character,
        avatar: sentence.avatar,
        userAnswer: userAnswer || '(no answer)',
        correctAnswer: sentence.correct,
        faultySentence: sentence.faulty,
        errorType: sentence.errorType,
        isCorrect: isCorrect,
        similarity: similarity,
        hint: sentence.hint
      }
    })

    setResults(evaluatedResults)

    // Calculate score
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)

    // Save score
    sessionStorage.setItem('phase4_2_step5_remedial_a2_taskC_score', totalScore)

    await logTaskCompletion(totalScore)

    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 5,
          level: 'A2',
          task: 'C',
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

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleContinue = () => {
    navigate('/app/phase4_2/step/5/remedial/a2/results')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = GRAMMAR_SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 5: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level A2 - Task C: Sentence Builder 🏗️
          </Typography>
          <Typography variant="body1">
            Correct 6 simple grammar mistakes in social media sentences!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            speaker="Ms. Mabrouki"
            message="Welcome to Sentence Builder! 🏗️ Fix grammar mistakes in 6 simple social media sentences. Focus on subject-verb agreement, articles (a, an, the), and prepositions. Each correct sentence = 1 point. Ready to build perfect sentences? Let's go! 🚀"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <BuildIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Sentence Builder Challenge
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Sentences • Simple Grammar • 5 Minutes • Fix the Mistakes!
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.95)', maxWidth: 700, mx: 'auto' }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
                🔧 Grammar Focus
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', textAlign: 'left' }}>
                <strong>Errors You'll Fix:</strong><br />
                • <strong>Subject-Verb Agreement:</strong> Matching singular/plural subjects with correct verbs<br />
                • <strong>Articles:</strong> Using a, an, the correctly<br />
                • <strong>Prepositions:</strong> Using on, at, in for time and place<br />
                • <strong>Spelling:</strong> Fixing common misspellings
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
            START BUILDING! 🎮
          </Button>
        </Paper>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 6

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 5: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level A2 - Task C: Sentence Builder - Results 🏆
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {perfectScore ? 'Building Mastered! 🎉' : 'Building Complete! 🎊'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#667eea' }}>
                {score} / 6
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Sentences Corrected
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You built all sentences perfectly! Grammar champion! 🌟
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#667eea' }} fontWeight="bold">
            Sentence Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {results.map((result) => (
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
                  <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', backgroundColor: '#667eea' }}>
                    {result.avatar}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip
                        label={result.sentence}
                        sx={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={result.errorType}
                        sx={{
                          backgroundColor: '#e74c3c',
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
                    Faulty Sentence:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white', border: '2px solid #e74c3c' }}>
                    <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                      ❌ "{result.faultySentence}"
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                    Correct Sentence:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white', border: '2px solid #27ae60' }}>
                    <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                      ✅ "{result.correctAnswer}"
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                    Your Answer:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="h6" sx={{ color: result.isCorrect ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                      "{result.userAnswer}"
                    </Typography>
                    {!result.isCorrect && (
                      <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block', mt: 1 }}>
                        Similarity: {(result.similarity * 100).toFixed(0)}% (needed 85%+)
                      </Typography>
                    )}
                  </Paper>
                </Box>

                {!result.isCorrect && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                      <strong>Hint:</strong> {result.hint}
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
            View Final Results →
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  const progress = ((currentSentenceIndex + 1) / GRAMMAR_SENTENCES.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with Timer */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {currentSentence.sentence} / 6
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
          value={progress}
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
          <strong>Instructions:</strong> Read the faulty sentence and write the corrected version. Your correction must be at least 85% accurate. Navigate between sentences using the arrows below.
        </Typography>
      </Alert>

      {/* Current Sentence */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #667eea' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '2.5rem', backgroundColor: '#667eea' }}>
            {currentSentence.avatar}
          </Avatar>
          <Box>
            <Chip
              label={currentSentence.sentence}
              sx={{
                backgroundColor: '#667eea',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                py: 2.5,
                mb: 1
              }}
            />
            <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              {currentSentence.character}
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #e74c3c', mb: 3 }}>
          <BuildIcon sx={{ fontSize: 40, color: '#e74c3c', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 'bold', mb: 1 }}>
            FAULTY SENTENCE (Error Type: {currentSentence.errorType}):
          </Typography>
          <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
            "{currentSentence.faulty}"
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #667eea' }}>
          <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 'bold', mb: 2 }}>
            YOUR CORRECTED SENTENCE:
          </Typography>
          <TextField
            value={answers[currentSentence.id] || ''}
            onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
            placeholder="Type the corrected sentence here..."
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f3e5f5',
                '& fieldset': {
                  borderColor: '#667eea',
                  borderWidth: 3
                },
                '&:hover fieldset': {
                  borderColor: '#764ba2'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#764ba2'
                },
                '& textarea': {
                  color: '#1a252f',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }
              }
            }}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#7f8c8d', fontStyle: 'italic' }}>
            💡 Hint: {currentSentence.hint}
          </Typography>
        </Paper>
      </Paper>

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handlePrevious}
          disabled={currentSentenceIndex === 0}
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            borderWidth: 2,
            '&:hover': { borderColor: '#764ba2', backgroundColor: '#f3e5f5', borderWidth: 2 }
          }}
        >
          ← Previous Sentence
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleNext}
          disabled={currentSentenceIndex === GRAMMAR_SENTENCES.length - 1}
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            borderWidth: 2,
            '&:hover': { borderColor: '#764ba2', backgroundColor: '#f3e5f5', borderWidth: 2 }
          }}
        >
          Next Sentence →
        </Button>
      </Stack>

      {/* Progress Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Sentence Progress:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {GRAMMAR_SENTENCES.map((sentence, index) => (
            <Chip
              key={sentence.id}
              label={`S${index + 1}`}
              avatar={<Avatar sx={{ fontSize: '1.2rem' }}>{sentence.avatar}</Avatar>}
              onClick={() => setCurrentSentenceIndex(index)}
              sx={{
                backgroundColor: answers[sentence.id]?.trim()
                  ? index === currentSentenceIndex
                    ? '#27ae60'
                    : '#667eea'
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
          Corrected: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6
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
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#bdc3c7',
            '&:hover': {
              background: allAnswered
                ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                : '#95a5a6'
            }
          }}
        >
          {allAnswered ? 'Complete Building! 🏗️' : `Fix All First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
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
