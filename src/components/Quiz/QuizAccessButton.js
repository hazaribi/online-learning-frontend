import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { Quiz, Lock } from '@mui/icons-material';
import { progressAPI, lessonsAPI } from '../../services/api';

const QuizAccessButton = ({ courseId, onQuizAccess }) => {
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [canTakeQuiz, setCanTakeQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLessonCompletion();
  }, [courseId]);

  const checkLessonCompletion = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Get all lessons for the course
      const lessonsRes = await lessonsAPI.getByCourse(courseId);
      const lessons = lessonsRes.data.lessons;
      setTotalLessons(lessons.length);

      if (lessons.length === 0) {
        setCanTakeQuiz(true);
        setLoading(false);
        return;
      }

      // Get progress for each lesson
      const progressRes = await progressAPI.get(user.id, courseId);
      const completedLessons = progressRes.data.lessons_completed || 0;
      
      setLessonsCompleted(completedLessons);
      setCanTakeQuiz(completedLessons === lessons.length);
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      setCanTakeQuiz(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress sx={{ mt: 2 }} />;
  }

  const completionPercentage = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Lesson Progress: {lessonsCompleted}/{totalLessons} completed
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {canTakeQuiz ? (
        <Button
          variant="outlined"
          startIcon={<Quiz />}
          onClick={onQuizAccess}
          color="primary"
        >
          Take Quiz
        </Button>
      ) : (
        <Tooltip title="Complete all lessons to unlock the quiz">
          <span>
            <Button
              variant="outlined"
              startIcon={<Lock />}
              disabled
              sx={{ opacity: 0.6 }}
            >
              Quiz Locked ({Math.round(completionPercentage)}% complete)
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default QuizAccessButton;