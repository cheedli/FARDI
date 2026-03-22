import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskB = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_a2' });

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
    { id: 'q1', sentence: 'Add a _____ to your photo.', options: ['capshun', 'caption'], correct: 'caption' },
    { id: 'q2', sentence: 'Use a fun _____ in your message.', options: ['emogi', 'emoji'], correct: 'emoji' },
    { id: 'q3', sentence: 'Write a good _____ for the post.', options: ['hashteg', 'hashtag'], correct: 'hashtag' },
    { id: 'q4', sentence: '_____ your friend in the story.', options: ['Taged', 'Tagged'], correct: 'Tagged' },
    { id: 'q5', sentence: 'Did you _____ the new post?', options: ['liek', 'like'], correct: 'like' },
    { id: 'q6', sentence: 'Please _____ this with others.', options: ['shaer', 'share'], correct: 'share' }
  ];

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) calculatedScore++;
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialA2_taskB', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/a2/task/c');
  };

  const allAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Time for Fill Quest! Choose the correct spelling to complete each sentence. Read carefully and select the right word!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
              Task B: Fill Quest
            </Typography>
            <Typography variant="body1" paragraph>
              Fill in the correct spelling in each social media post sentence:
            </Typography>

            <Box sx={{ mt: 3 }}>
              {questions.map((question, index) => (
                <Box key={question.id} sx={{ mb: 4, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {index + 1}. {question.sentence}
                  </Typography>
                  <RadioGroup
                    value={answers[question.id]}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  >
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                        disabled={submitted}
                      />
                    ))}
                  </RadioGroup>
                  {submitted && (
                    <Alert
                      severity={answers[question.id] === question.correct ? 'success' : 'error'}
                      sx={{ mt: 1 }}
                    >
                      {answers[question.id] === question.correct
                        ? 'Correct!'
                        : `Incorrect. The correct spelling is: ${question.correct}`}
                    </Alert>
                  )}
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{ bgcolor: score >= 4 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 4 ? P.green.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ color: score >= 4 ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                  Your Score: {score}/6 points
                </Typography>
                <Typography variant="body2">
                  {score >= 4
                    ? 'Great work! You can spell social media terms correctly!'
                    : 'Keep practicing! Review the correct spellings.'}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/a2/task/a')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow,
                '&:hover': submitted ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                '&:active': submitted ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` } : {}
              }}>
                Back to Task A
              </Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                  bgcolor: !allAnswered ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                  border: `2px solid ${!allAnswered ? '#999' : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${!allAnswered ? '#999' : P.orange.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !allAnswered ? 'not-allowed' : 'pointer', color: !allAnswered ? '#999' : P.orange.shadow,
                  '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                  '&:active': allAnswered ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
                }}>
                  Submit Answers
                </Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>
                  Continue to Task C
                </Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskB;
