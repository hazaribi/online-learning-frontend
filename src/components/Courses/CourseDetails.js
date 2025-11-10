import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardContent, List, ListItem, 
  ListItemText, Button, Chip, Alert 
} from '@mui/material';
import { PlayCircleOutline, Quiz, Person } from '@mui/icons-material';
import { coursesAPI, lessonsAPI, enrollmentAPI, progressAPI } from '../../services/api';
import PaymentForm from '../Payment/PaymentForm';
import VideoPlayer from '../Video/VideoPlayer';
import QuizComponent from '../Quiz/QuizComponent';
import QuizAccessButton from '../Quiz/QuizAccessButton';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentView, setCurrentView] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchCourseData();
    
    // Check for payment success
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      setEnrolled(true);
      // Remove payment param from URL
      navigate(`/course/${id}`, { replace: true });
    }
  }, [id, searchParams, navigate]);

  const fetchCourseData = React.useCallback(async () => {
    try {
      // Use cache to prevent duplicate requests
      const cacheKey = `course_${id}`;
      const cached = sessionStorage.getItem(cacheKey);
      const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
      
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 120000) {
        const data = JSON.parse(cached);
        setCourse(data.course);
        setLessons(data.lessons);
        setEnrolled(data.enrolled);
        setLoading(false);
        return;
      }
      
      const [courseRes, lessonsRes] = await Promise.all([
        coursesAPI.getById(id),
        lessonsAPI.getByCourse(id)
      ]);
      
      setCourse(courseRes.data.course);
      setLessons(lessonsRes.data.lessons);
      
      // Check enrollment status
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      let enrolled = false;
      if (user.id) {
        try {
          const response = await enrollmentAPI.checkEnrollment(id);
          enrolled = response.data.enrolled;
          setEnrolled(enrolled);
        } catch (error) {
          setEnrolled(false);
        }
      }
      
      // Cache the result
      const cacheData = {
        course: courseRes.data.course,
        lessons: lessonsRes.data.lessons,
        enrolled
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  const handleVideoProgress = async (progressData) => {
    // Only track completion, not continuous progress
    if (!progressData.completed) {
      return;
    }
    
    try {
      // Check if already completed to prevent duplicates
      const completionKey = `completed_${progressData.lesson_id}`;
      if (sessionStorage.getItem(completionKey)) {
        return;
      }
      
      await progressAPI.update(progressData);
      sessionStorage.setItem(completionKey, 'true');
      
      // Clear caches and refresh
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const courseKey = `course_${id}`;
      const progressKey = `lesson_progress_${id}_${user.id}`;
      
      sessionStorage.removeItem(courseKey);
      sessionStorage.removeItem(`${courseKey}_time`);
      sessionStorage.removeItem(progressKey);
      sessionStorage.removeItem(`${progressKey}_time`);
      
      setTimeout(() => {
        fetchCourseData();
      }, 3000);
      
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleFreeEnrollment = async () => {
    try {
      console.log('Attempting to enroll in course:', id);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        navigate('/login');
        return;
      }
      
      const response = await enrollmentAPI.enroll(id);
      console.log('Enrollment response:', response);
      setEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Typography variant="h6">Loading course details...</Typography>
    </Box>
  );
  
  if (!course) return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h5" gutterBottom>Course not found</Typography>
      <Button variant="contained" onClick={() => navigate('/courses')}>Browse Courses</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          variant="text" 
          onClick={() => navigate('/courses')}
          sx={{ textTransform: 'none' }}
        >
          ← Back to Courses
        </Button>
        <Typography variant="body2" color="text.secondary">/ {course.title}</Typography>
      </Box>
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
                  <QuizAccessButton courseId={id} onQuizAccess={() => setCurrentView('quiz')} />
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
              onProgress={handleVideoProgress}
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
          {paymentSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              🎉 Payment successful! You are now enrolled in this course.
            </Alert>
          )}
          
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