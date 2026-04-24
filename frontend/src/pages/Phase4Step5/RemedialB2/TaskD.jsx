import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial B2 - Task D: Spell Quest
 * Spelling game - spell 6 terms from scrambled letters, then explain
 * Score: Correct spelling (1 point) + explanation (1 point) = 2 points per term
 * Total: 12 points maximum
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

const TERMS = [
  { id: 1, word: 'gatefold', explanation: 'Folded layout for space', expectedConcepts: ['fold', 'layout', 'space', 'design'] },
  { id: 2, word: 'animation', explanation: 'Moving images for dynamism', expectedConcepts: ['moving', 'image', 'dynamic', 'motion'] },
  { id: 3, word: 'jingle', explanation: 'Catchy tune for memorability', expectedConcepts: ['catchy', 'tune', 'memorable', 'song', 'music'] },
  { id: 4, word: 'dramatisation', explanation: 'Scripted story for emotion', expectedConcepts: ['script', 'story', 'emotion', 'drama', 'act'] },
  { id: 5, word: 'sketch', explanation: 'Plan drawing for video', expectedConcepts: ['plan', 'draw', 'design', 'outline'] },
  { id: 6, word: 'clip', explanation: 'Short segment in video', expectedConcepts: ['short', 'segment', 'part', 'video'] },
]

const TIME_PER_TERM = 60

const LETTER_COLORS = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#3498db', '#8e44ad', '#e91e63', '#00bcd4']

export default function Phase4Step5RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TERM)
  const [scrambledLetters, setScrambledLetters] = useState([])
  const [spelledWord, setSpelledWord] = useState([])
  const [spellingComplete, setSpellingComplete] = useState(false)
  const [spellingSkipped, setSpellingSkipped] = useState(false)
  const [userExplanation, setUserExplanation] = useState('')
  const [results, setResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [animationOffset, setAnimationOffset] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)

  const currentTerm = TERMS[currentTermIndex]

  useEffect(() => {
    if (gameStarted && currentTerm && !spellingComplete && !spellingSkipped) {
      const letters = currentTerm.word.split('').map((letter, index) => ({ letter, id: `${letter}-${index}`, originalIndex: index }))
      setScrambledLetters([...letters].sort(() => Math.random() - 0.5))
      setSpelledWord([])
    }
  }, [currentTermIndex, gameStarted])

  useEffect(() => {
    if (gameStarted && !spellingComplete && !spellingSkipped && !gameFinished) {
      const interval = setInterval(() => setAnimationOffset(prev => (prev + 1) % 100), 50)
      return () => clearInterval(interval)
    }
  }, [gameStarted, spellingComplete, spellingSkipped, gameFinished])

  useEffect(() => {
    if (!gameStarted || gameFinished || spellingComplete || spellingSkipped) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleTimeUp() }
  }, [timeLeft, gameStarted, gameFinished, spellingComplete, spellingSkipped])

  const handleTimeUp = () => {
    results.push({ termId: currentTerm.id, word: currentTerm.word, spellingScore: 0, explanationScore: 0, userSpelling: spelledWord.map(l => l.letter).join(''), userExplanation: '', feedback: 'Time ran out!' })
    moveToNextTerm()
  }

  const handleLetterClick = (letterObj) => {
    const isAvailable = scrambledLetters.some(l => l.id === letterObj.id)
    if (!isAvailable) return
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

  const handleSkipSpelling = () => {
    setSpellingSkipped(true); setSpellingComplete(true)
    const correctLetters = currentTerm.word.split('').map((letter, index) => ({ letter, id: `${letter}-${index}`, originalIndex: index }))
    setSpelledWord(correctLetters)
  }

  const handleSubmitExplanation = async () => {
    setEvaluating(true)
    const userWord = spelledWord.map(l => l.letter).join('')
    const spellingScore = (!spellingSkipped && userWord === currentTerm.word) ? 1 : 0

    try {
      const response = await fetch('/api/phase4/step5/remedial/evaluate-spell-explanation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ term: currentTerm.word, explanation: userExplanation, expectedConcepts: currentTerm.expectedConcepts })
      })
      const data = await response.json()
      if (data.success) {
        if (data.score === 1) setScore(score + 1)
        const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore: data.score, userSpelling: userWord, userExplanation, feedback: data.feedback, skipped: spellingSkipped }
        results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
      } else {
        const explanationScore = checkExplanationFallback(userExplanation)
        if (explanationScore === 1) setScore(score + 1)
        const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore, userSpelling: userWord, userExplanation, feedback: explanationScore ? 'Good explanation!' : 'Needs more detail and key concepts.', skipped: spellingSkipped }
        results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const explanationScore = checkExplanationFallback(userExplanation)
      if (explanationScore === 1) setScore(score + 1)
      const resultData = { termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore, userSpelling: userWord, userExplanation, feedback: explanationScore ? 'Good explanation!' : 'Needs more detail and key concepts.', skipped: spellingSkipped }
      results.push(resultData); setCurrentFeedback(resultData); setShowFeedback(true)
    }
    setEvaluating(false)
  }

  const checkExplanationFallback = (explanation) => {
    const lower = explanation.toLowerCase().trim()
    if (lower.length < 10) return 0
    const matched = currentTerm.expectedConcepts.filter(c => lower.includes(c.toLowerCase()))
    return matched.length >= 2 ? 1 : 0
  }

  const handleSkipExplanation = () => {
    const userWord = spelledWord.map(l => l.letter).join('')
    const spellingScore = (!spellingSkipped && userWord === currentTerm.word) ? 1 : 0
    results.push({ termId: currentTerm.id, word: currentTerm.word, spellingScore, explanationScore: 0, userSpelling: userWord, userExplanation: '', feedback: 'Skipped explanation', skipped: spellingSkipped })
    moveToNextTerm()
  }

  const handleNextTerm = () => { setShowFeedback(false); setCurrentFeedback(null); moveToNextTerm() }

  const moveToNextTerm = () => {
    if (currentTermIndex < TERMS.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1); setTimeLeft(TIME_PER_TERM); setSpellingComplete(false); setSpellingSkipped(false); setUserExplanation('')
    } else { finishGame() }
  }

  const finishGame = () => {
    setGameFinished(true)
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    sessionStorage.setItem('phase4_step5_remedial_b2_taskD_score', totalScore)
    logTaskCompletion(totalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'D', score: finalScore, max_score: 12, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/b2/taskE')
  window.__remedialSkip = handleContinue
  const canCheckSpelling = spelledWord.length === currentTerm?.word.length
  const canSubmitExplanation = userExplanation.trim().length >= 10

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task D: Spell Quest 📝</Typography>
              <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Spell words from scrambled letters, then explain them!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="LILIA" message="Welcome to Spell Quest! 📝 For each term, you'll see a clue and scrambled letters. Click them in the correct order to spell the word (like Sushi Spell!), then write an explanation. Each term has 2 points: 1 for correct spelling + 1 for good explanation. If you can't spell it, you can skip spelling but you must still write an explanation. Total: 12 points maximum! Ready? Let's quest! 🚀" />
            </Box>
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 5, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '5rem', mb: 2 }}>📝</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Spell Quest Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.purple.border, mb: 3 }}>6 Terms · 60 Seconds Each · Spell + Explain</Typography>
              <Box component="button" onClick={() => setGameStarted(true)} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 6, py: 2, cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                START QUEST! 🎮
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished) {
    const totalScore = results.reduce((sum, r) => sum + r.spellingScore + r.explanationScore, 0)
    const perfectScore = totalScore === 12
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task D: Spell Quest - Results 🏆</Typography>
            </Box>

            <Box sx={{ bgcolor: perfectScore ? P.green.bg : P.purple.bg, border: `2px solid ${perfectScore ? P.green.border : P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.purple.shadow}`, p: 5, textAlign: 'center', mb: 3 }}>
              <Typography sx={{ fontSize: '4rem', mb: 1 }}>🏆</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.purple.shadow }}>{perfectScore ? 'Perfect Quest! 🎉' : 'Quest Complete! 🎊'}</Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.purple.shadow }}>{totalScore} / 12</Typography>
                <Typography variant="body1" sx={{ color: perfectScore ? P.green.border : P.purple.border }}>Points Earned</Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Quest Review</Typography>
              <Stack spacing={2}>
                {results.map((result, index) => {
                  const spellingOk = result.spellingScore === 1
                  const explanationOk = result.explanationScore === 1
                  const totalOk = spellingOk && explanationOk
                  return (
                    <Box key={index} sx={{ bgcolor: totalOk ? P.green.bg : spellingOk || explanationOk ? P.yellow.bg : P.red.bg, border: `2px solid ${totalOk ? P.green.border : spellingOk || explanationOk ? P.yellow.border : P.red.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${totalOk ? P.green.shadow : spellingOk || explanationOk ? P.yellow.shadow : P.red.shadow}`, p: 3 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: totalOk ? P.green.shadow : spellingOk || explanationOk ? P.yellow.shadow : P.red.shadow }}>
                          Term {index + 1}: {result.word}
                        </Typography>
                        <Box sx={{ bgcolor: totalOk ? P.green.border : spellingOk || explanationOk ? P.yellow.border : P.red.border, borderRadius: '8px', px: 1, py: 0.25 }}>
                          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>{result.spellingScore + result.explanationScore}/2 pts</Typography>
                        </Box>
                        {result.skipped && (
                          <Box sx={{ bgcolor: P.red.border, borderRadius: '8px', px: 1, py: 0.25 }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>Skipped Spelling</Typography>
                          </Box>
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ color: totalOk ? P.green.shadow : spellingOk || explanationOk ? P.yellow.shadow : P.red.shadow, mb: 0.5 }}>
                        Spelling: {spellingOk ? '✓ Correct (+1)' : result.skipped ? '⊘ Skipped (+0)' : '✗ Incorrect (+0)'}
                        {!spellingOk && !result.skipped && <> — Correct: <strong>{result.word}</strong></>}
                      </Typography>
                      <Typography variant="body2" sx={{ color: totalOk ? P.green.shadow : spellingOk || explanationOk ? P.yellow.shadow : P.red.shadow, mb: 0.5 }}>
                        Explanation: {explanationOk ? '✓ Good (+1)' : '✗ Needs improvement (+0)'}
                      </Typography>
                      {result.userExplanation && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>"{result.userExplanation}"</Typography>
                      )}
                      <Typography variant="body2" sx={{ color: totalOk ? P.green.shadow : spellingOk || explanationOk ? P.yellow.shadow : P.red.shadow, mt: 0.5 }}>
                        💬 Feedback: {result.feedback}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="center">
              <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 6, py: 2, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                Continue to Task E →
              </Box>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#2d5016' }}>
      {/* Header bar */}
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', borderBottom: '4px solid #8b4513', p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.red.border }}>Time: {timeLeft}s</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score}</Typography>
          </Box>

          <Stack direction="row" spacing={0.5}>
            {TERMS.map((_, index) => (
              <Box key={index} sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: index < currentTermIndex ? P.purple.border : index === currentTermIndex ? P.orange.border : '#bdc3c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid white' }}>
                {index + 1}
              </Box>
            ))}
          </Stack>

          <Box sx={{ bgcolor: P.orange.border, borderRadius: '12px', px: 3, py: 1.5 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>Term: {currentTermIndex + 1}</Typography>
          </Box>
        </Stack>
        <LinearProgress variant="determinate" value={(timeLeft / TIME_PER_TERM) * 100} sx={{ mt: 1.5, height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.2)', '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 15 ? P.red.border : P.green.border } }} />
      </Box>

      {!spellingComplete ? (
        <Box>
          {/* Clue card */}
          <Box sx={{ bgcolor: '#fffacd', border: '4px solid #f0e68c', borderRadius: '12px', mx: 3, my: 3, p: 4, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2c3e50', textAlign: 'center' }}>{currentTerm.explanation}</Typography>
          </Box>

          {/* Scrolling letter chain */}
          <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#34495e', py: 3, my: 3, borderTop: '8px solid #2c3e50', borderBottom: '8px solid #2c3e50' }}>
            <Box sx={{ display: 'flex', gap: 2, px: 2, transform: `translateX(-${animationOffset}px)`, transition: 'transform 0.05s linear' }}>
              {[...scrambledLetters, ...scrambledLetters, ...scrambledLetters].map((letterObj, index) => {
                const isAvailable = scrambledLetters.some(l => l.id === letterObj.id)
                return (
                  <Box key={`${letterObj.id}-${index}`} onClick={() => handleLetterClick(letterObj)}
                    sx={{ minWidth: 80, height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: isAvailable ? LETTER_COLORS[index % LETTER_COLORS.length] : '#95a5a6', color: 'white', cursor: isAvailable ? 'pointer' : 'not-allowed', borderRadius: '50%', border: '4px solid white', flexShrink: 0, opacity: isAvailable ? 1 : 0.5, '&:hover': { transform: isAvailable ? 'scale(1.2)' : 'none' } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: 'Arial Black' }}>{letterObj.letter.toUpperCase()}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>

          {/* Answer area */}
          <Box sx={{ bgcolor: '#d4a574', borderTop: '8px solid #8b6f47', p: 3, minHeight: 180 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Box sx={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f39c12', borderRadius: '8px', cursor: 'pointer' }}>
                <Typography variant="h4">🔊</Typography>
              </Box>

              <Box sx={{ flex: 1, bgcolor: '#e8d5b7', borderRadius: '12px', border: '4px solid #c9a96e', p: 2, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                {spelledWord.length === 0 ? (
                  <Typography variant="h5" sx={{ color: '#8b7355', fontStyle: 'italic' }}>Click letters above to spell the word...</Typography>
                ) : (
                  spelledWord.map((letterObj, index) => (
                    <Box key={index} sx={{ width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'white', border: '3px solid #8e44ad', borderRadius: '8px' }}>
                      <Typography variant="h3" fontWeight="bold" sx={{ color: '#2c3e50', fontFamily: 'Arial Black' }}>{letterObj.letter.toUpperCase()}</Typography>
                    </Box>
                  ))
                )}
              </Box>

              <Stack spacing={1}>
                {[
                  { label: 'Submit', onClick: handleCheckSpelling, disabled: !canCheckSpelling, bg: canCheckSpelling ? '#27ae60' : '#95a5a6' },
                  { label: 'Clear', onClick: handleUndo, disabled: spelledWord.length === 0, bg: '#e67e22' },
                  { label: 'Skip', onClick: handleSkipSpelling, disabled: false, bg: '#e74c3c' },
                ].map(btn => (
                  <Box key={btn.label} component="button" onClick={btn.onClick} disabled={btn.disabled}
                    sx={{ width: 120, py: 1.5, bgcolor: btn.bg, color: 'white', border: 'none', borderRadius: '8px', cursor: btn.disabled ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1.1rem', opacity: btn.disabled ? 0.6 : 1 }}>
                    {btn.label}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Box>
      ) : showFeedback ? (
        <Box sx={{ p: 3 }}>
          <Box sx={{ bgcolor: currentFeedback?.explanationScore === 1 ? P.green.bg : P.yellow.bg, border: `3px solid ${currentFeedback?.explanationScore === 1 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '3rem' }}>{currentFeedback?.explanationScore === 1 ? '✅' : '⚠️'}</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow }}>
                {currentFeedback?.explanationScore === 1 ? 'Correct! +1 Point' : 'Incorrect! +0 Points'}
              </Typography>
            </Stack>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#2c3e50', mb: 1 }}>Term: {currentTerm.word.toUpperCase()}</Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#34495e' }}>Your explanation: "{currentFeedback?.userExplanation}"</Typography>
            </Box>
            <Box sx={{ bgcolor: currentFeedback?.explanationScore === 1 ? P.green.bg : P.yellow.bg, border: `2px solid ${currentFeedback?.explanationScore === 1 ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
              <Typography variant="h6" sx={{ color: currentFeedback?.explanationScore === 1 ? P.green.shadow : P.yellow.shadow }}>
                💬 Feedback: {currentFeedback?.feedback}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" justifyContent="center">
            <Box component="button" onClick={handleNextTerm}
              sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, px: 8, py: 2, cursor: 'pointer', fontSize: '1.4rem', fontWeight: 'bold', color: P.blue.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}>
              {currentTermIndex < TERMS.length - 1 ? 'Next Term →' : 'See Results →'}
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Box sx={{ bgcolor: spellingSkipped ? P.yellow.bg : P.green.bg, border: `2px solid ${spellingSkipped ? P.yellow.border : P.green.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${spellingSkipped ? P.yellow.shadow : P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: spellingSkipped ? P.yellow.shadow : P.green.shadow }}>
              {spellingSkipped
                ? `⊘ You skipped spelling (+0 Points). The word is: ${currentTerm.word.toUpperCase()}. Now write your explanation to earn 1 point.`
                : '✓ Correct spelling! (+1 Point) Now write your explanation to earn the second point.'}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: '#fffacd', border: '3px solid #f0e68c', borderRadius: '12px', p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>Term: <span style={{ color: '#8e44ad' }}>{currentTerm.word.toUpperCase()}</span></Typography>
          </Box>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 2 }}>📝 Write your explanation:</Typography>
            <TextField fullWidth multiline rows={5} value={userExplanation} onChange={(e) => setUserExplanation(e.target.value)} placeholder={`Explain what "${currentTerm.word}" means in advertising context...`} variant="outlined" disabled={evaluating} />
            <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow }}>{userExplanation.length} characters · Minimum 10 characters</Typography>
          </Box>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Box component="button" onClick={handleSkipExplanation} disabled={evaluating}
              sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.red.shadow}`, px: 4, py: 1.5, cursor: evaluating ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.red.shadow, opacity: evaluating ? 0.6 : 1 }}>
              Skip Explanation →
            </Box>
            <Box component="button" onClick={handleSubmitExplanation} disabled={!canSubmitExplanation || evaluating}
              sx={{ bgcolor: canSubmitExplanation && !evaluating ? P.green.bg : P.yellow.bg, border: `2px solid ${canSubmitExplanation && !evaluating ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${canSubmitExplanation && !evaluating ? P.green.shadow : P.yellow.shadow}`, px: 4, py: 1.5, cursor: canSubmitExplanation && !evaluating ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: canSubmitExplanation && !evaluating ? P.green.shadow : P.yellow.shadow, opacity: canSubmitExplanation && !evaluating ? 1 : 0.6 }}>
              {evaluating ? 'Evaluating...' : canSubmitExplanation ? 'Submit Explanation ✨' : 'Write at least 10 characters'}
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
