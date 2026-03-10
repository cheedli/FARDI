import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 4: Elaborate
 * Interaction 1: Social Media Announcement Writing
 * Write a 4-8 sentence social media post using guided template
 */

const TEMPLATE_GUIDE = [
  {
    step: 1,
    title: 'Calm Opening + Problem',
    instruction: 'Start calmly and state the issue clearly.',
    example: 'Dear festival friends, we have a small technical issue with the stage lighting.'
  },
  {
    step: 2,
    title: 'Solution + Timeline',
    instruction: 'Explain what we are doing and when it will be fixed.',
    example: 'Our team is immediately activating the backup lighting system. We expect everything to be ready in the next 20-30 minutes.'
  },
  {
    step: 3,
    title: 'Reassurance + CTA',
    instruction: 'Reassure and tell people what to do.',
    example: 'The festival will start on time-please stay calm and join us as planned!'
  },
  {
    step: 4,
    title: 'Closing + Appreciation',
    instruction: 'End positively and thank them.',
    example: 'Thank you for your understanding and patience-we can\'t wait to celebrate with you!'
  },
  {
    step: 5,
    title: 'Hashtags',
    instruction: 'Add relevant hashtags (4-8).',
    example: '#GlobalCulturesFestival #FestivalUpdate #WeGotThis'
  }
]

const EXPECTED_EXAMPLES = {
  A2: 'Lighting problem. We use backup. Festival start soon. Thank you. #Festival',
  B1: 'Hello everyone! There is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you for your patience. See you soon! #GlobalFestival #Update',
  B2: 'Dear festival community, a technical issue has temporarily affected the main stage lighting. Our team is actively deploying the backup system and anticipates full restoration within 20-30 minutes. The event schedule remains unchanged-performances and activities will proceed as planned. We sincerely appreciate your understanding and patience during this brief interruption. Thank you for being part of this celebration! #GlobalCulturesFestival #FestivalUpdate #WeAreOnIt',
  C1: 'Immediate update to all attendees: An unforeseen technical malfunction has impacted the main stage lighting just one hour before doors open. Our dedicated response team has already initiated the pre-tested contingency protocol, deploying the full backup lighting array with restoration expected within the next 20-25 minutes. The festival program remains intact, and we remain fully committed to delivering the rich cultural experience you have been anticipating. We sincerely thank you for your patience and understanding during this short disruption-your continued support means everything. See you very soon for an unforgettable celebration of global unity. #GlobalCulturesFestival #LiveUpdate #ContingencyInAction #FestivalContinues'
}

export default function Phase5Step4Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 1, context: 'main' })
  const [announcement, setAnnouncement] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!announcement.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write your social media announcement.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateSocialMedia(announcement.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          vocabulary_used: data.vocabulary_used || [],
          mistakes_detected: data.mistakes_detected || [],
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step4_interaction1_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step4_interaction1_level', data.level || 'A2')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A2',
          feedback: result.error || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback
      const announcementLower = announcement.toLowerCase()
      const wordCount = announcement.split(/\s+/).length
      const sentenceCount = announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const hasBackup = announcementLower.includes('backup')
      const hasPolite = ['thank', 'appreciate', 'please', 'sorry', 'understanding'].some(w => announcementLower.includes(w))
      const hasHashtag = announcement.includes('#')

      let score = 2
      let level = 'A2'
      if (wordCount <= 15 && sentenceCount <= 4) {
        score = 2
        level = 'A2'
      } else if (wordCount <= 40 && sentenceCount <= 6 && hasBackup) {
        score = 3
        level = 'B1'
      } else if (wordCount <= 80 && sentenceCount >= 4 && hasBackup && hasPolite) {
        score = 4
        level = 'B2'
      } else {
        score = 5
        level = 'C1'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback: `Your announcement shows ${level} level understanding.`
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step4_interaction1_score', score.toString())
      sessionStorage.setItem('phase5_step4_interaction1_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/4/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Elaborate - Interaction 1
        </Typography>
        <Typography variant="body1">
          Write an urgent social media announcement
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="First, write an urgent social media announcement to the audience using this guided template with examples. Follow the template to write a 4-8 sentence social media post announcing the issue and solution; adapt examples and check mistakes."
        />
      </Paper>

      {/* Template Guide */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Social Media Announcement Template
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {TEMPLATE_GUIDE.map((item) => (
            <Box key={item.step}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                Step {item.step}: {item.title}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                {item.instruction}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                Example: "{item.example}"
              </Typography>
              {item.step < 5 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Expected Examples */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Expected Response Examples (by level):
        </Typography>
        <Stack spacing={1}>
          {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
            <Box key={level}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {level}:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>
                "{example}"
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Writing Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Your Social Media Announcement
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Write 4-8 sentences. Use the template as a guide. Include hashtags. Check for grammar, spelling, and structure mistakes!
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder="Write your social media announcement here..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {announcement.split(/\s+/).filter(w => w.length > 0).length} |
              Sentences: {announcement.split(/[.!?]+/).filter(s => s.trim().length > 0).length} |
              Hashtags: {(announcement.match(/#\w+/g) || []).length}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !announcement.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Announcement'}
          </Button>
        </Paper>
      )}

      {/* Evaluation Results */}
      {evaluation && submitted && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: evaluation.success ? 'success.lighter' : 'warning.lighter',
            border: '2px solid',
            borderColor: evaluation.success ? 'success.main' : 'warning.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: evaluation.success ? 'success.main' : 'warning.main',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'}>
                {evaluation.success ? 'Announcement Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Vocabulary Terms Used:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.vocabulary_used.map((term, idx) => (
                  <Chip key={idx} label={term} color="success" size="small" />
                ))}
              </Box>
            </Box>
          )}

          {evaluation.mistakes_detected && evaluation.mistakes_detected.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">Mistakes Detected:</Typography>
              {evaluation.mistakes_detected.map((mistake, idx) => (
                <Typography key={idx} variant="body2">• {mistake}</Typography>
              ))}
            </Alert>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
