import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, RadioGroup, FormControlLabel, Radio, FormControl, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const QUESTIONS = [
  {
    question: 'Why does a spelling error in peer feedback have consequences beyond the error itself?',
    options: ['It makes the feedback longer.', "It undermines the reviewer's credibility and signals inattention, which may cause the recipient to discount even valid critique.", 'It changes the meaning completely.', 'It is just a minor issue.'],
    correctIndex: 1,
    explanation: 'In professional and academic contexts, surface errors signal carelessness — they can undermine the entire feedback, regardless of its analytical quality.',
  },
  {
    question: 'A peer reviewer uses the phrase "kinda weak" in feedback. Beyond informality, what deeper problem does this create?',
    options: ['It is too honest.', 'It provides no actionable guidance and may discourage the writer without offering a path forward.', 'It uses the wrong tense.', 'It is too short.'],
    correctIndex: 1,
    explanation: "Vague informal critique is doubly problematic — it fails to specify the weakness and offers no constructive direction, undermining the feedback's purpose entirely.",
  },
  {
    question: 'When revising peer feedback for tone, which is the most important principle at C1 level?',
    options: ['Remove all negative comments.', 'Use only passive voice.', 'Ensure every critical observation is balanced, specific, and framed to promote a growth mindset rather than defensiveness.', 'Make it as formal as possible regardless of clarity.'],
    correctIndex: 2,
    explanation: 'C1 tone management requires simultaneous precision, empathy, and strategic framing — the goal is to make critique not just palatable but motivating.',
  },
  {
    question: 'A student revises "Your recommendations are bad" to "Your recommendations could be improved." Is this sufficient at C1 level? Why or why not?',
    options: ['Yes — it is more polite.', 'No — whilst more polite, it remains vague and provides no evidence-based, actionable guidance.', 'Yes — it uses hedging correctly.', 'No — it should use passive voice.'],
    correctIndex: 1,
    explanation: 'Politeness alone is insufficient. C1 revision must also add specificity, evidence-linking, and actionable direction.',
  },
  {
    question: 'What is the role of structural revision in peer feedback?',
    options: ['To make the feedback longer.', 'To ensure the feedback follows a logical progression that is easy for the writer to follow and act upon — disorder undermines even strong content.', 'To add more positive comments.', 'To use more paragraphs.'],
    correctIndex: 1,
    explanation: 'Structure in feedback serves the reader — a well-structured review guides the writer through strengths, then areas for growth, then encouragement in a logical, purposeful sequence.',
  },
  {
    question: 'After revising a peer feedback draft three times (spelling → tone → structure), a student finds a minor vocabulary issue. Should they revise again? Why?',
    options: ['No — three revisions is enough.', "Yes — every revision cycle improves the feedback's credibility, empathy, and analytical precision, and accountability to the writer demands the highest possible standard.", 'No — vocabulary is not important.', 'Only if the teacher asks.'],
    correctIndex: 1,
    explanation: "Professional accountability means striving for the highest possible standard — each revision cycle serves the writer's development, not just a marking criterion.",
  },
]

export default function Phase6SP2Step5RemC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/5/remedial/c1/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const allAnswered = answers.every(a => a !== null)

  const handleChange = (qIndex, optIndex) => {
    setAnswers(prev => { const updated = [...prev]; updated[qIndex] = optIndex; return updated })
  }

  const handleSubmit = async () => {
    if (!allAnswered) return
    const correct = answers.filter((a, i) => a === QUESTIONS[i].correctIndex).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial C1 — Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Quizlet Live — Advanced Peer Feedback Revision (C1 Level)</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">Answer all 6 questions about rigorous peer feedback revision at C1 level. Select the best answer for each question, then submit to see explanations.</Typography>
          </Box>
        </motion.div>

        {QUESTIONS.map((q, qIndex) => {
          const userAnswer = answers[qIndex]
          const isCorrect = submitted && userAnswer === q.correctIndex
          const isWrong = submitted && userAnswer !== q.correctIndex
          return (
            <motion.div key={qIndex} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + qIndex * 0.05 }}>
              <Box sx={{ ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue), mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: P.blue.border }}>Question {qIndex + 1}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{q.question}</Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={userAnswer !== null ? userAnswer.toString() : ''} onChange={e => handleChange(qIndex, parseInt(e.target.value))}>
                    {q.options.map((opt, optIndex) => {
                      let labelColor = 'inherit'
                      if (submitted) {
                        if (optIndex === q.correctIndex) labelColor = P.green.shadow
                        else if (optIndex === userAnswer) labelColor = P.red.border
                      }
                      return (
                        <FormControlLabel
                          key={optIndex}
                          value={optIndex.toString()}
                          disabled={submitted}
                          control={<Radio size="small" />}
                          label={<Typography variant="body2" sx={{ color: labelColor, fontWeight: submitted && optIndex === q.correctIndex ? 'bold' : 'normal' }}>{String.fromCharCode(97 + optIndex)}) {opt}</Typography>}
                          sx={{ mb: 0.5 }}
                        />
                      )
                    })}
                  </RadioGroup>
                </FormControl>
                <Collapse in={submitted}>
                  <Box sx={{ ...cardSx(isCorrect ? P.green : P.yellow), p: 2, mt: 2, borderRadius: '12px' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: isCorrect ? P.green.shadow : P.yellow.shadow }}>
                      {isCorrect ? 'Correct!' : `Incorrect — the correct answer is: ${String.fromCharCode(97 + q.correctIndex)})`}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{q.explanation}</Typography>
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
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task C Complete! Score: {score}/6</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score === 6 ? 'Perfect score! You demonstrate deep C1-level understanding of peer feedback revision principles.' : score >= 4 ? 'Good performance! Review the explanations above for any questions you missed.' : 'Keep developing your understanding — review the explanations carefully before continuing.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/c1/task/d')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task D
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
