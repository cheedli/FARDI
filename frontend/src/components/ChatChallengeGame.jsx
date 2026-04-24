import React, { useState } from 'react'
import { Box, Typography, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const LIGHT = {
  cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
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
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const ChatChallengeGame = ({ dialogueLines = [], wordBank = [], onComplete }) => {
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

  const currentLine = dialogueLines[currentLineIndex]
  const totalBlanks = currentLine?.blanks?.length || 0

  React.useEffect(() => {
    if (currentLine && totalBlanks === 0 && !gameComplete) {
      const already = completedLines.some(l => l.speaker === currentLine.speaker && l.template === currentLine.template)
      if (!already) {
        const newDone = [...completedLines, { ...currentLine, userAnswer: [] }]
        setCompletedLines(newDone)
        if (currentLineIndex + 1 < dialogueLines.length) {
          setTimeout(() => setCurrentLineIndex(currentLineIndex + 1), 500)
        } else {
          setTimeout(() => { setGameComplete(true); onComplete?.({ score, totalLines: dialogueLines.length, completed: true }) }, 500)
        }
      }
    }
  }, [currentLineIndex, currentLine, totalBlanks, completedLines, dialogueLines.length, gameComplete, onComplete, score])

  const handleWordClick = (word) => {
    if (selectedWords.length < totalBlanks) setSelectedWords([...selectedWords, word])
  }
  const handleRemoveWord = (index) => setSelectedWords(selectedWords.filter((_, i) => i !== index))
  const handleClear = () => setSelectedWords([])

  const handleSubmit = () => {
    const validation = selectedWords.map((word, i) => word.toLowerCase() === currentLine.blanks[i].toLowerCase())
    setWordValidation(validation)
    const allCorrect = validation.every(v => v)
    const correctCount = validation.filter(v => v).length

    if (allCorrect) {
      setShowError(false); setHasRetried(false)
      const newDone = [...completedLines, { ...currentLine, userAnswer: selectedWords, validation, isCorrect: true }]
      setCompletedLines(newDone)
      setScore(s => s + correctCount)
      if (currentLineIndex + 1 < dialogueLines.length) {
        setTimeout(() => { setCurrentLineIndex(i => i + 1); setSelectedWords([]); setWordValidation([]) }, 1000)
      } else {
        const totalBlanksCount = dialogueLines.reduce((s, l) => s + (l.blanks?.length || 0), 0)
        setTimeout(() => { setGameComplete(true); onComplete?.({ score: score + correctCount, totalBlanks: totalBlanksCount, completed: true }) }, 1000)
      }
    } else {
      if (!hasRetried) {
        setShowError(true); setHasRetried(true)
        setTimeout(() => { setShowError(false); setSelectedWords([]); setWordValidation([]) }, 1500)
      } else {
        setShowError(true)
        const newDone = [...completedLines, { ...currentLine, userAnswer: selectedWords, validation, isCorrect: false }]
        setCompletedLines(newDone)
        setTimeout(() => {
          setShowError(false); setHasRetried(false)
          if (currentLineIndex + 1 < dialogueLines.length) {
            setCurrentLineIndex(i => i + 1); setSelectedWords([]); setWordValidation([])
          } else {
            setGameComplete(true); onComplete?.({ score, totalLines: dialogueLines.length - 1, completed: true })
          }
        }, 1500)
      }
    }
  }

  if (gameComplete) {
    const totalBlanksCount = dialogueLines.reduce((s, l) => s + (l.blanks?.length || 0), 0)
    return (
      <Box sx={{ ...clay(D.green), p: { xs: 3, md: 5 }, textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 72, color: D.yellow.border, mb: 2 }} />
        <Typography variant="h4" fontWeight={900} sx={{ color: D.heading, mb: 1 }}>Chat Challenge Complete!</Typography>
        <Typography fontWeight={700} sx={{ color: D.body, mb: 1 }}>You completed the dialogue!</Typography>
        <Typography fontWeight={800} sx={{ color: D.green.border, fontSize: '1.2rem' }}>
          Score: {score} / {totalBlanksCount} words correct
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>

      {/* Progress */}
      <Box sx={{ ...clay(D.blue), p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography fontWeight={800} sx={{ color: D.heading, whiteSpace: 'nowrap' }}>
          {completedLines.length} / {dialogueLines.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={dialogueLines.length > 0 ? (completedLines.length / dialogueLines.length) * 100 : 0}
          sx={{ flex: 1, height: 8, borderRadius: '6px', bgcolor: D.divider, '& .MuiLinearProgress-bar': { bgcolor: D.blue.border, borderRadius: '6px' } }}
        />
        <Typography fontWeight={700} sx={{ color: D.blue.border, whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
          Dialogue Progress
        </Typography>
      </Box>

      {/* Completed lines */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
        {completedLines.map((line, idx) => {
          const isYou = line.speaker === 'You'
          const c = line.isCorrect === false ? D.red : D.green
          return (
            <Box key={idx} sx={{ ...clay(c), p: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <PersonIcon sx={{ color: isYou ? D.blue.border : D.muted, flexShrink: 0, mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={800} sx={{ color: D.heading, fontSize: '0.85rem', mb: 0.5 }}>{line.speaker}:</Typography>
                <Typography sx={{ color: D.body }}>
                  {line.blanks.length === 0 ? line.template : (
                    line.template.split('[____]').map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < line.userAnswer.length && (
                          <span style={{
                            display: 'inline-block', padding: '2px 8px', margin: '0 3px',
                            backgroundColor: line.validation?.[i] === false ? '#C62828' : '#388E3C',
                            color: '#fff', borderRadius: '6px', fontWeight: 800, fontSize: '0.9em',
                          }}>
                            {line.userAnswer[i]}
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </Typography>
              </Box>
              {line.isCorrect === false
                ? <CancelIcon sx={{ color: D.red.border, flexShrink: 0 }} />
                : <CheckCircleIcon sx={{ color: D.green.border, flexShrink: 0 }} />}
            </Box>
          )
        })}
      </Box>

      {/* Current line */}
      <Box sx={{ ...clay(showError ? D.red : { bg: D.cardBg, border: D.divider, shadow: D.divider }), p: 3, mb: 2.5, transition: 'all 0.2s' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <PersonIcon sx={{ color: currentLine?.speaker === 'You' ? D.blue.border : D.muted, flexShrink: 0, mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={800} sx={{ color: showError ? D.red.border : D.heading, mb: 1 }}>{currentLine?.speaker}:</Typography>
            <Typography sx={{ color: D.body, fontSize: '1.05rem', lineHeight: 2.2 }}>
              {currentLine?.template.split('[____]').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < totalBlanks && (
                    <span
                      onClick={() => selectedWords[i] && !showError && handleRemoveWord(i)}
                      style={{
                        display: 'inline-block', minWidth: 90, padding: '3px 12px', margin: '0 4px',
                        backgroundColor: showError
                          ? (wordValidation[i] === false ? '#C62828' : wordValidation[i] === true ? '#388E3C' : '#BDBDBD')
                          : (selectedWords[i] ? '#1976D2' : 'transparent'),
                        color: selectedWords[i] || showError ? '#fff' : '#9E9E9E',
                        borderRadius: '8px',
                        border: `2px ${selectedWords[i] ? 'solid' : 'dashed'} ${showError && wordValidation[i] === false ? '#C62828' : '#9E9E9E'}`,
                        fontWeight: 800, textAlign: 'center', cursor: selectedWords[i] && !showError ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                      }}
                    >
                      {selectedWords[i] || '____'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </Typography>
            {showError && (
              <Typography variant="body2" fontWeight={800} sx={{ color: D.red.border, mt: 1 }}>
                {!hasRetried ? 'Incorrect! Try again.' : 'Incorrect again. Moving on…'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Word bank */}
      <Box sx={{ ...clay(D.teal), p: 2.5, mb: 2.5 }}>
        <Typography fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>Word Bank — click to fill blanks:</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {wordBank.map((word, i) => {
            const used = selectedWords.includes(word)
            return (
              <Box
                key={i}
                onClick={() => !used && handleWordClick(word)}
                sx={{
                  px: 2, py: 0.75, borderRadius: '12px',
                  bgcolor: used ? D.divider : D.cardBg,
                  border: `2px solid ${used ? D.divider : D.teal.border}`,
                  boxShadow: used ? 'none' : `3px 3px 0 ${D.teal.shadow}`,
                  fontWeight: 800, fontSize: '0.9rem',
                  color: used ? D.muted : D.teal.border,
                  cursor: used ? 'not-allowed' : 'pointer',
                  opacity: used ? 0.45 : 1,
                  transition: 'all 0.15s',
                  '&:hover': !used ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${D.teal.shadow}` } : {},
                }}
              >
                {word}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Box
          component="button"
          onClick={handleClear}
          disabled={selectedWords.length === 0}
          sx={{
            ...clay(selectedWords.length === 0 ? { bg: D.divider, border: D.divider, shadow: D.divider } : D.red),
            px: 3, py: 1, cursor: selectedWords.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 800, fontSize: '0.9rem',
            color: selectedWords.length === 0 ? D.muted : D.red.border,
            transition: 'all 0.15s',
            '&:hover': selectedWords.length > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.red.shadow}` } : {},
          }}
        >
          Clear
        </Box>
        <Box
          component="button"
          onClick={handleSubmit}
          disabled={selectedWords.length !== totalBlanks}
          sx={{
            ...clay(selectedWords.length !== totalBlanks ? { bg: D.divider, border: D.divider, shadow: D.divider } : D.blue),
            px: 3.5, py: 1, cursor: selectedWords.length !== totalBlanks ? 'not-allowed' : 'pointer',
            fontWeight: 800, fontSize: '0.95rem',
            color: selectedWords.length !== totalBlanks ? D.muted : D.blue.border,
            transition: 'all 0.15s',
            '&:hover': selectedWords.length === totalBlanks ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` } : {},
          }}
        >
          {selectedWords.length === totalBlanks ? 'Submit Answer' : `Fill ${totalBlanks - selectedWords.length} more blank(s)`}
        </Box>
      </Box>

      {/* Locked future lines */}
      {currentLineIndex < dialogueLines.length - 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: D.muted, mb: 1.5 }}>
            Locked — complete current line to unlock:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {dialogueLines.slice(currentLineIndex + 1).map((line, i) => (
              <Box key={i} sx={{ ...clay({ bg: D.cardBg, border: D.divider, shadow: D.divider }), px: 2, py: 1.5, display: 'flex', gap: 2, alignItems: 'center', opacity: 0.45 }}>
                <LockIcon sx={{ color: D.muted, fontSize: 18, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: D.muted }}>
                  {line.speaker}: {line.template.replace(/\[____\]/g, '____')}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  )
}

export default ChatChallengeGame
