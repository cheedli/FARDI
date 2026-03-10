import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent, Grid } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Level C1 - Task A: Strategic Sponsorship Proposal
 * Create a comprehensive sponsorship proposal with financial realism and branding strategy
 */

export default function Phase3Step4RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_c1' })
  const [proposal, setProposal] = useState({
    executiveSummary: '',
    financialAnalysis: '',
    brandingStrategy: '',
    impactMetrics: ''
  })
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const handleProposalChange = (field, value) => {
    setProposal({
      ...proposal,
      [field]: value
    })
  }

  const handleSubmit = () => {
    // Evaluate each section
    let totalScore = 0
    const sectionScores = {}

    // Executive Summary (0-3 points)
    const summaryWords = proposal.executiveSummary.trim().split(/\s+/).length
    const summaryLower = proposal.executiveSummary.toLowerCase()
    if (summaryWords >= 40 && /\b(strategic|partnership|align|opportunity)\b/.test(summaryLower)) {
      sectionScores.executiveSummary = 3
    } else if (summaryWords >= 25) {
      sectionScores.executiveSummary = 2
    } else if (summaryWords >= 15) {
      sectionScores.executiveSummary = 1
    } else {
      sectionScores.executiveSummary = 0
    }
    totalScore += sectionScores.executiveSummary

    // Financial Analysis (0-3 points)
    const financialWords = proposal.financialAnalysis.trim().split(/\s+/).length
    const financialLower = proposal.financialAnalysis.toLowerCase()
    const hasNumbers = /\b\d+\b/.test(proposal.financialAnalysis)
    if (financialWords >= 40 && hasNumbers && /\b(budget|cost|roi|investment|return)\b/.test(financialLower)) {
      sectionScores.financialAnalysis = 3
    } else if (financialWords >= 25 && hasNumbers) {
      sectionScores.financialAnalysis = 2
    } else if (financialWords >= 15) {
      sectionScores.financialAnalysis = 1
    } else {
      sectionScores.financialAnalysis = 0
    }
    totalScore += sectionScores.financialAnalysis

    // Branding Strategy (0-3 points)
    const brandingWords = proposal.brandingStrategy.trim().split(/\s+/).length
    const brandingLower = proposal.brandingStrategy.toLowerCase()
    if (brandingWords >= 40 && /\b(brand|visibility|exposure|image|reputation|values)\b/.test(brandingLower)) {
      sectionScores.brandingStrategy = 3
    } else if (brandingWords >= 25) {
      sectionScores.brandingStrategy = 2
    } else if (brandingWords >= 15) {
      sectionScores.brandingStrategy = 1
    } else {
      sectionScores.brandingStrategy = 0
    }
    totalScore += sectionScores.brandingStrategy

    // Impact Metrics (0-3 points)
    const metricsWords = proposal.impactMetrics.trim().split(/\s+/).length
    const metricsLower = proposal.impactMetrics.toLowerCase()
    const hasMetrics = /\b(attendees|reach|impressions|engagement|students)\b/.test(metricsLower)
    if (metricsWords >= 30 && hasMetrics && /\b\d+\b/.test(proposal.impactMetrics)) {
      sectionScores.impactMetrics = 3
    } else if (metricsWords >= 20 && hasMetrics) {
      sectionScores.impactMetrics = 2
    } else if (metricsWords >= 10) {
      sectionScores.impactMetrics = 1
    } else {
      sectionScores.impactMetrics = 0
    }
    totalScore += sectionScores.impactMetrics

    // Generate feedback
    let feedback = ''
    if (totalScore >= 10) {
      feedback = "Outstanding! Your sponsorship proposal demonstrates professional-level strategic thinking, financial realism, and sophisticated branding analysis. This shows C1 mastery of persuasive business communication."
    } else if (totalScore >= 8) {
      feedback = "Very good! Your proposal is comprehensive and well-structured. Consider adding more specific metrics and deeper financial analysis to strengthen it further."
    } else if (totalScore >= 6) {
      feedback = "Good effort! Your proposal covers the key areas. To reach C1 level, add more sophisticated vocabulary, specific numbers, and strategic depth to each section."
    } else {
      feedback = "Your proposal needs more development. Each section should be detailed (20+ words), use professional vocabulary, and include specific examples or data."
    }

    setEvaluation({
      score: totalScore,
      maxScore: 12,
      sectionScores: sectionScores,
      feedback: feedback
    })

    setShowResults(true)

    // Log to backend
    logTaskCompletion(totalScore, 12)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: 0,
          step: 4
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const allSectionsComplete = Object.values(proposal).every(section =>
    section.trim().split(/\s+/).length >= 15
  )

  const passThreshold = 8 // 8/12 to pass

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task A: Strategic Sponsorship Proposal
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Create a comprehensive, professional sponsorship proposal. This should demonstrate strategic thinking, financial realism, and sophisticated branding analysis. Think like a business consultant!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Write a complete sponsorship proposal with four sections.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Each section should be detailed (20-50 words), use professional vocabulary, and include specific examples or data.
        </Typography>
        <Typography variant="body2">
          <strong>Passing score:</strong> Minimum 8/12 points (average 2/3 per section)
        </Typography>
      </Paper>

      {/* Executive Summary */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            1. Executive Summary
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Provide an overview of the partnership opportunity and strategic alignment.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your executive summary here..."
            value={proposal.executiveSummary}
            onChange={(e) => handleProposalChange('executiveSummary', e.target.value)}
            disabled={showResults}
            sx={{
              '& .MuiInputBase-input': {
                color: '#000'
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1
              }
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Words: {proposal.executiveSummary.trim().split(/\s+/).filter(w => w.length > 0).length}
            {showResults && ` | Score: ${evaluation.sectionScores.executiveSummary}/3`}
          </Typography>
        </CardContent>
      </Card>

      {/* Financial Analysis */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            2. Financial Analysis
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Present realistic budget breakdown and demonstrate financial logic.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your financial analysis here..."
            value={proposal.financialAnalysis}
            onChange={(e) => handleProposalChange('financialAnalysis', e.target.value)}
            disabled={showResults}
            sx={{
              '& .MuiInputBase-input': {
                color: '#000'
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1
              }
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Words: {proposal.financialAnalysis.trim().split(/\s+/).filter(w => w.length > 0).length}
            {showResults && ` | Score: ${evaluation.sectionScores.financialAnalysis}/3`}
          </Typography>
        </CardContent>
      </Card>

      {/* Branding Strategy */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            3. Branding Strategy
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Explain how the sponsorship enhances the company's brand and values alignment.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your branding strategy here..."
            value={proposal.brandingStrategy}
            onChange={(e) => handleProposalChange('brandingStrategy', e.target.value)}
            disabled={showResults}
            sx={{
              '& .MuiInputBase-input': {
                color: '#000'
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1
              }
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Words: {proposal.brandingStrategy.trim().split(/\s+/).filter(w => w.length > 0).length}
            {showResults && ` | Score: ${evaluation.sectionScores.brandingStrategy}/3`}
          </Typography>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            4. Impact Metrics & Expected Outcomes
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Define measurable outcomes and impact indicators.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your impact metrics and expected outcomes here..."
            value={proposal.impactMetrics}
            onChange={(e) => handleProposalChange('impactMetrics', e.target.value)}
            disabled={showResults}
            sx={{
              '& .MuiInputBase-input': {
                color: '#000'
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1
              }
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Words: {proposal.impactMetrics.trim().split(/\s+/).filter(w => w.length > 0).length}
            {showResults && ` | Score: ${evaluation.sectionScores.impactMetrics}/3`}
          </Typography>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && evaluation && (
        <Alert
          severity={evaluation.score >= passThreshold ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Task Complete!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Total Score:</strong> {evaluation.score}/{evaluation.maxScore}
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2">
                • Executive Summary: {evaluation.sectionScores.executiveSummary}/3
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                • Financial Analysis: {evaluation.sectionScores.financialAnalysis}/3
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                • Branding Strategy: {evaluation.sectionScores.brandingStrategy}/3
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                • Impact Metrics: {evaluation.sectionScores.impactMetrics}/3
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1">
            {evaluation.feedback}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allSectionsComplete}
          >
            Submit Sponsorship Proposal
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Complete C1 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
