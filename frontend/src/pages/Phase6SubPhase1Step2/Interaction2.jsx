import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
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

const SAMPLE_SUMMARY = 'The festival was successful because many students participated. However, we faced challenges with timing.'
const EXPLANATION_PROMPTS = [
  'Why did you start with a positive point in your summary?',
  'Why did you mention a challenge in the report?',
  'Why is it important to include both good and bad things in a report?'
]
const USEFUL_PHRASES = ['because', 'chose', 'decided', 'wanted', 'important', 'helps', 'shows', 'allows']

const determineLevel = (text) => {
  const lower = text.toLowerCase()
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  const hasBecause = lower.includes('because')
  const hasChoiceWords = ['chose', 'decided', 'wanted', 'important', 'helps', 'shows'].some(w => lower.includes(w))
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  if (wordCount < 10) return { score: 1, level: 'A2' }
  if (hasBecause && wordCount >= 10 && wordCount < 20) return { score: 2, level: 'A2' }
  if (hasBecause && hasChoiceWords && wordCount >= 20 && sentenceCount >= 2) return { score: 3, level: 'B1' }
  if (hasBecause && hasChoiceWords && wordCount >= 35 && sentenceCount >= 3) return { score: 4, level: 'B2' }
  return { score: 2, level: 'A2' }
}

export default function Phase6SP1Step2Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 2, context: 'main' })
  const [trialSummary, setTrialSummary] = useState('')
  const [explanation, setExplanation] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('phase6_sp1_step2_trial_summary')
    if (saved) setTrialSummary(saved)
  }, [])

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3
  })

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write your explanation before submitting.', strengths: [], improvements: ['Write at least one reason using "because"'] })
      return
    }
    setLoading(true)
    try {
      const result = await phase6API.evaluateWritingChoice(explanation.trim())
      if (result && result.data) {
        const data = result.data
        const score = data.score || 2
        const level = data.level || 'A2'
        setEvaluation({ success: true, score, level, feedback: data.feedback || 'Good explanation!', strengths: data.strengths || [], improvements: data.improvements || [] })
        setSubmitted(true)
        sessionStorage.setItem('phase6_sp1_step2_interaction2_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step2_interaction2_level', level)
      } else throw new Error('No data returned')
    } catch (error) {
      console.error('Evaluation error:', error)
      const { score, level } = determineLevel(explanation)
      const lower = explanation.toLowerCase()
      const hasBecause = lower.includes('because')
      setEvaluation({
        success: true, score, level,
        feedback: hasBecause
          ? `Good work! You used "because" to explain your choices. Your explanation shows ${level} level understanding.`
          : `Try to use "because" to explain your reasons. Your explanation shows ${level} level understanding.`,
        strengths: hasBecause ? ['Used "because" to give reasons'] : [],
        improvements: hasBecause ? ['Add more specific details about why you made each choice'] : ['Use "because" to explain your reasons']
      })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step2_interaction2_score', score.toString())
      sessionStorage.setItem('phase6_sp1_step2_interaction2_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => navigate('/phase6/subphase/1/step/2/interaction/3')
  const wordCount = explanation.split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 2: Explore - Interaction 2</Typography>
            <Typography variant="body1" color="text.secondary">Explain Your Writing Choices</Typography>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="SKANDER"
              message="Why did you choose to write your summary that way? Explain one choice you made (e.g., 'I wrote about successes first because positive') and why it is good for a report. Use words from the game and say 'because...'"
            />
          </Box>
        </motion.div>

        {/* Sample Summary Display */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Sample Summary to Analyze
            </Typography>
            <Box sx={{ ...cardSx(P.teal), borderLeft: `4px solid ${P.teal.border}`, mb: 2, p: 2 }}>
              <Typography variant="body1" fontStyle="italic">"{SAMPLE_SUMMARY}"</Typography>
            </Box>
            {trialSummary && (
              <>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">Your Trial Summary (from Interaction 1):</Typography>
                <Box sx={{ ...cardSx(P.orange), borderLeft: `4px solid ${P.orange.border}`, p: 2 }}>
                  <Typography variant="body1" fontStyle="italic" color="text.secondary">"{trialSummary}"</Typography>
                </Box>
              </>
            )}
          </Box>
        </motion.div>

        {/* Writing Prompts */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
              <InfoIcon sx={{ color: P.yellow.border, fontSize: 18, mt: 0.2 }} />
              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ color: P.yellow.border }}>
                Answer these questions in your explanation (2-3 reasons using "because"):
              </Typography>
            </Box>
            {EXPLANATION_PROMPTS.map((prompt, idx) => (
              <Typography key={idx} variant="body2">{idx + 1}. {prompt}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Useful Phrases */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="text.secondary">Useful words and phrases:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {USEFUL_PHRASES.map((phrase, idx) => (
                <Box key={idx} sx={{
                  border: `2px solid ${P.green.border}`, color: P.green.border,
                  px: 1.5, py: 0.5, borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold'
                }}>
                  {phrase}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Writing Area */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Your Explanation</Typography>
            <TextField
              fullWidth multiline rows={4} variant="outlined"
              placeholder='Example: "I started with a positive point because it is important to show what went well first. I mentioned the challenge because readers need to know what to improve next time. I chose this structure because it helps the reader understand the full picture."'
              value={explanation} onChange={(e) => setExplanation(e.target.value)} disabled={submitted}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Words: {wordCount}</Typography>
              <Typography variant="caption" sx={{ color: explanation.toLowerCase().includes('because') ? P.green.border : P.orange.border }}>
                {explanation.toLowerCase().includes('because') ? '"because" used ✓' : 'Remember to use "because"'}
              </Typography>
            </Box>
            {!submitted && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || explanation.trim().length < 10}
                sx={{
                  width: '100%', ...cardSx(P.orange),
                  p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                  transition: 'all 0.15s ease'
                }}
              >
                {loading ? <CircularProgress size={20} /> : 'Submit Explanation'}
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Evaluation Results */}
        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(evaluation.success ? P.green : P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.yellow.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.yellow.border }}>
                    {evaluation.success ? 'Explanation Evaluated!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: <strong>{evaluation.level}</strong> | Score: <strong>{evaluation.score}/4</strong>
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: P.green.border }}>Strengths:</Typography>
                  <Stack spacing={0.5}>
                    {evaluation.strengths.map((s, idx) => (
                      <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: P.green.border }} />{s}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
              {evaluation.improvements && evaluation.improvements.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: P.orange.border }}>Areas to Improve:</Typography>
                  <Stack spacing={0.5}>
                    {evaluation.improvements.map((imp, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">• {imp}</Typography>
                    ))}
                  </Stack>
                </Box>
              )}
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
                Continue to Interaction 3
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
