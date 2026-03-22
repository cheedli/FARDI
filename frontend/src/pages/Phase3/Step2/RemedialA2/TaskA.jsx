import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BuildIcon from '@mui/icons-material/Build'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level A2 - Task A: Gap Fill
 * Fill in gaps using: sponsor, budget, ticket
 */

const GAP_FILL_SENTENCES = [
  { id: 1,  text: "We need to create a _______ to plan our spending.",      correctAnswers: ['budget'],  hint: 'A plan for money' },
  { id: 2,  text: "The _______ gave us $500 for the event.",                correctAnswers: ['sponsor'], hint: 'Person or company that gives money' },
  { id: 3,  text: "Each _______ costs $10 to enter the festival.",          correctAnswers: ['ticket'],  hint: 'What people buy to attend' },
  { id: 4,  text: "Our _______ shows we need $2,000 total.",                correctAnswers: ['budget'],  hint: 'Financial plan' },
  { id: 5,  text: "The main _______ wants their logo on posters.",          correctAnswers: ['sponsor'], hint: 'Company giving support' },
  { id: 6,  text: "We sold 100 _______ in the first week.",                 correctAnswers: ['tickets'], hint: 'Entry passes (plural)' },
  { id: 7,  text: "A good _______ helps us avoid overspending.",            correctAnswers: ['budget'],  hint: 'Money plan' },
  { id: 8,  text: "The local café is our food _______.",                    correctAnswers: ['sponsor'], hint: 'Supporter' },
  { id: 9,  text: "Online _______ sales start next Monday.",                correctAnswers: ['ticket'],  hint: 'Entry pass' },
  { id: 10, text: "Without a _______, we might spend too much money.",      correctAnswers: ['budget'],  hint: 'Financial plan' }
]

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

function clay(c) {
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
  }
}

export default function Phase3Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleAnswerChange = (id, value) => {
    setAnswers({ ...answers, [id]: value })
  }

  const handleSubmit = () => {
    let correctCount = 0
    GAP_FILL_SENTENCES.forEach(sentence => {
      const userAnswer = answers[sentence.id]?.toLowerCase().trim()
      if (sentence.correctAnswers.some(correct => userAnswer === correct)) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    logTaskCompletion(correctCount, GAP_FILL_SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'A', score, max_score: maxScore, time_taken: 0, step: 2 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const allAnswered = Object.keys(answers).length === GAP_FILL_SENTENCES.length &&
    Object.values(answers).every(a => a && a.trim().length > 0)

  const passThreshold = 8

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <BuildIcon sx={{ fontSize: 40, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 Step 2 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level A2 — Task A: Gap Fill Exercise
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Let's practice using financial vocabulary! Fill in the gaps using the words: sponsor, budget, or ticket. Pay attention to singular and plural forms!"
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 2.5, mb: 3 }}>
            <Typography variant="body1" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Instructions:</Typography>
            <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
              Select the correct word from the dropdown for each blank.
            </Typography>
            <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
              <strong>Words available:</strong> sponsor, budget, ticket (and their plural forms)
            </Typography>
            <Typography variant="body2" sx={{ color: D.body }}>
              <strong>Passing score:</strong> Minimum 8/10 correct
            </Typography>
          </Box>
        </motion.div>

        {/* Progress */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box component="span" sx={{
                px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.blue.bg, color: D.blue.border, border: `2px solid ${D.blue.border}`,
              }}>
                Completed: {Object.values(answers).filter(a => a && a.trim().length > 0).length}/{GAP_FILL_SENTENCES.length}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Gap Fill Sentences */}
        <Box sx={{ mb: 4 }}>
          {GAP_FILL_SENTENCES.map((sentence, index) => {
            const userAnswer = answers[sentence.id]?.toLowerCase().trim()
            const isCorrect = showResults && sentence.correctAnswers.some(correct => userAnswer === correct)
            const isAnswered = userAnswer && userAnswer.length > 0
            const cardColor = showResults
              ? isCorrect ? D.green : D.red
              : isAnswered ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={sentence.id} variants={fadeUp} initial="hidden" animate="visible" custom={4 + index}>
                <Box sx={{ ...clay(cardColor), p: 2.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography variant="body1" component="span" sx={{ color: D.body }}>
                      <strong>{index + 1}.</strong> {sentence.text.split('_______')[0]}
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                        disabled={showResults}
                        displayEmpty
                        sx={{
                          bgcolor: showResults ? (isCorrect ? D.green.bg : D.red.bg) : D.cardBg,
                          borderRadius: '10px',
                          '& .MuiSelect-select': { color: D.body, fontWeight: 600 },
                        }}
                      >
                        <MenuItem value="" disabled><em style={{ color: D.muted }}>Select...</em></MenuItem>
                        <MenuItem value="sponsor">sponsor</MenuItem>
                        <MenuItem value="sponsors">sponsors</MenuItem>
                        <MenuItem value="budget">budget</MenuItem>
                        <MenuItem value="budgets">budgets</MenuItem>
                        <MenuItem value="ticket">ticket</MenuItem>
                        <MenuItem value="tickets">tickets</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="body1" component="span" sx={{ color: D.body }}>
                      {sentence.text.split('_______')[1]}
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{ color: D.muted, display: 'block', mb: 1 }}>
                    💡 Hint: {sentence.hint}
                  </Typography>

                  {showResults && (
                    <Box sx={{
                      p: 1.5, borderRadius: '12px',
                      bgcolor: isCorrect ? D.green.bg : D.red.bg,
                      border: `1px solid ${isCorrect ? D.green.border : D.red.border}`,
                    }}>
                      <Typography variant="body2" sx={{ color: D.body }}>
                        {isCorrect ? (
                          <>✓ Correct! The answer is: <strong>{userAnswer}</strong></>
                        ) : (
                          <>
                            ✗ Your answer: <strong>{userAnswer || '(no answer)'}</strong>
                            {' | '}Correct: <strong>{sentence.correctAnswers.join(' or ')}</strong>
                          </>
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Results summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Box sx={{ ...clay(score >= passThreshold ? D.green : D.orange), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Typography variant="body1" sx={{ color: D.body, mb: 0.5 }}>
                <strong>Score:</strong> {score}/{GAP_FILL_SENTENCES.length}
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                {score === GAP_FILL_SENTENCES.length
                  ? 'Perfect score! Excellent work!'
                  : score >= passThreshold
                    ? `Great job! You passed with ${score} correct answers.`
                    : `You need ${passThreshold} correct to pass. Review the answers above and try again if needed.`}
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
                bgcolor: allAnswered ? D.blue.bg : D.divider,
                color: allAnswered ? D.blue.border : D.muted,
                border: `2px solid ${allAnswered ? D.blue.border : D.divider}`,
                borderRadius: '14px',
                boxShadow: allAnswered ? `4px 4px 0 ${D.blue.shadow}` : 'none',
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: allAnswered ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` } : {},
              }}
            >
              Submit Answers
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleNext}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: D.green.bg, color: D.green.border,
                border: `2px solid ${D.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Complete A2 Task <ArrowForwardIcon />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
