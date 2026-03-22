import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const PROMPTS = [
  { num: 1, label: 'Sophisticated positive opening', instruction: 'Use "demonstrates", "commendable", "analytical rigour". Minimum 10 words.' },
  { num: 2, label: 'Specific strength with textual evidence', instruction: 'Quote or paraphrase from their work. Minimum 10 words.' },
  { num: 3, label: 'Second strength with broader impact', instruction: 'Explain how it serves the reader or stakeholder. Minimum 10 words.' },
  { num: 4, label: 'Nuanced transition', instruction: 'Use "notwithstanding", "whilst", or "it is worth noting that". Minimum 10 words.' },
  { num: 5, label: 'Evidence-based constructive suggestion 1', instruction: 'Link to a specific section or finding. Minimum 10 words.' },
  { num: 6, label: 'Evidence-based constructive suggestion 2', instruction: 'Include rationale referencing audience or purpose. Minimum 10 words.' },
  { num: 7, label: 'Empathetic contextual acknowledgement', instruction: 'Recognise external factors or constraints. Minimum 10 words.' },
  { num: 8, label: 'Forward-looking evaluative close', instruction: 'Affirm potential and invite continued dialogue. Minimum 10 words.' },
]

const MODEL_ANSWER = `This report demonstrates commendable analytical rigour and a nuanced understanding of both the successes and challenges inherent in large-scale event management. The executive summary is particularly effective, offering a concise yet comprehensive overview that contextualises the subsequent findings with clarity and precision. Furthermore, the Recommendations section reflects a sophisticated grasp of stakeholder accountability, linking each proposal directly to an identified gap in the event's delivery. Notwithstanding these considerable strengths, the Challenges section would benefit from a more evidence-based analysis — for instance, supplementing the qualitative observations with data from participant exit surveys would significantly strengthen the credibility of your conclusions. Additionally, whilst the tone throughout is appropriately formal, some passages in the methodology section could be restructured to improve logical flow and coherence for the non-specialist reader. I recognise that producing a report of this scope demands substantial time and intellectual investment, particularly in the context of competing institutional demands. Nevertheless, the quality of your analysis and the clarity of your organisational framework reflect a genuine commitment to professional excellence. I am confident that with these targeted refinements, this report will serve as an exemplary model of evidence-based reflective practice.`

const C1_VOCAB = ['evidence-based', 'nuanced', 'accountability', 'objectivity', 'credibility', 'growth mindset']

export default function Phase6SP2Step4RemC1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(PROMPTS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter((a) => wordCount(a) >= 10).length
    setScore(filled)
    setSubmitted(true)
    setShowModel(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = answers.every((a) => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial C1 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Analysis Odyssey — Write a Sophisticated 8-Sentence C1 Peer Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Write one sentence per prompt to build a complete C1-level peer feedback using the positive sandwich. Each sentence must contain at least 10 words and demonstrate sophisticated academic language.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Target C1 Vocabulary — Try to use these in your writing</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {C1_VOCAB.map((v) => (
                <Box key={v} sx={{ bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', px: 2, py: 0.5, borderRadius: '10px', fontSize: '0.875rem' }}>{v}</Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {PROMPTS.map((p, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ bgcolor: P.orange.border, color: 'white', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}>{p.num}</Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.blue.shadow }}>{p.label}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>{p.instruction}</Typography>
              <TextField fullWidth multiline rows={3} value={answers[idx]} onChange={(e) => { const updated = [...answers]; updated[idx] = e.target.value; setAnswers(updated) }} disabled={submitted} placeholder="Write your sentence here..." />
              <Typography variant="caption" color={wordCount(answers[idx]) >= 10 ? 'success.main' : 'text.secondary'} sx={{ mt: 0.5, display: 'block' }}>
                Words: {wordCount(answers[idx])} {wordCount(answers[idx]) >= 10 ? '(sufficient)' : '(aim for 10+)'}
              </Typography>
            </Box>
          </motion.div>
        ))}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAttempted} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAttempted ? 'not-allowed' : 'pointer', opacity: !allAttempted ? 0.6 : 1, '&:hover': allAttempted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Feedback
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center', mb: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task B Complete! Score: {score}/8</Typography>
              <Typography variant="body1">{score === 8 ? 'Exceptional! Every sentence met the C1 standard — sophisticated, evidence-based, and structured.' : score >= 5 ? 'Strong effort! Compare your sentences with the model answer to identify areas for refinement.' : 'Review the model answer carefully and focus on using nuanced vocabulary and evidence-linked language.'}</Typography>
            </Box>
            <Collapse in={showModel}>
              <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow }} gutterBottom>Model Answer (Complete C1 Feedback)</Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.9 }}>{MODEL_ANSWER}</Typography>
              </Box>
            </Collapse>
            <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/c1/task/c')} sx={{ width: '100%', bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
              Continue to Task C
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
