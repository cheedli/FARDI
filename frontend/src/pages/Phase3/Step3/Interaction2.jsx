import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Interaction 2: Sentence Transformation
 * Task: Combine two sentences using "because" or "so"
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

const SENTENCE_PAIRS = [
  {
    id: 1, sentenceA: "We need a sponsor.", sentenceB: "The budget has many expenses.",
    options: [
      { id: 'a', text: "We need a sponsor because the budget has many expenses.", isCorrect: true, connector: 'because' },
      { id: 'b', text: "We need a sponsor so the budget has many expenses.", isCorrect: false, connector: 'so' },
      { id: 'c', text: "The budget has many expenses so we need a sponsor.", isCorrect: true, connector: 'so' },
    ],
    explanation: "Both 'because' and 'so' work here, but their order matters. Use 'because' after the main idea, or 'so' after the reason.",
    acceptableAnswers: ['a', 'c']
  },
  {
    id: 2, sentenceA: "Ticket sales are important.", sentenceB: "They provide income for the event.",
    options: [
      { id: 'a', text: "Ticket sales are important because they provide income for the event.", isCorrect: true, connector: 'because' },
      { id: 'b', text: "They provide income for the event so ticket sales are important.", isCorrect: false, connector: 'so' },
      { id: 'c', text: "Ticket sales are important so they provide income for the event.", isCorrect: false, connector: 'so' },
    ],
    explanation: "Use 'because' when the second part explains WHY. The income is the reason ticket sales are important.",
    acceptableAnswers: ['a']
  },
  {
    id: 3, sentenceA: "The venue costs $800.", sentenceB: "We need more funding sources.",
    options: [
      { id: 'a', text: "The venue costs $800 because we need more funding sources.", isCorrect: false, connector: 'because' },
      { id: 'b', text: "The venue costs $800 so we need more funding sources.", isCorrect: true, connector: 'so' },
      { id: 'c', text: "We need more funding sources because the venue costs $800.", isCorrect: true, connector: 'because' },
    ],
    explanation: "The high venue cost is the REASON for needing more funding. You can use 'so' after the reason, or 'because' before it.",
    acceptableAnswers: ['b', 'c']
  },
  {
    id: 4, sentenceA: "Sponsors want visibility.", sentenceB: "We put their logos on posters.",
    options: [
      { id: 'a', text: "Sponsors want visibility so we put their logos on posters.", isCorrect: true, connector: 'so' },
      { id: 'b', text: "We put their logos on posters because sponsors want visibility.", isCorrect: true, connector: 'because' },
      { id: 'c', text: "Sponsors want visibility because we put their logos on posters.", isCorrect: false, connector: 'because' },
    ],
    explanation: "The sponsor's desire for visibility is the reason for putting logos on posters. Both options a and b express this correctly.",
    acceptableAnswers: ['a', 'b']
  },
  {
    id: 5, sentenceA: "Our budget is limited.", sentenceB: "We must prioritize essential costs.",
    options: [
      { id: 'a', text: "Our budget is limited so we must prioritize essential costs.", isCorrect: true, connector: 'so' },
      { id: 'b', text: "We must prioritize essential costs because our budget is limited.", isCorrect: true, connector: 'because' },
      { id: 'c', text: "Our budget is limited because we must prioritize essential costs.", isCorrect: false, connector: 'because' },
    ],
    explanation: "The limited budget is the reason for prioritizing costs. Options a and b both correctly show this relationship.",
    acceptableAnswers: ['a', 'b']
  }
]

export default function Phase3Step3Interaction2() {
  const navigate = useNavigate()
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 2, context: 'main' })
  const muiTheme = useTheme()
  const dark = muiTheme.palette.mode === 'dark'

  const D = dark
    ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
    : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }

  const C = dark
    ? {
        green:  { bg: '#1B2E1B', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#0D1B2A', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#2A0A0A', border: '#C62828', shadow: '#C62828' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
      }

  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (c) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    p: 2.5,
  })

  const handleAnswerChange = (pairId, optionId) => {
    setAnswers({ ...answers, [pairId]: optionId })
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCE_PAIRS.forEach(pair => {
      if (pair.acceptableAnswers.includes(answers[pair.id])) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase3_step3_int2_score', correctCount.toString())
    sessionStorage.setItem('phase3_step3_int2_max', SENTENCE_PAIRS.length.toString())
    logTaskCompletion(correctCount, SENTENCE_PAIRS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 3, interaction: 2, score: score, max_score: maxScore, time_taken: 0, completed: true })
      })
    } catch (error) { console.error('Failed to log interaction:', error) }
  }

  const handleContinue = () => { navigate('/phase3/step/3/interaction/3') }

  useEffect(() => { window.__remedialSkip = handleContinue }, [])

  const allAnswered = Object.keys(answers).length === SENTENCE_PAIRS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.teal.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Interaction 2
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Sentence Transformation</Typography>
            <Typography sx={{ color: D.muted }}>Combine sentences using "because" or "so"</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Excellent! Now let's practice combining sentences using connectors. For each pair of sentences, choose the option that correctly combines them using 'because' or 'so'. Remember: 'because' introduces the reason, and 'so' introduces the result."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...cardSx(C.yellow), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Instructions:</Typography>
            {['Read both sentences carefully', 'Select the option that correctly combines them', 'Think about which part is the REASON and which is the RESULT'].map((t, i) => (
              <Typography key={i} sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>• {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Grammar Tip */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Grammar Tip:</Typography>
            <Typography sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>
              • <strong>because:</strong> [Result] <em>because</em> [Reason] → "We need money <strong>because</strong> costs are high"
            </Typography>
            <Typography sx={{ color: D.body, fontSize: '0.88rem' }}>
              • <strong>so:</strong> [Reason] <em>so</em> [Result] → "Costs are high <strong>so</strong> we need money"
            </Typography>
          </Box>
        </motion.div>

        {/* Progress */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, fontSize: '1.05rem' }}>
                Questions Answered: {Object.keys(answers).length}/{SENTENCE_PAIRS.length}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Questions */}
        <Box sx={{ mb: 4 }}>
          {SENTENCE_PAIRS.map((pair, index) => {
            const userAnswer = answers[pair.id]
            const isCorrect = showResults && pair.acceptableAnswers.includes(userAnswer)
            const isAnswered = userAnswer !== undefined
            const c = showResults ? (isCorrect ? C.green : C.red) : isAnswered ? C.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={pair.id} variants={fadeUp} initial="hidden" animate="visible" custom={5 + index * 0.5}>
                <Box sx={{ ...cardSx(c), mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ px: 1.5, py: 0.3, borderRadius: '50px', bgcolor: c.border, color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                      Question {index + 1}
                    </Box>
                    {showResults && isCorrect && <CheckCircleIcon sx={{ color: C.green.border, fontSize: 28 }} />}
                  </Box>

                  {/* Sentences */}
                  <Box sx={{ bgcolor: D.cardBg, borderRadius: '12px', p: 2, mb: 2 }}>
                    <Typography sx={{ color: D.body, mb: 0.75, fontSize: '0.95rem' }}><strong>Sentence A:</strong> {pair.sentenceA}</Typography>
                    <Typography sx={{ color: D.body, fontSize: '0.95rem' }}><strong>Sentence B:</strong> {pair.sentenceB}</Typography>
                  </Box>

                  <Typography sx={{ color: D.body, fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>Choose the best way to combine these sentences:</Typography>

                  <RadioGroup value={userAnswer || ''} onChange={(e) => handleAnswerChange(pair.id, e.target.value)}>
                    {pair.options.map(option => {
                      const isAcceptable = showResults && pair.acceptableAnswers.includes(option.id)
                      const isWrong = showResults && userAnswer === option.id && !pair.acceptableAnswers.includes(option.id)
                      return (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio disabled={showResults} sx={{ color: C.teal.border, '&.Mui-checked': { color: C.teal.border } }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ color: D.body, fontSize: '0.9rem' }}>{option.text}</Typography>
                              {isAcceptable && <CheckCircleIcon sx={{ color: C.green.border, fontSize: 18 }} />}
                            </Box>
                          }
                          sx={{
                            bgcolor: isAcceptable ? C.green.bg : isWrong ? C.red.bg : 'transparent',
                            borderRadius: '10px', px: 1, py: 0.5, my: 0.3,
                            border: isAcceptable ? `1px solid ${C.green.border}` : isWrong ? `1px solid ${C.red.border}` : 'none',
                          }}
                        />
                      )
                    })}
                  </RadioGroup>

                  {showResults && (
                    <Box sx={{ bgcolor: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: '10px', p: 1.5, mt: 2 }}>
                      <Typography sx={{ color: D.body, fontSize: '0.88rem' }}>
                        <strong>Explanation:</strong> {pair.explanation}
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
            <Box sx={{ ...cardSx(score >= 4 ? C.green : C.yellow), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Results</Typography>
              <Typography sx={{ color: D.body, mb: 0.5 }}><strong>Score:</strong> {score}/{SENTENCE_PAIRS.length} correct</Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.9rem' }}>
                {score === SENTENCE_PAIRS.length
                  ? "Perfect! You have mastered sentence transformation with connectors!"
                  : score >= 4
                    ? "Great work! You understand how to use 'because' and 'so' correctly."
                    : "Good effort! Review the explanations to improve your connector usage."}
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
              disabled={!allAnswered}
              sx={{
                bgcolor: allAnswered ? C.teal.border : D.divider,
                color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${allAnswered ? C.teal.border : D.divider}`,
                boxShadow: allAnswered ? `4px 4px 0 #006064` : 'none',
                fontWeight: 800, fontSize: '1rem', cursor: allAnswered ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #006064' } : {},
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
