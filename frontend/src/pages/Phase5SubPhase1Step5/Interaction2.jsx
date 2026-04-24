import React, { useState, useEffect } from 'react'
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

const EXPECTED_CORRECTIONS = {
  A2: 'The lights problem. We fix soon. Come to festival.',
  B1: 'Dear guests, there is a lighting problem. We are using backup lights. The festival is ok. Thank you.',
  B2: 'Urgent update: The stage lighting has failed. Our team is activating the backup system. The event will continue. We appreciate your patience.',
  C1: 'Immediate notice: An unforeseen technical malfunction has affected the stage lighting. The contingency protocol has been initiated. Full restoration is expected shortly. Thank you for your understanding.'
}

const GRAMMAR_ERRORS_TO_FIX = [
  'Subject-verb agreement (e.g., "Lights problem" → "The lights have a problem")',
  'Articles (a/an/the)',
  'Prepositions (to, for, with, on, in, at)',
  'Tense consistency',
  'Sentence fragments'
]

export default function Phase5Step5Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'main' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [spellingCorrectedText, setSpellingCorrectedText] = useState('')
  const [grammarCorrectedText, setGrammarCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('phase5_step5_spelling_corrected_text')
    if (saved) { setSpellingCorrectedText(saved) }
    else { setSpellingCorrectedText('Dear guests, lighting problem. We use backup. Festival ok. Thank you.') }
  }, [])

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleSubmit = async () => {
    if (!spellingCorrectedText.trim() || !grammarCorrectedText.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please provide both spelling-corrected and grammar-corrected texts.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateGrammar(spellingCorrectedText.trim(), grammarCorrectedText.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 2, level: data.level || 'A2', feedback: data.feedback || 'Good grammar corrections!', grammar_errors_found: data.grammar_errors_found || [], grammar_errors_corrected: data.grammar_errors_corrected || [], missed_errors: data.missed_errors || [], accuracy_percentage: data.accuracy_percentage || 0 })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step5_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step5_interaction2_level', data.level || 'A2')
        sessionStorage.setItem('phase5_step5_grammar_corrected_text', grammarCorrectedText.trim())
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const grammarWords = grammarCorrectedText.split(/\s+/).length
      const spellingWords = spellingCorrectedText.split(/\s+/).length
      const hasArticles = ['the', 'a', 'an'].some(word => grammarCorrectedText.toLowerCase().includes(word))
      const hasPrepositions = ['to', 'for', 'with', 'on', 'in', 'at'].some(word => grammarCorrectedText.toLowerCase().includes(word))
      const hasTense = ['is', 'are', 'has', 'have', 'will', 'was', 'were'].some(word => grammarCorrectedText.toLowerCase().includes(word))
      const isLonger = grammarWords > spellingWords
      const improvements = [hasArticles, hasPrepositions, hasTense, isLonger].filter(Boolean).length
      let score = 2; let level = 'A2'
      if (improvements <= 1) { score = 2; level = 'A2' }
      else if (improvements <= 2) { score = 3; level = 'B1' }
      else if (improvements <= 3) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your grammar corrections show ${level} level understanding.`, grammar_errors_found: ['subject-verb', 'articles', 'tense'], grammar_errors_corrected: hasArticles ? ['Fixed articles', 'Fixed tense'] : [], missed_errors: [], accuracy_percentage: (improvements / 4) * 100 })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step5_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step5_interaction2_level', level)
      sessionStorage.setItem('phase5_step5_grammar_corrected_text', grammarCorrectedText.trim())
    } finally { setLoading(false) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/5/interaction/3') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 5: Evaluate - Interaction 2</Typography>
            <Typography variant="body1">Correct grammar errors only</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Lilia" message="Well done on spelling! Now, using your spelling-corrected version, fix grammar mistakes only. Fix subject-verb agreement, articles, prepositions, tense consistency, and sentence fragments." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Grammar Errors to Fix</Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {GRAMMAR_ERRORS_TO_FIX.map((error, idx) => <Typography key={idx} variant="body2">• {error}</Typography>)}
            </Stack>
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
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Correct Grammar Errors</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.blue.border, fontSize: 20 }} />
                <Typography variant="body2">Use your spelling-corrected text below and correct ONLY grammar errors. Do not enhance tone or vocabulary yet!</Typography>
              </Box>
              <TextField fullWidth multiline rows={4} variant="outlined" label="Spelling-Corrected Text (from Interaction 1)" value={spellingCorrectedText} onChange={(e) => setSpellingCorrectedText(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={6} variant="outlined" label="Your Grammar-Corrected Text" placeholder="Write your grammar-corrected version here..." value={grammarCorrectedText} onChange={(e) => setGrammarCorrectedText(e.target.value)} sx={{ mb: 2 }} />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !spellingCorrectedText.trim() || !grammarCorrectedText.trim()}
                sx={{
                  ...clay(P.blue), cursor: 'pointer', width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s', opacity: (loading || !spellingCorrectedText.trim() || !grammarCorrectedText.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: P.blue.border }} /> : <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>Submit Grammar Corrections</Typography>}
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
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>{evaluation.success ? 'Grammar Corrections Evaluated!' : 'Try Again'}</Typography>
                  <Typography variant="body2">Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''} | Accuracy: {evaluation.accuracy_percentage?.toFixed(0)}%</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.grammar_errors_corrected && evaluation.grammar_errors_corrected.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Grammar Errors Corrected:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.grammar_errors_corrected.map((correction, idx) => (
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
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Interaction 3 (Enhancement + Wordshake)</Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
