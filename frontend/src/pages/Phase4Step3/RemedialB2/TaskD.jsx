import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

/**
 * Phase 4 Step 3 - Remedial B2 - Task D: Spell Quest
 * Spelling + explanation game - 6 terms
 * Score: 12 pts (1 spelling + 1 explanation per term)
 */

const TERMS = [
  { id: 1, word: 'promotional', explanation: 'To promote/sell like video 1', expectedConcepts: ['promote', 'sell', 'video 1'] },
  { id: 2, word: 'persuasive', explanation: 'Convince with ethos/pathos/logos from video 1', expectedConcepts: ['ethos', 'pathos', 'logos', 'convince', 'video 1'] },
  { id: 3, word: 'targeted', explanation: 'For specific group as video 1', expectedConcepts: ['specific', 'group', 'audience', 'video 1'] },
  { id: 4, word: 'original', explanation: 'New idea from video 1', expectedConcepts: ['new', 'unique', 'idea', 'video 1'] },
  { id: 5, word: 'creative', explanation: 'Imaginative for memorable ads', expectedConcepts: ['imaginative', 'memorable', 'ads'] },
  { id: 6, word: 'dramatisation', explanation: 'Story with goal/obstacles from video 2', expectedConcepts: ['story', 'goal', 'obstacle', 'video 2', 'character'] }
]

const TIME_PER_TERM = 45
const LETTER_COLORS = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#e91e63', '#00bcd4']

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/b2/taskE') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TERM)
  const [scrambledLetters, setScrambledLetters] = useState([])
  const [spelledWord, setSpelledWord] = useState([])
  const [spellingComplete, setSpellingComplete] = useState(false)
  const [userExplanation, setUserExplanation] = useState('')
  const [results, setResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [animationOffset, setAnimationOffset] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)

  const currentTerm = TERMS[currentTermIndex]

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (gameStarted && currentTerm && !spellingComplete) {
      const letters = currentTerm.word.split('').map((letter, index) => ({ letter, id: `${letter}-${index}`, originalIndex: index }))
      setScrambledLetters([...letters].sort(() => Math.random() - 0.5))
      setSpelledWord([])
    }
  }, [currentTermIndex, gameStarted])

  useEffect(() => {
    if (gameStarted && !spellingComplete && !gameFinished) {
      const interval = setInterval(() => setAnimationOffset(prev => (prev + 1) % 100), 50)
      return () => clearInterval(interval)
    }
  }, [gameStarted, spellingComplete, gameFinished])

  useEffect(() => {
    if (!gameStarted || gameFinished || spellingComplete) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleTimeUp() }
  }, [timeLeft, gameStarted, gameFinished, spellingComplete])

  const handleTimeUp = () => {
    results.push({ termId: currentTerm.id, word: currentTerm.word, spellingScore: 0, explanationScore: 0, userSpelling: spelledWord.map(l => l.letter).join(''), userExplanation: '', feedback: 'Time ran out!' })
    moveToNextTerm()
  }

  const handleLetterClick = (letterObj) => {
    if (!scrambledLetters.some(l => l.id === letterObj.id)) return
    setSpelledWord([...spelledWord, letterObj])
    setScrambledLetters(scrambledLetters.filter(l => l.id !== letterObj.id))
  }

  const handleUndo = () => {
    if (spelledWord.length > 0) {
      const lastLetter = spelledWord[spelledWord.length - 1]
      setSpelledWord(spelledWord.slice(0, -1))
      setScrambledLetters([...scrambledLetters, lastLetter].sort(() => Math.random() - 0.5))
    }
  }

  const handleCheckSpelling = () => {
    const userWord = spelledWord.map(l => l.letter).join('')
    if (userWord === currentTerm.word) {
      setScore(score + 1)
      setSpellingComplete(true)
    } else {
      alert(`Incorrect spelling! You spelled: "${userWord}". Try again!`)
      setScrambledLetters([...spelledWord, ...scrambledLetters].sort(() => Math.random() - 0.5))
      setSpelledWord([])
    }
  }

  const handleSubmitExplanation = async () => {
    setEvaluating(true)
    const userWord = spelledWord.map(l => l.letter).join('')
    const spellingScore = userWord === currentTerm.word ? 1 : 0
    try {
      const response = await fetch('/api/phase4/step3/remedial/b2/evaluate-spell-explanation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ term: currentTerm.word, explanation: userExplanation, expectedConcepts: currentTerm.expectedConcepts })
      })
      const data = await response.json()
      if (data.success) {
        if (data.score === 1) setScore(score + 1)
        const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore: data.score, userSpelling: userWord, userExplanation, feedback: data.feedback }
        results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
      } else {
        const explanationScore = userExplanation.trim().length >= 15 ? 1 : 0
        if (explanationScore === 1) setScore(score + 1)
        const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore, userSpelling: userWord, userExplanation, feedback: explanationScore ? 'Good explanation!' : 'Needs more detail and video reference.' }
        results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const explanationScore = userExplanation.trim().length >= 15 ? 1 : 0
      if (explanationScore === 1) setScore(score + 1)
      const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore, userSpelling: userWord, userExplanation, feedback: explanationScore ? 'Good explanation!' : 'Needs more detail and video reference.' }
      results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
    }
    setEvaluating(false)
  }

  const handleSkipExplanation = () => {
    const userWord = spelledWord.map(l => l.letter).join('')
    const spellingScore = userWord === currentTerm.word ? 1 : 0
    results.push({ termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore: 0, userSpelling: userWord, userExplanation: '', feedback: 'Skipped explanation' })
    moveToNextTerm()
  }

  const handleNextTerm = () => { setShowFeedback(false); setCurrentFeedback(null); moveToNextTerm() }

  const moveToNextTerm = () => {
    if (currentTermIndex < TERMS.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1); setTimeLeft(TIME_PER_TERM); setSpellingComplete(false); setUserExplanation('')
    } else { finishGame() }
  }

  const finishGame = () => {
    setGameFinished(true)
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    sessionStorage.setItem('remedial_step3_b2_taskD_score', totalScore)
    logTaskCompletion(totalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'D', step: 2, score: finalScore, max_score: 12, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const canCheckSpelling = spelledWord.length === currentTerm?.word.length
  const canSubmitExplanation = userExplanation.trim().length >= 10

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('purple'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B2 - Task D: Spell Quest 📝</Typography>
              <Typography variant="body1">Spell words from scrambled letters, then explain them!</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Spell Quest! 📝 For each term, you'll see scrambled letters. Click them in the correct order to spell the word, then write an explanation that references the videos. Each term has 2 points: 1 for correct spelling + 1 for good explanation. Total: 12 points! Ready? Let's quest! 🚀" />
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <SpellcheckIcon sx={{ fontSize: 80, mb: 2, color: P.purple.border }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">Spell Quest Challenge</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>6 Terms • 45 Seconds Each • Spell + Explain</Typography>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 8, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                START QUEST! 🎮
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('purple'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5">Level B2 - Task D: Spell Quest - Results 🏆</Typography>
            </Box>
            <Box sx={{ ...cardSx(totalScore === 12 ? 'green' : 'purple'), mb: 3, textAlign: 'center', p: 5 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: totalScore === 12 ? P.green.border : P.purple.border }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">{totalScore === 12 ? 'Perfect Quest! 🎉' : 'Quest Complete! 🎊'}</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.border }}>{totalScore} / 12</Typography>
                <Typography variant="h6" color="text.secondary">Points Earned</Typography>
              </Box>
              {totalScore === 12 && <Box sx={{ ...cardSx('green'), mt: 2 }}><Typography variant="body1" fontWeight={500}>Amazing! Perfect spelling AND explanations! You're a vocabulary master! 🌟</Typography></Box>}
            </Box>

            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">Quest Review</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result, index) => {
                  const spellingCorrect = result.spellingScore === 1
                  const explanationCorrect = result.explanationScore === 1
                  const totalCorrect = spellingCorrect && explanationCorrect
                  const color = totalCorrect ? 'green' : (spellingCorrect || explanationCorrect) ? 'yellow' : 'red'
                  return (
                    <Box key={index} sx={{
                      bgcolor: P[color].bg, border: `2px solid ${P[color].border}`,
                      borderRadius: '16px', p: 3, boxShadow: `3px 3px 0 ${P[color].shadow}`,
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Term {index + 1}: {result.word}</Typography>
                        {totalCorrect ? <CheckCircleIcon sx={{ color: P.green.border }} /> : <CancelIcon sx={{ color: P[color].border }} />}
                        <Box sx={{ bgcolor: P[color].border, borderRadius: '10px', px: 1.5, py: 0.25 }}>
                          <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>{result.spellingScore + result.explanationScore}/2 pts</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Spelling: {spellingCorrect ? '✓ Correct' : '✗ Incorrect'}</Typography>
                      <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '12px', p: 2, mb: 2 }}>
                        <Typography variant="body2">You spelled: <strong>{result.userSpelling || '(no answer)'}</strong></Typography>
                        {!spellingCorrect && <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct spelling: <strong>{result.word}</strong></Typography>}
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Explanation: {explanationCorrect ? '✓ Good' : '✗ Needs improvement'}</Typography>
                      <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '12px', p: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{result.userExplanation || '(no explanation provided)'}"</Typography>
                      </Box>
                      <Box sx={{ bgcolor: explanationCorrect ? P.green.bg : P.yellow.bg, border: `1px solid ${explanationCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight={500}>Feedback: {result.feedback}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/b2/taskE')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.2rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Continue to Task E →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress - Sushi Spell style
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.mode === 'dark' ? '#0F0F1A' : '#2d5016', py: 0 }}>

      {/* Header - sushi spell style */}
      <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)', p: 2, borderBottom: `4px solid ${P.orange.border}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ ...cardSx('red'), p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TimerIcon sx={{ color: timeLeft <= 10 ? P.red.border : P.orange.border }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft <= 10 ? P.red.border : 'inherit' }}>
                {timeLeft}s
              </Typography>
            </Stack>
            <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.border }}>Score: {score}</Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            {TERMS.map((_, index) => (
              <Box key={index} sx={{
                width: 32, height: 32, borderRadius: '50%',
                bgcolor: index < currentTermIndex ? P.purple.border : index === currentTermIndex ? P.orange.border : 'rgba(0,0,0,0.2)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid white',
              }}>
                {index + 1}
              </Box>
            ))}
          </Stack>

          <Box sx={{ ...cardSx('orange'), p: 1.5 }}>
            <Typography variant="h6" fontWeight="bold">Word: {currentTermIndex + 1}</Typography>
          </Box>
        </Stack>
      </Box>

      {!spellingComplete ? (
        <Box>
          {/* Clue card */}
          <Box sx={{ mx: 3, my: 3, ...cardSx('yellow'), textAlign: 'center', minHeight: 100 }}>
            <Typography variant="h4" fontWeight="bold">{currentTerm.explanation}</Typography>
          </Box>

          {/* Scrolling letters */}
          <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#34495e', py: 3, my: 3, borderTop: '6px solid #2c3e50', borderBottom: '6px solid #2c3e50' }}>
            <Box sx={{ display: 'flex', gap: 2, px: 2, transform: `translateX(-${animationOffset}px)`, transition: 'transform 0.05s linear' }}>
              {[...scrambledLetters, ...scrambledLetters, ...scrambledLetters].map((letterObj, index) => {
                const isAvailable = scrambledLetters.some(l => l.id === letterObj.id)
                return (
                  <Box key={`${letterObj.id}-${index}`} component="button" onClick={() => handleLetterClick(letterObj)}
                    sx={{
                      minWidth: 72, height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center',
                      bgcolor: isAvailable ? LETTER_COLORS[index % LETTER_COLORS.length] : 'rgba(150,150,150,0.5)',
                      color: 'white', cursor: isAvailable ? 'pointer' : 'not-allowed',
                      borderRadius: '50%', border: '4px solid white', flexShrink: 0, transition: 'transform 0.2s',
                      opacity: isAvailable ? 1 : 0.4,
                      '&:hover': { transform: isAvailable ? 'scale(1.2)' : 'scale(1)' }
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Arial Black, sans-serif' }}>
                      {letterObj.letter.toUpperCase()}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>

          {/* Answer area */}
          <Box sx={{ bgcolor: '#d4a574', borderTop: '6px solid #8b6f47', p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Box sx={{ flex: 1, bgcolor: '#e8d5b7', borderRadius: '20px', border: '3px solid #c9a96e', p: 2, minHeight: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                {spelledWord.length === 0 ? (
                  <Typography variant="h5" sx={{ color: '#8b7355', fontStyle: 'italic' }}>Click letters above to spell the word...</Typography>
                ) : (
                  spelledWord.map((letterObj, index) => (
                    <Box key={index} sx={{
                      width: 64, height: 64, display: 'flex', justifyContent: 'center', alignItems: 'center',
                      bgcolor: 'white', border: `3px solid ${P.purple.border}`, borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                    }}>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, fontFamily: 'Arial Black, sans-serif' }}>
                        {letterObj.letter.toUpperCase()}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
              <Stack spacing={1.5}>
                <Box component="button" onClick={handleCheckSpelling} disabled={!canCheckSpelling}
                  sx={{
                    ...cardSx('green'), cursor: !canCheckSpelling ? 'not-allowed' : 'pointer', opacity: !canCheckSpelling ? 0.5 : 1,
                    width: 110, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.2s',
                    '&:hover': canCheckSpelling ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {}
                  }}
                >
                  Submit
                </Box>
                <Box component="button" onClick={handleUndo} disabled={spelledWord.length === 0}
                  sx={{
                    ...cardSx('orange'), cursor: spelledWord.length === 0 ? 'not-allowed' : 'pointer', opacity: spelledWord.length === 0 ? 0.5 : 1,
                    width: 110, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.2s',
                    '&:hover': spelledWord.length > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
                  }}
                >
                  Clear
                </Box>
              </Stack>
            </Stack>
          </Box>

          {timeLeft <= 10 && (
            <Box sx={{ mx: 3, mt: 2, ...cardSx('red'), textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.red.border }}>⏰ Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}
        </Box>
      ) : showFeedback ? (
        <Box sx={{ p: 3 }}>
          <Box sx={{
            ...cardSx(currentFeedback?.explanationScore === 1 ? 'green' : 'yellow'), mb: 3, textAlign: 'center',
          }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
              {currentFeedback?.explanationScore === 1
                ? <CheckCircleIcon sx={{ fontSize: 56, color: P.green.border }} />
                : <CancelIcon sx={{ fontSize: 56, color: P.yellow.border }} />}
              <Typography variant="h4" fontWeight="bold">
                {currentFeedback?.explanationScore === 1 ? 'Correct! +1 Point' : 'Incorrect! +0 Points'}
              </Typography>
            </Stack>
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', borderRadius: '16px', p: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Term: {currentTerm.word.toUpperCase()}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>Expected: {currentTerm.explanation}</Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Your explanation: "{currentFeedback?.userExplanation}"</Typography>
            </Box>
            <Box sx={{ bgcolor: currentFeedback?.explanationScore === 1 ? P.green.bg : P.yellow.bg, border: `1px solid ${currentFeedback?.explanationScore === 1 ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
              <Typography variant="h6" fontWeight={500}>💬 Feedback: {currentFeedback?.feedback}</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleNextTerm}
              sx={{
                ...cardSx('blue'), cursor: 'pointer', px: 6, py: 2,
                fontSize: '1.2rem', fontWeight: 'bold', color: P.blue.border, transition: 'all 0.2s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
              }}
            >
              {currentTermIndex < TERMS.length - 1 ? 'Next Term →' : 'See Results →'}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Box sx={{ ...cardSx('green'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>✓ Correct spelling! (+1 Point) Now write your explanation with video reference.</Typography>
          </Box>
          <Box sx={{ ...cardSx('yellow'), mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">Term: <span style={{ color: P.purple.border }}>{currentTerm.word.toUpperCase()}</span></Typography>
            <Typography variant="h6" sx={{ mt: 1, fontStyle: 'italic' }}>Expected: {currentTerm.explanation}</Typography>
          </Box>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">📝 Write your explanation:</Typography>
            <TextField fullWidth multiline rows={5} value={userExplanation} onChange={(e) => setUserExplanation(e.target.value)}
              placeholder="Explain what this term means and include video references (Video 1 or Video 2)..."
              variant="outlined" disabled={evaluating}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: P.blue.border, borderWidth: 2 } } }}
            />
            <Typography variant="body1" fontWeight={600} sx={{ display: 'block', mt: 1 }}>
              {userExplanation.length} characters • Minimum 10 characters (aim for 30+)
            </Typography>
          </Box>
          <Stack direction="row" spacing={3} justifyContent="center">
            <Box component="button" onClick={handleSkipExplanation} disabled={evaluating}
              sx={{
                ...cardSx('red'), cursor: evaluating ? 'not-allowed' : 'pointer', opacity: evaluating ? 0.5 : 1,
                px: 4, py: 2, fontWeight: 'bold', fontSize: '1.1rem', color: P.red.border, transition: 'all 0.2s',
                '&:hover': !evaluating ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.red.shadow}` } : {}
              }}
            >
              Skip Explanation →
            </Box>
            <Box component="button" onClick={handleSubmitExplanation} disabled={!canSubmitExplanation || evaluating}
              sx={{
                ...cardSx('green'), cursor: (!canSubmitExplanation || evaluating) ? 'not-allowed' : 'pointer', opacity: (!canSubmitExplanation || evaluating) ? 0.5 : 1,
                px: 4, py: 2, fontWeight: 'bold', fontSize: '1.1rem', color: P.green.border, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': (canSubmitExplanation && !evaluating) ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {}
              }}
            >
              {evaluating ? <><CircularProgress size={16} sx={{ color: P.green.border }} /> Evaluating...</> : <><AutoAwesomeIcon fontSize="small" /> {canSubmitExplanation ? 'Submit Explanation' : 'Write at least 10 characters'}</>}
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
