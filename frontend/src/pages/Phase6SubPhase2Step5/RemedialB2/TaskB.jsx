import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert, TextField, Collapse
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const FAULTY_TEXT =
  'Hey! Your report is ok. The sucesses part is good. The chalenge part needs work. You should fix the grammer. The recomendations are not specific. Do better next time. But good job anyway!'

const MODEL_ANSWER =
  'Your report demonstrates a commendable level of effort and a clear understanding of the event\'s key outcomes. The Successes section is particularly strong, effectively highlighting the main achievements with appropriate use of formal language. The Challenges section, whilst honest in its assessment, would benefit from more specific examples and a brief explanation of how each difficulty was addressed. To improve grammatical accuracy throughout, I suggest reviewing subject-verb agreement and tense consistency, particularly in the Methodology section. The Recommendations section would be significantly strengthened by the inclusion of specific, measurable targets — for example, \'increase volunteer recruitment by 20% for the next event\'. I recognise that producing a thorough post-event report requires considerable time and analytical effort. Nevertheless, the clarity of your overall structure and the honesty of your self-assessment reflect genuine commitment to improvement. I look forward to seeing these refinements in your next draft.'

const PROMPTS = [
  'Formal opening — replace "Hey! Your report is ok" with a specific, formal positive statement.',
  'Spelling-corrected praise for the successes section — correct "sucesses" and add detail.',
  'Formal transition to challenges — correct "chalenge" and use formal language.',
  'Grammar-corrected constructive suggestion — correct "grammer" errors in a full formal sentence.',
  'Specific recommendation fix — replace "recomendations are not specific" with a concrete suggestion.',
  'Empathetic statement — replace "Do better next time" with an empathetic, forward-looking suggestion.',
  'Balanced closing — replace "But good job anyway!" with a genuine, specific positive close.',
  'Professional sign-off sentence — add a final forward-looking statement.',
]

export default function Phase6SP2Step5RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const handleChange = (index, value) => {
    setAnswers(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const wordCount = (text) => text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter(a => wordCount(a) >= 8).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const anyFilled = answers.some(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial B2 — Task B</Typography>
        <Typography variant="body1">Analysis Odyssey — Rewrite a Flawed Peer Feedback Draft (B2 Level)</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#6c3483' }}>Faulty Peer Feedback Draft</Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#4a235a', p: 2, bgcolor: '#ede7f6', borderRadius: 1 }}>
          {FAULTY_TEXT}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          This draft has spelling errors, informal register, vague comments, and no constructive guidance. Rewrite each section using the 8 guided prompts below. Each answer must be at least 8 words.
        </Typography>
      </Paper>

      {PROMPTS.map((prompt, index) => {
        const wc = wordCount(answers[index])
        const isSufficient = submitted && wc >= 8
        const isInsufficient = submitted && wc < 8
        return (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3, mb: 2, borderRadius: 2,
              border: submitted
                ? isSufficient ? '2px solid #27ae60' : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#8e44ad', fontWeight: 'bold', mb: 1 }}>
              Sentence {index + 1}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>{prompt}</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[index]}
              onChange={e => handleChange(index, e.target.value)}
              disabled={submitted}
              placeholder={`Write your revised sentence ${index + 1} here (min. 8 words)...`}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color={submitted && wc < 8 ? 'error' : 'text.secondary'}>
              Words: {wc} {submitted && wc < 8 ? '(minimum 8 words required)' : ''}
            </Typography>
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!anyFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Rewrite
        </Button>
      ) : (
        <Box>
          <Alert severity={score >= 6 ? 'success' : score >= 4 ? 'warning' : 'info'} sx={{ mb: 2 }}>
            You completed {score}/8 sentences with sufficient detail (8+ words each).{' '}
            {score === 8
              ? 'Outstanding — full formal rewrite achieved!'
              : 'Review the model answer below for guidance on incomplete sentences.'}
          </Alert>

          <Button
            variant="outlined"
            startIcon={<LightbulbIcon />}
            onClick={() => setShowModel(prev => !prev)}
            sx={{ mb: 2, borderColor: '#8e44ad', color: '#8e44ad', '&:hover': { bgcolor: '#f9f0ff' } }}
          >
            {showModel ? 'Hide Model Answer' : 'Show Model Answer'}
          </Button>

          <Collapse in={showModel}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f9f0ff', borderRadius: 2, border: '1px solid #d7bde2' }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#6c3483', mb: 1 }}>
                Model Answer
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#4a235a' }}>
                {MODEL_ANSWER}
              </Typography>
            </Paper>
          </Collapse>

          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
            <Typography variant="h5" sx={{ color: '#6c3483' }}>Task B Complete! Score: {score}/8</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 6
                ? 'Excellent rewrite — formal language and constructive structure are clear.'
                : 'Good effort! Study the model answer to strengthen your formal peer feedback writing.'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b2/task/c')}
              size="large"
              sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
            >
              Continue to Task C
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
