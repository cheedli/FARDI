import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, RadioGroup, FormControlLabel, Radio, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const QUESTIONS = [
  { question: 'Why is it more effective to open peer feedback with a specific strength rather than a generic compliment like "Well done!"?', options: ['It is polite.', 'Generic compliments signal inattention; specific praise demonstrates engagement with the work and builds the credibility of subsequent critique.', 'It makes the feedback longer.', 'It avoids conflict.'], correct: 1, explanation: 'Credibility is established through specificity — vague praise is dismissed; engaged, textual praise signals that your critique is equally thoughtful.' },
  { question: 'A C1 peer reviewer writes: "The report is comprehensive, though the Recommendations section, whilst well-intentioned, lacks the specificity required to function as actionable guidance for future stakeholders." What makes this C1-level?', options: ['It is long.', 'It balances genuine praise with a nuanced, evidence-linked critique using sophisticated hedging and stakeholder awareness.', 'It uses passive voice.', 'It ends negatively.'], correct: 1, explanation: 'This demonstrates balance, specificity, hedging ("whilst"), and stakeholder awareness — all hallmarks of C1 analytical writing.' },
  { question: 'When should you use hedging language (e.g. "might", "could", "it is worth considering") in peer feedback?', options: ['Always, to avoid being definitive.', 'Never — it makes feedback seem weak.', 'When making suggestions or expressing opinions, to maintain epistemic humility and reduce the risk of the feedback being received as prescriptive.', 'Only in the opening sentence.'], correct: 2, explanation: 'Hedging in feedback signals intellectual humility and invites dialogue rather than imposing judgment — this is a key feature of sophisticated academic discourse.' },
  { question: 'Why is linking a constructive suggestion to a specific section or moment in the text a marker of C1-level feedback?', options: ['It shows you read the whole document.', 'It demonstrates close reading, analytical precision, and provides actionable, evidence-based guidance that the writer can directly apply.', 'It makes the feedback more formal.', 'It is a requirement of the positive sandwich.'], correct: 1, explanation: 'Evidence-based feedback is more credible, actionable, and demonstrates the analytical depth expected at C1 level.' },
  { question: 'A student\'s feedback closing reads: "Overall, nice work — keep it up!" Why is this insufficient at C1 level?', options: ['It is too short.', 'It should use passive voice.', 'It is generic, fails to synthesise the key findings, and offers no forward-looking growth orientation — a C1 close should affirm potential and invite further development.', 'It uses informal language only.'], correct: 2, explanation: 'A C1 closing should synthesise, affirm, and orient forward — it is an evaluative statement, not a social nicety.' },
  { question: 'What is the purpose of empathetic acknowledgement in peer feedback (e.g. "I recognise that...")?', options: ['To show you understand the writer\'s feelings and context, which increases the likelihood that your constructive suggestions will be received and acted upon.', 'To make the feedback more personal and informal.', 'To avoid giving criticism.', 'To add more words to the feedback.'], correct: 0, explanation: 'Empathy in feedback is strategic as well as humane — acknowledging context signals that your critique is fair and considered, not arbitrary.' },
]

export default function Phase6SP2Step4RemC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/4/remedial/c1/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_c1' })
  const [selections, setSelections] = useState(QUESTIONS.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSelect = (qIdx, val) => {
    if (submitted) return
    const updated = [...selections]
    updated[qIdx] = Number(val)
    setSelections(updated)
  }

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (selections[i] === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = selections.every((s) => s !== null)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial C1 — Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Quizlet Live — Advanced Analytical Questions on C1 Peer Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Answer each question about the principles and techniques behind C1-level peer feedback writing. Explanations will appear after submission.</Typography>
          </Box>
        </motion.div>

        {QUESTIONS.map((q, qIdx) => {
          const selected = selections[qIdx]
          const isCorrect = submitted && selected === q.correct
          const isWrong = submitted && selected !== q.correct
          return (
            <motion.div key={qIdx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + qIdx * 0.05 }}>
              <Box sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue), mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <Box sx={{ bgcolor: P.orange.border, color: 'white', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.8rem', flexShrink: 0 }}>Q{qIdx + 1}</Box>
                  <Typography variant="body1" fontWeight="bold">{q.question}</Typography>
                </Box>
                <RadioGroup value={selected !== null ? selected.toString() : ''} onChange={(e) => handleSelect(qIdx, e.target.value)}>
                  {q.options.map((opt, oIdx) => {
                    let optColor = 'inherit'
                    let optBg = 'transparent'
                    if (submitted) {
                      if (oIdx === q.correct) { optColor = P.green.shadow; optBg = P.green.bg }
                      else if (oIdx === selected && selected !== q.correct) { optColor = P.red.border; optBg = P.red.bg }
                    }
                    return (
                      <FormControlLabel key={oIdx} value={oIdx.toString()} control={<Radio size="small" />} disabled={submitted}
                        label={<Typography variant="body2" sx={{ color: optColor }}>{opt}</Typography>}
                        sx={{ mb: 0.5, pl: 1, borderRadius: 1, backgroundColor: optBg, transition: 'background-color 0.2s' }}
                      />
                    )
                  })}
                </RadioGroup>
                <Collapse in={submitted}>
                  <Box sx={{ ...cardSx(isCorrect ? P.green : P.yellow), p: 2, mt: 2, borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    {isCorrect ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 20, flexShrink: 0, mt: 0.2 }} /> : <CancelIcon sx={{ color: P.red.border, fontSize: 20, flexShrink: 0, mt: 0.2 }} />}
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.red.border }} gutterBottom>
                        {isCorrect ? 'Correct!' : `Incorrect — correct answer: option ${q.correct + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{q.explanation}</Typography>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.6 : 1, '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit All Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task C Complete! Score: {score}/6</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{score === 6 ? 'Excellent — you have a thorough analytical understanding of C1 peer feedback principles.' : score >= 4 ? 'Strong performance! Review the explanations for any questions you missed.' : 'Read each explanation carefully — these principles are fundamental to producing C1-level peer feedback.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/c1/task/d')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task D
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
