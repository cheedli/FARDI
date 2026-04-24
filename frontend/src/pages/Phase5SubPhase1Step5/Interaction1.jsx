import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const FAULTY_TEXTS = {
  A2: 'Lites problem. We fix soon. Come festivl.',
  B1: 'Dear gests, lighting probelm. We use bakup. Festival ok. Thank you.',
  B2: 'Urgent up-date: Stage lighing fail. Team activat bakup. Event continue. Appreciate patience.',
  C1: 'Imediate notice: Unforseen technicle malfuntion afected stage lighing. Contingincy protocol iniciated. Full restorasion expected shortly. Thank for understanding.'
}

const EXPECTED_CORRECTIONS = {
  A2: 'Lights problem. We fix soon. Come festival.',
  B1: 'Dear guests, lighting problem. We use backup. Festival ok. Thank you.',
  B2: 'Urgent update: Stage lighting failure. Team activating backup. Event continues. Appreciate patience.',
  C1: 'Immediate notice: Unforeseen technical malfunction affected stage lighting. Contingency protocol initiated. Full restoration expected shortly. Thank you for understanding.'
}

const COMMON_SPELLING_ERRORS = [
  'emergancy → emergency', 'back-up → backup', 'anounce → announce', 'up-date → update',
  'resolv → resolve', 'transperent → transparent', 'probelm → problem', 'fixs → fix',
  'lites → lights', 'festivl → festival', 'gests → guests', 'bakup → backup',
  'lighing → lighting', 'activat → activating', 'imediate → immediate', 'unforseen → unforeseen',
  'technicle → technical', 'malfuntion → malfunction', 'afected → affected',
  'contingincy → contingency', 'iniciated → initiated', 'restorasion → restoration'
]

export default function Phase5Step5Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 1, context: 'main' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [originalText, setOriginalText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  React.useEffect(() => {
    if (!originalText) { setOriginalText(FAULTY_TEXTS.B1) }
  }, [])

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleSubmit = async () => {
    if (!originalText.trim() || !correctedText.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please provide both original and corrected texts.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateSpelling(originalText.trim(), correctedText.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 2, level: data.level || 'A2', feedback: data.feedback || 'Good spelling corrections!', spelling_errors_found: data.spelling_errors_found || [], spelling_errors_corrected: data.spelling_errors_corrected || [], missed_errors: data.missed_errors || [], accuracy_percentage: data.accuracy_percentage || 0 })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step5_interaction1_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step5_interaction1_level', data.level || 'A2')
        sessionStorage.setItem('phase5_step5_spelling_corrected_text', correctedText.trim())
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const originalLower = originalText.toLowerCase()
      const correctedLower = correctedText.toLowerCase()
      const commonErrors = ['emergancy', 'back-up', 'anounce', 'up-date', 'resolv', 'transperent', 'probelm', 'fixs', 'lites', 'festivl', 'gests', 'bakup', 'lighing', 'activat']
      const errorsFound = commonErrors.filter(err => originalLower.includes(err))
      const errorsCorrected = errorsFound.filter(err => {
        const correction = err.replace('-', '').replace('up-', '').replace('back-', '')
        return correctedLower.includes(correction) || !correctedLower.includes(err)
      })
      const accuracy = errorsFound.length > 0 ? (errorsCorrected.length / errorsFound.length) * 100 : 0
      let score = 2; let level = 'A2'
      if (errorsFound.length <= 3 && accuracy >= 80) { score = 2; level = 'A2' }
      else if (errorsFound.length <= 6 && accuracy >= 85) { score = 3; level = 'B1' }
      else if (errorsFound.length <= 10 && accuracy >= 90) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `You corrected ${errorsCorrected.length} spelling errors. ${level} level accuracy.`, spelling_errors_found: errorsFound, spelling_errors_corrected: errorsCorrected.map(err => `${err} → corrected`), missed_errors: errorsFound.filter(err => !errorsCorrected.includes(err)), accuracy_percentage: accuracy })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step5_interaction1_score', score.toString())
      sessionStorage.setItem('phase5_step5_interaction1_level', level)
      sessionStorage.setItem('phase5_step5_spelling_corrected_text', correctedText.trim())
    } finally { setLoading(false) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/5/interaction/2') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 5: Evaluate - Interaction 1</Typography>
            <Typography variant="body1">Correct spelling errors only</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Here are faulty crisis messages with mistakes. First, correct only spelling errors. Look for errors like 'emergancy', 'back-up', 'anounce', 'up-date', 'resolv', 'transperent'." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Common Spelling Errors to Look For</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {COMMON_SPELLING_ERRORS.map((error, idx) => (
                <Box key={idx} sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '10px', px: 1.5, py: 0.5 }}>
                  <Typography variant="caption" sx={{ color: P.blue.border }}>{error}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Expected Correction Examples (by level):</Typography>
            <Stack spacing={1}>
              {Object.entries(EXPECTED_CORRECTIONS).map(([level, correction]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>{level}:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>"{correction}"</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Correct Spelling Errors</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.blue.border, fontSize: 20 }} />
                <Typography variant="body2">Read the faulty text below and correct ONLY spelling errors. Do not fix grammar yet!</Typography>
              </Box>
              <TextField fullWidth multiline rows={4} variant="outlined" label="Original (Faulty) Text" value={originalText} onChange={(e) => setOriginalText(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={6} variant="outlined" label="Your Spelling-Corrected Text" placeholder="Write your spelling-corrected version here..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !originalText.trim() || !correctedText.trim()}
                sx={{
                  ...clay(P.blue), cursor: 'pointer', width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s', opacity: (loading || !originalText.trim() || !correctedText.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: P.blue.border }} /> : <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>Submit Spelling Corrections</Typography>}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(evaluation.success ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>{evaluation.success ? 'Spelling Corrections Evaluated!' : 'Try Again'}</Typography>
                  <Typography variant="body2">Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''} | Accuracy: {evaluation.accuracy_percentage?.toFixed(0)}%</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.spelling_errors_corrected && evaluation.spelling_errors_corrected.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Spelling Errors Corrected:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.spelling_errors_corrected.map((correction, idx) => (
                      <Box key={idx} sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '10px', px: 1.5, py: 0.5 }}>
                        <Typography variant="caption" sx={{ color: P.green.border }}>{correction}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {evaluation.missed_errors && evaluation.missed_errors.length > 0 && (
                <Box sx={{ bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>Missed Errors:</Typography>
                  {evaluation.missed_errors.map((error, idx) => <Typography key={idx} variant="body2">• {error}</Typography>)}
                </Box>
              )}
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  ...clay(P.green), cursor: 'pointer', width: '100%', mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Interaction 2 (Grammar Correction)</Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
