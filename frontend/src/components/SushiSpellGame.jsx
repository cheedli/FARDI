import React, { useState, useEffect } from 'react'
import { Box, Typography, LinearProgress, useTheme } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RefreshIcon from '@mui/icons-material/Refresh'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
}

// Tile color palette (clay-friendly solid bg colors)
const TILE_PALETTES = [
  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32', text: '#1B5E20' },
  { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100', text: '#BF360C' },
  { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593', text: '#1A237E' },
  { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0', text: '#0D47A1' },
  { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C', text: '#7F0000' },
  { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064', text: '#004D40' },
  { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17', text: '#5D4037' },
  { bg: '#F3E5F5', border: '#8E24AA', shadow: '#4A148C', text: '#4A148C' },
]

const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const generateLetterGrid = (targetWords) => {
  const uniqueLetters = new Set()
  targetWords.forEach(word => word.toUpperCase().split('').forEach(l => uniqueLetters.add(l)))

  const needed = []
  uniqueLetters.forEach(letter => {
    const max = Math.max(...targetWords.map(word => {
      const m = word.toUpperCase().match(new RegExp(letter, 'g'))
      return m ? m.length : 0
    }))
    for (let i = 0; i < max; i++) needed.push(letter)
  })

  const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  while (needed.length < 30) needed.push(all[Math.floor(Math.random() * all.length)])

  const shuffled = needed.sort(() => Math.random() - 0.5)
  return [shuffled.slice(0, 10), shuffled.slice(10, 20), shuffled.slice(20, 30)]
}

const DEFAULT_TARGET_WORDS = ['persuasive','targeted','creative','dramatisation','goal','obstacles','friction']

export default function SushiSpellGame({ onComplete, targetWords = DEFAULT_TARGET_WORDS }) {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [timeLeft, setTimeLeft] = useState(120)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info') // 'success' | 'error' | 'info'
  const [gameOver, setGameOver] = useState(false)
  const [letterGrid, setLetterGrid] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameOver) {
      const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
      return () => clearTimeout(t)
    } else if (timeLeft === 0 && isPlaying) {
      endGame()
    }
  }, [timeLeft, isPlaying, gameOver])

  const startGame = () => {
    setIsPlaying(true)
    setTimeLeft(120)
    setCurrentWord([])
    setFoundWords([])
    setMessage('Spell the words by clicking the letters!')
    setMessageType('info')
    setGameOver(false)
    setLetterGrid(generateLetterGrid(targetWords))
    setTotalPoints(0)
  }

  const endGame = () => {
    setIsPlaying(false)
    setGameOver(true)
    setMessage(`Time's up! You found ${foundWords.length}/${targetWords.length} words!`)
    setMessageType('info')
    onComplete?.({ foundWords, totalWords: targetWords.length, score: foundWords.length })
  }

  const handleLetterClick = (letter) => {
    if (!isPlaying || gameOver) return
    setCurrentWord(p => [...p, letter])
  }

  const handleClear = () => { setCurrentWord([]); setMessage('') }

  const handleSubmit = () => {
    if (currentWord.length === 0) return
    const word = currentWord.join('').toLowerCase()
    if (targetWords.includes(word)) {
      if (foundWords.includes(word)) {
        setMessage(`"${word}" already found!`)
        setMessageType('error')
      } else {
        const newFound = [...foundWords, word]
        setFoundWords(newFound)
        setTotalPoints(p => p + 1)
        setMessage(`✓ "${word}" is correct! +1 point!`)
        setMessageType('success')
        setCurrentWord([])
        if (newFound.length === targetWords.length) {
          setTimeout(() => endGame(), 600)
        }
      }
    } else {
      setMessage(`"${word}" is not one of the target words. Try again!`)
      setMessageType('error')
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  const getTilePalette = (row, col) => TILE_PALETTES[(row * 10 + col) % TILE_PALETTES.length]
  const progress = (timeLeft / 120) * 100
  const msgColor = messageType === 'success' ? D.green : messageType === 'error' ? D.red : D.blue

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header: timer + score */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ ...clay(timeLeft <= 30 ? D.red : D.orange), p: 1.75, flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ color: timeLeft <= 30 ? D.red.border : D.orange.border, fontSize: 22 }} />
          <Typography fontWeight={800} sx={{ color: D.heading, fontSize: '1.1rem' }}>
            {formatTime(timeLeft)}
          </Typography>
        </Box>
        <Box sx={{ ...clay(D.green), p: 1.75, flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: D.green.border, fontSize: 22 }} />
          <Typography fontWeight={800} sx={{ color: D.heading }}>
            {totalPoints} pt{totalPoints !== 1 ? 's' : ''} · {foundWords.length}/{targetWords.length} words
          </Typography>
        </Box>
      </Box>

      {/* Timer progress bar */}
      {isPlaying && (
        <Box sx={{ mb: 2.5 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8, borderRadius: '6px',
              bgcolor: D.divider,
              '& .MuiLinearProgress-bar': {
                bgcolor: timeLeft <= 30 ? D.red.border : D.orange.border,
                borderRadius: '6px',
              },
            }}
          />
        </Box>
      )}

      {/* Start button */}
      {!isPlaying && !gameOver && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="button"
            onClick={startGame}
            sx={{
              ...clay(D.green),
              px: 5, py: 1.75, cursor: 'pointer',
              fontWeight: 800, fontSize: '1rem', color: D.green.border,
              transition: 'all 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
            }}
          >
            Start Game (2 minutes)
          </Box>
        </Box>
      )}

      {/* Letter grid */}
      {isPlaying && letterGrid.length > 0 && (
        <Box sx={{ ...clay(D.teal), p: 2, mb: 2.5 }}>
          {letterGrid.map((row, rowIdx) => (
            <Box key={rowIdx} sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: rowIdx < 2 ? 1 : 0 }}>
              {row.map((letter, colIdx) => {
                const t = getTilePalette(rowIdx, colIdx)
                return (
                  <Box
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleLetterClick(letter)}
                    sx={{
                      width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 },
                      borderRadius: '12px',
                      bgcolor: t.bg,
                      border: `2px solid ${t.border}`,
                      boxShadow: `3px 3px 0 ${t.shadow}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${t.shadow}` },
                      '&:active': { transform: 'translate(1px,1px)', boxShadow: `2px 2px 0 ${t.shadow}` },
                    }}
                  >
                    <Typography fontWeight={800} sx={{ color: t.text, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                      {letter}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ))}
        </Box>
      )}

      {/* Current word display */}
      {isPlaying && (
        <Box sx={{ ...clay(D.yellow), p: 2, mb: 2, minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {currentWord.length > 0 ? (
            currentWord.map((letter, i) => (
              <Box key={i} sx={{
                width: 40, height: 40, borderRadius: '10px',
                bgcolor: D.cardBg, border: `2px solid ${D.yellow.border}`,
                boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography fontWeight={800} sx={{ color: D.heading }}>{letter}</Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: D.muted, fontSize: '0.9rem' }}>Click letters to spell a word…</Typography>
          )}
        </Box>
      )}

      {/* Action buttons */}
      {isPlaying && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={currentWord.length === 0}
            sx={{
              ...clay(currentWord.length > 0 ? D.green : { bg: D.divider, border: D.divider, shadow: D.divider }),
              flex: 1, py: 1.25, cursor: currentWord.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 800, fontSize: '0.95rem',
              color: currentWord.length > 0 ? D.green.border : D.muted,
              transition: 'all 0.15s',
              '&:hover': currentWord.length > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` } : {},
            }}
          >
            Submit ✓
          </Box>
          <Box
            component="button"
            onClick={handleClear}
            sx={{
              ...clay(D.orange),
              flex: 1, py: 1.25, cursor: 'pointer',
              fontWeight: 800, fontSize: '0.95rem', color: D.orange.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
              transition: 'all 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.orange.shadow}` },
            }}
          >
            <RefreshIcon sx={{ fontSize: 18 }} /> Clear
          </Box>
        </Box>
      )}

      {/* Message */}
      {message && (
        <Box sx={{ ...clay(msgColor), px: 2.5, py: 1.25, mb: 2 }}>
          <Typography fontWeight={700} sx={{ color: msgColor.border, fontSize: '0.9rem' }}>
            {message}
          </Typography>
        </Box>
      )}

      {/* Found words */}
      {foundWords.length > 0 && (
        <Box sx={{ ...clay(D.green), p: 2, mb: 2 }}>
          <Typography fontWeight={800} sx={{ color: D.green.border, mb: 1, fontSize: '0.9rem' }}>
            <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} />
            Words found ({foundWords.length}/{targetWords.length}):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {foundWords.map((word, i) => (
              <Box key={i} sx={{
                px: 1.5, py: 0.4, borderRadius: '50px',
                bgcolor: D.green.border, color: '#fff',
                fontWeight: 800, fontSize: '0.8rem',
              }}>
                {word}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Game over summary */}
      {gameOver && (
        <Box sx={{ ...clay(D.purple), p: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={900} sx={{ color: D.purple.border, mb: 1 }}>
            Game Complete!
          </Typography>
          <Typography fontWeight={700} sx={{ color: D.body, mb: 2 }}>
            You found {foundWords.length} out of {targetWords.length} words!
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2.5 }}>
            {foundWords.map((word, i) => (
              <Box key={i} sx={{
                px: 1.5, py: 0.4, borderRadius: '50px',
                bgcolor: D.green.border, color: '#fff',
                fontWeight: 800, fontSize: '0.8rem',
              }}>
                {word}
              </Box>
            ))}
          </Box>
          <Box
            component="button"
            onClick={startGame}
            sx={{
              ...clay(D.blue),
              px: 4, py: 1.25, cursor: 'pointer',
              fontWeight: 800, color: D.blue.border, fontSize: '0.95rem',
              transition: 'all 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
            }}
          >
            Play Again
          </Box>
        </Box>
      )}
    </Box>
  )
}
