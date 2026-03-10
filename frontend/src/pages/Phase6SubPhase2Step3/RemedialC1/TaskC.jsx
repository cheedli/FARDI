import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Radio, RadioGroup,
  FormControlLabel, FormControl, Alert, Divider, LinearProgress
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import QuizIcon from '@mui/icons-material/Quiz'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  {
    id: 1,
    question:
      'Why does opening peer feedback with a genuine strength increase the likelihood the writer will engage with your suggestions?',
    options: [
      { label: 'a', text: 'It makes the feedback longer.' },
      { label: 'b', text: 'It establishes trust and psychological safety, making the recipient more receptive to criticism.' },
      { label: 'c', text: 'It is a grammatical rule.' },
      { label: 'd', text: 'It shows you read their work.' },
    ],
    correct: 1,
    explanation:
      'Psychological safety is key — when recipients feel respected, they are more open to processing and acting on constructive feedback.',
  },
  {
    id: 2,
    question:
      'A student writes: "Your report is okay but it needs a lot of work." What is wrong with this at C1 level?',
    options: [
      { label: 'a', text: 'It is too short.' },
      { label: 'b', text: 'It uses the wrong tense.' },
      { label: 'c', text: 'It is unspecific, unbalanced, and lacks empathy — it opens negatively and offers no actionable guidance.' },
      { label: 'd', text: 'It should use passive voice.' },
    ],
    correct: 2,
    explanation:
      'Effective C1 feedback is specific, balanced, and empathetic. This sentence fails on all three counts.',
  },
  {
    id: 3,
    question:
      'Which sentence best exemplifies the "constructive" element of the positive sandwich?',
    options: [
      { label: 'a', text: '"Your work is good."' },
      { label: 'b', text: '"This section is bad."' },
      { label: 'c', text: '"To strengthen the coherence of your argument, consider using discourse markers such as \'furthermore\' or \'consequently\'."' },
      { label: 'd', text: '"Well done!"' },
    ],
    correct: 2,
    explanation:
      'Constructive feedback is specific and actionable — it tells the writer exactly what to do and why.',
  },
  {
    id: 4,
    question:
      'Why is it important that a closing positive statement in feedback is genuine, not formulaic?',
    options: [
      { label: 'a', text: 'Because it must be longer than the criticism.' },
      { label: 'b', text: 'Because formulaic closings (e.g. "great job!") feel hollow and undermine the credibility of the entire feedback.' },
      { label: 'c', text: 'Because the writer counts the positive sentences.' },
      { label: 'd', text: 'It doesn\'t matter as long as you end positively.' },
    ],
    correct: 1,
    explanation:
      'Authenticity is essential in feedback. Generic praise signals inattention and reduces the impact of even well-crafted constructive suggestions.',
  },
  {
    id: 5,
    question:
      'What does "empathy" mean in the context of peer feedback?',
    options: [
      { label: 'a', text: 'Agreeing with everything the writer did.' },
      { label: 'b', text: 'Feeling sorry for the writer.' },
      { label: 'c', text: 'Considering how the writer might emotionally receive your feedback and adapting your tone accordingly.' },
      { label: 'd', text: 'Writing in a friendly, informal style.' },
    ],
    correct: 2,
    explanation:
      'Empathy in feedback means anticipating the writer\'s emotional response and choosing language that is honest but considerate of their perspective.',
  },
  {
    id: 6,
    question:
      'A peer\'s feedback says: "In light of the limited time you had, the report is remarkably thorough, though the Recommendations section could be developed further with specific targets." What makes this C1-level feedback?',
    options: [
      { label: 'a', text: 'It uses long sentences.' },
      { label: 'b', text: 'It acknowledges context (limited time), is balanced, and gives a specific, evidence-linked suggestion.' },
      { label: 'c', text: 'It uses formal vocabulary only.' },
      { label: 'd', text: 'It follows a strict word count.' },
    ],
    correct: 1,
    explanation:
      'This response demonstrates contextual awareness, balance, and specificity — the hallmarks of C1-level analytical peer feedback.',
  },
]

export default function Phase6SP2Step3RemC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 3, context: 'remedial_c1' })
  const [selected, setSelected] = useState(Array(6).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return
    setSelected(prev => prev.map((v, i) => i === qIndex ? optionIndex : v))
  }

  const allAnswered = selected.every(v => v !== null)
  const answeredCount = selected.filter(v => v !== null).length

  const handleSubmit = async () => {
    if (!allAnswered) return
    let correct = 0
    selected.forEach((sel, i) => {
      if (sel === QUESTIONS[i].correct) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'C', correct, 6, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  const progress = (answeredCount / 6) * 100

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <QuizIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Step 3 · Remedial C1 · Task C
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Quizlet Live — Why Does the Positive Sandwich Work?
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          SubPhase 2: Peer Feedback Discussion
        </Typography>
      </Paper>

      {/* Instructions */}
      <CharacterMessage
        message="Six analytical questions about the principles behind the positive sandwich feedback structure. Read each question carefully — at C1 level, the differences between options can be subtle. Select the best answer for each question, then submit all at once."
        character="teacher"
      />

      {/* Progress */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Questions answered</Typography>
          <Typography variant="body2" fontWeight="bold" color="#6c3483">
            {answeredCount}/6
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#f3e5f5',
            '& .MuiLinearProgress-bar': { bgcolor: '#8e44ad' },
          }}
        />
      </Paper>

      {/* Questions */}
      {QUESTIONS.map((q, qIndex) => {
        const userAnswer = selected[qIndex]
        const isCorrect = submitted && userAnswer === q.correct
        const isWrong = submitted && userAnswer !== q.correct

        return (
          <Paper
            key={q.id}
            elevation={2}
            sx={{
              p: 3,
              mb: 2.5,
              borderRadius: 2,
              border: submitted
                ? isCorrect
                  ? '2px solid #27ae60'
                  : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box
                sx={{
                  bgcolor: submitted
                    ? isCorrect ? '#27ae60' : '#e74c3c'
                    : '#8e44ad',
                  color: 'white',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                {submitted
                  ? isCorrect
                    ? <CheckCircleIcon sx={{ fontSize: 18 }} />
                    : <CancelIcon sx={{ fontSize: 18 }} />
                  : q.id}
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#4a148c">
                Question {q.id}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              {q.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={userAnswer ?? ''}>
                {q.options.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex
                  const isThisCorrect = optIndex === q.correct
                  let bgColor = 'transparent'
                  if (submitted) {
                    if (isThisCorrect) bgColor = '#e8f8f0'
                    else if (isSelected && !isThisCorrect) bgColor = '#fdecea'
                  } else if (isSelected) {
                    bgColor = '#f3e5f5'
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
                          sx={{
                            color: '#8e44ad',
                            '&.Mui-checked': { color: '#6c3483' },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: submitted && isThisCorrect ? 'bold' : 'normal',
                            color: submitted
                              ? isThisCorrect
                                ? '#1b5e20'
                                : isSelected
                                ? '#b71c1c'
                                : 'text.primary'
                              : 'text.primary',
                          }}
                        >
                          <strong>{opt.label.toUpperCase()}.</strong> {opt.text}
                        </Typography>
                      }
                      sx={{
                        p: 1,
                        mb: 0.5,
                        borderRadius: 1,
                        bgcolor: bgColor,
                        border: submitted && isThisCorrect ? '1px solid #27ae60' : '1px solid transparent',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: submitted ? bgColor : '#f3e5f5' },
                      }}
                    />
                  )
                })}
              </RadioGroup>
            </FormControl>

            {submitted && (
              <Alert
                severity={isCorrect ? 'success' : 'error'}
                sx={{ mt: 1.5 }}
              >
                <Typography variant="body2">
                  <strong>{isCorrect ? 'Correct!' : `Incorrect — the correct answer is (${q.options[q.correct].label.toUpperCase()}).`}</strong>{' '}
                  {q.explanation}
                </Typography>
              </Alert>
            )}
          </Paper>
        )
      })}

      {/* Submit / Result */}
      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
            '&:hover': { opacity: 0.9 },
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Submit All Answers ({answeredCount}/6 answered)
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5', borderRadius: 2, mt: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" color="#6c3483" fontWeight="bold">
            Task C Complete! Score: {score}/6
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            {score === 6
              ? 'Perfect score! You have a thorough analytical understanding of positive sandwich feedback principles.'
              : score >= 5
              ? 'Excellent — you understand the core principles very well.'
              : score >= 4
              ? 'Good work! Review the explanations for any questions you found tricky.'
              : score >= 3
              ? 'Reasonable effort — re-read the explanations and consider the distinctions between options.'
              : 'Keep studying the principles — review each explanation carefully before moving on.'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="#27ae60">
                {score}
              </Typography>
              <Typography variant="caption" color="text.secondary">Correct</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="#e74c3c">
                {6 - score}
              </Typography>
              <Typography variant="caption" color="text.secondary">Incorrect</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="#8e44ad">
                {Math.round((score / 6) * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">Accuracy</Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/3/remedial/c1/task/d')}
            size="large"
            sx={{
              mt: 3,
              background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
              '&:hover': { opacity: 0.9 },
              px: 4,
            }}
          >
            Continue to Task D
          </Button>
        </Paper>
      )}
    </Box>
  )
}
