import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Container,
  LinearProgress
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level A2 - Task A: Match Race
 * Match 6 social media words to pictures (Drag & Drop)
 * 60s timer with bonus points
 */

const WORD_PAIRS = [
  { id: 1, word: 'hashtag', image: '#', description: 'Hash symbol' },
  { id: 2, word: 'caption', image: 'Text box', description: 'Text box below image' },
  { id: 3, word: 'emoji', image: '😊', description: 'Smile face' },
  { id: 4, word: 'tag', image: '@', description: 'At symbol' },
  { id: 5, word: 'post', image: '◼️', description: 'Square' },
  { id: 6, word: 'story', image: '⭕', description: 'Circle' }
]

const TIMER_DURATION = 60

function DraggableWord({ word, id, P, isDark }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, cursor: 'grab', touchAction: 'none' }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
        p: 2, textAlign: 'center',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow }}>
        {word}
      </Typography>
    </Box>
  )
}

function DropZone({ pair, droppedWord, isCorrect, showResults, P, isDark }) {
  const { setNodeRef, isOver } = useDroppable({ id: pair.id.toString() })

  let bg, border, shadow
  if (showResults) {
    bg = isCorrect ? P.green.bg : P.red.bg
    border = isCorrect ? P.green.border : P.red.border
    shadow = isCorrect ? P.green.shadow : P.red.shadow
  } else {
    bg = droppedWord ? P.teal.bg : (isDark ? '#1a1a2e' : '#f9fafb')
    border = isOver ? P.blue.shadow : (droppedWord ? P.teal.border : (isDark ? '#444' : '#d1d5db'))
    shadow = droppedWord ? P.teal.shadow : 'transparent'
  }

  return (
    <Box
      ref={setNodeRef}
      sx={{
        bgcolor: bg, border: `2px ${droppedWord ? 'solid' : 'dashed'} ${border}`,
        borderRadius: '12px', boxShadow: `3px 3px 0 ${shadow}`,
        p: 3, minHeight: 120,
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography variant="h2" sx={{ fontSize: '3rem' }}>{pair.image}</Typography>
        <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>{pair.description}</Typography>
      </Box>
      {droppedWord && (
        <Box sx={{
          p: 1, bgcolor: isDark ? '#1a1a2e' : 'white',
          border: `1px solid ${P.teal.border}`, borderRadius: '8px',
          textAlign: 'center', mt: 2
        }}>
          <Typography variant="body1" fontWeight="bold" sx={{ color: P.teal.shadow }}>{droppedWord}</Typography>
        </Box>
      )}
      {showResults && !isCorrect && (
        <Box sx={{ mt: 1, p: 1, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px' }}>
          <Typography variant="caption" sx={{ color: P.red.shadow }}>
            Correct: <strong>{pair.word}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default function Phase4_2Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 1, context: 'remedial_a2' })
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [timerActive, setTimerActive] = useState(true)
  const [matches, setMatches] = useState({})
  const [availableWords, setAvailableWords] = useState(WORD_PAIRS.map(p => p.word))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setTimerActive(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timerActive, timeLeft])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || showResults) return
    const word = active.id
    const pairId = parseInt(over.id)
    const updatedMatches = { ...matches }
    Object.keys(updatedMatches).forEach(key => {
      if (updatedMatches[key] === word) delete updatedMatches[key]
    })
    updatedMatches[pairId] = word
    setMatches(updatedMatches)
    const matchedWords = Object.values(updatedMatches)
    setAvailableWords(WORD_PAIRS.map(p => p.word).filter(w => !matchedWords.includes(w)))
  }

  const handleSubmit = () => {
    setTimerActive(false)
    let correctCount = 0
    WORD_PAIRS.forEach(pair => { if (matches[pair.id] === pair.word) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / WORD_PAIRS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskA_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskA_max', '10')
    logTaskCompletion(correctCount, WORD_PAIRS.length, timeLeft)
  }

  const logTaskCompletion = async (score, maxScore, timeRemaining) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'A2', task: 'A', score, max_score: maxScore, time_taken: TIMER_DURATION - timeRemaining })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase4_2/step/2/remedial/a2/taskB')

  const allMatched = Object.keys(matches).length === WORD_PAIRS.length
  const timerPercent = (timeLeft / TIMER_DURATION) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>
              Level A2 - Task A: Match Race
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Match the social media words to their pictures! Drag each word to the correct picture."
            />
          </Box>

          {/* Timer */}
          <Box sx={{
            bgcolor: timeLeft < 10 ? P.red.bg : P.blue.bg,
            border: `2px solid ${timeLeft < 10 ? P.red.border : P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${timeLeft < 10 ? P.red.shadow : P.blue.shadow}`,
            p: 2, mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <TimerIcon sx={{ color: timeLeft < 10 ? P.red.shadow : P.blue.shadow }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft < 10 ? P.red.shadow : P.blue.shadow }}>
                Time Remaining: {timeLeft}s
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={timerPercent}
              color={timeLeft < 10 ? 'error' : 'primary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 2, mb: 3
          }}>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              <strong>Instructions:</strong> Drag each word from the left to match it with the correct picture on the right.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow }}>
              <strong>Scoring:</strong> 1 point per correct match.
            </Typography>
          </Box>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Grid container spacing={3}>
              {/* Available Words */}
              <Grid item xs={12} md={4}>
                <Box sx={{
                  bgcolor: isDark ? '#1a1a2e' : '#f9fafb',
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '20px', p: 2
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                    Words:
                  </Typography>
                  <SortableContext items={availableWords} strategy={verticalListSortingStrategy}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {availableWords.map(word => (
                        <DraggableWord key={word} id={word} word={word} P={P} isDark={isDark} />
                      ))}
                    </Box>
                  </SortableContext>
                </Box>
              </Grid>

              {/* Drop Zones */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                  Match to Pictures:
                </Typography>
                <Grid container spacing={2}>
                  {WORD_PAIRS.map(pair => (
                    <Grid item xs={12} sm={6} key={pair.id}>
                      <DropZone
                        pair={pair}
                        droppedWord={matches[pair.id]}
                        isCorrect={matches[pair.id] === pair.word}
                        showResults={showResults}
                        P={P} isDark={isDark}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </DndContext>

          {/* Results */}
          {showResults && (
            <Box sx={{
              bgcolor: score === WORD_PAIRS.length ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score === WORD_PAIRS.length ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score === WORD_PAIRS.length ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mt: 3
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: score === WORD_PAIRS.length ? P.green.shadow : P.yellow.shadow }}>
                {score === WORD_PAIRS.length ? '🎉 Perfect Match!' : 'Good Try!'}
              </Typography>
              <Typography sx={{ color: score === WORD_PAIRS.length ? P.green.shadow : P.yellow.shadow }}>
                Correct Matches: {score}/{WORD_PAIRS.length}
              </Typography>
              <Typography fontWeight="bold" sx={{ color: score === WORD_PAIRS.length ? P.green.shadow : P.yellow.shadow }}>
                Score: {((score / WORD_PAIRS.length) * 10).toFixed(1)}/10
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allMatched && timeLeft > 0} sx={{
                bgcolor: (!allMatched && timeLeft > 0) ? (isDark ? '#2a2a3e' : '#e5e7eb') : P.blue.bg,
                border: `2px solid ${(!allMatched && timeLeft > 0) ? (isDark ? '#444' : '#d1d5db') : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: (!allMatched && timeLeft > 0) ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (!allMatched && timeLeft > 0) ? 'not-allowed' : 'pointer',
                color: (!allMatched && timeLeft > 0) ? (isDark ? '#555' : '#9ca3af') : P.blue.shadow,
                opacity: (!allMatched && timeLeft > 0) ? 0.6 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': (!allMatched && timeLeft > 0) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': (!allMatched && timeLeft > 0) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` }
              }}>
                {timeLeft === 0 ? "Time's Up - View Results" : 'Submit Matches'}
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Task B <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
