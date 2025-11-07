import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CourseList from './components/Courses/CourseList';
import CourseDetails from './components/Courses/CourseDetails';
import CreateCourse from './components/Courses/CreateCourse';
import CreateQuiz from './components/Quiz/CreateQuiz';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import UserStats from './components/Progress/UserStats';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProgressPage from './components/Progress/ProgressPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar user={user} onLogout={handleLogout} />
          <Container maxWidth="lg" sx={{ flex: 1, py: 2 }}>
            <Routes>
              <Route path="/" element={<CourseList />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/course/:id" element={<PaymentSuccess />} />
              <Route 
                path="/create-course" 
                element={user?.role === 'instructor' ? <CreateCourse /> : <Navigate to="/" />} 
              />
              <Route 
                path="/instructor" 
                element={user?.role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/" />} 
              />
              <Route 
                path="/create-quiz/:courseId" 
                element={user?.role === 'instructor' ? <CreateQuiz /> : <Navigate to="/" />} 
              />
              <Route 
                path="/login" 
                element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/signup" 
                element={!user ? <Signup onSignup={handleSignup} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
              <Route 
                path="/progress/:courseId" 
                element={user ? <ProgressPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/my-stats" 
                element={user ? <UserStats userId={user.id} /> : <Navigate to="/login" />} 
              />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;