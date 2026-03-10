import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Avatar, IconButton, Chip, LinearProgress } from '@mui/material'
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

      // If this was a question, immediately show the next message (user's response)
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

    // Auto-fill first empty blank
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

    // Double-click to remove (check if already filled)
    if (answers[key]) {
      setAnswers(prev => {
        const newAnswers = { ...prev }
        delete newAnswers[key]
        return newAnswers
      })
      if (navigator.vibrate) navigator.vibrate(50)
      return
    }

    // Single click with selected word to fill
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

    // Check correctness for each blank
    let correct = 0
    const correctness = {}
    message.blanks.forEach((correctAnswer, idx) => {
      const userAnswer = answers[`msg${messageId}_blank${idx}`]
      const isCorrect = userAnswer?.toLowerCase() === correctAnswer.toLowerCase()
      correctness[`msg${messageId}_blank${idx}_correct`] = isCorrect
      if (isCorrect) correct++
    })
    setScore(prev => prev + correct)

    // Store correctness in answers state
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
          <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>{message.text}</Typography>
          {message.audio && <IconButton size="small" onClick={() => playAudio(message.text)} sx={{ ml: 1, p: 0.5 }}><VolumeUpIcon fontSize="small" /></IconButton>}
        </Box>
      )
    }

    if (message.type === 'response') {
      if (message.sent) {
        const parts = message.template.split(/_{3,}/)
        return <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>{parts.map((part, idx) => {
          if (idx < parts.length - 1) {
            const isCorrect = answers[`msg${message.id}_blank${idx}_correct`]
            const color = isCorrect ? '#27ae60' : '#e74c3c' // green for correct, red for incorrect
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
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#1a252f', fontWeight: 600, fontSize: '0.75rem' }}>Tap words to complete your message:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                <Typography component="span" variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>{part}</Typography>
                {idx < parts.length - 1 && (
                  <Chip label={answers[`msg${message.id}_blank${idx}`] || 'tap here'} onClick={() => handleBlankClick(message.id, idx)} size="small"
                    sx={{ bgcolor: answers[`msg${message.id}_blank${idx}`] ? '#1976d2' : '#fff', color: answers[`msg${message.id}_blank${idx}`] ? '#fff' : '#666', fontWeight: 'bold', cursor: selectedWord ? 'pointer' : 'default', minWidth: 80, fontSize: '0.8rem', height: 28, border: '2px dashed', borderColor: answers[`msg${message.id}_blank${idx}`] ? '#1976d2' : '#999', '&:hover': { bgcolor: selectedWord ? '#1565c0' : '#f0f0f0', borderColor: selectedWord ? '#1565c0' : '#666' } }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>
          {allFilled && <Button size="small" variant="contained" endIcon={<SendIcon />} onClick={() => handleSendMessage(message.id)} sx={{ mt: 1.5, bgcolor: '#25D366', color: '#fff', textTransform: 'none', fontSize: '0.85rem', py: 0.5, '&:hover': { bgcolor: '#20BD5A' } }}>Send</Button>}
        </Box>
      )
    }
  }

  if (completed) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
          <Typography variant="h5">Level C1 - Task A: Debate Dominion Complete! 🎯</Typography>
        </Paper>
        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: '#8e44ad' }}>{score} / 11</Typography>
          <Typography variant="h6" color="text.secondary">Points Earned</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Debate Mastery: {((score / 11) * 100).toFixed(0)}% Complete</Typography>
        </Paper>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" size="large" onClick={() => navigate('/phase4/step3/remedial/c1/taskB')} sx={{ py: 2, px: 6, fontSize: '1.1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', '&:hover': { background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)' } }}>
            Continue to Task B →
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
        <Typography variant="h5" gutterBottom>Level C1 - Task A: Debate Dominion 🎯</Typography>
        <Typography variant="body1">Dominate the debate with precise advertising terminology!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage character="MS. MABROUKI" message="Welcome to Debate Dominion! 🎯 This is a high-level debate simulation. Read the opponent's arguments and craft your responses using sophisticated advertising terminology. Tap words from the word bank, then tap the blanks to fill your message. Send when complete!" />
      </Paper>

      <Paper elevation={4} sx={{ maxWidth: 600, mx: 'auto', bgcolor: '#E5DDD5', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#6c3483', color: 'white', p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#8e44ad', width: 36, height: 36 }}><Typography variant="caption" fontWeight="bold">C1</Typography></Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">Debate Dominion Arena</Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>You vs. Opponent</Typography>
          </Box>
          <Chip label={`${score}/11`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', height: 24 }} />
        </Box>

        <Box sx={{ p: 2, minHeight: 400, maxHeight: 500, overflowY: 'auto' }}>
          {displayedMessages.map((message, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'YOU' ? 'flex-end' : 'flex-start', mb: 1.5, alignItems: 'flex-end' }}>
              {message.sender !== 'YOU' && <Avatar sx={{ bgcolor: AVATARS[message.sender]?.color || '#666', width: 28, height: 28, mr: 0.5, fontSize: '0.7rem' }}>{AVATARS[message.sender]?.initials}</Avatar>}
              <Paper elevation={1} sx={{ maxWidth: '70%', p: 1.5, bgcolor: message.sender === 'YOU' ? '#DCF8C6' : 'white', borderRadius: message.sender === 'YOU' ? '8px 8px 0 8px' : '8px 8px 8px 0' }}>
                {message.sender !== 'YOU' && <Typography variant="caption" fontWeight="bold" sx={{ color: AVATARS[message.sender]?.color, display: 'block', mb: 0.5, fontSize: '0.7rem' }}>{message.sender}</Typography>}
                {renderMessageContent(message)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.45)' }}>{message.timestamp}</Typography>
                  {message.sender === 'YOU' && message.status && (
                    <Box sx={{ color: message.status === 'read' ? '#4FC3F7' : 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center' }}>
                      {message.status === 'sent' && <CheckIcon sx={{ fontSize: 16 }} />}
                      {(message.status === 'delivered' || message.status === 'read') && <DoneAllIcon sx={{ fontSize: 16 }} />}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ bgcolor: '#F0F0F0', p: 2, borderTop: '1px solid #D1D1D1' }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#1a252f', fontWeight: 700, fontSize: '0.85rem' }}>Tap words to auto-fill blanks (tap filled blank to remove):</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {wordBank.map((word, idx) => (
              <Chip key={idx} label={word} onClick={() => handleWordClick(word)} size="small"
                sx={{ bgcolor: selectedWord === word ? '#8e44ad' : 'white', color: selectedWord === word ? 'white' : '#2c3e50', fontWeight: selectedWord === word ? 'bold' : '600', cursor: 'pointer', fontSize: '0.85rem', height: 32, border: '1px solid', borderColor: selectedWord === word ? '#8e44ad' : '#D1D1D1', '&:hover': { bgcolor: selectedWord === word ? '#6c3483' : '#E8E8E8' } }}
              />
            ))}
          </Box>
          {selectedWord && <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#1a252f', fontWeight: 700, fontSize: '0.9rem', bgcolor: '#fff3cd', p: 1, borderRadius: 1, border: '2px solid #ffc107' }}>Filling next blank with: "{selectedWord}"</Typography>}
        </Box>

        <LinearProgress variant="determinate" value={(currentMessageIndex / DIALOGUE_MESSAGES.length) * 100} sx={{ height: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#8e44ad' } }} />
      </Paper>
    </Box>
  )
}
