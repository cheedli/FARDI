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
  Chip,
  Stack,
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Interaction 1: Sushi Spell + Caption Writing
 * Play Sushi Spell, then write an Instagram post for the festival
 */

const TARGET_WORDS = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action']

export default function Phase4_2Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [caption, setCaption] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: result })
    console.log('Sushi Spell completed:', result)
    setGameCompleted(true)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!caption.trim()) {
      alert('Please write your Instagram caption.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step2/evaluate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          interaction: 1,
          caption: caption.trim()
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work!',
          details: data.details || {}
        })
        setSubmitted(true)
        sessionStorage.setItem('phase4_2_step2_int1_score', data.score || 1)
        sessionStorage.setItem('phase4_2_step2_int1_caption', caption.trim())
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: data.feedback || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation
      const sentences = caption.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const sentenceCount = sentences.length
      const wordCount = caption.trim().split(/\s+/).length
      const captionLower = caption.toLowerCase()

      // Check for social media elements
      const hasHashtag = /#\w+/.test(caption)
      const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(caption)
      const mentionsEvent = /\b(festival|global cultures|march|event|celebration)\b/i.test(caption)
      const hasCTA = /\b(join|tag|come|save|register|rsvp|don't miss)\b/i.test(caption)
      const hasDetails = /\b(march 8|march 8th|student center|food|music|art|culture)\b/i.test(caption)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Sophisticated, strategic language
      if (sentenceCount >= 5 && wordCount >= 50 &&
          mentionsEvent && hasHashtag && hasCTA &&
          (captionLower.includes('immerse') || captionLower.includes('experience') ||
           captionLower.includes('celebrate') || captionLower.includes('opportunity') ||
           captionLower.includes('authentic') || captionLower.includes('unique'))) {
        score = 5
        level = 'C1'
        feedback = 'Outstanding! Your caption demonstrates sophisticated social media writing with strategic language, engaging hooks, and professional CTAs. You effectively used descriptive vocabulary to create an immersive experience. This shows C1-level mastery of promotional writing.'
      }
      // B2: 4 points - Engaging with strategic elements
      else if (sentenceCount >= 4 && wordCount >= 35 &&
               mentionsEvent && hasHashtag && hasCTA && hasDetails) {
        score = 4
        level = 'B2'
        feedback = 'Excellent! Your caption is engaging and includes key social media elements: hashtags, call-to-action, and specific details. You created an attractive post that would drive engagement. To reach C1, use more sophisticated vocabulary (e.g., "immerse", "authentic experience", "connect across borders").'
      }
      // B1: 3 points - Clear with hashtags and CTA
      else if (sentenceCount >= 3 && wordCount >= 20 &&
               mentionsEvent && (hasHashtag || hasCTA)) {
        score = 3
        level = 'B1'
        feedback = 'Good! Your caption clearly explains the festival and includes social media elements like hashtags or a call-to-action. To improve, add more specific details (date, location, what to expect) and use both hashtags AND a CTA.'
      }
      // A2: 2 points - Basic caption with festival mention
      else if (sentenceCount >= 2 && mentionsEvent) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You wrote a basic caption about the festival. To improve, add: 1) Specific details (date, location), 2) A hashtag (#GlobalFestival), 3) A call-to-action (Tag a friend!), and 4) Maybe an emoji 😊'
      }
      // A1: 1 point - Very basic attempt
      else if (sentenceCount >= 1 && wordCount >= 5) {
        score = 1
        level = 'A1'
        feedback = 'You made a basic attempt. Try to write more! Include: what the festival is, when it is (March 8), why people should come, a hashtag, and ask people to tag friends.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a longer caption (at least 3 sentences). Tell people about the Global Cultures Festival on March 8, add a hashtag like #GlobalCultures, and ask them to tag friends!'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step2_int1_score', score)
        sessionStorage.setItem('phase4_2_step2_int1_caption', caption.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/2/interaction/2')
  }

  const wordCount = caption.trim().split(/\s+/).filter(w => w.length > 0).length
  const sentenceCount = caption.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 1
        </Typography>
        <Typography variant="body1">
          Play Sushi Spell, then write your Instagram caption
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Play Sushi Spell to activate vocabulary, then write a short caption for an Instagram post about our Global Cultures Festival!"
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Play Sushi Spell to practice spelling social media terms
        </Typography>
        <Typography variant="body2">
          2. Write a 3–6 sentence Instagram caption for the Global Cultures Festival (March 8)
        </Typography>
      </Alert>

      {/* Sushi Spell Game */}
      {!gameCompleted && (
        <Box sx={{ mb: 4 }}>
          <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
        </Box>
      )}

      {/* Game Complete Message */}
      {gameCompleted && !submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography>
            ✓ Sushi Spell completed! You spelled {gameResult?.foundWords?.length || 0} words. Now write your Instagram caption below.
          </Typography>
        </Alert>
      )}

      {/* Caption Writing Area */}
      {gameCompleted && !submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Write Your Instagram Caption
          </Typography>

          <Card elevation={1} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="success.dark">
                Caption Tips:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">• Mention the festival name and date (March 8)</Typography>
                <Typography variant="body2">• Include what people can experience (food, music, art, cultures)</Typography>
                <Typography variant="body2">• Add hashtags like #GlobalCultures #Festival</Typography>
                <Typography variant="body2">• Include a call-to-action (Tag a friend! Save the date!)</Typography>
                <Typography variant="body2">• Use emojis to make it visually appealing 🌍✨🎉</Typography>
              </Stack>
            </CardContent>
          </Card>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Write your Instagram caption here... Remember to include the event details, hashtags, and a call-to-action!"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {wordCount} | Sentences: {sentenceCount}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={/#\w+/.test(caption) ? "✓ Has hashtag" : "Add hashtag"}
                color={/#\w+/.test(caption) ? "success" : "default"}
                size="small"
              />
              <Chip
                label={/[\u{1F300}-\u{1F9FF}]/u.test(caption) ? "✓ Has emoji" : "Add emoji"}
                color={/[\u{1F300}-\u{1F9FF}]/u.test(caption) ? "success" : "default"}
                size="small"
              />
            </Stack>
          </Box>

          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit}
            disabled={loading || !caption.trim()}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Caption'}
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
            border: 2,
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
                {evaluation.success ? 'Caption Submitted!' : 'Try Again'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label={`Level: ${evaluation.level}`} color="primary" sx={{ mr: 1 }} />
                <Chip label={`Score: +${evaluation.score} point${evaluation.score !== 1 ? 's' : ''}`} color="success" />
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {/* Show user's caption */}
          <Card elevation={2} sx={{ mb: 2, backgroundColor: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Your Instagram Caption:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                  {caption}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
          >
            Continue to Next Activity
          </Button>
        </Paper>
      )}
    </Box>
  )
}
