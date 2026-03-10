import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert,
  LinearProgress, Divider, Collapse
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  {
    id: 1,
    label: 'Sophisticated positive opening',
    instruction: 'Open with a genuine strength. Use words like "demonstrates", "commendable", or "analytical depth".',
    hint: 'e.g. "Your report demonstrates a sophisticated command of formal register and a commendable capacity for self-critical analysis."',
    keyWords: ['demonstrates', 'commendable', 'analytical depth', 'analytical'],
  },
  {
    id: 2,
    label: 'Specific strength with evidence',
    instruction: 'Identify a specific section or feature of their work and explain why it is strong.',
    hint: 'e.g. "The Challenges section, in particular, is notable for its nuanced and balanced treatment of the logistical difficulties encountered."',
    keyWords: ['section', 'notable', 'nuanced', 'balanced', 'particular'],
  },
  {
    id: 3,
    label: 'Second strength with impact on reader/audience',
    instruction: 'Name a second strength and explain its effect on the reader or audience.',
    hint: 'e.g. "The use of passive voice throughout lends the report an appropriate level of objectivity and academic detachment."',
    keyWords: ['lends', 'objectivity', 'detachment', 'reader', 'effect', 'audience', 'academic'],
  },
  {
    id: 4,
    label: 'Nuanced transition',
    instruction: 'Bridge to your constructive suggestions using a sophisticated connector: "Notwithstanding", "Whilst", or "It is worth noting".',
    hint: 'e.g. "Notwithstanding these strengths, the Recommendations section would benefit from greater specificity…"',
    keyWords: ['notwithstanding', 'whilst', 'it is worth noting', 'however', 'nevertheless'],
  },
  {
    id: 5,
    label: 'Constructive suggestion 1 — specific and linked',
    instruction: 'Give a specific improvement suggestion linked to a named section or finding.',
    hint: 'e.g. "…replacing \'improve communication\' with measurable targets such as \'hold weekly briefings\'."',
    keyWords: ['specific', 'recommend', 'suggest', 'such as', 'for instance', 'measurable', 'replacing'],
  },
  {
    id: 6,
    label: 'Constructive suggestion 2 — with rationale',
    instruction: 'Give a second suggestion and explain WHY it would strengthen the work.',
    hint: 'e.g. "…the Successes section would be further strengthened by the inclusion of comparative data from previous events to contextualise the achievements."',
    keyWords: ['strengthen', 'contextualise', 'comparative', 'data', 'inclusion', 'rationale', 'because', 'would'],
  },
  {
    id: 7,
    label: 'Empathetic acknowledgement',
    instruction: 'Acknowledge the writer\'s effort or context with empathy before closing.',
    hint: 'e.g. "I recognise that gathering such longitudinal data is time-intensive, particularly in a context where resources are limited."',
    keyWords: ['recognise', 'acknowledge', 'understand', 'appreciate', 'context', 'effort', 'time'],
  },
  {
    id: 8,
    label: 'Forward-looking positive close',
    instruction: 'End on a positive, forward-looking note. Use "I look forward to" or "I am confident that".',
    hint: 'e.g. "I am confident that with these refinements, the report will serve as an exemplary model for future events."',
    keyWords: ['i look forward', 'i am confident', 'confident that', 'look forward', 'future', 'exemplary'],
  },
]

const MODEL_ANSWER = `Your report demonstrates a sophisticated command of formal register and a commendable capacity for self-critical analysis. The Challenges section, in particular, is notable for its nuanced and balanced treatment of the logistical difficulties encountered. The use of passive voice throughout lends the report an appropriate level of objectivity and academic detachment. Notwithstanding these strengths, the Recommendations section would benefit from greater specificity — for instance, replacing 'improve communication' with measurable targets such as 'hold weekly briefings'. Additionally, the Successes section, whilst comprehensive, would be further strengthened by the inclusion of comparative data from previous events to contextualise the achievements. I recognise that gathering such longitudinal data is time-intensive, particularly in a context where resources are limited. Nevertheless, your analytical rigour and commitment to honest evaluation are clearly evident throughout. I am confident that with these refinements, the report will serve as an exemplary model for future events.`

function scorePromptResponse(text, prompt) {
  if (!text || text.trim().length < 10) return false
  const lower = text.toLowerCase()
  return prompt.keyWords.some(kw => lower.includes(kw.toLowerCase()))
}

export default function Phase6SP2Step3RemC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_c1' })
  const [responses, setResponses] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)
  const [showHints, setShowHints] = useState(Array(8).fill(false))

  const filledCount = responses.filter(r => r.trim().length >= 10).length
  const progress = (filledCount / 8) * 100

  const toggleHint = (i) => {
    setShowHints(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  const handleChange = (i, val) => {
    setResponses(prev => prev.map((v, idx) => idx === i ? val : v))
  }

  const handleSubmit = async () => {
    if (filledCount < 8) return
    let correct = 0
    responses.forEach((resp, i) => {
      if (scorePromptResponse(resp, PROMPTS[i])) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taskb_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'B', correct, 8, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

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
          <EditNoteIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Step 3 · Remedial C1 · Task B
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Analysis Odyssey — Write Sophisticated Positive Sandwich Feedback
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          SubPhase 2: Peer Feedback Discussion
        </Typography>
      </Paper>

      {/* Instructions */}
      <CharacterMessage
        message="You are writing full C1-level peer feedback using the positive sandwich structure. Complete all 8 sections in sequence — each builds on the last to create a cohesive, sophisticated paragraph. Use the hints if you need guidance, but try on your own first!"
        character="teacher"
      />

      {/* Progress */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Progress</Typography>
          <Typography variant="body2" fontWeight="bold" color="#6c3483">
            {filledCount}/8 sections completed
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

      {/* Prompt Sections */}
      {PROMPTS.map((prompt, i) => (
        <Paper key={prompt.id} elevation={2} sx={{ p: 3, mb: 2.5, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: '#8e44ad',
                  color: 'white',
                  px: 1.5,
                  py: 0.3,
                  borderRadius: 1,
                  fontWeight: 'bold',
                  mr: 1,
                }}
              >
                {prompt.id}/8
              </Typography>
              <Typography
                component="span"
                variant="subtitle2"
                fontWeight="bold"
                color="#6c3483"
              >
                {prompt.label}
              </Typography>
            </Box>
            {!submitted && (
              <Button
                size="small"
                startIcon={<LightbulbIcon />}
                onClick={() => toggleHint(i)}
                sx={{ color: '#8e44ad', fontSize: '0.75rem' }}
              >
                {showHints[i] ? 'Hide hint' : 'Hint'}
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {prompt.instruction}
          </Typography>

          <Collapse in={showHints[i]}>
            <Alert
              severity="info"
              icon={<LightbulbIcon />}
              sx={{ mb: 1.5, bgcolor: '#faf0fe', '& .MuiAlert-icon': { color: '#8e44ad' } }}
            >
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                {prompt.hint}
              </Typography>
            </Alert>
          </Collapse>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={responses[i]}
            onChange={e => handleChange(i, e.target.value)}
            disabled={submitted}
            placeholder="Write your sentence(s) here…"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#8e44ad' },
              },
            }}
          />

          {submitted && (
            <Alert
              severity={scorePromptResponse(responses[i], prompt) ? 'success' : 'warning'}
              sx={{ mt: 1 }}
            >
              {scorePromptResponse(responses[i], prompt)
                ? 'Good — your response demonstrates the required element.'
                : `Tip: Try to include key language such as: ${prompt.keyWords.slice(0, 3).join(', ')}.`}
            </Alert>
          )}
        </Paper>
      ))}

      {/* Submit / Result */}
      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={filledCount < 8}
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
          Submit All 8 Sections ({filledCount}/8 filled)
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5', borderRadius: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" color="#6c3483" fontWeight="bold">
            Task B Complete! Score: {score}/8
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            {score >= 7
              ? 'Outstanding — your feedback is truly C1-level!'
              : score >= 5
              ? 'Strong work! A few sections could use more sophisticated language.'
              : score >= 3
              ? 'Good effort — review the model answer to see how key phrases are deployed.'
              : 'Keep practising — study the model answer carefully and note the structural flow.'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Button
            onClick={() => setShowModel(v => !v)}
            variant="outlined"
            sx={{ borderColor: '#8e44ad', color: '#6c3483', mb: 2 }}
          >
            {showModel ? 'Hide Model Answer' : 'View Model Answer'}
          </Button>

          <Collapse in={showModel}>
            <Paper
              elevation={0}
              sx={{ p: 2.5, bgcolor: 'white', borderRadius: 2, textAlign: 'left', mb: 2, border: '1px solid #ce93d8' }}
            >
              <Typography variant="subtitle2" fontWeight="bold" color="#6c3483" gutterBottom>
                Model Answer
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.9, fontStyle: 'italic' }}>
                {MODEL_ANSWER}
              </Typography>
            </Paper>
          </Collapse>

          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/3/remedial/c1/task/c')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
              '&:hover': { opacity: 0.9 },
              px: 4,
            }}
          >
            Continue to Task C
          </Button>
        </Paper>
      )}
    </Box>
  )
}
