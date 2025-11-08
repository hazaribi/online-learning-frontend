import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import NotificationBell from '../Notifications/NotificationBell';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Learning Platform
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          alignItems: 'center',
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/courses')}>
                Courses
              </Button>
              {user.role === 'student' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/my-courses')}>
                    My Courses
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/my-stats')}>
                    My Progress
                  </Button>
                </>
              )}
              {user.role === 'instructor' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/instructor')}>
                    Dashboard
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/create-course')}>
                    Create Course
                  </Button>
                </>
              )}
              {user.role === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  Admin
                </Button>
              )}
              <NotificationBell />
              <Typography 
                variant="body1" 
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  whiteSpace: 'nowrap'
                }}
              >
                Welcome, {user.name.split(' ')[0]}
              </Typography>
              <Button color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/admin-login')}
                sx={{ 
                  border: '1px solid currentColor',
                  ml: 1,
                  fontSize: '0.875rem'
                }}
              >
                Admin
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;