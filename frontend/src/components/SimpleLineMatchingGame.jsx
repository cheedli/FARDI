import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import RefreshIcon from '@mui/icons-material/Refresh'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
}

const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const SimpleLineMatchingGame = ({ pairs = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledExamples, setShuffledExamples] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({})
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const canvasRef = useRef(null)
  const termsRef = useRef({})
  const examplesRef = useRef({})

  const shuffleArray = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  useEffect(() => {
    if (pairs.length > 0) {
      setShuffledTerms(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
      setShuffledExamples(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
    }
  }, [pairs])

  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const t = setInterval(() => setTimeElapsed(p => p + 1), 1000)
      return () => clearInterval(t)
    }
  }, [gameStarted, gameComplete])

  useEffect(() => { drawLines() }, [matches, shuffledTerms, shuffledExamples, D])

  const drawLines = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Object.entries(matches).forEach(([termId, exampleId]) => {
      const termEl = termsRef.current[termId]
      const exampleEl = examplesRef.current[exampleId]
      if (!termEl || !exampleEl) return
      const tR = termEl.getBoundingClientRect()
      const eR = exampleEl.getBoundingClientRect()
      const cR = canvas.getBoundingClientRect()
      const x1 = tR.right - cR.left
      const y1 = tR.top + tR.height / 2 - cR.top
      const x2 = eR.left - cR.left
      const y2 = eR.top + eR.height / 2 - cR.top

      ctx.strokeStyle = D.blue.border
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      // Curved bezier line
      const mx = (x1 + x2) / 2
      ctx.moveTo(x1, y1)
      ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2)
      ctx.stroke()
    })
  }

  const handleTermClick = (term) => {
    if (gameComplete) return
    if (!gameStarted) setGameStarted(true)
    setSelectedTerm(prev => prev?.id === term.id ? null : term)
  }

  const handleExampleClick = (example) => {
    if (gameComplete || !selectedTerm) return
    if (!gameStarted) setGameStarted(true)

    const newMatches = { ...matches, [selectedTerm.id]: example.id }
    setMatches(newMatches)
    setSelectedTerm(null)

    if (Object.keys(newMatches).length === pairs.length) {
      let correct = 0
      Object.entries(newMatches).forEach(([tId, eId]) => {
        if (parseInt(tId) === parseInt(eId)) correct++
      })
      setTimeout(() => {
        setGameComplete(true)
        onComplete?.({ score: correct, totalPairs: pairs.length, timeElapsed, completed: true })
      }, 400)
    }
  }

  const handleReset = () => {
    setMatches({})
    setSelectedTerm(null)
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const matchedCount = Object.keys(matches).length
  const progress = pairs.length > 0 ? (matchedCount / pairs.length) * 100 : 0

  return (
    <Box sx={{ width: '100%' }}>

      {/* Timer / progress bar */}
      <Box sx={{ ...clay(D.blue), p: 2, mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon sx={{ color: D.blue.border, fontSize: 22 }} />
          <Typography fontWeight={800} sx={{ color: D.heading, fontSize: '1.1rem' }}>
            {formatTime(timeElapsed)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />
          <Typography fontWeight={700} sx={{ color: D.heading }}>
            Matched: {matchedCount} / {pairs.length}
          </Typography>
        </Box>

        <Box
          component="button"
          onClick={handleReset}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            px: 1.5, py: 0.5, borderRadius: '10px',
            bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`,
            boxShadow: `3px 3px 0 ${D.orange.shadow}`,
            color: D.orange.border, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
            transition: 'all 0.12s',
            '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${D.orange.shadow}` },
          }}
        >
          <RefreshIcon sx={{ fontSize: 16 }} /> Reset
        </Box>

        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8, borderRadius: '6px',
              bgcolor: D.divider,
              '& .MuiLinearProgress-bar': { bgcolor: D.blue.border, borderRadius: '6px' },
            }}
          />
        </Box>
      </Box>

      {/* Instructions */}
      <Box sx={{ ...clay(D.teal), px: 2.5, py: 1.25, mb: 2.5, textAlign: 'center' }}>
        <Typography fontWeight={700} sx={{ color: D.heading, fontSize: '0.9rem' }}>
          👆 Click a term on the left, then click its matching example on the right to draw a line
        </Typography>
      </Box>

      {/* Matching area */}
      <Box sx={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
        />

        <Box sx={{ display: 'flex', gap: 3, position: 'relative', zIndex: 2 }}>
          {/* Terms */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ ...clay(D.purple), p: 2 }}>
              <Typography fontWeight={800} textAlign="center" sx={{ color: D.purple.border, mb: 1.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                Terms
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {shuffledTerms.map((item) => {
                  const isMatched = matches[item.id] !== undefined
                  const isSelected = selectedTerm?.id === item.id
                  const c = isSelected ? D.blue : isMatched ? D.green : { bg: D.cardBg, border: D.divider, shadow: D.divider }
                  return (
                    <Box
                      key={`term-${item.id}`}
                      ref={(el) => (termsRef.current[item.id] = el)}
                      onClick={() => handleTermClick(item)}
                      sx={{
                        ...clay(c),
                        p: 1.5, cursor: isMatched ? 'default' : 'pointer',
                        opacity: isMatched ? 0.7 : 1,
                        transition: 'all 0.15s',
                        '&:hover': !isMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } : {},
                      }}
                    >
                      <Typography fontWeight={800} sx={{ color: isSelected ? D.blue.border : isMatched ? D.green.border : D.heading }}>
                        {item.term}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>

          {/* Examples */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ ...clay(D.teal), p: 2 }}>
              <Typography fontWeight={800} textAlign="center" sx={{ color: D.teal.border, mb: 1.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                Examples
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {shuffledExamples.map((item) => {
                  const isMatched = Object.values(matches).includes(item.id)
                  const c = isMatched ? D.green : selectedTerm ? D.orange : { bg: D.cardBg, border: D.divider, shadow: D.divider }
                  return (
                    <Box
                      key={`example-${item.id}`}
                      ref={(el) => (examplesRef.current[item.id] = el)}
                      onClick={() => handleExampleClick(item)}
                      sx={{
                        ...clay(c),
                        p: 1.5, cursor: selectedTerm && !isMatched ? 'pointer' : 'default',
                        opacity: isMatched ? 0.7 : 1,
                        transition: 'all 0.15s',
                        '&:hover': selectedTerm && !isMatched ? { transform: 'translate(2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } : {},
                      }}
                    >
                      <Typography sx={{ color: isMatched ? D.green.border : D.body }}>
                        {item.example}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SimpleLineMatchingGame
