import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Stack, Avatar, LinearProgress, useTheme } from '@mui/material'
import SwordsIcon from '@mui/icons-material/SportsMartialArts'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Debate Duel Game Component
 * Simulate debate with AI opponent - win rounds with correct term usage
 * Advanced C1 level vocabulary challenge
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

const DebateDuelGame = ({
  debateLines = [],
  wordBank = [],
  onComplete
}) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState([])
  const [completedLines, setCompletedLines] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [wordValidation, setWordValidation] = useState([])

  const currentLine = debateLines[currentLineIndex]
  const totalBlanks = currentLine?.blanks?.length || 0

  const handleWordClick = (word) => {
    if (selectedWords.length < totalBlanks && !showFeedback) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleRemoveWord = (index) => {
    if (!showFeedback) {
      setSelectedWords(selectedWords.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    // Validate each word individually
    const validation = selectedWords.map((word, index) =>
      word.toLowerCase() === currentLine.blanks[index].toLowerCase()
    )
    setWordValidation(validation)

    const allCorrect = validation.every(v => v)
    setIsCorrect(allCorrect)
    setShowFeedback(true)

    if (allCorrect) {
      // User wins this round
      setUserScore(userScore + 1)
    } else {
      // Opponent wins this round
      setOpponentScore(opponentScore + 1)
    }

    // Store completed line
    const newCompletedLines = [...completedLines, {
      ...currentLine,
      userAnswer: selectedWords,
      validation: validation,
      isCorrect: allCorrect
    }]
    setCompletedLines(newCompletedLines)

    // Move to next line or complete game
    setTimeout(() => {
      if (currentLineIndex + 1 < debateLines.length) {
        setCurrentLineIndex(currentLineIndex + 1)
        setSelectedWords([])
        setShowFeedback(false)
        setWordValidation([])
      } else {
        // Game complete
        setGameComplete(true)
        if (onComplete) {
          onComplete({
            userScore: allCorrect ? userScore + 1 : userScore,
            opponentScore: allCorrect ? opponentScore : opponentScore + 1,
            totalRounds: debateLines.filter(l => l.blanks.length > 0).length,
            completedLines: newCompletedLines,
            won: (allCorrect ? userScore + 1 : userScore) > (allCorrect ? opponentScore : opponentScore + 1),
            completed: true
          })
        }
      }
    }, 2000)
  }

  const handleClear = () => {
    setSelectedWords([])
  }

  if (gameComplete) {
    const won = userScore > opponentScore
    const tied = userScore === opponentScore

    return (
      <Box sx={{
        ...clay(won ? D.green : tied ? D.orange : D.red),
        p: 6,
        textAlign: 'center',
      }}>
        <Typography variant="h2" gutterBottom sx={{ fontSize: '4rem' }}>
          {won ? '🏆' : tied ? '🤝' : '⚔️'}
        </Typography>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          {won ? 'Victory!' : tied ? 'Tie!' : 'Defeat!'}
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: D.body }}>
          {won
            ? 'You won the debate duel!'
            : tied
            ? 'The debate ended in a tie!'
            : 'Your opponent won this time!'}
        </Typography>

        <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: D.body }}>You</Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ color: D.heading }}>{userScore}</Typography>
          </Box>
          <Typography variant="h2" fontWeight="bold" sx={{ color: D.muted }}>-</Typography>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: D.body }}>Opponent</Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ color: D.heading }}>{opponentScore}</Typography>
          </Box>
        </Stack>
      </Box>
    )
  }

  // Auto-complete lines with no blanks (opponent lines)
  useEffect(() => {
    if (currentLine && totalBlanks === 0 && !showFeedback) {
      const alreadyCompleted = completedLines.some(line =>
        line.speaker === currentLine.speaker &&
        line.template === currentLine.template
      )

      if (!alreadyCompleted) {
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: [],
          isCorrect: null
        }]
        setCompletedLines(newCompletedLines)

        setTimeout(() => {
          if (currentLineIndex + 1 < debateLines.length) {
            setCurrentLineIndex(currentLineIndex + 1)
          } else {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                userScore: userScore,
                opponentScore: opponentScore,
                totalRounds: debateLines.filter(l => l.blanks.length > 0).length,
                completedLines: newCompletedLines,
                won: userScore > opponentScore,
                completed: true
              })
            }
          }
        }, 2000)
      }
    }
  }, [currentLineIndex, currentLine, totalBlanks, completedLines, debateLines.length, showFeedback, onComplete, userScore, opponentScore])

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Duel Score Header */}
      <Box sx={{ ...clay(D.red), p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: D.blue.border, width: 50, height: 50 }}>
              <Typography fontWeight="bold">You</Typography>
            </Avatar>
            <Typography variant="h3" fontWeight="bold" sx={{ color: D.heading }}>
              {userScore}
            </Typography>
          </Stack>

          <Stack alignItems="center">
            <SwordsIcon sx={{ fontSize: 50, color: D.red.border, mb: 1 }} />
            <Typography variant="h6" sx={{ color: D.body }}>
              Round {completedLines.filter(l => l.blanks && l.blanks.length > 0).length + 1} / {debateLines.filter(l => l.blanks.length > 0).length}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h3" fontWeight="bold" sx={{ color: D.heading }}>
              {opponentScore}
            </Typography>
            <Avatar sx={{ bgcolor: D.red.border, width: 50, height: 50 }}>
              <Typography fontWeight="bold">AI</Typography>
            </Avatar>
          </Stack>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={((completedLines.filter(l => l.blanks && l.blanks.length > 0).length) / debateLines.filter(l => l.blanks.length > 0).length) * 100}
          sx={{
            mt: 2,
            height: 10,
            borderRadius: 1,
            backgroundColor: D.divider,
            '& .MuiLinearProgress-bar': {
              backgroundColor: D.yellow.border
            }
          }}
        />
      </Box>

      {/* Completed Debate History */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {completedLines.map((line, index) => (
          <Box
            key={index}
            sx={{
              ...clay(
                line.isCorrect === true ? D.green :
                line.isCorrect === false ? D.red :
                line.speaker === 'You' ? D.blue : D.orange
              ),
              p: 2.5,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{
                bgcolor: line.speaker === 'You' ? D.blue.border : D.red.border,
                width: 40,
                height: 40
              }}>
                <Typography variant="body2" fontWeight="bold">
                  {line.speaker === 'You' ? 'You' : 'AI'}
                </Typography>
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: D.heading }} gutterBottom>
                  {line.speaker}
                </Typography>
                <Typography variant="body1" sx={{ color: D.body }}>
                  {line.blanks && line.blanks.length === 0 ? (
                    line.template
                  ) : (
                    line.template.split('[____]').map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < (line.userAnswer?.length || 0) && (
                          <span style={{
                            backgroundColor: line.validation && line.validation[i] === false ? '#f44336' : '#4caf50',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            margin: '0 2px'
                          }}>
                            {line.userAnswer[i]}
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </Typography>
              </Box>
              {line.isCorrect !== null && (
                line.isCorrect ? (
                  <CheckCircleIcon sx={{ color: D.green.border, fontSize: 30 }} />
                ) : (
                  <CancelIcon sx={{ color: D.red.border, fontSize: 30 }} />
                )
              )}
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Current Debate Line */}
      {currentLine && (
        <Box
          sx={{
            ...clay(
              showFeedback
                ? (isCorrect ? D.green : D.red)
                : (currentLine.speaker === 'You' ? D.blue : D.orange)
            ),
            p: 4,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar sx={{
              bgcolor: currentLine.speaker === 'You' ? D.blue.border : D.red.border,
              width: 48,
              height: 48
            }}>
              <Typography fontWeight="bold">
                {currentLine.speaker === 'You' ? 'You' : 'AI'}
              </Typography>
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: D.heading }}>
                {currentLine.speaker}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.15rem', lineHeight: 1.8, color: D.body }}>
                {currentLine.template.split('[____]').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < totalBlanks && (
                      <span style={{
                        display: 'inline-block',
                        minWidth: '140px',
                        padding: '6px 14px',
                        margin: '0 4px',
                        backgroundColor: showFeedback
                          ? (wordValidation[i] === false ? '#f44336' : (wordValidation[i] === true ? '#4caf50' : '#e0e0e0'))
                          : (selectedWords[i] ? '#1976d2' : '#e0e0e0'),
                        color: selectedWords[i] || showFeedback ? 'white' : '#666',
                        borderRadius: '8px',
                        border: '2px dashed #999',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: selectedWords[i] && !showFeedback ? 'pointer' : 'default'
                      }}
                      onClick={() => selectedWords[i] && !showFeedback && handleRemoveWord(i)}
                      >
                        {selectedWords[i] || '____'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </Typography>

              {showFeedback && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    ...clay(isCorrect ? D.green : D.red),
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: D.heading }}>
                    {isCorrect ? '✓ You win this round!' : '✗ Opponent wins this round!'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      )}

      {/* Word Bank */}
      {currentLine && totalBlanks > 0 && (
        <>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
              Advanced Marketing Terms - Choose Carefully!
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {wordBank.map((word, index) => (
                <Box
                  component="span"
                  key={index}
                  onClick={() => !showFeedback && handleWordClick(word)}
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    borderRadius: '50px',
                    bgcolor: selectedWords.includes(word) ? D.blue.border : D.teal.bg,
                    border: '2px solid ' + (selectedWords.includes(word) ? D.blue.shadow : D.teal.border),
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: selectedWords.includes(word) ? '#fff' : D.teal.border,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: showFeedback ? 'default' : 'pointer',
                    opacity: showFeedback ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: showFeedback ? 'none' : 'scale(1.05)',
                    }
                  }}
                >
                  {word}
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              disabled={selectedWords.length === 0 || showFeedback}
              size="large"
              sx={{ borderRadius: '12px', fontWeight: 700, boxShadow: `2px 2px 0 ${D.red.shadow}` }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedWords.length !== totalBlanks || showFeedback}
              size="large"
              sx={{ px: 4, borderRadius: '12px', fontWeight: 700, boxShadow: `2px 2px 0 ${D.blue.shadow}` }}
            >
              {selectedWords.length === totalBlanks ? 'Submit Response' : `Select ${totalBlanks - selectedWords.length} more`}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}

export default DebateDuelGame
