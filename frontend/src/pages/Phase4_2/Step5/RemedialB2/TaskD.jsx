import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  Grid
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskD = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_b2' });
  const [answers, setAnswers] = useState({
    term1_spelling: '',
    term1_explanation: '',
    term2_spelling: '',
    term2_explanation: '',
    term3_spelling: '',
    term3_explanation: '',
    term4_spelling: '',
    term4_explanation: '',
    term5_spelling: '',
    term5_explanation: '',
    term6_spelling: '',
    term6_explanation: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const terms = [
    {
      id: 1,
      faulty: 'capshun',
      correct: 'caption',
      keywordSpelling: 'caption',
      keywordExplanation: ['text', 'description', 'photo', 'video']
    },
    {
      id: 2,
      faulty: 'hashteg',
      correct: 'hashtag',
      keywordSpelling: 'hashtag',
      keywordExplanation: ['#', 'categorize', 'tag', 'search']
    },
    {
      id: 3,
      faulty: 'emogi',
      correct: 'emoji',
      keywordSpelling: 'emoji',
      keywordExplanation: ['symbol', 'emotion', 'icon', 'visual']
    },
    {
      id: 4,
      faulty: 'taged',
      correct: 'tagged',
      keywordSpelling: 'tagged',
      keywordExplanation: ['mention', 'someone', 'post', 'tag']
    },
    {
      id: 5,
      faulty: 'viral post',
      correct: 'viral',
      keywordSpelling: 'viral',
      keywordExplanation: ['spread', 'quickly', 'popular', 'share']
    },
    {
      id: 6,
      faulty: 'engagment',
      correct: 'engagement',
      keywordSpelling: 'engagement',
      keywordExplanation: ['like', 'comment', 'share', 'interaction']
    }
  ];

  const handleChange = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const evaluateSpelling = (userAnswer, correctSpelling) => {
    return userAnswer.toLowerCase().trim() === correctSpelling.toLowerCase();
  };

  const evaluateExplanation = (userAnswer, keywords) => {
    const lowerAnswer = userAnswer.toLowerCase().trim();
    if (lowerAnswer.length < 10) return false; // Too short

    let matches = 0;
    keywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword.toLowerCase())) {
        matches++;
      }
    });
    return matches >= 1; // At least one keyword
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    terms.forEach(term => {
      const spellingCorrect = evaluateSpelling(
        answers[`term${term.id}_spelling`],
        term.correct
      );
      const explanationCorrect = evaluateExplanation(
        answers[`term${term.id}_explanation`],
        term.keywordExplanation
      );

      if (spellingCorrect) calculatedScore += 1;
      if (explanationCorrect) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB2_taskD', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/b2/results');
  };

  const allAnswered = terms.every(term =>
    answers[`term${term.id}_spelling`]?.trim() !== '' &&
    answers[`term${term.id}_explanation`]?.trim() !== ''
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Welcome to Spelling & Explain! For each term, provide the correct spelling AND explain what it means. This tests both your spelling and your understanding of social media vocabulary!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task D: Spelling & Explain
        </Typography>
        <Typography variant="body1" paragraph>
          Spell and explain 6 common social media terms:
        </Typography>

        <Box sx={{ mt: 3 }}>
          {terms.map((term, index) => (
            <Paper
              key={term.id}
              variant="outlined"
              sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}
            >
              <Typography variant="h6" gutterBottom>
                {index + 1}. Faulty Term: <span style={{ color: '#d32f2f', fontStyle: 'italic' }}>"{term.faulty}"</span>
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Correct Spelling"
                    variant="outlined"
                    value={answers[`term${term.id}_spelling`]}
                    onChange={(e) => handleChange(`term${term.id}_spelling`, e.target.value)}
                    disabled={submitted}
                    placeholder="Type correct spelling..."
                  />
                  {submitted && (
                    <Alert
                      severity={evaluateSpelling(answers[`term${term.id}_spelling`], term.correct) ? 'success' : 'error'}
                      sx={{ mt: 1 }}
                    >
                      {evaluateSpelling(answers[`term${term.id}_spelling`], term.correct)
                        ? '✓ Correct spelling!'
                        : `✗ Should be: "${term.correct}"`}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Explanation"
                    variant="outlined"
                    value={answers[`term${term.id}_explanation`]}
                    onChange={(e) => handleChange(`term${term.id}_explanation`, e.target.value)}
                    disabled={submitted}
                    multiline
                    rows={2}
                    placeholder="Explain what this term means..."
                  />
                  {submitted && (
                    <Alert
                      severity={evaluateExplanation(answers[`term${term.id}_explanation`], term.keywordExplanation) ? 'success' : 'info'}
                      sx={{ mt: 1 }}
                    >
                      {evaluateExplanation(answers[`term${term.id}_explanation`], term.keywordExplanation)
                        ? '✓ Good explanation!'
                        : `Include keywords like: ${term.keywordExplanation.join(', ')}`}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        {submitted && (
          <Alert severity={score >= 8 ? 'success' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
              Your Score: {score}/12 points
            </Typography>
            <Typography variant="body2">
              (1 point for spelling + 1 point for explanation = 2 points per term)
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {score >= 8
                ? 'Excellent! You know the spellings and meanings well!'
                : 'Keep practicing! Make sure you can both spell and explain each term.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/b2/task/c')}
            disabled={!submitted}
          >
            Back to Task C
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
              View Results
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskD;
