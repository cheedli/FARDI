import React, { useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'

const GapFillStory = ({ templates, wordBank, answers, onChange }) => {
  const [selectedWord, setSelectedWord] = useState(null)
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

  const colors = {
    pageBg: dark ? '#0F0F1A' : '#FFFDE7',
    cardBg: dark ? '#1A1A2E' : '#ffffff',
    heading: dark ? '#E8EAFF' : '#1A237E',
    body: dark ? '#B0BEC5' : '#37474F',
    muted: dark ? '#607D8B' : '#78909C',
    divider: dark ? '#2A2A4A' : '#E0E0E0',
    blue: dark
      ? { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' }
      : { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    green: dark
      ? { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' }
      : { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
    purple: dark
      ? { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' }
      : { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    yellow: dark
      ? { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' }
      : { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
    teal: dark
      ? { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' }
      : { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  }

  if (!templates || templates.length === 0 || !wordBank) return null

  const handleWordClick = (word) => {
    setSelectedWord(word)
  }

  const handleBlankClick = (templateIndex, blankIndex) => {
    if (!selectedWord) return
    const key = `g_${templateIndex}_${blankIndex}`
    onChange(key, selectedWord)
    setSelectedWord(null)
    if (navigator.vibrate) navigator.vibrate(50)
  }

  const handleClearBlank = (templateIndex, blankIndex) => {
    const key = `g_${templateIndex}_${blankIndex}`
    onChange(key, '')
  }

  const usedWords = Object.values(answers).filter(v => v).length
  const totalBlanks = templates.reduce((sum, template) => {
    return sum + (template.match(/_{3,}/g) || []).length
  }, 0)

  const c = colors

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', py: { xs: 2, sm: 4 } }}>
      {/* Word Bank */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 4 },
          bgcolor: c.blue.bg,
          border: `2px solid ${c.blue.border}`,
          borderRadius: '20px',
          boxShadow: `4px 4px 0 ${c.blue.shadow}`,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            fontWeight: 800,
            color: c.heading,
            mb: 1.5,
          }}
        >
          Word Bank — Click a word, then click a blank
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 } }}>
          {wordBank.map((word, wi) => {
            const isSelected = selectedWord === word
            const isUsed = Object.values(answers).includes(word)
            return (
              <Box
                key={wi}
                onClick={() => handleWordClick(word)}
                sx={{
                  px: 1.75,
                  py: 0.4,
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: '50px',
                  bgcolor: isSelected ? c.purple.bg : (isUsed ? c.green.bg : c.cardBg),
                  border: `2px solid ${isSelected ? c.purple.border : (isUsed ? c.green.border : c.divider)}`,
                  boxShadow: isSelected
                    ? `3px 3px 0 ${c.purple.shadow}`
                    : `2px 2px 0 ${isUsed ? c.green.shadow : c.divider}`,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 800,
                  color: isSelected ? c.purple.border : (isUsed ? c.green.border : c.body),
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  transform: isSelected ? 'translate(-2px,-2px)' : 'none',
                  opacity: isUsed && !isSelected ? 0.6 : 1,
                  '&:hover': {
                    transform: 'translate(-2px,-2px)',
                    boxShadow: isSelected
                      ? `5px 5px 0 ${c.purple.shadow}`
                      : `4px 4px 0 ${isUsed ? c.green.shadow : c.divider}`,
                  },
                }}
              >
                {word}
              </Box>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, gap: 1 }}>
          <Typography sx={{ fontSize: '0.8rem', color: c.muted, fontWeight: 600 }}>
            {selectedWord ? `Selected: "${selectedWord}" — Now click a blank` : 'Select a word from above'}
          </Typography>
          <Box
            sx={{
              px: 1.75,
              py: 0.4,
              borderRadius: '50px',
              bgcolor: usedWords === totalBlanks ? c.green.bg : c.yellow.bg,
              border: `2px solid ${usedWords === totalBlanks ? c.green.border : c.yellow.border}`,
              boxShadow: `2px 2px 0 ${usedWords === totalBlanks ? c.green.shadow : c.yellow.shadow}`,
              fontSize: '0.8rem',
              fontWeight: 800,
              color: usedWords === totalBlanks ? c.green.border : (c.yellow.text || c.body),
            }}
          >
            {usedWords} / {totalBlanks} Filled
          </Box>
        </Box>
      </Box>

      {/* Story with Blanks */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 3 } }}>
        {templates.map((template, ti) => {
          const parts = template.split(/_{3,}/)

          return (
            <Box
              key={ti}
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: c.cardBg,
                border: `2px solid ${c.divider}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${c.divider}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: { xs: 0.75, sm: 1.5 },
                  lineHeight: 2.2,
                }}
              >
                {parts.map((part, pi) => (
                  <React.Fragment key={pi}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                        lineHeight: 2.2,
                        color: c.body,
                      }}
                    >
                      {part}
                    </Typography>
                    {pi < parts.length - 1 && (() => {
                      const key = `g_${ti}_${pi}`
                      const filledWord = answers[key]

                      return (
                        <Box
                          onClick={() => {
                            if (filledWord) {
                              handleClearBlank(ti, pi)
                            } else {
                              handleBlankClick(ti, pi)
                            }
                          }}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            minWidth: { xs: '100px', sm: '120px' },
                            minHeight: '44px',
                            px: 1.5,
                            border: `2px ${filledWord ? 'solid' : 'dashed'}`,
                            borderColor: filledWord
                              ? c.green.border
                              : (selectedWord ? c.purple.border : c.muted),
                            borderRadius: '14px',
                            bgcolor: filledWord
                              ? c.green.bg
                              : (selectedWord ? c.purple.bg : 'transparent'),
                            boxShadow: filledWord
                              ? `3px 3px 0 ${c.green.shadow}`
                              : (selectedWord ? `2px 2px 0 ${c.purple.shadow}` : 'none'),
                            cursor: filledWord ? 'pointer' : (selectedWord ? 'pointer' : 'default'),
                            transition: 'all 0.15s',
                            '&:hover': filledWord || selectedWord ? {
                              transform: 'translate(-2px,-2px)',
                              boxShadow: filledWord
                                ? `5px 5px 0 ${c.green.shadow}`
                                : `4px 4px 0 ${c.purple.shadow}`,
                            } : {},
                          }}
                        >
                          {filledWord ? (
                            <>
                              <Typography
                                sx={{
                                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                  fontWeight: 800,
                                  color: c.green.border,
                                  flex: 1,
                                }}
                              >
                                {filledWord}
                              </Typography>
                              <Cancel sx={{ fontSize: '1rem', color: c.muted, ml: 0.5 }} />
                            </>
                          ) : (
                            <Typography sx={{ fontSize: '0.8rem', color: c.muted, fontStyle: 'italic', fontWeight: 600 }}>
                              {selectedWord ? 'Click here' : '...'}
                            </Typography>
                          )}
                        </Box>
                      )
                    })()}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Completion Message */}
      {usedWords === totalBlanks && totalBlanks > 0 && (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            mt: { xs: 2, sm: 4 },
            textAlign: 'center',
            bgcolor: c.green.bg,
            border: `2px solid ${c.green.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${c.green.shadow}`,
          }}
        >
          <CheckCircle sx={{ fontSize: { xs: 44, sm: 60 }, color: c.green.border, mb: 1 }} />
          <Typography sx={{ fontSize: { xs: '1rem', sm: '1.15rem' }, fontWeight: 800, color: c.green.border }}>
            All Blanks Filled!
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: c.muted, mt: 0.5 }}>
            Click Submit below to continue.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default GapFillStory
