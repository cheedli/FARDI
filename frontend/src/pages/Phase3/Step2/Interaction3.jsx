import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Interaction 3: Guided Explanation
 * Sentence Completion using word bank to explain cause-effect relationships
 */

const WORD_BANK = ['because', 'sponsor', 'budget', 'costs', 'tickets', 'funding', 'income', 'expenses']

const SENTENCE_PROMPTS = [
  {
    id: 1,
    prompt: "We need a sponsor __________ the budget has many costs.",
    correctWord: 'because',
    alternativeWords: [],
    explanation: "The word 'because' connects the reason (many costs) to the need (sponsor)."
  },
  {
    id: 2,
    prompt: "The __________ shows all the money we will spend.",
    correctWord: 'budget',
    alternativeWords: [],
    explanation: "A budget is a plan that shows how money will be spent."
  },
  {
    id: 3,
    prompt: "We sell __________ to get money from attendees.",
    correctWord: 'tickets',
    alternativeWords: [],
    explanation: "Tickets are what people buy to attend an event."
  },
  {
    id: 4,
    prompt: "The event has high __________ like venue rental and catering.",
    correctWord: 'costs',
    alternativeWords: ['expenses'],
    explanation: "Costs or expenses refer to money that must be spent."
  },
  {
    id: 5,
    prompt: "We need more __________ to cover all our expenses.",
    correctWord: 'funding',
    alternativeWords: ['income'],
    explanation: "Funding or income is money coming in to pay for things."
  }
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

export default function Phase3Step2Interaction3() {
  const navigate = useNavigate()
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 3, context: 'main' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleAnswerChange = (promptId, value) => {
    setAnswers({ ...answers, [promptId]: value })
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCE_PROMPTS.forEach(prompt => {
      const userAnswer = answers[prompt.id]?.toLowerCase().trim()
      if (userAnswer === prompt.correctWord || prompt.alternativeWords.includes(userAnswer)) {
        correctCount++
      }
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase3_step2_int3_score', correctCount.toString())
    sessionStorage.setItem('phase3_step2_int3_max', SENTENCE_PROMPTS.length.toString())
    logTaskCompletion(correctCount, SENTENCE_PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 2, interaction: 3, score, max_score: maxScore, time_taken: 0, completed: true })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  useEffect(() => { window.__remedialSkip = () => navigate('/phase3/step/2/score') }, [])

  const handleContinue = async () => {
    const int1Score = parseInt(sessionStorage.getItem('phase3_step2_int1_score') || '0')
    const int1Max = parseInt(sessionStorage.getItem('phase3_step2_int1_max') || '10')
    const int2Score = parseInt(sessionStorage.getItem('phase3_step2_int2_score') || '0')
    const int2Max = parseInt(sessionStorage.getItem('phase3_step2_int2_max') || '5')
    const int3Score = score
    const int3Max = SENTENCE_PROMPTS.length

    const totalCorrect = int1Score + int2Score + int3Score
    const totalQuestions = int1Max + int2Max + int3Max
    const percentage = (totalCorrect / totalQuestions) * 100

    sessionStorage.setItem('phase3_step2_total_score', totalCorrect.toString())
    sessionStorage.setItem('phase3_step2_total_max', totalQuestions.toString())
    sessionStorage.setItem('phase3_step2_percentage', percentage.toFixed(2))

    await saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: int3Score })
    navigate('/phase3/step/2/score')
  }

  const allAnswered = Object.keys(answers).length === SENTENCE_PROMPTS.length &&
    Object.values(answers).every(a => a && a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MenuBookIcon sx={{ fontSize: 40, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 Step 2: Explore
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Interaction 3: Guided Explanation
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Excellent progress! Now let's practice explaining financial concepts. Complete each sentence by choosing the correct word from the word bank. Think about cause-effect relationships and financial vocabulary."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 2.5, mb: 3 }}>
            <Typography variant="body1" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Instructions:</Typography>
            {[
              'Read each sentence carefully',
              'Click the dropdown to select a word from the word bank for each blank',
            ].map((t, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>• {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Word Bank */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...clay(D.purple), p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
              Word Bank (Reference)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {WORD_BANK.map((word, i) => (
                <Box key={i} component="span" sx={{
                  px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.85rem', fontWeight: 800,
                  bgcolor: D.purple.bg, color: D.purple.border,
                  border: `2px solid ${D.purple.border}`,
                }}>
                  {word}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Progress */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box component="span" sx={{
                px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.blue.bg, color: D.blue.border, border: `2px solid ${D.blue.border}`,
              }}>
                Sentences Completed: {Object.values(answers).filter(a => a && a.trim().length > 0).length}/{SENTENCE_PROMPTS.length}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Sentence Prompts */}
        <Box sx={{ mb: 4 }}>
          {SENTENCE_PROMPTS.map((prompt, index) => {
            const userAnswer = answers[prompt.id]?.toLowerCase().trim()
            const isCorrect = showResults && (
              userAnswer === prompt.correctWord ||
              prompt.alternativeWords.includes(userAnswer)
            )
            const isAnswered = userAnswer && userAnswer.length > 0
            const cardColor = showResults
              ? isCorrect ? D.green : D.red
              : isAnswered ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={prompt.id} variants={fadeUp} initial="hidden" animate="visible" custom={5 + index}>
                <Box sx={{ ...clay(cardColor), p: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: D.heading, mb: 1.5 }}>
                    {index + 1}. Complete the sentence:
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
                    {prompt.prompt.split('__________').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        <Typography variant="body1" component="span" sx={{ color: D.body }}>
                          {part}
                        </Typography>
                        {i < arr.length - 1 && (
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                              value={answers[prompt.id] || ''}
                              onChange={(e) => handleAnswerChange(prompt.id, e.target.value)}
                              disabled={showResults}
                              displayEmpty
                              sx={{
                                bgcolor: showResults
                                  ? isCorrect ? D.green.bg : D.red.bg
                                  : D.cardBg,
                                borderRadius: '10px',
                                '& .MuiSelect-select': { color: D.body, fontWeight: 600 },
                              }}
                            >
                              <MenuItem value="" disabled>
                                <em style={{ color: D.muted }}>Select word...</em>
                              </MenuItem>
                              {WORD_BANK.map((word, wi) => (
                                <MenuItem key={wi} value={word}>{word}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>

                  {showResults && (
                    <Box sx={{
                      p: 2,
                      bgcolor: isCorrect ? D.green.bg : D.blue.bg,
                      border: `1px solid ${isCorrect ? D.green.border : D.blue.border}`,
                      borderRadius: '12px',
                    }}>
                      <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
                        <strong>Your answer:</strong> {userAnswer || '(no answer)'}
                      </Typography>
                      {!isCorrect && (
                        <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
                          <strong>Correct answer:</strong> {prompt.correctWord}
                          {prompt.alternativeWords.length > 0 && ` or ${prompt.alternativeWords.join(', ')}`}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: D.body, fontStyle: 'italic', mt: 0.5 }}>
                        {prompt.explanation}
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
            <Box sx={{ ...clay(score === SENTENCE_PROMPTS.length ? D.green : score >= 4 ? D.blue : D.orange), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Results</Typography>
              <Typography variant="body1" sx={{ color: D.body, mb: 0.5 }}>
                <strong>Score:</strong> {score}/{SENTENCE_PROMPTS.length} correct
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                {score === SENTENCE_PROMPTS.length
                  ? 'Perfect! You have excellent understanding of financial vocabulary and cause-effect relationships!'
                  : score >= 4
                    ? 'Great work! You understand most of the financial concepts.'
                    : 'Good effort! Review the explanations to strengthen your understanding.'}
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
              onClick={handleContinue}
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
              Complete Step 2 <ArrowForwardIcon />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
