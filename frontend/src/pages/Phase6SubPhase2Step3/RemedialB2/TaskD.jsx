import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 2 Step 3 — Level B2 — Task D
 * Spell & Explain: spell 6 peer feedback terms and explain how to use them in feedback
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const TERMS = [
  { term: 'constructive', usage: 'Use when describing helpful feedback (e.g. "I aimed to offer constructive suggestions.")' },
  { term: 'specific', usage: 'Use to describe precise feedback (e.g. "My feedback was specific about the vocabulary choices.")' },
  { term: 'balanced', usage: 'Use to show you acknowledged both strengths and weaknesses (e.g. "I tried to give balanced feedback.")' },
  { term: 'empathetic', usage: 'Use to show you considered the writer\'s feelings (e.g. "I tried to be empathetic in my tone.")' },
  { term: 'actionable', usage: 'Use for suggestions the writer can actually apply (e.g. "My recommendations were actionable.")' },
  { term: 'strengthen', usage: 'Use when suggesting an improvement (e.g. "To strengthen your report, consider adding data.")' },
]

export default function Phase6SP2Step3RemB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(TERMS.length).fill(''))
  const [usages, setUsages] = useState(Array(TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [spellResults, setSpellResults] = useState([])
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const results = TERMS.map((t, i) => spellings[i].trim().toLowerCase() === t.term)
    const spellScore = results.filter(Boolean).length
    const usageScore = usages.filter(u => u.trim().split(/\s+/).length >= 4).length
    const total = Math.round((spellScore + usageScore) / 2)
    setSpellResults(results)
    setScore(total)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'D', total, TERMS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && usages.every(u => u.trim().length > 0)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Phase 6: Peer Feedback Discussion</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Step 3: Remedial Practice — Level B2</Typography>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Task D: Spell &amp; Explain</Typography>
            <Typography>Spell 6 peer feedback terms and explain how to use them</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">For each term: (1) type the correct spelling, (2) write a sentence showing how you would use it when giving or describing peer feedback (at least 4 words).</Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {TERMS.map((t, idx) => {
              const isCorrect = submitted && spellResults[idx]
              const isWrong = submitted && !spellResults[idx]
              const termColor = isCorrect ? P.green : isWrong ? P.red : P.teal
              return (
                <Box key={idx} sx={{
                  bgcolor: termColor.bg,
                  border: `2px solid ${termColor.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${termColor.shadow}`,
                  p: 3,
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: P.purple.border, mb: 1.5 }}>
                    Term {idx + 1}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ minWidth: 70, fontWeight: 600 }}>Spelling:</Typography>
                    <TextField
                      size="small"
                      value={spellings[idx]}
                      onChange={(e) => { const u = [...spellings]; u[idx] = e.target.value; setSpellings(u) }}
                      disabled={submitted}
                      placeholder="Type the word..."
                      sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.purple.border } } }}
                    />
                    {submitted && (
                      <Typography variant="body2" sx={{ color: spellResults[idx] ? P.green.border : P.red.border, fontWeight: 700 }}>
                        {spellResults[idx] ? '✓ Correct!' : `✗ Answer: ${t.term}`}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: submitted ? 1.5 : 0 }}>
                    <Typography variant="body2" sx={{ minWidth: 70, fontWeight: 600, mt: 1 }}>Use it:</Typography>
                    <TextField
                      size="small"
                      multiline
                      rows={2}
                      value={usages[idx]}
                      onChange={(e) => { const u = [...usages]; u[idx] = e.target.value; setUsages(u) }}
                      disabled={submitted}
                      placeholder="Write a sentence using this word in feedback..."
                      sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.purple.border } } }}
                    />
                  </Box>

                  {submitted && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                      Example: {t.usage}
                    </Typography>
                  )}
                </Box>
              )
            })}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allFilled}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: allFilled ? 'pointer' : 'not-allowed', opacity: allFilled ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit
            </Box>
          ) : (
            <Box sx={{ ...cardSx('purple'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border, fontWeight: 700, mb: 1 }}>Task D Complete! Score: {score}/{TERMS.length}</Typography>
              <Typography sx={{ mb: 2 }}>{score >= 5 ? 'Excellent! You know these peer feedback terms well.' : 'Good effort! Review the example uses above and keep practising.'}</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/4')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Step 4 →
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
