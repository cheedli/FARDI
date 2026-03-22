import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, TextField, Stack, Chip, Grid, CircularProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { CharacterMessage } from '../../components/Avatar.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#EFF6FF',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1D4ED8' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const FAULTY_TEXT = `The Globbal Cultures Festivval was an incredble sucess. We acheived our goal of celbrating diversity and the studants loved every momment. The organizors did excelent work and evryone enjoyed the performences.`

const SPELLING_ERRORS = [
  { wrong: 'Globbal', correct: 'Global' },
  { wrong: 'Festivval', correct: 'Festival' },
  { wrong: 'incredble', correct: 'incredible' },
  { wrong: 'sucess', correct: 'success' },
  { wrong: 'acheived', correct: 'achieved' },
  { wrong: 'celbrating', correct: 'celebrating' },
  { wrong: 'studants', correct: 'students' },
  { wrong: 'momment', correct: 'moment' },
  { wrong: 'organizors', correct: 'organizers' },
  { wrong: 'excelent', correct: 'excellent' },
  { wrong: 'evryone', correct: 'everyone' },
  { wrong: 'performences', correct: 'performances' }
]

export default function Phase6SubPhase1Step5Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'main' })
  const [correctedText, setCorrectedText] = useState(FAULTY_TEXT)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    if (!correctedText.trim()) return
    setLoading(true)
    try {
      const result = await phase6API.evaluateSpellingCorrection(FAULTY_TEXT, correctedText.trim())
      if (result && result.score !== undefined) {
        const score = result.score || 2
        const level = result.level || 'A2'
        setEvaluation({
          success: true, score, level,
          feedback: result.feedback || 'Good spelling corrections!',
          corrections_found: result.corrections_found || [],
          missed_errors: result.missed_errors || []
        })
        sessionStorage.setItem('phase6_sp1_step5_interaction1_score', score.toString())
        sessionStorage.setItem('phase6_sp1_step5_interaction1_level', level)
        sessionStorage.setItem('phase6_sp1_step5_spelling_corrected_text', correctedText.trim())
      } else { throw new Error('Invalid API response') }
    } catch (error) {
      console.error('Evaluation error, using fallback:', error)
      const correctedLower = correctedText.toLowerCase()
      let correctionsMade = 0
      const foundCorrections = []
      const missedErrors = []
      SPELLING_ERRORS.forEach(({ wrong, correct }) => {
        const wrongLower = wrong.toLowerCase()
        const correctLower = correct.toLowerCase()
        if (!correctedLower.includes(wrongLower) && correctedLower.includes(correctLower)) {
          correctionsMade++; foundCorrections.push(`${wrong} → ${correct}`)
        } else if (correctedLower.includes(wrongLower)) {
          missedErrors.push(wrong)
        }
      })
      let score = 1; let level = 'A2'
      if (correctionsMade >= 10) { score = 4; level = 'C1' }
      else if (correctionsMade >= 8) { score = 3; level = 'B2' }
      else if (correctionsMade >= 5) { score = 2; level = 'B1' }
      setEvaluation({
        success: true, score, level,
        feedback: `You corrected ${correctionsMade} out of ${SPELLING_ERRORS.length} spelling errors. ${level} level performance.`,
        corrections_found: foundCorrections,
        missed_errors: missedErrors
      })
      sessionStorage.setItem('phase6_sp1_step5_interaction1_score', score.toString())
      sessionStorage.setItem('phase6_sp1_step5_interaction1_level', level)
      sessionStorage.setItem('phase6_sp1_step5_spelling_corrected_text', correctedText.trim())
    } finally { setLoading(false); setSubmitted(true) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 5: Evaluate — Interaction 1</Typography>
            <Typography variant="body1" color="text.secondary">Spelling Correction — Find and fix all spelling mistakes</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Here are faulty post-event report sections with mistakes. First, correct only spelling errors. Look for errors like 'succes', 'challange', 'feedbak', 'improv', 'recomend', 'sumary', 'achievment'."
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SpellcheckIcon sx={{ color: P.teal.border, mr: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.teal.border }}>
                Some words to look out for (misspelled versions):
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {SPELLING_ERRORS.slice(0, 6).map(({ wrong }, idx) => (
                <Box key={idx} sx={{ px: 1.5, py: 0.5, bgcolor: P.red.border, borderRadius: '10px' }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'monospace' }}>{wrong}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.orange.border, fontWeight: 'bold' }}>
                Correct the Spelling Errors
              </Typography>
              <Box sx={{ mb: 2, p: 1.5, bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '12px' }}>
                <Typography variant="body2">
                  The text below contains spelling mistakes. Edit it directly to correct the spelling errors only. Do not change grammar or style yet.
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.red.border }}>
                    Original (Faulty) Text:
                  </Typography>
                  <Box sx={{
                    p: 2, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '12px',
                    minHeight: 160, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap'
                  }}>
                    {FAULTY_TEXT}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>
                    Your Corrected Version:
                  </Typography>
                  <TextField
                    fullWidth multiline rows={7} variant="outlined"
                    value={correctedText}
                    onChange={(e) => setCorrectedText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: P.green.border },
                        '&:hover fieldset': { borderColor: P.green.border },
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Word count: {correctedText.trim().split(/\s+/).filter(Boolean).length}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ mb: 2, p: 1.5, bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '12px' }}>
                  <Typography variant="body2">
                    Find and correct at least 6 spelling mistakes. There are 12 total errors to find.
                  </Typography>
                </Box>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={loading || !correctedText.trim()}
                  sx={{
                    width: '100%', py: 1.5,
                    bgcolor: P.blue.bg,
                    border: `2px solid ${P.blue.border}`,
                    borderRadius: '16px',
                    boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontWeight: 'bold', fontSize: '1rem',
                    color: P.blue.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    '&:hover': !loading ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                    transition: 'all 0.15s ease',
                  }}
                >
                  {loading && <CircularProgress size={18} sx={{ color: P.blue.border }} />}
                  {loading ? 'Evaluating Spelling...' : 'Submit Spelling Corrections'}
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('green'), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: P.green.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: P.green.border }}>Spelling Corrections Evaluated!</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {evaluation.level} | Score: {evaluation.score} / 4
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.corrections_found?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Corrections Made:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.corrections_found.map((correction, idx) => (
                      <Box key={idx} sx={{ px: 1.5, py: 0.5, bgcolor: P.green.border, borderRadius: '10px' }}>
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>{correction}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {evaluation.missed_errors?.length > 0 && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '12px' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>Still Misspelled:</Typography>
                  {evaluation.missed_errors.map((err, idx) => (
                    <Typography key={idx} variant="body2">- {err}</Typography>
                  ))}
                </Box>
              )}
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/5/interaction/2')}
                sx={{
                  width: '100%', py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Interaction 2: Grammar Correction
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
