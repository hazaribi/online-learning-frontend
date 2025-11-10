import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import NotificationBell from '../Notifications/NotificationBell';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/');

  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeTab') || location.pathname;
    setActiveTab(savedTab);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    setActiveTab(path);
    sessionStorage.setItem('activeTab', path);
    navigate(path);
  };
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
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/courses')}
                sx={{ bgcolor: activeTab === '/courses' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              >
                Courses
              </Button>
              {user.role === 'student' && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/my-courses')}
                    sx={{ bgcolor: activeTab === '/my-courses' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  >
                    My Courses
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/my-stats')}
                    sx={{ bgcolor: activeTab === '/my-stats' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  >
                    My Progress
                  </Button>
                </>
              )}
              {user.role === 'instructor' && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/instructor')}
                    sx={{ bgcolor: activeTab === '/instructor' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/create-course')}
                    sx={{ bgcolor: activeTab === '/create-course' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  >
                    Create Course
                  </Button>
                </>
              )}
              {user.role === 'admin' && (
                <Button 
                  color="inherit" 
                  onClick={() => handleNavigation('/admin')}
                  sx={{ bgcolor: activeTab === '/admin' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                >
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