import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, LinearProgress, Container, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import CheckIcon from '@mui/icons-material/Check'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Level A2 - Task A: Dialogue Adventure
 * WhatsApp/Messenger-style chat interface
 * Complete dialogue describing poster/video
 * Score: +1 for each correct word (7 total)
 */

// Only the words that need to be filled: gatefold, animation, jingle, and, dramatisation, with, sketch
const WORD_BANK_ORIGINAL = [
  'gatefold', 'animation', 'jingle', 'and', 'dramatisation', 'with', 'sketch'
]

const AVATARS = {
  'MS. MABROUKI': { color: '#9D84B7', initials: 'MM' },
  'LILIA': { color: '#6BCF7F', initials: 'LI' },
  'YOU': { color: '#4D96FF', initials: 'ME' }
}

const DIALOGUE_MESSAGES = [
  { id: 1, sender: 'LILIA', text: 'Poster gatefold?', type: 'question' },
  { id: 2, sender: 'YOU', template: '______ is fold.', blanks: ['gatefold'], type: 'response' },
  { id: 3, sender: 'MS. MABROUKI', text: 'Video animation?', type: 'question' },
  { id: 4, sender: 'YOU', template: '______ is move picture.', blanks: ['animation'], type: 'response' },
  { id: 5, sender: 'YOU', template: '______ is song ______ ______ is story ______ ______.', blanks: ['jingle', 'and', 'dramatisation', 'with', 'sketch'], type: 'response' }
]

export default function Phase4Step4RemedialA2TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/4/remedial/a2/taskB') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_a2' })
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
    sessionStorage.setItem('phase4_step4_remedial_a2_taskA_score', score)
    fetch('/api/phase4/step4/remedial/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ level: 'A2', task: 'A', score, max_score: 7, completed: true })
    }).catch(err => console.error('Log error:', err))
  }

  const renderMessageContent = (message) => {
    if (message.type === 'question') {
      return <Typography variant="body1" sx={{ fontWeight: 500 }}>{message.text}</Typography>
    }

    if (message.type === 'response') {
      if (message.sent) {
        const parts = message.template.split(/_{3,}/)
        return <Typography variant="body1" sx={{ fontWeight: 500 }}>{parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <strong style={{
                color: answers[`msg${message.id}_blank${idx}`]?.toLowerCase() === message.blanks[idx]?.toLowerCase()
                  ? P.green.shadow
                  : P.red.shadow
              }}>
                {answers[`msg${message.id}_blank${idx}`]}
              </strong>
            )}
          </React.Fragment>
        ))}</Typography>
      }

      const parts = message.template.split(/_{3,}/)
      const allFilled = message.blanks.every((_, idx) => answers[`msg${message.id}_blank${idx}`])

      return (
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, fontSize: '0.75rem', color: P.blue.shadow }}>Tap words to complete your message:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>{part}</Typography>
                {idx < parts.length - 1 && (
                  <Box
                    component="span"
                    onClick={() => handleBlankClick(message.id, idx)}
                    sx={{
                      display: 'inline-block',
                      bgcolor: answers[`msg${message.id}_blank${idx}`] ? P.blue.bg : 'transparent',
                      border: `2px dashed ${answers[`msg${message.id}_blank${idx}`] ? P.blue.border : P.yellow.border}`,
                      borderRadius: '999px',
                      px: 1.5, py: 0.25,
                      fontSize: '0.8rem', fontWeight: 700,
                      color: answers[`msg${message.id}_blank${idx}`] ? P.blue.shadow : P.yellow.shadow,
                      cursor: 'pointer',
                      minWidth: 70, textAlign: 'center',
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
                mt: 1.5,
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `2px 2px 0 ${P.green.shadow}`,
                px: 2, py: 0.5, fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 0.5,
                '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.green.shadow}` },
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} /> Send
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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4 Step 4: Apply - Remedial Practice</Typography>
              <Typography variant="h5" sx={{ color: P.blue.shadow }}>Level A2 - Task A: Dialogue Adventure Complete!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>{score} / 7</Typography>
              <Typography variant="h6" sx={{ color: P.green.shadow }}>Points Earned</Typography>
              <Typography variant="body1" sx={{ mt: 2, color: P.green.shadow }}>Adventure Progress: {((score / 7) * 100).toFixed(0)}% Complete</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step/4/remedial/a2/taskB')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Task B: Expand Empire →
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
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4 Step 4: Apply - Remedial Practice</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Level A2 - Task A: Dialogue Adventure</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Complete the dialogue about posters and videos!</Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="MS. MABROUKI" message="Welcome to the Dialogue Adventure! This is a group chat conversation. Read the messages and complete your responses by tapping words from the word bank, then tapping the blanks in your message. Send each complete message to continue the adventure!" />
          </Box>

          {/* Chat Interface */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, overflow: 'hidden', mb: 3 }}>
            {/* Chat Header */}
            <Box sx={{ bgcolor: P.blue.bg, borderBottom: `2px solid ${P.blue.border}`, p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: P.green.border, width: 36, height: 36 }}><Typography variant="caption" fontWeight="bold">A2</Typography></Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.shadow }}>Media Team Chat</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: P.blue.shadow }}>Ms. Mabrouki, Lilia, You</Typography>
              </Box>
              <Box component="span" sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '999px', px: 1.5, py: 0.25, fontSize: '0.8rem', fontWeight: 700, color: P.green.shadow }}>
                {score}/7
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ p: 2, minHeight: 400, maxHeight: 500, overflowY: 'auto', bgcolor: isDark ? '#1a1a2e' : '#f0f4f8' }}>
              {displayedMessages.map((message, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'YOU' ? 'flex-end' : 'flex-start', mb: 1.5, alignItems: 'flex-end' }}>
                  {message.sender !== 'YOU' && <Avatar sx={{ bgcolor: AVATARS[message.sender]?.color || '#666', width: 28, height: 28, mr: 0.5, fontSize: '0.7rem' }}>{AVATARS[message.sender]?.initials}</Avatar>}
                  <Box sx={{
                    maxWidth: '70%', p: 1.5,
                    bgcolor: message.sender === 'YOU' ? P.green.bg : P.blue.bg,
                    border: `2px solid ${message.sender === 'YOU' ? P.green.border : P.blue.border}`,
                    borderRadius: message.sender === 'YOU' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    boxShadow: `2px 2px 0 ${message.sender === 'YOU' ? P.green.shadow : P.blue.shadow}`,
                  }}>
                    {message.sender !== 'YOU' && <Typography variant="caption" fontWeight="bold" sx={{ color: AVATARS[message.sender]?.color, display: 'block', mb: 0.5, fontSize: '0.7rem' }}>{message.sender}</Typography>}
                    {renderMessageContent(message)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.6 }}>{message.timestamp}</Typography>
                      {message.sender === 'YOU' && message.status && (
                        <Box sx={{ color: message.status === 'read' ? P.blue.border : 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center' }}>
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

            {/* Word Bank */}
            <Box sx={{ bgcolor: P.orange.bg, borderTop: `2px solid ${P.orange.border}`, p: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: P.orange.shadow, fontWeight: 700, fontSize: '0.85rem' }}>Tap words to auto-fill blanks (tap filled blank to remove):</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {wordBank.map((word, idx) => (
                  <Box
                    key={idx}
                    component="span"
                    onClick={() => handleWordClick(word)}
                    sx={{
                      display: 'inline-block',
                      bgcolor: selectedWord === word ? P.orange.border : P.orange.bg,
                      border: `2px solid ${selectedWord === word ? P.orange.shadow : P.orange.border}`,
                      borderRadius: '999px',
                      px: 2, py: 0.5,
                      fontSize: '0.85rem', fontWeight: selectedWord === word ? 700 : 600,
                      color: selectedWord === word ? 'white' : P.orange.shadow,
                      cursor: 'pointer',
                      boxShadow: selectedWord === word ? `2px 2px 0 ${P.orange.shadow}` : 'none',
                    }}
                  >
                    {word}
                  </Box>
                ))}
              </Box>
              {selectedWord && (
                <Box sx={{ mt: 1.5, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', p: 1 }}>
                  <Typography variant="caption" sx={{ color: P.yellow.shadow, fontWeight: 700, fontSize: '0.9rem' }}>
                    Filling next blank with: "{selectedWord}"
                  </Typography>
                </Box>
              )}
            </Box>

            <LinearProgress variant="determinate" value={(currentMessageIndex / DIALOGUE_MESSAGES.length) * 100} sx={{ height: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.green.border } }} />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
