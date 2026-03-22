import React, { useState, useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'

const PuzzleGame = ({ items, descriptions, answers, onChange, onComplete }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const palette = isDark ? {
        pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
        blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
        green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
        purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
        yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
        red: { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
        orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
        teal: { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
    } : {
        pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
        blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
        red: { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
        teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
    }

    const [draggedItem, setDraggedItem] = useState(null)
    const [wrongPieces, setWrongPieces] = useState(new Set())
    const [isAssembling, setIsAssembling] = useState(false)
    const [isExploding, setIsExploding] = useState(false)
    const [assembledPieces, setAssembledPieces] = useState(new Set())

    // Shuffle array helper (Fisher-Yates shuffle)
    const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    // Get items as array and randomize order
    const itemsArray = items || Object.keys(descriptions || {})
    const descriptionsObj = descriptions || {}

    // Randomize once on mount
    const [randomizedItems] = useState(() => shuffleArray(itemsArray))
    const [randomizedLabels] = useState(() => shuffleArray(itemsArray))

    const handleDragStart = (item) => {
        setDraggedItem(item)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
    }

    const handleDrop = (targetItem, description) => {
        if (!draggedItem) return

        const isCorrect = descriptionsObj[draggedItem] === description

        if (isCorrect) {
            // Correct match - vibrate and glow
            onChange(draggedItem, draggedItem)
            setAssembledPieces(prev => new Set([...prev, targetItem]))

            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate(50)
            }

            // Remove from wrong pieces if it was there
            setWrongPieces(prev => {
                const next = new Set(prev)
                next.delete(targetItem)
                return next
            })
        } else {
            // Wrong match - shake animation
            setWrongPieces(prev => new Set([...prev, targetItem]))
            setTimeout(() => {
                setWrongPieces(prev => {
                    const next = new Set(prev)
                    next.delete(targetItem)
                    return next
                })
            }, 500)
        }

        setDraggedItem(null)
    }

    // Check if all pieces are correctly matched
    const isComplete = randomizedItems.length === Object.keys(answers || {}).length &&
        randomizedItems.every(item => answers[item] === item)

    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete()
        }
    }, [isComplete, onComplete])

    const getPieceColor = (isMatched, isWrong) => {
        if (isMatched) return palette.green
        if (isWrong) return palette.red
        return palette.purple
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: { xs: 2, sm: 4 } }}>
            {/* Puzzle Pieces Grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: { xs: 2, sm: 3 },
                mb: 4,
                justifyItems: 'center',
                px: { xs: 1, sm: 2 },
                position: 'relative'
            }}>
                {randomizedItems.map((item, index) => {
                    const description = descriptionsObj[item]
                    const isMatched = answers[item] === item
                    const isWrong = wrongPieces.has(item)
                    const selectedLabel = answers[item]
                    const c = getPieceColor(isMatched, isWrong)

                    return (
                        <Box
                            key={item}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(item, description)}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                minHeight: { xs: 120, sm: 150 },
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                bgcolor: c.bg,
                                border: `2px solid ${c.border}`,
                                borderRadius: '20px',
                                boxShadow: `4px 4px 0 ${c.shadow}`,
                                cursor: 'pointer',
                                transition: 'transform 0.12s, box-shadow 0.12s',
                                animation: isWrong ? 'shake 0.5s' : isMatched ? 'vibrate 0.3s' : 'none',
                                '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '25%': { transform: 'translateX(-10px)' },
                                    '75%': { transform: 'translateX(10px)' }
                                },
                                '@keyframes vibrate': {
                                    '0%, 100%': { transform: 'translate(0, 0)' },
                                    '25%': { transform: 'translate(-2px, 2px)' },
                                    '50%': { transform: 'translate(2px, -2px)' },
                                    '75%': { transform: 'translate(-2px, -2px)' }
                                },
                                '&:hover': {
                                    transform: 'translate(-2px, -2px)',
                                    boxShadow: `6px 6px 0 ${c.shadow}`
                                }
                            }}
                        >
                            {/* Puzzle piece number */}
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 12,
                                    color: palette.muted,
                                    fontWeight: 800,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }}
                            >
                                {index + 1}
                            </Typography>

                            {/* Description text */}
                            <Typography
                                sx={{
                                    textAlign: 'center',
                                    color: isMatched ? palette.green.border : palette.body,
                                    fontWeight: isMatched ? 800 : 600,
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' }
                                }}
                            >
                                {description}
                            </Typography>

                            {/* Matched label */}
                            {selectedLabel && (
                                <Box
                                    sx={{
                                        mt: 1.5,
                                        px: 1.75,
                                        py: 0.4,
                                        borderRadius: '50px',
                                        bgcolor: isMatched ? palette.green.bg : palette.blue.bg,
                                        border: `2px solid ${isMatched ? palette.green.border : palette.blue.border}`,
                                        boxShadow: `2px 2px 0 ${isMatched ? palette.green.shadow : palette.blue.shadow}`,
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        color: isMatched ? palette.green.border : palette.blue.border,
                                        animation: isMatched ? 'pulse 0.5s' : 'none',
                                        '@keyframes pulse': {
                                            '0%': { transform: 'scale(1)' },
                                            '50%': { transform: 'scale(1.1)' },
                                            '100%': { transform: 'scale(1)' }
                                        }
                                    }}
                                >
                                    {selectedLabel}
                                </Box>
                            )}

                            {/* Drop zone indicator */}
                            {draggedItem && !selectedLabel && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 4,
                                        border: `3px dashed ${palette.blue.border}`,
                                        borderRadius: '16px',
                                        opacity: 0.5,
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}

                            {/* Checkmark for correct matches */}
                            {isMatched && (
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 10,
                                        fontSize: { xs: '1.4rem', sm: '1.8rem' },
                                        color: palette.green.border,
                                        fontWeight: 800
                                    }}
                                >
                                    ✓
                                </Typography>
                            )}
                        </Box>
                    )
                })}
            </Box>

            {/* Draggable Labels */}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 1.5 },
                justifyContent: 'center',
                mb: 3,
                px: { xs: 1, sm: 2 }
            }}>
                {randomizedLabels.map(item => {
                    const isUsed = Object.values(answers || {}).includes(item)
                    const c = palette.blue

                    return (
                        <Box
                            key={item}
                            draggable={!isUsed}
                            onDragStart={() => handleDragStart(item)}
                            onDragEnd={handleDragEnd}
                            sx={{
                                px: 1.75,
                                py: 0.4,
                                minHeight: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '50px',
                                bgcolor: isUsed ? (isDark ? palette.divider : '#E0E0E0') : c.bg,
                                border: `2px solid ${isUsed ? palette.muted : c.border}`,
                                boxShadow: isUsed ? 'none' : `2px 2px 0 ${c.shadow}`,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                fontWeight: 800,
                                color: isUsed ? palette.muted : c.border,
                                cursor: isUsed ? 'not-allowed' : 'grab',
                                opacity: isUsed ? 0.5 : 1,
                                transform: draggedItem === item ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.12s, box-shadow 0.12s',
                                userSelect: 'none',
                                '&:hover': {
                                    transform: isUsed ? 'scale(1)' : 'translate(-2px,-2px)',
                                    boxShadow: isUsed ? 'none' : `4px 4px 0 ${c.shadow}`
                                },
                                '&:active': {
                                    cursor: isUsed ? 'not-allowed' : 'grabbing'
                                }
                            }}
                        >
                            {item}
                        </Box>
                    )
                })}
            </Box>

            {/* Progress Indicator */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Box
                    component="span"
                    sx={{
                        display: 'inline-block',
                        px: 1.75,
                        py: 0.4,
                        borderRadius: '50px',
                        bgcolor: palette.yellow.bg,
                        border: `2px solid ${palette.yellow.border}`,
                        boxShadow: `2px 2px 0 ${palette.yellow.shadow}`,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        fontWeight: 800,
                        color: palette.yellow.text || palette.yellow.border
                    }}
                >
                    {Object.keys(answers || {}).length} / {randomizedItems.length} Matched
                </Box>
                {isComplete && (
                    <Box
                        sx={{
                            mt: 2,
                            mx: 'auto',
                            maxWidth: 400,
                            p: { xs: 2, sm: 3 },
                            bgcolor: palette.green.bg,
                            border: `2px solid ${palette.green.border}`,
                            borderRadius: '20px',
                            boxShadow: `4px 4px 0 ${palette.green.shadow}`,
                        }}
                    >
                        <Typography sx={{
                            fontWeight: 800,
                            color: palette.green.border,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                            Puzzle Complete! Click Submit to continue.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default PuzzleGame
