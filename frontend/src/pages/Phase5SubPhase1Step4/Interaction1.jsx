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
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const TEMPLATE_GUIDE = [
  { step: 1, title: 'Calm Opening + Problem', instruction: 'Start calmly and state the issue clearly.', example: 'Dear festival friends, we have a small technical issue with the stage lighting.' },
  { step: 2, title: 'Solution + Timeline', instruction: 'Explain what we are doing and when it will be fixed.', example: 'Our team is immediately activating the backup lighting system. We expect everything to be ready in the next 20-30 minutes.' },
  { step: 3, title: 'Reassurance + CTA', instruction: 'Reassure and tell people what to do.', example: 'The festival will start on time-please stay calm and join us as planned!' },
  { step: 4, title: 'Closing + Appreciation', instruction: 'End positively and thank them.', example: "Thank you for your understanding and patience-we can't wait to celebrate with you!" },
  { step: 5, title: 'Hashtags', instruction: 'Add relevant hashtags (4-8).', example: '#GlobalCulturesFestival #FestivalUpdate #WeGotThis' }
]

const EXPECTED_EXAMPLES = {
  A2: 'Lighting problem. We use backup. Festival start soon. Thank you. #Festival',
  B1: 'Hello everyone! There is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you for your patience. See you soon! #GlobalFestival #Update',
  B2: 'Dear festival community, a technical issue has temporarily affected the main stage lighting. Our team is actively deploying the backup system and anticipates full restoration within 20-30 minutes. The event schedule remains unchanged-performances and activities will proceed as planned. We sincerely appreciate your understanding and patience during this brief interruption. Thank you for being part of this celebration! #GlobalCulturesFestival #FestivalUpdate #WeAreOnIt',
  C1: 'Immediate update to all attendees: An unforeseen technical malfunction has impacted the main stage lighting just one hour before doors open. Our dedicated response team has already initiated the pre-tested contingency protocol, deploying the full backup lighting array with restoration expected within the next 20-25 minutes. The festival program remains intact, and we remain fully committed to delivering the rich cultural experience you have been anticipating. We sincerely thank you for your patience and understanding during this short disruption-your continued support means everything. See you very soon for an unforgettable celebration of global unity. #GlobalCulturesFestival #LiveUpdate #ContingencyInAction #FestivalContinues'
}

export default function Phase5Step4Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 1, context: 'main' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [announcement, setAnnouncement] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleSubmit = async () => {
    if (!announcement.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please write your social media announcement.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateSocialMedia(announcement.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 2, level: data.level || 'A2', feedback: data.feedback || 'Good work!', vocabulary_used: data.vocabulary_used || [], mistakes_detected: data.mistakes_detected || [], strengths: data.strengths || [], improvements: data.improvements || [] })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step4_interaction1_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step4_interaction1_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const announcementLower = announcement.toLowerCase()
      const wordCount = announcement.split(/\s+/).length
      const sentenceCount = announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const hasBackup = announcementLower.includes('backup')
      const hasPolite = ['thank', 'appreciate', 'please', 'sorry', 'understanding'].some(w => announcementLower.includes(w))
      let score = 2; let level = 'A2'
      if (wordCount <= 15 && sentenceCount <= 4) { score = 2; level = 'A2' }
      else if (wordCount <= 40 && sentenceCount <= 6 && hasBackup) { score = 3; level = 'B1' }
      else if (wordCount <= 80 && sentenceCount >= 4 && hasBackup && hasPolite) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your announcement shows ${level} level understanding.` })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step4_interaction1_score', score.toString())
      sessionStorage.setItem('phase5_step4_interaction1_level', level)
    } finally { setLoading(false) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/interaction/2') }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 4: Elaborate - Interaction 1</Typography>
            <Typography variant="body1">Write an urgent social media announcement</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="First, write an urgent social media announcement to the audience using this guided template with examples. Follow the template to write a 4-8 sentence social media post announcing the issue and solution; adapt examples and check mistakes." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Social Media Announcement Template</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {TEMPLATE_GUIDE.map((item) => (
                <Box key={item.step}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.border }}>Step {item.step}: {item.title}</Typography>
                  <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>{item.instruction}</Typography>
                  <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic', opacity: 0.7 }}>Example: "{item.example}"</Typography>
                  {item.step < 5 && <Divider sx={{ mt: 1 }} />}
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
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Your Social Media Announcement</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.blue.border, fontSize: 20 }} />
                <Typography variant="body2">Write 4-8 sentences. Use the template as a guide. Include hashtags. Check for grammar, spelling, and structure mistakes!</Typography>
              </Box>
              <TextField fullWidth multiline rows={10} variant="outlined" placeholder="Write your social media announcement here..." value={announcement} onChange={(e) => setAnnouncement(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Words: {announcement.split(/\s+/).filter(w => w.length > 0).length} | Sentences: {announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length} | Hashtags: {(announcement.match(/#\w+/g) || []).length}
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !announcement.trim()}
                sx={{
                  ...clay(P.blue), cursor: 'pointer', width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s', opacity: (loading || !announcement.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: P.blue.border }} /> : <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>Submit Announcement</Typography>}
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
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>
                    {evaluation.success ? 'Announcement Evaluated!' : 'Try Again'}
                  </Typography>
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
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  ...clay(P.green), cursor: 'pointer', width: '100%', mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Interaction 2</Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
