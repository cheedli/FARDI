import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level A2 - Task A
 * Vocabulary Matching: Match words to their definitions
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

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
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/1/remedial/a2/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 1, context: 'remedial_a2' })
  const shuffledDefinitions = useMemo(() => shuffle(MATCHING_PAIRS.map((p, i) => ({ ...p, idx: i }))), [])
  const [selectedWord, setSelectedWord] = useState(null)
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [correctSet, setCorrectSet] = useState(new Set())

  const matchedWordIndices = new Set(Object.keys(matches).map(Number))
  const matchedDefIndices = new Set(Object.values(matches).map(Number))

  const handleWordClick = (idx) => {
    if (submitted) return
    if (matchedWordIndices.has(idx)) {
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
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Step 1: Remedial Practice - Level A2
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>
              Task A: Vocabulary Matching
            </Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>
              Match each word to its correct definition
            </Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Match Race! Match 6 reflection/report words to their simple definitions. Click a word on the left, then click the matching definition on the right. Match all six words!"
            />
          </Box>
        </motion.div>

        {/* Info */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: P.blue.shadow }}>
            <strong>How to play:</strong> Click a word on the left to select it (it will highlight),
            then click its matching definition on the right. Click a matched word to remove the match.
          </Typography>
        </Box>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Grid container spacing={3}>
              {/* Words Column */}
              <Grid item xs={12} md={5}>
                <Box sx={{
                  bgcolor: P.purple.bg,
                  border: `2px solid ${P.purple.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                  p: 2
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center" sx={{ color: P.purple.shadow }}>
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
                            borderRadius: '12px',
                            border: '2px solid',
                            borderColor: isSelected ? P.purple.border : isMatched ? P.green.border : P.yellow.border,
                            bgcolor: isSelected ? P.purple.bg : isMatched ? P.green.bg : P.yellow.bg,
                            boxShadow: `2px 2px 0 ${isSelected ? P.purple.shadow : isMatched ? P.green.shadow : P.yellow.shadow}`,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s',
                            '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.purple.shadow}` }
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold" sx={{ color: isMatched ? P.green.shadow : P.purple.shadow }}>
                            {pair.word}
                          </Typography>
                          {isMatched && (
                            <Typography variant="caption" sx={{ color: P.green.shadow }}>
                              (matched)
                            </Typography>
                          )}
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              </Grid>

              {/* Arrow Column */}
              <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" color="text.secondary">→</Typography>
              </Grid>

              {/* Definitions Column */}
              <Grid item xs={12} md={5}>
                <Box sx={{
                  bgcolor: P.teal.bg,
                  border: `2px solid ${P.teal.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${P.teal.shadow}`,
                  p: 2
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center" sx={{ color: P.teal.shadow }}>
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
                            borderRadius: '12px',
                            border: '2px solid',
                            borderColor: isMatched ? P.green.border : selectedWord !== null ? P.purple.border : P.teal.border,
                            bgcolor: isMatched ? P.green.bg : selectedWord !== null ? P.purple.bg : P.teal.bg,
                            boxShadow: `2px 2px 0 ${isMatched ? P.green.shadow : P.teal.shadow}`,
                            cursor: selectedWord !== null ? 'pointer' : 'default',
                            transition: 'all 0.15s',
                            '&:hover': selectedWord !== null ? { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.purple.shadow}` } : {}
                          }}
                        >
                          <Typography variant="body2" sx={{ color: isMatched ? P.green.shadow : P.teal.shadow }}>
                            {item.definition}
                          </Typography>
                          {matchedWord && (
                            <Box sx={{
                              display: 'inline-block',
                              mt: 0.5,
                              px: 1,
                              py: 0.25,
                              bgcolor: P.green.bg,
                              border: `1px solid ${P.green.border}`,
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              color: P.green.shadow
                            }}>
                              {matchedWord}
                            </Box>
                          )}
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allMatched}
              sx={{
                cursor: allMatched ? 'pointer' : 'not-allowed',
                opacity: allMatched ? 1 : 0.6,
                px: 6,
                py: 1.5,
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: P.orange.shadow,
                '&:hover': { transform: allMatched ? 'translate(-2px,-2px)' : 'none', boxShadow: allMatched ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s'
              }}
            >
              Submit Answers
            </Box>
            {!allMatched && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Match all {MATCHING_PAIRS.length} pairs before submitting ({matchedWordIndices.size}/{MATCHING_PAIRS.length} matched)
              </Typography>
            )}
          </Box>
        )}

        {/* Results */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4,
              mb: 3,
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>
                Task A Complete!
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>
                Score: {score} / {MATCHING_PAIRS.length}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score === MATCHING_PAIRS.length
                  ? 'Perfect! You matched all words correctly!'
                  : score >= 4
                  ? 'Well done! You matched most words correctly.'
                  : 'Good effort! Review the definitions and try to remember them.'}
              </Typography>
            </Box>

            {/* Correct answers */}
            <Box sx={{
              bgcolor: P.blue.bg,
              border: `2px solid ${P.blue.border}`,
              borderRadius: '16px',
              boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              p: 3,
              mb: 3
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Correct Matches
              </Typography>
              <Grid container spacing={2}>
                {MATCHING_PAIRS.map((pair, idx) => {
                  const isCorrect = correctSet.has(idx)
                  return (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        boxShadow: `2px 2px 0 ${isCorrect ? P.green.shadow : P.red.shadow}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {isCorrect
                          ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20 }} />
                          : <CancelIcon sx={{ color: P.red.border, fontSize: 20 }} />}
                        <Box>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>{pair.word}</Typography>
                          <Typography variant="caption" color="text.secondary">{pair.definition}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            <Stack direction="row" justifyContent="flex-end">
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  cursor: 'pointer',
                  px: 4,
                  py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Next: Task B →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
