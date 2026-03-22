import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import CheckIcon from '@mui/icons-material/Check'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

/**
 * Phase 4 Step 3 - Remedial B2 - Task A: Role-Play Saga
 * WhatsApp/Messenger-style chat interface
 * Score: 10 pts
 */

const WORD_BANK_ORIGINAL = [
  'promotional', 'sell', 'persuasive', 'ethos', 'pathos', 'logos',
  'targeted', 'group', 'original', 'creative'
]

const AVATARS = {
  'MS. MABROUKI': { color: '#9D84B7', initials: 'MM' },
  'LILIA': { color: '#6BCF7F', initials: 'LI' },
  'YOU': { color: '#4D96FF', initials: 'ME' }
}

const DIALOGUE_MESSAGES = [
  { id: 1, sender: 'MS. MABROUKI', text: 'Explain promotional.', type: 'question', audio: true },
  { id: 2, sender: 'YOU', template: '______ for ______ impact.', blanks: ['promotional', 'sell'], type: 'response' },
  { id: 3, sender: 'LILIA', text: 'Persuasive?', type: 'question', audio: true },
  { id: 4, sender: 'YOU', template: '______ uses ______ ______ and ______.', blanks: ['persuasive', 'ethos', 'pathos', 'logos'], type: 'response' },
  { id: 5, sender: 'YOU', template: '______ for ______; ______ ______ ideas.', blanks: ['targeted', 'group', 'original', 'creative'], type: 'response' }
]

export default function RemedialB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_b2' })
  const [wordBank] = useState(() => [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5))
  const [selectedWord, setSelectedWord] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const messagesEndRef = useRef(null)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

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
      setAnswers(prev => { const n = { ...prev }; delete n[key]; return n })
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
    message.blanks.forEach((correctAnswer, idx) => {
      if (answers[`msg${messageId}_blank${idx}`]?.toLowerCase() === correctAnswer.toLowerCase()) correct++
    })
    setScore(prev => prev + correct)

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
    sessionStorage.setItem('remedial_step3_b2_taskA_score', score)
    fetch('/api/phase4/remedial/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ level: 'B2', task: 'A', step: 2, score, max_score: 10, completed: true })
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>{message.text}</Typography>
          {message.audio && (
            <Box component="button" onClick={() => playAudio(message.text)}
              sx={{ bgcolor: 'transparent', border: 'none', cursor: 'pointer', p: 0.5, display: 'flex', alignItems: 'center', color: P.blue.border }}>
              <VolumeUpIcon fontSize="small" />
            </Box>
          )}
        </Box>
      )
    }

    if (message.type === 'response') {
      if (message.sent) {
        const parts = message.template.split(/_{3,}/)
        return (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                {part}
                {idx < parts.length - 1 && <strong style={{ color: P.blue.border }}>{answers[`msg${message.id}_blank${idx}`]}</strong>}
              </React.Fragment>
            ))}
          </Typography>
        )
      }

      const parts = message.template.split(/_{3,}/)
      const allFilled = message.blanks.every((_, idx) => answers[`msg${message.id}_blank${idx}`])

      return (
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, fontSize: '0.75rem', color: P.orange.border }}>
            Tap words to complete your message:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>{part}</Typography>
                {idx < parts.length - 1 && (
                  <Box component="button" onClick={() => handleBlankClick(message.id, idx)}
                    sx={{
                      bgcolor: answers[`msg${message.id}_blank${idx}`] ? P.blue.border : P.yellow.bg,
                      color: answers[`msg${message.id}_blank${idx}`] ? 'white' : P.yellow.shadow,
                      border: `2px dashed ${answers[`msg${message.id}_blank${idx}`] ? P.blue.border : P.yellow.border}`,
                      borderRadius: '10px', fontWeight: 'bold', cursor: selectedWord ? 'pointer' : 'default',
                      minWidth: 80, fontSize: '0.8rem', px: 1.5, py: 0.5,
                      '&:hover': { transform: selectedWord ? 'translate(-1px,-1px)' : 'none' }
                    }}
                  >
                    {answers[`msg${message.id}_blank${idx}`] || 'tap here'}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
          {allFilled && (
            <Box component="button" onClick={() => handleSendMessage(message.id)}
              sx={{
                ...cardSx('green'), mt: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1,
                px: 3, py: 1, fontSize: '0.85rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
              }}
            >
              <SendIcon fontSize="small" /> Send
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
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5">Level B2 - Task A: Role-Play Saga Complete! 🎉</Typography>
            </Box>
            <Box sx={{ ...cardSx('green'), mb: 3, textAlign: 'center', p: 5 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold">{score} / 10</Typography>
              <Typography variant="h6" color="text.secondary">Points Earned</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Saga Progress: {((score / 10) * 100).toFixed(0)}% Unfolded</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/b2/taskB')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.1rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Continue to Task B: Explain Expedition →
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

          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom>Level B2 - Task A: Role-Play Saga 💬</Typography>
            <Typography variant="body1">Complete the dialogue about advertising concepts!</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Role-Play Saga! 💬 This is a group chat conversation. Read the messages and complete your responses by tapping words from the word bank, then tapping the blanks in your message. Send each complete message to continue the saga!" />
          </Box>

          {/* Chat window */}
          <Box sx={{
            maxWidth: 600, mx: 'auto',
            bgcolor: theme.palette.mode === 'dark' ? '#1A2332' : '#E5DDD5',
            borderRadius: '20px', overflow: 'hidden',
            border: `2px solid ${P.teal.border}`,
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
          }}>
            {/* Chat header */}
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? P.teal.bg : '#075E54', color: 'white', p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: P.teal.border, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>B2</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>Advertising Team Chat</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>Ms. Mabrouki, Lilia, You</Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '12px', px: 1.5, py: 0.5,
                border: '1px solid rgba(255,255,255,0.4)'
              }}>
                <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>{score}/10</Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ p: 2, minHeight: 400, maxHeight: 500, overflowY: 'auto' }}>
              {displayedMessages.map((message, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'YOU' ? 'flex-end' : 'flex-start', mb: 1.5, alignItems: 'flex-end' }}>
                  {message.sender !== 'YOU' && (
                    <Box sx={{ bgcolor: AVATARS[message.sender]?.color || '#666', width: 28, height: 28, borderRadius: '50%', mr: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Typography variant="caption" sx={{ color: 'white', fontSize: '0.65rem', fontWeight: 'bold' }}>{AVATARS[message.sender]?.initials}</Typography>
                    </Box>
                  )}
                  <Box sx={{
                    maxWidth: '70%', p: 1.5,
                    bgcolor: message.sender === 'YOU'
                      ? (theme.palette.mode === 'dark' ? '#1B5E20' : '#DCF8C6')
                      : (theme.palette.mode === 'dark' ? '#1E3A5F' : 'white'),
                    borderRadius: message.sender === 'YOU' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    border: `1px solid ${message.sender === 'YOU' ? P.green.border : P.blue.border}`,
                  }}>
                    {message.sender !== 'YOU' && (
                      <Typography variant="caption" fontWeight="bold" sx={{ color: AVATARS[message.sender]?.color, display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                        {message.sender}
                      </Typography>
                    )}
                    {renderMessageContent(message)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{message.timestamp}</Typography>
                      {message.sender === 'YOU' && message.status && (
                        <Box sx={{ color: message.status === 'read' ? P.blue.border : 'text.secondary', display: 'flex', alignItems: 'center' }}>
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
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? P.yellow.bg : '#F0F0F0', p: 2, borderTop: `1px solid ${P.yellow.border}` }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, fontSize: '0.85rem', color: P.orange.border }}>
                Tap words to auto-fill blanks (tap filled blank to remove):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {wordBank.map((word, idx) => (
                  <Box key={idx} component="button" onClick={() => handleWordClick(word)}
                    sx={{
                      bgcolor: selectedWord === word ? P.green.border : P.blue.bg,
                      color: selectedWord === word ? 'white' : P.blue.border,
                      fontWeight: selectedWord === word ? 'bold' : '600',
                      cursor: 'pointer', fontSize: '0.85rem',
                      border: `2px solid ${selectedWord === word ? P.green.border : P.blue.border}`,
                      borderRadius: '12px', px: 1.5, py: 0.5, transition: 'all 0.15s',
                      '&:hover': { transform: 'translate(-1px,-1px)', bgcolor: selectedWord === word ? P.green.shadow : P.blue.border, color: 'white' }
                    }}
                  >
                    {word}
                  </Box>
                ))}
              </Box>
              {selectedWord && (
                <Box sx={{ ...cardSx('yellow'), mt: 1.5, p: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    Filling next blank with: "{selectedWord}"
                  </Typography>
                </Box>
              )}
            </Box>

            <LinearProgress
              variant="determinate"
              value={(currentMessageIndex / DIALOGUE_MESSAGES.length) * 100}
              sx={{ height: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.green.border } }}
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
