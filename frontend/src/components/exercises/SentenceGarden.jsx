import React, { useState, useMemo } from 'react'
import { Box, Typography, TextField, Button, Stack, useTheme } from '@mui/material'

const GROWTH_STAGES = [
    { name: 'Seed',        emoji: '🌰', minWords: 0,  color: '#8B4513' },
    { name: 'Sprouting',   emoji: '🌱', minWords: 5,  color: '#90EE90' },
    { name: 'Growing',     emoji: '🌿', minWords: 15, color: '#32CD32' },
    { name: 'Blooming',    emoji: '🌻', minWords: 30, color: '#FFD700' },
    { name: 'Flourishing', emoji: '🌺', minWords: 50, color: '#FF69B4' },
]

const getColors = (dark) => dark ? {
    pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
    blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
    green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
    purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
    yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
    teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
    orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
} : {
    pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
    blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
    purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
    teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
    orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}

function getStage(totalWords) {
    let stage = GROWTH_STAGES[0]
    for (const s of GROWTH_STAGES) {
        if (totalWords >= s.minWords) stage = s
    }
    return stage
}

export default function SentenceGarden({ exercise, onComplete, onProgress }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentInput, setCurrentInput] = useState('')
    const [answers, setAnswers] = useState({})
    const [totalWords, setTotalWords] = useState(0)
    const [done, setDone] = useState(false)

    const theme = useTheme()
    const dark = theme.palette.mode === 'dark'
    const c = getColors(dark)

    const templates = exercise?.templates || []
    const guidedQuestions = exercise?.guided_questions || []
    const totalTemplates = templates.length

    const currentWordCount = currentInput.trim().split(/\s+/).filter(Boolean).length
    // Plant grows based on ALL words typed so far + what's in the current box
    const cumulativeWords = totalWords + currentWordCount
    const currentStage = useMemo(() => getStage(cumulativeWords), [cumulativeWords])
    const stageIdx = GROWTH_STAGES.indexOf(currentStage)

    const minRequired = 2
    const canProceed = currentWordCount >= minRequired

    const handleNext = () => {
        if (!canProceed) return

        const key = `expansion_${currentIndex}`
        const newAnswers = { ...answers, [key]: currentInput }
        const newTotal = totalWords + currentWordCount

        setAnswers(newAnswers)
        setTotalWords(newTotal)
        setCurrentInput('')

        onProgress?.({ answers: newAnswers, totalWords: newTotal })

        if (currentIndex < totalTemplates - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setDone(true)
            onComplete?.({
                isPerfect: false,
                correctCount: undefined,
                answers: newAnswers,
                totalWords: newTotal,
            })
        }
    }

    const progress = ((currentIndex + (done ? 1 : 0)) / totalTemplates) * 100

    if (!templates || templates.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: c.body }}>No templates available</Typography>
            </Box>
        )
    }

    const cardSx = (accent, extra = {}) => ({
        bgcolor: accent.bg,
        border: `2px solid ${accent.border}`,
        borderRadius: '20px',
        boxShadow: `4px 4px 0 ${accent.shadow}`,
        ...extra,
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
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
                <Typography sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' }, fontWeight: 800, color: c.heading }}>
                    Sentence Garden
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: c.muted, mt: 0.5 }}>
                    Expand each sentence — watch your plant grow with every word!
                </Typography>
            </Box>

            {/* Overall progress bar */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box sx={{ height: 10, borderRadius: '50px', overflow: 'hidden', bgcolor: c.green.bg, border: `2px solid ${c.green.border}` }}>
                    <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: c.green.border, borderRadius: '50px', transition: 'width 0.4s ease' }} />
                </Box>
                <Typography sx={{ mt: 0.5, textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: c.muted }}>
                    {currentIndex + (done ? 1 : 0)} / {totalTemplates} sentences done
                </Typography>
            </Box>

            {done ? (
                /* Completion */
                <Box sx={{ ...cardSx(c.green), p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '3rem', mb: 1 }}>🌺🌻🌸🌷🌹</Typography>
                    <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' }, fontWeight: 800, color: c.green.border, mb: 1 }}>
                        Garden Complete!
                    </Typography>
                    <Box sx={{ ...pillSx(c.yellow), mx: 'auto' }}>
                        <span style={{ color: c.yellow.text || c.yellow.border }}>
                            Total words written: {totalWords}
                        </span>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ ...cardSx(c.teal), p: { xs: 2, sm: 3 } }}>
                    {/* Plant — grows based on cumulative words across ALL questions */}
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
                        {/* Plant emoji — scales with stage */}
                        <Typography sx={{
                            fontSize: { xs: '3.5rem', sm: '5rem' },
                            transition: 'all 0.5s ease',
                            transform: `scale(${0.6 + stageIdx * 0.15})`,
                            filter: `brightness(${0.7 + stageIdx * 0.1})`,
                            lineHeight: 1.2,
                        }}>
                            {currentStage.emoji}
                        </Typography>
                        <Box sx={{ ...pillSx(c.yellow), mx: 'auto', mt: 1 }}>
                            <span style={{ color: c.yellow.text || c.yellow.border }}>{currentStage.name}</span>
                        </Box>
                    </Box>

                    {/* Word count bar — cumulative */}
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: c.muted }}>
                                Total words: {cumulativeWords}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: canProceed ? c.green.border : c.muted }}>
                                {canProceed ? 'Ready!' : `Type at least ${minRequired} words`}
                            </Typography>
                        </Stack>
                        <Box sx={{ height: 8, bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: '50px', overflow: 'hidden', border: `1px solid ${c.divider}` }}>
                            <Box sx={{
                                height: '100%',
                                width: `${Math.min((cumulativeWords / 50) * 100, 100)}%`,
                                bgcolor: currentStage.color,
                                borderRadius: '50px',
                                transition: 'all 0.3s ease',
                            }} />
                        </Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, px: 0.5 }}>
                            {GROWTH_STAGES.map((stage, idx) => (
                                <Typography key={idx} sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, opacity: cumulativeWords >= stage.minWords ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                                    {stage.emoji}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    {/* Current phrase */}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: c.muted, mb: 0.5 }}>
                            Phrase {currentIndex + 1} of {totalTemplates}:
                        </Typography>
                        <Box sx={{ ...cardSx(c.purple), p: { xs: 1.5, sm: 2 }, borderRadius: '14px' }}>
                            <Typography sx={{ color: c.purple.text || c.purple.border, fontStyle: 'italic', fontSize: { xs: '0.95rem', sm: '1.1rem' }, fontWeight: 600 }}>
                                "{templates[currentIndex].replace(/_+/g, '________')}"
                            </Typography>
                        </Box>
                    </Box>

                    {/* Guided question */}
                    {guidedQuestions[currentIndex] && (
                        <Box sx={{ ...cardSx(c.green), mb: 2, p: { xs: 1.5, sm: 2 }, borderRadius: '14px' }}>
                            <Typography sx={{ color: c.green.border, fontSize: '0.7rem', fontWeight: 800, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Tip:
                            </Typography>
                            <Typography sx={{ color: c.body, fontSize: { xs: '0.8rem', sm: '0.85rem' }, pl: 1.5, borderLeft: `3px solid ${c.green.border}`, fontWeight: 600 }}>
                                {guidedQuestions[currentIndex]}
                            </Typography>
                        </Box>
                    )}

                    {/* Text input */}
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Write your sentence here..."
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
                                '& fieldset': { border: `2px solid ${c.divider}`, borderRadius: '14px' },
                                '&:hover fieldset': { borderColor: c.teal.border },
                                '&.Mui-focused fieldset': { borderColor: c.teal.border, boxShadow: `2px 2px 0 ${c.teal.shadow}` },
                            },
                            '& .MuiInputBase-input::placeholder': { color: c.muted, opacity: 1 },
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={!canProceed}
                        onClick={handleNext}
                        disableElevation
                        sx={{ ...clayBtnSx(c.green, !canProceed), py: 1.5 }}
                    >
                        {currentIndex >= totalTemplates - 1 ? 'Finish Garden 🌺' : 'Next Phrase →'}
                    </Button>
                </Box>
            )}
        </Box>
    )
}
