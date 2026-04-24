import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const TERMS = [
  { term: 'exceeded', usage: 'Used to show results were better than the target (e.g. "Attendance exceeded expectations.")' },
  { term: 'highlight', usage: 'Used to draw attention to key achievements (e.g. "The report highlights three main successes.")' },
  { term: 'encountered', usage: 'Used to introduce a challenge (e.g. "The team encountered technical difficulties.")' },
  { term: 'recommend', usage: 'Used in the recommendations section (e.g. "It is recommended that future events...")' },
  { term: 'evidence', usage: 'Used to support claims (e.g. "Evidence from participant surveys suggests...")' },
  { term: 'evaluation', usage: 'Used to describe the overall assessment (e.g. "This evaluation concludes that...")' },
]

export default function Phase6SP1Step4RemB2TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase1RemedialNextUrl(4, 'B2').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 4, context: 'remedial_b2' })
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
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taskd_score', total.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'D', total, TERMS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = spellings.every(s => s.trim().length > 0) && usages.every(u => u.trim().length > 0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task D: Spell &amp; Explain</Typography>
            <Typography variant="body1" color="text.secondary">Spell 6 report terms and explain how to use them</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">
              For each term: (1) type the correct spelling, (2) write a short sentence showing how you would use it in a post-event report (at least 4 words).
            </Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {TERMS.map((t, idx) => {
            const spellOk = submitted && spellResults[idx]
            const spellBad = submitted && !spellResults[idx]
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.04 }}>
                <Box sx={{ ...cardSx(submitted ? (spellOk ? P.green : P.red) : P.orange) }}>
                  <Typography variant="subtitle2" sx={{ color: P.orange.border, fontWeight: 'bold', mb: 1.5 }}>
                    Term {idx + 1}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70 }}>Spelling:</Typography>
                    <TextField
                      size="small"
                      value={spellings[idx]}
                      onChange={(e) => {
                        const updated = [...spellings]; updated[idx] = e.target.value; setSpellings(updated)
                      }}
                      disabled={submitted}
                      placeholder="Type the word..."
                      sx={{ minWidth: 200 }}
                    />
                    {submitted && (
                      <Typography variant="body2" sx={{ color: spellOk ? P.green.border : P.red.border, fontWeight: 'bold' }}>
                        {spellOk ? '✓ Correct!' : `✗ Answer: ${t.term}`}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70, mt: 1 }}>Use it:</Typography>
                    <TextField
                      size="small"
                      multiline
                      rows={2}
                      value={usages[idx]}
                      onChange={(e) => {
                        const updated = [...usages]; updated[idx] = e.target.value; setUsages(updated)
                      }}
                      disabled={submitted}
                      placeholder="Write a sentence using this word in a report..."
                      sx={{ flex: 1, minWidth: 200 }}
                    />
                  </Box>

                  {submitted && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Example use: {t.usage}
                    </Typography>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              opacity: !allFilled ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task D Complete! Score: {score}/{TERMS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {score >= 5 ? 'Excellent! You know these report terms well.' : 'Good effort! Review the example uses above and keep practising.'}
              </Typography>
              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(4, 'B2'))}
                sx={{
                  px: 6, py: 1.5,
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
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
