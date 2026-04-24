import React, { useState, useEffect } from 'react'
import { Box, Typography, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import StarIcon from '@mui/icons-material/Star'

const LIGHT = {
  cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
  cell:   { bg: '#F5F5F5', border: '#BDBDBD', shadow: '#9E9E9E' },
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
  cell:   { bg: '#1E1E36', border: '#3A3A5A', shadow: '#12122A' },
}

const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const WordshakeGame = ({ targetWords = [], duration = 180, onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [grid, setGrid] = useState([])
  const [selectedCells, setSelectedCells] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState(new Set())
  const [foundWordCells, setFoundWordCells] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [score, setScore] = useState(0)

  const DEFAULT_GRID = [
    ['C', 'O', 'M', 'M', 'E', 'R', 'C', 'I', 'A', 'L', 'K', 'P'],
    ['X', 'A', 'D', 'H', 'T', 'Y', 'U', 'I', 'O', 'P', 'L', 'O'],
    ['B', 'I', 'L', 'L', 'B', 'O', 'A', 'R', 'D', 'M', 'S', 'S'],
    ['F', 'E', 'A', 'T', 'U', 'R', 'E', 'Z', 'X', 'C', 'L', 'T'],
    ['E', 'Y', 'E', 'C', 'A', 'T', 'C', 'H', 'E', 'R', 'O', 'E'],
    ['V', 'I', 'D', 'E', 'O', 'W', 'Q', 'A', 'S', 'D', 'G', 'R'],
    ['M', 'N', 'B', 'V', 'C', 'X', 'Z', 'L', 'K', 'J', 'A', 'H'],
    ['P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q', 'N', 'M'],
  ]
  const SOCIAL_MEDIA_GRID = [
    ['H', 'A', 'S', 'H', 'T', 'A', 'G', 'X', 'Y', 'Z', 'Q', 'W'],
    ['C', 'A', 'P', 'T', 'I', 'O', 'N', 'M', 'K', 'L', 'E', 'R'],
    ['V', 'I', 'R', 'A', 'L', 'B', 'C', 'D', 'F', 'G', 'N', 'T'],
    ['E', 'N', 'G', 'A', 'G', 'E', 'M', 'E', 'N', 'T', 'G', 'Y'],
    ['E', 'M', 'O', 'J', 'I', 'X', 'Y', 'Z', 'Q', 'W', 'A', 'U'],
    ['T', 'A', 'G', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'G', 'I'],
    ['S', 'T', 'O', 'R', 'Y', 'M', 'N', 'B', 'V', 'C', 'E', 'O'],
    ['A', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'M', 'P'],
  ]

  const PREDEFINED_GRID = targetWords.includes('hashtag') || targetWords.includes('emoji')
    ? SOCIAL_MEDIA_GRID : DEFAULT_GRID

  useEffect(() => { setGrid(PREDEFINED_GRID) }, [])

  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { setGameEnded(true); return 0 }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, gameEnded, timeLeft])

  useEffect(() => {
    if (gameEnded && onComplete) {
      onComplete({ score: foundWords.size, totalWords: targetWords.length, foundWords: Array.from(foundWords) })
    }
  }, [gameEnded])

  const handleCellClick = (row, col) => {
    if (gameEnded) return
    if (!gameStarted) setGameStarted(true)
    const cellKey = `${row}-${col}`
    if (selectedCells.some(c => c.key === cellKey)) return
    if (selectedCells.length > 0) {
      const last = selectedCells[selectedCells.length - 1]
      if (Math.abs(row - last.row) > 1 || Math.abs(col - last.col) > 1) return
    }
    const next = [...selectedCells, { row, col, key: cellKey, letter: grid[row][col] }]
    setSelectedCells(next)
    setCurrentWord(next.map(c => c.letter).join(''))
  }

  const handleSubmitWord = () => {
    const word = currentWord.toLowerCase()
    const matched = targetWords.find(tw => tw.toLowerCase().replace('-', '') === word.replace('-', ''))
    if (matched && !foundWords.has(matched)) {
      const newFound = new Set([...foundWords, matched])
      setFoundWords(newFound)
      setScore(s => s + 1)
      const newCells = new Set(foundWordCells)
      selectedCells.forEach(c => newCells.add(c.key))
      setFoundWordCells(newCells)
      if (newFound.size === targetWords.length) {
        setTimeout(() => setGameEnded(true), 800)
      }
    }
    setSelectedCells([])
    setCurrentWord('')
  }

  const handleClearSelection = () => { setSelectedCells([]); setCurrentWord('') }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  const isSelected = (r, c) => selectedCells.some(cell => cell.row === r && cell.col === c)
  const isFoundCell = (r, c) => foundWordCells.has(`${r}-${c}`)

  if (gameEnded) {
    const allFound = foundWords.size === targetWords.length
    return (
      <Box sx={{ ...clay(allFound ? D.green : D.orange), p: { xs: 3, md: 5 }, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={900} sx={{ color: D.heading, mb: 1 }}>
          {allFound ? 'Congratulations!' : "Time's Up!"}
        </Typography>
        <Typography fontWeight={700} sx={{ color: D.body, mb: 2 }}>
          {allFound
            ? `Perfect! You found all ${targetWords.length} words!`
            : `You found ${foundWords.size} out of ${targetWords.length} words!`}
        </Typography>
        <Box sx={{ display: 'inline-block', px: 3, py: 1, borderRadius: '50px', bgcolor: D.yellow.border, color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>
          Score: {score} / {targetWords.length}
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>

      {/* Header */}
      <Box sx={{ ...clay(D.blue), p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ color: D.heading }}>Wordshake Challenge</Typography>
            <Typography variant="body2" sx={{ color: D.muted }}>Form words by clicking adjacent letters</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <TimerIcon sx={{ color: timeLeft < 30 ? D.red.border : D.blue.border, fontSize: 22 }} />
                <Typography variant="h4" fontWeight={900} sx={{ color: timeLeft < 30 ? D.red.border : D.heading, animation: timeLeft < 10 ? 'pulse 1s infinite' : 'none', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } } }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: D.muted }}>Time Left</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <StarIcon sx={{ color: D.yellow.border, fontSize: 22 }} />
                <Typography variant="h4" fontWeight={900} sx={{ color: D.heading }}>{score}/{targetWords.length}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: D.muted }}>Words Found</Typography>
            </Box>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={targetWords.length > 0 ? (foundWords.size / targetWords.length) * 100 : 0}
          sx={{ height: 8, borderRadius: '6px', bgcolor: D.divider, '& .MuiLinearProgress-bar': { bgcolor: D.green.border, borderRadius: '6px' } }}
        />
      </Box>

      {/* Current word display */}
      {currentWord && (
        <Box sx={{ ...clay(D.teal), p: 2, mb: 2.5, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={900} sx={{ color: D.teal.border, mb: 1.5 }}>
            {currentWord}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box
              component="button"
              onClick={handleSubmitWord}
              sx={{
                ...clay(D.green),
                px: 3, py: 0.75, cursor: 'pointer',
                fontWeight: 800, fontSize: '0.9rem', color: D.green.border,
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Submit Word
            </Box>
            <Box
              component="button"
              onClick={handleClearSelection}
              sx={{
                ...clay(D.red),
                px: 3, py: 0.75, cursor: 'pointer',
                fontWeight: 800, fontSize: '0.9rem', color: D.red.border,
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.red.shadow}` },
              }}
            >
              Clear
            </Box>
          </Box>
        </Box>
      )}

      {/* Letter grid */}
      <Box sx={{ ...clay(D.purple), p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {grid.map((row, rowIndex) => (
            <Box key={rowIndex} sx={{ display: 'flex', gap: 1 }}>
              {row.map((letter, colIndex) => {
                const sel = isSelected(rowIndex, colIndex)
                const found = isFoundCell(rowIndex, colIndex)
                const cellC = sel ? D.blue : found ? D.green : D.cell
                return (
                  <Box
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    sx={{
                      width: { xs: 36, sm: 44 },
                      height: { xs: 36, sm: 44 },
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: cellC.bg,
                      border: `2px solid ${cellC.border}`,
                      borderRadius: '10px',
                      boxShadow: `3px 3px 0 ${cellC.shadow}`,
                      cursor: gameEnded ? 'default' : 'pointer',
                      transition: 'all 0.12s',
                      '&:hover': !gameEnded ? { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${cellC.shadow}` } : {},
                    }}
                  >
                    <Typography fontWeight={900} sx={{ color: sel ? D.blue.border : found ? D.green.border : D.body, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                      {letter}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Target words */}
      <Box sx={{ ...clay(D.orange), p: 2.5 }}>
        <Typography fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
          Target Words ({foundWords.size}/{targetWords.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {targetWords.map((word, i) => {
            const found = foundWords.has(word)
            return (
              <Box
                key={i}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 1.75, py: 0.5, borderRadius: '50px',
                  bgcolor: found ? D.green.bg : D.cardBg,
                  border: `2px solid ${found ? D.green.border : D.divider}`,
                  boxShadow: found ? `3px 3px 0 ${D.green.shadow}` : 'none',
                  opacity: found ? 1 : 0.6,
                  transition: 'all 0.15s',
                }}
              >
                {found && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 16 }} />}
                <Typography fontWeight={found ? 800 : 500} sx={{ color: found ? D.green.border : D.body, fontSize: '0.9rem' }}>
                  {word}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

    </Box>
  )
}

export default WordshakeGame
