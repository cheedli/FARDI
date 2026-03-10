import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Chip, Alert,
  Grid, Select, MenuItem, FormControl, FormHelperText
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ForumIcon from '@mui/icons-material/Forum'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['constructive', 'empathy', 'growth mindset', 'balanced', 'actionable', 'nuanced']

const CORRECT_ANSWERS = {
  gap1: 'balanced',
  gap2: 'empathy',
  gap3: 'actionable',
  gap4: 'growth mindset',
}

const DIALOGUE = [
  {
    speaker: 'Peer',
    role: 'peer',
    text: 'Why does feedback need to follow a positive sandwich? Isn\'t it just sugar-coating?',
    gap: null,
  },
  {
    speaker: 'You',
    role: 'you',
    textBefore: 'Not at all — ',
    gap: 'gap1',
    textAfter: ' feedback that opens and closes positively is more likely to be received well and acted upon.',
  },
  {
    speaker: 'Peer',
    role: 'peer',
    text: 'But what if the work is genuinely poor? Don\'t you just say so?',
    gap: null,
  },
  {
    speaker: 'You',
    role: 'you',
    textBefore: 'With ',
    gap: 'gap2',
    textAfter: null,
    textMiddle: ' you can be honest AND kind. The goal is ',
    gap2: 'gap3',
    textEnd: ' suggestions that drive a ',
    gap3: 'gap4',
    textFinal: ' rather than discouragement.',
    multiGap: true,
  },
]

export default function Phase6SP2Step3RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({ gap1: '', gap2: '', gap3: '', gap4: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [usedWords, setUsedWords] = useState([])

  const handleSelect = (gapKey, value) => {
    if (submitted) return
    const prev = answers[gapKey]
    const newUsed = usedWords.filter(w => w !== prev)
    if (value) newUsed.push(value)
    setUsedWords(newUsed)
    setAnswers(prev => ({ ...prev, [gapKey]: value }))
  }

  const allFilled = Object.values(answers).every(v => v !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    let correct = 0
    Object.keys(CORRECT_ANSWERS).forEach(key => {
      if (answers[key] === CORRECT_ANSWERS[key]) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'A', correct, 4, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  const GapSelect = ({ gapKey }) => {
    const isCorrect = submitted && answers[gapKey] === CORRECT_ANSWERS[gapKey]
    const isWrong = submitted && answers[gapKey] !== CORRECT_ANSWERS[gapKey]
    return (
      <FormControl
        size="small"
        sx={{ minWidth: 160, mx: 0.5, verticalAlign: 'middle' }}
      >
        <Select
          value={answers[gapKey]}
          onChange={e => handleSelect(gapKey, e.target.value)}
          disabled={submitted}
          displayEmpty
          sx={{
            fontSize: '0.9rem',
            fontStyle: answers[gapKey] ? 'normal' : 'italic',
            bgcolor: isCorrect ? '#e8f8f0' : isWrong ? '#fdecea' : '#f3e5f5',
            borderRadius: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isCorrect ? '#27ae60' : isWrong ? '#e74c3c' : '#8e44ad',
              borderWidth: 2,
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>choose...</em>
          </MenuItem>
          {WORD_BANK.map(word => (
            <MenuItem
              key={word}
              value={word}
              disabled={usedWords.includes(word) && answers[gapKey] !== word}
            >
              {word}
            </MenuItem>
          ))}
        </Select>
        {submitted && (
          <FormHelperText sx={{ color: isCorrect ? '#27ae60' : '#e74c3c', fontSize: '0.7rem' }}>
            {isCorrect ? '✓ Correct' : `✗ → ${CORRECT_ANSWERS[gapKey]}`}
          </FormHelperText>
        )}
      </FormControl>
    )
  }

  const DialogueLine = ({ turn }) => {
    const isPeer = turn.role === 'peer'
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isPeer ? 'flex-start' : 'flex-end',
          mb: 2.5,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            maxWidth: '75%',
            p: 2,
            borderRadius: 3,
            bgcolor: isPeer ? '#f5f5f5' : '#f3e5f5',
            borderLeft: isPeer ? '4px solid #9e9e9e' : 'none',
            borderRight: isPeer ? 'none' : '4px solid #8e44ad',
          }}
        >
          <Typography
            variant="caption"
            fontWeight="bold"
            color={isPeer ? 'text.secondary' : '#6c3483'}
            sx={{ display: 'block', mb: 0.5 }}
          >
            {turn.speaker}
          </Typography>
          {turn.gap === null ? (
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {turn.text}
            </Typography>
          ) : turn.multiGap ? (
            <Typography variant="body1" component="span" sx={{ lineHeight: 2.2 }}>
              {turn.textBefore}
              <GapSelect gapKey={turn.gap} />
              {turn.textMiddle}
              <GapSelect gapKey={turn.gap2} />
              {turn.textEnd}
              <GapSelect gapKey={turn.gap3} />
              {turn.textFinal}
            </Typography>
          ) : (
            <Typography variant="body1" component="span" sx={{ lineHeight: 2.2 }}>
              {turn.textBefore}
              <GapSelect gapKey={turn.gap} />
              {turn.textAfter}
            </Typography>
          )}
        </Paper>
      </Box>
    )
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
          <ForumIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Step 3 · Remedial C1 · Task A
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Debate Simulation — Defend the Positive Sandwich
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          SubPhase 2: Peer Feedback Discussion
        </Typography>
      </Paper>

      {/* Instructions */}
      <CharacterMessage
        message="You're in a debate about the positive sandwich feedback structure. Fill in the gaps in YOUR lines using the word bank. Each word can only be used once — choose carefully to make your argument as persuasive as possible!"
        character="teacher"
      />

      {/* Word Bank */}
      <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: '#faf0fe' }}>
        <Typography variant="subtitle2" fontWeight="bold" color="#6c3483" gutterBottom>
          Word Bank
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {WORD_BANK.map(word => (
            <Chip
              key={word}
              label={word}
              variant={usedWords.includes(word) ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#8e44ad',
                color: usedWords.includes(word) ? 'white' : '#6c3483',
                bgcolor: usedWords.includes(word) ? '#8e44ad' : 'transparent',
                fontWeight: 'bold',
                textDecoration: usedWords.includes(word) ? 'line-through' : 'none',
                opacity: usedWords.includes(word) ? 0.6 : 1,
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Dialogue */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#6c3483" gutterBottom>
          Debate Dialogue
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select a word from the word bank for each gap in your lines (shown in purple).
        </Typography>
        {DIALOGUE.map((turn, i) => (
          <DialogueLine key={i} turn={turn} />
        ))}
      </Paper>

      {/* Submit / Result */}
      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
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
          Submit Answers
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5', borderRadius: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" color="#6c3483" fontWeight="bold">
            Task A Complete! Score: {score}/4
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            {score === 4
              ? 'Perfect! You used every term precisely in context.'
              : score >= 3
              ? 'Excellent — you grasp the core principles of effective peer feedback.'
              : score >= 2
              ? 'Good effort! Review the word meanings and try to match them to context clues.'
              : 'Keep practising — re-read the dialogue and consider what each gap is describing.'}
          </Typography>

          {/* Answer Review */}
          <Box sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
            {Object.entries(CORRECT_ANSWERS).map(([key, correct], i) => (
              <Alert
                key={key}
                severity={answers[key] === correct ? 'success' : 'error'}
                sx={{ mb: 1 }}
                icon={answers[key] === correct ? <CheckCircleIcon /> : undefined}
              >
                <strong>Gap {i + 1}:</strong> {answers[key] === correct
                  ? `"${correct}" — correct!`
                  : `You chose "${answers[key]}" → correct answer: "${correct}"`}
              </Alert>
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/3/remedial/c1/task/b')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
              '&:hover': { opacity: 0.9 },
              px: 4,
            }}
          >
            Continue to Task B
          </Button>
        </Paper>
      )}
    </Box>
  )
}
