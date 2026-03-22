import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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

const SENTENCES = [
  { id: 1, words: ['needs', 'The', 'event', 'a', 'sponsor'], correct: ['The', 'event', 'needs', 'a', 'sponsor'], answer: 'The event needs a sponsor.' },
  { id: 2, words: ['shows', 'budget', 'The', 'our', 'spending'], correct: ['The', 'budget', 'shows', 'our', 'spending'], answer: 'The budget shows our spending.' },
  { id: 3, words: ['sell', 'We', 'to', 'tickets', 'money', 'raise'], correct: ['We', 'sell', 'tickets', 'to', 'raise', 'money'], answer: 'We sell tickets to raise money.' },
]

export default function Phase3RemedialA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 3, context: 'remedial_a2' })
  const [arrangements, setArrangements] = useState(() =>
    SENTENCES.reduce((acc, s) => ({ ...acc, [s.id]: [] }), {})
  )
  const [banks, setBanks] = useState(() =>
    SENTENCES.reduce((acc, s) => {
      const shuffled = [...s.words].sort(() => Math.random() - 0.5)
      return { ...acc, [s.id]: shuffled }
    }, {})
  )
  const [showResults, setShowResults] = useState(false)

  const handleWordClick = (sentenceId, word, fromBank) => {
    if (showResults) return
    if (fromBank) {
      setBanks(prev => {
        const arr = [...prev[sentenceId]]
        const idx = arr.indexOf(word)
        arr.splice(idx, 1)
        return { ...prev, [sentenceId]: arr }
      })
      setArrangements(prev => ({ ...prev, [sentenceId]: [...prev[sentenceId], word] }))
    } else {
      setArrangements(prev => {
        const arr = [...prev[sentenceId]]
        const idx = arr.lastIndexOf(word)
        arr.splice(idx, 1)
        return { ...prev, [sentenceId]: arr }
      })
      setBanks(prev => ({ ...prev, [sentenceId]: [...prev[sentenceId], word] }))
    }
  }

  const checkCorrect = (sentenceId) => {
    const sentence = SENTENCES.find(s => s.id === sentenceId)
    const arr = arrangements[sentenceId]
    return arr.length === sentence.correct.length && arr.every((w, i) => w === sentence.correct[i])
  }

  const allComplete = SENTENCES.every(s => arrangements[s.id].length === s.words.length)

  const handleSubmit = () => {
    setShowResults(true)
    const score = SENTENCES.filter(s => checkCorrect(s.id)).length
    logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'C', score, max_score: SENTENCES.length, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const score = showResults ? SENTENCES.filter(s => checkCorrect(s.id)).length : 0
  const allCorrect = score === SENTENCES.length

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
                Level A2 — Task C: Sentence Ordering
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
                  Put the words in the correct order to make a sentence! Click words from the top to build your sentence, then click placed words to return them.
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
              Click words from the word bank to place them in order. Click a placed word to return it.
            </Typography>
          </Box>
        </motion.div>

        {/* Sentences */}
        <Box sx={{ mb: 4 }}>
          {SENTENCES.map((sentence, index) => {
            const isCorrect = showResults && checkCorrect(sentence.id)
            const isWrong = showResults && !checkCorrect(sentence.id)
            const c = isCorrect ? D.green : isWrong ? D.red : { bg: D.cardBg, border: D.divider, shadow: D.divider }
            return (
              <motion.div key={sentence.id} variants={fadeUp} initial="hidden" animate="visible" custom={3 + index}>
                <Box sx={{ ...clay(c), p: { xs: 2, md: 2.5 }, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.muted, mb: 1.5 }}>
                    Sentence {index + 1}
                  </Typography>

                  {/* Word Bank */}
                  <Typography variant="caption" fontWeight={700} sx={{ color: D.muted, display: 'block', mb: 0.75 }}>
                    Word bank (click to add):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2, minHeight: 40, p: 1, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                    {banks[sentence.id].map((word, i) => (
                      <Box
                        key={`bank-${i}`}
                        component="button"
                        onClick={() => handleWordClick(sentence.id, word, true)}
                        sx={{
                          px: 1.5, py: 0.5, borderRadius: '10px',
                          bgcolor: D.cardBg, border: `1px solid ${D.divider}`,
                          fontWeight: 700, fontSize: '0.85rem', color: D.body,
                          cursor: showResults ? 'default' : 'pointer',
                          transition: 'all 0.12s ease',
                          '&:hover': { transform: showResults ? 'none' : 'translate(-1px,-1px)' },
                        }}
                      >
                        {word}
                      </Box>
                    ))}
                    {banks[sentence.id].length === 0 && (
                      <Typography variant="caption" sx={{ color: D.muted, alignSelf: 'center' }}>Empty</Typography>
                    )}
                  </Box>

                  {/* Arrangement area */}
                  <Typography variant="caption" fontWeight={700} sx={{ color: D.muted, display: 'block', mb: 0.75 }}>
                    Your sentence (click to remove):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, minHeight: 44, p: 1.5, borderRadius: '12px', border: `2px dashed ${D.divider}`, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                    {arrangements[sentence.id].map((word, i) => (
                      <Box
                        key={`arr-${i}`}
                        component="button"
                        onClick={() => handleWordClick(sentence.id, word, false)}
                        sx={{
                          px: 1.5, py: 0.5, borderRadius: '10px',
                          bgcolor: isCorrect ? D.green.bg : isWrong ? D.red.bg : D.blue.bg,
                          border: `1px solid ${isCorrect ? D.green.border : isWrong ? D.red.border : D.blue.border}`,
                          fontWeight: 700, fontSize: '0.85rem',
                          color: isCorrect ? D.green.border : isWrong ? D.red.border : D.blue.border,
                          cursor: showResults ? 'default' : 'pointer',
                          transition: 'all 0.12s ease',
                          '&:hover': { transform: showResults ? 'none' : 'translate(-1px,-1px)' },
                        }}
                      >
                        {word}
                      </Box>
                    ))}
                    {arrangements[sentence.id].length === 0 && (
                      <Typography variant="caption" sx={{ color: D.muted, alignSelf: 'center' }}>Click words above to build your sentence</Typography>
                    )}
                  </Box>

                  {showResults && (
                    <Box sx={{ mt: 1.5, p: 1.25, borderRadius: '10px', bgcolor: isCorrect ? D.green.bg : D.red.bg, border: `1px solid ${isCorrect ? D.green.border : D.red.border}` }}>
                      {isCorrect ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircleIcon sx={{ color: D.green.border, fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={700} sx={{ color: D.green.border }}>Correct!</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" fontWeight={700} sx={{ color: D.red.border }}>
                          Correct answer: {sentence.answer}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Score summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{ ...clay(allCorrect ? D.green : D.blue), p: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={700} sx={{ color: allCorrect ? D.green.border : D.blue.border }}>
                Score: {score} / {SENTENCES.length}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!showResults ? (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allComplete}
                sx={{
                  px: 3, py: 1.25,
                  bgcolor: D.blue.bg, color: D.blue.border,
                  border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  opacity: !allComplete ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: !allComplete ? 'none' : 'translate(-2px,-2px)', boxShadow: !allComplete ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit Answers
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
              <Box
                component="button"
                onClick={() => navigate('/phase3/step/1/remedial/a2/taskD')}
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
          )}
        </Box>

      </Container>
    </Box>
  )
}
