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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Interaction 3: Coherence & Vocabulary Enhancement
 * Students improve structure/cohesion and vocabulary in grammar-corrected texts
 * Scoring: A1=1pt, A2=2pts, B1=3pts, B2=4pts, C1=5pts
 */

export default function Phase4Step5Interaction3() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'main' })
  const [grammarCorrected, setGrammarCorrected] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [finalScore, setFinalScore] = useState(null)

  useEffect(() => {
    // Get grammar-corrected version from previous interaction
    const savedGrammar = sessionStorage.getItem('phase4_step5_grammar_corrected')
    if (savedGrammar) {
      setGrammarCorrected(savedGrammar)
      setEnhancedText(savedGrammar) // Pre-fill with grammar-corrected version
    }
  }, [])

  const handleSubmit = async () => {
    if (!enhancedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please enhance the text with connectors and better vocabulary.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step5/evaluate-enhancement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          enhancedText: enhancedText.trim()
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

      sessionStorage.setItem('phase4_step5_interaction3_score', data.score || 0)
      await calculateFinalScore(data.score || 0)
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on coherence/vocabulary enhancements
      const enhancedLower = enhancedText.toLowerCase().trim()
      const wordCount = enhancedText.split(/\s+/).length

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      const hasBasicConnectors = enhancedLower.includes('and') || enhancedLower.includes('because')
      const hasIntermediateConnectors = enhancedLower.includes('first') || enhancedLower.includes('then') || enhancedLower.includes('while')
      const hasAdvancedConnectors = enhancedLower.includes('furthermore') || enhancedLower.includes('moreover') || enhancedLower.includes('coherently') || enhancedLower.includes('seamlessly')

      const hasBasicVocab = enhancedLower.includes('good') || enhancedLower.includes('nice')
      const hasIntermediateVocab = enhancedLower.includes('eye-catching') || enhancedLower.includes('eye-catcher') || enhancedLower.includes('attract')
      const hasAdvancedVocab = enhancedLower.includes('persuasive') || enhancedLower.includes('immersive') || enhancedLower.includes('transitions') || enhancedLower.includes('culminating')
      const hasSophisticatedVocab = enhancedLower.includes('seamlessly') || enhancedLower.includes('complemented') || enhancedLower.includes('autonomous') || enhancedLower.includes('elevates') || enhancedLower.includes('narrative depth')

      if (hasSophisticatedVocab && hasAdvancedConnectors && wordCount >= 40) {
        score = 5; level = 'C1'
        feedback = 'Excellent! You demonstrated autonomous descriptive writing at C1 level. Your text shows seamless coherence with sophisticated connectors, enriched vocabulary, and logical progression. Outstanding enhancement of structure and vocabulary!'
      } else if (hasAdvancedVocab && (hasAdvancedConnectors || hasIntermediateConnectors) && wordCount >= 30) {
        score = 4; level = 'B2'
        feedback = 'Very good! You improved structure and vocabulary effectively at B2 level. Your text shows good cohesion with connectors and upgraded vocabulary. Strong enhancement skills!'
      } else if (hasIntermediateVocab && hasIntermediateConnectors && wordCount >= 20) {
        score = 3; level = 'B1'
        feedback = 'Good! You enhanced coherence and vocabulary at B1 level. Your text shows clear structure with connectors and improved vocabulary. Keep working on more sophisticated language!'
      } else if ((hasIntermediateVocab || hasBasicConnectors) && wordCount >= 15) {
        score = 2; level = 'A2'
        feedback = "Good start! You added some connectors and vocabulary enhancements. You're developing A2-level coherence awareness. Practice adding more connectors and upgrading more words!"
      } else if (hasBasicConnectors || hasBasicVocab) {
        score = 1; level = 'A1'
        feedback = 'You made an attempt at basic enhancement. You used simple connectors. Keep practicing to improve coherence and vocabulary!'
      } else {
        score = 0; level = 'Below A1'
        feedback = 'Please try to improve the text. Add connectors ("because", "first", "then") and upgrade vocabulary ("good" → "eye-catching", "nice" → "persuasive").'
      }

      setEvaluation({ success: true, score, level, feedback })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step5_interaction3_score', score)
      await calculateFinalScore(score)
      console.log(`[Phase 4 Step 5 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateFinalScore = async (interaction3Score) => {
    const interaction1Score = parseInt(sessionStorage.getItem('phase4_step5_interaction1_score') || '0')
    const interaction2Score = parseInt(sessionStorage.getItem('phase4_step5_interaction2_score') || '0')
    const total = interaction1Score + interaction2Score + interaction3Score

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 5 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Interaction 1 (Spelling):', interaction1Score)
    console.log('Interaction 2 (Grammar):', interaction2Score)
    console.log('Interaction 3 (Enhancement):', interaction3Score)
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total)
    console.log('Max possible: 15')

    const response = await fetch('/api/phase4/step/5/calculate-score', {
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
    if (!data.success) {
      throw new Error(data.error || 'Failed to calculate Step 5 score')
    }

    sessionStorage.setItem('phase4_step5_next_url', data.data.total.next_url)
    sessionStorage.setItem('student_cefr_level', data.data.total.remedial_level.replace('Remedial ', ''))

    console.log('Routing to:', data.data.total.next_url)
    console.log('='.repeat(60) + '\n')

    setFinalScore({
      interaction1: interaction1Score,
      interaction2: interaction2Score,
      interaction3: interaction3Score,
      total,
      nextUrl: data.data.total.next_url
    })
  }

  const handleContinue = () => {
    const nextUrl = finalScore?.nextUrl || sessionStorage.getItem('phase4_step5_next_url')
    if (!nextUrl) {
      alert('Error: next step not calculated. Please try again.')
      return
    }

    sessionStorage.removeItem('phase4_step5_interaction1_score')
    sessionStorage.removeItem('phase4_step5_interaction2_score')
    sessionStorage.removeItem('phase4_step5_interaction3_score')
    sessionStorage.removeItem('phase4_step5_spelling_corrected')
    sessionStorage.removeItem('phase4_step5_grammar_corrected')
    navigate(nextUrl)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.green.shadow }}>
              Step 4: Evaluate - Interaction 3 (Final)
            </Typography>
            <Typography variant="body1" sx={{ color: P.green.shadow }}>
              Coherence & Vocabulary Enhancement Challenge
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="RYAN"
              message="Excellent grammar! Now, improve coherence/cohesion and vocabulary in the corrected texts—reorder/add connectors/enhance words for better flow and precision."
            />
          </Box>

          {/* Previous Work Display */}
          {grammarCorrected && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.shadow }}>
                ✓ Your Grammar-Corrected Version
              </Typography>
              <Box sx={{
                bgcolor: isDark ? '#1a1a2e' : '#fff',
                border: `2px solid ${P.green.border}`,
                borderRadius: '12px', p: 2,
              }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: P.green.shadow }}>
                  {grammarCorrected}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Enhancement Focus Display */}
          <Box sx={{
            bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 3, mb: 3,
          }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoFixHighIcon sx={{ color: P.green.shadow }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.shadow }}>
                Focus: Coherence & Vocabulary
              </Typography>
            </Stack>

            <Alert severity="success" sx={{ borderRadius: '12px' }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>Hint:</Typography>
              <Typography variant="body2" component="div">
                <strong>Connectors:</strong> Add "because", "furthermore", "while", "first", "then" for logical flow
                <br />
                <strong>Vocabulary:</strong> Upgrade basic words:
                <ul style={{ marginTop: 4, marginBottom: 0 }}>
                  <li>"good" → "eye-catching"</li>
                  <li>"nice" → "persuasive"</li>
                  <li>"show" → "illustrates", "demonstrates"</li>
                  <li>"big" → "immersive", "expansive"</li>
                </ul>
              </Typography>
            </Alert>
          </Box>

          {/* Enhancement Input */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Your Enhanced Version (add connectors & upgrade vocabulary)
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              placeholder="Improve coherence/cohesion with connectors and enhance vocabulary..."
              value={enhancedText}
              onChange={(e) => setEnhancedText(e.target.value)}
              disabled={submitted}
              sx={{ mb: 2 }}
            />

            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !enhancedText.trim()} sx={{
                width: '100%',
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: loading || !enhancedText.trim() ? 'not-allowed' : 'pointer',
                color: P.orange.shadow, opacity: loading || !enhancedText.trim() ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': !loading && enhancedText.trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                {loading ? <CircularProgress size={20} /> : <AutoFixHighIcon sx={{ fontSize: 20 }} />}
                {loading ? 'Evaluating...' : 'Submit Final Enhancement'}
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
                  <Typography variant="h6" sx={{ color: P.green.shadow }}>Enhancement Complete!</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: P.green.shadow, mt: 1 }}>
                    Score: {evaluation.score}/5
                  </Typography>
                  <Typography variant="body2" sx={{ color: P.green.shadow, opacity: 0.8 }}>
                    CEFR Level: {evaluation.level}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ color: P.green.shadow }}>
                {evaluation.feedback}
              </Typography>
            </Box>
          )}

          {/* Final Summary */}
          {evaluation && finalScore && (
            <Box sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />

              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Step 5 Complete!
              </Typography>

              <Box sx={{
                bgcolor: isDark ? '#1a1a2e' : '#fff',
                border: `2px solid ${P.purple.border}`,
                borderRadius: '16px', p: 3,
                maxWidth: 500, mx: 'auto', my: 3,
              }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                  {finalScore.total}
                </Typography>
                <Typography variant="h6" sx={{ color: P.purple.shadow, opacity: 0.7 }}>
                  Total Points
                </Typography>
                <Typography variant="caption" sx={{ color: P.purple.shadow, opacity: 0.6, display: 'block', mt: 1 }}>
                  (Max possible: 18 for C1 level)
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                {[
                  { label: 'Interaction 1: Spelling Correction', score: finalScore.interaction1 },
                  { label: 'Interaction 2: Grammar Correction', score: finalScore.interaction2 },
                  { label: 'Interaction 3: Coherence & Vocabulary', score: finalScore.interaction3 },
                ].map((item, i) => (
                  <Box key={i} sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    borderRadius: '12px', p: 2,
                    border: `1px solid ${P.purple.border}`,
                  }}>
                    <Typography variant="body1" sx={{ color: P.purple.shadow }}>{item.label}</Typography>
                    <Box component="span" sx={{
                      bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                      borderRadius: '999px', px: 2, py: 0.5,
                      fontWeight: 700, color: P.purple.shadow, fontSize: '0.85rem',
                    }}>
                      {item.score} pts
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Typography variant="h6" sx={{ mb: 2, color: P.purple.shadow }}>
                You've successfully completed Phase 4 Step 5!<br />
                You've built autonomous writing skills through progressive error correction.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: P.purple.shadow, opacity: 0.8 }}>
                {finalScore.interaction3 >= 3
                  ? 'Great job! Your sentence production score qualifies you to move on.'
                  : "You'll now complete remedial activities to strengthen your skills based on your performance."}
              </Typography>

              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.orange.shadow, minWidth: 280,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                {finalScore.interaction3 >= 3 ? 'Complete Phase 4' : 'Continue to Remedial Activities'}
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
