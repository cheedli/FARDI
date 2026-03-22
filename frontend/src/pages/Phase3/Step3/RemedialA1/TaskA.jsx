import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level A1 - Task A: Sentence Building
 * Reorder words to make correct sentences
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } })
}

const SENTENCE_EXERCISES = [
  { id: 1, correctOrder: ['We', 'need', 'a', 'sponsor'], hint: 'Subject + verb + object' },
  { id: 2, correctOrder: ['The', 'budget', 'is', 'important'], hint: 'Article + noun + verb + adjective' },
  { id: 3, correctOrder: ['Tickets', 'cost', 'money'], hint: 'What costs what?' },
  { id: 4, correctOrder: ['We', 'sell', 'tickets'], hint: 'Who does what?' },
  { id: 5, correctOrder: ['Sponsors', 'give', 'money'], hint: 'Who gives what?' },
]

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Phase3Step3RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_a1' })
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
        orange: { bg: '#2A1500', border: '#F57C00', shadow: '#F57C00' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
      }

  const [exercises, setExercises] = useState(
    SENTENCE_EXERCISES.map(ex => ({ ...ex, shuffledWords: shuffleArray(ex.correctOrder), userOrder: [] }))
  )
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (c) => ({
    bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 2.5,
  })

  const handleWordClick = (exerciseIndex, word) => {
    if (showResults) return
    const newExercises = [...exercises]
    const exercise = newExercises[exerciseIndex]
    if (!exercise.userOrder.includes(word)) {
      exercise.userOrder = [...exercise.userOrder, word]
      setExercises(newExercises)
    }
  }

  const handleRemoveWord = (exerciseIndex, wordIndex) => {
    if (showResults) return
    const newExercises = [...exercises]
    const exercise = newExercises[exerciseIndex]
    exercise.userOrder = exercise.userOrder.filter((_, idx) => idx !== wordIndex)
    setExercises(newExercises)
  }

  const handleReset = (exerciseIndex) => {
    if (showResults) return
    const newExercises = [...exercises]
    newExercises[exerciseIndex].userOrder = []
    setExercises(newExercises)
  }

  const handleSubmit = () => {
    let correctCount = 0
    exercises.forEach(exercise => {
      const isCorrect = exercise.userOrder.length === exercise.correctOrder.length &&
        exercise.userOrder.every((word, idx) => word === exercise.correctOrder[idx])
      if (isCorrect) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    logTaskCompletion(correctCount, exercises.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 3 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/app/dashboard') }
  const allCompleted = exercises.every(ex => ex.userOrder.length === ex.correctOrder.length)
  const passThreshold = 4

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...cardSx(C.orange), mb: 3 }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.orange.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Step 3 · Remedial A1
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>Sentence Building</Typography>
            <Typography sx={{ color: D.muted }}>Reorder words to make correct sentences</Typography>
          </Box>
        </motion.div>

        {/* Instructor */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...cardSx(C.blue), mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Let's practice building sentences! Click on the words in the correct order to make a sentence. You can click 'Reset' to start over if you make a mistake."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...cardSx(C.teal), mb: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.heading, mb: 0.75 }}>Instructions:</Typography>
            <Typography sx={{ color: D.body, fontSize: '0.88rem', mb: 0.5 }}>Click the words in the correct order to build each sentence.</Typography>
            <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}><strong>Passing score:</strong> Minimum 4/5 correct</Typography>
          </Box>
        </motion.div>

        {/* Progress */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, fontSize: '1.05rem' }}>
                Completed: {exercises.filter(ex => ex.userOrder.length === ex.correctOrder.length).length}/{exercises.length}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Exercises */}
        <Box sx={{ mb: 4 }}>
          {exercises.map((exercise, exerciseIndex) => {
            const isCorrect = showResults &&
              exercise.userOrder.length === exercise.correctOrder.length &&
              exercise.userOrder.every((word, idx) => word === exercise.correctOrder[idx])
            const hasAnswer = exercise.userOrder.length > 0
            const c = showResults ? (isCorrect ? C.green : C.red) : hasAnswer ? C.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <motion.div key={exercise.id} variants={fadeUp} initial="hidden" animate="visible" custom={4 + exerciseIndex * 0.4}>
                <Box sx={{ ...cardSx(c), mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1.5 }}>
                    {exerciseIndex + 1}. Build this sentence:
                  </Typography>

                  {/* Hint */}
                  <Box sx={{ bgcolor: C.teal.bg, border: `1px solid ${C.teal.border}`, borderRadius: '10px', p: 1.25, mb: 2 }}>
                    <Typography sx={{ color: D.body, fontSize: '0.85rem' }}>
                      💡 <strong>Hint:</strong> {exercise.hint}
                    </Typography>
                  </Box>

                  {/* Answer Area */}
                  <Box sx={{
                    bgcolor: D.cardBg, border: `2px dashed ${C.blue.border}`, borderRadius: '12px',
                    p: 2, mb: 2, minHeight: 56,
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1,
                  }}>
                    {exercise.userOrder.length === 0 ? (
                      <Typography sx={{ color: D.muted, fontSize: '0.88rem', width: '100%', textAlign: 'center' }}>
                        Click words below to build your sentence...
                      </Typography>
                    ) : (
                      exercise.userOrder.map((word, wordIndex) => (
                        <Box
                          key={wordIndex}
                          component="button"
                          onClick={() => !showResults && handleRemoveWord(exerciseIndex, wordIndex)}
                          sx={{
                            bgcolor: C.blue.border, color: '#fff',
                            px: 1.75, py: 0.4, borderRadius: '50px',
                            border: 'none', fontWeight: 800, fontSize: '0.85rem',
                            cursor: showResults ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                            '&:hover': !showResults ? { opacity: 0.75 } : {},
                          }}
                        >
                          {word} {!showResults && '×'}
                        </Box>
                      ))
                    )}
                  </Box>

                  {/* Available Words */}
                  {!showResults && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: D.muted, fontSize: '0.82rem', mb: 1 }}>Available words (click to add):</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {exercise.shuffledWords.map((word, wordIndex) => {
                          const used = exercise.userOrder.includes(word)
                          return (
                            <Box
                              key={wordIndex}
                              component="button"
                              onClick={() => handleWordClick(exerciseIndex, word)}
                              disabled={used}
                              sx={{
                                px: 1.75, py: 0.4, borderRadius: '50px',
                                bgcolor: used ? D.divider : C.teal.bg,
                                border: `2px solid ${used ? D.divider : C.teal.border}`,
                                color: used ? D.muted : C.teal.border,
                                fontWeight: 800, fontSize: '0.85rem',
                                cursor: used ? 'not-allowed' : 'pointer',
                                opacity: used ? 0.4 : 1,
                                transition: 'all 0.15s',
                                '&:hover': !used ? { transform: 'translate(-1px,-1px)' } : {},
                              }}
                            >
                              {word}
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                  )}

                  {/* Reset */}
                  {!showResults && exercise.userOrder.length > 0 && (
                    <Box
                      component="button"
                      onClick={() => handleReset(exerciseIndex)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        bgcolor: 'transparent', color: D.muted,
                        px: 1.5, py: 0.5, borderRadius: '8px',
                        border: `1px solid ${D.divider}`, fontSize: '0.8rem', cursor: 'pointer',
                        '&:hover': { color: D.body, borderColor: D.body },
                      }}
                    >
                      <ShuffleIcon sx={{ fontSize: '0.9rem' }} /> Reset
                    </Box>
                  )}

                  {/* Result */}
                  {showResults && (
                    <Box sx={{
                      bgcolor: isCorrect ? C.green.bg : C.red.bg,
                      border: `1px solid ${isCorrect ? C.green.border : C.red.border}`,
                      borderRadius: '10px', p: 1.5, mt: 1.5,
                    }}>
                      <Typography sx={{ color: D.body, fontSize: '0.88rem' }}>
                        {isCorrect ? (
                          <>✓ Correct! <strong>{exercise.correctOrder.join(' ')}</strong></>
                        ) : (
                          <>
                            ✗ Your answer: <strong>{exercise.userOrder.join(' ') || '(no answer)'}</strong><br />
                            Correct answer: <strong>{exercise.correctOrder.join(' ')}</strong>
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

        {/* Results Summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Box sx={{ ...cardSx(score >= passThreshold ? C.green : C.yellow), mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Typography sx={{ color: D.body, mb: 0.5 }}><strong>Score:</strong> {score}/{exercises.length}</Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.9rem' }}>
                {score === exercises.length
                  ? "Perfect score! Excellent work!"
                  : score >= passThreshold
                    ? `Great job! You passed with ${score} correct answers.`
                    : `You need ${passThreshold} correct to pass. Review the answers above and try again if needed.`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allCompleted}
              sx={{
                bgcolor: allCompleted ? C.orange.border : D.divider,
                color: '#fff', px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${allCompleted ? C.orange.border : D.divider}`,
                boxShadow: allCompleted ? `4px 4px 0 #E65100` : 'none',
                fontWeight: 800, fontSize: '1rem', cursor: allCompleted ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allCompleted ? { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #E65100' } : {},
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
                bgcolor: C.green.border, color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${C.green.border}`,
                boxShadow: `4px 4px 0 #2E7D32`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #2E7D32' },
              }}
            >
              Complete A1 Task <ArrowForwardIcon fontSize="small" />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
