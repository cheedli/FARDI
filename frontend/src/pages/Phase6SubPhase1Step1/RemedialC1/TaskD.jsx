import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Stack, Grid, Chip, Alert, TextField
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task D: Critique Game
 * Critique 6 common weaknesses found in post-event reports and suggest fixes
 */

const WEAKNESSES = [
  {
    id: 1,
    label: 'Only positive content',
    example: '"The festival was amazing. Everyone had fun. Everything went perfectly. The food was great."',
    critique: 'Lacks credibility',
    fix: 'Include balanced evaluation — add specific challenges and how they were addressed.',
    explanation: 'A report that only mentions positives seems unrealistic and reduces stakeholder trust.'
  },
  {
    id: 2,
    label: 'No data or evidence',
    example: '"We think the marketing was successful and people really liked the event."',
    critique: 'Feels subjective',
    fix: 'Add attendance numbers, feedback quotes, survey data (e.g., "200 attendees, 85% satisfaction rate").',
    explanation: 'Evidence-based claims are more credible and show professionalism.'
  },
  {
    id: 3,
    label: 'Vague recommendations',
    example: '"We should do better next time and improve things."',
    critique: 'Not actionable',
    fix: 'Make specific and measurable (e.g., "Install backup lighting system and appoint a dedicated technical coordinator").',
    explanation: 'Actionable recommendations give readers clear steps to follow for future improvement.'
  },
  {
    id: 4,
    label: 'Poor structure',
    example: '"Festival good. Lights failed. Food nice. People happy. Budget OK. Team worked."',
    critique: 'Hard to follow',
    fix: 'Use clear headings and logical flow with connectors (firstly, however, in addition, therefore).',
    explanation: 'Professional reports require organised sections and connective language for clarity.'
  },
  {
    id: 5,
    label: 'Emotional tone',
    example: '"The DJ was super cool and everyone had an absolutely amazing blast!"',
    critique: 'Unprofessional',
    fix: 'Maintain objective, formal style (e.g., "The musical entertainment was well-received by attendees").',
    explanation: 'Formal reports require professional language — avoid colloquialisms and enthusiastic expressions.'
  },
  {
    id: 6,
    label: 'No future orientation',
    example: '"The Global Cultures Festival took place on March 8. There were performances and food stalls. It ended at 8pm."',
    critique: 'Misses value',
    fix: 'End with strategic recommendations that address lessons learned and provide a roadmap for future events.',
    explanation: 'A report without future-oriented recommendations fails its core purpose of enabling continuous improvement.'
  }
]

export default function Phase6SP1Step1RemC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 4, context: 'remedial_c1' })
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userCritiques, setUserCritiques] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [score, setScore] = useState(0)

  const current = WEAKNESSES[currentIdx]

  const handleSubmitCritique = () => {
    const userText = userCritiques[current.id] || ''
    if (userText.trim().length < 10) return
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    if (currentIdx < WEAKNESSES.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      // Calculate score based on critique quality
      let total = 0
      WEAKNESSES.forEach(w => {
        const critique = (userCritiques[w.id] || '').toLowerCase()
        const words = critique.split(/\s+/).filter(x => x.length > 0).length
        if (words >= 15) total += 1 // gave a substantive critique
      })
      setScore(total)
      setAllDone(true)

      sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taskd_score', total.toString())

      try {
        phase6API.logRemedialActivity(1, 'C1', 'D', total, WEAKNESSES.length, 0, 1)
      } catch (e) {
        console.error('Failed to log:', e)
      }
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/2')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white', borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level C1
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task D: Critique Game
        </Typography>
        <Typography variant="body1">
          Critique 6 common weaknesses found in post-event reports and suggest fixes
        </Typography>
      </Paper>

      {/* Instructor */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Time for the Critique Game! You'll see 6 common weaknesses in post-event reports. For each one, critique the problem and explain how to fix it. Show your advanced analytical skills!"
        />
      </Paper>

      {!allDone ? (
        <>
          {/* Progress */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Weakness {currentIdx + 1} of {WEAKNESSES.length}:</strong> {current.label}
            </Typography>
          </Alert>

          {/* Weakness Card */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, border: '2px solid #e74c3c' }}>
            <Stack spacing={2}>
              <Box>
                <Chip label={current.label} color="error" sx={{ mb: 1 }} />
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  Example of poor writing:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, backgroundColor: '#ffebee', fontStyle: 'italic', borderColor: '#e74c3c' }}
                >
                  <Typography variant="body1">{current.example}</Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  Your critique: Why is this weak? How should it be improved?
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={userCritiques[current.id] || ''}
                  onChange={(e) => setUserCritiques({ ...userCritiques, [current.id]: e.target.value })}
                  disabled={showFeedback}
                  placeholder="Explain the weakness and suggest a specific improvement..."
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Words: {(userCritiques[current.id] || '').split(/\s+/).filter(w => w.length > 0).length}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {!showFeedback ? (
            <Button
              variant="contained"
              onClick={handleSubmitCritique}
              disabled={(userCritiques[current.id] || '').trim().length < 10}
              fullWidth
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)' }
              }}
            >
              Submit Critique
            </Button>
          ) : (
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#e8f8f0' }}>
              <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
                Model Answer
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                Critique: {current.critique}
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                Fix:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#f0faf4', borderColor: '#27ae60' }}>
                <Typography variant="body1">{current.fix}</Typography>
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Explanation:</strong> {current.explanation}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNext}
                size="large"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
                }}
              >
                {currentIdx < WEAKNESSES.length - 1 ? `Next Weakness (${currentIdx + 2}/${WEAKNESSES.length})` : 'See Results'}
              </Button>
            </Paper>
          )}
        </>
      ) : (
        /* Results */
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom fontWeight="bold">
            Task D Complete!
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Score: {score} / {WEAKNESSES.length}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 5
              ? 'Outstanding! Your analytical skills are excellent.'
              : score >= 3
              ? 'Good work! You identified most weaknesses effectively.'
              : 'Keep practising your critical analysis skills.'}
          </Typography>
          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            sx={{
              mt: 3,
              px: 6,
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
            }}
          >
            Continue to Step 2 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
