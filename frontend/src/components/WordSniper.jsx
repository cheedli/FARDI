import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, useTheme } from '@mui/material'
import { CheckCircle, Cancel, TrendingUp } from '@mui/icons-material'

const WordSniper = ({ sentences, answers, onChange, globalWordBank = null, correctAnswers = [] }) => {
    const [currentPhrase, setCurrentPhrase] = useState(0)
    const [selectedWord, setSelectedWord] = useState(null)
    const [hits, setHits] = useState(0)
    const [misses, setMisses] = useState(0)
    const [targetHit, setTargetHit] = useState(null)
    const [showValidation, setShowValidation] = useState(false)

    const theme = useTheme()
    const dark = theme.palette.mode === 'dark'

    const p = dark
        ? {
            pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
            blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
            green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
            red: { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
            yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
            orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
            purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#6A1B9A' },
            teal: { bg: '#001A1F', border: '#4DD0E1', shadow: '#00695C' },
        }
        : {
            pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
            blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
            green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
            red: { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
            yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
            orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
            purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
            teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        }

    if (!sentences || sentences.length === 0) return null

    const sentence = sentences[currentPhrase]
    const template = sentence.text || ''
    const blanks = sentence.blanks || []

    // Generate word bank: use globalWordBank if provided, otherwise from current phrase blanks
    const wordBank = globalWordBank
        ? [...globalWordBank]
        : [...blanks].sort(() => Math.random() - 0.5)

    // Count how many blanks are already filled for this phrase
    const previousBlanks = sentences.slice(0, currentPhrase).reduce(
        (acc, s) => acc + (s.blanks?.length || 0),
        0
    )

    const blanksFilled = blanks.filter((_, bi) => {
        const key = `g_${previousBlanks + bi}`
        return answers[key] && answers[key] !== ''
    }).length

    const allFilled = blanksFilled === blanks.length
    const isLastPhrase = currentPhrase >= sentences.length - 1

    const handleWordSelect = (word) => {
        setSelectedWord(word)
    }

    const handleTargetClick = (blankIndex) => {
        if (!selectedWord) return

        const key = `g_${previousBlanks + blankIndex}`

        // If using global word bank, skip validation (all words are acceptable)
        if (globalWordBank) {
            onChange(key, selectedWord)
            setHits(hits + 1)
            setTargetHit({ index: blankIndex, correct: true })

            // Vibration feedback
            if (navigator.vibrate) navigator.vibrate(50)

            // Clear effects after animation
            setTimeout(() => {
                setSelectedWord(null)
                setTargetHit(null)
            }, 500)
        } else {
            // Original validation logic for fill_gaps
            const correctWord = blanks[blankIndex]
            const isCorrect = selectedWord === correctWord

            if (isCorrect) {
                onChange(key, selectedWord)
                setHits(hits + 1)
                setTargetHit({ index: blankIndex, correct: true })

                // Vibration feedback
                if (navigator.vibrate) navigator.vibrate(50)
            } else {
                setMisses(misses + 1)
                setTargetHit({ index: blankIndex, correct: false })
            }

            // Clear effects after animation
            setTimeout(() => {
                setSelectedWord(null)
                setTargetHit(null)
            }, 500)
        }
    }

    const handleNext = () => {
        // Show validation for current phrase before moving to next
        if (globalWordBank && correctAnswers.length > 0) {
            setShowValidation(true)
            // Wait for user to see validation, then move to next phrase
            setTimeout(() => {
                if (currentPhrase < sentences.length - 1) {
                    setCurrentPhrase(currentPhrase + 1)
                    setShowValidation(false)
                }
            }, 1500)
        } else {
            // Original behavior for fill_gaps
            if (currentPhrase < sentences.length - 1) {
                setCurrentPhrase(currentPhrase + 1)
            }
        }
    }

    const handleReset = () => {
        // Clear all answers for current phrase
        const blankIndices = Array.from({ length: blanks.length }, (_, i) => i)
        blankIndices.forEach(bi => {
            const key = `g_${previousBlanks + bi}`
            onChange(key, '')
        })
        setSelectedWord(null)
    }

    // Split template by blanks
    const parts = template.split(/_{3,}/)

    const clayCard = (c) => ({
        bgcolor: c.bg,
        border: `2px solid ${c.border}`,
        borderRadius: '20px',
        boxShadow: `4px 4px 0 ${c.shadow}`,
    })

    const clayPill = (c) => ({
        px: 1.75,
        py: 0.4,
        borderRadius: '50px',
        bgcolor: c.bg,
        border: `2px solid ${c.border}`,
        boxShadow: `2px 2px 0 ${c.shadow}`,
        fontSize: '0.8rem',
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        minHeight: '44px',
    })

    const clayButton = {
        borderRadius: '14px',
        border: '2px solid',
        boxShadow: '4px 4px 0',
        fontWeight: 800,
        textTransform: 'none',
        transition: 'transform 0.12s, box-shadow 0.12s',
        '&:hover': {
            transform: 'translate(-2px,-2px)',
            boxShadow: '6px 6px 0',
        },
    }

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 1000,
            mx: 'auto',
            py: { xs: 2, sm: 4 },
            px: { xs: 1, sm: 0 },
            cursor: selectedWord ? 'crosshair' : 'default'
        }}>
            {/* Stats Bar */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                mb: 3,
                px: { xs: 1, sm: 2 },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 1.5, sm: 2 },
            }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box sx={{ ...clayPill(p.blue), color: p.blue.border }}>
                        Phrase {currentPhrase + 1} / {sentences.length}
                    </Box>
                    {globalWordBank && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleReset}
                            sx={{
                                ...clayButton,
                                borderColor: p.orange.border,
                                color: p.orange.border,
                                boxShadow: `4px 4px 0 ${p.orange.shadow}`,
                                minHeight: '44px',
                                '&:hover': {
                                    ...clayButton['&:hover'],
                                    borderColor: p.orange.border,
                                    bgcolor: p.orange.bg,
                                    boxShadow: `6px 6px 0 ${p.orange.shadow}`,
                                },
                            }}
                        >
                            Reset Phrase
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ ...clayPill(p.green), color: p.green.border }}>
                        <CheckCircle sx={{ fontSize: '1rem' }} /> Hits: {hits}
                    </Box>
                    <Box sx={{ ...clayPill(p.red), color: p.red.border }}>
                        <Cancel sx={{ fontSize: '1rem' }} /> Misses: {misses}
                    </Box>
                    <Box sx={{ ...clayPill(p.blue), color: p.blue.border }}>
                        <TrendingUp sx={{ fontSize: '1rem' }} /> Accuracy: {hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%
                    </Box>
                </Box>
            </Box>

            {/* Sentence with Target Blanks */}
            <Box
                sx={{
                    ...clayCard(p.blue),
                    p: { xs: 2, sm: 3, md: 4 },
                    mb: { xs: 2, sm: 4 },
                    minHeight: { xs: 100, sm: 150 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 2 }, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                    {parts.map((part, pi) => (
                        <React.Fragment key={pi}>
                            <Typography component="span" sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, color: p.heading, fontWeight: 700 }}>
                                {part}
                            </Typography>
                            {pi < blanks.length && (() => {
                                const key = `g_${previousBlanks + pi}`
                                const filled = answers[key]
                                const isTarget = targetHit?.index === pi

                                // Check if answer is correct (for gap_fill_story with validation)
                                let isCorrect = true
                                if (globalWordBank && showValidation && filled && correctAnswers.length > currentPhrase) {
                                    const correctAnswer = correctAnswers[currentPhrase]
                                    isCorrect = correctAnswer && correctAnswer.toLowerCase().includes(filled.toLowerCase())
                                }

                                // Determine clay color set for blank
                                let blankColor = p.teal
                                if (filled) {
                                    if (globalWordBank) {
                                        if (showValidation) {
                                            blankColor = isCorrect ? p.green : p.red
                                        } else {
                                            blankColor = p.blue
                                        }
                                    } else {
                                        blankColor = p.green
                                    }
                                } else if (isTarget) {
                                    blankColor = targetHit.correct ? p.green : p.red
                                }

                                return (
                                    <Box
                                        onClick={() => handleTargetClick(pi)}
                                        sx={{
                                            px: { xs: 1.5, sm: 3 },
                                            py: 1,
                                            minWidth: { xs: 80, sm: 120 },
                                            minHeight: '44px',
                                            textAlign: 'center',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: blankColor.bg,
                                            border: `2px solid ${blankColor.border}`,
                                            borderRadius: '14px',
                                            boxShadow: `3px 3px 0 ${blankColor.shadow}`,
                                            cursor: selectedWord && !filled ? 'pointer' : 'default',
                                            transform: isTarget ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.3s',
                                            animation: isTarget
                                                ? targetHit.correct
                                                    ? 'targetHit 0.5s'
                                                    : 'targetMiss 0.5s'
                                                : 'none',
                                            '@keyframes targetHit': {
                                                '0%': { transform: 'scale(1)' },
                                                '50%': { transform: 'scale(1.2)', boxShadow: `0 0 30px ${p.green.shadow}` },
                                                '100%': { transform: 'scale(1)' }
                                            },
                                            '@keyframes targetMiss': {
                                                '0%, 100%': { transform: 'translateX(0)' },
                                                '25%': { transform: 'translateX(-10px)' },
                                                '75%': { transform: 'translateX(10px)' }
                                            },
                                            '&:hover': selectedWord && !filled
                                                ? {
                                                    transform: 'translate(-2px,-2px)',
                                                    boxShadow: `5px 5px 0 ${p.orange.shadow}`,
                                                    borderColor: p.orange.border,
                                                }
                                                : {}
                                        }}
                                    >
                                        {filled ? (
                                            <Typography sx={{ fontSize: { xs: '0.95rem', sm: '1.15rem' }, fontWeight: 800, color: blankColor.border }}>
                                                {filled}
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 700, color: p.muted }}>
                                                [ Target ]
                                            </Typography>
                                        )}
                                    </Box>
                                )
                            })()}
                        </React.Fragment>
                    ))}
                </Box>
            </Box>

            {/* Word Bank */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 }, justifyContent: 'center' }}>
                {wordBank.map((word, wi) => {
                    // If using global word bank, words can be reused, so don't disable them
                    const isUsedInCurrentPhrase = globalWordBank
                        ? false  // Global word bank allows reuse
                        : blanks.some((_, bi) => {
                            const key = `g_${previousBlanks + bi}`
                            return answers[key] === word
                        })
                    const isUsed = isUsedInCurrentPhrase
                    const isSelected = selectedWord === word

                    const wordColor = isUsed
                        ? { bg: p.divider, border: p.muted, shadow: p.muted }
                        : isSelected
                            ? p.yellow
                            : p.purple

                    return (
                        <Box
                            key={wi}
                            onClick={() => !isUsed && handleWordSelect(word)}
                            sx={{
                                px: { xs: 1.5, sm: 3 },
                                py: { xs: 1, sm: 2 },
                                fontSize: { xs: '0.85rem', sm: '1.1rem' },
                                fontWeight: 800,
                                minHeight: '44px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isUsed ? 'not-allowed' : 'pointer',
                                bgcolor: wordColor.bg,
                                color: isUsed ? p.muted : (wordColor.text || wordColor.border),
                                border: `2px solid ${wordColor.border}`,
                                borderRadius: '50px',
                                boxShadow: `3px 3px 0 ${wordColor.shadow}`,
                                opacity: isUsed ? 0.5 : 1,
                                transform: isSelected ? 'scale(1.1) translate(-2px,-2px)' : 'scale(1)',
                                transition: 'all 0.2s',
                                animation: isSelected ? 'pulse 1s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%, 100%': { boxShadow: `3px 3px 0 ${p.yellow.shadow}` },
                                    '50%': { boxShadow: `5px 5px 0 ${p.yellow.shadow}, 0 0 16px ${p.yellow.border}` }
                                },
                                '&:hover': !isUsed
                                    ? {
                                        transform: 'translate(-2px,-2px)',
                                        boxShadow: `5px 5px 0 ${wordColor.shadow}`,
                                    }
                                    : {}
                            }}
                        >
                            {word}
                        </Box>
                    )
                })}
            </Box>

            {/* Progress and Navigation */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 1.5, sm: 2 },
                px: { xs: 1, sm: 0 },
            }}>
                <Typography sx={{ fontWeight: 700, color: p.body, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {blanksFilled} / {blanks.length} targets hit
                </Typography>
                {allFilled && !isLastPhrase && (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{
                            ...clayButton,
                            minWidth: { xs: '100%', sm: 200 },
                            minHeight: '48px',
                            bgcolor: p.blue.bg,
                            color: p.blue.border,
                            borderColor: p.blue.border,
                            boxShadow: `4px 4px 0 ${p.blue.shadow}`,
                            '&:hover': {
                                ...clayButton['&:hover'],
                                bgcolor: p.blue.bg,
                                boxShadow: `6px 6px 0 ${p.blue.shadow}`,
                            },
                        }}
                    >
                        Next Phrase →
                    </Button>
                )}
                {allFilled && isLastPhrase && (
                    <Box sx={{
                        ...clayCard(p.green),
                        px: 3,
                        py: 1.5,
                        textAlign: 'center',
                    }}>
                        <Typography sx={{ fontWeight: 800, color: p.green.border, fontSize: { xs: '0.95rem', sm: '1.15rem' } }}>
                            All Phrases Complete! Click Submit.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default WordSniper
