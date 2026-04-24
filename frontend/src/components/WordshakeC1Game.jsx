import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Button, Stack, LinearProgress, TextField, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import StarIcon from '@mui/icons-material/Star'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Wordshake C1 Game Component
 * Students find 6 advanced marketing words in a grid, then use each in a sentence
 * C1 level: guerilla, surrogate, remarketing, geotargeting, infomercial, viral
 */

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}
const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const WordshakeC1Game = ({
  targetWords = [], // Array of 6 words to find
  duration = 300, // 5 minutes for finding words
  onComplete
}) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  // C1-specific grid with the 6 advanced terms
  const PREDEFINED_GRID = [
    ['G', 'U', 'E', 'R', 'I', 'L', 'L', 'A', 'X', 'Z', 'C', 'V'],
    ['E', 'B', 'N', 'M', 'G', 'F', 'D', 'S', 'A', 'L', 'K', 'J'],
    ['O', 'I', 'N', 'F', 'O', 'M', 'E', 'R', 'C', 'I', 'A', 'L'],
    ['T', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q', 'S'],
    ['A', 'G', 'F', 'D', 'S', 'A', 'L', 'K', 'J', 'H', 'G', 'U'],
    ['R', 'E', 'M', 'A', 'R', 'K', 'E', 'T', 'I', 'N', 'G', 'R'],
    ['G', 'M', 'N', 'B', 'V', 'C', 'X', 'Z', 'L', 'K', 'J', 'R'],
    ['E', 'V', 'I', 'R', 'A', 'L', 'P', 'O', 'I', 'U', 'Y', 'O'],
    ['T', 'H', 'G', 'F', 'D', 'S', 'A', 'L', 'K', 'J', 'H', 'G'],
    ['I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q', 'M', 'N', 'B', 'A'],
    ['N', 'M', 'L', 'K', 'J', 'H', 'G', 'F', 'D', 'S', 'A', 'T'],
    ['G', 'S', 'U', 'R', 'R', 'O', 'G', 'A', 'T', 'E', 'W', 'E']
  ]

  // Phase 1: Word Finding
  const [grid] = useState(PREDEFINED_GRID)
  const [selectedCells, setSelectedCells] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState(new Set())
  const [foundWordCells, setFoundWordCells] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameStarted, setGameStarted] = useState(false)
  const [wordFindingComplete, setWordFindingComplete] = useState(false)
  const [score, setScore] = useState(0)

  // Phase 2: Sentence Writing
  const [sentencePhase, setSentencePhase] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [sentences, setSentences] = useState({})
  const [currentSentence, setCurrentSentence] = useState('')
  const [sentenceEvaluation, setSentenceEvaluation] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  // Timer countdown (only during word finding phase)
  useEffect(() => {
    if (gameStarted && !wordFindingComplete && !sentencePhase && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setWordFindingComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, wordFindingComplete, sentencePhase, timeLeft])

  // Auto-transition to sentence phase when all words found or time's up
  useEffect(() => {
    if (wordFindingComplete && !sentencePhase && foundWords.size > 0) {
      setTimeout(() => {
        setSentencePhase(true)
      }, 1500)
    }
  }, [wordFindingComplete, sentencePhase, foundWords])

  const handleCellClick = (row, col) => {
    if (wordFindingComplete || sentencePhase) return

    if (!gameStarted) {
      setGameStarted(true)
    }

    const cellKey = `${row}-${col}`
    const isAlreadySelected = selectedCells.some(cell => cell.key === cellKey)

    if (isAlreadySelected) {
      return
    }

    // Check if cell is adjacent to last selected cell
    if (selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1]
      const rowDiff = Math.abs(row - lastCell.row)
      const colDiff = Math.abs(col - lastCell.col)

      // Must be adjacent (including diagonals)
      if (rowDiff > 1 || colDiff > 1) {
        return
      }
    }

    const newSelectedCells = [...selectedCells, { row, col, key: cellKey, letter: grid[row][col] }]
    setSelectedCells(newSelectedCells)
    setCurrentWord(newSelectedCells.map(cell => cell.letter).join(''))
  }

  const handleSubmitWord = () => {
    const word = currentWord.toLowerCase()

    // Check if it's a target word and not already found
    const matchedWord = targetWords.find(tw => tw.toLowerCase() === word)

    if (matchedWord && !foundWords.has(matchedWord)) {
      const newFoundWords = new Set([...foundWords, matchedWord])
      setFoundWords(newFoundWords)
      setScore(prev => prev + 1)

      // Mark the cells of the found word
      const newFoundCells = new Set(foundWordCells)
      selectedCells.forEach(cell => {
        newFoundCells.add(cell.key)
      })
      setFoundWordCells(newFoundCells)

      // Check if all words are found - end word finding phase
      if (newFoundWords.size === targetWords.length) {
        setTimeout(() => {
          setWordFindingComplete(true)
        }, 800)
      }
    }

    // Clear selection
    setSelectedCells([])
    setCurrentWord('')
  }

  const handleClearSelection = () => {
    setSelectedCells([])
    setCurrentWord('')
  }

  const handleSentenceChange = (event) => {
    setCurrentSentence(event.target.value)
  }

  const handleSubmitSentence = async () => {
    if (!currentSentence.trim()) return

    const wordsArray = Array.from(foundWords)
    const currentTargetWord = wordsArray[currentWordIndex]

    setIsEvaluating(true)

    try {
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: `Use "${currentTargetWord}" in a marketing context sentence`,
          answer: currentSentence,
          level: 'C1',
          task: 'sentence',
          criteria: {
            requiresWord: currentTargetWord,
            requiresContext: true,
            glossaryTerms: targetWords,
            minWordsRequired: 5
          }
        })
      })

      const result = await response.json()

      // Store the sentence and evaluation
      const newSentences = {
        ...sentences,
        [currentTargetWord]: {
          sentence: currentSentence,
          evaluation: result,
          isCorrect: result.score === 1
        }
      }
      setSentences(newSentences)
      setSentenceEvaluation(result)

      // Move to next word or complete game
      setTimeout(() => {
        if (currentWordIndex + 1 < wordsArray.length) {
          setCurrentWordIndex(currentWordIndex + 1)
          setCurrentSentence('')
          setSentenceEvaluation(null)
        } else {
          setGameComplete(true)
          if (onComplete) {
            const sentenceScore = Object.values(newSentences).filter(s => s.isCorrect).length
            onComplete({
              wordFindingScore: foundWords.size,
              totalWords: targetWords.length,
              foundWords: Array.from(foundWords),
              sentences: newSentences,
              sentenceScore: sentenceScore,
              totalScore: foundWords.size + sentenceScore,
              maxScore: targetWords.length * 2,
              completed: true
            })
          }
        }
      }, 2000)

    } catch (error) {
      console.error('Sentence evaluation error:', error)
      setSentenceEvaluation({ score: 0, feedback: 'Unable to evaluate. Please try again.' })
    } finally {
      setIsEvaluating(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col)
  }

  const isFoundWordCell = (row, col) => {
    const key = `${row}-${col}`
    return foundWordCells.has(key)
  }

  // Game Complete View
  if (gameComplete) {
    const correctSentences = Object.values(sentences).filter(s => s.isCorrect).length
    const totalScore = foundWords.size + correctSentences

    return (
      <Box sx={{ ...clay(D.purple), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          🎉 Challenge Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: D.body }}>
          You've completed the C1 Wordshake Challenge!
        </Typography>
        <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.purple.border}`, borderRadius: '12px', p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: D.body }}>
            Word Finding: {foundWords.size}/{targetWords.length}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: D.body }}>
            Sentence Writing: {correctSentences}/{foundWords.size}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, color: D.heading }}>
            Total Score: {totalScore}/{targetWords.length * 2}
          </Typography>
        </Box>
      </Box>
    )
  }

  // Sentence Writing Phase
  if (sentencePhase) {
    const wordsArray = Array.from(foundWords)
    const currentTargetWord = wordsArray[currentWordIndex]

    return (
      <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ ...clay(D.purple), p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: D.heading }}>
            Sentence Writing Phase
          </Typography>
          <Typography variant="body1" sx={{ color: D.body }}>
            Write a sentence using each word in a marketing context
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentWordIndex / wordsArray.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: 1,
              backgroundColor: D.divider,
              '& .MuiLinearProgress-bar': { backgroundColor: D.purple.border }
            }}
          />
        </Box>

        {/* Current Word */}
        <Box sx={{
          ...clay(sentenceEvaluation ? (sentenceEvaluation.score === 1 ? D.green : D.red) : D.blue),
          p: 4,
          mb: 3
        }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
            Word {currentWordIndex + 1} of {wordsArray.length}: <span style={{ color: D.purple.border }}>{currentTargetWord}</span>
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={currentSentence}
            onChange={handleSentenceChange}
            placeholder={`Write a sentence using "${currentTargetWord}" in a marketing context...`}
            disabled={isEvaluating || sentenceEvaluation !== null}
            InputProps={{ style: { color: '#000000', fontSize: '16px' } }}
            sx={{
              mt: 2,
              mb: 2,
              '& .MuiOutlinedInput-root': { backgroundColor: 'white' },
              '& .MuiInputBase-input': { color: '#000000 !important', WebkitTextFillColor: '#000000 !important' }
            }}
          />

          {sentenceEvaluation && (
            <Box sx={{ ...clay(sentenceEvaluation.score === 1 ? D.green : D.red), mt: 2, p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                {sentenceEvaluation.score === 1
                  ? <CheckCircleIcon sx={{ color: D.green.border }} />
                  : <CancelIcon sx={{ color: D.red.border }} />}
                <Typography variant="h6" fontWeight="bold" sx={{ color: D.heading }}>
                  {sentenceEvaluation.score === 1 ? 'Excellent!' : 'Needs Improvement'}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: D.body }}>
                {sentenceEvaluation.feedback}
              </Typography>
            </Box>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitSentence}
              disabled={!currentSentence.trim() || isEvaluating || sentenceEvaluation !== null}
              sx={{
                px: 4,
                borderRadius: '12px',
                boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` }
              }}
            >
              {isEvaluating ? 'Evaluating...' : 'Submit Sentence'}
            </Button>
          </Stack>
        </Box>

        {/* Progress */}
        <Box sx={{ ...clay(D.blue), p: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading }}>
            Progress: {currentWordIndex}/{wordsArray.length} completed
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {wordsArray.map((word, index) => {
              const completed = index < currentWordIndex
              const current = index === currentWordIndex
              const c = current ? D.blue : completed ? D.green : { bg: D.cardBg, border: D.divider }
              return (
                <Box
                  key={index}
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    borderRadius: '50px',
                    bgcolor: c.bg,
                    border: `2px solid ${c.border}`,
                    fontWeight: current ? 700 : 400,
                    fontSize: '0.85rem',
                    color: c.border,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {completed && <CheckCircleIcon sx={{ fontSize: 14 }} />}
                  {word}
                </Box>
              )
            })}
          </Stack>
        </Box>
      </Box>
    )
  }

  // Word Finding Phase
  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header with Timer and Score */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: D.heading }}>
              Wordshake Challenge - C1 Level
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted }}>
              Find 6 advanced marketing terms in the grid
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
            {/* Timer */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimerIcon sx={{ color: timeLeft < 60 ? D.red.border : D.blue.border }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: timeLeft < 60 ? D.red.border : D.heading }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: D.muted }}>
                Time Left
              </Typography>
            </Box>

            {/* Score */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon sx={{ color: 'warning.main' }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: D.green.border }}>
                  {score}/{targetWords.length}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: D.muted }}>
                Words Found
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(foundWords.size / targetWords.length) * 100}
          sx={{ mt: 2, height: 8, borderRadius: 1 }}
        />
      </Box>

      {/* Current Word Display */}
      {currentWord && (
        <Box sx={{ ...clay(D.teal), p: 2, mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: D.heading }}>
            {currentWord}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmitWord}
              sx={{
                borderRadius: '12px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` }
              }}
            >
              Submit Word
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearSelection}
              sx={{ borderRadius: '12px', '&:hover': { transform: 'translate(-2px,-2px)' } }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      )}

      {/* Letter Grid */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
        <Grid container spacing={1}>
          {grid.map((row, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <Stack direction="row" spacing={1} justifyContent="center">
                {row.map((letter, colIndex) => {
                  const selected = isSelected(rowIndex, colIndex)
                  const isFound = isFoundWordCell(rowIndex, colIndex)
                  const cellColor = selected ? D.blue : isFound ? D.green : { bg: D.cardBg, border: D.divider, shadow: D.muted }
                  return (
                    <Box
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      sx={{
                        width: 45,
                        height: 45,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: wordFindingComplete ? 'default' : 'pointer',
                        bgcolor: cellColor.bg,
                        color: selected ? cellColor.border : isFound ? cellColor.border : D.body,
                        transition: 'all 0.2s',
                        border: `2px solid ${cellColor.border}`,
                        borderRadius: '10px',
                        boxShadow: selected || isFound ? `3px 3px 0 ${cellColor.shadow}` : 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          transform: wordFindingComplete ? 'none' : 'translate(-1px,-1px) scale(1.1)',
                          boxShadow: wordFindingComplete ? 'none' : `4px 4px 0 ${cellColor.shadow || D.blue.shadow}`,
                        }
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {letter}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Target Words List */}
      <Box sx={{ ...clay(D.yellow), p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: D.heading }}>
          Target Words ({foundWords.size}/{targetWords.length})
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {targetWords.map((word, index) => {
            const found = foundWords.has(word)
            const c = found ? D.green : { bg: D.cardBg, border: D.divider }
            return (
              <Box
                key={index}
                sx={{
                  px: 1.5,
                  py: 0.4,
                  borderRadius: '50px',
                  bgcolor: c.bg,
                  border: `2px solid ${c.border}`,
                  fontWeight: found ? 700 : 400,
                  fontSize: '1rem',
                  color: found ? D.green.border : D.muted,
                  opacity: found ? 1 : 0.65,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {found && <CheckCircleIcon sx={{ fontSize: 14 }} />}
                {word}
              </Box>
            )
          })}
        </Stack>
      </Box>

      {/* Phase Complete Message */}
      {wordFindingComplete && (
        <Box sx={{ ...clay(D.green), p: 4, mt: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: D.heading }}>
            {foundWords.size === targetWords.length ? '🎉 Perfect!' : '⏰ Time\'s Up!'}
          </Typography>
          <Typography variant="h5" sx={{ color: D.body }}>
            You found {foundWords.size} out of {targetWords.length} words!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: D.muted }}>
            Next: Write sentences using each word...
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default WordshakeC1Game
