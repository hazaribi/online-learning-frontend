import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, 
  Button, LinearProgress, Chip 
} from '@mui/material';
import { PlayCircleOutline, CheckCircle } from '@mui/icons-material';
import { enrollmentAPI } from '../../services/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await enrollmentAPI.getMyCourses();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching my courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading your courses...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          variant="text" 
          onClick={() => navigate('/courses')}
          sx={{ textTransform: 'none' }}
        >
          ← Browse More Courses
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>My Enrolled Courses</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {courses.length} enrolled courses
      </Typography>

      {courses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses enrolled yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={course.thumbnail_url || `https://picsum.photos/400/200?random=${course.id}`}
                  alt={course.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PlayCircleOutline sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.lesson_count || 0} lessons
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">
                        {course.progress || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {course.progress === 100 && (
                    <Chip 
                      icon={<CheckCircle />}
                      label="Completed" 
                      color="success" 
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}

                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/course/${course.id}`);
                    }}
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyCourses;