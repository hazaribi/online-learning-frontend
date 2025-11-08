import React from 'react';
import { Box, Typography, Container, Grid, Link } from '@mui/material';
import { School, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <School sx={{ mr: 1 }} />
              <Typography variant="h6">Learning Platform</Typography>
            </Box>
            <Typography variant="body2">
              Empowering learners worldwide with quality online education.
              Join thousands of students and instructors in our learning community.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/courses" color="inherit" underline="hover">Browse Courses</Link>
              <Link href="/signup" color="inherit" underline="hover">Become a Student</Link>
              <Link href="/signup" color="inherit" underline="hover">Teach on Platform</Link>
              <Link href="/about" color="inherit" underline="hover">About Us</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Categories</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/courses?category=Programming" color="inherit" underline="hover">Programming</Link>
              <Link href="/courses?category=Web Development" color="inherit" underline="hover">Web Development</Link>
              <Link href="/courses?category=Data Science" color="inherit" underline="hover">Data Science</Link>
              <Link href="/courses?category=Design" color="inherit" underline="hover">Design</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Contact</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">support@learningplatform.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">San Francisco, CA</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: 1, borderColor: 'rgba(255,255,255,0.2)', mt: 4, pt: 3 }}>
          <Typography variant="body2" align="center">
            © 2025 Learning Platform. All rights reserved. | Privacy Policy | Terms of Service
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;