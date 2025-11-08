import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardContent, List, ListItem, 
  ListItemText, Button, Chip, Alert 
} from '@mui/material';
import { PlayCircleOutline, Quiz, Person } from '@mui/icons-material';
import { coursesAPI, lessonsAPI, enrollmentAPI } from '../../services/api';
import PaymentForm from '../Payment/PaymentForm';
import VideoPlayer from '../Video/VideoPlayer';
import QuizComponent from '../Quiz/QuizComponent';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentView, setCurrentView] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id, fetchCourseData]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        coursesAPI.getById(id),
        lessonsAPI.getByCourse(id)
      ]);
      
      setCourse(courseRes.data.course);
      setLessons(lessonsRes.data.lessons);
      
      // Check enrollment status
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        try {
          const response = await enrollmentAPI.checkEnrollment(id);
          setEnrolled(response.data.enrolled);
        } catch (error) {
          setEnrolled(false);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    if (enrolled || lesson.is_free) {
      setSelectedLesson(lesson);
      setCurrentView('video');
    }
  };

  const handlePaymentSuccess = () => {
    setEnrolled(true);
    setCurrentView('overview');
  };

  const handleFreeEnrollment = async () => {
    try {
      await enrollmentAPI.enroll(id);
      setEnrolled(true);
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!course) return <Typography>Course not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {currentView === 'overview' && (
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>{course.title}</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>{course.description}</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Person sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Instructor: {course.instructor?.name}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>Course Content</Typography>
                <List>
                  {lessons.map((lesson, index) => (
                    <ListItem 
                      key={lesson.id}
                      button={enrolled || lesson.is_free}
                      onClick={() => handleLessonSelect(lesson)}
                      sx={{ 
                        border: 1, 
                        borderColor: 'grey.200', 
                        mb: 1, 
                        borderRadius: 1,
                        opacity: (enrolled || lesson.is_free) ? 1 : 0.6
                      }}
                    >
                      <PlayCircleOutline sx={{ mr: 2 }} />
                      <ListItemText
                        primary={lesson.title}
                        secondary={`${Math.floor(lesson.duration / 60)} minutes`}
                      />
                      {lesson.is_free && <Chip label="Free" size="small" />}
                    </ListItem>
                  ))}
                </List>

                {enrolled && (
                  <Button
                    variant="outlined"
                    startIcon={<Quiz />}
                    onClick={() => setCurrentView('quiz')}
                    sx={{ mt: 2 }}
                  >
                    Take Quiz
                  </Button>
                )}
                
                {/* Instructor can create quiz */}
                {JSON.parse(localStorage.getItem('user') || '{}').role === 'instructor' && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/create-quiz/${id}`)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    Create Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {currentView === 'video' && selectedLesson && (
            <VideoPlayer 
              lesson={selectedLesson}
              onProgress={(data) => console.log('Progress:', data)}
            />
          )}

          {currentView === 'quiz' && (
            <QuizComponent 
              courseId={id}
              onComplete={(result) => console.log('Quiz completed:', result)}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {!enrolled ? (
            <Box>
              {course.price === 0 || course.price === '0' ? (
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Free Course
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleFreeEnrollment}
                  >
                    Enroll Now - Free
                  </Button>
                </Card>
              ) : (
                <PaymentForm course={course} onSuccess={handlePaymentSuccess} />
              )}
            </Box>
          ) : (
            <Alert severity="success">
              You are enrolled in this course!
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetails;