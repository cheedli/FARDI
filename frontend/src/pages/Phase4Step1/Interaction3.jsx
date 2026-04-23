import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SentenceEvaluator from '../../components/SentenceEvaluator.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 1 Interaction 3: Using "slogan" in context with AI evaluation
 * Instructor: Emna
 */

const EXAMPLE_SENTENCES = {
    A1: 'Slogan good.',
    A2: 'The poster has slogan.',
    B1: 'We need a catchy slogan for the poster to attract students.',
    B2: 'A strong slogan like "Discover Global Cultures!" would make the poster more eye-catching and memorable.',
    C1: 'An effective slogan, such as "Unite in Diversity: Experience the World," would encapsulate the festival\'s ethos, enhancing the poster\'s persuasive impact and complementing the video\'s dynamic features.'
}

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

export default function Phase4Step1Interaction3() {
    const navigate = useNavigate()
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'main' })
    const [completed, setCompleted] = useState(false)
    const [evaluationResult, setEvaluationResult] = useState(null)
    const [isCalculating, setIsCalculating] = useState(false)

    const handleSentenceComplete = async (result) => {
        console.log('Sentence evaluation completed:', result)
        setEvaluationResult(result)
        setIsCalculating(true)

        try {
            const interaction1Score = parseInt(sessionStorage.getItem('phase4_step1_interaction1_score') || '0')
            const interaction2Score = parseInt(sessionStorage.getItem('phase4_step1_interaction2_score') || '0')
            const interaction3Score = result.score || 1

            console.log('=== Phase 4 Step 1 - All Scores ===')
            console.log('Interaction 1 Score:', interaction1Score)
            console.log('Interaction 2 Score:', interaction2Score)
            console.log('Interaction 3 Score:', interaction3Score)

            const response = await fetch('/api/phase4/step/1/calculate-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    interaction1_score: interaction1Score,
                    interaction2_score: interaction2Score,
                    interaction3_score: interaction3Score
                })
            })

            const data = await response.json()

            if (data.success) {
                console.log('Backend scoring response:', data.data)
                console.log('Total Score:', data.data.total.score, '/', data.data.total.max_score)
                console.log('Remedial Level:', data.data.total.remedial_level)
                console.log('Next URL:', data.data.total.next_url)

                const remedialLevel = data.data.total.remedial_level
                const nextUrl = data.data.total.next_url
                sessionStorage.setItem('phase4_remedial_level', remedialLevel)
                sessionStorage.setItem('phase4_step1_next_url', nextUrl)
                sessionStorage.setItem('student_cefr_level', remedialLevel.replace('Remedial ', ''))

                sessionStorage.removeItem('phase4_step1_interaction1_score')
                sessionStorage.removeItem('phase4_step1_interaction2_score')

                setCompleted(true)
            } else {
                console.error('Error calculating score:', data.error)
                alert('Error calculating your level. Please try again.')
            }
        } catch (error) {
            console.error('Failed to calculate total score:', error)
            alert('Network error. Please check your connection and try again.')
        } finally {
            setIsCalculating(false)
        }
    }

    const handleContinue = () => {
        const nextUrl = sessionStorage.getItem('phase4_step1_next_url')
        if (!nextUrl) {
            alert('Error: next step not calculated. Please try again.')
            return
        }
        navigate(nextUrl)
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
            <Container maxWidth="md">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {/* Header */}
                    <Box sx={{
                        bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
                        border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
                        borderRadius: '20px',
                        boxShadow: `4px 4px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
                        p: 3, mb: 3,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` }
                    }}>
                        <Typography variant="h5" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
                            Phase 4: Marketing &amp; Promotion
                        </Typography>
                        <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
                            Step 1: Engage - Interaction 3
                        </Typography>
                        <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
                            Write one sentence using the word <strong>"slogan"</strong> to promote the Global Cultures Festival.
                        </Typography>
                    </Box>

                    {/* Instructor Message */}
                    <Box sx={{
                        bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
                        border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
                        borderRadius: '20px',
                        boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
                        p: 3, mb: 3,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
                    }}>
                        <CharacterMessage
                            speaker="Emna"
                            message="Great practice! Now, let's use one of our target words—'slogan'—in a sentence about our festival promotion, inspired by the poster and video examples."
                        />
                    </Box>

                    {/* Sentence Evaluator Component */}
                    <SentenceEvaluator
                        targetWord="slogan"
                        hint="Start with 'Our slogan could be...' or 'The poster needs a slogan like...'"
                        exampleSentences={EXAMPLE_SENTENCES}
                        onComplete={handleSentenceComplete}
                    />

                    {/* Navigation */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                        {isCalculating && (
                            <Box
                                component="button"
                                disabled
                                sx={{
                                    bgcolor: isDark ? DARK.yellow.bg : LIGHT.yellow.bg,
                                    border: `2px solid ${isDark ? DARK.yellow.border : LIGHT.yellow.border}`,
                                    borderRadius: '12px',
                                    boxShadow: `3px 3px 0 ${isDark ? DARK.yellow.shadow : LIGHT.yellow.shadow}`,
                                    px: 3, py: 1.5,
                                    fontWeight: 700, fontSize: '1rem',
                                    cursor: 'not-allowed', color: isDark ? DARK.yellow.border : LIGHT.yellow.shadow,
                                    opacity: 0.7,
                                }}
                            >
                                Calculating your level...
                            </Box>
                        )}
                        {completed && !isCalculating && (
                            <Box
                                component="button"
                                onClick={handleContinue}
                                sx={{
                                    bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
                                    border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
                                    borderRadius: '12px',
                                    boxShadow: `3px 3px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
                                    px: 3, py: 1.5,
                                    fontWeight: 700, fontSize: '1rem',
                                    cursor: 'pointer', color: isDark ? DARK.green.border : LIGHT.green.shadow,
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` },
                                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` }
                                }}
                            >
                                Continue to Remedial Phase
                            </Box>
                        )}
                    </Stack>

                </motion.div>
            </Container>
        </Box>
    )
}
