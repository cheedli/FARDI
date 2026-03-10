import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskB = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_a2' });
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 'q1',
      sentence: 'Add a _____ to your photo.',
      options: ['capshun', 'caption'],
      correct: 'caption'
    },
    {
      id: 'q2',
      sentence: 'Use a fun _____ in your message.',
      options: ['emogi', 'emoji'],
      correct: 'emoji'
    },
    {
      id: 'q3',
      sentence: 'Write a good _____ for the post.',
      options: ['hashteg', 'hashtag'],
      correct: 'hashtag'
    },
    {
      id: 'q4',
      sentence: '_____ your friend in the story.',
      options: ['Taged', 'Tagged'],
      correct: 'Tagged'
    },
    {
      id: 'q5',
      sentence: 'Did you _____ the new post?',
      options: ['liek', 'like'],
      correct: 'like'
    },
    {
      id: 'q6',
      sentence: 'Please _____ this with others.',
      options: ['shaer', 'share'],
      correct: 'share'
    }
  ];

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        calculatedScore++;
      }
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Time for Fill Quest! Choose the correct spelling to complete each sentence. Read carefully and select the right word!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task B: Fill Quest
        </Typography>
        <Typography variant="body1" paragraph>
          Fill in the correct spelling in each social media post sentence:
        </Typography>

        <Box sx={{ mt: 3 }}>
          {questions.map((question, index) => (
            <Box key={question.id} sx={{ mb: 4 }}>
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
          <Alert severity={score >= 4 ? 'success' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
              Your Score: {score}/6 points
            </Typography>
            <Typography variant="body2">
              {score >= 4
                ? 'Great work! You can spell social media terms correctly!'
                : 'Keep practicing! Review the correct spellings.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/a2/task/a')}
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
