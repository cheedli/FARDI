import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LockIcon from '@mui/icons-material/Lock'
import { phase5API } from '../../lib/phase5_api.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  p: 3,
})
const hoverLift = (c) => ({
  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` },
})

export default function Phase5SubPhase2Step1Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [subphase1Complete, setSubphase1Complete] = useState(false)
  const [subphase1Score, setSubphase1Score] = useState(0)
  const [requiredScore, setRequiredScore] = useState(20)

  useEffect(() => { checkSubPhase1Completion() }, [])

  const checkSubPhase1Completion = async () => {
    try {
      const result = await phase5API.checkSubPhase1Completion()
      if (result.success && result.data) {
        setSubphase1Complete(result.data.is_complete)
        setSubphase1Score(result.data.total_score)
        setRequiredScore(result.data.required_score)
      }
    } catch (error) {
      console.error('Error checking SubPhase 1 completion:', error)
      setSubphase1Complete(true)
    } finally {
      setLoading(false)
    }
  }

  const handleStartActivities = () => {
    if (subphase1Complete) navigate('/phase5/subphase/2/step/1/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, mb: 1 }}>
              SubPhase 2: Step 1 - Engage - Giving Instructions to Volunteers
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Practice writing clear, polite, and structured instructions for volunteers during the Global Cultures Festival
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>Scenario</Typography>
            <CharacterMessage speaker="Ms. Mabrouki" message="The Global Cultures Festival is tomorrow and we need to prepare our volunteers! Volunteers will welcome guests, guide them to booths, manage queues, and help with small problems. We must give them clear, polite instructions. Let's start with a game to activate useful words, then share ideas about what volunteers need to know." />
          </Box>
        </motion.div>

        {/* Video */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Watch: Festival Volunteers in Action</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
              Ms. Mabrouki shows a short video clip of volunteers helping at a real cultural event.
            </Typography>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', backgroundColor: '#000', mb: 2 }}>
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/lg7adyHPC7U?si=90bXTr0QJnJDHRnK"
                title="Festival Ushering Scene" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
              <strong>Reflection Questions:</strong> What instructions would you give volunteers? How can we make them clear and polite?
            </Typography>
          </Box>
        </motion.div>

        {/* Real Examples */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Real-World Examples</Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Before we start, let's look at how real festivals give instructions to volunteers:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...clay(P.blue), ...hoverLift(P.blue) }}>
                <Typography variant="h6" gutterBottom>Volunteer Task Card</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>See how professional events create clear task cards for volunteers.</Typography>
                <Box component="a" href="https://youtu.be/dKgjv9YaQfI?si=rnJVJiuVF6aqySHg" target="_blank" rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, color: P.blue.border, textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <OpenInNewIcon fontSize="small" /> Watch Instruction Video
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...clay(P.blue), ...hoverLift(P.blue) }}>
                <Typography variant="h6" gutterBottom>Festival Volunteering</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>Learn how volunteers help at cultural festivals and events.</Typography>
                <Box component="a" href="https://youtube.com/shorts/lg7adyHPC7U?si=90bXTr0QJnJDHRnK" target="_blank" rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, color: P.blue.border, textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <OpenInNewIcon fontSize="small" /> View Festival Volunteering
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>

        {/* What You'll Learn */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>What You'll Learn</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {[
                ['Instruction Vocabulary:', 'please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen'],
                ['Polite Language:', 'How to use "please" and "thank you" effectively'],
                ['Sequencing Words:', 'Using "first", "then", "next", "after that" to organize instructions'],
                ['Clear Communication:', 'Writing instructions that are easy to understand and follow'],
              ].map(([bold, rest], i) => (
                <Typography key={i} component="li" variant="body1" sx={{ mb: 1 }}>
                  <strong>{bold}</strong> {rest}
                </Typography>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Key Vocabulary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...clay(P.yellow), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border, mb: 2 }}>Key Vocabulary You'll Practice</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety', 'listen'].map((word, idx) => (
                <Box key={idx} sx={{ px: 2, py: 0.5, bgcolor: P.yellow.border, color: '#fff', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {word}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Progression Check */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : !subphase1Complete ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Box sx={{ ...clay(P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockIcon sx={{ fontSize: 40, color: P.orange.border, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>SubPhase 2 Locked</Typography>
              </Box>
              <Box sx={{ bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                <Typography variant="body1" fontWeight="bold" gutterBottom>Complete SubPhase 1 First!</Typography>
                <Typography variant="body2">
                  You need to complete Phase 5 SubPhase 1 with a score of at least {requiredScore} points before accessing SubPhase 2.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your current SubPhase 1 score: <strong>{subphase1Score} / {requiredScore}</strong>
                </Typography>
              </Box>
              <Box component="button" onClick={() => navigate('/phase5/subphase/1/step/1')}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', border: `2px solid ${P.orange.border}`, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s' }}>
                Go to SubPhase 1
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Box component="button" onClick={handleStartActivities}
                sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem', color: P.blue.border, transition: 'all 0.15s' }}>
                <PlayArrowIcon /> Start Instruction Activities
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
