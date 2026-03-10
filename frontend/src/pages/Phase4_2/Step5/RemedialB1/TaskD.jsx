import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskD = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_b1' });
  const [flippedCards, setFlippedCards] = useState({});
  const [markedAsLearned, setMarkedAsLearned] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const flashcards = [
    {
      id: 'card1',
      front: 'hashteg',
      back: 'hashtag',
      explanation: 'A hashtag (#) is used to categorize posts on social media'
    },
    {
      id: 'card2',
      front: 'emogi',
      back: 'emoji',
      explanation: 'Emoji are small digital images or icons used to express emotions'
    },
    {
      id: 'card3',
      front: 'your coming?',
      back: 'are you coming?',
      explanation: 'Correct question formation requires auxiliary verb "are"'
    },
    {
      id: 'card4',
      front: 'post it in story',
      back: 'post it to your story',
      explanation: 'Use "to" (not "in") and specify "your story"'
    },
    {
      id: 'card5',
      front: 'tag you\'re friend',
      back: 'tag your friend',
      explanation: 'Use "your" (possessive) not "you\'re" (you are)'
    },
    {
      id: 'card6',
      front: 'very good post',
      back: 'excellent post',
      explanation: 'Use more sophisticated vocabulary: "excellent" instead of "very good"'
    },
    {
      id: 'card7',
      front: 'click for more',
      back: 'swipe up for more',
      explanation: 'Platform-specific language: Instagram Stories use "swipe up"'
    },
    {
      id: 'card8',
      front: 'follow at Instagram',
      back: 'follow us on Instagram',
      explanation: 'Use "on" (not "at") and include "us" for clarity'
    }
  ];

  const handleFlip = (cardId) => {
    setFlippedCards({ ...flippedCards, [cardId]: !flippedCards[cardId] });
  };

  const handleMarkLearned = (cardId, checked) => {
    setMarkedAsLearned({ ...markedAsLearned, [cardId]: checked });
  };

  const handleSubmit = () => {
    const score = Object.values(markedAsLearned).filter(Boolean).length;
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskD', score.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/b1/results');
  };

  const score = Object.values(markedAsLearned).filter(Boolean).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Time for Quizlet Flashcards! Click each card to flip it and see the correction. Mark cards as 'learned' when you understand the correction. This is a self-assessment activity!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task D: Quizlet Flashcards
        </Typography>
        <Typography variant="body1" paragraph>
          Click each card to reveal the correct version and explanation. Mark the cards you've learned!
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
            mt: 3
          }}
        >
          {flashcards.map((card) => (
            <Box key={card.id}>
              <Card
                onClick={() => handleFlip(card.id)}
                sx={{
                  minHeight: 200,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  bgcolor: flippedCards[card.id] ? '#e3f2fd' : '#ffebee',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
                elevation={3}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  {!flippedCards[card.id] ? (
                    <>
                      <Typography variant="h6" color="error" sx={{ mb: 1, textAlign: 'center' }}>
                        Faulty Version:
                      </Typography>
                      <Typography variant="h5" sx={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold' }}>
                        "{card.front}"
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                        Click to flip
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" color="success.main" sx={{ mb: 1, textAlign: 'center' }}>
                        Correct Version:
                      </Typography>
                      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                        "{card.back}"
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                        {card.explanation}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
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
          <Alert severity={score >= 6 ? 'success' : 'info'} sx={{ mt: 4 }}>
            <Typography variant="h6">
              Cards Learned: {score}/8
            </Typography>
            <Typography variant="body2">
              {score >= 6
                ? 'Great progress! You\'ve learned most of the corrections.'
                : 'Keep studying! Review the cards you haven\'t marked as learned.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/b1/task/c')}
            disabled={!submitted}
          >
            Back to Task C
          </Button>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
            >
              Complete Task D
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
