import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const TERMS = ['please', 'thank you', 'first', 'then', 'next', 'after that', 'finally', 'careful', 'safety', 'guide', 'welcome', 'help', 'queue', 'clear', 'polite']

export default function Phase5SubPhase2Step3Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border }}>SubPhase 2: Step 3 - Explain - Formalize Concepts</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Now let's explain how to give clear, polite, and safe instructions to our volunteers. We will watch three short videos: first on how to write instructions, then two real volunteer briefing examples from festivals. Listen carefully and be ready to talk about the terms." />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.blue), mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Key Glossary Terms</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>Throughout this step, you'll learn about these important instruction terms:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {TERMS.map((term, idx) => (
                <Box key={idx} sx={{ px: 2, py: 0.5, bgcolor: P.blue.border, color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem' }}>{term}</Box>
              ))}
            </Box>
          </Box>
        </motion.div>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box component="button" onClick={() => navigate('/phase5/subphase/2/step/3/interaction/1')}
            sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem', color: P.blue.border, transition: 'all 0.15s' }}>
            Start Explanation Activities →
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
