import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Radio, RadioGroup, 
  FormControlLabel, Button, Alert, LinearProgress 
} from '@mui/material';
import axios from 'axios';

const QuizComponent = ({ courseId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/quiz/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/quiz/submit', {
        quiz_id: quiz.id,
        answers: Object.values(answers)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResult(response.data);
      setSubmitted(true);
      
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!quiz) {
    return <Typography>No quiz available for this course.</Typography>;
  }

  if (submitted && result) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity={result.passed ? 'success' : 'error'} sx={{ mb: 3 }}>
          {result.passed ? 'Congratulations! You passed!' : 'You need to retake the quiz.'}
        </Alert>
        
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Quiz Results</Typography>
            <Typography variant="h6" color="primary">
              Score: {result.score}%
            </Typography>
            <Typography variant="body1">
              Correct Answers: {result.correct_answers} / {result.total_questions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Passing Score: {quiz.passing_score}%
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
      
      {quiz.questions.map((question, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {index + 1}. {question.question}
            </Typography>
            
            <RadioGroup
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              {question.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={optionIndex.toString()}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== quiz.questions.length}
        fullWidth
      >
        Submit Quiz
      </Button>
    </Box>
  );
};

export default QuizComponent;