import React, { useState, useEffect } from 'react'
import { Box, Typography, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const LIGHT = {
  cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}

const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

// Distinct answer tile palettes
const ANSWER_PALETTES = [
  { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C', text: '#B71C1C' },
  { bg: '#BBDEFB', border: '#1565C0', shadow: '#0D47A1', text: '#0D47A1' },
  { bg: '#FFF9C4', border: '#F57F17', shadow: '#E65100', text: '#E65100' },
  { bg: '#C8E6C9', border: '#2E7D32', shadow: '#1B5E20', text: '#1B5E20' },
]

const KahootQuizGame = ({ questions = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [userPoints, setUserPoints] = useState(0)
  const [aiPeers, setAiPeers] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  useEffect(() => {
    const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa']
    setAiPeers(names.map(name => ({ name, points: 0, avatar: name[0] })))
  }, [])

  useEffect(() => {
    if (!showResult && !gameComplete && currentQuestion) {
      setTimeLeft(20)
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timer); handleTimeUp(); return 0 }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentQuestionIndex, showResult, gameComplete])

  const simulateAiAnswers = () => {
    setAiPeers(peers => peers.map(peer => {
      const correct = Math.random() < 0.6
      return { ...peer, points: peer.points + (correct ? 1000 + Math.floor(Math.random() * 500) : 0), lastCorrect: correct }
    }))
  }

  const moveToNext = (newScore, newPoints, newAnswered) => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(i => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setGameComplete(true)
      onComplete?.({ score: newScore, totalQuestions, points: newPoints, answeredQuestions: newAnswered, completed: true })
    }
  }

  const handleTimeUp = () => {
    setShowResult(true)
    simulateAiAnswers()
    setTimeout(() => moveToNext(score, userPoints, answeredQuestions), 3000)
  }

  const handleAnswerClick = (index) => {
    if (showResult || selectedAnswer !== null) return
    setSelectedAnswer(index)
    const correct = index === currentQuestion.correctIndex
    const speedBonus = Math.floor((timeLeft / 20) * 500)
    const points = correct ? 1000 + speedBonus : 0
    const newScore = correct ? score + 1 : score
    const newPoints = userPoints + points
    if (correct) setScore(newScore)
    setUserPoints(newPoints)
    setShowResult(true)
    simulateAiAnswers()
    const newAnswered = [...answeredQuestions, {
      question: currentQuestion.question,
      selectedAnswer: currentQuestion.answers[index],
      correctAnswer: currentQuestion.answers[currentQuestion.correctIndex],
      isCorrect: correct, explanation: currentQuestion.explanation, points,
    }]
    setAnsweredQuestions(newAnswered)
    setTimeout(() => moveToNext(newScore, newPoints, newAnswered), 3000)
  }

  const getLeaderboard = () => [
    { name: 'You', points: userPoints, avatar: '👤', isUser: true },
    ...aiPeers
  ].sort((a, b) => b.points - a.points)

  if (gameComplete) {
    const leaderboard = getLeaderboard()
    const userRank = leaderboard.findIndex(p => p.isUser) + 1
    return (
      <Box sx={{ ...clay(D.purple), p: { xs: 3, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <EmojiEventsIcon sx={{ fontSize: 72, color: D.yellow.border, mb: 1 }} />
          <Typography variant="h4" fontWeight={900} sx={{ color: D.heading, mb: 0.5 }}>Quiz Complete!</Typography>
          <Typography fontWeight={700} sx={{ color: D.body }}>Score: {score} / {totalQuestions} · Points: {userPoints.toLocaleString()}</Typography>
          <Typography fontWeight={700} sx={{ color: D.purple.border, mt: 0.5 }}>You placed #{userRank} of {leaderboard.length}!</Typography>
        </Box>
        <Box sx={{ ...clay(D.blue), p: 2 }}>
          <Typography fontWeight={800} sx={{ color: D.blue.border, mb: 1.5, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: 1 }}>Final Leaderboard</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {leaderboard.map((player, i) => (
              <Box key={i} sx={{ ...clay(player.isUser ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }), px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={900} sx={{ color: i < 3 ? D.yellow.border : D.muted, minWidth: 28 }}>#{i + 1}</Typography>
                  <Typography fontWeight={player.isUser ? 800 : 500} sx={{ color: D.body }}>{player.avatar} {player.name}</Typography>
                </Box>
                <Typography fontWeight={800} sx={{ color: D.blue.border }}>{player.points.toLocaleString()}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ ...clay(D.purple), p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Typography fontWeight={800} sx={{ color: D.heading }}>
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon sx={{ color: timeLeft <= 5 ? D.red.border : D.purple.border, fontSize: 22 }} />
            <Typography fontWeight={900} sx={{ color: timeLeft <= 5 ? D.red.border : D.heading, fontSize: '1.3rem', animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.2)' } } }}>
              {timeLeft}
            </Typography>
          </Box>
          <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`, fontWeight: 800, fontSize: '0.85rem', color: D.yellow.border }}>
            {userPoints.toLocaleString()} pts
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={(timeLeft / 20) * 100} sx={{ height: 8, borderRadius: '6px', bgcolor: D.divider, '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 5 ? D.red.border : D.green.border, borderRadius: '6px' } }} />
      </Box>

      {/* Question */}
      <Box sx={{ ...clay(D.teal), p: 3, mb: 3, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, textAlign: 'center' }}>
          {currentQuestion?.question}
        </Typography>
      </Box>

      {/* Answer grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        {currentQuestion?.answers.map((answer, i) => {
          const isCorrect = i === currentQuestion.correctIndex
          const isSelected = selectedAnswer === i
          const showCorrect = showResult && isCorrect
          const showWrong = showResult && isSelected && !isCorrect
          const p = ANSWER_PALETTES[i % ANSWER_PALETTES.length]
          const activeBg = showCorrect ? D.green.bg : showWrong ? D.red.bg : p.bg
          const activeBorder = showCorrect ? D.green.border : showWrong ? D.red.border : p.border
          const activeShadow = showCorrect ? D.green.shadow : showWrong ? D.red.shadow : p.shadow

          return (
            <Box
              key={i}
              onClick={() => handleAnswerClick(i)}
              sx={{
                bgcolor: activeBg, border: `2px solid ${activeBorder}`, borderRadius: '16px',
                boxShadow: `4px 4px 0 ${activeShadow}`,
                p: { xs: 2, md: 3 }, cursor: showResult ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                minHeight: 80, textAlign: 'center', transition: 'all 0.15s',
                '&:hover': !showResult ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${activeShadow}` } : {},
              }}
            >
              {showCorrect && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 28 }} />}
              {showWrong && <CancelIcon sx={{ color: D.red.border, fontSize: 28 }} />}
              <Typography fontWeight={800} sx={{ color: activeBorder, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                {answer}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* Explanation */}
      {showResult && (
        <Box sx={{ ...clay(selectedAnswer === currentQuestion?.correctIndex ? D.green : D.red), p: 2.5 }}>
          <Typography fontWeight={800} sx={{ color: selectedAnswer === currentQuestion?.correctIndex ? D.green.border : D.red.border, mb: 0.5 }}>
            {selectedAnswer === currentQuestion?.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
          </Typography>
          <Typography variant="body2" sx={{ color: D.body }}>
            <strong>Explanation:</strong> {currentQuestion?.explanation}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default KahootQuizGame
