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
  IconButton,
  Divider,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InfoIcon from '@mui/icons-material/Info'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Interaction 1: Budget Creation
 * Students create a mini budget for the Global Cultures Festival
 */

const DEFAULT_COST_ITEMS = [
  { id: 1, name: 'Venue Rental', amount: '', description: '' },
  { id: 2, name: 'Sound System', amount: '', description: '' },
  { id: 3, name: 'Promotion', amount: '', description: '' },
  { id: 4, name: 'Logistics', amount: '', description: '' }
]

const DEFAULT_FUNDING_SOURCES = [
  { id: 1, name: 'Sponsor', amount: '', description: '' }
]

export default function Phase3Step4Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'main' })
  const [costItems, setCostItems] = useState(DEFAULT_COST_ITEMS)
  const [fundingSources, setFundingSources] = useState(DEFAULT_FUNDING_SOURCES)
  const [budgetJustification, setBudgetJustification] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAddCostItem = () => {
    const newId = Math.max(...costItems.map(i => i.id), 0) + 1
    setCostItems([...costItems, { id: newId, name: '', amount: '', description: '' }])
  }

  const handleRemoveCostItem = (id) => {
    if (costItems.length > 1) {
      setCostItems(costItems.filter(item => item.id !== id))
    }
  }

  const handleCostItemChange = (id, field, value) => {
    setCostItems(costItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleAddFundingSource = () => {
    const newId = Math.max(...fundingSources.map(i => i.id), 0) + 1
    setFundingSources([...fundingSources, { id: newId, name: '', amount: '', description: '' }])
  }

  const handleRemoveFundingSource = (id) => {
    if (fundingSources.length > 1) {
      setFundingSources(fundingSources.filter(item => item.id !== id))
    }
  }

  const handleFundingSourceChange = (id, field, value) => {
    setFundingSources(fundingSources.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0
      return sum + amount
    }, 0)
  }

  const handleSubmit = async () => {
    // Validation
    const filledCosts = costItems.filter(item => item.name.trim() && item.amount)
    const filledFunding = fundingSources.filter(item => item.name.trim() && item.amount)

    if (filledCosts.length < 1) {
      alert('Please add at least 1 cost item with name and amount.')
      return
    }

    if (filledFunding.length < 1) {
      alert('Please add at least 1 funding source with name and amount.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase3/step4/evaluate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          costItems: filledCosts,
          fundingSources: filledFunding,
          justification: budgetJustification.trim()
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work on your budget!',
          details: data.details || {}
        })
        setSubmitted(true)

        // Store score
        sessionStorage.setItem('phase3_step4_interaction1_score', data.score || 1)
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
      const totalCosts = calculateTotal(filledCosts)
      const totalFunding = calculateTotal(filledFunding)
      const hasJustification = budgetJustification.trim().length > 0
      const justificationWords = budgetJustification.trim().split(/\s+/).length
      const justificationLower = budgetJustification.toLowerCase()

      // Check for key vocabulary
      const hasFinancialVocab = /\b(cost|expense|budget|sponsor|funding|donation|ticket|sales|profit|loss|need|necessary)\b/i.test(budgetJustification)
      const hasConnectors = /\b(because|so|due to|since|therefore|as|in order to)\b/i.test(budgetJustification)
      const hasComparison = /\b(more|less|expensive|cheaper|essential|important|priority|critical)\b/i.test(budgetJustification)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Realistic, coherent budget with financial logic
      if (filledCosts.length >= 4 && filledFunding.length >= 1 &&
        hasJustification && justificationWords >= 40 &&
        hasFinancialVocab && hasConnectors &&
        (justificationLower.includes('balance') || justificationLower.includes('risk') ||
          justificationLower.includes('realistic') || justificationLower.includes('financial logic') ||
          justificationLower.includes('coherent') || justificationLower.includes('strategic'))) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your budget demonstrates sophisticated financial planning with realistic costs, balanced funding sources, and professional justification. You show clear understanding of financial logic and risk management.'
      }
      // B2: 4 points - Well-structured budget with comparison or prioritization
      else if (filledCosts.length >= 4 && filledFunding.length >= 1 &&
        hasJustification && justificationWords >= 25 &&
        hasFinancialVocab && hasConnectors && hasComparison) {
        score = 4
        level = 'B2'
        feedback = 'Very good! Your budget is well-structured with clear categories and priorities. You effectively compared costs and explained funding strategies with good use of financial vocabulary.'
      }
      // B1: 3 points - Budget with clear categories and short justifications
      else if (filledCosts.length >= 3 && filledFunding.length >= 1 &&
        hasJustification && justificationWords >= 15 &&
        hasFinancialVocab) {
        score = 3
        level = 'B1'
        feedback = 'Good! Your budget has clear categories and you provided justifications for your costs. You used appropriate financial vocabulary. Try adding more detail about priorities and funding strategies.'
      }
      // A2: 2 points - Simple budget with prices or explanations
      else if (filledCosts.length >= 2 && filledFunding.length >= 1 &&
        (hasJustification || filledCosts.some(item => item.description))) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You created a simple budget with costs and funding. Try to add more justification explaining why each cost is necessary and how you will manage the budget.'
      }
      // A1: 1 point - List of costs with basic words
      else if (filledCosts.length >= 1 && filledFunding.length >= 1) {
        score = 1
        level = 'A1'
        feedback = 'You created a basic budget list. Try to add more cost items (at least 4) and explain why each cost is important for the festival.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please create a budget with at least 1 cost item and 1 funding source. Include names and amounts for each item.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase3_step4_interaction1_score', score)
        console.log(`[Phase 3 Step 4 - Interaction 1] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/4/interaction/2')
  }

  const totalCosts = calculateTotal(costItems)
  const totalFunding = calculateTotal(fundingSources)
  const balance = totalFunding - totalCosts

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Apply - Interaction 1
        </Typography>
        <Typography variant="body1">
          Create a Mini Budget for the Global Cultures Festival
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now it's time to create your own budget! Think about what the festival needs and how much each item might cost. Then, decide where the money will come from. Don't worry about being perfect—just make realistic estimates and explain your thinking."
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. List at least 4 cost items (e.g., venue, sound, promotion, logistics)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. Add at least 1 funding source (sponsor, ticket sales, donation)
        </Typography>
        <Typography variant="body2">
          3. Write a short justification explaining your budget choices
        </Typography>
      </Alert>

      {/* Cost Items Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountBalanceIcon sx={{ mr: 1, color: 'error.main' }} />
          <Typography variant="h6" color="error.main">
            Cost Items (Expenses)
          </Typography>
        </Box>

        {costItems.map((item, index) => (
          <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cost Item Name"
                    placeholder="e.g., Venue Rental"
                    value={item.name}
                    onChange={(e) => handleCostItemChange(item.id, 'name', e.target.value)}
                    disabled={submitted}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Amount (TND)"
                    placeholder="500"
                    value={item.amount}
                    onChange={(e) => handleCostItemChange(item.id, 'amount', e.target.value)}
                    disabled={submitted}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description (optional)"
                    placeholder="Why needed?"
                    value={item.description}
                    onChange={(e) => handleCostItemChange(item.id, 'description', e.target.value)}
                    disabled={submitted}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  {costItems.length > 1 && !submitted && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveCostItem(item.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        {!submitted && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddCostItem}
            variant="outlined"
            size="small"
          >
            Add Cost Item
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6" color="error.main">
            Total Costs: {totalCosts.toFixed(2)} TND
          </Typography>
        </Box>
      </Paper>

      {/* Funding Sources Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6" color="success.main">
            Funding Sources (Income)
          </Typography>
        </Box>

        {fundingSources.map((item, index) => (
          <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Funding Source Name"
                    placeholder="e.g., Sponsor, Ticket Sales"
                    value={item.name}
                    onChange={(e) => handleFundingSourceChange(item.id, 'name', e.target.value)}
                    disabled={submitted}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Amount (TND)"
                    placeholder="1000"
                    value={item.amount}
                    onChange={(e) => handleFundingSourceChange(item.id, 'amount', e.target.value)}
                    disabled={submitted}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description (optional)"
                    placeholder="Where from?"
                    value={item.description}
                    onChange={(e) => handleFundingSourceChange(item.id, 'description', e.target.value)}
                    disabled={submitted}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  {fundingSources.length > 1 && !submitted && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFundingSource(item.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        {!submitted && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddFundingSource}
            variant="outlined"
            size="small"
          >
            Add Funding Source
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6" color="success.main">
            Total Funding: {totalFunding.toFixed(2)} TND
          </Typography>
        </Box>
      </Paper>

      {/* Budget Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: balance >= 0 ? 'success.lighter' : 'error.lighter' }}>
        <Typography variant="h6" gutterBottom>
          Budget Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2">Total Costs:</Typography>
            <Typography variant="h6" color="error.main">{totalCosts.toFixed(2)} TND</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">Total Funding:</Typography>
            <Typography variant="h6" color="success.main">{totalFunding.toFixed(2)} TND</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">Balance:</Typography>
            <Typography variant="h6" color={balance >= 0 ? 'success.main' : 'error.main'}>
              {balance >= 0 ? '+' : ''}{balance.toFixed(2)} TND
            </Typography>
          </Grid>
        </Grid>
        {balance < 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Your costs exceed your funding. Consider adding more funding sources or reducing costs.
          </Alert>
        )}
      </Paper>

      {/* Justification Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Budget Justification
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Explain why you chose these costs and funding sources. What are your priorities?
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          placeholder="..."
          value={budgetJustification}
          onChange={(e) => setBudgetJustification(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" color="text.secondary">
          Words: {budgetJustification.trim().split(/\s+/).filter(w => w.length > 0).length}
        </Typography>
      </Paper>

      {/* Submit Button */}
      {!submitted && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
            sx={{ px: 6 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Budget'}
          </Button>
        </Box>
      )}

      {/* Evaluation Results */}
      {evaluation && (
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
          <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'} gutterBottom>
            {evaluation.success ? 'Budget Submitted!' : 'Try Again'}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label={`Level: ${evaluation.level}`} color="primary" sx={{ mr: 1 }} />
            <Chip label={`Score: +${evaluation.score} point${evaluation.score !== 1 ? 's' : ''}`} color="success" />
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.details && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Evaluation Details:
              </Typography>
              {evaluation.details.vocabulary && (
                <Typography variant="body2">
                  Vocabulary: {evaluation.details.vocabulary}
                </Typography>
              )}
              {evaluation.details.organization && (
                <Typography variant="body2">
                  Organization: {evaluation.details.organization}
                </Typography>
              )}
            </Box>
          )}

          {submitted && (
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Continue to Sponsor Pitch
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
