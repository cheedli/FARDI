import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Alert, Chip, TextField } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task D: Spell & Explain
 * Spelling game - spell 6 terms from scrambled letters, then explain
 * Style inspired by Sushi Spell (British Council)
 * Score: Correct spelling (1 point) + explanation (1 point) = 2 points per term
 * Total: 12 points maximum (converted to /10 scale)
 */

const TERMS = [
  {
    id: 1,
    word: 'hashtag',
    clue: 'Symbol for categorizing posts',
    expectedConcepts: ['symbol', 'categorize', 'search', 'discovery']
  },
  {
    id: 2,
    word: 'caption',
    clue: 'Text describing an image',
    expectedConcepts: ['text', 'describe', 'explain', 'context']
  },
  {
    id: 3,
    word: 'viral',
    clue: 'Content spreading rapidly online',
    expectedConcepts: ['spread', 'fast', 'popular', 'shares']
  },
  {
    id: 4,
    word: 'engagement',
    clue: 'User interaction with content',
    expectedConcepts: ['interaction', 'likes', 'comments', 'shares']
  },
  {
    id: 5,
    word: 'emoji',
    clue: 'Small icon expressing emotion',
    expectedConcepts: ['icon', 'emotion', 'feeling', 'visual']
  },
  {
    id: 6,
    word: 'story',
    clue: '24-hour temporary post',
    expectedConcepts: ['24-hour', 'temporary', 'disappear', 'short']
  }
]

const TIME_PER_TERM = 45 // 45 seconds per term

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TERM)
  const [scrambledLetters, setScrambledLetters] = useState([])
  const [spelledWord, setSpelledWord] = useState([])
  const [spellingComplete, setSpellingComplete] = useState(false)
  const [userExplanation, setUserExplanation] = useState('')
  const [results, setResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [animationOffset, setAnimationOffset] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)

  const currentTerm = TERMS[currentTermIndex]

  // Shuffle letters when term changes
  useEffect(() => {
    if (gameStarted && currentTerm && !spellingComplete) {
      const letters = currentTerm.word.split('').map((letter, index) => ({
        letter,
        id: `${letter}-${index}`,
        originalIndex: index
      }))
      setScrambledLetters([...letters].sort(() => Math.random() - 0.5))
      setSpelledWord([])
    }
  }, [currentTermIndex, gameStarted])

  // Animation for moving letter chain (like Sushi Spell)
  useEffect(() => {
    if (gameStarted && !spellingComplete && !gameFinished) {
      const interval = setInterval(() => {
        setAnimationOffset(prev => (prev + 1) % 100)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [gameStarted, spellingComplete, gameFinished])

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || spellingComplete) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up! Mark as incorrect and move to next
      handleTimeUp()
    }
  }, [timeLeft, gameStarted, gameFinished, spellingComplete])

  const handleTimeUp = () => {
    results.push({
      termId: currentTerm.id,
      word: currentTerm.word,
      spellingScore: 0,
      explanationScore: 0,
      userSpelling: spelledWord.map(l => l.letter).join(''),
      userExplanation: '',
      feedback: 'Time ran out!'
    })

    moveToNextTerm()
  }

  const handleLetterClick = (letterObj) => {
    // Check if this letter is still available
    const isAvailable = scrambledLetters.some(l => l.id === letterObj.id)
    if (!isAvailable) return

    // Add letter to spelled word
    setSpelledWord([...spelledWord, letterObj])
    // Remove from available letters
    setScrambledLetters(scrambledLetters.filter(l => l.id !== letterObj.id))
  }

  const handleUndo = () => {
    if (spelledWord.length > 0) {
      const lastLetter = spelledWord[spelledWord.length - 1]
      setSpelledWord(spelledWord.slice(0, -1))
      setScrambledLetters([...scrambledLetters, lastLetter].sort(() => Math.random() - 0.5))
    }
  }

  const handleCheckSpelling = () => {
    const userWord = spelledWord.map(l => l.letter).join('')
    const isCorrect = userWord === currentTerm.word

    if (isCorrect) {
      // Add +1 point for correct spelling
      setScore(score + 1)
      setSpellingComplete(true)
    } else {
      // Show error and allow retry
      alert(`Incorrect spelling! You spelled: "${userWord}". Try again!`)
      // Reset
      setScrambledLetters([...spelledWord, ...scrambledLetters].sort(() => Math.random() - 0.5))
      setSpelledWord([])
    }
  }

  const handleSubmitExplanation = async () => {
    setEvaluating(true)

    const userWord = spelledWord.map(l => l.letter).join('')
    const spellingScore = userWord === currentTerm.word ? 1 : 0

    // Evaluate explanation with AI
    try {
      const response = await fetch('/api/phase4/remedial/evaluate-spell-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'B2',
          term: currentTerm.word,
          explanation: userExplanation,
          expectedConcepts: currentTerm.expectedConcepts
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add +1 if explanation is correct (data.score = 1), else 0
        if (data.score === 1) {
          setScore(score + 1)
        }

        const resultData = {
          termId: currentTerm.id,
          word: currentTerm.word,
          spellingScore: spellingScore,
          explanationScore: data.score,
          userSpelling: userWord,
          userExplanation: userExplanation,
          feedback: data.feedback
        }

        results.push(resultData)
        setCurrentFeedback(resultData)
        setShowFeedback(true)
      } else {
        // Fallback
        const explanationScore = userExplanation.trim().length >= 15 ? 1 : 0
        if (explanationScore === 1) {
          setScore(score + 1)
        }

        const resultData = {
          termId: currentTerm.id,
          word: currentTerm.word,
          spellingScore: spellingScore,
          explanationScore: explanationScore,
          userSpelling: userWord,
          userExplanation: userExplanation,
          feedback: explanationScore ? 'Good explanation!' : 'Needs more detail about the concept.'
        }

        results.push(resultData)
        setCurrentFeedback(resultData)
        setShowFeedback(true)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const explanationScore = userExplanation.trim().length >= 15 ? 1 : 0
      if (explanationScore === 1) {
        setScore(score + 1)
      }

      const resultData = {
        termId: currentTerm.id,
        word: currentTerm.word,
        spellingScore: spellingScore,
        explanationScore: explanationScore,
        userSpelling: userWord,
        userExplanation: userExplanation,
        feedback: explanationScore ? 'Good explanation!' : 'Needs more detail about the concept.'
      }

      results.push(resultData)
      setCurrentFeedback(resultData)
      setShowFeedback(true)
    }

    setEvaluating(false)
  }

  const handleSkipExplanation = () => {
    // Skip without adding points for explanation
    const userWord = spelledWord.map(l => l.letter).join('')
    const spellingScore = userWord === currentTerm.word ? 1 : 0

    results.push({
      termId: currentTerm.id,
      word: currentTerm.word,
      spellingScore: spellingScore,
      explanationScore: 0,
      userSpelling: userWord,
      userExplanation: '',
      feedback: 'Skipped explanation'
    })

    moveToNextTerm()
  }

  const handleNextTerm = () => {
    setShowFeedback(false)
    setCurrentFeedback(null)
    moveToNextTerm()
  }

  const moveToNextTerm = () => {
    if (currentTermIndex < TERMS.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1)
      setTimeLeft(TIME_PER_TERM)
      setSpellingComplete(false)
      setUserExplanation('')
    } else {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameFinished(true)

    // Calculate total score (out of 12, convert to 10)
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    const finalScore = Math.round((totalScore / 12) * 10)
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskD_score', finalScore)

    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          level: 'B2',
          task: 'D',
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
    navigate('/phase4_2/step1/remedial/b2/taskE')
  }

  const formatTime = (seconds) => {
    return `0:${seconds.toString().padStart(2, '0')}`
  }

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task D: Spell & Explain
          </Typography>
          <Typography variant="body1">
            Spell words from scrambled letters, then explain them!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <CharacterMessage
            character="MS. MABROUKI"
            message="Welcome to Spell & Explain! For each term, you'll see scrambled letters. Click them in the correct order to spell the word (like Sushi Spell!), then write an explanation. Each term has 2 points: 1 for correct spelling + 1 for good explanation. Total: 12 points! Ready? Let's go!"
          />
        </Paper>

        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <SpellcheckIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }} fontWeight="bold">
            Spell & Explain Challenge
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
            6 Terms • 45 Seconds Each • Spell + Explain
          </Typography>

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
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    const finalScore = Math.round((totalScore / 12) * 10)
    const perfectScore = finalScore === 10

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Phase 4.2 - Step 1: Remedial Activities
          </Typography>
          <Typography variant="h5" gutterBottom>
            Level B2 - Task D: Spell & Explain - Results
          </Typography>
        </Paper>

        {/* Results Summary */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {perfectScore ? 'Perfect Score!' : 'Challenge Complete!'}
            </Typography>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#9b59b6' }}>
                {finalScore} / 10
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
            {perfectScore && (
              <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
                <strong>Amazing!</strong> Perfect spelling AND explanations! You're a vocabulary master!
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9b59b6' }} fontWeight="bold">
            Review
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {results.map((result, index) => {
              const spellingCorrect = result.spellingScore === 1
              const explanationCorrect = result.explanationScore === 1
              const totalCorrect = spellingCorrect && explanationCorrect

              return (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: '4px solid',
                    borderColor: totalCorrect ? '#27ae60' : explanationCorrect || spellingCorrect ? '#f39c12' : '#e74c3c',
                    backgroundColor: totalCorrect ? '#d5f4e6' : explanationCorrect || spellingCorrect ? '#fff3cd' : '#fadbd8'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                      Term {index + 1}: {result.word}
                    </Typography>
                    {totalCorrect ? (
                      <CheckCircleIcon sx={{ color: '#27ae60' }} />
                    ) : (
                      <CancelIcon sx={{ color: explanationCorrect || spellingCorrect ? '#f39c12' : '#e74c3c' }} />
                    )}
                    <Chip
                      label={`${result.spellingScore + result.explanationScore}/2 pts`}
                      sx={{
                        backgroundColor: totalCorrect ? '#27ae60' : '#f39c12',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Stack>

                  {/* Spelling Result */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                      Spelling: {spellingCorrect ? 'Correct' : 'Incorrect'}
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        You spelled: <strong>{result.userSpelling || '(no answer)'}</strong>
                      </Typography>
                      {!spellingCorrect && (
                        <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 500, mt: 1 }}>
                          Correct spelling: <strong>{result.word}</strong>
                        </Typography>
                      )}
                    </Paper>
                  </Box>

                  {/* Explanation Result */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 600, mb: 1 }}>
                      Explanation: {explanationCorrect ? 'Good' : 'Needs improvement'}
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'white', mb: 2 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#2c3e50', fontWeight: 500 }}>
                        "{result.userExplanation || '(no explanation provided)'}"
                      </Typography>
                    </Paper>
                    <Alert
                      severity={explanationCorrect ? 'success' : 'warning'}
                      sx={{
                        backgroundColor: explanationCorrect ? '#d4edda' : '#fff3cd'
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#1a252f', fontWeight: 500 }}>
                        <strong>Feedback:</strong> {result.feedback}
                      </Typography>
                    </Alert>
                  </Box>
                </Paper>
              )
            })}
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
            Continue to Task E
          </Button>
        </Box>
      </Box>
    )
  }

  // Game in progress
  const canCheckSpelling = spelledWord.length === currentTerm.word.length
  const canSubmitExplanation = userExplanation.trim().length >= 10

  // Create color palette for letters
  const getLetterColor = (index) => {
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#e91e63', '#00bcd4']
    return colors[index % colors.length]
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #2d5016 0%, #4a7c2c 50%, #2d5016 100%)',
      p: 0,
      m: 0
    }}>
      {/* Header with Timer and Score - Sushi Spell Style */}
      <Paper elevation={0} sx={{
        p: 2,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 0,
        borderBottom: '4px solid #8b4513'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 'bold', fontFamily: 'Arial Black' }}>
              Time: {formatTime(timeLeft)}
            </Typography>
            <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold', fontFamily: 'Arial Black' }}>
              Score: {score}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#e67e22', fontWeight: 'bold', mb: 1 }}>
              Progress:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {TERMS.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: index < currentTermIndex ? '#9b59b6' : index === currentTermIndex ? '#e67e22' : '#bdc3c7',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {index + 1}
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={3} sx={{
            py: 1.5,
            px: 3,
            backgroundColor: '#e67e22',
            borderRadius: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -15,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '20px solid transparent',
              borderBottom: '20px solid transparent',
              borderLeft: '15px solid #e67e22'
            }
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Arial Black' }}>
              Word: {currentTermIndex + 1}
            </Typography>
          </Paper>
        </Stack>
      </Paper>

      {!spellingComplete ? (
        <Box>
          {/* Clue Display - Large and Centered */}
          <Paper elevation={6} sx={{
            mx: 3,
            my: 3,
            p: 4,
            backgroundColor: '#fffacd',
            border: '4px solid #f0e68c',
            borderRadius: 3,
            minHeight: 120
          }}>
            <Typography variant="h4" sx={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.5,
              fontFamily: 'Arial'
            }}>
              {currentTerm.clue}
            </Typography>
          </Paper>

          {/* Scrambled Letters Chain - Moving Animation like Sushi Spell */}
          <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#34495e',
            py: 3,
            my: 3,
            borderTop: '8px solid #2c3e50',
            borderBottom: '8px solid #2c3e50'
          }}>
            <Box sx={{
              display: 'flex',
              gap: 2,
              px: 2,
              transform: `translateX(-${animationOffset}px)`,
              transition: 'transform 0.05s linear'
            }}>
              {/* Duplicate letters for seamless loop */}
              {[...scrambledLetters, ...scrambledLetters, ...scrambledLetters].map((letterObj, index) => {
                const isAvailable = scrambledLetters.some(l => l.id === letterObj.id)
                return (
                  <Paper
                    key={`${letterObj.id}-${index}`}
                    elevation={6}
                    onClick={() => handleLetterClick(letterObj)}
                    sx={{
                      minWidth: 80,
                      height: 80,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: isAvailable ? getLetterColor(index) : '#95a5a6',
                      color: 'white',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      borderRadius: '50%',
                      border: '4px solid white',
                      flexShrink: 0,
                      transition: 'transform 0.2s',
                      opacity: isAvailable ? 1 : 0.5,
                      '&:hover': {
                        transform: isAvailable ? 'scale(1.2)' : 'scale(1)',
                        zIndex: 10
                      },
                      '&:active': {
                        transform: isAvailable ? 'scale(0.95)' : 'scale(1)'
                      }
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: 'Arial Black' }}>
                      {letterObj.letter.toUpperCase()}
                    </Typography>
                  </Paper>
                )
              })}
            </Box>
          </Box>

          {/* Answer Area - Bottom of screen like Sushi Spell */}
          <Box sx={{
            backgroundColor: '#d4a574',
            borderTop: '8px solid #8b6f47',
            p: 3,
            minHeight: 180
          }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              {/* Sound/Help Icon */}
              <Paper elevation={4} sx={{
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f39c12',
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#e67e22' }
              }}>
                <Typography variant="h4">🔊</Typography>
              </Paper>

              {/* Answer Slots */}
              <Box sx={{
                flex: 1,
                backgroundColor: '#e8d5b7',
                borderRadius: 3,
                border: '4px solid #c9a96e',
                p: 2,
                minHeight: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)'
              }}>
                {spelledWord.length === 0 ? (
                  <Typography variant="h5" sx={{ color: '#8b7355', fontStyle: 'italic' }}>
                    Click letters above to spell the word...
                  </Typography>
                ) : (
                  spelledWord.map((letterObj, index) => (
                    <Paper
                      key={index}
                      elevation={4}
                      sx={{
                        width: 70,
                        height: 70,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        border: '3px solid #9b59b6',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="h3" fontWeight="bold" sx={{ color: '#2c3e50', fontFamily: 'Arial Black' }}>
                        {letterObj.letter.toUpperCase()}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Box>

              {/* Control Buttons */}
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCheckSpelling}
                  disabled={!canCheckSpelling}
                  sx={{
                    width: 120,
                    py: 1.5,
                    backgroundColor: canCheckSpelling ? '#27ae60' : '#95a5a6',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: canCheckSpelling ? '#229954' : '#7f8c8d'
                    }
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleUndo}
                  disabled={spelledWord.length === 0}
                  sx={{
                    width: 120,
                    py: 1.5,
                    backgroundColor: '#e67e22',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '&:hover': { backgroundColor: '#d35400' }
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      ) : showFeedback ? (
        <Box sx={{ p: 3 }}>
          {/* Feedback Display */}
          <Paper elevation={6} sx={{
            mb: 3,
            p: 4,
            backgroundColor: currentFeedback?.explanationScore === 1 ? '#d5f4e6' : '#fff3cd',
            border: `4px solid ${currentFeedback?.explanationScore === 1 ? '#27ae60' : '#f39c12'}`
          }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
              {currentFeedback?.explanationScore === 1 ? (
                <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 60, color: '#f39c12' }} />
              )}
              <Typography variant="h4" sx={{ color: '#1a252f', fontWeight: 'bold' }}>
                {currentFeedback?.explanationScore === 1 ? 'Correct! +1 Point' : 'Incorrect! +0 Points'}
              </Typography>
            </Stack>

            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
                Term: {currentTerm.word.toUpperCase()}
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', mb: 2 }}>
                <strong>Clue:</strong> {currentTerm.clue}
              </Typography>
              <Typography variant="body1" sx={{ color: '#34495e', fontStyle: 'italic' }}>
                <strong>Your explanation:</strong> "{currentFeedback?.userExplanation}"
              </Typography>
            </Paper>

            <Alert
              severity={currentFeedback?.explanationScore === 1 ? 'success' : 'warning'}
              sx={{
                backgroundColor: currentFeedback?.explanationScore === 1 ? '#d4edda' : '#fff3cd',
                fontSize: '1.1rem'
              }}
            >
              <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 600 }}>
                Feedback: {currentFeedback?.feedback}
              </Typography>
            </Alert>
          </Paper>

          {/* Next Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleNextTerm}
              sx={{
                py: 3,
                px: 8,
                fontSize: '1.4rem',
                fontWeight: 'bold',
                backgroundColor: '#3498db',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2980b9'
                }
              }}
            >
              {currentTermIndex < TERMS.length - 1 ? 'Next Term' : 'See Results'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          {/* Success Message */}
          <Alert severity="success" sx={{ mb: 3, backgroundColor: '#d5f4e6', border: '3px solid #27ae60' }}>
            <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 'bold' }}>
              Correct spelling! (+1 Point) Now write your explanation.
            </Typography>
          </Alert>

          {/* Show the term clue again */}
          <Paper elevation={6} sx={{
            mb: 3,
            p: 3,
            backgroundColor: '#fffacd',
            border: '4px solid #f0e68c',
            borderRadius: 3
          }}>
            <Typography variant="h5" sx={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Arial'
            }}>
              Term: <span style={{ color: '#9b59b6' }}>{currentTerm.word.toUpperCase()}</span>
            </Typography>
            <Typography variant="h6" sx={{
              color: '#34495e',
              textAlign: 'center',
              mt: 1,
              fontStyle: 'italic'
            }}>
              Clue: {currentTerm.clue}
            </Typography>
          </Paper>

          {/* Explanation Input */}
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #9b59b6' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              Write your explanation:
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={5}
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
              placeholder="Explain what this term means in social media context..."
              variant="outlined"
              disabled={evaluating}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
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
                  '& textarea': {
                    color: '#1a252f',
                    fontWeight: 500,
                    fontSize: '1.1rem'
                  },
                  '& textarea::placeholder': {
                    color: '#7f8c8d',
                    opacity: 0.8
                  }
                }
              }}
            />

            <Typography variant="body1" sx={{ display: 'block', mt: 2, color: '#2c3e50', fontWeight: 600 }}>
              {userExplanation.length} characters • Minimum 10 characters (aim for 30+)
            </Typography>
          </Paper>

          {/* Submit and Skip Buttons */}
          <Stack direction="row" spacing={3} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              onClick={handleSkipExplanation}
              disabled={evaluating}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderColor: '#e74c3c',
                color: '#e74c3c',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#c0392b',
                  backgroundColor: '#fadbd8',
                  borderWidth: 2
                }
              }}
            >
              Skip Explanation
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmitExplanation}
              disabled={!canSubmitExplanation || evaluating}
              startIcon={evaluating ? null : <AutoAwesomeIcon />}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: canSubmitExplanation && !evaluating ? '#27ae60' : '#95a5a6',
                color: 'white',
                '&:hover': {
                  backgroundColor: canSubmitExplanation && !evaluating ? '#229954' : '#7f8c8d'
                }
              }}
            >
              {evaluating ? 'Evaluating...' : canSubmitExplanation ? 'Submit Explanation' : 'Write at least 10 characters'}
            </Button>
          </Stack>
        </Box>
      )}

      {/* Timer Warning */}
      {timeLeft <= 10 && !spellingComplete && (
        <Alert severity="warning" sx={{ mx: 3, mt: 2, backgroundColor: '#f39c12', color: 'white', border: '3px solid #e67e22' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Hurry! Only {timeLeft} seconds left!
          </Typography>
        </Alert>
      )}
    </Box>
  )
}
