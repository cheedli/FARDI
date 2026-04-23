import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Collapse, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'
import BuildIcon from '@mui/icons-material/Build'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const EXTRACTS = [
  {
    extract: '"Your reprot has alot of good ideers but the recomendations need work and you should fix grammer."',
    critiqueChip: 'Multiple spelling + grammar errors',
    fixChip: 'Proofread + formalise',
    weakness: 'Multiple spelling errors (reprot, alot, ideers, recomendations, grammer) and informal register undermine credibility.',
    expertFix: '"Your report contains a number of insightful ideas and demonstrates a commendable understanding of the event\'s key outcomes. To strengthen the overall impact, I recommend refining the Recommendations section with specific, measurable targets and reviewing the report for grammatical consistency."',
  },
  {
    extract: '"This is fine. Could be better. The end."',
    critiqueChip: 'Telegraphic + no substance',
    fixChip: 'Full sentences + specific',
    weakness: 'Fragmented, content-free feedback that offers no actionable guidance or balanced evaluation.',
    expertFix: '"Your report is clearly structured and addresses the key areas expected of a post-event evaluation. To further develop its analytical depth, I suggest expanding the Challenges section with specific examples and supplementing the Successes section with quantitative evidence."',
  },
  {
    extract: '"I feel like maybe your tone is sometimes a bit off in some places. Just my opinion."',
    critiqueChip: 'Over-hedged + vague + disclaiming',
    fixChip: 'Confident + evidence-based',
    weakness: 'Excessive hedging and the disclaimer "Just my opinion" undermine accountability and provide no specific guidance.',
    expertFix: '"In certain passages — particularly the opening of the Challenges section — the tone shifts from formal to conversational, which disrupts the register consistency expected of a professional post-event report. I recommend reviewing these sections to ensure a uniformly formal and objective voice throughout."',
  },
  {
    extract: '"Great report!!! You are so talented!!! Keep it up!!!"',
    critiqueChip: 'Unsubstantiated + informal',
    fixChip: 'Evidence-based + professional',
    weakness: 'Excessive enthusiasm and lack of specificity signal that the reviewer has not engaged analytically with the work.',
    expertFix: '"Your report reflects considerable analytical talent, particularly in the precision and clarity of the executive summary and the logical coherence of the overall structure. I look forward to seeing how you continue to develop your capacity for evidence-based, nuanced evaluation in future work."',
  },
  {
    extract: '"The structure is confusing, the vocabulary is basic, the tone is wrong, and the recommendations make no sense."',
    critiqueChip: 'All negative + no balance',
    fixChip: 'Positive sandwich + specific fixes',
    weakness: "Wholly negative feedback with no acknowledgement of strengths; each criticism is vague and potentially demoralising.",
    expertFix: '"Your report demonstrates genuine commitment to honest self-reflection and covers all the required sections comprehensively. To strengthen its analytical impact, I suggest: (1) restructuring the Challenges section to follow a problem-resolution format, (2) replacing general vocabulary (\'good\', \'bad\') with domain-specific terms (\'well-received\', \'logistical challenges\'), and (3) linking each recommendation directly to a specific finding to ensure clarity and actionability."',
  },
]

export default function Phase6SP2Step5RemC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(EXTRACTS.length).fill(''))
  const [revealed, setRevealed] = useState(Array(EXTRACTS.length).fill(false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleCritiqueChange = (index, value) => {
    setCritiques(prev => { const updated = [...prev]; updated[index] = value; return updated })
  }

  const toggleReveal = (index) => {
    setRevealed(prev => { const updated = [...prev]; updated[index] = !updated[index]; return updated })
  }

  const wordCount = (text) => text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const filled = critiques.filter(c => wordCount(c) >= 5).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_c1_taskd_score', filled.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'D', filled, 5, 0, 2) } catch (e) { console.error(e) }
  }

  const anyFilled = critiques.some(c => c.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial C1 — Task D</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Critique Kahoot — Critique and Fix 5 Severely Flawed Peer Feedback Extracts</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">For each flawed extract, (1) write your critique identifying the weakness (at least 5 words), then (2) reveal the expert fix and model response. After critiquing all 5 extracts, submit your final evaluation.</Typography>
          </Box>
        </motion.div>

        {EXTRACTS.map((item, index) => {
          const wc = wordCount(critiques[index])
          const isSufficient = submitted && wc >= 5
          const isInsufficient = submitted && wc < 5
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
              <Box sx={{ ...cardSx(isSufficient ? P.green : isInsufficient ? P.red : P.blue), mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>Extract {index + 1}</Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: P.red.bg, color: P.red.border, border: `1px solid ${P.red.border}`, px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <CrisisAlertIcon sx={{ fontSize: 14 }} />{item.critiqueChip}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: P.green.bg, color: P.green.shadow, border: `1px solid ${P.green.border}`, px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <BuildIcon sx={{ fontSize: 14 }} />{item.fixChip}
                  </Box>
                </Stack>

                <Box sx={{ ...cardSx(P.red), p: 2, mb: 2, borderRadius: '12px' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.red.border, mb: 0.5 }}>Flawed extract:</Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{item.extract}</Typography>
                </Box>

                <Box sx={{ ...cardSx(P.yellow), p: 2, mb: 2, borderRadius: '12px' }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>Key weakness:</Typography>
                  <Typography variant="body2">{item.weakness}</Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: P.blue.border }}>Write your critique of this extract (min. 5 words):</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={critiques[index]}
                  onChange={e => handleCritiqueChange(index, e.target.value)}
                  disabled={submitted}
                  placeholder="Explain what is wrong with this feedback and why it fails at C1 level..."
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" sx={{ color: submitted && wc < 5 ? P.red.border : 'text.secondary' }}>
                  Words: {wc}{submitted && wc < 5 ? ' (minimum 5 words required)' : ''}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Box component="button" onClick={() => toggleReveal(index)} sx={{ bgcolor: P.purple.bg, color: P.purple.border, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`, py: 1, px: 2.5, fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${P.purple.shadow}` }, transition: 'all 0.15s' }}>
                    {revealed[index] ? 'Hide Expert Fix' : 'Reveal Expert Fix'}
                  </Box>

                  <Collapse in={revealed[index]}>
                    <Box sx={{ ...cardSx(P.green), mt: 2, borderRadius: '12px', p: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow, mb: 1 }}>Expert rewrite:</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>{item.expertFix}</Typography>
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!anyFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !anyFilled ? 'not-allowed' : 'pointer', opacity: !anyFilled ? 0.6 : 1, '&:hover': anyFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Final Critique
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task D Complete! Score: {score}/5</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 5 ? 'Outstanding — you critiqued all 5 extracts with C1-level analytical precision. You are ready to produce exemplary peer feedback!' : score >= 3 ? 'Strong performance! Review the expert fixes above to consolidate your understanding of rigorous peer feedback revision.' : 'Good effort! Study the expert rewrites carefully — they model the precision, empathy, and evidence-based approach required at C1 level.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(5, 'C1'))} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
