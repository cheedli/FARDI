import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Alert } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskD = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 4, context: 'remedial_b2' });

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

  const [answers, setAnswers] = useState({
    term1_spelling: '', term1_explanation: '',
    term2_spelling: '', term2_explanation: '',
    term3_spelling: '', term3_explanation: '',
    term4_spelling: '', term4_explanation: '',
    term5_spelling: '', term5_explanation: '',
    term6_spelling: '', term6_explanation: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const terms = [
    { id: 1, faulty: 'capshun', correct: 'caption', keywordSpelling: 'caption', keywordExplanation: ['text', 'description', 'photo', 'video'] },
    { id: 2, faulty: 'hashteg', correct: 'hashtag', keywordSpelling: 'hashtag', keywordExplanation: ['#', 'categorize', 'tag', 'search'] },
    { id: 3, faulty: 'emogi', correct: 'emoji', keywordSpelling: 'emoji', keywordExplanation: ['symbol', 'emotion', 'icon', 'visual'] },
    { id: 4, faulty: 'taged', correct: 'tagged', keywordSpelling: 'tagged', keywordExplanation: ['mention', 'someone', 'post', 'tag'] },
    { id: 5, faulty: 'viral post', correct: 'viral', keywordSpelling: 'viral', keywordExplanation: ['spread', 'quickly', 'popular', 'share'] },
    { id: 6, faulty: 'engagment', correct: 'engagement', keywordSpelling: 'engagement', keywordExplanation: ['like', 'comment', 'share', 'interaction'] }
  ];

  const handleChange = (field, value) => setAnswers({ ...answers, [field]: value });

  const evaluateSpelling = (userAnswer, correctSpelling) => userAnswer.toLowerCase().trim() === correctSpelling.toLowerCase();

  const evaluateExplanation = (userAnswer, keywords) => {
    const lowerAnswer = userAnswer.toLowerCase().trim();
    if (lowerAnswer.length < 10) return false;
    let matches = 0;
    keywords.forEach(keyword => { if (lowerAnswer.includes(keyword.toLowerCase())) matches++; });
    return matches >= 1;
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    terms.forEach(term => {
      if (evaluateSpelling(answers[`term${term.id}_spelling`], term.correct)) calculatedScore += 1;
      if (evaluateExplanation(answers[`term${term.id}_explanation`], term.keywordExplanation)) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB2_taskD', calculatedScore.toString());
  };

  const handleNext = () => navigate('/phase4_2/step/5/remedial/b2/results')
  window.__remedialSkip = handleNext;

  const allAnswered = terms.every(term =>
    answers[`term${term.id}_spelling`]?.trim() !== '' && answers[`term${term.id}_explanation`]?.trim() !== ''
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Welcome to Spelling & Explain! For each term, provide the correct spelling AND explain what it means. This tests both your spelling and your understanding of social media vocabulary!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>
              Task D: Spelling &amp; Explain
            </Typography>
            <Typography variant="body1" paragraph>Spell and explain 6 common social media terms:</Typography>

            <Box sx={{ mt: 3 }}>
              {terms.map((term, index) => (
                <Box key={term.id} sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {index + 1}. Faulty Term: <span style={{ color: P.red.shadow, fontStyle: 'italic' }}>"{term.faulty}"</span>
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3, mt: 1 }}>
                    <Box>
                      <TextField
                        fullWidth label="Correct Spelling" variant="outlined"
                        value={answers[`term${term.id}_spelling`]}
                        onChange={(e) => handleChange(`term${term.id}_spelling`, e.target.value)}
                        disabled={submitted} placeholder="Type correct spelling..."
                      />
                      {submitted && (
                        <Alert severity={evaluateSpelling(answers[`term${term.id}_spelling`], term.correct) ? 'success' : 'error'} sx={{ mt: 1 }}>
                          {evaluateSpelling(answers[`term${term.id}_spelling`], term.correct) ? '✓ Correct spelling!' : `✗ Should be: "${term.correct}"`}
                        </Alert>
                      )}
                    </Box>
                    <Box>
                      <TextField
                        fullWidth label="Explanation" variant="outlined"
                        value={answers[`term${term.id}_explanation`]}
                        onChange={(e) => handleChange(`term${term.id}_explanation`, e.target.value)}
                        disabled={submitted} multiline rows={2} placeholder="Explain what this term means..."
                      />
                      {submitted && (
                        <Alert severity={evaluateExplanation(answers[`term${term.id}_explanation`], term.keywordExplanation) ? 'success' : 'info'} sx={{ mt: 1 }}>
                          {evaluateExplanation(answers[`term${term.id}_explanation`], term.keywordExplanation) ? '✓ Good explanation!' : `Include keywords like: ${term.keywordExplanation.join(', ')}`}
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{ bgcolor: score >= 8 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 8 ? P.green.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 8 ? P.green.shadow : P.yellow.shadow }}>Your Score: {score}/12 points</Typography>
                <Typography variant="body2">(1 point for spelling + 1 point for explanation = 2 points per term)</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{score >= 8 ? 'Excellent! You know the spellings and meanings well!' : 'Keep practicing! Make sure you can both spell and explain each term.'}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/b2/task/c')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task C</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                  bgcolor: !allAnswered ? (isDark ? '#333' : '#e0e0e0') : P.purple.bg,
                  border: `2px solid ${!allAnswered ? '#999' : P.purple.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${!allAnswered ? '#999' : P.purple.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !allAnswered ? 'not-allowed' : 'pointer', color: !allAnswered ? '#999' : P.purple.shadow,
                  '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {},
                  '&:active': allAnswered ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.purple.shadow}` } : {}
                }}>Submit Answers</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
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
