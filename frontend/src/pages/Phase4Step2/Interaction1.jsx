import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 2 Interaction 1: Watch Video and Define "Persuasive"
 * Students watch a video on advertising characteristics and define "persuasive" for posters
 */

const KEY_TERMS = [
  'promotional', 'persuasive', 'targeted', 'original',
  'creative', 'consistent', 'personalized', 'ethical'
]

export default function Phase4Step3Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'main' })
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please write your definition of "persuasive" for posters.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/evaluate-definition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question: 'What is "persuasive" for posters?',
          answer: answer.trim(),
          term: 'persuasive',
          context: 'advertising and posters',
          expectedConcepts: ['convince', 'ethos', 'pathos', 'logos', 'emotional', 'logical', 'credible'],
          level: 'B1'
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'B1',
          feedback: data.feedback || 'Good definition!'
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase4_step3_interaction1_score', data.score || 1)
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: data.feedback || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation based on CEFR criteria
      const answerLower = answer.toLowerCase()
      const wordCount = answer.split(/\s+/).length

      // Key concepts check
      const hasConvince = answerLower.includes('convince') || answerLower.includes('persuade')
      const hasBuy = answerLower.includes('buy') || answerLower.includes('purchase')
      const hasVideo = answerLower.includes('video')
      const hasEthos = answerLower.includes('ethos') || answerLower.includes('credible') || answerLower.includes('authority')
      const hasPathos = answerLower.includes('pathos') || answerLower.includes('emotion') || answerLower.includes('feeling')
      const hasLogos = answerLower.includes('logos') || answerLower.includes('logic') || answerLower.includes('reason')
      const hasSuperior = answerLower.includes('superior') || answerLower.includes('better') || answerLower.includes('competitor')
      const hasInfluence = answerLower.includes('influence') || answerLower.includes('impact')

      let score = 1 // A1 baseline
      let level = 'A1'
      let feedback = ''

      // C1: 5 points - Persuasive techniques for posters draw on ethos/pathos/logos, influence purchasing habits, product superiority
      if (hasConvince && (hasEthos || hasPathos || hasLogos) && (hasInfluence || hasSuperior) && wordCount >= 20) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your definition demonstrates sophisticated understanding of persuasive techniques, including ethos/pathos/logos and their influence on purchasing habits.'
      }
      // B2: 4 points - Persuasive involves emotional/logical/credible appeals, demonstrates superiority
      else if (hasConvince && ((hasEthos && hasPathos) || (hasPathos && hasLogos) || (hasEthos && hasLogos)) && hasSuperior && wordCount >= 15) {
        score = 4
        level = 'B2'
        feedback = 'Very good! You mentioned multiple persuasive appeals and product superiority as detailed in the video.'
      }
      // B1: 3 points - Persuasive means using ethos/pathos/logos to convince, references video
      else if (hasConvince && (hasEthos || hasPathos || hasLogos) && wordCount >= 12) {
        score = 3
        level = 'B1'
        feedback = 'Good! You understand persuasive techniques and referenced the video\'s explanation of ethos, pathos, or logos.'
      }
      // A2: 2 points - Persuasive is to convince people to buy, mentions feelings/video
      else if (hasConvince && (hasBuy || hasPathos || hasVideo) && wordCount >= 8) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You mentioned convincing and buying with some reference to the video concepts.'
      }
      // A1: 1 point - Basic attempt
      else if (hasConvince || hasBuy) {
        score = 1
        level = 'A1'
        feedback = 'Your answer shows basic understanding. Try to include more details about ethos, pathos, or logos from the video.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please try again. Reference what "persuasive" means from the video, mentioning concepts like convince, ethos, pathos, or logos.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_step3_interaction1_score', score)
        console.log(`[Phase 4 Step 3 - Interaction 1] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/2/interaction/2') }, [])

  const handleContinue = () => {
    navigate('/phase4/step/2/interaction/2')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 2: Explain - Interaction 1
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Watch the video and define "persuasive" for posters
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Watch this video on 10 advertising characteristics (4:30). Listen for 'promotional', 'persuasive', 'targeted', 'original', 'creative', 'consistent', 'personalized', 'ethical'. After, answer: What is 'persuasive' for posters?"
            />
          </Box>

          {/* Key Terms */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Key Terms to Listen For:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {KEY_TERMS.map((term, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                  display: 'inline-block'
                }}>{term}</Box>
              ))}
            </Stack>
          </Box>

          {/* Video Card */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 4, overflow: 'hidden',
          }}>
            <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', mb: 2 }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                src="https://www.youtube.com/embed/5Bu6qE9E7oo"
                title="10 Advertising Characteristics"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              10 Advertising Characteristics (4:30)
            </Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, opacity: 0.8 }}>
              Watch this video to learn about the key characteristics of effective advertising, including persuasive techniques.
            </Typography>
          </Box>

          {/* Question Section */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Question: What is "persuasive" for posters?
            </Typography>

            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', p: 2, mb: 3,
            }}>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                <strong>Hint:</strong> Use "It is to convince..." and mention ethos/pathos/logos from the video.
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your definition of 'persuasive' for posters here. Reference what you learned from the video..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.orange.border },
                  '&:hover fieldset': { borderColor: P.orange.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                }
              }}
            />

            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !answer.trim()} sx={{
                width: '100%',
                bgcolor: (loading || !answer.trim()) ? 'grey.200' : P.blue.bg,
                border: `2px solid ${(loading || !answer.trim()) ? '#ccc' : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: (loading || !answer.trim()) ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (loading || !answer.trim()) ? 'not-allowed' : 'pointer',
                color: (loading || !answer.trim()) ? 'grey.500' : P.blue.shadow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': (loading || !answer.trim()) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': (loading || !answer.trim()) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>
                {loading ? <CircularProgress size={20} /> : 'Submit Answer'}
              </Box>
            )}
          </Box>

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.red.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.red.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.red.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{
                  fontSize: 40,
                  color: evaluation.success ? P.green.shadow : P.red.shadow,
                  mr: 2
                }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow }}>
                    {evaluation.success ? 'Answer Submitted!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, opacity: 0.8 }}>
                    Level: {evaluation.level} | Score: {evaluation.score}/5
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, mb: 2 }}>
                {evaluation.feedback}
              </Typography>

              {submitted && (
                <Box component="button" onClick={handleContinue} sx={{
                  width: '100%',
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  <PlayArrowIcon fontSize="small" />
                  Continue to Next Activity
                </Box>
              )}
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
