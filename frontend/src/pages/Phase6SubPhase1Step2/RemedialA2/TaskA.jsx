import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Alert,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 2 - Level A2 - Task A
 * Match Race: Match 6 report words to definitions/pictures
 */

const PAIRS = [
  { id: 'success', word: 'success', definition: 'Happy face + trophy' },
  { id: 'challenge', word: 'challenge', definition: 'Difficult puzzle' },
  { id: 'feedback', word: 'feedback', definition: 'Speech bubble' },
  { id: 'improve', word: 'improve', definition: 'Arrow up' },
  { id: 'recommend', word: 'recommend', definition: 'Light bulb' },
  { id: 'summary', word: 'summary', definition: 'Short text page' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP1Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'remedial_a2' })
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledDefs] = useState(() => shuffle(PAIRS.map(p => ({ id: p.id, definition: p.definition }))))

  const handleWordClick = (wordId) => {
    if (submitted) return
    setSelectedWord(wordId)
  }

  const handleDefClick = (defId) => {
    if (submitted || !selectedWord) return
    setMatches(prev => ({ ...prev, [selectedWord]: defId }))
    setSelectedWord(null)
  }

  const handleSubmit = async () => {
    let correct = 0
    PAIRS.forEach(p => {
      if (matches[p.id] === p.id) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_a2_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(2, 'A2', 'A', correct, PAIRS.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allMatched = PAIRS.every(p => matches[p.id])
  const matchedDefs = new Set(Object.values(matches))

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level A2</Typography>
        <Typography variant="h6">Task A: Match Race</Typography>
        <Typography variant="body1">Match 6 report words to their definitions/pictures</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's play Match Race! Click a word on the left, then click its matching definition on the right. Match all 6 pairs!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>How to play:</strong> Click a word (left) to select it (it will turn green), then click its matching definition (right).
        </Typography>
      </Alert>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {/* Words (left) */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
                Words
              </Typography>
              <Stack spacing={1}>
                {PAIRS.map(p => (
                  <Card
                    key={p.id}
                    variant="outlined"
                    onClick={() => handleWordClick(p.id)}
                    sx={{
                      cursor: 'pointer',
                      borderColor: selectedWord === p.id
                        ? '#27ae60'
                        : matches[p.id]
                          ? '#2196f3'
                          : '#ccc',
                      backgroundColor: selectedWord === p.id
                        ? '#f0faf4'
                        : matches[p.id]
                          ? '#e3f2fd'
                          : 'white',
                      borderWidth: selectedWord === p.id ? 2 : 1,
                      '&:hover': { borderColor: '#27ae60', backgroundColor: '#f0faf4' }
                    }}
                  >
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="body1" fontWeight="bold">{p.word}</Typography>
                      {matches[p.id] && (
                        <Chip
                          label={shuffledDefs.find(d => d.id === matches[p.id])?.definition}
                          size="small"
                          color="primary"
                          sx={{ mt: 0.5, fontSize: '0.7rem' }}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* Definitions (right) */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
                Definitions
              </Typography>
              <Stack spacing={1}>
                {shuffledDefs.map(d => {
                  const alreadyMatched = matchedDefs.has(d.id)
                  return (
                    <Card
                      key={d.id}
                      variant="outlined"
                      onClick={() => !alreadyMatched && handleDefClick(d.id)}
                      sx={{
                        cursor: alreadyMatched ? 'default' : 'pointer',
                        borderColor: alreadyMatched ? '#bdbdbd' : '#ccc',
                        backgroundColor: alreadyMatched ? '#f5f5f5' : 'white',
                        opacity: alreadyMatched ? 0.6 : 1,
                        '&:hover': !alreadyMatched ? { borderColor: '#27ae60', backgroundColor: '#f0faf4' } : {}
                      }}
                    >
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="body1">{d.definition}</Typography>
                      </CardContent>
                    </Card>
                  )
                })}
              </Stack>
            </Box>
          </Box>

          {selectedWord && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Selected: <strong>{selectedWord}</strong>. Now click the matching definition on the right.
              </Typography>
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!allMatched}
            fullWidth
            size="large"
            sx={{
              mt: 3,
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' }
            }}
          >
            Check My Answers
          </Button>
        </Paper>
      )}

      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#27ae60', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="success.dark">Task A Complete!</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#27ae60' }}>
                  Score: {score} / {PAIRS.length}
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Correct Answers:</Typography>
            <Stack spacing={1}>
              {PAIRS.map(p => {
                const isCorrect = matches[p.id] === p.id
                return (
                  <Box
                    key={p.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: isCorrect ? '#c8e6c9' : '#ffcdd2'
                    }}
                  >
                    <Typography variant="body2">
                      {isCorrect ? '✓' : '✗'} <strong>{p.word}</strong> → {p.definition}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => navigate('/phase6/subphase/1/step/2/remedial/a2/task/b')}
              size="large"
              sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
            >
              Next: Task B →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
