import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskC = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 3, context: 'remedial_b1' });

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

  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    { id: 'q1', sentence: "He dont like the post.", errorType: 'grammar', explanation: "Subject-verb agreement error: 'He doesn't like' (not 'He dont')" },
    { id: 'q2', sentence: "This event is very fantastik!", errorType: 'spelling', explanation: "Spelling error: 'fantastic' (not 'fantastik')" },
    { id: 'q3', sentence: "Tag you're friends now!", errorType: 'grammar', explanation: "Grammar error: 'your' (possessive) not 'you're' (you are)" },
    { id: 'q4', sentence: "The festival happen last week.", errorType: 'grammar', explanation: "Verb tense error: 'happened' (past tense) not 'happen'" },
    { id: 'q5', sentence: "Come to festival for having fun stuff.", errorType: 'vocabulary', explanation: "Vocabulary/tone too informal: 'to enjoy exciting activities' instead of 'for having fun stuff'" },
    { id: 'q6', sentence: "We has many activities available.", errorType: 'grammar', explanation: "Subject-verb agreement error: 'We have' (not 'We has')" }
  ];

  const errorTypes = [
    { value: 'spelling', label: 'Spelling Error' },
    { value: 'grammar', label: 'Grammar Error' },
    { value: 'vocabulary', label: 'Vocabulary/Tone Error' }
  ];

  const handleChange = (questionId, value) => setAnswers({ ...answers, [questionId]: value });

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(q => { if (answers[q.id] === q.errorType) calculatedScore++; });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskC', calculatedScore.toString());
  };

  const handleNext = () => navigate('/phase4_2/step/5/remedial/b1/task/d')
  window.__remedialSkip = handleNext;

  const allAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Welcome to the Wordshake Quiz! Identify the type of error in each sentence. Is it spelling, grammar, or vocabulary/tone? This will help you become a better editor!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
              Task C: Wordshake Quiz
            </Typography>
            <Typography variant="body1" paragraph>Read each sentence and identify what type of error it contains:</Typography>

            <Box sx={{ mt: 3 }}>
              {questions.map((question, index) => (
                <Box key={question.id} sx={{ mb: 4, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {index + 1}. Identify the error type in this sentence:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '8px', fontStyle: 'italic', fontSize: '1.1rem' }}>
                    "{question.sentence}"
                  </Typography>
                  <RadioGroup value={answers[question.id]} onChange={(e) => handleChange(question.id, e.target.value)}>
                    {errorTypes.map((type) => (
                      <FormControlLabel key={type.value} value={type.value} control={<Radio />} label={type.label} disabled={submitted} />
                    ))}
                  </RadioGroup>
                  {submitted && (
                    <Alert severity={answers[question.id] === question.errorType ? 'success' : 'info'} sx={{ mt: 1 }}>
                      {answers[question.id] === question.errorType ? `Correct! ${question.explanation}` : `Incorrect. ${question.explanation}`}
                    </Alert>
                  )}
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{ bgcolor: score >= 4 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 4 ? P.green.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 4 ? P.green.shadow : P.yellow.shadow }}>Your Score: {score}/6 points</Typography>
                <Typography variant="body2">{score >= 4 ? 'Great job identifying error types! This skill will help you edit posts effectively.' : 'Keep practicing! Learn to distinguish between spelling, grammar, and vocabulary errors.'}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/b1/task/b')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task B</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                  bgcolor: !allAnswered ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                  border: `2px solid ${!allAnswered ? '#999' : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${!allAnswered ? '#999' : P.orange.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !allAnswered ? 'not-allowed' : 'pointer', color: !allAnswered ? '#999' : P.orange.shadow,
                  '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                  '&:active': allAnswered ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
                }}>Submit Answers</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>Continue to Task D</Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskC;
