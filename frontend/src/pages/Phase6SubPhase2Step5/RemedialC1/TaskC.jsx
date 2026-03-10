import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  RadioGroup, FormControlLabel, Radio, FormControl, Divider
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  {
    question: 'Why does a spelling error in peer feedback have consequences beyond the error itself?',
    options: [
      'It makes the feedback longer.',
      'It undermines the reviewer\'s credibility and signals inattention, which may cause the recipient to discount even valid critique.',
      'It changes the meaning completely.',
      'It is just a minor issue.',
    ],
    correctIndex: 1,
    explanation:
      'In professional and academic contexts, surface errors signal carelessness — they can undermine the entire feedback, regardless of its analytical quality.',
  },
  {
    question: 'A peer reviewer uses the phrase "kinda weak" in feedback. Beyond informality, what deeper problem does this create?',
    options: [
      'It is too honest.',
      'It provides no actionable guidance and may discourage the writer without offering a path forward.',
      'It uses the wrong tense.',
      'It is too short.',
    ],
    correctIndex: 1,
    explanation:
      'Vague informal critique is doubly problematic — it fails to specify the weakness and offers no constructive direction, undermining the feedback\'s purpose entirely.',
  },
  {
    question: 'When revising peer feedback for tone, which is the most important principle at C1 level?',
    options: [
      'Remove all negative comments.',
      'Use only passive voice.',
      'Ensure every critical observation is balanced, specific, and framed to promote a growth mindset rather than defensiveness.',
      'Make it as formal as possible regardless of clarity.',
    ],
    correctIndex: 2,
    explanation:
      'C1 tone management requires simultaneous precision, empathy, and strategic framing — the goal is to make critique not just palatable but motivating.',
  },
  {
    question: 'A student revises "Your recommendations are bad" to "Your recommendations could be improved." Is this sufficient at C1 level? Why or why not?',
    options: [
      'Yes — it is more polite.',
      'No — whilst more polite, it remains vague and provides no evidence-based, actionable guidance.',
      'Yes — it uses hedging correctly.',
      'No — it should use passive voice.',
    ],
    correctIndex: 1,
    explanation:
      'Politeness alone is insufficient. C1 revision must also add specificity, evidence-linking, and actionable direction.',
  },
  {
    question: 'What is the role of structural revision in peer feedback?',
    options: [
      'To make the feedback longer.',
      'To ensure the feedback follows a logical progression that is easy for the writer to follow and act upon — disorder undermines even strong content.',
      'To add more positive comments.',
      'To use more paragraphs.',
    ],
    correctIndex: 1,
    explanation:
      'Structure in feedback serves the reader — a well-structured review guides the writer through strengths, then areas for growth, then encouragement in a logical, purposeful sequence.',
  },
  {
    question: 'After revising a peer feedback draft three times (spelling → tone → structure), a student finds a minor vocabulary issue. Should they revise again? Why?',
    options: [
      'No — three revisions is enough.',
      'Yes — every revision cycle improves the feedback\'s credibility, empathy, and analytical precision, and accountability to the writer demands the highest possible standard.',
      'No — vocabulary is not important.',
      'Only if the teacher asks.',
    ],
    correctIndex: 1,
    explanation:
      'Professional accountability means striving for the highest possible standard — each revision cycle serves the writer\'s development, not just a marking criterion.',
  },
]

export default function Phase6SP2Step5RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = answers.every(a => a !== null)

  const handleChange = (qIndex, optIndex) => {
    setAnswers(prev => {
      const updated = [...prev]
      updated[qIndex] = optIndex
      return updated
    })
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
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial C1 — Task C</Typography>
        <Typography variant="body1">Quizlet Live — Advanced Peer Feedback Revision (C1 Level)</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
          Instructions: Answer all 6 questions about rigorous peer feedback revision at C1 level. Select the best answer for each question, then submit to see explanations.
        </Typography>
      </Paper>

      {QUESTIONS.map((q, qIndex) => {
        const userAnswer = answers[qIndex]
        const isCorrect = submitted && userAnswer === q.correctIndex
        const isWrong = submitted && userAnswer !== q.correctIndex

        return (
          <Paper
            key={qIndex}
            elevation={2}
            sx={{
              p: 3, mb: 2, borderRadius: 2,
              border: submitted
                ? isCorrect ? '2px solid #27ae60' : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#6c3483' }}>
              Question {qIndex + 1}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{q.question}</Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={userAnswer !== null ? userAnswer.toString() : ''}
                onChange={e => handleChange(qIndex, parseInt(e.target.value))}
              >
                {q.options.map((opt, optIndex) => {
                  let optColor = 'inherit'
                  if (submitted) {
                    if (optIndex === q.correctIndex) optColor = '#1e8449'
                    else if (optIndex === userAnswer) optColor = '#922b21'
                  }

                  return (
                    <FormControlLabel
                      key={optIndex}
                      value={optIndex.toString()}
                      disabled={submitted}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '&.Mui-checked': { color: '#8e44ad' },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            color: optColor,
                            fontWeight: submitted && optIndex === q.correctIndex ? 'bold' : 'normal',
                          }}
                        >
                          {String.fromCharCode(97 + optIndex)}) {opt}
                        </Typography>
                      }
                      sx={{ mb: 0.5 }}
                    />
                  )
                })}
              </RadioGroup>
            </FormControl>

            {submitted && (
              <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {isCorrect ? 'Correct!' : `Incorrect — the correct answer is: ${String.fromCharCode(97 + q.correctIndex)})`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{q.explanation}</Typography>
              </Alert>
            )}
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit All Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2, mt: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task C Complete! Score: {score}/6</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 6
              ? 'Perfect score! You demonstrate deep C1-level understanding of peer feedback revision principles.'
              : score >= 4
              ? 'Good performance! Review the explanations above for any questions you missed.'
              : 'Keep developing your understanding — review the explanations carefully before continuing.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/c1/task/d')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task D
          </Button>
        </Paper>
      )}
    </Box>
  )
}
