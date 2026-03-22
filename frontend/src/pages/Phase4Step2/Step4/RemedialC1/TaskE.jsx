import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ExploreIcon from '@mui/icons-material/Explore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Remedial C1 - Task E: Grammar Exercise (Mixed Tenses/Conditionals)
 * Rewrite 6 sentences with correct mixed tenses and conditionals
 * Score: +1 for each correct sentence (6 total, scaled to /10)
 */

const TENSE_SENTENCES = [
  {
    id: 1,
    odyssey: 'Odyssey 1',
    character: 'Hashtag Strategist',
    avatar: '#️⃣',
    before: 'Hashtag use viral',
    infinitive: 'to increase',
    answer: 'would have increased',
    after: 'if targeted.',
    tenseType: 'Third Conditional',
    concept: 'Third conditional: would have + past participle for hypothetical past situations'
  },
  {
    id: 2,
    odyssey: 'Odyssey 2',
    character: 'Caption Writer',
    avatar: '📝',
    before: 'Caption is short',
    infinitive: 'to prove',
    answer: 'has proven',
    after: 'effective.',
    tenseType: 'Present Perfect',
    concept: 'Present perfect: has/have + past participle for results continuing to present'
  },
  {
    id: 3,
    odyssey: 'Odyssey 3',
    character: 'Emoji Expert',
    avatar: '😊',
    before: 'Emoji add emotion',
    infinitive: 'to use',
    answer: 'if used',
    after: 'wisely.',
    tenseType: 'Conditional',
    concept: 'Conditional: if + past participle for hypothetical conditions'
  },
  {
    id: 4,
    odyssey: 'Odyssey 4',
    character: 'CTA Specialist',
    avatar: '👆',
    before: 'CTA drive action',
    infinitive: 'to improve',
    answer: 'would improve',
    after: 'if clear.',
    tenseType: 'Second Conditional',
    concept: 'Second conditional: would + verb for hypothetical present/future situations'
  },
  {
    id: 5,
    odyssey: 'Odyssey 5',
    character: 'Tagging Manager',
    avatar: '🏷️',
    before: 'Tagging reach more',
    infinitive: 'to be',
    answer: 'had been',
    after: 'strategic.',
    tenseType: 'Past Perfect',
    concept: 'Past perfect: had + past participle for completed action before another past action'
  },
  {
    id: 6,
    odyssey: 'Odyssey 6',
    character: 'Viral Content Creator',
    avatar: '🚀',
    before: 'Viral happen',
    infinitive: 'to occur',
    answer: 'might occur',
    after: 'with good content.',
    tenseType: 'Modal Verb',
    concept: 'Modal verbs: might/may/could express possibility'
  }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

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

export default function Phase4_2Step4RemedialC1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 5, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = TENSE_SENTENCES[currentSentenceIndex]

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => {
    setAnswers({ ...answers, [sentenceId]: value })
  }

  const handleNext = () => {
    if (currentSentenceIndex < TENSE_SENTENCES.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1)
    }
  }

  const handleSubmitAll = async () => {
    setSubmitted(true)

    const evaluatedResults = TENSE_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && (
        userAnswer === correctAnswer ||
        userAnswer === correctAnswer.replace(' ', '') ||
        correctAnswer.includes(userAnswer) ||
        userAnswer.includes(correctAnswer)
      )
      return {
        sentenceId: sentence.id,
        odyssey: sentence.odyssey,
        character: sentence.character,
        avatar: sentence.avatar,
        userAnswer: answers[sentence.id] || '',
        correctAnswer: sentence.answer,
        tenseType: sentence.tenseType,
        isCorrect,
        fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}`,
        concept: sentence.concept
      }
    })

    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    const finalScore = Math.round((totalScore / 6) * 10)

    sessionStorage.setItem('phase4_2_step4_remedial_c1_taskE_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step4_remedial_c1_taskE_max', '10')

    await logTaskCompletion(finalScore, 10)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 4, level: 'C1', task: 'E', score: finalScore, max_score: maxScore, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleStartGame = () => setGameStarted(true)
  const handleContinue = () => navigate('/phase4_2/step/4/remedial/c1/taskF')

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = TENSE_SENTENCES.every(s => answers[s.id]?.trim())
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task E: Grammar Odyssey</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <CharacterMessage
                character="EMNA"
                message="Welcome to the Grammar Odyssey! Embark on a journey through mixed tenses and conditionals. Complete 6 sentences by filling in the correct verb form. Each correct tense = 1 point. Total: 6 points!"
              />
            </Box>

            {/* Start Card */}
            <Box sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <ExploreIcon sx={{ fontSize: 80, color: P.purple.border, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.purple.shadow, mb: 1 }}>Grammar Odyssey</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>
                6 Odysseys • Mixed Tenses & Conditionals • 5 Minutes
              </Typography>

              {/* Grammar Focus */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                p: 3, mb: 3, textAlign: 'left',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Grammar Focus</Typography>
                <Typography variant="body2" sx={{ color: P.blue.shadow, lineHeight: 2 }}>
                  <strong>Third Conditional:</strong> would have + past participle<br />
                  <strong>Present Perfect:</strong> has/have + past participle<br />
                  <strong>First Conditional:</strong> if + present simple<br />
                  <strong>Second Conditional:</strong> would + verb<br />
                  <strong>Past Perfect:</strong> had + past participle<br />
                  <strong>Modal Verbs:</strong> might, may, could
                </Typography>
              </Box>

              <Box component="button" onClick={handleStartGame} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.2rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Start Odyssey!</Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const finalScore = Math.round((score / 6) * 10)
    const perfectScore = score === 6

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task E: Grammar Odyssey - Results</Typography>
            </Box>

            {/* Score Summary */}
            <Box sx={{
              bgcolor: perfectScore ? P.green.bg : P.purple.bg,
              border: `2px solid ${perfectScore ? P.green.border : P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.purple.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: perfectScore ? P.green.border : P.purple.border, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: perfectScore ? P.green.shadow : P.purple.shadow, mb: 2 }}>
                {perfectScore ? 'Odyssey Mastered!' : 'Odyssey Complete!'}
              </Typography>
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                p: 3, display: 'inline-block',
              }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>{finalScore} / 10</Typography>
                <Typography variant="body2" sx={{ color: P.blue.shadow }}>Raw: {score} / 6 sentences</Typography>
              </Box>
            </Box>

            {/* Detailed Results */}
            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Grammar Review</Typography>
              {results.map((result) => (
                <Box key={result.sentenceId} sx={{
                  mb: 2, p: 2, borderRadius: '12px',
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{result.avatar}</Typography>
                    <Box sx={{
                      bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                      borderRadius: '999px', px: 1.5, py: 0.3, fontSize: '0.75rem', fontWeight: 700,
                      color: P.purple.shadow,
                    }}>{result.odyssey}</Box>
                    <Box sx={{
                      bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                      borderRadius: '999px', px: 1.5, py: 0.3, fontSize: '0.75rem', fontWeight: 700,
                      color: P.blue.shadow,
                    }}>{result.tenseType}</Box>
                    {result.isCorrect
                      ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: '1rem' }} />
                      : <CancelIcon sx={{ color: P.red.border, fontSize: '1rem' }} />
                    }
                    <Typography variant="caption" sx={{ fontWeight: 700, color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                      {result.isCorrect ? '+1 Point' : '+0 Points'}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>
                    {result.character}
                  </Typography>
                  <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                    Correct: "{result.fullSentence}"
                  </Typography>
                  <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                    Your answer: "{result.userAnswer || '(no answer)'}"
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="caption" sx={{ color: P.red.shadow, display: 'block', mt: 0.5 }}>
                      Remember: {result.concept}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Continue */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task F <ArrowForwardIcon fontSize="small" /></Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header with Timer */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.purple.shadow }}>
              {currentSentence.odyssey} / 6
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.border : P.purple.border }} />
              <Typography variant="h6" sx={{
                color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow,
                fontWeight: timeLeft <= 60 ? 'bold' : 'normal',
              }}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '999px', height: 12, mb: 3, overflow: 'hidden',
          }}>
            <Box sx={{
              bgcolor: P.teal.border, height: '100%', borderRadius: '999px',
              width: `${((currentSentenceIndex + 1) / TENSE_SENTENCES.length) * 100}%`,
              transition: 'width 0.3s',
            }} />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
            p: 2, mb: 3,
          }}>
            <Typography variant="body2" sx={{ color: P.blue.shadow }}>
              <strong>Instructions:</strong> Fill in the blank with the correct verb tense. Navigate between odysseys using the arrows below.
            </Typography>
          </Box>

          {/* Current Sentence */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography sx={{ fontSize: '3rem' }}>{currentSentence.avatar}</Typography>
              <Box>
                <Box sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.3, display: 'inline-block',
                  fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow, mb: 0.5,
                }}>{currentSentence.odyssey}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.purple.shadow }}>
                  {currentSentence.character}
                </Typography>
                <Box sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '999px', px: 2, py: 0.2, display: 'inline-block',
                  fontSize: '0.8rem', fontWeight: 700, color: P.blue.shadow,
                }}>{currentSentence.tenseType}</Box>
              </Box>
            </Box>

            <Box sx={{
              bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
              borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
              p: 3,
            }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ color: P.yellow.shadow, fontWeight: 500 }}>
                  "{currentSentence.before}
                </Typography>
                <TextField
                  value={answers[currentSentence.id] || ''}
                  onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 200 }}
                />
                <Typography variant="h6" sx={{ color: P.yellow.shadow, fontWeight: 500 }}>
                  {currentSentence.after}"
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
              cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
              color: P.blue.shadow, opacity: currentSentenceIndex === 0 ? 0.4 : 1,
              '&:hover': { transform: currentSentenceIndex === 0 ? 'none' : 'translate(-2px,-2px)', boxShadow: currentSentenceIndex === 0 ? `3px 3px 0 ${P.blue.shadow}` : `5px 5px 0 ${P.blue.shadow}` },
            }}>← Previous Odyssey</Box>
            <Box component="button" onClick={handleNext} disabled={currentSentenceIndex === TENSE_SENTENCES.length - 1} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
              cursor: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 'not-allowed' : 'pointer',
              color: P.blue.shadow, opacity: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 0.4 : 1,
              '&:hover': { transform: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 'none' : 'translate(-2px,-2px)', boxShadow: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? `3px 3px 0 ${P.blue.shadow}` : `5px 5px 0 ${P.blue.shadow}` },
            }}>Next Odyssey →</Box>
          </Box>

          {/* Progress Overview */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.teal.shadow, mb: 2 }}>Odyssey Progress:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {TENSE_SENTENCES.map((sentence, index) => (
                <Box
                  key={sentence.id}
                  component="button"
                  onClick={() => setCurrentSentenceIndex(index)}
                  sx={{
                    bgcolor: answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.bg : P.purple.bg
                      : index === currentSentenceIndex ? P.orange.bg : P.blue.bg,
                    border: `2px solid ${answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.border : P.purple.border
                      : index === currentSentenceIndex ? P.orange.border : P.blue.border}`,
                    borderRadius: '8px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.shadow : P.purple.shadow
                      : index === currentSentenceIndex ? P.orange.shadow : P.blue.shadow,
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  {sentence.avatar} O{index + 1}
                </Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: P.teal.shadow }}>
              Answered: {answeredCount} / 6
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: !allAnswered ? 'not-allowed' : 'pointer',
              color: P.purple.shadow, opacity: !allAnswered ? 0.5 : 1,
              '&:hover': { transform: !allAnswered ? 'none' : 'translate(-2px,-2px)', boxShadow: !allAnswered ? `3px 3px 0 ${P.purple.shadow}` : `5px 5px 0 ${P.purple.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.purple.shadow}` },
            }}>
              {allAnswered ? 'Complete Odyssey!' : `Answer All First (${answeredCount}/6)`}
            </Box>
          </Box>

          {/* Timer Warning */}
          {timeLeft <= 60 && (
            <Box sx={{
              bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
              borderRadius: '16px', boxShadow: `3px 3px 0 ${P.red.shadow}`,
              p: 2, textAlign: 'center',
            }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: P.red.shadow }}>
                Hurry! Only {timeLeft} seconds left!
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
