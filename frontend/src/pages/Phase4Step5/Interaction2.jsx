import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import ArticleIcon from '@mui/icons-material/Article'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Interaction 2: Grammar Correction
 * Students correct grammar mistakes in spelling-corrected texts
 * Scoring: 1 point per correctly fixed grammar error
 * Max points: A1=2pts, A2=3pts, B1=4pts, B2=5pts, C1=6pts
 */

// Spelling-corrected texts (from Interaction 1 expected answers) with grammar errors
const SPELLING_CORRECTED_TEXTS = {
  A1: "Poster has title Festival. Colours red.",
  A2: "My poster has gatefold and lettering. The title is Global Festival. It use colours.",
  B1: "The poster features a gatefold layout with bold lettering for the slogan. It include images.",
  B2: "This poster employs a gatefold design to provide immersive space with elegant lettering. The slogan are persuasive.",
  C1: "The poster integrates a sophisticated gatefold layout with precise lettering for visual hierarchy. The slogan encapsulate the ethos."
}

// Expected grammar corrections
const EXPECTED_GRAMMAR_CORRECTIONS = {
  A1: "Poster has a title Festival. Colours are red.",
  A2: "My poster has a gatefold and lettering. The title is Global Festival. It uses colours.",
  B1: "The poster features a gatefold layout with bold lettering for the slogan. It includes colorful images.",
  B2: "This poster employs a gatefold design to provide immersive space with elegant lettering. The slogan is persuasive.",
  C1: "The poster integrates a sophisticated gatefold layout with precise lettering for visual hierarchy. The slogan encapsulates the ethos."
}

// Grammar corrections to check (for evaluation)
const GRAMMAR_CORRECTIONS = {
  A1: ["a title", "are red"],
  A2: ["a gatefold", "uses", "uses colours"],
  B1: ["includes", "colorful images", "includes colorful", "includes images"],
  B2: ["slogan is", "is persuasive", "slogan is persuasive"],
  C1: ["encapsulates", "encapsulates the", "encapsulates the ethos"]
}

export default function Phase4Step5Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg:  '#FFFDE7',
    cardBg:  '#ffffff',
    heading: '#1A237E',
    body:    '#37474F',
    muted:   '#78909C',
    divider: '#E0E0E0',
    yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
    purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
    blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
    pink:   { bg: '#FCE4EC', border: '#C2185B', shadow: '#C2185B' },
    teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
    red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
    indigo: { bg: '#E8EAF6', border: '#3949AB', shadow: '#3949AB' },
  }
  const DARK = {
    pageBg:  '#0F0F1A',
    cardBg:  '#1A1A2E',
    heading: '#E8EAFF',
    body:    '#B0BEC5',
    muted:   '#607D8B',
    divider: '#2A2A4A',
    yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
    purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
    green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
    blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
    orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
    pink:   { bg: '#1F0010', border: '#F48FB1', shadow: '#880E4F' },
    teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
    red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
    indigo: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  }
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'main' })
  const [spellingCorrected, setSpellingCorrected] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [studentLevel, setStudentLevel] = useState(null)
  const [loadingLevel, setLoadingLevel] = useState(true)

  useEffect(() => {
    const savedLevel = sessionStorage.getItem('student_cefr_level') || 'A1'
    setStudentLevel(savedLevel)

    const expectedSpellingCorrected = SPELLING_CORRECTED_TEXTS[savedLevel]
    setSpellingCorrected(expectedSpellingCorrected)
    setCorrectedText(expectedSpellingCorrected)
    setLoadingLevel(false)
  }, [])

  const handleSubmit = async () => {
    if (!correctedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please correct the grammar mistakes in the text.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step5/evaluate-grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          correctedText: correctedText.trim(),
          level: studentLevel
        })
      })

      const data = await response.json()

      setEvaluation({
        success: true,
        score: data.score || 0,
        level: data.level || 'A1',
        feedback: data.feedback || 'Good work!',
        details: data.details || {}
      })
      setSubmitted(true)

      sessionStorage.setItem('phase4_step5_interaction2_score', data.score || 0)
      sessionStorage.setItem('phase4_step5_grammar_corrected', correctedText.trim())
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation - count grammar corrections
      const correctedLower = correctedText.toLowerCase()
      const grammarCorrections = GRAMMAR_CORRECTIONS[studentLevel]
      const totalErrors = grammarCorrections.length

      // Count how many correct grammar fixes appear in the student's answer
      let correctionsCount = 0
      const foundCorrections = []

      grammarCorrections.forEach(correction => {
        if (correctedLower.includes(correction.toLowerCase())) {
          correctionsCount++
          foundCorrections.push(correction)
        }
      })

      let score = correctionsCount // 1 point per corrected grammar error
      let level = studentLevel
      let feedback = ''

      if (correctionsCount === totalErrors) {
        feedback = `Excellent! You corrected all ${totalErrors} grammar mistakes accurately! You earned ${score} points. Outstanding grammar skills! ✨`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.7)) {
        feedback = `Good work! You corrected ${correctionsCount} out of ${totalErrors} grammar errors. You earned ${score} points. Keep it up! 👏`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.5)) {
        feedback = `Partial corrections made. You fixed ${correctionsCount} out of ${totalErrors} errors and earned ${score} points. Review: "${EXPECTED_GRAMMAR_CORRECTIONS[studentLevel]}"`
      } else {
        feedback = `You corrected ${correctionsCount} out of ${totalErrors} errors. Please review more carefully. Expected: "${EXPECTED_GRAMMAR_CORRECTIONS[studentLevel]}"`
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback,
        details: {
          correctionsCount,
          totalErrors,
          foundCorrections
        }
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step5_interaction2_score', score)
      sessionStorage.setItem('phase4_step5_grammar_corrected', correctedText.trim())
      console.log(`[Phase 4 Step 5 - Interaction 2] Score: ${score}/${totalErrors} | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/interaction/3')
  }

  if (loadingLevel) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, ml: 2 }}>Loading your level...</Typography>
      </Box>
    )
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
              Step 5: Evaluate - Interaction 2
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Grammar Correction Challenge
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="LILIA"
              message="Good spelling fixes! Now, from the same faulty texts (with spelling already corrected), focus on grammar mistakes—correct them."
            />
          </Box>

          {/* Previous Work Display */}
          {spellingCorrected && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.shadow }}>
                ✓ Your Spelling-Corrected Version
              </Typography>
              <Box sx={{
                bgcolor: isDark ? '#1a1a2e' : '#fff',
                border: `2px solid ${P.green.border}`,
                borderRadius: '12px', p: 2,
              }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: P.green.shadow }}>
                  {spellingCorrected}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Grammar Focus Display */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <ArticleIcon sx={{ color: P.blue.shadow }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Focus: Grammar Errors
              </Typography>
            </Stack>

            <Alert severity="info" sx={{ borderRadius: '12px' }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Hint:
              </Typography>
              <Typography variant="body2">
                Check subject-verb agreement, articles, tense consistency, and verb forms.
              </Typography>
            </Alert>
          </Box>

          {/* Correction Input */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Your Grammar-Corrected Version
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Fix grammar mistakes (subject-verb agreement, articles, tenses)..."
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !correctedText.trim()} sx={{
                width: '100%',
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: loading || !correctedText.trim() ? 'not-allowed' : 'pointer',
                color: P.orange.shadow, opacity: loading || !correctedText.trim() ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': !loading && correctedText.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                {loading ? <CircularProgress size={20} /> : <ArticleIcon sx={{ fontSize: 20 }} />}
                {loading ? 'Evaluating...' : 'Submit Grammar Corrections'}
              </Box>
            )}
          </Box>

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.shadow, mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: P.green.shadow }}>
                    Grammar Correction Complete!
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: P.green.shadow, mt: 1 }}>
                    Score: {evaluation.score}/{GRAMMAR_CORRECTIONS[studentLevel].length}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 3, color: P.green.shadow }}>
                {evaluation.feedback}
              </Typography>

              <Box component="button" onClick={handleContinue} sx={{
                width: '100%',
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.orange.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                Continue to Coherence & Vocabulary →
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
