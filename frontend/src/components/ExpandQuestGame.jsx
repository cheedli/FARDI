import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Stack, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ParkIcon from '@mui/icons-material/Park'

/**
 * Expand Quest Game Component
 * Expand sentences with connectors to "grow" a virtual tree
 * Longer expansions give taller tree
 */

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}
const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const ExpandQuestGame = ({ prompts = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [userInput, setUserInput] = useState(prompts[0]?.prompt ? `${prompts[0].prompt} ` : '')
  const [completedPrompts, setCompletedPrompts] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [treeHeight, setTreeHeight] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [totalScore, setTotalScore] = useState(0)

  const currentPrompt = prompts[currentPromptIndex]

  const evaluateExpansion = (input, prompt) => {
    const inputLower = input.toLowerCase().trim()

    // Check if user included required connector (because or and)
    const hasConnector = inputLower.includes('because') || inputLower.includes(' and ')

    // Check if sentence is expanded (contains more words than just the prompt)
    const promptWords = prompt.toLowerCase().split(/\s+/).length
    const inputWords = inputLower.split(/\s+/).length
    const isExpanded = inputWords > promptWords

    // Check for logical addition (added meaningful content)
    const addedContent = inputWords - promptWords >= 2 // At least 2 new words

    // Check if includes promotion vocabulary (poster, video, etc.)
    const hasPromotionTerms = /poster|video|slogan|billboard|commercial|eye-catcher|feature|ad/i.test(input)

    return {
      hasConnector,
      isExpanded,
      addedContent,
      hasPromotionTerms,
      isValid: hasConnector && isExpanded && addedContent
    }
  }

  const handleSkip = () => {
    // Skip without points
    const newCompletedPrompts = [...completedPrompts, {
      prompt: currentPrompt.prompt,
      userAnswer: '[Skipped]',
      growth: 0,
      score: 0,
      hasPromotionTerms: false,
      skipped: true
    }]

    setCompletedPrompts(newCompletedPrompts)
    setFeedback('')

    // Move to next or complete
    if (currentPromptIndex + 1 < prompts.length) {
      const nextPrompt = prompts[currentPromptIndex + 1]
      setUserInput(`${nextPrompt.prompt} `)
      setTimeout(() => {
        setCurrentPromptIndex(currentPromptIndex + 1)
      }, 500)
    } else {
      // Game complete
      setUserInput('')
      setTimeout(() => {
        setGameComplete(true)
        if (onComplete) {
          const withPromotionTerms = newCompletedPrompts.filter(p => p.hasPromotionTerms).length
          const meetsRequirement = withPromotionTerms >= 4

          onComplete({
            score: Math.round(totalScore),
            totalPrompts: prompts.length,
            treeHeight: treeHeight,
            completed: true,
            meetsRequirement: meetsRequirement,
            promotionTermsCount: withPromotionTerms
          })
        }
      }, 800)
    }
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setFeedback('Please write a sentence.')
      return
    }

    // Check if user just left the prompt without adding anything
    if (userInput.trim() === currentPrompt.prompt.trim()) {
      setFeedback('Please expand the sentence by adding "because" or "and" with more information.')
      return
    }

    // First do basic validation
    const evaluation = evaluateExpansion(userInput, currentPrompt.prompt)

    if (!evaluation.isValid) {
      // Provide specific feedback for basic errors
      if (!evaluation.hasConnector) {
        setFeedback('Please use "because" or "and" to connect your ideas.')
      } else if (!evaluation.addedContent) {
        setFeedback('Please add more details to expand the sentence (at least 2 more words).')
      } else {
        setFeedback('Please expand the sentence by adding logical information.')
      }
      return
    }

    // If basic validation passes, use AI to evaluate quality
    setFeedback('Evaluating your expansion...')

    try {
      const response = await fetch('/api/evaluate-expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          prompt: currentPrompt.prompt,
          expansion: userInput,
          example: currentPrompt.example
        })
      })

      const result = await response.json()

      if (result.isValid) {
        // AI says it's good! Fixed growth: 20px, score: +1
        const growth = 20
        const score = 1

        const newCompletedPrompts = [...completedPrompts, {
          prompt: currentPrompt.prompt,
          userAnswer: userInput,
          growth: growth,
          score: score,
          hasPromotionTerms: evaluation.hasPromotionTerms,
          aiFeedback: result.feedback
        }]

        setCompletedPrompts(newCompletedPrompts)
        setTreeHeight(treeHeight + growth)
        setTotalScore(totalScore + score)
        setFeedback('')

        // Move to next or complete
        if (currentPromptIndex + 1 < prompts.length) {
          const nextPrompt = prompts[currentPromptIndex + 1]
          setUserInput(`${nextPrompt.prompt} `)
          setTimeout(() => {
            setCurrentPromptIndex(currentPromptIndex + 1)
          }, 800)
        } else {
          // Game complete! Calculate final score
          setUserInput('')
          setTimeout(() => {
            setGameComplete(true)
            if (onComplete) {
              // Count how many have poster/video terms
              const withPromotionTerms = newCompletedPrompts.filter(p => p.hasPromotionTerms).length
              const meetsRequirement = withPromotionTerms >= 4 // Must have poster/video in at least 4

              onComplete({
                score: Math.round(totalScore + score),
                totalPrompts: prompts.length,
                treeHeight: treeHeight + growth,
                completed: true,
                meetsRequirement: meetsRequirement,
                promotionTermsCount: withPromotionTerms
              })
            }
          }, 1000)
        }
      } else {
        // AI says it needs improvement
        setFeedback(result.feedback || 'Please try to make your expansion more logical and meaningful.')
      }
    } catch (error) {
      console.error('AI evaluation failed:', error)
      // Fallback to accepting if basic validation passed
      setFeedback('Could not evaluate with AI. Your expansion looks good based on basic checks!')

      // Accept the answer with fixed growth: 20px, score: +1
      const growth = 20
      const score = 1

      const newCompletedPrompts = [...completedPrompts, {
        prompt: currentPrompt.prompt,
        userAnswer: userInput,
        growth: growth,
        score: score,
        hasPromotionTerms: evaluation.hasPromotionTerms
      }]

      setCompletedPrompts(newCompletedPrompts)
      setTreeHeight(treeHeight + growth)
      setTotalScore(totalScore + score)
      setFeedback('')

      if (currentPromptIndex + 1 < prompts.length) {
        const nextPrompt = prompts[currentPromptIndex + 1]
        setUserInput(`${nextPrompt.prompt} `)
        setTimeout(() => {
          setCurrentPromptIndex(currentPromptIndex + 1)
        }, 800)
      } else {
        setUserInput('')
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            const withPromotionTerms = newCompletedPrompts.filter(p => p.hasPromotionTerms).length
            const meetsRequirement = withPromotionTerms >= 4

            onComplete({
              score: Math.round(totalScore + score),
              totalPrompts: prompts.length,
              treeHeight: treeHeight + growth,
              completed: true,
              meetsRequirement: meetsRequirement,
              promotionTermsCount: withPromotionTerms
            })
          }
        }, 1000)
      }
    }
  }

  if (gameComplete) {
    const promotionTermsCount = completedPrompts.filter(p => p.hasPromotionTerms).length
    const meetsRequirement = promotionTermsCount >= 4

    return (
      <Box sx={{ ...clay(meetsRequirement ? D.green : D.orange), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: meetsRequirement ? D.green.border : D.orange.border }}>
          🌳 Expand Quest Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: D.body }}>
          Your tree grew to {treeHeight}px tall!
        </Typography>
        <Typography variant="h6" sx={{ mb: 1, color: D.body }}>
          Final Score: {totalScore} points
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: D.muted }}>
          You expanded all {prompts.length} sentences!
        </Typography>

        {/* Requirement Check */}
        <Box sx={{ ...clay(meetsRequirement ? D.green : D.orange), p: 2, mb: 3 }}>
          <Typography variant="body1" sx={{ color: meetsRequirement ? D.green.border : D.orange.border, fontWeight: 'bold' }}>
            Promotion Vocabulary Used: {promotionTermsCount} / 8
          </Typography>
          <Typography variant="body2" sx={{ color: D.body }}>
            {meetsRequirement
              ? '✓ Great! You used poster/video/promotional terms in at least 4 sentences!'
              : '⚠ Try to use more promotional vocabulary (poster, video, billboard, etc.) in your expansions.'}
          </Typography>
        </Box>

        {/* Final Tree */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <ParkIcon sx={{ fontSize: Math.min(treeHeight, 300), color: meetsRequirement ? D.green.border : D.orange.border }} />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Progress */}
      <Box sx={{ ...clay(D.green), p: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight="bold" sx={{ color: D.green.border }}>
            Progress: {completedPrompts.length} / {prompts.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(completedPrompts.length / prompts.length) * 100}
            sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
            color="success"
          />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <ParkIcon sx={{ color: D.green.border }} />
            <Typography variant="body2" fontWeight="bold" sx={{ color: D.green.border }}>
              {treeHeight}px
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Tree Growth Visualization */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 3, textAlign: 'center', minHeight: 200 }}>
        <Typography variant="h6" gutterBottom sx={{ color: D.heading }}>
          Your Growing Tree
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 150 }}>
          <ParkIcon
            sx={{
              fontSize: Math.max(treeHeight, 40),
              color: D.green.border,
              transition: 'font-size 0.5s ease-out'
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: D.muted }}>
          Expand sentences to make your tree grow taller!
        </Typography>
      </Box>

      {/* Current Prompt */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: D.heading }}>
          Expand this sentence:
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: D.heading }}>
          "{currentPrompt?.prompt}"
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: D.muted }}>
          💡 Use "because" or "and" to add more information
        </Typography>
      </Box>

      {/* Input Area */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="Your expanded sentence"
          placeholder="Expand the sentence using 'because' or 'and'..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        {feedback && (
          <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
            {feedback}
          </Typography>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!userInput.trim() || userInput.trim() === currentPrompt?.prompt?.trim()}
            size="large"
            sx={{
              flexGrow: 1,
              bgcolor: D.blue.border, color: '#fff', borderRadius: '12px',
              boxShadow: '4px 4px 0 ' + D.blue.shadow, fontWeight: 800,
              '&:hover': { bgcolor: D.blue.border, transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 ' + D.blue.shadow }
            }}
          >
            Submit Expansion
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSkip}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Skip (0 pts)
          </Button>
        </Stack>
      </Box>

      {/* Completed Prompts */}
      {completedPrompts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: D.heading }}>
            Completed Expansions:
          </Typography>
          <Stack spacing={2}>
            {completedPrompts.map((item, index) => (
              <Box
                key={index}
                sx={{
                  ...clay(item.skipped ? D.blue : D.green),
                  p: 2,
                  opacity: item.skipped ? 0.7 : 1
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CheckCircleIcon sx={{ color: item.skipped ? D.muted : D.green.border, mt: 0.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: D.muted }}>
                      Prompt: "{item.prompt}"
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{ color: item.skipped ? D.muted : D.body }}>
                      {item.userAnswer}
                    </Typography>
                  </Box>
                  <Stack alignItems="center">
                    <ParkIcon sx={{ color: item.skipped ? D.muted : D.green.border, fontSize: 30 }} />
                    <Typography variant="caption" sx={{ color: item.skipped ? D.muted : D.green.border }} fontWeight="bold">
                      +{item.growth}px
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ExpandQuestGame
