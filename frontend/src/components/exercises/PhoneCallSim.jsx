/**
 * PhoneCallSim - Clay/Bento Chat Exercise Component
 *
 * A dialogue completion exercise with clay theme styling:
 * - Clay card containers with bold borders and drop shadows
 * - Typing animation before messages appear
 * - Progressive message reveal
 * - Natural audio playback
 * - Fully mobile responsive
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Stack,
    Button,
    Fade,
    Zoom,
    useTheme
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const getPalette = (dark) => dark ? {
    pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
    blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
    green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
    purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
    yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
    red: { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
    teal: { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
    orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
} : {
    pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
    blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
    purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
    red: { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
    teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
    orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}

export default function PhoneCallSim({ exercise, onComplete, onProgress }) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [completedLines, setCompletedLines] = useState(new Set())
    const [isPlaying, setIsPlaying] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState(null)
    const [visibleMessages, setVisibleMessages] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [pendingMessage, setPendingMessage] = useState(null)
    const transcriptRef = useRef(null)
    const theme = useTheme()
    const dark = theme.palette.mode === 'dark'
    const c = getPalette(dark)

    // Load a natural-sounding voice
    useEffect(() => {
        const loadVoice = () => {
            if ('speechSynthesis' in window) {
                const voices = speechSynthesis.getVoices()
                // Prioritize premium/natural sounding voices
                const preferredVoices = [
                    // Premium voices (most natural)
                    'Microsoft Aria',
                    'Microsoft Jenny',
                    'Google US English',
                    'Google UK English Female',
                    'Google UK English Male',
                    // macOS voices
                    'Samantha',
                    'Alex',
                    'Karen',
                    'Daniel',
                    'Moira',
                    'Fiona',
                    // Windows voices
                    'Microsoft Zira',
                    'Microsoft David',
                    'Microsoft Mark'
                ]

                let voice = null
                for (const preferred of preferredVoices) {
                    voice = voices.find(v => v.name.includes(preferred))
                    if (voice) break
                }

                // Fallback: look for any premium/neural voice
                if (!voice) {
                    voice = voices.find(v =>
                        v.name.toLowerCase().includes('premium') ||
                        v.name.toLowerCase().includes('neural') ||
                        v.name.toLowerCase().includes('natural')
                    )
                }

                // Last fallback: any English voice
                if (!voice) {
                    voice = voices.find(v => v.lang.startsWith('en'))
                }

                setSelectedVoice(voice)
            }
        }

        loadVoice()
        speechSynthesis.onvoiceschanged = loadVoice
    }, [])

    // Extract dialogue lines and word bank from exercise
    const dialogueLines = useMemo(() => {
        return exercise?.dialogue_lines || []
    }, [exercise])

    const wordBank = useMemo(() => {
        return exercise?.word_bank || []
    }, [exercise])

    const guidedQuestions = exercise?.guided_questions || []

    const correctAnswers = useMemo(() => {
        return exercise?.correct_answers || []
    }, [exercise])

    // Get lines that need user input
    const userInputLines = useMemo(() => {
        return dialogueLines
            .map((line, idx) => ({ ...line, originalIndex: idx }))
            .filter(line => line.template && line.template.includes('___'))
    }, [dialogueLines])

    // Initialize first messages with typing animation
    useEffect(() => {
        if (dialogueLines.length === 0) return

        let cancelled = false

        const showInitialMessages = async () => {
            setVisibleMessages([])
            for (let i = 0; i < dialogueLines.length; i++) {
                if (cancelled) return
                const line = dialogueLines[i]
                const isUserInput = line.template && line.template.includes('___')

                // If it's a user input line, stop and wait for user
                if (isUserInput) {
                    // Show typing, then show the user input line
                    setIsTyping(true)
                    await new Promise(r => setTimeout(r, 800))
                    if (cancelled) return
                    setIsTyping(false)
                    setVisibleMessages(prev => [...prev, { ...line, originalIndex: i }])
                    break
                }

                // Show typing animation for incoming messages
                setIsTyping(true)
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 500))
                if (cancelled) return
                setIsTyping(false)

                // Then show the message
                setVisibleMessages(prev => [...prev, { ...line, originalIndex: i }])
                await new Promise(r => setTimeout(r, 300))
            }
        }

        showInitialMessages()
        return () => { cancelled = true }
    }, [dialogueLines])

    // Check if a line is complete
    const isLineComplete = (lineIndex) => {
        return completedLines.has(lineIndex)
    }

    // Show next messages after completing a user input
    const showNextMessages = async (completedUserLineIdx) => {
        const completedLine = userInputLines[completedUserLineIdx]
        if (!completedLine) return

        const startIdx = completedLine.originalIndex + 1

        for (let i = startIdx; i < dialogueLines.length; i++) {
            const line = dialogueLines[i]
            const isUserInput = line.template && line.template.includes('___')

            if (isUserInput) {
                // Show typing, then show user input
                setIsTyping(true)
                await new Promise(r => setTimeout(r, 800))
                setIsTyping(false)
                setVisibleMessages(prev => [...prev, { ...line, originalIndex: i }])
                break
            }

            // Typing animation for incoming
            setIsTyping(true)
            await new Promise(r => setTimeout(r, 1200 + Math.random() * 600))
            setIsTyping(false)

            setVisibleMessages(prev => [...prev, { ...line, originalIndex: i }])
            await new Promise(r => setTimeout(r, 400))
        }
    }

    // Handle word selection from word bank
    const handleWordSelect = (word) => {
        const currentLine = userInputLines[currentLineIndex]
        if (!currentLine) return

        const lineKey = `line_${currentLine.originalIndex}`
        const currentWords = answers[lineKey] || []
        const blankCount = (currentLine.template.match(/_{3,}/g) || []).length

        if (currentWords.length < blankCount) {
            const newWords = [...currentWords, word]
            const newAnswers = { ...answers, [lineKey]: newWords }
            setAnswers(newAnswers)

            // Calculate current score based on CORRECT words
            let totalCorrectWords = 0
            userInputLines.forEach((line) => {
                const key = `line_${line.originalIndex}`
                const filled = newAnswers[key] || []
                const correctAnswers = line.correct_answers || []

                // Count only correct words at correct positions
                filled.forEach((word, idx) => {
                    if (correctAnswers[idx] && word === correctAnswers[idx]) {
                        totalCorrectWords++
                    }
                })
            })

            if (newWords.length === blankCount) {
                setCompletedLines(prev => new Set([...prev, currentLineIndex]))

                setTimeout(() => {
                    if (currentLineIndex < userInputLines.length - 1) {
                        setCurrentLineIndex(prev => prev + 1)
                        showNextMessages(currentLineIndex)
                    }
                }, 600)
            }

            // Report progress with correct word count
            onProgress?.({
                answers: newAnswers,
                correctCount: totalCorrectWords
            })
        }
    }

    // Remove last word
    const handleRemoveLastWord = () => {
        const currentLine = userInputLines[currentLineIndex]
        if (!currentLine) return

        const lineKey = `line_${currentLine.originalIndex}`
        const currentWords = answers[lineKey] || []

        if (currentWords.length > 0) {
            const newWords = currentWords.slice(0, -1)
            const newAnswers = { ...answers, [lineKey]: newWords }
            setAnswers(newAnswers)
        }
    }

    // Play audio with more natural settings
    const playAudio = (text) => {
        if (!text || isPlaying) return

        setIsPlaying(true)
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            if (selectedVoice) utterance.voice = selectedVoice
            // More natural speech settings
            utterance.rate = 0.92  // Slightly slower for clarity
            utterance.pitch = 1.05  // Slightly higher for warmth
            utterance.volume = 1.0
            utterance.onend = () => setIsPlaying(false)
            utterance.onerror = () => setIsPlaying(false)
            speechSynthesis.speak(utterance)
        } else {
            setTimeout(() => setIsPlaying(false), 2000)
        }
    }

    // Calculate total CORRECT words filled (validate against correct_answers)
    const getTotalCorrectWords = () => {
        let correctCount = 0
        userInputLines.forEach((line) => {
            const lineKey = `line_${line.originalIndex}`
            const filledWords = answers[lineKey] || []
            const correctAnswers = line.correct_answers || []

            // Check each filled word against the correct answer at that position
            filledWords.forEach((word, index) => {
                if (correctAnswers[index] && word === correctAnswers[index]) {
                    correctCount++
                }
            })
        })
        return correctCount
    }

    // Calculate total blanks available
    const getTotalBlanksAvailable = () => {
        let total = 0
        userInputLines.forEach((line) => {
            const blankCount = (line.template?.match(/_{3,}/g) || []).length
            total += blankCount
        })
        return total
    }

    // Check completion
    const isComplete = completedLines.size === userInputLines.length && userInputLines.length > 0
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = () => {
        setSubmitted(true)
        // Send word arrays keyed by line_N so backend can do exact matching
        const lineAnswers = {}
        userInputLines.forEach((line) => {
            const lineKey = `line_${line.originalIndex}`
            lineAnswers[lineKey] = answers[lineKey] || []
        })
        onProgress?.({ answers: lineAnswers })
        onComplete({
            isPerfect: false,
            correctCount: undefined,
            totalCount: getTotalBlanksAvailable(),
        })
    }

    // Scroll to bottom
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }
    }, [visibleMessages, isTyping])

    // Get display text for user input line
    const getDisplayText = (line) => {
        const lineKey = `line_${line.originalIndex}`
        const selectedWords = answers[lineKey] || []
        let template = line.template || ''
        let wordIndex = 0
        return template.replace(/_{3,}/g, () => {
            if (wordIndex < selectedWords.length) {
                return selectedWords[wordIndex++]
            }
            return '______'
        })
    }

    const callerName = dialogueLines[0]?.speaker || 'Contact'
    const callerInitial = callerName[0]?.toUpperCase() || 'C'
    const usedWords = Object.values(answers).flat()

    // Get current time in user's locale
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }
        updateTime()
        const interval = setInterval(updateTime, 60000)
        return () => clearInterval(interval)
    }, [])

    // Clay button style helper
    const clayBtn = (color) => ({
        borderRadius: '14px',
        border: `2px solid ${color.border}`,
        boxShadow: `4px 4px 0 ${color.shadow}`,
        fontWeight: 800,
        transition: 'transform 0.12s, box-shadow 0.12s',
        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${color.shadow}` },
    })

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 1, sm: 2 } }}>
            {/* Chat Container - Clay Card */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: 500 },
                    bgcolor: c.cardBg,
                    border: `2px solid ${c.blue.border}`,
                    borderRadius: '20px',
                    boxShadow: `4px 4px 0 ${c.blue.shadow}`,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Chat Header - Clay styled */}
                <Box sx={{
                    bgcolor: c.blue.bg,
                    border: `none`,
                    borderBottom: `2px solid ${c.blue.border}`,
                    p: { xs: 1, sm: 1.5 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5 }
                }}>
                    <IconButton size="small" sx={{ color: c.muted, minWidth: 44, minHeight: 44 }}>
                        <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                    <Avatar sx={{
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        bgcolor: c.purple.bg,
                        border: `2px solid ${c.purple.border}`,
                        boxShadow: `2px 2px 0 ${c.purple.shadow}`,
                        fontSize: { xs: '0.85rem', sm: '1rem' },
                        fontWeight: 800,
                        color: c.heading
                    }}>
                        {callerInitial}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{
                            color: c.heading,
                            fontWeight: 800,
                            lineHeight: 1.2,
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {callerName}
                        </Typography>
                        <Typography sx={{ color: isTyping ? c.green.border : c.muted, fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 600 }}>
                            {isTyping ? 'typing...' : 'online'}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={0}>
                        <IconButton sx={{ color: c.muted, minWidth: 44, minHeight: 44, display: { xs: 'none', sm: 'flex' } }}>
                            <VideocamIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton sx={{ color: c.muted, minWidth: 44, minHeight: 44 }}>
                            <CallIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton sx={{ color: c.muted, minWidth: 44, minHeight: 44 }}>
                            <MoreVertIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Stack>
                </Box>

                {/* Chat Area */}
                <Box
                    ref={transcriptRef}
                    sx={{
                        height: { xs: 350, sm: 400 },
                        overflowY: 'auto',
                        bgcolor: c.pageBg,
                        p: { xs: 1.5, sm: 2 },
                        '&::-webkit-scrollbar': { width: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: c.divider, borderRadius: 3 }
                    }}
                >
                    {visibleMessages.map((line, displayIdx) => {
                        const isUserInput = line.template && line.template.includes('___')
                        const userLineIdx = isUserInput
                            ? userInputLines.findIndex(l => l.originalIndex === line.originalIndex)
                            : -1
                        const isCurrentLine = userLineIdx === currentLineIndex
                        const isCompleted = userLineIdx !== -1 && isLineComplete(userLineIdx)
                        const isOutgoing = line.speaker?.toLowerCase().includes('you')

                        // Pick bubble color based on role
                        const bubbleColor = isOutgoing
                            ? c.blue
                            : (displayIdx % 2 === 0 ? c.teal : c.purple)

                        return (
                            <Fade in={true} key={line.originalIndex} timeout={300}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
                                        mb: 1.5
                                    }}
                                >
                                    {/* Clay message bubble */}
                                    <Box
                                        sx={{
                                            p: { xs: 1.25, sm: 1.5 },
                                            px: { xs: 1.5, sm: 2 },
                                            maxWidth: { xs: '85%', sm: '75%' },
                                            bgcolor: bubbleColor.bg,
                                            borderRadius: '16px',
                                            border: `2px solid ${isCurrentLine ? c.yellow.border : bubbleColor.border}`,
                                            boxShadow: isCurrentLine
                                                ? `4px 4px 0 ${c.yellow.shadow}`
                                                : `3px 3px 0 ${bubbleColor.shadow}`,
                                            position: 'relative',
                                            transition: 'box-shadow 0.2s, border-color 0.2s'
                                        }}
                                    >
                                        {/* Sender name */}
                                        {!isOutgoing && (
                                            <Typography sx={{
                                                color: bubbleColor.border,
                                                fontWeight: 800,
                                                display: 'block',
                                                mb: 0.5,
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                            }}>
                                                {line.speaker}
                                            </Typography>
                                        )}

                                        <Typography
                                            sx={{
                                                color: c.body,
                                                lineHeight: 1.5,
                                                fontSize: { xs: '0.88rem', sm: '0.95rem' },
                                                wordBreak: 'break-word',
                                                fontWeight: 500
                                            }}
                                        >
                                            {isUserInput ? getDisplayText(line) : line.text}
                                        </Typography>

                                        {/* Time and status */}
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" sx={{ mt: 0.5 }}>
                                            <Typography sx={{ color: c.muted, fontSize: '0.65rem', fontWeight: 600 }}>
                                                {currentTime}
                                            </Typography>
                                            {isOutgoing && (
                                                <DoneAllIcon sx={{ fontSize: 14, color: isCompleted ? c.green.border : c.muted }} />
                                            )}
                                        </Stack>

                                        {/* Audio button for incoming */}
                                        {!isOutgoing && line.text && (
                                            <IconButton
                                                onClick={() => playAudio(line.text)}
                                                disabled={isPlaying}
                                                sx={{
                                                    position: 'absolute',
                                                    right: { xs: -36, sm: -40 },
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: isPlaying ? c.blue.border : c.muted,
                                                    minWidth: 44,
                                                    minHeight: 44,
                                                    '&:hover': { color: c.blue.border }
                                                }}
                                            >
                                                <VolumeUpIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                            </IconButton>
                                        )}

                                    </Box>
                                </Box>
                            </Fade>
                        )
                    })}

                    {/* Typing Indicator - Clay styled */}
                    {isTyping && (
                        <Fade in={true}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.5 }}>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        px: 2.5,
                                        bgcolor: c.teal.bg,
                                        borderRadius: '16px',
                                        border: `2px solid ${c.teal.border}`,
                                        boxShadow: `3px 3px 0 ${c.teal.shadow}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}
                                >
                                    {[0, 1, 2].map(i => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: c.teal.border,
                                                animation: `typing 1.4s infinite ${i * 0.2}s`,
                                                '@keyframes typing': {
                                                    '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
                                                    '30%': { transform: 'translateY(-4px)', opacity: 1 }
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Fade>
                    )}

                    {/* Completion — review + submit */}
                    {isComplete && !submitted && (
                        <Fade in={true}>
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box
                                        component="button"
                                        onClick={handleSubmit}
                                        sx={{
                                            display: 'inline-flex', alignItems: 'center', gap: 1,
                                            px: 3, py: 1.25, borderRadius: '14px', cursor: 'pointer',
                                            bgcolor: c.green.border, color: '#fff', border: 'none',
                                            fontWeight: 800, fontSize: '0.9rem', fontFamily: 'inherit',
                                            boxShadow: `4px 4px 0 ${c.green.shadow}`,
                                            transition: 'transform 0.12s, box-shadow 0.12s',
                                            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.green.shadow}` },
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                                        Submit
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                    {submitted && (
                        <Fade in={true}>
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Box sx={{
                                    display: 'inline-block', px: 3, py: 1.5,
                                    bgcolor: c.green.bg, border: `2px solid ${c.green.border}`,
                                    borderRadius: '20px', boxShadow: `4px 4px 0 ${c.green.shadow}`
                                }}>
                                    <Typography sx={{ color: c.green.border, fontWeight: 800, fontSize: '0.9rem' }}>
                                        Submitted! Evaluating…
                                    </Typography>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                </Box>

                {/* Word Bank / Input Area - Clay styled */}
                {!isComplete && userInputLines.length > 0 && (
                    <Box sx={{
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: c.cardBg,
                        borderTop: `2px solid ${c.divider}`
                    }}>
                        {/* Guided Questions */}
                        {guidedQuestions && guidedQuestions.length > 0 && guidedQuestions[currentLineIndex] && (
                            <Box sx={{
                                mb: 1.5,
                                p: { xs: 0.75, sm: 1 },
                                bgcolor: c.yellow.bg,
                                borderRadius: '14px',
                                border: `2px solid ${c.yellow.border}`,
                                boxShadow: `2px 2px 0 ${c.yellow.shadow}`
                            }}>
                                <Typography sx={{ color: c.yellow.text || c.yellow.border, fontSize: '0.7rem', fontWeight: 800, mb: 0.5 }}>
                                    Tip:
                                </Typography>
                                <Typography sx={{ color: c.muted, fontSize: '0.75rem', pl: 1, fontWeight: 500 }}>
                                    {guidedQuestions[currentLineIndex]}
                                </Typography>
                            </Box>
                        )}
                        <Typography sx={{ color: c.muted, display: 'block', mb: 1.5, fontSize: { xs: '0.72rem', sm: '0.78rem' }, fontWeight: 600 }}>
                            Tap words to complete your message:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.75, sm: 1 }}>
                            {wordBank.map((word, idx) => {
                                return (
                                    <Box
                                        key={idx}
                                        onClick={() => handleWordSelect(word)}
                                        sx={{
                                            px: { xs: 1.25, sm: 1.75 },
                                            py: { xs: 0.5, sm: 0.4 },
                                            borderRadius: '50px',
                                            bgcolor: c.purple.bg,
                                            border: `2px solid ${c.purple.border}`,
                                            boxShadow: `2px 2px 0 ${c.purple.shadow}`,
                                            fontSize: { xs: '0.72rem', sm: '0.8rem' },
                                            fontWeight: 800,
                                            color: c.heading,
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            minHeight: 44,
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'transform 0.12s, box-shadow 0.12s',
                                            '&:hover': {
                                                transform: 'translate(-1px,-1px)',
                                                boxShadow: `3px 3px 0 ${c.purple.shadow}`
                                            },
                                            '&:active': {
                                                transform: 'translate(1px,1px)',
                                                boxShadow: `1px 1px 0 ${c.purple.shadow}`
                                            }
                                        }}
                                    >
                                        {word}
                                    </Box>
                                )
                            })}
                        </Stack>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* Progress pill */}
                            <Box sx={{
                                px: 1.75,
                                py: 0.4,
                                borderRadius: '50px',
                                bgcolor: c.blue.bg,
                                border: `2px solid ${c.blue.border}`,
                                boxShadow: `2px 2px 0 ${c.blue.shadow}`,
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: c.heading
                            }}>
                                {currentLineIndex + 1} / {userInputLines.length}
                            </Box>
                            <Button
                                size="small"
                                onClick={handleRemoveLastWord}
                                sx={{
                                    color: c.heading,
                                    bgcolor: c.red.bg,
                                    minHeight: 44,
                                    ...clayBtn(c.red),
                                    px: 2,
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: c.red.bg,
                                        transform: 'translate(-2px,-2px)',
                                        boxShadow: `6px 6px 0 ${c.red.shadow}`
                                    }
                                }}
                            >
                                Undo
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
