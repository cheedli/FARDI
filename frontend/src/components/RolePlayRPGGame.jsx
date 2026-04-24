import React, { useState, useEffect } from 'react'
import { Box, Typography, Stack, Button, LinearProgress, Avatar, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Role-Play RPG Game Component
 * Advanced dialogue completion with RPG character leveling mechanics
 * Players "level up" their character by using correct terms in role-play scenarios
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

const RolePlayRPGGame = ({
  dialogueLines = [],
  wordBank = [],
  onComplete,
  characterName = "Marketing Expert",
  scenario = "Marketing Campaign Discussion"
}) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState([])
  const [completedLines, setCompletedLines] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showError, setShowError] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)
  const [wordValidation, setWordValidation] = useState([])
  const [characterLevel, setCharacterLevel] = useState(1)
  const [experiencePoints, setExperiencePoints] = useState(0)

  const currentLine = dialogueLines[currentLineIndex]
  const totalBlanks = currentLine?.blanks?.length || 0
  const maxLevel = dialogueLines.filter(line => line.blanks.length > 0).length
  const xpPerLevel = 100

  // Calculate level based on XP
  useEffect(() => {
    const newLevel = Math.min(Math.floor(experiencePoints / xpPerLevel) + 1, maxLevel)
    setCharacterLevel(newLevel)
  }, [experiencePoints, maxLevel])

  // Auto-complete lines with no blanks
  useEffect(() => {
    if (currentLine && totalBlanks === 0 && !gameComplete) {
      const alreadyCompleted = completedLines.some(line =>
        line.speaker === currentLine.speaker &&
        line.template === currentLine.template
      )

      if (!alreadyCompleted) {
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: []
        }]
        setCompletedLines(newCompletedLines)

        // Move to next line or complete game
        if (currentLineIndex + 1 < dialogueLines.length) {
          setTimeout(() => {
            setCurrentLineIndex(currentLineIndex + 1)
          }, 500)
        } else {
          setTimeout(() => {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                score: score,
                totalLines: dialogueLines.length,
                level: characterLevel,
                experiencePoints: experiencePoints,
                completed: true
              })
            }
          }, 500)
        }
      }
    }
  }, [currentLineIndex, currentLine, totalBlanks, completedLines, dialogueLines.length, gameComplete, onComplete, score, characterLevel, experiencePoints])

  const handleWordClick = (word) => {
    if (selectedWords.length < totalBlanks && !showError) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleRemoveWord = (index) => {
    if (!showError) {
      setSelectedWords(selectedWords.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    // Validate each word individually
    const validation = selectedWords.map((word, index) =>
      word.toLowerCase() === currentLine.blanks[index].toLowerCase()
    )
    setWordValidation(validation)

    const isCorrect = validation.every(v => v)

    if (isCorrect) {
      // Correct! Award XP and level up
      const xpGained = 100
      setExperiencePoints(experiencePoints + xpGained)
      setShowError(false)
      setHasRetried(false)

      const newCompletedLines = [...completedLines, {
        ...currentLine,
        userAnswer: selectedWords,
        validation: validation,
        isCorrect: true,
        xpGained: xpGained
      }]
      setCompletedLines(newCompletedLines)
      setScore(score + 1)

      // Move to next line or complete game
      if (currentLineIndex + 1 < dialogueLines.length) {
        setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1)
          setSelectedWords([])
          setWordValidation([])
        }, 1500)
      } else {
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: score + 1,
              totalLines: dialogueLines.filter(l => l.blanks.length > 0).length,
              level: characterLevel,
              experiencePoints: experiencePoints + xpGained,
              completed: true
            })
          }
        }, 1500)
      }
    } else {
      // Wrong answer
      if (!hasRetried) {
        setShowError(true)
        setHasRetried(true)
        setTimeout(() => {
          setShowError(false)
          setSelectedWords([])
          setWordValidation([])
        }, 2000)
      } else {
        setShowError(true)
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: selectedWords,
          validation: validation,
          isCorrect: false,
          xpGained: 0
        }]
        setCompletedLines(newCompletedLines)

        setTimeout(() => {
          setShowError(false)
          setHasRetried(false)

          if (currentLineIndex + 1 < dialogueLines.length) {
            setCurrentLineIndex(currentLineIndex + 1)
            setSelectedWords([])
            setWordValidation([])
          } else {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                score: score,
                totalLines: dialogueLines.filter(l => l.blanks.length > 0).length,
                level: characterLevel,
                experiencePoints: experiencePoints,
                completed: true
              })
            }
          }
        }, 2000)
      }
    }
  }

  const handleClear = () => {
    setSelectedWords([])
  }

  if (gameComplete) {
    const totalQuestionsWithBlanks = dialogueLines.filter(line => line.blanks.length > 0).length
    const finalLevel = Math.min(Math.floor(experiencePoints / xpPerLevel) + 1, maxLevel)

    return (
      <Box sx={{ ...clay(D.purple), p: 6, textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: D.yellow.border }} />
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          Quest Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: D.body }}>
          You've mastered the role-play dialogue!
        </Typography>

        <Box sx={{ ...clay(D.blue), maxWidth: 500, mx: 'auto', mb: 3, p: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ color: D.blue.border }} gutterBottom>
                Final Character Level
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                {[...Array(finalLevel)].map((_, i) => (
                  <StarIcon key={i} sx={{ color: D.yellow.border, fontSize: 40 }} />
                ))}
              </Stack>
              <Typography variant="h4" sx={{ color: D.heading }} fontWeight="bold">
                Level {finalLevel}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: D.muted }}>
                Score
              </Typography>
              <Typography variant="h3" sx={{ color: D.green.border }} fontWeight="bold">
                {score} / {totalQuestionsWithBlanks}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: D.muted }}>
                Experience Points
              </Typography>
              <Typography variant="h4" sx={{ color: D.blue.border }} fontWeight="bold">
                {experiencePoints} XP
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Typography variant="body1" sx={{ mt: 2, color: D.body }}>
          You're now a certified {characterName}!
        </Typography>
      </Box>
    )
  }

  const currentXP = experiencePoints % xpPerLevel
  const xpProgress = (currentXP / xpPerLevel) * 100

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* RPG Character Status Panel */}
      <Box sx={{ ...clay(D.purple), p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          {/* Character Avatar */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: D.yellow.border, mb: 1 }}>
              <PersonIcon sx={{ fontSize: 50, color: D.purple.border }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" sx={{ color: D.heading }}>
              {characterName}
            </Typography>
          </Box>

          {/* Level & XP */}
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: D.yellow.border }}>
                Level {characterLevel}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {[...Array(maxLevel)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{
                      color: i < characterLevel ? D.yellow.border : D.divider,
                      fontSize: 24
                    }}
                  />
                ))}
              </Stack>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: D.body }}>
                  Experience: {currentXP} / {xpPerLevel} XP
                </Typography>
                <Typography variant="body2" sx={{ color: D.body }}>
                  {xpProgress.toFixed(0)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={xpProgress}
                sx={{
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: D.divider,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: D.yellow.border
                  }
                }}
              />
            </Box>
          </Box>

          {/* Dialogue Progress */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
              Quest Progress
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: D.yellow.border }}>
              {completedLines.length} / {dialogueLines.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completedLines.length / dialogueLines.length) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: D.divider,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: D.green.border
                }
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Scenario Context */}
      <Box sx={{ ...clay(D.teal), p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: D.teal.border }}>
          Scenario: {scenario}
        </Typography>
      </Box>

      {/* Completed Lines (Dialogue History) */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {completedLines.map((line, index) => (
          <Box
            key={index}
            sx={{
              ...clay(
                line.isCorrect === false ? D.red :
                line.speaker === 'You' ? D.blue : D.orange
              ),
              p: 2.5,
              position: 'relative'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{
                bgcolor: line.speaker === 'You' ? D.blue.border : D.muted,
                width: 40,
                height: 40
              }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: D.heading }} gutterBottom>
                  {line.speaker}
                </Typography>
                <Typography variant="body1" sx={{ color: D.body }}>
                  {line.blanks.length === 0 ? (
                    line.template
                  ) : (
                    line.template.split('[____]').map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < line.userAnswer.length && (
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
                {line.isCorrect && line.xpGained > 0 && (
                  <Typography variant="caption" sx={{ color: D.green.border, fontWeight: 'bold', mt: 1, display: 'block' }}>
                    +{line.xpGained} XP earned!
                  </Typography>
                )}
              </Box>
              <CheckCircleIcon sx={{
                color: line.isCorrect === false ? D.red.border : D.green.border,
                fontSize: 28
              }} />
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Current Line - Active Role-Play */}
      <Box
        sx={{
          ...clay(showError ? D.red : (currentLine?.speaker === 'You' ? D.blue : D.orange)),
          p: 4,
          mb: 3,
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {currentLine?.speaker === 'You' && (
          <Box sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: D.blue.border,
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: '8px',
          }}>
            <Typography variant="caption" fontWeight="bold">
              YOUR TURN
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{
            bgcolor: currentLine?.speaker === 'You' ? D.blue.border : D.muted,
            width: 48,
            height: 48
          }}>
            <PersonIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: showError ? D.red.border : D.heading }}>
              {currentLine?.speaker}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.15rem', lineHeight: 1.8, color: D.body }}>
              {currentLine?.template.split('[____]').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < totalBlanks && (
                    <span style={{
                      display: 'inline-block',
                      minWidth: '120px',
                      padding: '6px 14px',
                      margin: '0 4px',
                      backgroundColor: showError
                        ? (wordValidation[i] === false ? '#f44336' : (wordValidation[i] === true ? '#4caf50' : '#e0e0e0'))
                        : (selectedWords[i] ? '#1976d2' : '#e0e0e0'),
                      color: selectedWords[i] || showError ? 'white' : '#666',
                      borderRadius: '8px',
                      border: showError && wordValidation[i] === false ? '2px solid #d32f2f' : '2px dashed #999',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      cursor: selectedWords[i] ? 'pointer' : 'default',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => selectedWords[i] && !showError && handleRemoveWord(i)}
                    >
                      {selectedWords[i] || '____'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </Typography>
            {showError && (
              <Box sx={{
                mt: 2,
                p: 2,
                ...clay(D.red),
              }}>
                <Typography variant="body1" sx={{ color: D.red.border }} fontWeight="bold">
                  {!hasRetried
                    ? 'Incorrect! Try again to level up!'
                    : 'Incorrect again! No XP gained. Moving to next dialogue...'}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Word Bank */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          Marketing Terms - Choose wisely to level up!
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {wordBank.map((word, index) => (
            <Box
              component="span"
              key={index}
              onClick={() => handleWordClick(word)}
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
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              {word}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClear}
          disabled={selectedWords.length === 0 || showError}
          size="large"
          sx={{ borderRadius: '12px', fontWeight: 700, boxShadow: `2px 2px 0 ${D.red.shadow}` }}
        >
          Clear Selection
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={selectedWords.length !== totalBlanks || showError}
          size="large"
          sx={{ px: 4, borderRadius: '12px', fontWeight: 700, boxShadow: `2px 2px 0 ${D.blue.shadow}` }}
        >
          {selectedWords.length === totalBlanks
            ? 'Submit & Level Up!'
            : `Select ${totalBlanks - selectedWords.length} more term(s)`}
        </Button>
      </Stack>

      {/* Locked Future Dialogues */}
      {currentLineIndex < dialogueLines.length - 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ color: D.muted }} gutterBottom fontWeight="bold">
            Upcoming Dialogues (Complete current to unlock):
          </Typography>
          {dialogueLines.slice(currentLineIndex + 1, currentLineIndex + 3).map((line, index) => (
            <Box
              key={index}
              sx={{
                ...clay(D.orange),
                p: 2,
                mb: 1,
                opacity: 0.6,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <LockIcon sx={{ color: D.muted }} />
                <Typography variant="body2" sx={{ color: D.body }}>
                  {line.speaker}: {line.template.replace(/\[____\]/g, '____')}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default RolePlayRPGGame
