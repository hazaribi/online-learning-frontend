import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, LinearProgress, Card, CardContent, 
  List, ListItem, ListItemText, Chip 
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { progressAPI } from '../../services/api';

const ProgressTracker = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [userId, courseId]);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await progressAPI.get(userId, courseId);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!progress) {
    return <Typography>No progress data available.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Course Progress</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress.overall_progress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress.overall_progress)}%
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Enrolled: {new Date(progress.enrolled_at).toLocaleDateString()}
          </Typography>
          
          {progress.completed_at && (
            <Chip 
              label="Completed" 
              color="success" 
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Lesson Progress</Typography>
          
          <List>
            {progress.lesson_progress.map((lessonProg, index) => (
              <ListItem key={lessonProg.lesson_id}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {lessonProg.completed ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <RadioButtonUnchecked color="disabled" sx={{ mr: 1 }} />
                      )}
                      {lessonProg.lessons?.title || `Lesson ${index + 1}`}
                    </Box>
                  }
                  secondary={
                    lessonProg.lessons?.duration && (
                      <Typography variant="caption">
                        Watched: {Math.floor(lessonProg.watched_duration / 60)}m / 
                        {Math.floor(lessonProg.lessons.duration / 60)}m
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProgressTracker;