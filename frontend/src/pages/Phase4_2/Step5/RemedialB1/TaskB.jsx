import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskB = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_b1' });
  const [answers, setAnswers] = useState({
    s1: '',
    s2: '',
    s3: '',
    s4: '',
    s5: '',
    s6: '',
    s7: '',
    s8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const sentences = [
    {
      id: 's1',
      faulty: 'Festival is happening very good time.',
      ideal: 'The festival is happening at a great time.',
      keywords: ['the', 'festival', 'great', 'time']
    },
    {
      id: 's2',
      faulty: 'Come and enjoy lot of things we have.',
      ideal: 'Come and enjoy the many things we have to offer.',
      keywords: ['the', 'many', 'offer']
    },
    {
      id: 's3',
      faulty: 'Music will play and food will eat.',
      ideal: 'Music will play and food will be served.',
      keywords: ['will', 'be', 'served']
    },
    {
      id: 's4',
      faulty: 'Tag friend who like festival thing.',
      ideal: 'Tag a friend who likes festivals.',
      keywords: ['a', 'friend', 'likes', 'festivals']
    },
    {
      id: 's5',
      faulty: 'Post your photo in event hashtag.',
      ideal: 'Post your photos using the event hashtag.',
      keywords: ['using', 'the', 'event', 'hashtag']
    },
    {
      id: 's6',
      faulty: 'We doing this for make people happy.',
      ideal: 'We are doing this to make people happy.',
      keywords: ['are', 'doing', 'to', 'make']
    },
    {
      id: 's7',
      faulty: 'Very good festival you come please.',
      ideal: 'This is a great festival, please come!',
      keywords: ['this', 'is', 'great', 'please', 'come']
    },
    {
      id: 's8',
      faulty: 'Share to everyone who you knowing.',
      ideal: 'Share with everyone you know.',
      keywords: ['share', 'with', 'everyone', 'know']
    }
  ];

  const handleChange = (sentenceId, value) => {
    setAnswers({ ...answers, [sentenceId]: value });
  };

  const evaluateSentence = (userAnswer, sentence) => {
    const lowerAnswer = userAnswer.toLowerCase().trim();
    let matches = 0;
    sentence.keywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword.toLowerCase())) {
        matches++;
      }
    });
    return matches >= Math.ceil(sentence.keywords.length * 0.6); // 60% of keywords
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    sentences.forEach(sentence => {
      if (evaluateSentence(answers[sentence.id], sentence)) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskB', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/b1/task/c');
  };

  const allAnswered = Object.values(answers).every(answer => answer.trim() !== '');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Time for the Definition Duel! Correct these 8 faulty sentences by improving coherence, vocabulary, and tone. Think about what makes a sentence clear and professional."
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task B: Definition Duel
        </Typography>
        <Typography variant="body1" paragraph>
          Correct each faulty sentence below. Focus on:
        </Typography>
        <Box component="ul" sx={{ mb: 3 }}>
          <li>Adding missing articles (a, an, the)</li>
          <li>Using appropriate vocabulary</li>
          <li>Improving tone and coherence</li>
          <li>Correcting grammar errors</li>
        </Box>

        <Box sx={{ mt: 3 }}>
          {sentences.map((sentence, index) => (
            <Box key={sentence.id} sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                {index + 1}. Faulty Sentence:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: '#ffebee',
                  borderRadius: 1,
                  fontStyle: 'italic'
                }}
              >
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
                <Alert
                  severity={evaluateSentence(answers[sentence.id], sentence) ? 'success' : 'info'}
                  sx={{ mt: 1 }}
                >
                  {evaluateSentence(answers[sentence.id], sentence)
                    ? 'Good correction!'
                    : `Suggested correction: "${sentence.ideal}"`}
                </Alert>
              )}
            </Box>
          ))}
        </Box>

        {submitted && (
          <Alert severity={score >= 6 ? 'success' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
              Your Score: {score}/8 points
            </Typography>
            <Typography variant="body2">
              {score >= 6
                ? 'Excellent work! Your corrections show strong understanding of coherence and vocabulary.'
                : 'Keep practicing! Focus on articles, vocabulary choice, and sentence structure.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/b1/task/a')}
            disabled={!submitted}
          >
            Back to Task A
          </Button>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!allAnswered}
              size="large"
            >
              Submit Answers
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              size="large"
            >
              Continue to Task C
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskB;
