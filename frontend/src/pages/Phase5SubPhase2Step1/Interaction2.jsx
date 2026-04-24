import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' } }
const DARK  = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const TARGET_VOCABULARY = ['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety']
const EXPECTED_EXAMPLES = {
  A2: 'Please welcome. Say hello. Thank you.',
  B1: 'First, say welcome to the festival. Then, check tickets. Please smile and be friendly. Thank you for helping!',
  B2: 'First, greet guests warmly: "Welcome to the Global Cultures Festival!" Then, check their tickets or registration. Please direct them to the information desk if they have questions. Thank you for your smile and patience - it makes a big difference!',
  C1: "Begin by offering a warm, inclusive greeting: \"Welcome to the Global Cultures Festival - we're delighted you're here!\" Next, politely verify entry (tickets/registration) while maintaining eye contact and a friendly tone. Should guests have questions, guide them clearly to the appropriate booth or team member. Conclude each interaction with sincere appreciation: \"Thank you for joining us - enjoy the celebration!\" This sequence ensures efficiency, warmth, and professionalism."
}

export default function Phase5SubPhase2Step1Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 2, context: 'main' })
  const [instructions, setInstructions] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!instructions.trim()) { setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write instructions for the volunteer.' }); return }
    setLoading(true)
    try {
      const result = await phase5API.evaluateVolunteerInstructions(instructions.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 1, level: data.level || 'A2', feedback: data.feedback || 'Good work!', vocabulary_used: data.vocabulary_used || [], strengths: data.strengths || [], improvements: data.improvements || [] })
        setSubmitted(true)
        sessionStorage.setItem('phase5_subphase2_step1_interaction2_score', data.score || 1)
        sessionStorage.setItem('phase5_subphase2_step1_interaction2_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const instructionsLower = instructions.toLowerCase()
      const hasPlease = instructionsLower.includes('please')
      const hasThankYou = instructionsLower.includes('thank you') || instructionsLower.includes('thank')
      const hasSequencing = instructionsLower.includes('first') || instructionsLower.includes('then') || instructionsLower.includes('next')
      const vocabularyCount = TARGET_VOCABULARY.filter(term => instructionsLower.includes(term)).length
      const wordCount = instructions.split(/\s+/).length
      let score = 1, level = 'A2', feedback = ''
      if (wordCount >= 50 && vocabularyCount >= 4 && hasPlease && hasThankYou && hasSequencing) { score = 4; level = 'C1'; feedback = 'Excellent! Your instructions are sophisticated, professional, and show advanced understanding.' }
      else if (wordCount >= 30 && vocabularyCount >= 3 && hasPlease && hasSequencing) { score = 3; level = 'B2'; feedback = 'Very good! Your instructions are detailed, polite, and well-sequenced.' }
      else if (wordCount >= 15 && vocabularyCount >= 2 && (hasPlease || hasThankYou) && hasSequencing) { score = 2; level = 'B1'; feedback = 'Good! You used sequencing words and polite language.' }
      else if (wordCount >= 5 && (hasPlease || hasThankYou)) { score = 1; level = 'A2'; feedback = 'Good start! Try adding sequencing words like "first" and "then".' }
      else { score = 0; level = 'Below A2'; feedback = 'Please write instructions using polite words and sequencing words.' }
      setEvaluation({ success: score > 0, score, level, feedback, vocabulary_used: TARGET_VOCABULARY.filter(term => instructionsLower.includes(term)) })
      setSubmitted(score > 0)
      if (score > 0) { sessionStorage.setItem('phase5_subphase2_step1_interaction2_score', score); sessionStorage.setItem('phase5_subphase2_step1_interaction2_level', level) }
    } finally { setLoading(false) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/1/interaction/3')
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, mb: 1 }}>SubPhase 2 Step 1: Engage - Interaction 2</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Write instructions for a volunteer welcoming guests</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="SKANDER" message="What instructions would you give a volunteer who is welcoming guests at the entrance?" />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>Instructions:</Typography>
            <Typography variant="body2">Suggest 2-4 short instructions for a volunteer (use polite imperatives and sequencing words).</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}><strong>Hint:</strong> Start with "First...", "Then...", "Please...", "Thank you..."</Typography>
          </Box>
        </motion.div>

        {/* Vocabulary Reference */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ color: P.blue.border, mr: 1 }} />
              <Typography variant="h6" sx={{ color: P.blue.border }}>Instruction Vocabulary</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {TARGET_VOCABULARY.map((term, idx) => (
                <Box key={idx} sx={{ px: 2, py: 0.5, bgcolor: P.blue.border, color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem' }}>{term}</Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Examples */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <Box sx={{ ...clay(P.yellow), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Expected Response Examples (by level):</Typography>
            <Stack spacing={1}>
              {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>{level}:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>"{example}"</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Writing Area */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 2 }}>Your Volunteer Instructions</Typography>
            <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
              <Typography variant="body2"><strong>Assessment Focus:</strong> Imperative form, Polite language, Basic sequencing, Clarity</Typography>
            </Box>
            <TextField fullWidth multiline rows={6} variant="outlined"
              placeholder="Example: First, please welcome guests with a smile. Then, check their tickets. Please guide them to the booths. Thank you for helping!"
              value={instructions} onChange={(e) => setInstructions(e.target.value)} disabled={submitted} sx={{ mb: 2 }} />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 2 }}>
              Words: {instructions.split(/\s+/).filter(w => w.length > 0).length} | Vocabulary used: {TARGET_VOCABULARY.filter(t => instructions.toLowerCase().includes(t)).length}/{TARGET_VOCABULARY.length}
            </Typography>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !instructions.trim()}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', opacity: (loading || !instructions.trim()) ? 0.5 : 1, width: '100%', justifyContent: 'center' }}>
                {loading ? <><CircularProgress size={18} /> Evaluating...</> : <><LightbulbIcon fontSize="small" /> Submit Instructions</>}
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Results */}
        {evaluation && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(evaluation.success ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 36, color: evaluation.success ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>Evaluation Results</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Score: {evaluation.score}/4 points | Level: {evaluation.level}</Typography>
                </Box>
              </Box>
              <Box sx={{ bgcolor: evaluation.success ? P.green.bg : P.orange.bg, border: `1px solid ${evaluation.success ? P.green.border : P.orange.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                <Typography variant="body1" fontWeight="bold" gutterBottom>Feedback:</Typography>
                <Typography variant="body2">{evaluation.feedback}</Typography>
              </Box>
              {evaluation.vocabulary_used?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>Vocabulary Used:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.vocabulary_used.map((term, idx) => (
                      <Box key={idx} sx={{ px: 2, py: 0.3, bgcolor: P.green.border, color: '#fff', borderRadius: '8px', fontSize: '0.8rem' }}>{term}</Box>
                    ))}
                  </Box>
                </Box>
              )}
              {evaluation.strengths?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Strengths:</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {evaluation.strengths.map((s, i) => <Typography key={i} component="li" variant="body2">{s}</Typography>)}
                  </Box>
                </Box>
              )}
              {evaluation.improvements?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Suggestions for Improvement:</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {evaluation.improvements.map((imp, i) => <Typography key={i} component="li" variant="body2">{imp}</Typography>)}
                  </Box>
                </Box>
              )}
              {submitted && (
                <Box component="button" onClick={handleContinue}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.blue.border, transition: 'all 0.15s', width: '100%', mt: 1 }}>
                  Continue to Interaction 3
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
