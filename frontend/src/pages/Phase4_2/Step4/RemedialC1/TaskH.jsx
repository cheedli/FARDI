import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip, LinearProgress, Avatar } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import ExploreIcon from '@mui/icons-material/Explore'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Remedial C1 - Task H: Error Correction Exercise
 * Correct 6 sentences with grammar errors
 * Score: +1 for each correct sentence (6 total, scaled to /10)
 */

const ERROR_SENTENCES = [
  {
    id: 1,
    odyssey: 'Odyssey 1',
    character: 'Grammar Guardian',
    avatar: '📝',
    incorrect: 'Hashtags is essential for discoverability.',
    correct: 'Hashtags are essential for discoverability.',
    errorType: 'Subject-Verb Agreement',
    concept: 'Plural subject "hashtags" requires plural verb "are" not singular "is"'
  },
  {
    id: 2,
    odyssey: 'Odyssey 2',
    character: 'Syntax Specialist',
    avatar: '✏️',
    incorrect: 'Caption which engage audiences are most effective.',
    correct: 'Captions that engage audiences are most effective.',
    errorType: 'Pronoun & Number',
    concept: 'Use "that" for restrictive clauses and ensure subject-verb agreement (Captions)'
  },
  {
    id: 3,
    odyssey: 'Odyssey 3',
    character: 'Verb Master',
    avatar: '🎯',
    incorrect: 'Emojis adds emotional resonance to posts.',
    correct: 'Emojis add emotional resonance to posts.',
    errorType: 'Subject-Verb Agreement',
    concept: 'Plural subject "emojis" requires plural verb "add" not singular "adds"'
  },
  {
    id: 4,
    odyssey: 'Odyssey 4',
    character: 'Clarity Coach',
    avatar: '💡',
    incorrect: 'A call-to-action must be clear and it should compel action.',
    correct: 'A call-to-action must be clear and compelling.',
    errorType: 'Wordiness Reduction',
    concept: 'Eliminate redundancy by using adjective "compelling" instead of redundant clause'
  },
  {
    id: 5,
    odyssey: 'Odyssey 5',
    character: 'Adverb Advisor',
    avatar: '⚡',
    incorrect: 'Viral content spreads quick across networks.',
    correct: 'Viral content spreads quickly across networks.',
    errorType: 'Adjective vs. Adverb',
    concept: 'Use adverb "quickly" to modify verb "spreads", not adjective "quick"'
  },
  {
    id: 6,
    odyssey: 'Odyssey 6',
    character: 'Agreement Expert',
    avatar: '✅',
    incorrect: 'Analytics helps optimize content for better engagement.',
    correct: 'Analytics help optimize content for better engagement.',
    errorType: 'Subject-Verb Agreement',
    concept: 'Plural subject "analytics" requires plural verb "help" not singular "helps"'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

export default function Phase4_2Step4RemedialC1TaskH() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 8, context: 'remedial_c1' })
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
    const evaluatedResults = ERROR_SENTENCES.map(sentence => {
      const userAnswer = answers[sentence.id] || ''
      const similarity = calculateSimilarity(userAnswer, sentence.correct)
      const isCorrect = similarity >= 0.85

      return {
        sentenceId: sentence.id,
        odyssey: sentence.odyssey,
        character: sentence.character,
        avatar: sentence.avatar,
        userAnswer: userAnswer || '(no answer)',
        correctAnswer: sentence.correct,
        incorrectSentence: sentence.incorrect,
        errorType: sentence.errorType,
        isCorrect: isCorrect,
        similarity: similarity,
        concept: sentence.concept
      }
    })

    setResults(evaluatedResults)

    // Calculate score
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)

    // Convert to /10 scale
    const finalScore = Math.round((totalScore / 6) * 10)

    // Save score
    sessionStorage.setItem('phase4_2_step4_remedial_c1_taskH_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step4_remedial_c1_taskH_max', '10')

    await logTaskCompletion(finalScore, 10)

    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskH', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'C1',
          task: 'H',
          score: finalScore,
          max_score: maxScore,
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
    navigate('/phase4_2/step/4/remedial/c1/results')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = ERROR_SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 4: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level C1 - Task H: Error Correction Exercise 🗺️
          </Typography>
          <Typography variant="body1">
            Identify and correct grammar errors in 6 sentences!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            speaker="Emna"
            message="Welcome to the Grammar Odyssey: Error Correction! 🗺️ Embark on a journey to find and fix grammar errors. Correct 6 sentences by identifying issues with subject-verb agreement, pronouns, wordiness, and more. Each correct correction = 1 point. Ready to become a grammar detective? 🔍"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)' }}>
          <ExploreIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Grammar Odyssey: Error Correction
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Odysseys • Error Detection & Correction • 5 Minutes • Find & Fix Mistakes!
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.95)', maxWidth: 700, mx: 'auto' }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
                🔍 Grammar Errors You'll Find
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', textAlign: 'left' }}>
                <strong>Error Types:</strong><br />
                • <strong>Subject-Verb Agreement:</strong> Matching singular/plural subjects with correct verbs<br />
                • <strong>Pronoun Usage:</strong> Choosing correct pronouns (that, which, who)<br />
                • <strong>Adjective vs. Adverb:</strong> Using correct form to modify verbs/nouns<br />
                • <strong>Wordiness:</strong> Eliminating redundant phrases<br />
                • <strong>Number Agreement:</strong> Ensuring consistent singular/plural forms
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
    const finalScore = Math.round((score / 6) * 10)
    const perfectScore = score === 6

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 4: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level C1 - Task H: Error Correction - Results 🏆
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
                {finalScore} / 10
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Raw score: {score} / 6 corrections
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> You found and corrected all grammar errors! Error detection champion! 🌟
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#8e44ad' }} fontWeight="bold">
            Error Correction Review
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
                  <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', backgroundColor: '#8e44ad' }}>
                    {result.avatar}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip
                        label={result.odyssey}
                        sx={{
                          backgroundColor: '#8e44ad',
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
                    Incorrect Sentence:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'white', border: '2px solid #e74c3c' }}>
                    <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                      ❌ "{result.incorrectSentence}"
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
                      <strong>Remember:</strong> {result.concept}
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
          value={(currentSentenceIndex + 1) / ERROR_SENTENCES.length * 100}
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
          <strong>Instructions:</strong> Read the incorrect sentence, identify the error, and write the corrected version. Your correction must be at least 85% accurate. Navigate between odysseys using the arrows below.
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
              {currentSentence.character}
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #e74c3c', mb: 3 }}>
          <RecordVoiceOverIcon sx={{ fontSize: 40, color: '#e74c3c', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 'bold', mb: 1 }}>
            INCORRECT SENTENCE (Error Type: {currentSentence.errorType}):
          </Typography>
          <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>
            "{currentSentence.incorrect}"
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white', border: '2px solid #8e44ad' }}>
          <Typography variant="body2" sx={{ color: '#8e44ad', fontWeight: 'bold', mb: 2 }}>
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
                  borderColor: '#8e44ad',
                  borderWidth: 3
                },
                '&:hover fieldset': {
                  borderColor: '#6c3483'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6c3483'
                },
                '& textarea': {
                  color: '#1a252f',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }
              }
            }}
          />
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
          disabled={currentSentenceIndex === ERROR_SENTENCES.length - 1}
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
          {ERROR_SENTENCES.map((sentence, index) => (
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
              ? 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)'
              : '#bdc3c7',
            '&:hover': {
              background: allAnswered
                ? 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)'
                : '#95a5a6'
            }
          }}
        >
          {allAnswered ? 'Complete Odyssey! 🗺️' : `Correct All First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
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
