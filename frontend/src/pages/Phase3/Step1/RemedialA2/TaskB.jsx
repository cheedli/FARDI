import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useProgressSave } from '../../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

const PAIRS = [
  { id: 1, word: 'sponsor', definition: 'A company or person who gives money to support an event' },
  { id: 2, word: 'budget',  definition: 'A plan that shows how much money you have and how to spend it' },
  { id: 3, word: 'ticket',  definition: 'A piece of paper that allows you to enter an event' },
  { id: 4, word: 'income',  definition: 'Money that comes in from sales or sponsorship' },
]

export default function Phase3RemedialA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 2, context: 'remedial_a2' })
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [showResults, setShowResults] = useState(false)

  const usedWords = Object.values(matches)

  const handleWordClick = (word) => {
    if (showResults) return
    setSelectedWord(selectedWord === word ? null : word)
  }

  const handleDefinitionClick = (defId) => {
    if (showResults) return
    if (selectedWord) {
      setMatches(prev => ({ ...prev, [defId]: selectedWord }))
      setSelectedWord(null)
    } else if (matches[defId]) {
      setMatches(prev => {
        const next = { ...prev }
        delete next[defId]
        return next
      })
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = PAIRS.filter(p => matches[p.id] === p.word).length
    logTaskCompletion(score)
  }

  const handleReset = () => {
    setMatches({})
    setSelectedWord(null)
    setShowResults(false)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'B', score, max_score: PAIRS.length, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const score = showResults ? PAIRS.filter(p => matches[p.id] === p.word).length : 0
  const allMatched = Object.keys(matches).length === PAIRS.length
  const allCorrect = score === PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level A2 — Task B: Word Matching
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="EMNA" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Emna
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Match each financial word to its correct definition. Click a word on the left, then click its matching definition on the right!
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.teal.border, mb: 0.5 }}>
              Instructions
            </Typography>
            <Typography variant="body2" sx={{ color: D.body }}>
              Click a word from the left column, then click the matching definition. Click a filled definition to remove the match.
            </Typography>
          </Box>
        </motion.div>

        {/* Selected word indicator */}
        {selectedWord && !showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ ...clay(D.blue), p: 1.5, mb: 2 }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: D.blue.border }}>
                Selected: <Box component="span" fontWeight={800}>"{selectedWord}"</Box> — now click a definition to match it
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Matching Interface */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Words column */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, textAlign: 'center', mb: 1.5 }}>
                Words
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {PAIRS.map(pair => {
                  const used = usedWords.includes(pair.word)
                  const isSelected = selectedWord === pair.word
                  const c = isSelected ? D.blue : used ? D.green : { bg: D.cardBg, border: D.divider, shadow: D.divider }
                  return (
                    <Box
                      key={pair.id}
                      component="button"
                      onClick={() => !used && handleWordClick(pair.word)}
                      sx={{
                        ...clay(c),
                        p: 1.5, cursor: (used || showResults) ? 'default' : 'pointer',
                        opacity: used && !showResults ? 0.7 : 1,
                        fontWeight: 800, fontSize: '1rem', color: D.heading,
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: (used || showResults) ? 'none' : 'translate(-1px,-1px)' },
                      }}
                    >
                      {pair.word}
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {/* Definitions column */}
            <Box sx={{ flex: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, textAlign: 'center', mb: 1.5 }}>
                Definitions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {PAIRS.map(pair => {
                  const matchedWord = matches[pair.id]
                  const isCorrect = showResults && matchedWord === pair.word
                  const isWrong = showResults && matchedWord && matchedWord !== pair.word
                  const c = isCorrect ? D.green : isWrong ? D.red : matchedWord ? D.purple : { bg: D.cardBg, border: D.divider, shadow: D.divider }
                  return (
                    <Box
                      key={pair.id}
                      component="button"
                      onClick={() => handleDefinitionClick(pair.id)}
                      sx={{
                        ...clay(c),
                        p: 2, cursor: showResults ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1,
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: showResults ? 'none' : 'translate(-1px,-1px)' },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        {matchedWord && (
                          <Box sx={{
                            display: 'inline-block', mb: 0.5,
                            px: 1.25, py: 0.3, borderRadius: '50px',
                            bgcolor: isCorrect ? D.green.border : isWrong ? D.red.border : D.purple.border,
                            fontSize: '0.75rem', fontWeight: 800, color: '#fff',
                          }}>
                            {matchedWord}
                          </Box>
                        )}
                        <Typography variant="body2" sx={{ color: D.body, display: 'block' }}>{pair.definition}</Typography>
                        {showResults && isWrong && (
                          <Typography variant="caption" fontWeight={800} sx={{ color: D.green.border }}>
                            Correct: {pair.word}
                          </Typography>
                        )}
                      </Box>
                      {showResults && (isCorrect
                        ? <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20, flexShrink: 0 }} />
                        : isWrong
                          ? <CancelIcon sx={{ color: D.red.border, fontSize: 20, flexShrink: 0 }} />
                          : null
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ ...clay(allCorrect ? D.green : D.orange), p: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={700} sx={{ color: allCorrect ? D.green.border : D.orange.border }}>
                Score: {score} / {PAIRS.length} — {allCorrect ? 'Perfect! You matched all words correctly!' : 'Review the correct answers above and try again.'}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!showResults ? (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allMatched}
                sx={{
                  px: 3, py: 1.25,
                  bgcolor: D.blue.bg, color: D.blue.border,
                  border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  opacity: !allMatched ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: !allMatched ? 'none' : 'translate(-2px,-2px)', boxShadow: !allMatched ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit Answers
              </Box>
            </motion.div>
          ) : (
            <>
              {!allCorrect && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                  <Box
                    component="button"
                    onClick={handleReset}
                    sx={{
                      px: 3, py: 1.25,
                      bgcolor: D.orange.bg, color: D.orange.border,
                      border: `2px solid ${D.orange.border}`,
                      borderRadius: '14px',
                      boxShadow: `4px 4px 0 ${D.orange.shadow}`,
                      fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.orange.shadow}` },
                    }}
                  >
                    Try Again
                  </Box>
                </motion.div>
              )}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
                <Box
                  component="button"
                  onClick={() => navigate('/phase3/step/1/remedial/a2/taskC')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 3, py: 1.25,
                    bgcolor: D.green.bg, color: D.green.border,
                    border: `2px solid ${D.green.border}`,
                    borderRadius: '14px',
                    boxShadow: `4px 4px 0 ${D.green.shadow}`,
                    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  }}
                >
                  Next Task
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </motion.div>
            </>
          )}
        </Box>

      </Container>
    </Box>
  )
}
