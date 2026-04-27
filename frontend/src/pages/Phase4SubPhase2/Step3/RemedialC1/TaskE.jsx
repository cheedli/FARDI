import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress, TextField, Avatar, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ExploreIcon from '@mui/icons-material/Explore'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial C1 - Task E: Grammar Exercise (Mixed Tenses/Conditionals)
 * Rewrite 6 sentences with correct mixed tenses and conditionals
 * Score: +1 for each correct sentence (6 total, scaled to /10)
 */

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

const TENSE_SENTENCES = [
  { id: 1, odyssey: 'Odyssey 1', character: 'Hashtag Strategist', avatar: '#️⃣', before: 'Hashtag use viral', infinitive: 'to increase', answer: 'would have increased', after: 'if targeted.', tenseType: 'Third Conditional', concept: 'Third conditional: would have + past participle for hypothetical past situations' },
  { id: 2, odyssey: 'Odyssey 2', character: 'Caption Writer', avatar: '📝', before: 'Caption is short', infinitive: 'to prove', answer: 'has proven', after: 'effective.', tenseType: 'Present Perfect', concept: 'Present perfect: has/have + past participle for results continuing to present' },
  { id: 3, odyssey: 'Odyssey 3', character: 'Emoji Expert', avatar: '😊', before: 'Emoji add emotion', infinitive: 'to use', answer: 'if used', after: 'wisely.', tenseType: 'Conditional', concept: 'Conditional: if + past participle for hypothetical conditions' },
  { id: 4, odyssey: 'Odyssey 4', character: 'CTA Specialist', avatar: '👆', before: 'CTA drive action', infinitive: 'to improve', answer: 'would improve', after: 'if clear.', tenseType: 'Second Conditional', concept: 'Second conditional: would + verb for hypothetical present/future situations' },
  { id: 5, odyssey: 'Odyssey 5', character: 'Tagging Manager', avatar: '🏷️', before: 'Tagging reach more', infinitive: 'to be', answer: 'had been', after: 'strategic.', tenseType: 'Past Perfect', concept: 'Past perfect: had + past participle for completed action before another past action' },
  { id: 6, odyssey: 'Odyssey 6', character: 'Viral Content Creator', avatar: '🚀', before: 'Viral happen', infinitive: 'to occur', answer: 'might occur', after: 'with good content.', tenseType: 'Modal Verb', concept: 'Modal verbs: might/may/could express possibility' }
]

const TIME_LIMIT = 300 // 5 minutes for all 6 sentences

export default function Phase4_2Step3RemedialC1TaskE() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/3/remedial/c1/taskF') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 5, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = TENSE_SENTENCES[currentSentenceIndex]

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

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
    if (currentSentenceIndex < TENSE_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1)
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1)
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
        concept: sentence.concept,
        before: sentence.before,
        after: sentence.after
      }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    const finalScore = Math.round((totalScore / 6) * 10)
    sessionStorage.setItem('phase4_2_step3_remedial_c1_taskE_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step3_remedial_c1_taskE_max', '10')
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
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', task: 'E', score: finalScore, max_score: maxScore, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = TENSE_SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clayCard('orange'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 · Task E</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>Grammar Odyssey</Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555', mt: 0.5 }}>Rewrite sentences using correct mixed tenses and conditional structures!</Typography>
            </Box>
            <Box sx={{ ...clayCard('teal'), mb: 3 }}>
              <CharacterMessage speaker="Emna" message="Welcome to the Grammar Odyssey! Embark on a journey through mixed tenses and conditionals. Complete 6 sentences by filling in the correct verb form. Each correct tense = 1 point. Total: 6 points! Ready to navigate through time?" />
            </Box>
            <Box sx={{ ...clayCard('purple'), mb: 3, textAlign: 'center' }}>
              <ExploreIcon sx={{ fontSize: 80, color: P.purple.border, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.border, mb: 1 }}>Grammar Odyssey</Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#555', mb: 3 }}>6 Odysseys · Mixed Tenses & Conditionals · 5 Minutes</Typography>
              <Box sx={{ ...clayCard('blue'), textAlign: 'left', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Grammar Focus</Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#333' }}>
                  <strong>Third Conditional:</strong> would have + past participle<br />
                  <strong>Present Perfect:</strong> has/have + past participle<br />
                  <strong>First Conditional:</strong> if + present simple<br />
                  <strong>Second Conditional:</strong> would + verb<br />
                  <strong>Past Perfect:</strong> had + past participle<br />
                  <strong>Modal Verbs:</strong> might, may, could
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={() => setGameStarted(true)}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 8, py: 2,
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-block',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                START ODYSSEY!
              </Box>
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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clayCard('orange'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 · Task E</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>Grammar Odyssey — Results</Typography>
            </Box>
            <Box sx={{ ...clayCard(perfectScore ? 'green' : 'yellow'), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: P[perfectScore ? 'green' : 'yellow'].border, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P[perfectScore ? 'green' : 'yellow'].border }}>
                {perfectScore ? 'Odyssey Mastered!' : 'Odyssey Complete!'}
              </Typography>
              <Box sx={{ ...clayCard('blue'), maxWidth: 260, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.blue.border }}>{finalScore} / 10</Typography>
                <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555' }}>Points Earned</Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#777' }}>Raw score: {score} / 6 sentences</Typography>
              </Box>
              {perfectScore && (
                <Box sx={{ ...clayCard('green') }}>
                  <Typography fontWeight="bold" sx={{ color: P.green.border }}>Amazing! You mastered all mixed tenses and conditionals!</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ ...clayCard('purple'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.border, mb: 2 }}>Grammar Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {results.map((result) => (
                  <Box key={result.sentenceId} sx={{ ...clayCard(result.isCorrect ? 'green' : 'red') }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, fontSize: '1.5rem', bgcolor: P[result.isCorrect ? 'green' : 'red'].bg, border: `2px solid ${P[result.isCorrect ? 'green' : 'red'].border}` }}>
                        {result.avatar}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 'bold', color: P.purple.border }}>{result.odyssey}</Box>
                          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 'bold', color: P.blue.border }}>{result.tenseType}</Box>
                          {result.isCorrect
                            ? <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 'bold', color: P.green.border, display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 14 }} />+1 Point</Box>
                            : <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 'bold', color: P.red.border, display: 'flex', alignItems: 'center', gap: 0.5 }}><CancelIcon sx={{ fontSize: 14 }} />+0 Points</Box>
                          }
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: isDark ? '#ccc' : '#555', mt: 0.5 }}>{result.character}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 2, mb: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 0.5 }}>Correct Sentence:</Typography>
                      <Typography variant="h6" sx={{ color: P.green.border, fontWeight: 'bold' }}>"{result.fullSentence}"</Typography>
                    </Box>
                    <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 2, mb: result.isCorrect ? 0 : 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 0.5 }}>Your Answer:</Typography>
                      <Typography variant="h6" sx={{ color: result.isCorrect ? P.green.border : P.red.border, fontWeight: 'bold' }}>
                        "{result.before} <span style={{ textDecoration: 'underline' }}>{result.userAnswer || '(no answer)'}</span> {result.after}"
                      </Typography>
                    </Box>
                    {!result.isCorrect && (
                      <Box sx={{ ...clayCard('teal'), mt: 1, p: 2 }}>
                        <Typography variant="body2" sx={{ color: P.teal.border, fontWeight: 500 }}>
                          <strong>Remember:</strong> {result.concept}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={() => navigate('/phase4_2/step/3/remedial/c1/taskF')}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-block',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task F
              </Box>
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
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header with Timer */}
          <Box sx={{ ...clayCard('purple'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border }}>{currentSentence.odyssey} / 6</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.border : P.purple.border }} />
                <Typography variant="h6" fontWeight={timeLeft <= 60 ? 'bold' : 'normal'} sx={{ color: timeLeft <= 60 ? P.red.border : P.purple.border }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(currentSentenceIndex + 1) / TENSE_SENTENCES.length * 100}
              sx={{ height: 8, borderRadius: 5, bgcolor: isDark ? '#333' : '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: 5 } }}
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ ...clayCard('blue'), mb: 3 }}>
            <Typography variant="body1" fontWeight={600} sx={{ color: P.blue.border }}>
              Instructions: Fill in the blank with the correct verb tense based on the context. Navigate between odysseys using the arrows below.
            </Typography>
          </Box>

          {/* Current Sentence */}
          <Box sx={{ ...clayCard('purple'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}` }}>
                {currentSentence.avatar}
              </Avatar>
              <Box>
                <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.9rem', fontWeight: 'bold', color: P.purple.border, display: 'inline-block', mb: 0.5 }}>
                  {currentSentence.odyssey}
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>{currentSentence.character}</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ color: isDark ? '#ddd' : '#2c3e50' }}>"{currentSentence.before}</Typography>
                <TextField
                  value={answers[currentSentence.id] || ''}
                  onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 250,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: P.purple.bg,
                      borderRadius: '12px',
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 3 },
                      '&:hover fieldset': { borderColor: P.purple.shadow },
                      '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                      '& input': { color: isDark ? '#eee' : '#1a252f', fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: isDark ? '#ddd' : '#2c3e50' }}>{currentSentence.after}"</Typography>
              </Box>
            </Box>
            <Box sx={{ ...clayCard('green'), p: 2 }}>
              <Typography variant="body1" fontWeight={500} sx={{ color: P.green.border }}>
                <strong>Concept:</strong> {currentSentence.concept}
              </Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box
              component="button"
              onClick={handlePrevious}
              disabled={currentSentenceIndex === 0}
              sx={{
                ...clayCard('blue'),
                cursor: currentSentenceIndex > 0 ? 'pointer' : 'not-allowed',
                opacity: currentSentenceIndex > 0 ? 1 : 0.4,
                px: 3, py: 1,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: P.blue.border,
                '&:hover': currentSentenceIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              Previous Odyssey
            </Box>
            <Box
              component="button"
              onClick={handleNext}
              disabled={currentSentenceIndex === TENSE_SENTENCES.length - 1}
              sx={{
                ...clayCard('blue'),
                cursor: currentSentenceIndex < TENSE_SENTENCES.length - 1 ? 'pointer' : 'not-allowed',
                opacity: currentSentenceIndex < TENSE_SENTENCES.length - 1 ? 1 : 0.4,
                px: 3, py: 1,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: P.blue.border,
                '&:hover': currentSentenceIndex < TENSE_SENTENCES.length - 1 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              Next Odyssey
            </Box>
          </Box>

          {/* Progress Overview */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.teal.border, mb: 1 }}>Odyssey Progress:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {TENSE_SENTENCES.map((sentence, index) => (
                <Box
                  key={sentence.id}
                  component="button"
                  onClick={() => setCurrentSentenceIndex(index)}
                  sx={{
                    bgcolor: answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.bg : P.purple.bg
                      : index === currentSentenceIndex ? P.orange.bg : isDark ? '#2a2a2a' : '#e0e0e0',
                    border: `2px solid ${answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.border : P.purple.border
                      : index === currentSentenceIndex ? P.orange.border : (isDark ? '#444' : '#bbb')}`,
                    borderRadius: '12px',
                    px: 2, py: 0.5,
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.border : P.purple.border
                      : index === currentSentenceIndex ? P.orange.border : (isDark ? '#888' : '#666'),
                  }}
                >
                  O{index + 1}
                </Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#aaa' : '#666' }}>
              Answered: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="button"
              onClick={handleSubmitAll}
              disabled={!allAnswered}
              sx={{
                ...clayCard('orange'),
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                opacity: allAnswered ? 1 : 0.5,
                px: 8, py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: P.orange.border,
                display: 'inline-block',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              {allAnswered ? 'Complete Odyssey!' : `Answer All First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
            </Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ ...clayCard('red'), mt: 3, textAlign: 'center' }}>
              <Typography fontWeight="bold" sx={{ color: P.red.border }}>
                Hurry! Only {timeLeft} seconds left!
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
