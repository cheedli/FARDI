import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

const TERMS = [
  { term: 'success', definition: 'Positive result — when the event or action went well' },
  { term: 'challenge', definition: 'Problem — a difficult situation that needed to be addressed' },
  { term: 'feedback', definition: 'Comments — the opinions and reactions of participants' },
  { term: 'improve', definition: 'Do better — to make something better for next time' },
  { term: 'recommend', definition: 'Suggest — to propose an action for the future' },
  { term: 'summary', definition: 'Overview — a short description of the main points' }
]

export default function Phase6SP1Step2RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(TERMS.length).fill(''))
  const [explanations, setExplanations] = useState(Array(TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [spellResults, setSpellResults] = useState([])

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleSpellingChange = (idx, val) => { const updated = [...spellings]; updated[idx] = val; setSpellings(updated) }
  const handleExplanationChange = (idx, val) => { const updated = [...explanations]; updated[idx] = val; setExplanations(updated) }

  const handleSubmit = async () => {
    const results = TERMS.map((t, i) => spellings[i].trim().toLowerCase() === t.term)
    const spellScore = results.filter(Boolean).length
    const explainScore = explanations.filter(e => e.trim().split(/\s+/).length >= 3).length
    const total = Math.round((spellScore + explainScore) / 2)
    setSpellResults(results)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b2_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(2, 'B2', 'D', total, TERMS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && explanations.every(e => e.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task D: Spell &amp; Explain</Typography>
            <Typography variant="body1" color="text.secondary">Spell and explain 6 report terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Spell each report term correctly, then write a short explanation of what it means. This will help you remember these important words for your report!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3, p: 2 }}>
            <Typography variant="body2">For each term: (1) Type the correct spelling, (2) Write a short explanation in your own words (at least 3 words).</Typography>
          </Box>
        </motion.div>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {TERMS.map((t, idx) => {
            const isCorrect = submitted && spellResults[idx]
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.03 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }) : P.blue), p: 2.5 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: P.blue.border, mb: 1.5 }}>Term {idx + 1}:</Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">Spelling:</Typography>
                    <TextField size="small" value={spellings[idx]} onChange={(e) => handleSpellingChange(idx, e.target.value)} disabled={submitted} placeholder="Type the word..." sx={{ minWidth: 200, bgcolor: 'white' }} />
                    {submitted && <Typography variant="body2" sx={{ color: spellResults[idx] ? P.green.border : '#EF4444', fontWeight: 'bold' }}>{spellResults[idx] ? '✓ Correct!' : `✗ Answer: ${t.term}`}</Typography>}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Explanation:</Typography>
                    <TextField size="small" multiline rows={2} value={explanations[idx]} onChange={(e) => handleExplanationChange(idx, e.target.value)} disabled={submitted} placeholder="Explain what this word means..." sx={{ flex: 1, minWidth: 200, bgcolor: 'white' }} />
                  </Box>
                  {submitted && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>Definition: {t.definition}</Typography>}
                </Box>
              </motion.div>
            )
          })}
        </Stack>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit Spellings &amp; Explanations
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task D Complete! Score: {score}/{TERMS.length}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score >= 5 ? 'Excellent! You know these terms well!' : 'Good effort! Review the definitions and keep practicing.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(2, 'B2'))} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
