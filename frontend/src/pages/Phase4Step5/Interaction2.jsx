import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import ArticleIcon from '@mui/icons-material/Article'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Interaction 2: Grammar Correction
 * Students correct grammar mistakes in spelling-corrected texts
 * Scoring: 1 point per correctly fixed grammar error
 * Max points: A1=2pts, A2=3pts, B1=4pts, B2=5pts, C1=6pts
 */

// Spelling-corrected texts (from Interaction 1 expected answers) with grammar errors
const SPELLING_CORRECTED_TEXTS = {
  A1: "Poster has title Festival. Colours red.",
  A2: "My poster has gatefold and lettering. The title is Global Festival. It use colours.",
  B1: "The poster features a gatefold layout with bold lettering for the slogan. It include images.",
  B2: "This poster employs a gatefold design to provide immersive space with elegant lettering. The slogan are persuasive.",
  C1: "The poster integrates a sophisticated gatefold layout with precise lettering for visual hierarchy. The slogan encapsulate the ethos."
}

// Expected grammar corrections
const EXPECTED_GRAMMAR_CORRECTIONS = {
  A1: "Poster has a title Festival. Colours are red.",
  A2: "My poster has a gatefold and lettering. The title is Global Festival. It uses colours.",
  B1: "The poster features a gatefold layout with bold lettering for the slogan. It includes colorful images.",
  B2: "This poster employs a gatefold design to provide immersive space with elegant lettering. The slogan is persuasive.",
  C1: "The poster integrates a sophisticated gatefold layout with precise lettering for visual hierarchy. The slogan encapsulates the ethos."
}

// Grammar corrections to check (for evaluation)
const GRAMMAR_CORRECTIONS = {
  A1: ["a title", "are red"],
  A2: ["a gatefold", "uses", "uses colours"],
  B1: ["includes", "colorful images", "includes colorful", "includes images"],
  B2: ["slogan is", "is persuasive", "slogan is persuasive"],
  C1: ["encapsulates", "encapsulates the", "encapsulates the ethos"]
}

export default function Phase4Step5Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'main' })
  const [spellingCorrected, setSpellingCorrected] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [studentLevel, setStudentLevel] = useState(null)
  const [loadingLevel, setLoadingLevel] = useState(true)

  useEffect(() => {
    const fetchStudentLevel = async () => {
      try {
        const response = await fetch('/api/phase4/step4/student-level', {
          credentials: 'include'
        })
        const data = await response.json()
        const level = data.level || 'A1'
        setStudentLevel(level)

        // Pre-fill with expected spelling-corrected answer from Interaction 1
        const expectedSpellingCorrected = SPELLING_CORRECTED_TEXTS[level]
        setSpellingCorrected(expectedSpellingCorrected)
        setCorrectedText(expectedSpellingCorrected)
      } catch (error) {
        console.error('Error fetching student level:', error)
        const savedLevel = sessionStorage.getItem('student_cefr_level') || 'A1'
        setStudentLevel(savedLevel)

        const expectedSpellingCorrected = SPELLING_CORRECTED_TEXTS[savedLevel]
        setSpellingCorrected(expectedSpellingCorrected)
        setCorrectedText(expectedSpellingCorrected)
      } finally {
        setLoadingLevel(false)
      }
    }
    fetchStudentLevel()
  }, [])

  const handleSubmit = async () => {
    if (!correctedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please correct the grammar mistakes in the text.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step5/evaluate-grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          correctedText: correctedText.trim()
        })
      })

      const data = await response.json()

      setEvaluation({
        success: true,
        score: data.score || 0,
        level: data.level || 'A1',
        feedback: data.feedback || 'Good work!',
        details: data.details || {}
      })
      setSubmitted(true)

      sessionStorage.setItem('phase4_step5_interaction2_score', data.score || 0)
      sessionStorage.setItem('phase4_step5_grammar_corrected', correctedText.trim())
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation - count grammar corrections
      const correctedLower = correctedText.toLowerCase()
      const grammarCorrections = GRAMMAR_CORRECTIONS[studentLevel]
      const totalErrors = grammarCorrections.length

      // Count how many correct grammar fixes appear in the student's answer
      let correctionsCount = 0
      const foundCorrections = []

      grammarCorrections.forEach(correction => {
        if (correctedLower.includes(correction.toLowerCase())) {
          correctionsCount++
          foundCorrections.push(correction)
        }
      })

      let score = correctionsCount // 1 point per corrected grammar error
      let level = studentLevel
      let feedback = ''

      if (correctionsCount === totalErrors) {
        feedback = `Excellent! You corrected all ${totalErrors} grammar mistakes accurately! You earned ${score} points. Outstanding grammar skills! ✨`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.7)) {
        feedback = `Good work! You corrected ${correctionsCount} out of ${totalErrors} grammar errors. You earned ${score} points. Keep it up! 👏`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.5)) {
        feedback = `Partial corrections made. You fixed ${correctionsCount} out of ${totalErrors} errors and earned ${score} points. Review: "${EXPECTED_GRAMMAR_CORRECTIONS[studentLevel]}"`
      } else {
        feedback = `You corrected ${correctionsCount} out of ${totalErrors} errors. Please review more carefully. Expected: "${EXPECTED_GRAMMAR_CORRECTIONS[studentLevel]}"`
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback,
        details: {
          correctionsCount,
          totalErrors,
          foundCorrections
        }
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step5_interaction2_score', score)
      sessionStorage.setItem('phase4_step5_grammar_corrected', correctedText.trim())
      console.log(`[Phase 4 Step 5 - Interaction 2] Score: ${score}/${totalErrors} | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/interaction/3')
  }

  if (loadingLevel) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3, textAlign: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your level...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#3498db', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 2
        </Typography>
        <Typography variant="body1">
          Grammar Correction Challenge
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Good spelling fixes! Now, from the same faulty texts (with spelling already corrected), focus on grammar mistakes—correct them."
        />
      </Paper>

      {/* Previous Work Display */}
      {spellingCorrected && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e9' }}>
          <Typography variant="subtitle1" color="success.dark" fontWeight="bold" gutterBottom>
            ✓ Your Spelling-Corrected Version
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: '#fff', border: '1px solid #4caf50' }}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: '#000' }}>
              {spellingCorrected}
            </Typography>
          </Paper>
        </Paper>
      )}

      {/* Grammar Focus Display */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <ArticleIcon sx={{ color: '#3498db' }} />
          <Typography variant="h6" color="#3498db" fontWeight="bold">
            Focus: Grammar Errors
          </Typography>
        </Stack>

        <Alert severity="info">
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Hint:
          </Typography>
          <Typography variant="body2">
            Check subject-verb agreement, articles, tense consistency, and verb forms.
          </Typography>
        </Alert>
      </Paper>

      {/* Correction Input */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Your Grammar-Corrected Version
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          placeholder="Fix grammar mistakes (subject-verb agreement, articles, tenses)..."
          value={correctedText}
          onChange={(e) => setCorrectedText(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        {!submitted && (
          <Button
            variant="contained"
            sx={{ backgroundColor: '#3498db' }}
            onClick={handleSubmit}
            disabled={loading || !correctedText.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={24} /> : <ArticleIcon />}
          >
            {loading ? 'Evaluating...' : 'Submit Grammar Corrections'}
          </Button>
        )}
      </Paper>

      {/* Evaluation Results */}
      {evaluation && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'success.lighter',
            border: '2px solid',
            borderColor: 'success.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: 'success.main',
                mr: 2
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="success.dark">
                Grammar Correction Complete!
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                Score: {evaluation.score}/{GRAMMAR_CORRECTIONS[studentLevel].length}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Continue to Coherence & Vocabulary →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
