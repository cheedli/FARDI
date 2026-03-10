import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CampaignIcon from '@mui/icons-material/Campaign'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Interaction 2: Sponsor Pitch
 * Students write a persuasive sponsor pitch for the Global Cultures Festival
 */

const SPONSOR_PROFILES = [
  {
    id: 'tech',
    name: 'TechNova Solutions',
    type: 'Technology Company',
    values: 'Innovation, Diversity, Youth Empowerment',
    icon: '💻'
  },
  {
    id: 'culture',
    name: 'Cultural Heritage Foundation',
    type: 'Non-Profit Organization',
    values: 'Cultural Preservation, Education, Community',
    icon: '🎭'
  },
  {
    id: 'food',
    name: 'Global Tastes Restaurant Chain',
    type: 'Food & Beverage',
    values: 'Diversity, International Cuisine, Community Engagement',
    icon: '🍽️'
  }
]

const KEY_POINTS = [
  'What is the Global Cultures Festival?',
  'Why do you need funding?',
  'What will the sponsor gain? (visibility, brand image, values alignment)'
]

export default function Phase3Step4Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 2, context: 'main' })
  const [selectedSponsor, setSelectedSponsor] = useState(null)
  const [pitch, setPitch] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSponsorSelect = (sponsorId) => {
    if (!submitted) {
      setSelectedSponsor(sponsorId)
      setPitch('')
      setEvaluation(null)
    }
  }

  const handleSubmit = async () => {
    if (!pitch.trim()) {
      alert('Please write your sponsor pitch.')
      return
    }

    if (!selectedSponsor) {
      alert('Please select a sponsor company.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase3/step4/evaluate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pitch: pitch.trim(),
          sponsor: selectedSponsor
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work on your pitch!',
          details: data.details || {}
        })
        setSubmitted(true)

        // Store score
        sessionStorage.setItem('phase3_step4_interaction2_score', data.score || 1)
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

      // Fallback evaluation based on CEFR criteria
      const sentences = pitch.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const sentenceCount = sentences.length
      const wordCount = pitch.trim().split(/\s+/).length
      const pitchLower = pitch.toLowerCase()

      // Check for key elements
      const mentionsFestival = /\b(festival|event|global cultures|cultural)\b/i.test(pitch)
      const mentionsFunding = /\b(need|funding|support|sponsor|money|cost|expense|budget)\b/i.test(pitch)
      const mentionsBenefits = /\b(visibility|image|brand|logo|poster|banner|gain|benefit|exposure|promotion)\b/i.test(pitch)
      const mentionsValues = /\b(values|diversity|culture|community|social|impact|mission)\b/i.test(pitch)

      // Check for persuasive language
      const hasConnectors = /\b(because|so|since|therefore|due to|as|in order to)\b/i.test(pitch)
      const hasComparison = /\b(unlike|compared to|different|unique|special|exclusive)\b/i.test(pitch)
      const hasEmphasis = /\b(will|would|can|could|excellent|perfect|ideal|great|amazing)\b/i.test(pitch)
      const hasCallToAction = /\b(please|join|support|partner|collaborate|consider|invite)\b/i.test(pitch)

      // Advanced indicators
      const hasProfessionalTone = /\b(align|strategic|partnership|opportunity|mutually|beneficial|enhance|elevate)\b/i.test(pitch)
      const hasAdvancedVocab = /\b(encapsulate|resonate|amplify|cultivate|foster|demonstrate|embody|showcase)\b/i.test(pitch)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Professional, convincing pitch with advanced justification
      if (sentenceCount >= 5 && wordCount >= 60 &&
          mentionsFestival && mentionsFunding && mentionsBenefits && mentionsValues &&
          hasConnectors && hasProfessionalTone &&
          (hasAdvancedVocab || hasComparison)) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your sponsor pitch is professional and highly persuasive. You effectively aligned the sponsor\'s values with the festival\'s mission, demonstrated clear benefits, and used sophisticated language to create a compelling business case. This pitch shows strategic thinking and advanced communication skills.'
      }
      // B2: 4 points - Persuasive pitch with comparison or emphasis
      else if (sentenceCount >= 4 && wordCount >= 40 &&
               mentionsFestival && mentionsFunding && mentionsBenefits &&
               hasConnectors && hasEmphasis &&
               (hasComparison || mentionsValues)) {
        score = 4
        level = 'B2'
        feedback = 'Very good! Your pitch is persuasive and well-structured. You clearly explained the festival, justified the funding need, and highlighted sponsor benefits with good use of connectors and emphasis. Consider adding more strategic language about brand alignment and partnership value.'
      }
      // B1: 3 points - Clear pitch with reason and benefit
      else if (sentenceCount >= 3 && wordCount >= 25 &&
               mentionsFestival && mentionsFunding && mentionsBenefits &&
               hasConnectors) {
        score = 3
        level = 'B1'
        feedback = 'Good! Your pitch clearly explains what the festival is, why funding is needed, and what the sponsor will gain. You used connectors effectively. To improve, add more details about how the sponsorship benefits the company\'s brand and values.'
      }
      // A2: 2 points - Short paragraph using because or so
      else if (sentenceCount >= 2 && mentionsFestival &&
               (mentionsFunding || mentionsBenefits) &&
               hasConnectors) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You explained the basic need for sponsorship using connectors. Try to expand your pitch by adding more details about the festival, specific funding needs, and clear benefits for the sponsor (visibility, brand image).'
      }
      // A1: 1 point - 2-3 simple sentences
      else if (sentenceCount >= 1 && (mentionsFestival || mentionsFunding)) {
        score = 1
        level = 'A1'
        feedback = 'You made a basic attempt at a sponsor pitch. Try to write more sentences explaining: 1) What is the festival? 2) Why do we need money? 3) What does the sponsor get? Use words like "because" or "so" to connect your ideas.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a sponsor pitch. Explain what the Global Cultures Festival is, why you need funding, and what the sponsor will gain (like visibility on posters or alignment with cultural values).'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase3_step4_interaction2_score', score)
        console.log(`[Phase 3 Step 4 - Interaction 2] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // Store scores for ScoreCalculation page
    const int1Score = parseInt(sessionStorage.getItem('phase3_step4_interaction1_score') || '0')
    const int2Score = evaluation?.score || 0
    sessionStorage.setItem('phase3_step4_interaction2_score', int2Score.toString())

    // Navigate to ScoreCalculation page for backend-driven routing
    navigate('/phase3/step/4/score')
  }

  const selectedSponsorData = SPONSOR_PROFILES.find(s => s.id === selectedSponsor)
  const wordCount = pitch.trim().split(/\s+/).filter(w => w.length > 0).length
  const sentenceCount = pitch.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Apply - Interaction 2
        </Typography>
        <Typography variant="body1">
          Write a Persuasive Sponsor Pitch
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Great work on your budget! Now let's convince a sponsor to support our festival. Choose a company below and write a persuasive pitch explaining why they should sponsor the Global Cultures Festival. Think about what they value and how the festival aligns with their brand."
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Choose a potential sponsor company below
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. Write a persuasive pitch (4-8 sentences) that includes:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 1 }}>
          <Typography component="li" variant="body2">
            What the Global Cultures Festival is
          </Typography>
          <Typography component="li" variant="body2">
            Why you need funding
          </Typography>
          <Typography component="li" variant="body2">
            What the sponsor will gain (visibility, brand image, values alignment)
          </Typography>
        </Box>
      </Alert>

      {/* Key Points Reference */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          <TipsAndUpdatesIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Key Points to Address:
        </Typography>
        <Stack spacing={1}>
          {KEY_POINTS.map((point, index) => (
            <Chip
              key={index}
              label={point}
              color="warning"
              variant="outlined"
              sx={{ justifyContent: 'flex-start', height: 'auto', py: 1, '& .MuiChip-label': { whiteSpace: 'normal' } }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Sponsor Selection */}
      {!selectedSponsor && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Choose a Potential Sponsor:
          </Typography>
          <Grid container spacing={3}>
            {SPONSOR_PROFILES.map(sponsor => (
              <Grid item xs={12} md={4} key={sponsor.id}>
                <Card
                  elevation={3}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleSponsorSelect(sponsor.id)}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h1">{sponsor.icon}</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom align="center">
                      {sponsor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      {sponsor.type}
                    </Typography>
                    <Typography variant="caption" color="primary" display="block" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Company Values:
                    </Typography>
                    <Typography variant="body2">
                      {sponsor.values}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button variant="contained" color="primary" fullWidth>
                        Select This Sponsor
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Writing Area */}
      {selectedSponsor && !submitted && (
        <Box sx={{ mb: 4 }}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent sx={{ backgroundColor: 'info.lighter' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h2" sx={{ mr: 2 }}>{selectedSponsorData?.icon}</Typography>
                <Box>
                  <Typography variant="h6">Selected Sponsor: {selectedSponsorData?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedSponsorData?.type}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    Values: {selectedSponsorData?.values}
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSelectedSponsor(null)}
              >
                Choose Different Sponsor
              </Button>
            </CardContent>
          </Card>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              <CampaignIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Write Your Sponsor Pitch
            </Typography>

            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Tips for a Strong Pitch:</strong>
              </Typography>
              <Typography variant="body2">
                • Start with what the festival is and who it serves
              </Typography>
              <Typography variant="body2">
                • Explain specific funding needs (refer to your budget)
              </Typography>
              <Typography variant="body2">
                • Connect the sponsor's values to the festival's mission
              </Typography>
              <Typography variant="body2">
                • Describe visibility benefits (logo on posters, banners, social media)
              </Typography>
              <Typography variant="body2">
                • Use persuasive language: because, so, will, can, ideal, perfect, align
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder={`Explain what the festival is, why you need funding, and what the sponsor will gain...`}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Words: {wordCount} | Sentences: {sentenceCount}
              </Typography>
              <Typography variant="caption" color={wordCount >= 25 ? 'success.main' : 'text.secondary'}>
                {wordCount >= 25 ? '✓ Good length' : 'Write at least 25 words'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={loading || !pitch.trim()}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Sponsor Pitch'}
            </Button>
          </Paper>
        </Box>
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
                {evaluation.success ? 'Sponsor Pitch Submitted!' : 'Try Again'}
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

          {/* Show user's pitch */}
          <Card elevation={2} sx={{ mb: 2, backgroundColor: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Your Pitch to {selectedSponsorData?.name}:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                  {pitch}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          {evaluation.details && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Evaluation Details:
              </Typography>
              {evaluation.details.persuasiveness && (
                <Typography variant="body2">
                  Persuasiveness: {evaluation.details.persuasiveness}
                </Typography>
              )}
              {evaluation.details.clarity && (
                <Typography variant="body2">
                  Clarity: {evaluation.details.clarity}
                </Typography>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Complete Step 4
          </Button>
        </Paper>
      )}
    </Box>
  )
}
