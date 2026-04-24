import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskD = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 4, context: 'remedial_b1' });

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const [flippedCards, setFlippedCards] = useState({});
  const [markedAsLearned, setMarkedAsLearned] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const flashcards = [
    { id: 'card1', front: 'hashteg', back: 'hashtag', explanation: 'A hashtag (#) is used to categorize posts on social media' },
    { id: 'card2', front: 'emogi', back: 'emoji', explanation: 'Emoji are small digital images or icons used to express emotions' },
    { id: 'card3', front: 'your coming?', back: 'are you coming?', explanation: 'Correct question formation requires auxiliary verb "are"' },
    { id: 'card4', front: 'post it in story', back: 'post it to your story', explanation: 'Use "to" (not "in") and specify "your story"' },
    { id: 'card5', front: "tag you're friend", back: 'tag your friend', explanation: "Use \"your\" (possessive) not \"you're\" (you are)" },
    { id: 'card6', front: 'very good post', back: 'excellent post', explanation: 'Use more sophisticated vocabulary: "excellent" instead of "very good"' },
    { id: 'card7', front: 'click for more', back: 'swipe up for more', explanation: 'Platform-specific language: Instagram Stories use "swipe up"' },
    { id: 'card8', front: 'follow at Instagram', back: 'follow us on Instagram', explanation: 'Use "on" (not "at") and include "us" for clarity' }
  ];

  const handleFlip = (cardId) => setFlippedCards({ ...flippedCards, [cardId]: !flippedCards[cardId] });
  const handleMarkLearned = (cardId, checked) => setMarkedAsLearned({ ...markedAsLearned, [cardId]: checked });

  const handleSubmit = () => {
    const score = Object.values(markedAsLearned).filter(Boolean).length;
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskD', score.toString());
  };

  const handleNext = () => navigate('/phase4_2/step/5/remedial/b1/results')
  window.__remedialSkip = handleNext;

  const score = Object.values(markedAsLearned).filter(Boolean).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Time for Quizlet Flashcards! Click each card to flip it and see the correction. Mark cards as 'learned' when you understand the correction. This is a self-assessment activity!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>
              Task D: Quizlet Flashcards
            </Typography>
            <Typography variant="body1" paragraph>
              Click each card to reveal the correct version and explanation. Mark the cards you've learned!
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3, mt: 3 }}>
              {flashcards.map((card) => (
                <Box key={card.id}>
                  <Box
                    onClick={() => handleFlip(card.id)}
                    sx={{
                      minHeight: 200,
                      cursor: 'pointer',
                      bgcolor: flippedCards[card.id] ? P.blue.bg : P.red.bg,
                      border: `2px solid ${flippedCards[card.id] ? P.blue.border : P.red.border}`,
                      borderRadius: '20px',
                      boxShadow: `4px 4px 0 ${flippedCards[card.id] ? P.blue.shadow : P.red.shadow}`,
                      p: 3,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${flippedCards[card.id] ? P.blue.shadow : P.red.shadow}` }
                    }}
                  >
                    {!flippedCards[card.id] ? (
                      <>
                        <Typography variant="h6" sx={{ color: P.red.shadow, mb: 1, textAlign: 'center', fontWeight: 'bold' }}>Faulty Version:</Typography>
                        <Typography variant="h5" sx={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold' }}>"{card.front}"</Typography>
                        <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>Click to flip</Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ color: P.blue.shadow, mb: 1, textAlign: 'center', fontWeight: 'bold' }}>Correct Version:</Typography>
                        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: P.blue.shadow }}>"{card.back}"</Typography>
                        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>{card.explanation}</Typography>
                      </>
                    )}
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={markedAsLearned[card.id] || false}
                        onChange={(e) => handleMarkLearned(card.id, e.target.checked)}
                        disabled={!flippedCards[card.id] || submitted}
                      />
                    }
                    label="Mark as Learned"
                    sx={{ mt: 1, ml: 1 }}
                  />
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{ bgcolor: score >= 6 ? P.green.bg : P.blue.bg, border: `2px solid ${score >= 6 ? P.green.border : P.blue.border}`, borderRadius: '16px', p: 3, mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 6 ? P.green.shadow : P.blue.shadow }}>Cards Learned: {score}/8</Typography>
                <Typography variant="body2">{score >= 6 ? "Great progress! You've learned most of the corrections." : "Keep studying! Review the cards you haven't marked as learned."}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/b1/task/c')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task C</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.purple.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.purple.shadow}` }
                }}>Complete Task D</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>View Results</Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskD;
