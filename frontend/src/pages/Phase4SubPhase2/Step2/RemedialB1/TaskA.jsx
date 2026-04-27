import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, IconButton, Chip, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import SendIcon from '@mui/icons-material/Send'
import CheckIcon from '@mui/icons-material/Check'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Remedial B1 - Task A: Role-Play Dialogue
 * WhatsApp/Messenger-style chat interface
 * Complete dialogue on planning a social media post
 * 4 blanks: caption, emoji, hashtag, viral
 * Score: +1 for each correct answer (4 total, scaled to /10)
 */

const WORD_BANK_ORIGINAL = ['hashtag', 'viral', 'caption', 'emoji']

const AVATARS = {
  'MS. MABROUKI': { color: '#9D84B7', initials: 'MM' },
  'SKANDER': { color: '#6BCF7F', initials: 'SK' },
  'YOU': { color: '#4D96FF', initials: 'ME' }
}

const DIALOGUE_MESSAGES = [
  { id: 1, sender: 'MS. MABROUKI', text: 'We need to write a good text for this photo. What do you think?', type: 'question', audio: true },
  { id: 2, sender: 'YOU', template: 'We need a good ______ for this photo.', blanks: ['caption'], type: 'response' },
  { id: 3, sender: 'SKANDER', text: 'What should we use to make it more expressive?', type: 'question', audio: true },
  { id: 4, sender: 'YOU', template: 'We should use ______ to make it more expressive.', blanks: ['emoji'], type: 'response' },
  { id: 5, sender: 'MS. MABROUKI', text: 'How can we help people find our post?', type: 'question', audio: true },
  { id: 6, sender: 'YOU', template: 'We should use a popular ______ so more people can find it.', blanks: ['hashtag'], type: 'response' },
  { id: 7, sender: 'SKANDER', text: 'What\'s our goal for this post?', type: 'question', audio: true },
  { id: 8, sender: 'YOU', template: 'If we do this right, our post might go ______.', blanks: ['viral'], type: 'response' }
]

export default function Phase4_2Step2RemedialB1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/2/remedial/b1/taskB') }, [])
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 1, context: 'remedial_b1' })
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
    const finalScore = Math.round((score / 4) * 10)
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskA_score', finalScore)
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskA_max', '10')
    fetch('/api/phase4/remedial/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ phase: '4.2', level: 'B1', task: 'A', step: 2, score: finalScore, max_score: 10, completed: true, time_taken: 0 })
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
        return <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>{parts.map((part, idx) => (
          <React.Fragment key={idx}>{part}{idx < parts.length - 1 && <strong style={{ color: '#1976d2' }}>{answers[`msg${message.id}_blank${idx}`]}</strong>}</React.Fragment>
        ))}</Typography>
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
          {allFilled && (
            <Box component="button" onClick={() => handleSendMessage(message.id)} sx={{
              mt: 1.5, bgcolor: '#25D366', color: '#fff', border: 'none',
              borderRadius: '8px', px: 2, py: 0.5, fontWeight: 700, fontSize: '0.85rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5,
              '&:hover': { bgcolor: '#20BD5A' }
            }}>
              Send <SendIcon sx={{ fontSize: 16 }} />
            </Box>
          )}
        </Box>
      )
    }
  }

  if (completed) {
    const finalScore = Math.round((score / 4) * 10)
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Step 2: Remedial Activities</Typography>
              <Typography variant="h5" sx={{ color: P.blue.shadow }}>Level B1 - Task A: Role-Play Dialogue Complete!</Typography>
            </Box>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, textAlign: 'center', mb: 3
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>{finalScore} / 10</Typography>
              <Typography variant="h6" sx={{ color: P.green.shadow }}>Points Earned</Typography>
              <Typography variant="body1" sx={{ mt: 2, color: isDark ? '#ccc' : '#555' }}>Dialogue Progress: {((score / 4) * 100).toFixed(0)}% Complete</Typography>
              <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#aaa' : '#666' }}>Raw score: {score} / 4 blanks</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/2/remedial/b1/taskB')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.green.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Task B
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
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Step 2: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Level B1 - Task A: Role-Play Dialogue</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Complete the dialogue about planning a social media post!</Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to the Role-Play Dialogue! This is a group chat conversation about planning a social media post. Read the messages and complete your responses by tapping words from the word bank, then tapping the blanks in your message. Send each complete message to continue the conversation!" />
          </Box>

          {/* Chat Interface - preserved internal styling */}
          <Box sx={{
            maxWidth: 600, mx: 'auto',
            bgcolor: '#E5DDD5',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)',
            borderRadius: '20px', overflow: 'hidden',
            border: `2px solid ${P.blue.border}`,
            boxShadow: `4px 4px 0 ${P.blue.shadow}`
          }}>
            <Box sx={{ bgcolor: '#075E54', color: 'white', p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#25D366', width: 36, height: 36 }}><Typography variant="caption" fontWeight="bold">B1</Typography></Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">Social Media Planning Chat</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Ms. Mabrouki, Skander, You</Typography>
              </Box>
              <Chip label={`${Math.round((score / 4) * 10)}/10`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', height: 24 }} />
            </Box>

            <Box sx={{ p: 2, minHeight: 400, maxHeight: 500, overflowY: 'auto' }}>
              {displayedMessages.map((message, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'YOU' ? 'flex-end' : 'flex-start', mb: 1.5, alignItems: 'flex-end' }}>
                  {message.sender !== 'YOU' && <Avatar sx={{ bgcolor: AVATARS[message.sender]?.color || '#666', width: 28, height: 28, mr: 0.5, fontSize: '0.7rem' }}>{AVATARS[message.sender]?.initials}</Avatar>}
                  <Box sx={{ maxWidth: '70%', p: 1.5, bgcolor: message.sender === 'YOU' ? '#DCF8C6' : 'white', borderRadius: message.sender === 'YOU' ? '8px 8px 0 8px' : '8px 8px 8px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.13)' }}>
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

            <Box sx={{ bgcolor: '#F0F0F0', p: 2, borderTop: '1px solid #D1D1D1' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#1a252f', fontWeight: 700, fontSize: '0.85rem' }}>Tap words to auto-fill blanks (tap filled blank to remove):</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {wordBank.map((word, idx) => (
                  <Chip key={idx} label={word} onClick={() => handleWordClick(word)} size="small"
                    sx={{ bgcolor: selectedWord === word ? '#25D366' : 'white', color: selectedWord === word ? 'white' : '#2c3e50', fontWeight: selectedWord === word ? 'bold' : '600', cursor: 'pointer', fontSize: '0.85rem', height: 32, border: '1px solid', borderColor: selectedWord === word ? '#25D366' : '#D1D1D1', '&:hover': { bgcolor: selectedWord === word ? '#20BD5A' : '#E8E8E8' } }}
                  />
                ))}
              </Box>
              {selectedWord && <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#1a252f', fontWeight: 700, fontSize: '0.9rem', bgcolor: '#fff3cd', p: 1, borderRadius: 1, border: '2px solid #ffc107' }}>Filling next blank with: "{selectedWord}"</Typography>}
            </Box>

            <LinearProgress variant="determinate" value={(currentMessageIndex / DIALOGUE_MESSAGES.length) * 100} sx={{ height: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#25D366' } }} />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
