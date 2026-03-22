import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, IconButton, LinearProgress, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import CheckIcon from '@mui/icons-material/Check'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task A: Debate Dominion
 * WhatsApp/Messenger-style debate simulation
 * Complete dialogue on video terms with advanced vocabulary
 * Score: +1 for each correct answer (11 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#1a1a2e',
  purple: { bg: '#2d1b4e', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#052e16', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#1e3a5f', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#042f2e', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#F97316', shadow: '#C2410C' },
}

const cardSx = (color) => ({
  bgcolor: color.bg,
  border: `2px solid ${color.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${color.shadow}`,
  p: 3,
})

const WORD_BANK_ORIGINAL = [
  'promotional', 'sell', 'persuasive', 'convince', 'ethos', 'pathos', 'logos',
  'targeted', 'personalized', 'ethical', 'consistent'
]

const AVATARS = {
  'OPPONENT': { color: '#E74C3C', initials: 'OP' },
  'YOU': { color: '#4D96FF', initials: 'ME' }
}

const DIALOGUE_MESSAGES = [
  {
    id: 1,
    sender: 'OPPONENT',
    text: 'Promotional best?',
    type: 'question',
    audio: true
  },
  {
    id: 2,
    sender: 'YOU',
    template: '______ for ______; ______ for ______ with ______ ______ ______.',
    blanks: ['promotional', 'sell', 'persuasive', 'convince', 'ethos', 'pathos', 'logos'],
    type: 'response'
  },
  {
    id: 3,
    sender: 'OPPONENT',
    text: 'What about ethics?',
    type: 'question',
    audio: true
  },
  {
    id: 4,
    sender: 'YOU',
    template: '______ ______ ads ______ if ______.',
    blanks: ['targeted', 'personalized', 'ethical', 'consistent'],
    type: 'response'
  }
]

export default function RemedialC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_c1' })
  const [wordBank] = useState(() => [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5))
  const [selectedWord, setSelectedWord] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages])

  useEffect(() => {
    setTimeout(() => addNextMessage(), 500)
  }, [])

  const addNextMessage = () => {
    if (currentMessageIndex >= DIALOGUE_MESSAGES.length) return
    const message = DIALOGUE_MESSAGES[currentMessageIndex]
    setTimeout(() => {
      setDisplayedMessages(prev => [...prev, {
        ...message, status: message.sender === 'YOU' ? null : 'delivered',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setCurrentMessageIndex(prev => prev + 1)

      if (message.type === 'question' && currentMessageIndex + 1 < DIALOGUE_MESSAGES.length) {
        const nextMessage = DIALOGUE_MESSAGES[currentMessageIndex + 1]
        if (nextMessage.type === 'response') {
          setTimeout(() => {
            setDisplayedMessages(prev => [...prev, {
              ...nextMessage, status: null,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
            setCurrentMessageIndex(prev => prev + 1)
          }, 600)
        }
      }
    }, 800)
  }

  const handleWordClick = (word) => {
    setSelectedWord(word)
    const currentUserMessage = displayedMessages.find(msg => msg.sender === 'YOU' && msg.type === 'response' && !msg.sent)
    if (currentUserMessage) {
      const firstEmptyBlankIndex = currentUserMessage.blanks.findIndex((_, idx) => !answers[`msg${currentUserMessage.id}_blank${idx}`])
      if (firstEmptyBlankIndex !== -1) {
        setAnswers(prev => ({ ...prev, [`msg${currentUserMessage.id}_blank${firstEmptyBlankIndex}`]: word }))
        setSelectedWord(null)
        if (navigator.vibrate) navigator.vibrate(30)
      }
    }
  }

  const handleBlankClick = (messageId, blankIndex) => {
    const key = `msg${messageId}_blank${blankIndex}`
    if (answers[key]) {
      setAnswers(prev => {
        const newAnswers = { ...prev }
        delete newAnswers[key]
        return newAnswers
      })
      if (navigator.vibrate) navigator.vibrate(50)
      return
    }
    if (selectedWord) {
      setAnswers(prev => ({ ...prev, [key]: selectedWord }))
      setSelectedWord(null)
      if (navigator.vibrate) navigator.vibrate(30)
    }
  }

  const handleSendMessage = (messageId) => {
    const message = DIALOGUE_MESSAGES.find(m => m.id === messageId)
    if (!message || !message.blanks) return
    const allFilled = message.blanks.every((_, idx) => answers[`msg${messageId}_blank${idx}`])
    if (!allFilled) return

    let correct = 0
    const correctness = {}
    message.blanks.forEach((correctAnswer, idx) => {
      const userAnswer = answers[`msg${messageId}_blank${idx}`]
      const isCorrect = userAnswer?.toLowerCase() === correctAnswer.toLowerCase()
      correctness[`msg${messageId}_blank${idx}_correct`] = isCorrect
      if (isCorrect) correct++
    })
    setScore(prev => prev + correct)
    setAnswers(prev => ({ ...prev, ...correctness }))

    setDisplayedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: 'sent', sent: true } : msg))
    setTimeout(() => setDisplayedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: 'delivered' } : msg)), 500)
    setTimeout(() => setDisplayedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: 'read' } : msg)), 1000)

    if (currentMessageIndex < DIALOGUE_MESSAGES.length) {
      setTimeout(() => addNextMessage(), 1500)
    } else {
      setTimeout(() => handleComplete(), 2000)
    }
  }

  const handleComplete = () => {
    setCompleted(true)
    sessionStorage.setItem('remedial_step3_c1_taskA_score', score)
    fetch('/api/phase4/remedial/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ level: 'C1', task: 'A', step: 2, score, max_score: 11, completed: true })
    }).catch(err => console.error('Log error:', err))
  }

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const renderMessageContent = (message) => {
    if (message.type === 'question') {
      return (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>{message.text}</Typography>
          {message.audio && <IconButton size="small" onClick={() => playAudio(message.text)} sx={{ ml: 1, p: 0.5 }}><VolumeUpIcon fontSize="small" /></IconButton>}
        </Box>
      )
    }

    if (message.type === 'response') {
      if (message.sent) {
        const parts = message.template.split(/_{3,}/)
        return <Typography variant="body1" sx={{ fontWeight: 500 }}>{parts.map((part, idx) => {
          if (idx < parts.length - 1) {
            const isCorrect = answers[`msg${message.id}_blank${idx}_correct`]
            const color = isCorrect ? '#15803D' : '#B91C1C'
            return (
              <React.Fragment key={idx}>
                {part}
                <strong style={{ color, fontWeight: 'bold' }}>{answers[`msg${message.id}_blank${idx}`]}</strong>
              </React.Fragment>
            )
          }
          return <React.Fragment key={idx}>{part}</React.Fragment>
        })}</Typography>
      }

      const parts = message.template.split(/_{3,}/)
      const allFilled = message.blanks.every((_, idx) => answers[`msg${message.id}_blank${idx}`])

      return (
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, fontSize: '0.75rem' }}>Tap words to complete your message:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>{part}</Typography>
                {idx < parts.length - 1 && (
                  <Box
                    component="button"
                    onClick={() => handleBlankClick(message.id, idx)}
                    sx={{
                      px: 1.5, py: 0.5, minWidth: 80, fontSize: '0.8rem', fontWeight: 'bold',
                      cursor: 'pointer', border: '2px dashed',
                      borderColor: answers[`msg${message.id}_blank${idx}`] ? P.purple.border : '#999',
                      bgcolor: answers[`msg${message.id}_blank${idx}`] ? P.purple.bg : 'transparent',
                      color: answers[`msg${message.id}_blank${idx}`] ? P.purple.shadow : 'text.secondary',
                      borderRadius: '10px',
                      '&:hover': { borderColor: P.purple.border, bgcolor: P.purple.bg }
                    }}
                  >
                    {answers[`msg${message.id}_blank${idx}`] || 'tap here'}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
          {allFilled && (
            <Box
              component="button"
              onClick={() => handleSendMessage(message.id)}
              sx={{
                mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5,
                px: 2, py: 0.75, fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer',
                bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`,
                borderRadius: '12px', boxShadow: `2px 2px 0 ${P.green.shadow}`,
                '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.green.shadow}` }
              }}
            >
              Send <SendIcon sx={{ fontSize: 16 }} />
            </Box>
          )}
        </Box>
      )
    }
  }

  if (completed) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>
                Phase 4 - Step 3: Remedial Activities
              </Typography>
              <Typography variant="h5" sx={{ color: P.purple.border }}>
                Level C1 - Task A: Debate Dominion Complete! 🎯
              </Typography>
            </Box>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" sx={{ color: P.green.shadow, mb: 1 }}>
                {score} / 11
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Points Earned</Typography>
              <Typography variant="body1">Debate Mastery: {((score / 11) * 100).toFixed(0)}% Complete</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={() => navigate('/phase4/step3/remedial/c1/taskB')}
                sx={{
                  px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                  bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Continue to Task B →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 0.5 }}>
              Phase 4 - Step 3: Remedial Activities
            </Typography>
            <Typography variant="h5" sx={{ color: P.purple.border, mb: 0.5 }}>
              Level C1 - Task A: Debate Dominion 🎯
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dominate the debate with precise advertising terminology!
            </Typography>
          </Box>

          {/* Instructor message */}
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to Debate Dominion! 🎯 This is a high-level debate simulation. Read the opponent's arguments and craft your responses using sophisticated advertising terminology. Tap words from the word bank, then tap the blanks to fill your message. Send when complete!" />
          </Box>

          {/* Chat window */}
          <Box sx={{
            border: `2px solid ${P.purple.border}`,
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: `4px 4px 0 ${P.purple.shadow}`,
          }}>
            {/* Chat header */}
            <Box sx={{ bgcolor: P.purple.shadow, color: 'white', p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: P.purple.border, width: 36, height: 36 }}>
                <Typography variant="caption" fontWeight="bold">C1</Typography>
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">Debate Dominion Arena</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.85 }}>You vs. Opponent</Typography>
              </Box>
              <Box sx={{
                px: 1.5, py: 0.25, borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>{score}/11</Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{
              p: 2, minHeight: 400, maxHeight: 500, overflowY: 'auto',
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#F5F0FF',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(168,85,247,.04) 10px, rgba(168,85,247,.04) 20px)',
            }}>
              {displayedMessages.map((message, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'YOU' ? 'flex-end' : 'flex-start', mb: 1.5, alignItems: 'flex-end' }}>
                  {message.sender !== 'YOU' && (
                    <Avatar sx={{ bgcolor: AVATARS[message.sender]?.color || '#666', width: 28, height: 28, mr: 0.5, fontSize: '0.7rem' }}>
                      {AVATARS[message.sender]?.initials}
                    </Avatar>
                  )}
                  <Box sx={{
                    maxWidth: '75%', p: 1.5,
                    bgcolor: message.sender === 'YOU'
                      ? (theme.palette.mode === 'dark' ? '#1e3a1e' : '#DCF8C6')
                      : (theme.palette.mode === 'dark' ? '#2d1b4e' : 'white'),
                    borderRadius: message.sender === 'YOU' ? '14px 14px 0 14px' : '14px 14px 14px 0',
                    border: `1px solid ${message.sender === 'YOU' ? P.green.border : P.purple.border}`,
                  }}>
                    {message.sender !== 'YOU' && (
                      <Typography variant="caption" fontWeight="bold" sx={{ color: AVATARS[message.sender]?.color, display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                        {message.sender}
                      </Typography>
                    )}
                    {renderMessageContent(message)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>{message.timestamp}</Typography>
                      {message.sender === 'YOU' && message.status && (
                        <Box sx={{ color: message.status === 'read' ? '#4FC3F7' : 'text.disabled', display: 'flex', alignItems: 'center' }}>
                          {message.status === 'sent' && <CheckIcon sx={{ fontSize: 16 }} />}
                          {(message.status === 'delivered' || message.status === 'read') && <DoneAllIcon sx={{ fontSize: 16 }} />}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Word bank */}
            <Box sx={{
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1b2e' : '#F0EBF8',
              borderTop: `2px solid ${P.purple.border}`,
            }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, fontSize: '0.85rem' }}>
                Tap words to auto-fill blanks (tap filled blank to remove):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {wordBank.map((word, idx) => (
                  <Box
                    key={idx}
                    component="button"
                    onClick={() => handleWordClick(word)}
                    sx={{
                      px: 1.5, py: 0.5, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      bgcolor: selectedWord === word ? P.purple.border : (theme.palette.mode === 'dark' ? '#2d1b4e' : 'white'),
                      color: selectedWord === word ? 'white' : 'text.primary',
                      border: `2px solid ${selectedWord === word ? P.purple.shadow : P.purple.border}`,
                      borderRadius: '12px',
                      boxShadow: selectedWord === word ? `2px 2px 0 ${P.purple.shadow}` : 'none',
                      '&:hover': { bgcolor: selectedWord === word ? P.purple.shadow : P.purple.bg }
                    }}
                  >
                    {word}
                  </Box>
                ))}
              </Box>
              {selectedWord && (
                <Box sx={{
                  mt: 1.5, p: 1, borderRadius: '10px',
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    Filling next blank with: "{selectedWord}"
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Progress bar */}
            <LinearProgress
              variant="determinate"
              value={(currentMessageIndex / DIALOGUE_MESSAGES.length) * 100}
              sx={{ height: 4, bgcolor: 'rgba(168,85,247,0.15)', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border } }}
            />
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
