import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Collapse, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const EXTRACTS = [
  { extract: '"Your report is good but the recommendations are not very good."', critiqueChip: 'Vague + unbalanced', fixChip: 'Specific + evidence-linked', expertWeakness: 'Vague comparative ("not very good") without specificity; the positive is generic and the negative provides no guidance.', expertFix: '"Your report demonstrates strong organisational clarity; to enhance its impact, the Recommendations section would benefit from specific, measurable targets linked directly to the challenges identified in Section 3."' },
  { extract: '"I think your report could maybe be a bit more specific in some parts."', critiqueChip: 'Over-hedged + vague', fixChip: 'Confident + targeted', expertWeakness: 'Excessive hedging ("think", "could maybe", "a bit", "some parts") renders the feedback meaninglessly vague.', expertFix: '"To strengthen the analytical rigour of the report, I recommend supplementing the qualitative observations in the Challenges section with quantitative data from participant surveys."' },
  { extract: '"Everything is fine except the conclusion which needs total rewriting."', critiqueChip: 'Sweeping negative', fixChip: 'Nuanced + constructive', expertWeakness: '"Total rewriting" is discouraging and imprecise; "everything is fine" is unspecific and the contrast is jarring.', expertFix: '"The report is largely well-structured and analytically sound. The conclusion, whilst coherent, would benefit from a more explicit synthesis of the key findings and a stronger forward-looking statement to reinforce the report\'s impact."' },
  { extract: '"Your vocabulary is impressive."', critiqueChip: 'Unsubstantiated praise', fixChip: 'Evidence-based praise', expertWeakness: 'Unsubstantiated — the writer cannot learn or build on praise without knowing which vocabulary and why it is effective.', expertFix: '"Your deployment of formal academic register — particularly the consistent use of nominalisations such as \'evaluation\', \'implementation\', and \'accountability\' — reflects a sophisticated command of professional report language."' },
  { extract: '"Next time, plan better and write more carefully."', critiqueChip: 'Directive + no rationale', fixChip: 'Empathetic + specific', expertWeakness: 'Directive and blunt with no acknowledgement of effort; offers no specific guidance or empathy.', expertFix: '"I recognise the considerable effort that producing this report required. For future iterations, I would recommend building in a dedicated proofreading phase and creating a structured planning timeline to ensure all sections receive equal analytical attention."' },
]

export default function Phase6SP2Step4RemC1TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase2RemedialNextUrl(4, 'C1').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(EXTRACTS.map(() => ''))
  const [revealed, setRevealed] = useState(EXTRACTS.map(() => false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleReveal = (idx) => {
    const updated = [...revealed]
    updated[idx] = true
    setRevealed(updated)
  }

  const handleSubmit = async () => {
    const filled = critiques.filter((c) => wordCount(c) >= 5).length
    setScore(filled)
    setSubmitted(true)
    setRevealed(EXTRACTS.map(() => true))
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taskd_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'D', filled, 5, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = critiques.every((c) => c.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial C1 — Task D</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Critique Kahoot — Identify Weaknesses in Flawed Peer Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Each extract is a flawed piece of peer feedback. Write your critique identifying the weakness, then reveal the expert analysis and improved version. Each critique should contain at least 5 words.</Typography>
          </Box>
        </motion.div>

        {EXTRACTS.map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ bgcolor: P.orange.border, color: 'white', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}>{idx + 1}</Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.border }}>Flawed extract:</Typography>
              </Box>

              <Box sx={{ ...cardSx(P.red), p: 2, mb: 2, borderRadius: '12px' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{item.extract}</Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Box sx={{ bgcolor: P.red.border, color: 'white', fontWeight: 'bold', px: 2, py: 0.3, borderRadius: '8px', fontSize: '0.75rem' }}>{item.critiqueChip}</Box>
                <Box sx={{ bgcolor: P.green.border, color: 'white', fontWeight: 'bold', px: 2, py: 0.3, borderRadius: '8px', fontSize: '0.75rem' }}>{item.fixChip}</Box>
              </Stack>

              <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Your critique — what is wrong with this feedback?</Typography>
              <TextField fullWidth multiline rows={3} value={critiques[idx]} onChange={(e) => { const updated = [...critiques]; updated[idx] = e.target.value; setCritiques(updated) }} disabled={submitted} placeholder="Identify the specific weakness in this feedback extract..." sx={{ mb: 1 }} />
              <Typography variant="caption" color={wordCount(critiques[idx]) >= 5 ? 'success.main' : 'text.secondary'}>
                Words: {wordCount(critiques[idx])} {wordCount(critiques[idx]) >= 5 ? '' : '(aim for 5+)'}
              </Typography>

              {!submitted && !revealed[idx] && (
                <Box sx={{ mt: 1.5 }}>
                  <Box component="button" onClick={() => handleReveal(idx)} sx={{ bgcolor: 'transparent', color: P.orange.border, border: `2px solid ${P.orange.border}`, borderRadius: '10px', px: 2, py: 0.7, fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { bgcolor: P.orange.bg }, transition: 'all 0.15s' }}>
                    Reveal Expert Feedback
                  </Box>
                </Box>
              )}

              <Collapse in={revealed[idx] || submitted}>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ ...cardSx(P.yellow), p: 2, mb: 1.5, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.shadow }} gutterBottom>Expert critique:</Typography>
                    <Typography variant="body2">{item.expertWeakness}</Typography>
                  </Box>
                  <Box sx={{ ...cardSx(P.green), p: 2, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>Expert rewrite:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{item.expertFix}</Typography>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </motion.div>
        ))}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAttempted} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAttempted ? 'not-allowed' : 'pointer', opacity: !allAttempted ? 0.6 : 1, '&:hover': allAttempted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit All Critiques
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task D Complete! Score: {score}/5</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 5 ? 'Exceptional analytical thinking — you identified every weakness with precision.' : score >= 3 ? 'Well done! Compare your critiques with the expert analyses above.' : 'Study the expert critiques carefully — identifying weaknesses is a core C1 analytical skill.'}</Typography>
              <Box component="button" onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(4, 'C1'))} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
