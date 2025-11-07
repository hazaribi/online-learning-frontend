import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  IconButton, Alert, Divider
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';

const CreateQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState({
    title: '',
    passing_score: 70,
    questions: [
      {
        question: '',
        options: ['', ''],
        correct_answer: 0
      }
    ]
  });

  const handleQuizChange = (field, value) => {
    setQuizData({
      ...quizData,
      [field]: value
    });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          options: ['', ''],
          correct_answer: 0
        }
      ]
    });
  };

  const removeQuestion = (questionIndex) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, index) => index !== questionIndex);
      setQuizData({
        ...quizData,
        questions: updatedQuestions
      });
    }
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push('');
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      // Adjust correct answer if needed
      if (updatedQuestions[questionIndex].correct_answer >= optionIndex) {
        updatedQuestions[questionIndex].correct_answer = Math.max(0, updatedQuestions[questionIndex].correct_answer - 1);
      }
      setQuizData({
        ...quizData,
        questions: updatedQuestions
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/quiz/create', {
        ...quizData,
        course_id: courseId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate(`/course/${courseId}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Create Quiz</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Quiz Settings</Typography>
            
            <TextField
              fullWidth
              label="Quiz Title"
              value={quizData.title}
              onChange={(e) => handleQuizChange('title', e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Passing Score (%)"
              type="number"
              value={quizData.passing_score}
              onChange={(e) => handleQuizChange('passing_score', parseInt(e.target.value))}
              margin="normal"
              inputProps={{ min: 0, max: 100 }}
              required
            />
          </CardContent>
        </Card>

        {quizData.questions.map((question, questionIndex) => (
          <Card key={questionIndex} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Question {questionIndex + 1}</Typography>
                {quizData.questions.length > 1 && (
                  <IconButton onClick={() => removeQuestion(questionIndex)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                label="Question Text"
                value={question.question}
                onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                margin="normal"
                multiline
                rows={2}
                required
              />

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Options:</Typography>
              
              {question.options.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                    margin="dense"
                    required
                  />
                  
                  <Button
                    variant={question.correct_answer === optionIndex ? 'contained' : 'outlined'}
                    color="success"
                    size="small"
                    onClick={() => handleQuestionChange(questionIndex, 'correct_answer', optionIndex)}
                    sx={{ ml: 1, minWidth: 80 }}
                  >
                    {question.correct_answer === optionIndex ? 'Correct' : 'Mark'}
                  </Button>
                  
                  {question.options.length > 2 && (
                    <IconButton 
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                startIcon={<Add />}
                onClick={() => addOption(questionIndex)}
                size="small"
                sx={{ mt: 1 }}
              >
                Add Option
              </Button>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addQuestion}
          >
            Add Question
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateQuiz;