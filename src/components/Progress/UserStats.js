import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  List, ListItem, ListItemText, LinearProgress, Chip
} from '@mui/material';
import { School, Quiz, TrendingUp, CheckCircle } from '@mui/icons-material';
import { progressAPI, enrollmentAPI } from '../../services/api';

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      // Try the stats/me endpoint first
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/progress/stats/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Stats response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Stats data:', data);
        setStats(data);
        return;
      }
      
      // If stats endpoint fails, fall back to enrollment data
      console.log('Stats endpoint failed, using enrollment data');
      const enrollmentResponse = await enrollmentAPI.getMyCourses();
      console.log('Enrollment response:', enrollmentResponse.data);
      
      const enrollments = enrollmentResponse.data.enrollments || [];
      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter(e => e.completed_at).length;
      const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
      
      // Try to get quiz data
      let totalQuizzes = 0;
      let averageScore = 0;
      let quizPassRate = 0;
      
      try {
        const quizResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/quiz/my-attempts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          const attempts = quizData.attempts || [];
          totalQuizzes = attempts.length;
          
          if (attempts.length > 0) {
            const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
            averageScore = Math.round(totalScore / attempts.length);
            const passedQuizzes = attempts.filter(attempt => attempt.passed).length;
            quizPassRate = Math.round((passedQuizzes / attempts.length) * 100);
          }
        }
      } catch (quizError) {
        console.log('Quiz data not available:', quizError.message);
      }
      
      const stats = {
        total_courses: totalCourses,
        completed_courses: completedCourses,
        completion_rate: completionRate,
        total_quizzes: totalQuizzes,
        quiz_pass_rate: quizPassRate,
        average_score: averageScore,
        enrollments: enrollments
      };
      
      console.log('Calculated stats from enrollment:', stats);
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_courses: 0,
        completed_courses: 0,
        completion_rate: 0,
        total_quizzes: 0,
        quiz_pass_rate: 0,
        average_score: 0,
        enrollments: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LinearProgress />;
  if (!stats) return <Typography>No statistics available.</Typography>;

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ color, mr: 2 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4">{value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Learning Statistics</Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses Enrolled"
            value={stats.total_courses}
            icon={<School />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses Completed"
            value={stats.completed_courses}
            icon={<CheckCircle />}
            color="success.main"
            subtitle={`${stats.completion_rate}% completion rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quizzes Taken"
            value={stats.total_quizzes}
            icon={<Quiz />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={`${stats.average_score}%`}
            icon={<TrendingUp />}
            color="warning.main"
            subtitle={`${stats.quiz_pass_rate}% pass rate`}
          />
        </Grid>
      </Grid>

      {/* Course Progress */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Course Progress</Typography>
          
          <List>
            {stats.enrollments && stats.enrollments.length > 0 ? stats.enrollments.map((enrollment) => (
              <ListItem key={enrollment.course_id}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">
                        {enrollment.courses?.title || 'Course'}
                      </Typography>
                      {enrollment.completed_at && (
                        <Chip label="Completed" color="success" size="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={enrollment.progress} 
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ minWidth: 35 }}>
                          {Math.round(enrollment.progress)}%
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            )) : (
              <ListItem>
                <ListItemText
                  primary="No enrolled courses found"
                  secondary="Enroll in courses to see your progress here"
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserStats;