import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Interaction 1: Guided Explanation (Teacher Modeling)
 * Task Type: Noticing & Explanation
 * Students underline the reason in cause-effect sentences
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

const SENTENCES = [
  { id: 1, fullSentence: "We need a sponsor because the stage and sound system are expensive.", reason: "because the stage and sound system are expensive", explanation: "This part explains WHY they need a sponsor - the reason is that the equipment costs a lot of money." },
  { id: 2, fullSentence: "The budget has many expenses so we must find sponsors.", reason: "The budget has many expenses", explanation: "This is the REASON (cause) that leads to the result of finding sponsors." },
  { id: 3, fullSentence: "We sell tickets because we need income for the event.", reason: "because we need income for the event", explanation: "This explains WHY they sell tickets - the reason is they need money." },
  { id: 4, fullSentence: "The venue is expensive so ticket sales alone are not enough.", reason: "The venue is expensive", explanation: "This is the CAUSE that makes ticket sales insufficient - the high venue cost." },
  { id: 5, fullSentence: "We need careful planning because our budget is limited.", reason: "because our budget is limited", explanation: "This explains WHY planning is needed - the reason is the limited budget." },
  { id: 6, fullSentence: "Sponsors help the festival so we can afford better equipment.", reason: "Sponsors help the festival", explanation: "This is the CAUSE that allows better equipment - sponsor support." },
  { id: 7, fullSentence: "We create a budget because we need to control our spending.", reason: "because we need to control our spending", explanation: "This explains WHY we create a budget - to manage expenses." },
  { id: 8, fullSentence: "Ticket prices are low so many students can attend.", reason: "Ticket prices are low", explanation: "This is the CAUSE that allows many students to attend - affordable prices." },
]

export default function Phase3Step3Interaction1() {
  const navigate = useNavigate()
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'main' })
  const muiTheme = useTheme()
  const dark = muiTheme.palette.mode === 'dark'

  const D = dark
    ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
    : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }

  const C = dark
    ? {
        green:  { bg: '#1B2E1B', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#0D1B2A', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#F9A825', text: '#FFD54F' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#2A0A0A', border: '#C62828', shadow: '#C62828' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
      }

  const [selectedText, setSelectedText] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (c) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    p: 2.5,
  })

  const handleTextSelection = (sentenceId) => {
    const selection = window.getSelection()
    const selectedStr = selection.toString().trim()
    if (selectedStr && !showResults) {
      setSelectedText({ ...selectedText, [sentenceId]: selectedStr })
    }
  }

  const checkIfReasonSelected = (userSelection, correctReason) => {
    const normalize = (str) => str.toLowerCase().replace(/[.,!?]/g, '').trim()
    const userNorm = normalize(userSelection)
    const correctNorm = normalize(correctReason)
    return userNorm.includes(correctNorm) || correctNorm.includes(userNorm)
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      const userSelection = selectedText[sentence.id] || ''
      if (checkIfReasonSelected(userSelection, sentence.reason)) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase3_step3_int1_score', correctCount.toString())
    sessionStorage.setItem('phase3_step3_int1_max', SENTENCES.length.toString())
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 3, interaction: 1, score: score, max_score: maxScore, time_taken: 0, completed: true })
      })
    } catch (error) { console.error('Failed to log interaction:', error) }
  }

  const handleContinue = () => { navigate('/phase3/step/3/interaction/2') }

  useEffect(() => { window.__remedialSkip = handleContinue }, [])

  const allSentencesAttempted = Object.keys(selectedText).length === SENTENCES.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.green), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.green.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Interaction 1
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Guided Explanation</Typography>
            <Typography sx={{ color: D.muted }}>Underline the reason in each sentence</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's practice identifying the REASON in cause-effect sentences. For each sentence below, use your mouse to select (underline) the part that explains WHY or shows the CAUSE. Look for phrases with 'because' or the part before 'so' that explains the reason."
            />
          </Box>
        </motion.div>

        {/* Example */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>Example:</Typography>
            <Box sx={{ bgcolor: D.cardBg, borderRadius: '12px', p: 2, mb: 1.5 }}>
              <Typography sx={{ color: D.body, fontSize: '1rem' }}>
                We need a sponsor{' '}
                <Box component="span" sx={{ bgcolor: '#FFF176', color: '#5D4037', fontWeight: 800, px: 0.5, borderRadius: '4px' }}>
                  because the stage and sound system are expensive
                </Box>
                .
              </Typography>
            </Box>
            <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>
              The highlighted part is the <strong>reason</strong> — it explains WHY they need a sponsor.
            </Typography>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...cardSx(C.yellow), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Instructions:</Typography>
            {['Read each sentence carefully', 'Use your mouse to select (highlight) the part that shows the REASON or CAUSE', 'Your selection will be saved automatically'].map((t, i) => (
              <Typography key={i} sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>• {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Progress */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, fontSize: '1.05rem' }}>
                Sentences Completed: {Object.keys(selectedText).length}/{SENTENCES.length}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Sentences */}
        <Box sx={{ mb: 4 }}>
          {SENTENCES.map((sentence, index) => {
            const userSelection = selectedText[sentence.id] || ''
            const isCorrect = showResults && checkIfReasonSelected(userSelection, sentence.reason)
            const hasSelection = userSelection.length > 0
            const c = showResults ? (isCorrect ? C.green : C.red) : hasSelection ? C.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={sentence.id} variants={fadeUp} initial="hidden" animate="visible" custom={5 + index * 0.5}>
                <Box sx={{ ...cardSx(c), mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ px: 1.5, py: 0.3, borderRadius: '50px', bgcolor: c.border, color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                      Sentence {index + 1}
                    </Box>
                    {showResults && (isCorrect
                      ? <CheckCircleIcon sx={{ color: C.green.border, fontSize: 28 }} />
                      : <CancelIcon sx={{ color: C.red.border, fontSize: 28 }} />
                    )}
                  </Box>

                  {/* Sentence text */}
                  <Box
                    sx={{
                      bgcolor: D.cardBg,
                      border: `2px solid ${hasSelection ? C.blue.border : D.divider}`,
                      borderRadius: '12px',
                      p: 2.5,
                      mb: 2,
                      cursor: showResults ? 'default' : 'text',
                      userSelect: showResults ? 'none' : 'text',
                    }}
                    onMouseUp={() => !showResults && handleTextSelection(sentence.id)}
                  >
                    <Typography sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: D.body }}>
                      {sentence.fullSentence}
                    </Typography>
                  </Box>

                  {/* User selection */}
                  {hasSelection && (
                    <Box sx={{ bgcolor: showResults ? (isCorrect ? C.green.bg : C.red.bg) : C.blue.bg, border: `1px solid ${showResults ? (isCorrect ? C.green.border : C.red.border) : C.blue.border}`, borderRadius: '10px', p: 1.5, mb: 1.5 }}>
                      <Typography sx={{ color: D.body, fontSize: '0.88rem' }}>
                        <strong>You selected:</strong> "{userSelection}"
                      </Typography>
                    </Box>
                  )}

                  {/* Hint before results */}
                  {!showResults && !hasSelection && (
                    <Box sx={{ bgcolor: C.yellow.bg, border: `1px solid ${C.yellow.border}`, borderRadius: '10px', p: 1.5 }}>
                      <Typography sx={{ color: D.body, fontSize: '0.85rem' }}>
                        Select text above with your mouse, then it will be saved automatically
                      </Typography>
                    </Box>
                  )}

                  {/* Correct answer after submission */}
                  {showResults && (
                    <Box sx={{ bgcolor: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: '10px', p: 1.5, mt: 1 }}>
                      <Typography sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>
                        <strong>Correct reason:</strong> "{sentence.reason}"
                      </Typography>
                      <Typography sx={{ color: D.muted, fontSize: '0.85rem', fontStyle: 'italic' }}>
                        {sentence.explanation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Overall Results */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Box sx={{ ...cardSx(score >= 6 ? C.green : C.yellow), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Results</Typography>
              <Typography sx={{ color: D.body, mb: 0.5 }}><strong>Score:</strong> {score}/{SENTENCES.length} correct</Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.9rem' }}>
                {score === SENTENCES.length
                  ? "Perfect! You have excellent understanding of cause-effect relationships!"
                  : score >= 6
                    ? "Great work! You understand how to identify reasons in sentences."
                    : "Good effort! Review the correct answers above to improve your understanding."}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allSentencesAttempted}
              sx={{
                bgcolor: allSentencesAttempted ? C.blue.border : D.divider,
                color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${allSentencesAttempted ? C.blue.border : D.divider}`,
                boxShadow: allSentencesAttempted ? `4px 4px 0 #1565C0` : 'none',
                fontWeight: 800, fontSize: '1rem', cursor: allSentencesAttempted ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allSentencesAttempted ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #1565C0' } : {},
              }}
            >
              Submit Answers
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: C.green.border, color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${C.green.border}`,
                boxShadow: `4px 4px 0 #2E7D32`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #2E7D32' },
              }}
            >
              Continue to Next Activity <ArrowForwardIcon fontSize="small" />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
