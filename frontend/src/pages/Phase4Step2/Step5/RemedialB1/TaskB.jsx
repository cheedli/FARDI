import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Alert } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskB = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 2, context: 'remedial_b1' });

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

  const [answers, setAnswers] = useState({ s1: '', s2: '', s3: '', s4: '', s5: '', s6: '', s7: '', s8: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const sentences = [
    { id: 's1', faulty: 'Festival is happening very good time.', ideal: 'The festival is happening at a great time.', keywords: ['the', 'festival', 'great', 'time'] },
    { id: 's2', faulty: 'Come and enjoy lot of things we have.', ideal: 'Come and enjoy the many things we have to offer.', keywords: ['the', 'many', 'offer'] },
    { id: 's3', faulty: 'Music will play and food will eat.', ideal: 'Music will play and food will be served.', keywords: ['will', 'be', 'served'] },
    { id: 's4', faulty: 'Tag friend who like festival thing.', ideal: 'Tag a friend who likes festivals.', keywords: ['a', 'friend', 'likes', 'festivals'] },
    { id: 's5', faulty: 'Post your photo in event hashtag.', ideal: 'Post your photos using the event hashtag.', keywords: ['using', 'the', 'event', 'hashtag'] },
    { id: 's6', faulty: 'We doing this for make people happy.', ideal: 'We are doing this to make people happy.', keywords: ['are', 'doing', 'to', 'make'] },
    { id: 's7', faulty: 'Very good festival you come please.', ideal: 'This is a great festival, please come!', keywords: ['this', 'is', 'great', 'please', 'come'] },
    { id: 's8', faulty: 'Share to everyone who you knowing.', ideal: 'Share with everyone you know.', keywords: ['share', 'with', 'everyone', 'know'] }
  ];

  const handleChange = (sentenceId, value) => setAnswers({ ...answers, [sentenceId]: value });

  const evaluateSentence = (userAnswer, sentence) => {
    const lowerAnswer = userAnswer.toLowerCase().trim();
    let matches = 0;
    sentence.keywords.forEach(keyword => { if (lowerAnswer.includes(keyword.toLowerCase())) matches++; });
    return matches >= Math.ceil(sentence.keywords.length * 0.6);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    sentences.forEach(sentence => { if (evaluateSentence(answers[sentence.id], sentence)) calculatedScore++; });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskB', calculatedScore.toString());
  };

  const handleNext = () => navigate('/phase4_2/step/5/remedial/b1/task/c');

  const allAnswered = Object.values(answers).every(answer => answer.trim() !== '');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Time for the Definition Duel! Correct these 8 faulty sentences by improving coherence, vocabulary, and tone. Think about what makes a sentence clear and professional."
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
              Task B: Definition Duel
            </Typography>
            <Typography variant="body1" paragraph>Correct each faulty sentence below. Focus on:</Typography>
            <Box component="ul" sx={{ mb: 3 }}>
              <li>Adding missing articles (a, an, the)</li>
              <li>Using appropriate vocabulary</li>
              <li>Improving tone and coherence</li>
              <li>Correcting grammar errors</li>
            </Box>

            <Box sx={{ mt: 3 }}>
              {sentences.map((sentence, index) => (
                <Box key={sentence.id} sx={{ mb: 4, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {index + 1}. Faulty Sentence:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px', fontStyle: 'italic' }}>
                    "{sentence.faulty}"
                  </Typography>
                  <TextField
                    fullWidth
                    label="Your Corrected Sentence"
                    variant="outlined"
                    value={answers[sentence.id]}
                    onChange={(e) => handleChange(sentence.id, e.target.value)}
                    disabled={submitted}
                    multiline
                    rows={2}
                  />
                  {submitted && (
                    <Alert severity={evaluateSentence(answers[sentence.id], sentence) ? 'success' : 'info'} sx={{ mt: 1 }}>
                      {evaluateSentence(answers[sentence.id], sentence) ? 'Good correction!' : `Suggested correction: "${sentence.ideal}"`}
                    </Alert>
                  )}
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{ bgcolor: score >= 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 6 ? P.green.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 6 ? P.green.shadow : P.yellow.shadow }}>Your Score: {score}/8 points</Typography>
                <Typography variant="body2">{score >= 6 ? 'Excellent work! Your corrections show strong understanding of coherence and vocabulary.' : 'Keep practicing! Focus on articles, vocabulary choice, and sentence structure.'}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/b1/task/a')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task A</Box>
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
                }}>Continue to Task C</Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskB;
