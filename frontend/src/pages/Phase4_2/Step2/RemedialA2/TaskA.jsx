import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material'
import { DndContext, closestCenter, DragOverlay, useDroppable } from '@dnd-kit/core'
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

const TIMER_DURATION = 60 // 60 seconds

function DraggableWord({ word, id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    touchAction: 'none'
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: '#1976d2',
        color: '#ffffff',
        textAlign: 'center',
        '&:hover': { backgroundColor: '#1565c0' }
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          color: '#ffffff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {word}
      </Typography>
    </Card>
  )
}

function DropZone({ pair, droppedWord, isCorrect, showResults }) {
  const { setNodeRef, isOver } = useDroppable({
    id: pair.id.toString()
  })

  const backgroundColor = showResults
    ? (isCorrect ? 'success.lighter' : 'error.lighter')
    : (droppedWord ? 'info.lighter' : 'grey.100')

  const borderColor = isOver
    ? 'primary.dark'
    : droppedWord
    ? 'primary.main'
    : 'grey.300'

  return (
    <Card
      ref={setNodeRef}
      elevation={2}
      sx={{
        p: 3,
        minHeight: 120,
        backgroundColor,
        border: 2,
        borderColor,
        borderStyle: 'dashed',
        transition: 'all 0.2s ease',
        transform: isOver ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: '3rem' }}>
          {pair.image}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {pair.description}
        </Typography>
      </Box>
      {droppedWord && (
        <Card elevation={1} sx={{ p: 1, backgroundColor: 'white', textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            {droppedWord}
          </Typography>
        </Card>
      )}
      {showResults && !isCorrect && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Correct: <strong>{pair.word}</strong>
        </Alert>
      )}
    </Card>
  )
}

export default function Phase4_2Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 1, context: 'remedial_a2' })
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [timerActive, setTimerActive] = useState(true)
  const [matches, setMatches] = useState({})
  const [availableWords, setAvailableWords] = useState(WORD_PAIRS.map(p => p.word))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false)
          return 0
        }
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

    // Remove word from previous match if exists
    const updatedMatches = { ...matches }
    Object.keys(updatedMatches).forEach(key => {
      if (updatedMatches[key] === word) {
        delete updatedMatches[key]
      }
    })

    // Add new match
    updatedMatches[pairId] = word

    setMatches(updatedMatches)

    // Update available words (remove matched ones)
    const matchedWords = Object.values(updatedMatches)
    setAvailableWords(WORD_PAIRS.map(p => p.word).filter(w => !matchedWords.includes(w)))
  }

  const handleSubmit = () => {
    setTimerActive(false)

    // Calculate score
    let correctCount = 0
    WORD_PAIRS.forEach(pair => {
      if (matches[pair.id] === pair.word) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Score out of 10 (6 matches scaled to 10)
    const scoreOutOf10 = (correctCount / WORD_PAIRS.length) * 10

    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskA_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskA_max', '10')

    logTaskCompletion(correctCount, WORD_PAIRS.length, timeLeft)
  }

  const logTaskCompletion = async (score, maxScore, timeRemaining) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 2,
          level: 'A2',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: TIMER_DURATION - timeRemaining
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/2/remedial/a2/taskB')
  }

  const allMatched = Object.keys(matches).length === WORD_PAIRS.length
  const timerPercent = (timeLeft / TIMER_DURATION) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task A: Match Race
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Match the social media words to their pictures! Drag each word to the correct picture."
        />
      </Paper>

      {/* Timer */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: timeLeft < 10 ? 'error.lighter' : 'info.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <TimerIcon color={timeLeft < 10 ? 'error' : 'primary'} />
          <Typography variant="h6" color={timeLeft < 10 ? 'error' : 'primary'}>
            Time Remaining: {timeLeft}s
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={timerPercent}
          color={timeLeft < 10 ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Drag each word from the left to match it with the correct picture on the right.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Scoring:</strong> 1 point per correct match.
        </Typography>
      </Paper>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {/* Available Words */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Words:
              </Typography>
              <SortableContext items={availableWords} strategy={verticalListSortingStrategy}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {availableWords.map(word => (
                    <DraggableWord key={word} id={word} word={word} />
                  ))}
                </Box>
              </SortableContext>
            </Paper>
          </Grid>

          {/* Drop Zones */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom color="primary">
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
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DndContext>

      {/* Results */}
      {showResults && (
        <Alert severity={score === WORD_PAIRS.length ? "success" : "warning"} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {score === WORD_PAIRS.length ? '🎉 Perfect Match!' : 'Good Try!'}
          </Typography>
          <Typography>
            Correct Matches: {score}/{WORD_PAIRS.length}
          </Typography>
          <Typography fontWeight="bold">
            Score: {((score / WORD_PAIRS.length) * 10).toFixed(1)}/10
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allMatched && timeLeft > 0}
          >
            {timeLeft === 0 ? 'Time\'s Up - View Results' : 'Submit Matches'}
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task B
          </Button>
        )}
      </Box>
    </Box>
  )
}
