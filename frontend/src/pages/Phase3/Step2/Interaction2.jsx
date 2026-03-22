import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Radio, RadioGroup, FormControlLabel, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Interaction 2: Funding Choice Game
 * Scenario-Based Selection: Choose the best funding option for each situation
 */

const SCENARIOS = [
  {
    id: 1,
    situation: "The festival needs money for sound equipment.",
    options: [
      { id: 'a', text: 'Ticket sales', isCorrect: false },
      { id: 'b', text: 'Sponsor donation', isCorrect: true },
      { id: 'c', text: 'Volunteer work', isCorrect: false }
    ],
    explanation: "Sponsor donation is best because sound equipment requires upfront cash payment. Ticket sales come later, and volunteer work doesn't provide money.",
    icon: '🔊'
  },
  {
    id: 2,
    situation: "The committee needs to pay for venue rental before the event.",
    options: [
      { id: 'a', text: 'Wait for ticket sales', isCorrect: false },
      { id: 'b', text: 'University grant', isCorrect: true },
      { id: 'c', text: 'Donations after the event', isCorrect: false }
    ],
    explanation: "A university grant is best because it provides money upfront before the event. Ticket sales and donations come too late for early expenses.",
    icon: '🏢'
  },
  {
    id: 3,
    situation: "The festival wants to cover ongoing small expenses during the event.",
    options: [
      { id: 'a', text: 'Ticket sales', isCorrect: true },
      { id: 'b', text: 'One-time sponsor', isCorrect: false },
      { id: 'c', text: 'Future donations', isCorrect: false }
    ],
    explanation: "Ticket sales are best because they provide continuous income during the event that can cover small ongoing expenses.",
    icon: '🎫'
  },
  {
    id: 4,
    situation: "The committee needs promotional materials but has limited cash.",
    options: [
      { id: 'a', text: 'Cash sponsor', isCorrect: false },
      { id: 'b', text: 'In-kind sponsor (printing company)', isCorrect: true },
      { id: 'c', text: 'Ticket presales', isCorrect: false }
    ],
    explanation: "An in-kind sponsor is best because a printing company can provide materials directly without needing cash payment.",
    icon: '📄'
  },
  {
    id: 5,
    situation: "The festival has unexpected extra costs after planning the budget.",
    options: [
      { id: 'a', text: 'Emergency donations', isCorrect: true },
      { id: 'b', text: 'Reduce ticket prices', isCorrect: false },
      { id: 'c', text: 'Cancel the event', isCorrect: false }
    ],
    explanation: "Emergency donations are best because they can provide quick additional funding. Reducing ticket prices would decrease income, making the problem worse.",
    icon: '🚨'
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

export default function Phase3Step2Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 2, context: 'main' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleAnswerChange = (scenarioId, optionId) => {
    setAnswers({ ...answers, [scenarioId]: optionId })
  }

  const handleSubmit = () => {
    let correctCount = 0
    SCENARIOS.forEach(scenario => {
      const userAnswer = answers[scenario.id]
      const correctOption = scenario.options.find(opt => opt.isCorrect)
      if (userAnswer === correctOption.id) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase3_step2_int2_score', correctCount.toString())
    sessionStorage.setItem('phase3_step2_int2_max', SCENARIOS.length.toString())
    logTaskCompletion(correctCount, SCENARIOS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 2, interaction: 2, score, max_score: maxScore, time_taken: 0, completed: true })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/2/interaction/3')
  }

  const allAnswered = Object.keys(answers).length === SCENARIOS.length

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
                Interaction 2: Funding Choice Game
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Now let's apply what we learned! For each situation below, choose the most appropriate funding source. Think about timing, availability, and practicality."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 2.5, mb: 3 }}>
            <Typography variant="body1" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
              Instructions:
            </Typography>
            {[
              'Read each scenario carefully',
              'Choose the best funding option for each situation',
            ].map((t, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>• {t}</Typography>
            ))}
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
                Scenarios Answered: {Object.keys(answers).length}/{SCENARIOS.length}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Scenarios */}
        <Box sx={{ mb: 4 }}>
          {SCENARIOS.map((scenario, index) => {
            const userAnswer = answers[scenario.id]
            const correctOption = scenario.options.find(opt => opt.isCorrect)
            const isCorrect = showResults && userAnswer === correctOption.id
            const isAnswered = userAnswer !== undefined
            const cardColor = showResults
              ? isCorrect ? D.green : D.red
              : isAnswered ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={scenario.id} variants={fadeUp} initial="hidden" animate="visible" custom={4 + index}>
                <Box sx={{ ...clay(cardColor), p: 3, mb: 3 }}>
                  {/* Scenario header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 2 }}>
                    <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>{scenario.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={800} sx={{ color: D.muted, mb: 0.5 }}>
                        Scenario {index + 1}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ color: D.heading }}>
                        {scenario.situation}
                      </Typography>
                    </Box>
                    {showResults && isCorrect && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 28, mt: 0.5 }} />}
                  </Box>

                  {/* Options */}
                  <RadioGroup
                    value={userAnswer || ''}
                    onChange={(e) => handleAnswerChange(scenario.id, e.target.value)}
                  >
                    {scenario.options.map(option => {
                      const optBg = showResults && option.isCorrect
                        ? D.green.bg
                        : showResults && userAnswer === option.id && !option.isCorrect
                          ? D.red.bg
                          : 'transparent'

                      return (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio disabled={showResults} size="small" />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ color: D.body }}>{option.text}</Typography>
                              {showResults && option.isCorrect && (
                                <CheckCircleIcon sx={{ color: D.green.border, fontSize: 18 }} />
                              )}
                            </Box>
                          }
                          sx={{
                            bgcolor: optBg,
                            borderRadius: '10px',
                            px: 1, py: 0.5, my: 0.25,
                          }}
                        />
                      )
                    })}
                  </RadioGroup>

                  {/* Explanation */}
                  {showResults && (
                    <Collapse in={showResults}>
                      <Box sx={{
                        mt: 2, p: 2,
                        bgcolor: isCorrect ? D.green.bg : D.blue.bg,
                        border: `1px solid ${isCorrect ? D.green.border : D.blue.border}`,
                        borderRadius: '12px',
                      }}>
                        <Typography variant="body2" sx={{ color: D.body }}>
                          <strong>Explanation:</strong> {scenario.explanation}
                        </Typography>
                      </Box>
                    </Collapse>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Results summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Box sx={{ ...clay(score === SCENARIOS.length ? D.green : score >= 4 ? D.blue : D.orange), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Results</Typography>
              <Typography variant="body1" sx={{ color: D.body, mb: 0.5 }}>
                <strong>Score:</strong> {score}/{SCENARIOS.length} correct
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                {score === SCENARIOS.length
                  ? 'Perfect! You have excellent understanding of funding sources!'
                  : score >= 4
                    ? 'Great work! You understand how to match funding sources to needs.'
                    : 'Good try! Review the explanations to learn more about choosing funding sources.'}
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
              Continue to Next Activity <ArrowForwardIcon />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
