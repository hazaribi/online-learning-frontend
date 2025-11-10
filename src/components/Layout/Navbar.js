import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import NotificationBell from '../Notifications/NotificationBell';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/');

  useEffect(() => {
    const currentPath = location.pathname;
    let newActiveTab = '/';
    
    // Map paths to navigation tabs
    if (currentPath.startsWith('/create-course') || currentPath.startsWith('/edit-course') || currentPath.startsWith('/create-quiz')) {
      newActiveTab = '/create-course';
    } else if (currentPath.startsWith('/instructor')) {
      newActiveTab = '/instructor';
    } else if (currentPath.startsWith('/my-courses')) {
      newActiveTab = '/my-courses';
    } else if (currentPath.startsWith('/my-stats') || currentPath.startsWith('/progress/')) {
      newActiveTab = '/my-stats';
    } else if (currentPath.startsWith('/courses') || currentPath.startsWith('/course/')) {
      newActiveTab = '/courses';
    } else if (currentPath.startsWith('/admin/courses') || currentPath.startsWith('/admin/create-course') || currentPath.startsWith('/admin/edit-course')) {
      newActiveTab = '/admin/courses';
    } else if (currentPath.startsWith('/admin')) {
      newActiveTab = '/admin';
    } else if (currentPath === '/') {
      newActiveTab = '/';
    }
    
    setActiveTab(newActiveTab);
    sessionStorage.setItem('activeTab', newActiveTab);
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
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/admin')}
                    sx={{ bgcolor: activeTab === '/admin' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/admin/courses')}
                    sx={{ bgcolor: activeTab === '/admin/courses' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  >
                    Manage Courses
                  </Button>
                </>
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