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
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task D: Spell & Explain
 * Spelling game - spell 6 terms from scrambled letters, then explain
 */

const TERMS = [
  { id: 1, word: 'hashtag', clue: 'Symbol for categorizing posts', expectedConcepts: ['symbol', 'categorize', 'search', 'discovery'] },
  { id: 2, word: 'caption', clue: 'Text describing an image', expectedConcepts: ['text', 'describe', 'explain', 'context'] },
  { id: 3, word: 'viral', clue: 'Content spreading rapidly online', expectedConcepts: ['spread', 'fast', 'popular', 'shares'] },
  { id: 4, word: 'engagement', clue: 'User interaction with content', expectedConcepts: ['interaction', 'likes', 'comments', 'shares'] },
  { id: 5, word: 'emoji', clue: 'Small icon expressing emotion', expectedConcepts: ['icon', 'emotion', 'feeling', 'visual'] },
  { id: 6, word: 'story', clue: '24-hour temporary post', expectedConcepts: ['24-hour', 'temporary', 'disappear', 'short'] }
]

const TIME_PER_TERM = 45

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 4, context: 'remedial_b2' })
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
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
    purple: { bg: '#F5F3FF', border: '#8B5CF6', shadow: '#6D28D9' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
    purple: { bg: '#2E1065', border: '#A78BFA', shadow: '#4C1D95' },
  }
  const P = isDark ? DARK : LIGHT

  const currentTerm = TERMS[currentTermIndex]

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
      setScore(score + 1); setSpellingComplete(true)
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
      const response = await fetch('/api/phase4/remedial/evaluate-spell-explanation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B2', term: currentTerm.word, explanation: userExplanation, expectedConcepts: currentTerm.expectedConcepts })
      })
      const data = await response.json()
      if (data.success) {
        if (data.score === 1) setScore(score + 1)
        const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore: data.score, userSpelling: userWord, userExplanation, feedback: data.feedback }
        results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
      } else {
        const explanationScore = userExplanation.trim().length >= 15 ? 1 : 0
        if (explanationScore === 1) setScore(score + 1)
        const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore, userSpelling: userWord, userExplanation, feedback: explanationScore ? 'Good explanation!' : 'Needs more detail.' }
        results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
      }
    } catch (error) {
      const explanationScore = userExplanation.trim().length >= 15 ? 1 : 0
      if (explanationScore === 1) setScore(score + 1)
      const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore, userSpelling: userWord, userExplanation, feedback: explanationScore ? 'Good explanation!' : 'Needs more detail.' }
      results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
    }
    setEvaluating(false)
  }

  const handleSkipExplanation = () => {
    const userWord = spelledWord.map(l => l.letter).join('')
    results.push({ termId: currentTerm.id, word: currentTerm.word, spellingScore: userWord === currentTerm.word ? 1 : 0, explanationScore: 0, userSpelling: userWord, userExplanation: '', feedback: 'Skipped explanation' })
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
    const finalScore = Math.round((totalScore / 12) * 10)
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskD_score', finalScore)
    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'D', step: 1, score: finalScore, max_score: 10, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => `0:${seconds.toString().padStart(2, '0')}`
  const canCheckSpelling = spelledWord.length === currentTerm?.word.length
  const canSubmitExplanation = userExplanation.trim().length >= 10

  const letterColors = ['#E53E3E','#DD6B20','#D69E2E','#38A169','#3182CE','#805AD5','#D53F8C','#0097A7']

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 - Step 1: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B2 - Task D: Spell & Explain</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>Spell words from scrambled letters, then explain them!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS_MABROUKI" message="Welcome to Spell & Explain! For each term, you'll see scrambled letters. Click them in the correct order to spell the word, then write an explanation. Each term has 2 points: 1 for correct spelling + 1 for good explanation. Total: 12 points! Ready?" />
            </Box>
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, textAlign: 'center' }}>
              <SpellcheckIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>Spell & Explain Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 4 }}>6 Terms • 45 Seconds Each • Spell + Explain</Typography>
              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>START CHALLENGE!</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    const finalScore = Math.round((totalScore / 12) * 10)
    const perfectScore = finalScore === 10
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Level B2 - Task D: Spell & Explain - Results</Typography>
            </Box>
            <Box sx={{ bgcolor: perfectScore ? P.green.bg : P.yellow.bg, border: `2px solid ${perfectScore ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 70, color: perfectScore ? P.green.shadow : P.yellow.shadow, mb: 1 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{perfectScore ? 'Perfect Score!' : 'Challenge Complete!'}</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{finalScore} / 10</Typography>
                <Typography sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>Points Earned</Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {results.map((result, index) => {
                  const spellingCorrect = result.spellingScore === 1
                  const explanationCorrect = result.explanationScore === 1
                  const totalCorrect = spellingCorrect && explanationCorrect
                  const cardC = totalCorrect ? P.green : (spellingCorrect || explanationCorrect ? P.yellow : P.red)
                  return (
                    <Box key={index} sx={{ bgcolor: cardC.bg, border: `2px solid ${cardC.border}`, borderRadius: '12px', p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: cardC.shadow }}>Term {index + 1}: {result.word}</Typography>
                        {totalCorrect ? <CheckCircleIcon sx={{ color: cardC.shadow }} /> : <CancelIcon sx={{ color: cardC.shadow }} />}
                        <Box sx={{ bgcolor: cardC.bg, border: `1px solid ${cardC.border}`, borderRadius: '20px', px: 1 }}>
                          <Typography variant="caption" fontWeight="bold" sx={{ color: cardC.shadow }}>{result.spellingScore + result.explanationScore}/2 pts</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '8px', p: 1.5, mb: 1 }}>
                        <Typography variant="body2" sx={{ color: cardC.shadow, fontWeight: 600 }}>Spelling: {spellingCorrect ? 'Correct ✓' : `Incorrect — correct: ${result.word}`}</Typography>
                        <Typography variant="body2" sx={{ color: cardC.shadow }}>You spelled: {result.userSpelling || '(no answer)'}</Typography>
                      </Box>
                      <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '8px', p: 1.5 }}>
                        <Typography variant="body2" sx={{ color: cardC.shadow, fontWeight: 600 }}>Explanation: {explanationCorrect ? 'Good ✓' : 'Needs improvement'}</Typography>
                        <Typography variant="body2" sx={{ color: cardC.shadow, fontStyle: 'italic', mb: 0.5 }}>"{result.userExplanation || '(no explanation)'}"</Typography>
                        <Typography variant="caption" sx={{ color: cardC.shadow }}>Feedback: {result.feedback}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/b2/taskE')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task E</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#0a1628' : '#2d5016', py: 0 }}>
      {/* Game Header */}
      <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)', p: 2, borderBottom: `4px solid ${P.orange.border}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 900, mx: 'auto' }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <TimerIcon sx={{ color: timeLeft <= 10 ? P.red.shadow : P.orange.shadow, fontSize: 18 }} />
              <Typography variant="h6" sx={{ color: timeLeft <= 10 ? P.red.shadow : P.orange.shadow, fontWeight: 'bold' }}>{formatTime(timeLeft)}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Score: {score}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {TERMS.map((_, index) => (
              <Box key={index} sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: index < currentTermIndex ? P.purple.border : index === currentTermIndex ? P.orange.border : (isDark ? '#333' : '#ccc'), display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid white` }}>
                <Typography variant="caption" fontWeight="bold" sx={{ color: 'white', fontSize: '0.75rem' }}>{index + 1}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', px: 2, py: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Word: {currentTermIndex + 1}</Typography>
          </Box>
        </Box>
      </Box>

      {!spellingComplete ? (
        <Box>
          {/* Clue */}
          <Box sx={{ mx: 'auto', maxWidth: 900, px: 3, my: 3, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3 }}>
            <Typography variant="h4" sx={{ color: P.yellow.shadow, fontWeight: 'bold', textAlign: 'center' }}>{currentTerm?.clue}</Typography>
          </Box>

          {/* Scrolling Letters */}
          <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: isDark ? '#1a2a3a' : '#34495e', py: 3, my: 3, borderTop: '6px solid #2c3e50', borderBottom: '6px solid #2c3e50' }}>
            <Box sx={{ display: 'flex', gap: 2, px: 2, transform: `translateX(-${animationOffset}px)`, transition: 'transform 0.05s linear' }}>
              {[...scrambledLetters, ...scrambledLetters, ...scrambledLetters].map((letterObj, index) => {
                const isAvailable = scrambledLetters.some(l => l.id === letterObj.id)
                return (
                  <Box key={`${letterObj.id}-${index}`} onClick={() => handleLetterClick(letterObj)} sx={{
                    minWidth: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: isAvailable ? 'pointer' : 'not-allowed',
                    borderRadius: '50%', border: '3px solid white', flexShrink: 0, opacity: isAvailable ? 1 : 0.3,
                    bgcolor: isAvailable ? letterColors[index % letterColors.length] : '#666',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: isAvailable ? 'scale(1.2)' : 'scale(1)', zIndex: 10 }
                  }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{letterObj.letter.toUpperCase()}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>

          {/* Answer Area */}
          <Box sx={{ bgcolor: isDark ? '#1a2a1a' : '#d4a574', borderTop: `6px solid ${isDark ? '#2a4a2a' : '#8b6f47'}`, p: 3 }}>
            <Box sx={{ maxWidth: 900, mx: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: 1, bgcolor: isDark ? '#0f1f0f' : '#e8d5b7', borderRadius: '12px', border: `3px solid ${isDark ? '#2a4a2a' : '#c9a96e'}`, p: 2, minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {spelledWord.length === 0 ? (
                  <Typography variant="h6" sx={{ color: isDark ? '#5a7a5a' : '#8b7355', fontStyle: 'italic' }}>Click letters above to spell the word...</Typography>
                ) : (
                  spelledWord.map((letterObj, index) => (
                    <Box key={index} sx={{ width: 62, height: 62, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: isDark ? '#1e3a1e' : 'white', border: `3px solid ${P.purple.border}`, borderRadius: '8px' }}>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow }}>{letterObj.letter.toUpperCase()}</Typography>
                    </Box>
                  ))
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box component="button" onClick={handleCheckSpelling} disabled={!canCheckSpelling} sx={{
                  width: 110, bgcolor: canCheckSpelling ? P.green.bg : (isDark ? '#1a1a1a' : '#e0e0e0'), border: `2px solid ${canCheckSpelling ? P.green.border : '#ccc'}`,
                  borderRadius: '12px', boxShadow: canCheckSpelling ? `2px 2px 0 ${P.green.shadow}` : 'none',
                  py: 1, fontWeight: 700, cursor: canCheckSpelling ? 'pointer' : 'not-allowed', color: canCheckSpelling ? P.green.shadow : '#999',
                  '&:hover': canCheckSpelling ? { transform: 'translate(-1px,-1px)' } : {}
                }}>Submit</Box>
                <Box component="button" onClick={handleUndo} disabled={spelledWord.length === 0} sx={{
                  width: 110, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.orange.shadow}`,
                  py: 1, fontWeight: 700, cursor: spelledWord.length === 0 ? 'not-allowed' : 'pointer', color: P.orange.shadow, opacity: spelledWord.length === 0 ? 0.5 : 1,
                  '&:hover': spelledWord.length > 0 ? { transform: 'translate(-1px,-1px)' } : {}
                }}>Clear</Box>
              </Box>
            </Box>
          </Box>

          {timeLeft <= 10 && (
            <Box sx={{ mx: 3, mt: 2, bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2 }}>
              <Typography sx={{ color: P.red.shadow, fontWeight: 700 }}>Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}
        </Box>
      ) : showFeedback ? (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
          <Box sx={{ bgcolor: currentFeedback?.explanationScore === 1 ? P.green.bg : P.yellow.bg, border: `2px solid ${currentFeedback?.explanationScore === 1 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', mb: 3 }}>
              {currentFeedback?.explanationScore === 1 ? <CheckCircleIcon sx={{ fontSize: 50, color: P.green.shadow }} /> : <CancelIcon sx={{ fontSize: 50, color: P.yellow.shadow }} />}
              <Typography variant="h4" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {currentFeedback?.explanationScore === 1 ? 'Correct! +1 Point' : 'Incorrect! +0 Points'}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold', mb: 1 }}>Term: {currentTerm?.word?.toUpperCase()}</Typography>
              <Typography variant="body1" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow, mb: 1 }}><strong>Clue:</strong> {currentTerm?.clue}</Typography>
              <Typography variant="body1" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow, fontStyle: 'italic' }}><strong>Your explanation:</strong> "{currentFeedback?.userExplanation}"</Typography>
            </Box>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 2 }}>
              <Typography variant="h6" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow, fontWeight: 600 }}>Feedback: {currentFeedback?.feedback}</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleNextTerm} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', color: P.blue.shadow,
              display: 'inline-flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
            }}><ArrowForwardIcon />{currentTermIndex < TERMS.length - 1 ? 'Next Term' : 'See Results'}</Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Correct spelling! (+1 Point) Now write your explanation.</Typography>
          </Box>
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: P.yellow.shadow, fontWeight: 'bold' }}>Term: <span style={{ color: P.purple.shadow }}>{currentTerm?.word?.toUpperCase()}</span></Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow, mt: 0.5, fontStyle: 'italic' }}>Clue: {currentTerm?.clue}</Typography>
          </Box>
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>Write your explanation:</Typography>
            <TextField fullWidth multiline rows={5} value={userExplanation} onChange={(e) => setUserExplanation(e.target.value)}
              placeholder="Explain what this term means in social media context..."
              variant="outlined" disabled={evaluating}
              sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#2a1a5e' : 'white', '& fieldset': { borderColor: P.purple.border, borderWidth: 2 }, '&:hover fieldset': { borderColor: P.purple.shadow }, '&.Mui-focused fieldset': { borderColor: P.purple.shadow } } }}
            />
            <Typography variant="body2" sx={{ color: P.purple.shadow, fontWeight: 600 }}>{userExplanation.length} characters • Minimum 10 characters (aim for 30+)</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box component="button" onClick={handleSkipExplanation} disabled={evaluating} sx={{
              bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', px: 3, py: 1.5, fontWeight: 700, cursor: 'pointer', color: P.red.shadow,
              '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.red.shadow}` }
            }}>Skip Explanation</Box>
            <Box component="button" onClick={handleSubmitExplanation} disabled={!canSubmitExplanation || evaluating} sx={{
              bgcolor: canSubmitExplanation && !evaluating ? P.green.bg : (isDark ? '#1a1a1a' : '#e0e0e0'),
              border: `2px solid ${canSubmitExplanation && !evaluating ? P.green.border : '#ccc'}`,
              borderRadius: '12px', boxShadow: canSubmitExplanation ? `3px 3px 0 ${P.green.shadow}` : 'none',
              px: 4, py: 1.5, fontWeight: 700, cursor: canSubmitExplanation && !evaluating ? 'pointer' : 'not-allowed', color: canSubmitExplanation && !evaluating ? P.green.shadow : '#999',
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': canSubmitExplanation && !evaluating ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` } : {}
            }}><AutoAwesomeIcon sx={{ fontSize: 18 }} />{evaluating ? 'Evaluating...' : canSubmitExplanation ? 'Submit Explanation' : 'Write at least 10 characters'}</Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
