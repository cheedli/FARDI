/**
 * SentenceGarden - Plant Growth Sentence Expansion Component
 *
 * A gamified sentence expansion where:
 * - Plant starts as seed
 * - Grows based on word count of expansion
 * - Visual stages: seed → sprout → small plant → full plant → flower
 */
import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, TextField, Button, Stack, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Plant growth stages with emoji visuals
const GROWTH_STAGES = [
    { name: 'Seed', emoji: '🌰', minWords: 0, color: '#8B4513' },
    { name: 'Sprouting', emoji: '🌱', minWords: 5, color: '#90EE90' },
    { name: 'Growing', emoji: '🌿', minWords: 15, color: '#32CD32' },
    { name: 'Blooming', emoji: '🌻', minWords: 25, color: '#FFD700' },
    { name: 'Flourishing', emoji: '🌺', minWords: 40, color: '#FF69B4' }
]

const getColors = (dark) => dark ? {
    pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
    blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
    green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
    purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
    yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
    teal: { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
    orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
} : {
    pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
    blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
    purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
    teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
    orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}

export default function SentenceGarden({ exercise, onComplete, onProgress }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentInput, setCurrentInput] = useState('')
    const [answers, setAnswers] = useState({})
    const [showSuccess, setShowSuccess] = useState(false)
    const [totalWords, setTotalWords] = useState(0)

    const theme = useTheme()
    const dark = theme.palette.mode === 'dark'
    const c = getColors(dark)

    const templates = exercise?.templates || []
    const guidedQuestions = exercise?.guided_questions || []
    const totalTemplates = templates.length

    // Get current word count
    const wordCount = currentInput.trim().split(/\s+/).filter(w => w).length

    // Determine current growth stage
    const currentStage = useMemo(() => {
        let stage = GROWTH_STAGES[0]
        for (const s of GROWTH_STAGES) {
            if (wordCount >= s.minWords) {
                stage = s
            }
        }
        return stage
    }, [wordCount])

    // Check if can proceed (minimum 10 words)
    const minRequired = 10
    const canProceed = wordCount >= minRequired

    // Handle next phrase
    const handleNext = () => {
        if (!canProceed) return

        const key = `expansion_${currentIndex}`
        const newAnswers = { ...answers, [key]: currentInput }
        setAnswers(newAnswers)
        setTotalWords(prev => prev + wordCount)

        // Show success animation
        setShowSuccess(true)

        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100])
        }

        onProgress?.({ answers: newAnswers, totalWords: totalWords + wordCount })

        setTimeout(() => {
            setShowSuccess(false)
            if (currentIndex < totalTemplates - 1) {
                setCurrentIndex(prev => prev + 1)
                setCurrentInput('')
            } else {
                // Complete
                onComplete?.({
                    isPerfect: true,
                    answers: newAnswers,
                    totalWords: totalWords + wordCount
                })
            }
        }, 1500)
    }

    const progress = ((currentIndex + (showSuccess ? 1 : 0)) / totalTemplates) * 100
    const isComplete = currentIndex >= totalTemplates - 1 && showSuccess

    if (!templates || templates.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: c.body }}>No templates available</Typography>
            </Box>
        )
    }

    const cardSx = (accent) => ({
        bgcolor: accent.bg,
        border: `2px solid ${accent.border}`,
        borderRadius: '20px',
        boxShadow: `4px 4px 0 ${accent.shadow}`,
    })

    const pillSx = (accent) => ({
        px: 1.75, py: 0.4, borderRadius: '50px',
        bgcolor: accent.bg, border: `2px solid ${accent.border}`,
        boxShadow: `2px 2px 0 ${accent.shadow}`,
        fontSize: '0.8rem', fontWeight: 800,
        display: 'inline-flex', alignItems: 'center',
    })

    const clayBtnSx = (accent, disabled) => ({
        borderRadius: '14px',
        border: `2px solid ${disabled ? c.muted : accent.border}`,
        boxShadow: disabled ? 'none' : `4px 4px 0 ${accent.shadow}`,
        fontWeight: 800,
        bgcolor: disabled ? (dark ? '#2A2A4A' : '#E0E0E0') : accent.bg,
        color: disabled ? c.muted : (accent.text || accent.border),
        minHeight: 48,
        fontSize: { xs: '0.9rem', sm: '1rem' },
        '&:hover': disabled ? {} : {
            bgcolor: accent.bg,
            transform: 'translate(-2px,-2px)',
            boxShadow: `6px 6px 0 ${accent.shadow}`,
        },
        '&.Mui-disabled': {
            bgcolor: dark ? '#2A2A4A' : '#E0E0E0',
            color: c.muted,
            border: `2px solid ${c.muted}`,
        },
        transition: 'all 0.15s ease',
    })

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 800,
            mx: 'auto',
            py: { xs: 2, sm: 3 },
            px: { xs: 1.5, sm: 2 },
        }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
                <Typography sx={{
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    fontWeight: 800, color: c.heading,
                }}>
                    Sentence Garden
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: c.muted, mt: 0.5 }}>
                    Expand the sentence to grow your plant!
                </Typography>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box sx={{
                    height: 10, borderRadius: '50px', overflow: 'hidden',
                    bgcolor: c.green.bg, border: `2px solid ${c.green.border}`,
                }}>
                    <Box sx={{
                        height: '100%', width: `${progress}%`,
                        bgcolor: c.green.border, borderRadius: '50px',
                        transition: 'width 0.4s ease',
                    }} />
                </Box>
                <Typography sx={{
                    mt: 0.5, textAlign: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: c.muted,
                }}>
                    {currentIndex + (showSuccess ? 1 : 0)} / {totalTemplates} sentences expanded
                </Typography>
            </Box>

            {/* Success Animation */}
            {showSuccess && (
                <Box sx={{
                    ...cardSx(c.green),
                    p: { xs: 3, sm: 4 }, mb: 3, textAlign: 'center',
                    animation: 'clayFadeIn 0.5s ease-out',
                    '@keyframes clayFadeIn': {
                        from: { opacity: 0, transform: 'scale(0.9) translateY(8px)' },
                        to: { opacity: 1, transform: 'scale(1) translateY(0)' },
                    },
                }}>
                    <Typography sx={{ fontSize: '4rem', mb: 1 }}>
                        {currentStage.emoji}
                    </Typography>
                    <CheckCircleIcon sx={{ fontSize: 48, color: c.green.border, mb: 1 }} />
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: c.green.border }}>
                        Beautiful! Your plant grew!
                    </Typography>
                    <Box sx={{ ...pillSx(c.green), mx: 'auto', mt: 1.5 }}>
                        +{wordCount} words added
                    </Box>
                </Box>
            )}

            {/* Main Game Area */}
            {!showSuccess && (
                <Box sx={{
                    ...cardSx(c.teal),
                    p: { xs: 2, sm: 3 },
                }}>
                    {/* Plant Display */}
                    <Box sx={{
                        textAlign: 'center',
                        py: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 },
                        bgcolor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '16px',
                        border: `1px solid ${c.divider}`,
                        position: 'relative',
                    }}>
                        {/* Soil */}
                        <Box sx={{
                            position: 'absolute', bottom: 0, left: '50%',
                            transform: 'translateX(-50%)',
                            width: { xs: 90, sm: 120 }, height: { xs: 16, sm: 20 },
                            bgcolor: dark ? '#5D3A1A' : '#8B4513',
                            borderRadius: '50%',
                        }} />

                        {/* Plant */}
                        <Typography sx={{
                            fontSize: { xs: '3.5rem', sm: '5rem' },
                            transition: 'all 0.5s ease',
                            transform: `scale(${0.6 + (GROWTH_STAGES.indexOf(currentStage) * 0.15)})`,
                            filter: `brightness(${0.7 + (GROWTH_STAGES.indexOf(currentStage) * 0.1)})`,
                            lineHeight: 1.2,
                        }}>
                            {currentStage.emoji}
                        </Typography>

                        {/* Stage Label */}
                        <Box sx={{ ...pillSx(c.yellow), mx: 'auto', mt: 1 }}>
                            <span style={{ color: c.yellow.text || c.yellow.border }}>
                                {currentStage.name}
                            </span>
                        </Box>
                    </Box>

                    {/* Word Count Progress */}
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: c.muted }}>
                                Words: {wordCount}
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.75rem', fontWeight: 700,
                                color: canProceed ? c.green.border : c.muted,
                            }}>
                                {canProceed ? 'Ready!' : `Need ${minRequired - wordCount} more`}
                            </Typography>
                        </Stack>
                        <Box sx={{
                            height: 8, bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            borderRadius: '50px', overflow: 'hidden',
                            border: `1px solid ${c.divider}`,
                        }}>
                            <Box sx={{
                                height: '100%',
                                width: `${Math.min((wordCount / 40) * 100, 100)}%`,
                                bgcolor: currentStage.color,
                                borderRadius: '50px',
                                transition: 'all 0.3s ease',
                            }} />
                        </Box>

                        {/* Growth markers */}
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, px: 0.5 }}>
                            {GROWTH_STAGES.map((stage, idx) => (
                                <Typography
                                    key={idx}
                                    sx={{
                                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                        opacity: wordCount >= stage.minWords ? 1 : 0.4,
                                        transition: 'opacity 0.3s',
                                    }}
                                >
                                    {stage.emoji}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    {/* Original Phrase */}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{
                            fontSize: '0.75rem', fontWeight: 700, color: c.muted, mb: 0.5,
                        }}>
                            Phrase {currentIndex + 1} of {totalTemplates}:
                        </Typography>
                        <Box sx={{
                            ...cardSx(c.purple),
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: '14px',
                        }}>
                            <Typography sx={{
                                color: c.purple.text || c.purple.border,
                                fontStyle: 'italic',
                                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                fontWeight: 600,
                            }}>
                                "{templates[currentIndex].replace(/_+/g, '________')}"
                            </Typography>
                        </Box>
                    </Box>

                    {/* Guided Questions */}
                    {guidedQuestions && guidedQuestions.length > 0 && (
                        <Box sx={{
                            ...cardSx(c.green),
                            mb: 2, p: { xs: 1.5, sm: 2 },
                            borderRadius: '14px',
                        }}>
                            <Typography sx={{
                                color: c.green.border,
                                fontSize: '0.7rem', fontWeight: 800,
                                mb: 0.5, textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Tip:
                            </Typography>
                            <Typography sx={{
                                color: c.body,
                                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                pl: 1.5,
                                borderLeft: `3px solid ${c.green.border}`,
                                fontWeight: 600,
                            }}>
                                {guidedQuestions[currentIndex] || guidedQuestions[0]}
                            </Typography>
                        </Box>
                    )}

                    {/* Input Area */}
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Expand this sentence here... Add details, descriptions, and more!"
                        variant="outlined"
                        autoFocus
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                color: c.body,
                                bgcolor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                                borderRadius: '14px',
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                '& fieldset': {
                                    border: `2px solid ${c.divider}`,
                                    borderRadius: '14px',
                                },
                                '&:hover fieldset': { borderColor: c.teal.border },
                                '&.Mui-focused fieldset': {
                                    borderColor: c.teal.border,
                                    boxShadow: `2px 2px 0 ${c.teal.shadow}`,
                                },
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: c.muted,
                                opacity: 1,
                            },
                        }}
                    />

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={!canProceed}
                        onClick={handleNext}
                        disableElevation
                        sx={{
                            ...clayBtnSx(c.green, !canProceed),
                            py: 1.5,
                        }}
                    >
                        {currentIndex >= totalTemplates - 1 ? 'Finish Garden' : 'Plant & Grow Next'}
                    </Button>
                </Box>
            )}

            {/* Completion Celebration */}
            {isComplete && (
                <Box sx={{
                    ...cardSx(c.green),
                    p: { xs: 3, sm: 4 }, mt: 3, textAlign: 'center',
                }}>
                    <Typography sx={{ fontSize: '3rem', mb: 1 }}>
                        🌺🌻🌸🌷🌹
                    </Typography>
                    <Typography sx={{
                        fontSize: { xs: '1.2rem', sm: '1.4rem' },
                        fontWeight: 800, color: c.green.border, mb: 1,
                    }}>
                        Garden Complete!
                    </Typography>
                    <Box sx={{ ...pillSx(c.yellow), mx: 'auto' }}>
                        <span style={{ color: c.yellow.text || c.yellow.border }}>
                            Total words written: {totalWords}
                        </span>
                    </Box>
                </Box>
            )}
        </Box>
    )
}
