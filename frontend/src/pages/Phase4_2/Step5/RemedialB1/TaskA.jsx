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

const TaskA = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 1, context: 'remedial_b1' });
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 'q1',
      text: 'Join ____ for the Global Cultures Festival!',
      options: ['us', 'we'],
      correct: 'us'
    },
    {
      id: 'q2',
      text: 'The event ____ on March 8.',
      options: ['take place', 'takes place'],
      correct: 'takes place'
    },
    {
      id: 'q3',
      text: 'There ____ music, food, and dance.',
      options: ['is', 'are'],
      correct: 'are'
    },
    {
      id: 'q4',
      text: 'Tag ____ friends and come together!',
      options: ['your', "you're"],
      correct: 'your'
    },
    {
      id: 'q5',
      text: 'We ____ share photos after the event.',
      options: ['will', 'would'],
      correct: 'will'
    },
    {
      id: 'q6',
      text: "Don't ____ this amazing opportunity.",
      options: ['missed', 'miss'],
      correct: 'miss'
    },
    {
      id: 'q7',
      text: 'Follow us ____ Instagram for updates.',
      options: ['at', 'on'],
      correct: 'on'
    },
    {
      id: 'q8',
      text: 'See you ____ the festival!',
      options: ['in', 'at'],
      correct: 'at'
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
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskA', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/b1/task/b');
  };

  const allAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Welcome to the Negotiation Battle! Fill in the blanks with the correct grammar and structure to complete this social media post about the Global Cultures Festival. Choose carefully!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task A: Negotiation Battle
        </Typography>
        <Typography variant="body1" paragraph>
          Fill in the gaps to correct the grammar and sentence structure in this social media post:
        </Typography>

        <Box sx={{ mt: 3 }}>
          {questions.map((question, index) => (
            <Box key={question.id} sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {index + 1}. {question.text}
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
                    : `Incorrect. The correct answer is: ${question.correct}`}
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
                ? 'Great job! You have a good understanding of grammar and structure.'
                : 'Keep practicing! Review subject-verb agreement, prepositions, and your/you\'re.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
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
              Continue to Task B
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskA;
