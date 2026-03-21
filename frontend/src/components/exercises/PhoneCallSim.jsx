/**
 * PhoneCallSim - WhatsApp-style Chat Exercise Component
 * 
 * A dialogue completion exercise styled as WhatsApp with:
 * - WhatsApp green/white bubble colors
 * - Typing animation before messages appear
 * - Progressive message reveal
 * - Natural audio playback
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    Avatar,
    IconButton,
    Chip,
    Stack,
    Button,
    Fade,
    Zoom
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

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

    useEffect(() => {
        if (isComplete && onComplete) {
            const totalCorrectWords = getTotalCorrectWords()
            const totalBlanksAvailable = getTotalBlanksAvailable()

            console.log('=== PhoneCallSim - Scoring ===')
            console.log('Total CORRECT words:', totalCorrectWords, '/', totalBlanksAvailable)
            console.log('Each CORRECT word = +1 point')

            // Log details per line
            userInputLines.forEach((line) => {
                const lineKey = `line_${line.originalIndex}`
                const filledWords = answers[lineKey] || []
                const correctAnswers = line.correct_answers || []
                console.log(`Line ${line.originalIndex}:`, filledWords)
                console.log(`Correct answers:`, correctAnswers)
                filledWords.forEach((word, index) => {
                    const isCorrect = correctAnswers[index] && word === correctAnswers[index]
                    console.log(`  [${index}] "${word}" vs "${correctAnswers[index]}": ${isCorrect ? '✅ +1' : '❌ +0'}`)
                })
            })

            onComplete({
                isPerfect: totalCorrectWords === totalBlanksAvailable,
                correctCount: totalCorrectWords, // Count only CORRECT words
                totalCount: totalBlanksAvailable
            })
        }
    }, [isComplete, onComplete, completedLines.size, userInputLines.length])

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
            // Use user's locale for time format
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }
        updateTime()
        const interval = setInterval(updateTime, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            {/* WhatsApp Container */}
            <Paper
                elevation={16}
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#111b21',
                    position: 'relative'
                }}
            >
                {/* WhatsApp Header */}
                <Box sx={{
                    bgcolor: '#202c33',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <IconButton size="small" sx={{ color: '#aebac1' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Avatar sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#00a884',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}>
                        {callerInitial}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: '#e9edef', fontWeight: 500, lineHeight: 1.2 }}>
                            {callerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8696a0' }}>
                            {isTyping ? 'typing...' : 'online'}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: '#aebac1' }}>
                            <VideocamIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#aebac1' }}>
                            <CallIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#aebac1' }}>
                            <MoreVertIcon />
                        </IconButton>
                    </Stack>
                </Box>

                {/* Chat Background */}
                <Box
                    ref={transcriptRef}
                    sx={{
                        height: 400,
                        overflowY: 'auto',
                        bgcolor: '#0b141a',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23182229\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        p: 2,
                        '&::-webkit-scrollbar': { width: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 }
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

                        return (
                            <Fade in={true} key={line.originalIndex} timeout={300}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
                                        mb: 1.5
                                    }}
                                >
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 1.5,
                                            px: 2,
                                            maxWidth: '80%',
                                            bgcolor: isOutgoing ? '#005c4b' : '#202c33',
                                            borderRadius: 2,
                                            borderTopRightRadius: isOutgoing ? 0 : 2,
                                            borderTopLeftRadius: isOutgoing ? 2 : 0,
                                            position: 'relative',
                                            border: isCurrentLine ? '2px solid #00a884' : 'none',
                                            boxShadow: isCurrentLine ? '0 0 15px rgba(0, 168, 132, 0.3)' : 'none'
                                        }}
                                    >
                                        {/* Sender name for group effect */}
                                        {!isOutgoing && (
                                            <Typography variant="caption" sx={{ color: '#00a884', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                {line.speaker}
                                            </Typography>
                                        )}

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#e9edef',
                                                lineHeight: 1.5,
                                                fontSize: '0.95rem',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {isUserInput ? getDisplayText(line) : line.text}
                                        </Typography>

                                        {/* Time and status */}
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" sx={{ mt: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: '#8696a0', fontSize: '0.7rem' }}>
                                                {currentTime}
                                            </Typography>
                                            {isOutgoing && (
                                                <DoneAllIcon sx={{ fontSize: 14, color: isCompleted ? '#53bdeb' : '#8696a0' }} />
                                            )}
                                        </Stack>

                                        {/* Audio button for incoming */}
                                        {!isOutgoing && line.text && (
                                            <IconButton
                                                size="small"
                                                onClick={() => playAudio(line.text)}
                                                disabled={isPlaying}
                                                sx={{
                                                    position: 'absolute',
                                                    right: -40,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: isPlaying ? '#00a884' : '#8696a0',
                                                    '&:hover': { color: '#00a884' }
                                                }}
                                            >
                                                <VolumeUpIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        )}

                                        {/* Completion check */}
                                        {isCompleted && isOutgoing && (
                                            <Zoom in={true}>
                                                <CheckCircleIcon
                                                    sx={{
                                                        position: 'absolute',
                                                        left: -30,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#00a884',
                                                        fontSize: 22
                                                    }}
                                                />
                                            </Zoom>
                                        )}
                                    </Paper>
                                </Box>
                            </Fade>
                        )
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <Fade in={true}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.5 }}>
                                <Paper
                                    sx={{
                                        p: 1.5,
                                        px: 2.5,
                                        bgcolor: '#202c33',
                                        borderRadius: 2,
                                        borderTopLeftRadius: 0,
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
                                                bgcolor: '#8696a0',
                                                animation: `typing 1.4s infinite ${i * 0.2}s`,
                                                '@keyframes typing': {
                                                    '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
                                                    '30%': { transform: 'translateY(-4px)', opacity: 1 }
                                                }
                                            }}
                                        />
                                    ))}
                                </Paper>
                            </Box>
                        </Fade>
                    )}

                    {/* Completion Message */}
                    {isComplete && (
                        <Fade in={true}>
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Paper sx={{
                                    display: 'inline-block',
                                    px: 3,
                                    py: 1.5,
                                    bgcolor: 'rgba(0, 168, 132, 0.2)',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{ color: '#00a884' }}>
                                        🎉 Conversation complete!
                                    </Typography>
                                </Paper>
                            </Box>
                        </Fade>
                    )}
                </Box>

                {/* Word Bank / Input Area */}
                {!isComplete && userInputLines.length > 0 && (
                    <Box sx={{
                        p: 2,
                        bgcolor: '#202c33',
                        borderTop: '1px solid #2a3942'
                    }}>
                        {/* Guided Questions */}
                        {guidedQuestions && guidedQuestions.length > 0 && guidedQuestions[currentLineIndex] && (
                            <Box sx={{
                                mb: 1.5,
                                p: 1,
                                bgcolor: 'rgba(0, 92, 75, 0.2)',
                                borderRadius: 1,
                                border: '1px solid rgba(0, 92, 75, 0.4)'
                            }}>
                                <Typography sx={{ color: '#25d366', fontSize: '0.7rem', fontWeight: 600, mb: 0.5 }}>
                                    💡 Tip:
                                </Typography>
                                <Typography sx={{ color: '#8696a0', fontSize: '0.75rem', pl: 1 }}>
                                    {guidedQuestions[currentLineIndex]}
                                </Typography>
                            </Box>
                        )}
                        <Typography variant="caption" sx={{ color: '#8696a0', display: 'block', mb: 1.5 }}>
                            Tap words to complete your message:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {wordBank.map((word, idx) => {
                                return (
                                    <Chip
                                        key={idx}
                                        label={word}
                                        onClick={() => handleWordSelect(word)}
                                        sx={{
                                            bgcolor: '#00a884',
                                            color: 'white',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: '#008c6e'
                                            }
                                        }}
                                    />
                                )
                            })}
                        </Stack>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#8696a0' }}>
                                {currentLineIndex + 1} / {userInputLines.length}
                            </Typography>
                            <Button
                                size="small"
                                onClick={handleRemoveLastWord}
                                sx={{ color: '#8696a0', '&:hover': { color: '#e9edef' } }}
                            >
                                Undo
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    )
}
