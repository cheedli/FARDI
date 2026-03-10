import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function Phase3Step2ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const i1 = parseInt(sessionStorage.getItem('phase3_step2_int1_score') || '0')
    const i2 = parseInt(sessionStorage.getItem('phase3_step2_int2_score') || '0')
    const i3 = parseInt(sessionStorage.getItem('phase3_step2_int3_score') || '0')

    try {
      const res = await fetch('/api/phase3/step/2/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 })
      })
      const result = await res.json()
      if (result.success) {
        setRouting(result.data.total)
      } else {
        setRouting({ should_proceed: i3 >= 3, remedial_level: determineLevel(i3) })
      }
    } catch {
      setRouting({ should_proceed: i3 >= 3, remedial_level: determineLevel(i3) })
    } finally {
      setLoading(false)
    }
  }

  const determineLevel = (score) => {
    if (score <= 1) return 'A1'
    if (score <= 2) return 'A2'
    if (score <= 3) return 'B1'
    if (score <= 4) return 'B2'
    return 'C1'
  }

  const handleContinue = () => {
    if (!routing) return
    if (routing.should_proceed) {
      navigate('/phase3/step/3')
    } else {
      const level = (routing.remedial_level || 'a1').toLowerCase()
      navigate(`/phase3/step/2/remedial/${level}/taskA`)
    }
  }

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={60} /></Box>

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 3: Sponsorship & Budgeting</Typography>
        <Typography variant="h5">Step 2: Score Summary</Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, backgroundColor: routing?.should_proceed ? 'success.lighter' : 'info.lighter', border: '2px solid', borderColor: routing?.should_proceed ? 'success.main' : 'info.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: routing?.should_proceed ? 'success.main' : 'info.main', mr: 2 }} />
          <Box>
            <Typography variant="h5" color={routing?.should_proceed ? 'success.dark' : 'info.dark'}>
              {routing?.should_proceed ? 'Great Progress!' : 'Practice Time'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigned Level: <strong>{routing?.remedial_level}</strong>
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {routing?.should_proceed
            ? 'Well done! You are ready to move to the next step.'
            : `Let's strengthen your skills with ${routing?.remedial_level} level practice activities.`}
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {routing?.should_proceed
              ? 'You will proceed to Step 3: Budget Planning.'
              : `You will complete remedial activities at ${routing?.remedial_level} level before moving forward.`}
          </Typography>
        </Alert>

        <Button variant="contained" color={routing?.should_proceed ? 'success' : 'primary'} onClick={handleContinue} size="large" fullWidth sx={{ mt: 3 }}>
          {routing?.should_proceed ? 'Continue to Step 3' : `Continue to ${routing?.remedial_level} Remedial Activities`}
        </Button>
      </Paper>
    </Box>
  )
}
