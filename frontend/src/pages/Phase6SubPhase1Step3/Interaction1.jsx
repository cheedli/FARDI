import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const PURPOSE_KEYWORDS = ['purpose', 'inform', 'improve', 'future', 'learn', 'record', 'decision', 'evaluate', 'reflect', 'review', 'share', 'communicate']

function scorePurposeResponse(text) {
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
  const matchedKeywords = PURPOSE_KEYWORDS.filter(k => lower.includes(k))
  const hasEnoughWords = wordCount >= 20
  const hasMultipleKeywords = matchedKeywords.length >= 2
  const attempted = wordCount >= 5
  if (!attempted) return 0
  if (hasEnoughWords && hasMultipleKeywords) return 1
  if (attempted) return 1
  return 0
}

export default function Phase6SP1Step3Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 1, context: 'main' })
  const [videoWatched, setVideoWatched] = useState(false)
  const [response, setResponse] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleVideoReady = () => { setVideoWatched(true) }

  const handleSubmit = async () => {
    if (!response.trim()) {
      setEvaluation({ success: false, feedback: 'Please write your response before submitting.' })
      return
    }
    setLoading(true)
    try {
      const score = scorePurposeResponse(response.trim())
      const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
      const matchedKeywords = PURPOSE_KEYWORDS.filter(k => response.toLowerCase().includes(k))
      let feedback = ''
      if (wordCount < 10) {
        feedback = 'Good start! Try to write 2-3 full sentences explaining the purpose.'
      } else if (matchedKeywords.length === 0) {
        feedback = 'You\'ve written something, but try to include words like "purpose", "improve", "future events", or "decision-making" in your answer.'
      } else if (matchedKeywords.length === 1) {
        feedback = `Nice! You mentioned "${matchedKeywords[0]}". Can you also explain WHO reads the report and WHY it is written?`
      } else {
        feedback = `Excellent! You mentioned: ${matchedKeywords.slice(0, 3).join(', ')}. You clearly understand the purpose of a post-event report.`
      }
      setEvaluation({ success: true, score, feedback, matchedKeywords })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step3_interaction1_score', score.toString())
    } catch (error) {
      console.error('Evaluation error:', error)
      const score = scorePurposeResponse(response.trim())
      setEvaluation({ success: true, score, feedback: 'Thank you for your response! Move on to the next interaction.', matchedKeywords: [] })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step3_interaction1_score', score.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>SubPhase 6.1 - Step 3: Explain - Interaction 1</Typography>
            <Typography variant="body1" color="text.secondary">Watch the video and explain the purpose of a post-event report</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Watch this short video about writing balanced reports, then tell me: What is the main purpose of a post-event report? Think carefully — WHO reads it and WHY is it written?" />
          </Box>
        </motion.div>

        {!videoWatched && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibraryIcon sx={{ fontSize: 36, color: P.yellow.border, mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>Step 1: Watch the Video</Typography>
              </Box>
              <Box sx={{ ...cardSx(P.teal), p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon sx={{ color: P.teal.border }} />
                  <Typography variant="body2">Watch this video about balanced reporting. While watching, think about: the <strong>purpose</strong> of a post-event report, why <strong>balance</strong> matters, and what the report helps readers <strong>decide</strong> or <strong>improve</strong>.</Typography>
                </Box>
              </Box>
              <Box sx={{ ...cardSx(P.yellow), p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Balanced Reporting in Post-Event Reports</Typography>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2, borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
                  <iframe src="https://www.youtube.com/embed/RNdYoBSBag8" title="Balanced Reporting in Post-Event Reports" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
                </Box>
                <Typography variant="body2" color="text.secondary">If the video does not load, click here:{' '}
                  <Typography component="a" href="https://youtu.be/RNdYoBSBag8" target="_blank" rel="noopener noreferrer" sx={{ color: P.yellow.border, fontWeight: 'bold', textDecoration: 'underline' }}>https://youtu.be/RNdYoBSBag8</Typography>
                </Typography>
              </Box>
              <Box component="button" onClick={handleVideoReady} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                I've Watched the Video - Continue to Question
              </Box>
            </Box>
          </motion.div>
        )}

        {videoWatched && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Step 2: Explain the Purpose</Typography>
              <Box sx={{ ...cardSx(P.teal), p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <InfoIcon sx={{ color: P.teal.border }} />
                  <Typography variant="body2" fontWeight="bold">Question: What is the main purpose of a post-event report?</Typography>
                </Box>
                <Typography variant="body2">Write 2-3 sentences explaining the purpose.</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>Hint: Think about WHO reads it and WHY it is written. What do they use it for?</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom color="text.secondary">Useful words:</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {['purpose', 'inform', 'improve', 'future', 'learn', 'record', 'decision', 'evaluate'].map((word) => (
                    <Box key={word} sx={{ bgcolor: P.blue.border, color: 'white', px: 2, py: 0.5, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>{word}</Box>
                  ))}
                </Stack>
              </Box>
              <TextField fullWidth multiline rows={5} variant="outlined" placeholder="In 2-3 sentences, explain the purpose of a post-event report..." value={response} onChange={(e) => setResponse(e.target.value)} sx={{ mb: 2 }} />
              <Box component="button" onClick={handleSubmit} disabled={loading || !response.trim()} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                {loading && <CircularProgress size={18} color="inherit" />}
                {loading ? 'Saving...' : 'Submit Answer'}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Answer Recorded!</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Good effort — you watched the video and explained the purpose.</Typography>
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>{evaluation.feedback}</Typography>
              {evaluation.matchedKeywords && evaluation.matchedKeywords.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2, justifyContent: 'center' }}>
                  {evaluation.matchedKeywords.map((kw) => (
                    <Box key={kw} sx={{ bgcolor: P.green.border, color: 'white', px: 2, py: 0.5, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>{kw}</Box>
                  ))}
                </Stack>
              )}
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/interaction/2')} sx={{ ...cardSx(P.blue), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.blue.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue to Interaction 2 →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
