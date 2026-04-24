import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const TARGET_WORDS = ['success', 'challenge', 'feedback', 'improve', 'recommend']
const SUMMARY_TIPS = [
  'Start with the event name and date',
  'Mention overall success (positive or negative)',
  'Include 1-2 main points briefly',
  'Keep it short - 2-3 sentences only'
]

export default function Phase6SP1Step2Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameData, setGameData] = useState(null)
  const [summary, setSummary] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3
  })

  const handleGameComplete = async (data) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: data })
    setGameCompleted(true)
    setGameData(data)
    sessionStorage.setItem('phase6_sp1_step2_interaction1_score', '1')
    try { await phase6API.trackGame(2, 1, data, 1) } catch (error) { console.error('Failed to track game:', error) }
  }

  const handleSubmitSummary = () => {
    if (!summary.trim()) return
    setLoading(true)
    sessionStorage.setItem('phase6_sp1_step2_trial_summary', summary.trim())
    setSubmitted(true)
    setLoading(false)
  }

  const handleContinue = () => navigate('/phase6/subphase/1/step/2/interaction/2')
  window.__remedialSkip = handleContinue
  const wordCount = summary.split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 2: Explore - Interaction 1</Typography>
            <Typography variant="body1" color="text.secondary">Sushi Spell + Writing a Trial Executive Summary</Typography>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="First, play Sushi Spell to activate report vocabulary, then write a short summary paragraph or list of what happened at the festival. Use the game words in your writing — keep it simple and factual (who, what, when, where, how many people)."
            />
          </Box>
        </motion.div>

        {/* Game Section */}
        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                Step 1: Play Sushi Spell
              </Typography>
              <Box sx={{ ...cardSx(P.blue), p: 2, mb: 2 }}>
                <Typography variant="body2">
                  Spell these report writing words: <strong>{TARGET_WORDS.join(', ')}</strong>
                </Typography>
              </Box>
              <SushiSpellGame step={2} interaction={1} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
            </Box>
          </motion.div>
        )}

        {/* Writing Section */}
        {gameCompleted && !submitted && (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ ...cardSx(P.green), mb: 3, p: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Great job! Now let's write a trial executive summary together.
                </Typography>
              </Box>
            </motion.div>

            {/* Writing Tips */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Box sx={{ ...cardSx(P.green), mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>
                  Writing Tips for Your Executive Summary
                </Typography>
                <Stack spacing={1}>
                  {SUMMARY_TIPS.map((tip, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: P.green.border, fontSize: 18 }} />
                      <Typography variant="body2">{tip}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </motion.div>

            {/* Example Words */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="text.secondary">
                  Try to use some of these words:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {TARGET_WORDS.map((word, idx) => (
                    <Box key={idx} sx={{
                      border: `2px solid ${P.blue.border}`, color: P.blue.border,
                      px: 1.5, py: 0.5, borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold'
                    }}>
                      {word}
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Writing Prompt */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
                  Step 2: Write Your Trial Executive Summary
                </Typography>
                <Box sx={{ ...cardSx(P.yellow), p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <InfoIcon sx={{ color: P.yellow.border, fontSize: 18, mt: 0.2 }} />
                    <Typography variant="body2">
                      Write 2-3 sentences summarizing the Global Cultures Festival. Think about: What happened? Was it successful? What was the main result?
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ ...cardSx(P.blue), mb: 2, p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">Example (you can adapt this):</Typography>
                  <Typography variant="body2" fontStyle="italic" color="text.secondary">
                    "The Global Cultures Festival was held on [date] and was a positive experience for all students. The event achieved its main goal of celebrating cultural diversity with strong participation. Overall, the impact was very good, though there are lessons to learn for next time."
                  </Typography>
                </Box>

                <TextField
                  fullWidth multiline rows={5} variant="outlined"
                  placeholder="Write your executive summary here (2-3 sentences)..."
                  value={summary} onChange={(e) => setSummary(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Words: {wordCount} | Sentences: {summary.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: wordCount >= 15 ? P.green.border : P.orange.border }}>
                    {wordCount < 15 ? 'Write at least 15 words' : 'Good length!'}
                  </Typography>
                </Box>

                <Box
                  component="button"
                  onClick={handleSubmitSummary}
                  disabled={loading || summary.trim().length < 10}
                  sx={{
                    width: '100%', ...cardSx(P.green),
                    p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                    color: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                    transition: 'all 0.15s ease'
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Save My Summary'}
                </Box>
              </Box>
            </motion.div>
          </>
        )}

        {/* After Submission */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: P.green.border }}>Trial Summary Saved!</Typography>
                  <Typography variant="body2" color="text.secondary">We'll use this in the next activity.</Typography>
                </Box>
              </Box>

              <Box sx={{ ...cardSx(P.blue), mb: 2, borderLeft: `4px solid ${P.blue.border}` }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">Your Trial Executive Summary:</Typography>
                <Typography variant="body1" fontStyle="italic">"{summary}"</Typography>
              </Box>

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%', ...cardSx(P.green),
                  p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease'
                }}
              >
                Continue to Interaction 2
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
