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
  { num: 1, label: 'Positive opening', instruction: 'Name a specific strength using formal language.' },
  { num: 2, label: 'Second strength', instruction: 'Provide a concrete example from their work.' },
  { num: 3, label: 'Transition', instruction: 'Use "To further strengthen..." or "One area that could be developed..."' },
  { num: 4, label: 'Constructive suggestion 1', instruction: 'Make it specific and actionable.' },
  { num: 5, label: 'Constructive suggestion 2', instruction: 'Include a clear rationale for your suggestion.' },
  { num: 6, label: 'Empathetic acknowledgement', instruction: 'Use "I recognise that..." or "Given the time constraints..."' },
  { num: 7, label: 'Return to positive', instruction: "Reaffirm the writer's overall quality." },
  { num: 8, label: 'Forward-looking close', instruction: 'Use "I look forward to seeing..." or "I am confident that..."' },
]

const MODEL_ANSWER = `Your report demonstrates an impressive command of formal academic language and a thoughtful, structured approach to evaluating the event. In particular, the Successes section is commendable for its use of specific attendance data and participant satisfaction scores. To further strengthen the report, I would suggest expanding the Recommendations section beyond general statements to include specific, measurable targets. For example, rather than suggesting 'improve communication', you might specify 'hold weekly planning meetings with all event coordinators'. Additionally, the Challenges section, whilst honest, would benefit from a brief explanation of how each difficulty was or could be resolved. I recognise that writing a comprehensive post-event report requires considerable time and analytical effort, particularly when balancing multiple responsibilities. Nevertheless, your commitment to honest self-evaluation and your clear organisational structure are evident throughout. I look forward to seeing how you develop these skills further in your next draft.`

export default function Phase6SP2Step4RemB2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/4/remedial/b2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(PROMPTS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const wordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter((a) => wordCount(a) >= 8).length
    setScore(filled)
    setSubmitted(true)
    setShowModel(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const allAttempted = answers.every((a) => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial B2 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Analysis Odyssey — Write an 8-Sentence B2 Peer Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Write one sentence for each prompt below to construct a complete peer feedback using the positive sandwich structure. Each sentence should contain at least 8 words.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>The Positive Sandwich</Typography>
            <Typography variant="body2">Open with a strength → Give a second strength → Transition → Constructive suggestion 1 → Constructive suggestion 2 → Show empathy → Return to positive → Close with encouragement</Typography>
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
              <TextField fullWidth multiline rows={2} value={answers[idx]} onChange={(e) => { const updated = [...answers]; updated[idx] = e.target.value; setAnswers(updated) }} disabled={submitted} placeholder="Write your sentence here..." />
              <Typography variant="caption" color={wordCount(answers[idx]) >= 8 ? 'success.main' : 'text.secondary'} sx={{ mt: 0.5, display: 'block' }}>
                Words: {wordCount(answers[idx])} {wordCount(answers[idx]) >= 8 ? '(sufficient)' : '(aim for 8+)'}
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
              <Typography variant="body1">{score === 8 ? 'Outstanding! Every sentence met the B2 standard.' : score >= 5 ? 'Good work! Read the model answer below to refine your approach.' : 'Review the model answer carefully to understand the B2 feedback structure.'}</Typography>
            </Box>
            <Collapse in={showModel}>
              <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow }} gutterBottom>Model Answer (Complete Feedback)</Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{MODEL_ANSWER}</Typography>
              </Box>
            </Collapse>
            <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/c')} sx={{ width: '100%', bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
              Continue to Task C
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
