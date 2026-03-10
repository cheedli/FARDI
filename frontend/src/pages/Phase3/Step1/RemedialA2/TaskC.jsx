import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, Chip, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level A2 - Task C: Sentence Ordering
 * Arrange jumbled words into correct sentences
 */

const SENTENCES = [
  {
    id: 1,
    words: ['needs', 'The', 'event', 'a', 'sponsor'],
    correct: ['The', 'event', 'needs', 'a', 'sponsor'],
    answer: 'The event needs a sponsor.'
  },
  {
    id: 2,
    words: ['shows', 'budget', 'The', 'our', 'spending'],
    correct: ['The', 'budget', 'shows', 'our', 'spending'],
    answer: 'The budget shows our spending.'
  },
  {
    id: 3,
    words: ['sell', 'We', 'to', 'tickets', 'money', 'raise'],
    correct: ['We', 'sell', 'tickets', 'to', 'raise', 'money'],
    answer: 'We sell tickets to raise money.'
  },
]

export default function Phase3RemedialA2TaskC() {
  const navigate = useNavigate()
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
      // Move from bank to arrangement
      setBanks(prev => ({ ...prev, [sentenceId]: prev[sentenceId].filter((w, i) => i !== prev[sentenceId].indexOf(w) || (banks[sentenceId].indexOf(w) !== prev[sentenceId].indexOf(w))) }))
      setBanks(prev => {
        const arr = [...prev[sentenceId]]
        const idx = arr.indexOf(word)
        arr.splice(idx, 1)
        return { ...prev, [sentenceId]: arr }
      })
      setArrangements(prev => ({ ...prev, [sentenceId]: [...prev[sentenceId], word] }))
    } else {
      // Move from arrangement back to bank
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
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
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

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>Phase 3 - Remedial Practice</Typography>
        <Typography variant="h6">Level A2 - Task C: Sentence Ordering</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Put the words in the correct order to make a sentence! Click words from the top to build your sentence, then click placed words to return them."
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Click words from the word bank to place them in order. Click a placed word to return it.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        {SENTENCES.map((sentence, index) => {
          const isCorrect = showResults && checkCorrect(sentence.id)
          const isWrong = showResults && !checkCorrect(sentence.id)
          return (
            <Paper key={sentence.id} elevation={2} sx={{ p: 3, mb: 3, border: '2px solid', borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'divider', bgcolor: isCorrect ? 'success.lighter' : isWrong ? 'error.lighter' : 'background.paper' }}>
              <Typography variant="h6" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                Sentence {index + 1}
              </Typography>

              {/* Word bank */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Word bank (click to add):</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: 40, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                {banks[sentence.id].map((word, i) => (
                  <Chip
                    key={`bank-${i}`}
                    label={word}
                    onClick={() => handleWordClick(sentence.id, word, true)}
                    sx={{ cursor: showResults ? 'default' : 'pointer', fontWeight: 600, bgcolor: 'background.paper' }}
                  />
                ))}
                {banks[sentence.id].length === 0 && <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'center' }}>Empty</Typography>}
              </Box>

              {/* Arrangement area */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Your sentence (click to remove):</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 44, p: 1.5, bgcolor: 'background.default', border: '2px dashed', borderColor: 'divider', borderRadius: 1 }}>
                {arrangements[sentence.id].map((word, i) => (
                  <Chip
                    key={`arr-${i}`}
                    label={word}
                    onClick={() => handleWordClick(sentence.id, word, false)}
                    sx={{ cursor: showResults ? 'default' : 'pointer', fontWeight: 600, bgcolor: isCorrect ? 'success.light' : isWrong ? 'error.light' : 'primary.light' }}
                  />
                ))}
                {arrangements[sentence.id].length === 0 && <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'center' }}>Click words above to build your sentence</Typography>}
              </Box>

              {showResults && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isCorrect ? (
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ flex: 1 }}>Correct!</Alert>
                  ) : (
                    <Alert severity="error" sx={{ flex: 1 }}>
                      Correct answer: <strong>{sentence.answer}</strong>
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
          )
        })}
      </Box>

      {showResults && (
        <Alert severity={score === SENTENCES.length ? 'success' : 'info'} sx={{ mb: 3 }}>
          <Typography variant="h6">Score: {score} / {SENTENCES.length}</Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!showResults ? (
          <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={!allComplete}>
            Submit Answers
          </Button>
        ) : (
          <Button variant="contained" color="success" size="large" onClick={() => navigate('/phase3/step/1/remedial/a2/taskD')} endIcon={<ArrowForwardIcon />}>
            Next Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
