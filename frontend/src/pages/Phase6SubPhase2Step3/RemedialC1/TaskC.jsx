import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio, FormControl, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const QUESTIONS = [
  { id: 1, question: 'Why does opening peer feedback with a genuine strength increase the likelihood the writer will engage with your suggestions?', options: [{ label: 'a', text: 'It makes the feedback longer.' }, { label: 'b', text: 'It establishes trust and psychological safety, making the recipient more receptive to criticism.' }, { label: 'c', text: 'It is a grammatical rule.' }, { label: 'd', text: 'It shows you read their work.' }], correct: 1, explanation: 'Psychological safety is key — when recipients feel respected, they are more open to processing and acting on constructive feedback.' },
  { id: 2, question: 'A student writes: "Your report is okay but it needs a lot of work." What is wrong with this at C1 level?', options: [{ label: 'a', text: 'It is too short.' }, { label: 'b', text: 'It uses the wrong tense.' }, { label: 'c', text: 'It is unspecific, unbalanced, and lacks empathy — it opens negatively and offers no actionable guidance.' }, { label: 'd', text: 'It should use passive voice.' }], correct: 2, explanation: 'Effective C1 feedback is specific, balanced, and empathetic. This sentence fails on all three counts.' },
  { id: 3, question: 'Which sentence best exemplifies the "constructive" element of the positive sandwich?', options: [{ label: 'a', text: '"Your work is good."' }, { label: 'b', text: '"This section is bad."' }, { label: 'c', text: '"To strengthen the coherence of your argument, consider using discourse markers such as \'furthermore\' or \'consequently\'."' }, { label: 'd', text: '"Well done!"' }], correct: 2, explanation: 'Constructive feedback is specific and actionable — it tells the writer exactly what to do and why.' },
  { id: 4, question: 'Why is it important that a closing positive statement in feedback is genuine, not formulaic?', options: [{ label: 'a', text: 'Because it must be longer than the criticism.' }, { label: 'b', text: 'Because formulaic closings (e.g. "great job!") feel hollow and undermine the credibility of the entire feedback.' }, { label: 'c', text: 'Because the writer counts the positive sentences.' }, { label: 'd', text: 'It doesn\'t matter as long as you end positively.' }], correct: 1, explanation: 'Authenticity is essential in feedback. Generic praise signals inattention and reduces the impact of even well-crafted constructive suggestions.' },
  { id: 5, question: 'What does "empathy" mean in the context of peer feedback?', options: [{ label: 'a', text: 'Agreeing with everything the writer did.' }, { label: 'b', text: 'Feeling sorry for the writer.' }, { label: 'c', text: 'Considering how the writer might emotionally receive your feedback and adapting your tone accordingly.' }, { label: 'd', text: 'Writing in a friendly, informal style.' }], correct: 2, explanation: 'Empathy in feedback means anticipating the writer\'s emotional response and choosing language that is honest but considerate of their perspective.' },
  { id: 6, question: 'A peer\'s feedback says: "In light of the limited time you had, the report is remarkably thorough, though the Recommendations section could be developed further with specific targets." What makes this C1-level feedback?', options: [{ label: 'a', text: 'It uses long sentences.' }, { label: 'b', text: 'It acknowledges context (limited time), is balanced, and gives a specific, evidence-linked suggestion.' }, { label: 'c', text: 'It uses formal vocabulary only.' }, { label: 'd', text: 'It follows a strict word count.' }], correct: 1, explanation: 'This response demonstrates contextual awareness, balance, and specificity — the hallmarks of C1-level analytical peer feedback.' },
]

export default function Phase6SP2Step3RemC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/3/remedial/c1/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 3, context: 'remedial_c1' })
  const [selected, setSelected] = useState(Array(6).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return
    setSelected(prev => prev.map((v, i) => i === qIndex ? optionIndex : v))
  }

  const allAnswered = selected.every(v => v !== null)
  const answeredCount = selected.filter(v => v !== null).length
  const progress = (answeredCount / 6) * 100

  const handleSubmit = async () => {
    if (!allAnswered) return
    let correct = 0
    selected.forEach((sel, i) => { if (sel === QUESTIONS[i].correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'C1', 'C', correct, 6, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial C1 — Task C</Typography>
            <Typography>Quizlet Live — Why Does the Positive Sandwich Work?</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Six analytical questions about the principles behind the positive sandwich feedback structure. Read each question carefully — at C1 level, the differences between options can be subtle. Select the best answer for each question, then submit all at once.</Typography>
          </Box>

          {/* Progress */}
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Questions answered</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: P.purple.border }}>{answeredCount}/6</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4, bgcolor: P.purple.bg, '& .MuiLinearProgress-bar': { bgcolor: P.purple.border } }}
            />
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {QUESTIONS.map((q, qIndex) => {
              const userAnswer = selected[qIndex]
              const isCorrect = submitted && userAnswer === q.correct
              const isWrong = submitted && userAnswer !== q.correct
              const cardColor = isCorrect ? P.green : isWrong ? P.red : P.teal
              return (
                <Box key={q.id} sx={{
                  bgcolor: cardColor.bg,
                  border: `2px solid ${cardColor.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${cardColor.shadow}`,
                  p: 3,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{
                      bgcolor: submitted ? (isCorrect ? P.green.border : P.red.border) : P.purple.border,
                      color: 'white', borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                    }}>
                      {submitted ? (isCorrect ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : <CancelIcon sx={{ fontSize: 18 }} />) : q.id}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.purple.border }}>Question {q.id}</Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>{q.question}</Typography>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={userAnswer ?? ''}>
                      {q.options.map((opt, optIndex) => {
                        const isSelected = userAnswer === optIndex
                        const isThisCorrect = optIndex === q.correct
                        let bgColor = 'transparent'
                        if (submitted) {
                          if (isThisCorrect) bgColor = P.green.bg
                          else if (isSelected) bgColor = P.red.bg
                        } else if (isSelected) {
                          bgColor = P.purple.bg
                        }
                        return (
                          <FormControlLabel
                            key={opt.label}
                            value={optIndex}
                            control={
                              <Radio
                                checked={isSelected}
                                onChange={() => handleSelect(qIndex, optIndex)}
                                disabled={submitted}
                                sx={{ color: P.purple.border, '&.Mui-checked': { color: P.purple.border } }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{
                                fontWeight: submitted && isThisCorrect ? 700 : 'normal',
                                color: submitted ? (isThisCorrect ? P.green.shadow : isSelected ? P.red.shadow : 'inherit') : 'inherit',
                              }}>
                                <strong>{opt.label.toUpperCase()}.</strong> {opt.text}
                              </Typography>
                            }
                            sx={{
                              p: 1, mb: 0.5, borderRadius: '10px', bgcolor: bgColor,
                              border: submitted && isThisCorrect ? `1px solid ${P.green.border}` : '1px solid transparent',
                              transition: 'background-color 0.2s',
                            }}
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>

                  {submitted && (
                    <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '12px', bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `1px solid ${isCorrect ? P.green.border : P.red.border}` }}>
                      <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                        <strong>{isCorrect ? 'Correct!' : `Incorrect — the correct answer is (${q.options[q.correct].label.toUpperCase()}).`}</strong>{' '}{q.explanation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: allAnswered ? 'pointer' : 'not-allowed', opacity: allAnswered ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit All Answers ({answeredCount}/6 answered)
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 1 }}>Task C Complete! Score: {score}/6</Typography>
              <Typography sx={{ mb: 2 }}>
                {score === 6 ? 'Perfect score! You have a thorough analytical understanding of positive sandwich feedback principles.'
                  : score >= 5 ? 'Excellent — you understand the core principles very well.'
                  : score >= 4 ? 'Good work! Review the explanations for any questions you found tricky.'
                  : score >= 3 ? 'Reasonable effort — re-read the explanations and consider the distinctions between options.'
                  : 'Keep studying the principles — review each explanation carefully before moving on.'}
              </Typography>

              <Box sx={{ borderTop: `1px solid ${P.green.border}`, pt: 2, mb: 2 }} />

              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: P.green.border }}>{score}</Typography>
                  <Typography variant="caption">Correct</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: P.red.border }}>{6 - score}</Typography>
                  <Typography variant="caption">Incorrect</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: P.purple.border }}>{Math.round((score / 6) * 100)}%</Typography>
                  <Typography variant="caption">Accuracy</Typography>
                </Box>
              </Box>

              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/c1/task/d')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task D
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
