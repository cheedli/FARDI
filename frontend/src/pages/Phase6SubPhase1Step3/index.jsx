import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import BalanceIcon from '@mui/icons-material/Balance'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const KEY_VOCABULARY = ['balance', 'objective', 'fair', 'evidence', 'positive', 'negative', 'strength', 'weakness', 'impact', 'recommend']
const LEARNING_OUTCOMES = ['Understand why balanced reporting is important', 'Learn to include both strengths and weaknesses', 'Understand the purpose of a post-event report']
const WHAT_YOU_WILL_DO = ['Watch a short video about balanced reporting and explain its purpose', 'Write 2-3 sentences explaining why balance matters in a post-event report', 'Play Sushi Spell to practise spelling key evaluation vocabulary']
const WORDSHAKE_WORDS = ['success', 'challenge', 'feedback', 'recommend', 'summary', 'improve']

export default function Phase6SP1Step3Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [wordshakeDone, setWordshakeDone] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>SubPhase 6.1 - Step 3: Explain</Typography>
            <Typography variant="body1" color="text.secondary">Writing a Post-Event Report - Why Balanced Reporting Matters</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="A good report tells both the good AND the bad. Let's learn why balance matters. When we write a post-event report, we need to be honest and objective — that means including both what went well and what could be improved. Today we'll explore why this is so important!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.green.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>Learning Outcomes</Typography>
            </Box>
            <Stack spacing={1}>
              {LEARNING_OUTCOMES.map((outcome, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: P.green.border, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</Box>
                  <Typography variant="body2">{outcome}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Key Vocabulary for This Step</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Look out for these words as you work through the step:</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {KEY_VOCABULARY.map((term, idx) => (
                <Box key={idx} sx={{ bgcolor: P.blue.border, color: 'white', px: 2, py: 0.5, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>{term}</Box>
              ))}
            </Stack>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VideoLibraryIcon sx={{ fontSize: 36, color: P.yellow.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>Video Resource</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.yellow), p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Balanced Reporting in Event Management</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>Watch this video to learn about writing balanced post-event reports:</Typography>
              <Typography component="a" href="https://youtu.be/RNdYoBSBag8" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', color: P.yellow.border, fontWeight: 'bold', textDecoration: 'underline' }}>
                https://youtu.be/RNdYoBSBag8 →
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>You will watch this video in Interaction 1. Make notes on: the purpose of a post-event report, why balance is important, and what happens when a report is one-sided.</Typography>
            </Box>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BalanceIcon sx={{ fontSize: 36, color: P.blue.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border }}>What is Balanced Reporting?</Typography>
            </Box>
            <Stack spacing={2}>
              <Box sx={{ ...cardSx(P.green), p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.green.border }}>Strengths (What went well)</Typography>
                <Typography variant="body2" color="text.secondary">Include specific successes, achievements, and positive outcomes from the event.</Typography>
              </Box>
              <Box sx={{ ...cardSx(P.red), p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.border }}>Weaknesses (What could improve)</Typography>
                <Typography variant="body2" color="text.secondary">Include challenges, difficulties, and areas that need improvement for the future.</Typography>
              </Box>
              <Box sx={{ ...cardSx(P.teal), p: 2 }}>
                <Typography variant="body2"><strong>Why balance matters:</strong> A report that only mentions positives or only mentions negatives is not useful. Decision-makers need the full picture to improve future events.</Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: P.teal.border, mr: 1 }} />
              <Typography variant="body2" fontWeight="bold">What You'll Do in This Step:</Typography>
            </Box>
            {WHAT_YOU_WILL_DO.map((item, idx) => (
              <Typography key={idx} variant="body2">{idx + 1}. {item}</Typography>
            ))}
          </Box>
        </motion.div>
        <Box sx={{ mb: 3 }}>
          <WordshakeGame step={3} interaction={0} targetWords={WORDSHAKE_WORDS} onComplete={() => setWordshakeDone(true)} subphase={1} />
        </Box>
        {wordshakeDone && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/interaction/1')} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Start Step 3: Explain
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
