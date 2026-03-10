import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, Chip, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level A2 - Task B: Word Matching
 * Match financial words to their correct definitions
 */

const PAIRS = [
  { id: 1, word: 'sponsor', definition: 'A company or person who gives money to support an event' },
  { id: 2, word: 'budget', definition: 'A plan that shows how much money you have and how to spend it' },
  { id: 3, word: 'ticket', definition: 'A piece of paper that allows you to enter an event' },
  { id: 4, word: 'income', definition: 'Money that comes in from sales or sponsorship' },
]

export default function Phase3RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 2, context: 'remedial_a2' })
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({}) // { definitionId: word }
  const [showResults, setShowResults] = useState(false)

  const usedWords = Object.values(matches)

  const handleWordClick = (word) => {
    if (showResults) return
    setSelectedWord(selectedWord === word ? null : word)
  }

  const handleDefinitionClick = (defId) => {
    if (showResults) return
    if (selectedWord) {
      setMatches(prev => ({ ...prev, [defId]: selectedWord }))
      setSelectedWord(null)
    } else if (matches[defId]) {
      // Remove match if clicking a filled definition with no word selected
      setMatches(prev => {
        const next = { ...prev }
        delete next[defId]
        return next
      })
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = PAIRS.filter(p => matches[p.id] === p.word).length
    logTaskCompletion(score)
  }

  const handleReset = () => {
    setMatches({})
    setSelectedWord(null)
    setShowResults(false)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A2', task: 'B', score, max_score: PAIRS.length, time_taken: 0 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const score = showResults ? PAIRS.filter(p => matches[p.id] === p.word).length : 0
  const allMatched = Object.keys(matches).length === PAIRS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>Phase 3 - Remedial Practice</Typography>
        <Typography variant="h6">Level A2 - Task B: Word Matching</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Match each financial word to its correct definition. Click a word on the left, then click its matching definition on the right!"
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Click a word from the left column, then click the matching definition. Click a filled definition to remove the match.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Words column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>Words</Typography>
          <Stack spacing={1.5}>
            {PAIRS.map(pair => {
              const used = usedWords.includes(pair.word)
              const isSelected = selectedWord === pair.word
              return (
                <Chip
                  key={pair.id}
                  label={pair.word}
                  onClick={() => !used && handleWordClick(pair.word)}
                  sx={{
                    fontSize: '1rem',
                    height: 44,
                    fontWeight: 600,
                    cursor: used || showResults ? 'default' : 'pointer',
                    bgcolor: isSelected ? 'primary.main' : used ? 'success.light' : 'background.paper',
                    color: isSelected ? 'white' : used ? 'success.dark' : 'text.primary',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.dark' : used ? 'success.main' : 'divider',
                    opacity: used && !showResults ? 0.6 : 1,
                    '&:hover': { bgcolor: used || showResults ? undefined : isSelected ? 'primary.dark' : 'action.hover' }
                  }}
                />
              )
            })}
          </Stack>
        </Box>

        {/* Definitions column */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>Definitions</Typography>
          <Stack spacing={1.5}>
            {PAIRS.map(pair => {
              const matchedWord = matches[pair.id]
              const isCorrect = showResults && matchedWord === pair.word
              const isWrong = showResults && matchedWord && matchedWord !== pair.word
              return (
                <Paper
                  key={pair.id}
                  elevation={2}
                  onClick={() => handleDefinitionClick(pair.id)}
                  sx={{
                    p: 2,
                    cursor: showResults ? 'default' : selectedWord || matchedWord ? 'pointer' : 'default',
                    bgcolor: isCorrect ? 'success.light' : isWrong ? 'error.light' : matchedWord ? 'primary.light' : 'background.paper',
                    border: '2px solid',
                    borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : matchedWord ? 'primary.main' : selectedWord ? 'primary.light' : 'divider',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    {matchedWord && (
                      <Chip label={matchedWord} size="small" sx={{ mb: 0.5, bgcolor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'primary.main', color: 'white', fontWeight: 'bold' }} />
                    )}
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>{pair.definition}</Typography>
                    {showResults && isWrong && (
                      <Typography variant="caption" color="success.dark" fontWeight="bold">
                        Correct: {pair.word}
                      </Typography>
                    )}
                  </Box>
                  {showResults && (isCorrect ? <CheckCircleIcon color="success" /> : isWrong ? <CancelIcon color="error" /> : null)}
                </Paper>
              )
            })}
          </Stack>
        </Box>
      </Box>

      {selectedWord && !showResults && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Selected: <strong>{selectedWord}</strong> — now click a definition to match it
        </Alert>
      )}

      {showResults && (
        <Alert severity={score === PAIRS.length ? 'success' : 'warning'} sx={{ mb: 3 }}>
          <Typography variant="h6">Score: {score} / {PAIRS.length}</Typography>
          <Typography>{score === PAIRS.length ? 'Perfect! You matched all words correctly!' : 'Review the correct answers above and try again.'}</Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        {!showResults ? (
          <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={!allMatched}>
            Submit Answers
          </Button>
        ) : (
          <>
            {score < PAIRS.length && (
              <Button variant="outlined" color="secondary" size="large" onClick={handleReset}>
                Try Again
              </Button>
            )}
            <Button variant="contained" color="success" size="large" onClick={() => navigate('/phase3/step/1/remedial/a2/taskC')} endIcon={<ArrowForwardIcon />}>
              Next Task
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
