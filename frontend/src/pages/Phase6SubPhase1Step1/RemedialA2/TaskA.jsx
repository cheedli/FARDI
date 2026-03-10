import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid,
  Chip,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level A2 - Task A
 * Vocabulary Matching: Match words to their definitions
 */

const MATCHING_PAIRS = [
  { word: 'success', definition: 'Good result' },
  { word: 'challenge', definition: 'Difficult thing' },
  { word: 'feedback', definition: 'What people say' },
  { word: 'improve', definition: 'Make better' },
  { word: 'positive', definition: 'Good feeling' },
  { word: 'negative', definition: 'Bad feeling' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP1Step1RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 1, context: 'remedial_a2' })
  const shuffledDefinitions = useMemo(() => shuffle(MATCHING_PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedWord, setSelectedWord] = useState(null) // index in MATCHING_PAIRS
  const [matches, setMatches] = useState({}) // { wordIndex: definitionIndex }
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [correctSet, setCorrectSet] = useState(new Set())

  const matchedWordIndices = new Set(Object.keys(matches).map(Number))
  const matchedDefIndices = new Set(Object.values(matches).map(Number))

  const handleWordClick = (idx) => {
    if (submitted) return
    if (matchedWordIndices.has(idx)) {
      // Remove existing match
      const newMatches = { ...matches }
      delete newMatches[idx]
      setMatches(newMatches)
      return
    }
    setSelectedWord(idx)
  }

  const handleDefClick = (defIdx) => {
    if (submitted) return
    if (selectedWord === null) return

    // Find the original index for this definition
    const originalIdx = shuffledDefinitions[defIdx].idx

    // Remove if definition already matched
    const newMatches = { ...matches }
    const existingWordForDef = Object.keys(newMatches).find(k => newMatches[k] === defIdx)
    if (existingWordForDef !== undefined) {
      delete newMatches[existingWordForDef]
    }

    newMatches[selectedWord] = defIdx
    setMatches(newMatches)
    setSelectedWord(null)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const correct = new Set()

    Object.entries(matches).forEach(([wordIdx, defIdx]) => {
      const wordItem = MATCHING_PAIRS[parseInt(wordIdx)]
      const defItem = shuffledDefinitions[parseInt(defIdx)]
      if (wordItem.word === defItem.word) {
        correctCount++
        correct.add(parseInt(wordIdx))
      }
    })

    setScore(correctCount)
    setCorrectSet(correct)
    setSubmitted(true)

    sessionStorage.setItem('phase6_sp1_step1_remedial_a2_taskA_score', correctCount.toString())

    try {
      await phase6API.logRemedialActivity(1, 'A2', 'A', correctCount, 6, 0, 1)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/1/remedial/a2/task/b')
  }

  const allMatched = matchedWordIndices.size === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task A: Vocabulary Matching
        </Typography>
        <Typography variant="body1">
          Match each word to its correct definition
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Match Race! Match 6 reflection/report words to their simple definitions. Click a word on the left, then click the matching definition on the right. Match all six words!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>How to play:</strong> Click a word on the left to select it (it will highlight),
          then click its matching definition on the right. Click a matched word to remove the match.
        </Typography>
      </Alert>

      {!submitted && (
        <Grid container spacing={3}>
          {/* Words Column */}
          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary" textAlign="center">
                Words
              </Typography>
              <Stack spacing={1.5}>
                {MATCHING_PAIRS.map((pair, idx) => {
                  const isMatched = matchedWordIndices.has(idx)
                  const isSelected = selectedWord === idx
                  return (
                    <Box
                      key={idx}
                      onClick={() => handleWordClick(idx)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: isSelected ? '#8e44ad' : isMatched ? '#27ae60' : '#e0e0e0',
                        backgroundColor: isSelected ? '#f3e5f5' : isMatched ? '#e8f8f0' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#8e44ad', backgroundColor: '#fdf0ff' }
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {pair.word}
                      </Typography>
                      {isMatched && (
                        <Typography variant="caption" color="success.main">
                          (matched)
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Arrow Column */}
          <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" color="text.secondary">→</Typography>
          </Grid>

          {/* Definitions Column */}
          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary" textAlign="center">
                Definitions
              </Typography>
              <Stack spacing={1.5}>
                {shuffledDefinitions.map((item, defIdx) => {
                  const isMatched = matchedDefIndices.has(defIdx)
                  const matchedWordIdx = Object.keys(matches).find(k => matches[k] === defIdx)
                  const matchedWord = matchedWordIdx !== undefined ? MATCHING_PAIRS[parseInt(matchedWordIdx)].word : null
                  return (
                    <Box
                      key={defIdx}
                      onClick={() => handleDefClick(defIdx)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: isMatched ? '#27ae60' : selectedWord !== null ? '#8e44ad' : '#e0e0e0',
                        backgroundColor: isMatched ? '#e8f8f0' : selectedWord !== null ? '#fdf0ff' : '#fafafa',
                        cursor: selectedWord !== null ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        '&:hover': selectedWord !== null ? { borderColor: '#6c3483', backgroundColor: '#f3e5f5' } : {}
                      }}
                    >
                      <Typography variant="body2">
                        {item.definition}
                      </Typography>
                      {matchedWord && (
                        <Chip
                          label={matchedWord}
                          size="small"
                          sx={{ mt: 0.5, backgroundColor: '#27ae60', color: 'white' }}
                        />
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Submit Button */}
      {!submitted && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!allMatched}
            sx={{
              px: 6,
              background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)' }
            }}
          >
            Submit Answers
          </Button>
          {!allMatched && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Match all {MATCHING_PAIRS.length} pairs before submitting ({matchedWordIndices.size}/{MATCHING_PAIRS.length} matched)
            </Typography>
          )}
        </Box>
      )}

      {/* Results */}
      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: '#e8f8f0', textAlign: 'center', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark" gutterBottom fontWeight="bold">
              Task A Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Score: {score} / {MATCHING_PAIRS.length}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === MATCHING_PAIRS.length
                ? 'Perfect! You matched all words correctly!'
                : score >= 4
                ? 'Well done! You matched most words correctly.'
                : 'Good effort! Review the definitions and try to remember them.'}
            </Typography>
          </Paper>

          {/* Show correct answers */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Correct Matches
            </Typography>
            <Grid container spacing={2}>
              {MATCHING_PAIRS.map((pair, idx) => {
                const isCorrect = correctSet.has(idx)
                return (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: isCorrect ? 'success.main' : 'error.main',
                        backgroundColor: isCorrect ? 'success.lighter' : 'error.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {isCorrect
                        ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        : <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{pair.word}</Typography>
                        <Typography variant="caption" color="text.secondary">{pair.definition}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Paper>

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
              }}
            >
              Next: Task B →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
