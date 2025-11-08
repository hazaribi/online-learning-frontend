import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent,
  Avatar, Chip, Paper, Stack
} from '@mui/material';
import {
  School, TrendingUp, People, Star, PlayArrow, CheckCircle,
  Code, Business, Design, DataObject
} from '@mui/icons-material';

const HomePage = ({ user }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <School />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: <TrendingUp />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics'
    },
    {
      icon: <People />,
      title: 'Community Learning',
      description: 'Connect with learners and instructors worldwide'
    },
    {
      icon: <CheckCircle />,
      title: 'Certificates',
      description: 'Earn certificates upon course completion'
    }
  ];

  const categories = [
    { name: 'Web Development', icon: <Code />, courses: 45, color: '#2196F3' },
    { name: 'Data Science', icon: <DataObject />, courses: 32, color: '#4CAF50' },
    { name: 'Business', icon: <Business />, courses: 28, color: '#FF9800' },
    { name: 'Design', icon: <Design />, courses: 21, color: '#E91E63' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      avatar: 'SJ',
      rating: 5,
      text: 'The courses here transformed my career. The instructors are amazing!'
    },
    {
      name: 'Mike Chen',
      role: 'Data Analyst',
      avatar: 'MC',
      rating: 5,
      text: 'Practical, hands-on learning that I could apply immediately at work.'
    },
    {
      name: 'Emily Davis',
      role: 'UX Designer',
      avatar: 'ED',
      rating: 5,
      text: 'High-quality content and excellent support from the community.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Advance Your Skills with
            <br />
            <Typography component="span" variant="h2" sx={{ color: '#FFD700' }}>
              Expert-Led Courses
            </Typography>
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Join thousands of learners mastering in-demand skills through hands-on courses
            taught by industry experts.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            {!user ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: '#FFD700',
                    color: 'black',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: '#FFC107' }
                  }}
                >
                  Start Learning Today
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/courses')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                  startIcon={<PlayArrow />}
                >
                  Browse Courses
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/courses')}
                sx={{
                  bgcolor: '#FFD700',
                  color: 'black',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Continue Learning
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                10K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Students
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Courses
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                50+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Instructors
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                95%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Success Rate
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Box sx={{ color: '#667eea', mb: 2 }}>
                      {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Popular Categories
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                  onClick={() => navigate('/courses')}
                >
                  <Box sx={{ color: category.color, mb: 2 }}>
                    {React.cloneElement(category.icon, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={`${category.courses} courses`}
                    size="small"
                    sx={{ bgcolor: category.color, color: 'white' }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            What Our Students Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Start Your Learning Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students already learning on our platform
          </Typography>
          {!user ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: '#FFD700',
                color: 'black',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                '&:hover': { bgcolor: '#FFC107' }
              }}
            >
              Get Started Now
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/courses')}
              sx={{
                bgcolor: '#FFD700',
                color: 'black',
                px: 6,
                py: 2,
                fontSize: '1.2rem'
              }}
            >
              Explore Courses
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;