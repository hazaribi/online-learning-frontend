import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  List, ListItem, ListItemText, LinearProgress, Chip
} from '@mui/material';
import { School, Quiz, TrendingUp, CheckCircle } from '@mui/icons-material';
import { progressAPI } from '../../services/api';

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await progressAPI.getStats(userId);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
            {stats.enrollments.map((enrollment) => (
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
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserStats;