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
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3: Explain
 * Interaction 1: Watch video about balanced reporting, explain the purpose of a post-event report
 */

const PURPOSE_KEYWORDS = ['purpose', 'inform', 'improve', 'future', 'learn', 'record', 'decision', 'evaluate', 'reflect', 'review', 'share', 'communicate']

function scorePurposeResponse(text) {
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
  const matchedKeywords = PURPOSE_KEYWORDS.filter(k => lower.includes(k))
  const hasEnoughWords = wordCount >= 20
  const hasMultipleKeywords = matchedKeywords.length >= 2
  const attempted = wordCount >= 5

  if (!attempted) return 0
  if (hasEnoughWords && hasMultipleKeywords) return 1
  if (attempted) return 1
  return 0
}

export default function Phase6SP1Step3Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 1, context: 'main' })
  const [videoWatched, setVideoWatched] = useState(false)
  const [response, setResponse] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleVideoReady = () => {
    setVideoWatched(true)
  }

  const handleSubmit = async () => {
    if (!response.trim()) {
      setEvaluation({
        success: false,
        feedback: 'Please write your response before submitting.'
      })
      return
    }

    setLoading(true)

    try {
      const score = scorePurposeResponse(response.trim())
      const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
      const matchedKeywords = PURPOSE_KEYWORDS.filter(k => response.toLowerCase().includes(k))

      let feedback = ''
      if (wordCount < 10) {
        feedback = 'Good start! Try to write 2-3 full sentences explaining the purpose.'
      } else if (matchedKeywords.length === 0) {
        feedback = 'You\'ve written something, but try to include words like "purpose", "improve", "future events", or "decision-making" in your answer.'
      } else if (matchedKeywords.length === 1) {
        feedback = `Nice! You mentioned "${matchedKeywords[0]}". Can you also explain WHO reads the report and WHY it is written?`
      } else {
        feedback = `Excellent! You mentioned: ${matchedKeywords.slice(0, 3).join(', ')}. You clearly understand the purpose of a post-event report.`
      }

      setEvaluation({
        success: true,
        score,
        feedback,
        matchedKeywords
      })
      setSubmitted(true)

      sessionStorage.setItem('phase6_sp1_step3_interaction1_score', score.toString())
    } catch (error) {
      console.error('Evaluation error:', error)
      const score = scorePurposeResponse(response.trim())
      setEvaluation({
        success: true,
        score,
        feedback: 'Thank you for your response! Move on to the next interaction.',
        matchedKeywords: []
      })
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp1_step3_interaction1_score', score.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/3/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection &amp; Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 6.1 - Step 3: Explain - Interaction 1
        </Typography>
        <Typography variant="body1">
          Watch the video and explain the purpose of a post-event report
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Watch this short video about writing balanced reports, then tell me: What is the main purpose of a post-event report? Think carefully — WHO reads it and WHY is it written?"
        />
      </Paper>

      {/* Video Section */}
      {!videoWatched && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VideoLibraryIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
            <Typography variant="h6" color="success.dark" fontWeight="bold">
              Step 1: Watch the Video
            </Typography>
          </Box>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Watch this video about balanced reporting. While watching, think about:
              the <strong>purpose</strong> of a post-event report, why <strong>balance</strong> matters,
              and what the report helps readers <strong>decide</strong> or <strong>improve</strong>.
            </Typography>
          </Alert>
          <Card variant="outlined" sx={{ borderColor: '#27ae60', mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.dark">
                Balanced Reporting in Post-Event Reports
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '56.25%',
                  mb: 2,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#000'
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/RNdYoBSBag8"
                  title="Balanced Reporting in Post-Event Reports"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                If the video does not load, click here:{' '}
                <Typography
                  component="a"
                  href="https://youtu.be/RNdYoBSBag8"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#27ae60', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  https://youtu.be/RNdYoBSBag8
                </Typography>
              </Typography>
            </CardContent>
          </Card>
          <Button
            variant="contained"
            fullWidth
            onClick={handleVideoReady}
            sx={{
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontWeight: 'bold'
            }}
          >
            I've Watched the Video - Continue to Question
          </Button>
        </Paper>
      )}

      {/* Writing Task */}
      {videoWatched && !submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
            Step 2: Explain the Purpose
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom fontWeight="bold">
              Question: What is the main purpose of a post-event report?
            </Typography>
            <Typography variant="body2">
              Write 2-3 sentences explaining the purpose.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Hint: Think about WHO reads it and WHY it is written. What do they use it for?
            </Typography>
          </Alert>

          {/* Vocabulary Hints */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom color="text.secondary">
              Useful words:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {['purpose', 'inform', 'improve', 'future', 'learn', 'record', 'decision', 'evaluate'].map((word) => (
                <Chip
                  key={word}
                  label={word}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: '#27ae60', color: '#27ae60' }}
                />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            placeholder="In 2-3 sentences, explain the purpose of a post-event report..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !response.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Saving...' : 'Submit Answer'}
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
            backgroundColor: '#f0faf4',
            border: '2px solid #27ae60',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#27ae60', mr: 2 }} />
            <Box>
              <Typography variant="h6" color="success.dark" fontWeight="bold">
                Answer Recorded!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Good effort — you watched the video and explained the purpose.
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.matchedKeywords && evaluation.matchedKeywords.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {evaluation.matchedKeywords.map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  size="small"
                  sx={{ backgroundColor: '#27ae60', color: 'white' }}
                />
              ))}
            </Stack>
          )}

          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{
              mt: 1,
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontWeight: 'bold'
            }}
          >
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
