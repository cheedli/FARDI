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
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Interaction 1: Spelling Correction
 * Students correct spelling mistakes in faulty poster descriptions
 * Scoring: 1 point per correctly fixed spelling error
 * Max points: A1=4pts, A2=5pts, B1=5pts, B2=5pts, C1=7pts
 */

// Faulty texts with spelling errors (level-adapted)
const FAULTY_TEXTS = {
  A1: "Poster hav titel Festval. Colurs red.",
  A2: "My poster has gatfold and letering. The titel is Globel Festivel.",
  B1: "The poster featurs a gateforld layot with bold letering for the slogon.",
  B2: "This poster emploies a gatefold desing to provide imersive space with elegent letering.",
  C1: "The poster integrats a sofisticated gatefold layuot with presice letering for visuel hierachy."
}

// Expected corrections
const EXPECTED_CORRECTIONS = {
  A1: "Poster has title Festival. Colours red.",
  A2: "My poster has gatefold and lettering. The title is Global Festival.",
  B1: "The poster features a gatefold layout with bold lettering for the slogan.",
  B2: "This poster employs a gatefold design to provide immersive space with elegant lettering.",
  C1: "The poster integrates a sophisticated gatefold layout with precise lettering for visual hierarchy."
}

// Spelling errors to detect (for display)
const SPELLING_ERRORS = {
  A1: ["hav → has", "titel → title", "Festval → Festival", "Colurs → Colours"],
  A2: ["gatfold → gatefold", "letering → lettering", "titel → title", "Globel → Global", "Festivel → Festival"],
  B1: ["featurs → features", "gateforld → gatefold", "layot → layout", "letering → lettering", "slogon → slogan"],
  B2: ["emploies → employs", "desing → design", "imersive → immersive", "elegent → elegant", "letering → lettering"],
  C1: ["integrats → integrates", "sofisticated → sophisticated", "layuot → layout", "presice → precise", "letering → lettering", "visuel → visual", "hierachy → hierarchy"]
}

// Correct words to check (for evaluation)
const CORRECT_WORDS = {
  A1: ["has", "title", "Festival", "Colours"],
  A2: ["gatefold", "lettering", "title", "Global", "Festival"],
  B1: ["features", "gatefold", "layout", "lettering", "slogan"],
  B2: ["employs", "design", "immersive", "elegant", "lettering"],
  C1: ["integrates", "sophisticated", "layout", "precise", "lettering", "visual", "hierarchy"]
}

export default function Phase4Step5Interaction1() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 1, context: 'main' })
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [studentLevel, setStudentLevel] = useState(null)
  const [loadingLevel, setLoadingLevel] = useState(true)

  // Fetch student's level from Phase 4 Step 4 remedial work
  useEffect(() => {
    const savedLevel = sessionStorage.getItem('student_cefr_level') || 'A1'
    setStudentLevel(savedLevel)
    setLoadingLevel(false)
  }, [])

  const handleSubmit = async () => {
    if (!correctedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please correct the spelling mistakes in the text above.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step5/evaluate-spelling', {
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

      // Store score for final evaluation
      sessionStorage.setItem('phase4_step5_interaction1_score', data.score || 0)
      sessionStorage.setItem('phase4_step5_spelling_corrected', correctedText.trim())
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation - count corrected words
      const correctedLower = correctedText.toLowerCase()
      const correctWords = CORRECT_WORDS[studentLevel]
      const totalErrors = correctWords.length

      // Count how many correct words appear in the student's answer
      let correctionsCount = 0
      const foundWords = []

      correctWords.forEach(word => {
        if (correctedLower.includes(word.toLowerCase())) {
          correctionsCount++
          foundWords.push(word)
        }
      })

      let score = correctionsCount // 1 point per corrected word
      let level = studentLevel
      let feedback = ''

      if (correctionsCount === totalErrors) {
        feedback = `Excellent! You corrected all ${totalErrors} spelling mistakes accurately! You earned ${score} points. Outstanding attention to detail! ✨`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.7)) {
        feedback = `Good work! You corrected ${correctionsCount} out of ${totalErrors} spelling errors. You earned ${score} points. Keep it up! 👏`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.5)) {
        feedback = `Partial corrections made. You fixed ${correctionsCount} out of ${totalErrors} errors and earned ${score} points. Review: "${EXPECTED_CORRECTIONS[studentLevel]}"`
      } else {
        feedback = `You corrected ${correctionsCount} out of ${totalErrors} errors. Please review more carefully. Expected: "${EXPECTED_CORRECTIONS[studentLevel]}"`
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback,
        details: {
          correctionsCount,
          totalErrors,
          foundWords
        }
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step5_interaction1_score', score)
      sessionStorage.setItem('phase4_step5_spelling_corrected', correctedText.trim())
      console.log(`[Phase 4 Step 5 - Interaction 1] Score: ${score}/${totalErrors} | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateSimilarity = (text1, text2) => {
    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)
    const maxLen = Math.max(words1.length, words2.length)

    let matches = 0
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) matches++
    }

    return matches / maxLen
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/interaction/2')
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
            bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.red.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.red.shadow }}>
              Step 5: Evaluate - Interaction 1
            </Typography>
            <Typography variant="body1" sx={{ color: P.red.shadow }}>
              Spelling Correction Challenge
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Here are faulty poster descriptions with mistakes. First, focus only on spelling mistakes—correct them."
            />
          </Box>

          {/* Faulty Text Display */}
          <Box sx={{
            bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`,
            p: 3, mb: 3,
          }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <SpellcheckIcon sx={{ color: P.red.shadow }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.red.shadow }}>
                Faulty Text (with spelling errors)
              </Typography>
            </Stack>

            <Box sx={{
              bgcolor: isDark ? '#1a1a2e' : '#fff',
              border: `3px solid ${P.red.border}`,
              borderLeft: `6px solid ${P.red.shadow}`,
              borderRadius: '12px', p: 2, mb: 2,
            }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: P.red.shadow }}>
                {FAULTY_TEXTS[studentLevel]}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ borderRadius: '12px' }}>
              <Typography variant="body2">
                <strong>Hint:</strong> Look for misspelled words and correct them. Focus only on spelling mistakes.
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
              Your Corrected Version (fix spelling only)
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Type your spelling-corrected version here..."
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
                {loading ? <CircularProgress size={20} /> : <SpellcheckIcon sx={{ fontSize: 20 }} />}
                {loading ? 'Evaluating...' : 'Submit Spelling Corrections'}
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
                    Spelling Correction Complete!
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: P.green.shadow, mt: 1 }}>
                    Score: {evaluation.score}/{CORRECT_WORDS[studentLevel].length}
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
                Continue to Grammar Correction →
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
