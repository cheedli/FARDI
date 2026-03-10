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
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 2: Explore - Interaction 1
 * Sushi Spell game + trial executive summary writing
 */

const TARGET_WORDS = ['success', 'challenge', 'feedback', 'improve', 'recommend']

const SUMMARY_TIPS = [
  'Start with the event name and date',
  'Mention overall success (positive or negative)',
  'Include 1-2 main points briefly',
  'Keep it short - 2-3 sentences only'
]

export default function Phase6SP1Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameData, setGameData] = useState(null)
  const [summary, setSummary] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGameComplete = async (data) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: data })
    setGameCompleted(true)
    setGameData(data)
    sessionStorage.setItem('phase6_sp1_step2_interaction1_score', '1')
    try {
      await phase6API.trackGame(2, 1, data, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }
  }

  const handleSubmitSummary = () => {
    if (!summary.trim()) return
    setLoading(true)
    // Store the summary in sessionStorage for later use in Interaction 2
    sessionStorage.setItem('phase6_sp1_step2_trial_summary', summary.trim())
    setSubmitted(true)
    setLoading(false)
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/2/interaction/2')
  }

  const wordCount = summary.split(/\s+/).filter(w => w.length > 0).length

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
          Step 2: Explore - Interaction 1
        </Typography>
        <Typography variant="body1">
          Sushi Spell + Writing a Trial Executive Summary
        </Typography>
      </Paper>

      {/* Character Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="First, play Sushi Spell to activate report vocabulary, then write a short summary paragraph or list of what happened at the festival. Use the game words in your writing — keep it simple and factual (who, what, when, where, how many people)."
        />
      </Paper>

      {/* Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#27ae60', fontWeight: 'bold' }}>
            Step 1: Play Sushi Spell
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Spell these report writing words: <strong>{TARGET_WORDS.join(', ')}</strong>
            </Typography>
          </Alert>
          <SushiSpellGame
            step={2}
            interaction={1}
            targetTime={120}
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />
        </Paper>
      )}

      {/* Writing Section - shown after game */}
      {gameCompleted && !submitted && (
        <>
          {/* Game Complete Banner */}
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Great job! Now let's write a trial executive summary together.
            </Typography>
          </Alert>

          {/* Writing Tips */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0faf4', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#27ae60', fontWeight: 'bold' }}>
              Writing Tips for Your Executive Summary
            </Typography>
            <Stack spacing={1}>
              {SUMMARY_TIPS.map((tip, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 18 }} />
                  <Typography variant="body2">{tip}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Example Words */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="text.secondary">
              Try to use some of these words:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {TARGET_WORDS.map((word, idx) => (
                <Chip
                  key={idx}
                  label={word}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: '#27ae60', color: '#27ae60' }}
                />
              ))}
            </Box>
          </Paper>

          {/* Writing Prompt */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#27ae60', fontWeight: 'bold' }}>
              Step 2: Write Your Trial Executive Summary
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Write 2-3 sentences summarizing the Global Cultures Festival. Think about: What happened? Was it successful? What was the main result?
              </Typography>
            </Alert>

            <Card variant="outlined" sx={{ mb: 2, backgroundColor: '#f9f9f9', borderColor: '#ccc' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Example (you can adapt this):
                </Typography>
                <Typography variant="body2" fontStyle="italic" color="text.secondary">
                  "The Global Cultures Festival was held on [date] and was a positive experience for all students. The event achieved its main goal of celebrating cultural diversity with strong participation. Overall, the impact was very good, though there are lessons to learn for next time."
                </Typography>
              </CardContent>
            </Card>

            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              placeholder="Write your executive summary here (2-3 sentences)..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Words: {wordCount} | Sentences: {summary.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
              </Typography>
              <Typography variant="caption" color={wordCount >= 15 ? 'success.main' : 'warning.main'}>
                {wordCount < 15 ? 'Write at least 15 words' : 'Good length!'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmitSummary}
              disabled={loading || summary.trim().length < 10}
              fullWidth
              size="large"
              sx={{
                backgroundColor: '#27ae60',
                '&:hover': { backgroundColor: '#1e8449' }
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Saving...' : 'Save My Summary'}
            </Button>
          </Paper>
        </>
      )}

      {/* After Submission */}
      {submitted && (
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
              <Typography variant="h6" color="success.dark">
                Trial Summary Saved!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We'll use this in the next activity.
              </Typography>
            </Box>
          </Box>

          <Card variant="outlined" sx={{ mb: 2, borderColor: '#27ae60', borderLeft: '4px solid #27ae60' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Your Trial Executive Summary:
              </Typography>
              <Typography variant="body1" fontStyle="italic">
                "{summary}"
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' }
            }}
          >
            Continue to Interaction 2
          </Button>
        </Paper>
      )}
    </Box>
  )
}
