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
  Stack,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Interaction 1: Spelling Correction
 * Students correct spelling mistakes in faulty poster descriptions
 * Scoring: 1 point per correctly fixed spelling error
 * Max points: A1=4pts, A2=5pts, B1=5pts, B2=5pts, C1=7pts
 */

// Faulty texts with spelling errors (level-adapted)
const FAULTY_TEXTS = {
  A1: "Poster hav titel Festval. Colurs red.",
  A2: "My poster has gatfold and letering. The titel is Globel Festivel.",
  B1: "The poster featurs a gateforld layot with bold letering for the slogon.",
  B2: "This poster emploies a gatefold desing to provide imersive space with elegent letering.",
  C1: "The poster integrats a sofisticated gatefold layuot with presice letering for visuel hierachy."
}

// Expected corrections
const EXPECTED_CORRECTIONS = {
  A1: "Poster has title Festival. Colours red.",
  A2: "My poster has gatefold and lettering. The title is Global Festival.",
  B1: "The poster features a gatefold layout with bold lettering for the slogan.",
  B2: "This poster employs a gatefold design to provide immersive space with elegant lettering.",
  C1: "The poster integrates a sophisticated gatefold layout with precise lettering for visual hierarchy."
}

// Spelling errors to detect (for display)
const SPELLING_ERRORS = {
  A1: ["hav → has", "titel → title", "Festval → Festival", "Colurs → Colours"],
  A2: ["gatfold → gatefold", "letering → lettering", "titel → title", "Globel → Global", "Festivel → Festival"],
  B1: ["featurs → features", "gateforld → gatefold", "layot → layout", "letering → lettering", "slogon → slogan"],
  B2: ["emploies → employs", "desing → design", "imersive → immersive", "elegent → elegant", "letering → lettering"],
  C1: ["integrats → integrates", "sofisticated → sophisticated", "layuot → layout", "presice → precise", "letering → lettering", "visuel → visual", "hierachy → hierarchy"]
}

// Correct words to check (for evaluation)
const CORRECT_WORDS = {
  A1: ["has", "title", "Festival", "Colours"],
  A2: ["gatefold", "lettering", "title", "Global", "Festival"],
  B1: ["features", "gatefold", "layout", "lettering", "slogan"],
  B2: ["employs", "design", "immersive", "elegant", "lettering"],
  C1: ["integrates", "sophisticated", "layout", "precise", "lettering", "visual", "hierarchy"]
}

export default function Phase4Step5Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 1, context: 'main' })
  const [correctedText, setCorrectedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [studentLevel, setStudentLevel] = useState(null)
  const [loadingLevel, setLoadingLevel] = useState(true)

  // Fetch student's level from Phase 4 Step 4 remedial work
  useEffect(() => {
    const fetchStudentLevel = async () => {
      try {
        const response = await fetch('/api/phase4/step4/student-level', {
          credentials: 'include'
        })
        const data = await response.json()
        setStudentLevel(data.level || 'A1')
      } catch (error) {
        console.error('Error fetching student level:', error)
        // Fallback to sessionStorage or default to A1
        const savedLevel = sessionStorage.getItem('student_cefr_level') || 'A1'
        setStudentLevel(savedLevel)
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
        feedback: 'Please correct the spelling mistakes in the text above.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step5/evaluate-spelling', {
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

      // Store score for final evaluation
      sessionStorage.setItem('phase4_step5_interaction1_score', data.score || 0)
      sessionStorage.setItem('phase4_step5_spelling_corrected', correctedText.trim())
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation - count corrected words
      const correctedLower = correctedText.toLowerCase()
      const correctWords = CORRECT_WORDS[studentLevel]
      const totalErrors = correctWords.length

      // Count how many correct words appear in the student's answer
      let correctionsCount = 0
      const foundWords = []

      correctWords.forEach(word => {
        if (correctedLower.includes(word.toLowerCase())) {
          correctionsCount++
          foundWords.push(word)
        }
      })

      let score = correctionsCount // 1 point per corrected word
      let level = studentLevel
      let feedback = ''

      if (correctionsCount === totalErrors) {
        feedback = `Excellent! You corrected all ${totalErrors} spelling mistakes accurately! You earned ${score} points. Outstanding attention to detail! ✨`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.7)) {
        feedback = `Good work! You corrected ${correctionsCount} out of ${totalErrors} spelling errors. You earned ${score} points. Keep it up! 👏`
      } else if (correctionsCount >= Math.ceil(totalErrors * 0.5)) {
        feedback = `Partial corrections made. You fixed ${correctionsCount} out of ${totalErrors} errors and earned ${score} points. Review: "${EXPECTED_CORRECTIONS[studentLevel]}"`
      } else {
        feedback = `You corrected ${correctionsCount} out of ${totalErrors} errors. Please review more carefully. Expected: "${EXPECTED_CORRECTIONS[studentLevel]}"`
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback,
        details: {
          correctionsCount,
          totalErrors,
          foundWords
        }
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step5_interaction1_score', score)
      sessionStorage.setItem('phase4_step5_spelling_corrected', correctedText.trim())
      console.log(`[Phase 4 Step 5 - Interaction 1] Score: ${score}/${totalErrors} | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateSimilarity = (text1, text2) => {
    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)
    const maxLen = Math.max(words1.length, words2.length)

    let matches = 0
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) matches++
    }

    return matches / maxLen
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/interaction/2')
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
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 1
        </Typography>
        <Typography variant="body1">
          Spelling Correction Challenge
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Here are faulty poster descriptions with mistakes. First, focus only on spelling mistakes—correct them."
        />
      </Paper>

      {/* Faulty Text Display */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#ffebee' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <SpellcheckIcon sx={{ color: '#e74c3c' }} />
          <Typography variant="h6" color="#e74c3c" fontWeight="bold">
            Faulty Text (with spelling errors)
          </Typography>
        </Stack>

        <Paper sx={{ p: 2, backgroundColor: '#fff', borderLeft: '4px solid #e74c3c' }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#000' }}>
            {FAULTY_TEXTS[studentLevel]}
          </Typography>
        </Paper>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Hint:</strong> Look for misspelled words and correct them. Focus only on spelling mistakes.
          </Typography>
        </Alert>
      </Paper>

      {/* Correction Input */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Your Corrected Version (fix spelling only)
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          placeholder="Type your spelling-corrected version here..."
          value={correctedText}
          onChange={(e) => setCorrectedText(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        {!submitted && (
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={loading || !correctedText.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={24} /> : <SpellcheckIcon />}
          >
            {loading ? 'Evaluating...' : 'Submit Spelling Corrections'}
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
                Spelling Correction Complete!
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                Score: {evaluation.score}/{CORRECT_WORDS[studentLevel].length}
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
            Continue to Grammar Correction →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
