import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, IconButton, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import CheckIcon from '@mui/icons-material/Check'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 5 - Remedial B2 - Task A: Role-Play Dialogue
 */

const WORD_BANK_ORIGINAL = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action', 'engagement']

const AVATARS = {
  'MS. MABROUKI': { color: '#9D84B7', initials: 'MM' },
  'SKANDER': { color: '#6BCF7F', initials: 'SK' },
  'YOU': { color: '#4D96FF', initials: 'ME' }
}

const DIALOGUE_MESSAGES = [
  { id: 1, sender: 'MS. MABROUKI', text: 'Post problem?', type: 'question', audio: true },
  { id: 2, sender: 'YOU', template: '______ misspelled.', blanks: ['Hashtag'], type: 'response' },
  { id: 3, sender: 'SKANDER', text: 'Caption?', type: 'question', audio: true },
  { id: 4, sender: 'YOU', template: '______ too long, no ______.', blanks: ['Caption', 'call-to-action'], type: 'response' }
]

export default function Phase4_2Step5RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 1, context: 'remedial_b2' })

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
      setDisplayedMessages(prev => [...prev, { ...message, status: message.sender === 'YOU' ? null : 'delivered', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      setCurrentMessageIndex(prev => prev + 1)
      if (message.type === 'question' && currentMessageIndex + 1 < DIALOGUE_MESSAGES.length) {
        const nextMessage = DIALOGUE_MESSAGES[currentMessageIndex + 1]
        if (nextMessage.type === 'response') {
          setTimeout(() => {
            setDisplayedMessages(prev => [...prev, { ...nextMessage, status: null, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
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
      setAnswers(prev => { const newAnswers = { ...prev }; delete newAnswers[key]; return newAnswers })
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
    message.blanks.forEach((correctAnswer, idx) => { if (answers[`msg${messageId}_blank${idx}`]?.toLowerCase() === correctAnswer.toLowerCase()) correct++ })
    setScore(prev => prev + correct)
    setDisplayedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: 'sent', sent: true } : msg))
    setTimeout(() => setDisplayedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: 'delivered' } : msg)), 500)
    setTimeout(() => setDisplayedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: 'read' } : msg)), 1000)
    if (currentMessageIndex < DIALOGUE_MESSAGES.length) { setTimeout(() => addNextMessage(), 1500) }
    else { setTimeout(() => handleComplete(), 2000) }
  }

  const handleComplete = () => {
    setCompleted(true)
    sessionStorage.setItem('phase4_2_step5_remedial_b2_taskA_score', score)
    fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'A', step: 5, score, max_score: 4, completed: true, time_taken: 0 }) }).catch(err => console.error('Log error:', err))
  }

  const playAudio = (text) => {
    if ('speechSynthesis' in window) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.rate = 0.9; utterance.lang = 'en-US'; speechSynthesis.speak(utterance) }
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
        return <Typography variant="body1" sx={{ fontWeight: 500 }}>{parts.map((part, idx) => (<React.Fragment key={idx}>{part}{idx < parts.length - 1 && <strong style={{ color: P.blue.shadow }}>{answers[`msg${message.id}_blank${idx}`]}</strong>}</React.Fragment>))}</Typography>
      }
      const parts = message.template.split(/_{3,}/)
      const allFilled = message.blanks.every((_, idx) => answers[`msg${message.id}_blank${idx}`])
      return (
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, fontSize: '0.75rem' }}>Tap words to complete your message:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>{part}</Typography>
                {idx < parts.length - 1 && (
                  <Box component="span" onClick={() => handleBlankClick(message.id, idx)} sx={{
                    bgcolor: answers[`msg${message.id}_blank${idx}`] ? P.blue.bg : (isDark ? '#333' : '#fff'),
                    border: `2px dashed ${answers[`msg${message.id}_blank${idx}`] ? P.blue.border : '#999'}`,
                    borderRadius: '999px', px: 1.5, py: 0.3, fontSize: '0.8rem', fontWeight: 700,
                    color: answers[`msg${message.id}_blank${idx}`] ? P.blue.shadow : '#666',
                    cursor: selectedWord ? 'pointer' : 'default', minWidth: 80, display: 'inline-block', textAlign: 'center'
                  }}>
                    {answers[`msg${message.id}_blank${idx}`] || 'tap here'}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
          {allFilled && (
            <Box component="button" onClick={() => handleSendMessage(message.id)} sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.green.shadow}`,
              px: 2, py: 0.5, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', color: P.green.shadow, mt: 1.5,
              display: 'flex', alignItems: 'center', gap: 0.5,
              '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.green.shadow}` }
            }}>Send <SendIcon sx={{ fontSize: 16 }} /></Box>
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
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.red.shadow }}>Phase 4.2 - Step 5: Remedial Activities</Typography>
              <Typography variant="h5" sx={{ color: P.red.border }}>Level B2 - Task A: Role-Play Dialogue Complete!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>{score} / 4</Typography>
              <Typography variant="h6" color="text.secondary">Points Earned</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Dialogue Progress: {((score / 4) * 100).toFixed(0)}% Complete</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/app/phase4_2/step/5/remedial/b2/taskb')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>Continue to Task B</Box>
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

          <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.red.shadow }}>Phase 4.2 - Step 5: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.red.border }}>Level B2 - Task A: Role-Play Saga</Typography>
            <Typography variant="body1">Complete the dialogue about correcting post errors!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to the Role-Play Saga! This is a group chat conversation about fixing social media post errors. Read the messages and complete your responses by tapping words from the word bank, then tapping the blanks in your message. Send each complete message to continue the conversation!" />
          </Box>

          {/* Chat interface */}
          <Box sx={{ maxWidth: 600, mx: 'auto', bgcolor: isDark ? '#1a1a2e' : '#E5DDD5', borderRadius: '20px', overflow: 'hidden', border: `2px solid ${P.teal.border}`, boxShadow: `4px 4px 0 ${P.teal.shadow}` }}>
            <Box sx={{ bgcolor: '#075E54', color: 'white', p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#25D366', width: 36, height: 36 }}><Typography variant="caption" fontWeight="bold">B2</Typography></Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">Post Error Fix Team</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Ms. Mabrouki, Skander, You</Typography>
              </Box>
              <Box component="span" sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '999px', px: 2, py: 0.3, fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{score}/4</Box>
            </Box>

            <Box sx={{ p: 2, minHeight: 400, maxHeight: 500, overflowY: 'auto' }}>
              {displayedMessages.map((message, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'YOU' ? 'flex-end' : 'flex-start', mb: 1.5, alignItems: 'flex-end' }}>
                  {message.sender !== 'YOU' && <Avatar sx={{ bgcolor: AVATARS[message.sender]?.color || '#666', width: 28, height: 28, mr: 0.5, fontSize: '0.7rem' }}>{AVATARS[message.sender]?.initials}</Avatar>}
                  <Box sx={{ maxWidth: '70%', p: 1.5, bgcolor: message.sender === 'YOU' ? '#DCF8C6' : 'white', borderRadius: message.sender === 'YOU' ? '8px 8px 0 8px' : '8px 8px 8px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
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
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : '#F0F0F0', p: 2, borderTop: '1px solid #D1D1D1' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, fontSize: '0.85rem' }}>Tap words to auto-fill blanks (tap filled blank to remove):</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {wordBank.map((word, idx) => (
                  <Box key={idx} component="span" onClick={() => handleWordClick(word)} sx={{
                    bgcolor: selectedWord === word ? P.green.bg : (isDark ? '#333' : 'white'),
                    border: `2px solid ${selectedWord === word ? P.green.border : '#D1D1D1'}`,
                    borderRadius: '999px', px: 2, py: 0.3, fontSize: '0.85rem', fontWeight: selectedWord === word ? 700 : 600,
                    color: selectedWord === word ? P.green.shadow : (isDark ? '#ccc' : '#2c3e50'),
                    cursor: 'pointer', display: 'inline-block',
                    '&:hover': { bgcolor: selectedWord === word ? P.green.bg : (isDark ? '#444' : '#E8E8E8') }
                  }}>{word}</Box>
                ))}
              </Box>
              {selectedWord && (
                <Box sx={{ mt: 1.5, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '8px', p: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.9rem', color: P.yellow.shadow }}>Filling next blank with: "{selectedWord}"</Typography>
                </Box>
              )}
            </Box>

            <LinearProgress variant="determinate" value={(currentMessageIndex / DIALOGUE_MESSAGES.length) * 100} sx={{ height: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#25D366' } }} />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
