import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack, Divider, useTheme } from '@mui/material'
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

const TEMPLATE_GUIDE = [
  { step: 1, title: 'Subject Line', instruction: 'Clear and urgent.', example: 'Urgent Update: Stage Lighting Issue - Global Cultures Festival' },
  { step: 2, title: 'Greeting', instruction: 'Polite.', example: 'Dear Sponsors / Team Members,' },
  { step: 3, title: 'State Problem Calmly', instruction: 'Explain the issue.', example: 'I regret to inform you that we are experiencing a temporary technical issue with the main stage lighting system.' },
  { step: 4, title: 'Solution + Timeline', instruction: 'Describe action.', example: 'Our technical team is immediately activating the backup lighting and expects full resolution within 20-30 minutes.' },
  { step: 5, title: 'Reassurance', instruction: 'Confirm event continues.', example: 'The festival will proceed on schedule with no changes to the program.' },
  { step: 6, title: 'Appreciation + Closing', instruction: 'Thank them.', example: 'Thank you for your understanding and continued support. Best regards, [Your Name]' }
]

const EXPECTED_EXAMPLES = {
  A2: 'Subject: Problem lights. Dear team, lights problem. We fix. Festival ok. Thank you.',
  B1: 'Subject: Lighting Update - Festival. Dear sponsors, there is a lighting problem. We use backup lights now. Festival starts on time. Thank you for support.',
  B2: 'Subject: Urgent Update: Stage Lighting - Global Cultures Festival. Dear valued sponsors, we are currently addressing a brief technical issue with the main stage lighting. Our team has activated the backup system and anticipates full restoration within the next 20-30 minutes. The event schedule remains unchanged, and we are fully prepared to deliver the planned program. We sincerely appreciate your understanding and continued partnership. Best regards, [Name], Festival Committee.',
  C1: 'Subject: Immediate Operational Update: Stage Lighting Contingency - Global Cultures Festival. Dear esteemed sponsors and team, an unexpected technical malfunction has temporarily affected the main stage lighting system one hour prior to opening. Our response protocol has been immediately engaged, with the pre-tested backup lighting array now being deployed-full resolution is projected within 20-25 minutes. The festival program remains fully intact, and we remain steadfast in our commitment to delivering an exceptional experience. We deeply value your trust and support during this brief disruption. Thank you for your continued partnership. Warm regards, [Name], Festival Director.'
}

export default function Phase5Step4Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 2, context: 'main' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [subject, setSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleSubmit = async () => {
    if (!subject.trim() || !emailBody.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write both subject and email body.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateEmail(subject.trim(), emailBody.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 2, level: data.level || 'A2', feedback: data.feedback || 'Good work!', vocabulary_used: data.vocabulary_used || [], mistakes_detected: data.mistakes_detected || [], structure_score: data.structure_score || 0 })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step4_interaction2_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step4_interaction2_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const emailLower = emailBody.toLowerCase()
      const wordCount = emailBody.split(/\s+/).length
      const sentenceCount = emailBody.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const hasGreeting = ['dear', 'hello', 'hi'].some(w => emailLower.includes(w))
      const hasClosing = ['regards', 'thank', 'sincerely', 'best'].some(w => emailLower.includes(w))
      const hasBackup = emailLower.includes('backup')
      const hasPolite = ['thank', 'appreciate', 'please', 'sorry', 'understanding'].some(w => emailLower.includes(w))
      let score = 2; let level = 'A2'
      if (wordCount <= 20 && sentenceCount <= 5) { score = 2; level = 'A2' }
      else if (wordCount <= 50 && sentenceCount <= 8 && hasBackup) { score = 3; level = 'B1' }
      else if (wordCount <= 100 && sentenceCount >= 5 && hasBackup && hasPolite) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your email shows ${level} level understanding.`, structure_score: (hasGreeting && hasClosing) ? 1 : 0 })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step4_interaction2_score', score.toString())
      sessionStorage.setItem('phase5_step4_interaction2_level', level)
    } finally { setLoading(false) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/interaction/3') }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 4: Elaborate - Interaction 2</Typography>
            <Typography variant="body1">Write an email to sponsors/team</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Emna" message="Now, write a short email to sponsors/team using this guided template with examples. Follow the template to write a 5-10 sentence email; adapt examples and self-check mistakes." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Email Template</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {TEMPLATE_GUIDE.map((item) => (
                <Box key={item.step}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.border }}>Step {item.step}: {item.title}</Typography>
                  <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>{item.instruction}</Typography>
                  <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic', opacity: 0.7 }}>Example: "{item.example}"</Typography>
                  {item.step < 6 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Expected Response Examples (by level):</Typography>
            <Stack spacing={1}>
              {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>{level}:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>"{example}"</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Your Email</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.blue.border, fontSize: 20 }} />
                <Typography variant="body2">Write 5-10 sentences. Use the template as a guide. Include polite language ("We appreciate...", "Thank you for..."). Check for grammar, spelling, and structure mistakes!</Typography>
              </Box>
              <TextField fullWidth label="Subject Line" variant="outlined" placeholder="Urgent Update: Stage Lighting Issue - Global Cultures Festival" value={subject} onChange={(e) => setSubject(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={12} variant="outlined" label="Email Body" placeholder={"Dear Sponsors / Team Members,\n\nWrite your email here..."} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Words: {emailBody.split(/\s+/).filter(w => w.length > 0).length} | Sentences: {emailBody.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !subject.trim() || !emailBody.trim()}
                sx={{
                  ...clay(P.blue), cursor: 'pointer', width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s', opacity: (loading || !subject.trim() || !emailBody.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: P.blue.border }} /> : <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>Submit Email</Typography>}
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
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>{evaluation.success ? 'Email Evaluated!' : 'Try Again'}</Typography>
                  <Typography variant="body2">Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Vocabulary Terms Used:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {evaluation.vocabulary_used.map((term, idx) => (
                      <Box key={idx} sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '10px', px: 1.5, py: 0.5 }}>
                        <Typography variant="caption" sx={{ color: P.green.border }}>{term}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {evaluation.mistakes_detected && evaluation.mistakes_detected.length > 0 && (
                <Box sx={{ bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>Mistakes Detected:</Typography>
                  {evaluation.mistakes_detected.map((mistake, idx) => <Typography key={idx} variant="body2">• {mistake}</Typography>)}
                </Box>
              )}
              {evaluation.structure_score === 1 && (
                <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="body2" sx={{ color: P.green.border }}>Excellent! Your email has proper structure (greeting, body, closing).</Typography>
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
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Interaction 3</Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
