import { useState, useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const LIGHT = {
  cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
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

const DragDropGapFill = ({ wordBank = [], sentences = [], answers = {}, onComplete, startIndex = 0 }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [placedWords, setPlacedWords] = useState({})
  const [draggedWord, setDraggedWord] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(new Set())
  const [shuffledWordBank, setShuffledWordBank] = useState([])

  useEffect(() => {
    setShuffledWordBank([...wordBank].sort(() => Math.random() - 0.5))
  }, [wordBank])

  const handleDragStart = (e, word) => {
    setDraggedWord(word)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const handleDrop = (e, gapId) => {
    e.preventDefault()
    if (!draggedWord || submitted) return
    setPlacedWords(prev => ({ ...prev, [gapId]: draggedWord }))
    setDraggedWord(null)
  }
  const handleRemoveWord = (gapId) => {
    if (submitted) return
    setPlacedWords(prev => { const u = { ...prev }; delete u[gapId]; return u })
  }
  const handleSubmit = () => {
    const correct = new Set()
    let score = 0
    Object.entries(placedWords).forEach(([gapId, word]) => {
      if (word.toLowerCase() === (answers[gapId] || '').toLowerCase()) { correct.add(gapId); score++ }
    })
    setCorrectAnswers(correct)
    setSubmitted(true)
    onComplete?.({ score, total: Object.keys(answers).length, placedWords, correctAnswers: correct })
  }

  const isWordUsed = (word) => Object.values(placedWords).includes(word)
  const isCorrect = (gapId) => submitted && correctAnswers.has(gapId)
  const isIncorrect = (gapId) => submitted && placedWords[gapId] && !correctAnswers.has(gapId)
  const allGapsFilled = Object.keys(answers).every(gapId => placedWords[gapId])

  const renderSentence = (sentence, index) => {
    const gapId = `g_${startIndex + index}_0`
    const placedWord = placedWords[gapId]
    const correct = isCorrect(gapId)
    const incorrect = isIncorrect(gapId)
    const parts = sentence.split('___')
    const rowC = submitted ? (correct ? D.green : incorrect ? D.red : { bg: D.cardBg, border: D.divider, shadow: D.divider }) : { bg: D.cardBg, border: D.divider, shadow: D.divider }

    return (
      <Box key={gapId} sx={{ ...clay(rowC), p: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {parts[0] && <Typography variant="h6" sx={{ color: D.body }}>{parts[0]}</Typography>}

          {/* Drop zone */}
          <Box
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, gapId)}
            onClick={() => placedWord && handleRemoveWord(gapId)}
            sx={{
              minWidth: 140, minHeight: 44, px: 2, py: 0.75,
              borderRadius: '12px',
              bgcolor: placedWord ? (submitted ? (correct ? D.green.bg : D.red.bg) : D.blue.bg) : 'transparent',
              border: `2px ${placedWord ? 'solid' : 'dashed'}`,
              borderColor: submitted ? (correct ? D.green.border : incorrect ? D.red.border : D.muted) : placedWord ? D.blue.border : D.muted,
              boxShadow: placedWord ? `3px 3px 0 ${submitted ? (correct ? D.green.shadow : D.red.shadow) : D.blue.shadow}` : 'none',
              cursor: placedWord && !submitted ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              '&:hover': placedWord && !submitted ? { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${D.blue.shadow}` } : {},
            }}
          >
            {placedWord ? (
              <Typography fontWeight={800} sx={{ color: submitted ? (correct ? D.green.border : D.red.border) : D.blue.border }}>
                {placedWord}
              </Typography>
            ) : (
              <Typography sx={{ fontStyle: 'italic', fontSize: '0.85rem', color: D.muted }}>Drop here</Typography>
            )}
          </Box>

          {parts[1] && <Typography variant="h6" sx={{ color: D.body }}>{parts[1]}</Typography>}

          {submitted && (correct
            ? <CheckCircleIcon sx={{ color: D.green.border, fontSize: 28 }} />
            : incorrect ? <CancelIcon sx={{ color: D.red.border, fontSize: 28 }} /> : null)}
        </Box>

        {submitted && incorrect && (
          <Box sx={{ ...clay(D.red), p: 1.5, mt: 1.5 }}>
            <Typography variant="body2" sx={{ color: D.red.border }}>
              Correct answer: <strong>{answers[gapId]}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>

      {/* Word bank */}
      <Box sx={{ ...clay(D.blue), p: 2.5, mb: 2.5 }}>
        <Typography fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
          Word Bank — Drag words to fill the gaps:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {shuffledWordBank.map((word, i) => {
            const used = isWordUsed(word)
            return (
              <Box
                key={i}
                draggable={!used && !submitted}
                onDragStart={(e) => handleDragStart(e, word)}
                sx={{
                  px: 2, py: 0.75, borderRadius: '12px',
                  bgcolor: used ? D.divider : D.cardBg,
                  border: `2px solid ${used ? D.divider : D.blue.border}`,
                  boxShadow: used ? 'none' : `3px 3px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.9rem',
                  color: used ? D.muted : D.blue.border,
                  cursor: used || submitted ? 'not-allowed' : 'grab',
                  opacity: used ? 0.45 : 1,
                  transition: 'all 0.15s',
                  '&:hover': !used && !submitted ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${D.blue.shadow}` } : {},
                  '&:active': !used && !submitted ? { cursor: 'grabbing' } : {},
                }}
              >
                {word}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Instructions */}
      <Box sx={{ ...clay(D.teal), px: 2.5, py: 1.25, mb: 2.5, textAlign: 'center' }}>
        <Typography fontWeight={700} sx={{ color: D.heading, fontSize: '0.9rem' }}>
          🖱️ Drag words from the word bank to the gaps. Click a placed word to remove it.
        </Typography>
      </Box>

      {/* Sentences */}
      <Box>{sentences.map((s, i) => renderSentence(s, i))}</Box>

      {/* Submit */}
      {!submitted && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allGapsFilled}
            sx={{
              ...clay(allGapsFilled ? D.green : { bg: D.divider, border: D.divider, shadow: D.divider }),
              px: 4, py: 1.25, cursor: allGapsFilled ? 'pointer' : 'not-allowed',
              fontWeight: 800, fontSize: '0.95rem',
              color: allGapsFilled ? D.green.border : D.muted,
              transition: 'all 0.15s',
              '&:hover': allGapsFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` } : {},
            }}
          >
            Submit Answers
          </Box>
          {!allGapsFilled && (
            <Typography variant="body2" sx={{ color: D.muted, mt: 1 }}>Fill all gaps before submitting</Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default DragDropGapFill
