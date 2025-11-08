import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './components/Home/HomePage';
import MyCourses from './components/Courses/MyCourses';
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
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/courses" element={<Container maxWidth="lg" sx={{ py: 2 }}><CourseList /></Container>} />
              <Route path="/my-courses" element={user ? <Container maxWidth="lg" sx={{ py: 2 }}><MyCourses /></Container> : <Navigate to="/login" />} />
              <Route path="/course/:id" element={<Container maxWidth="lg" sx={{ py: 2 }}><CourseDetails /></Container>} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route 
                path="/create-course" 
                element={user?.role === 'instructor' ? <Container maxWidth="lg" sx={{ py: 2 }}><CreateCourse /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/instructor" 
                element={user?.role === 'instructor' ? <Container maxWidth="lg" sx={{ py: 2 }}><InstructorDashboard /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/create-quiz/:courseId" 
                element={user?.role === 'instructor' ? <CreateQuiz /> : <Navigate to="/" />} 
              />
              <Route 
                path="/login" 
                element={!user ? <Container maxWidth="lg" sx={{ py: 2 }}><Login onLogin={handleLogin} /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/signup" 
                element={!user ? <Container maxWidth="lg" sx={{ py: 2 }}><Signup onSignup={handleSignup} /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <Container maxWidth="lg" sx={{ py: 2 }}><AdminDashboard /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/progress/:courseId" 
                element={user ? <Container maxWidth="lg" sx={{ py: 2 }}><ProgressPage /></Container> : <Navigate to="/login" />} 
              />
              <Route 
                path="/my-stats" 
                element={user ? <Container maxWidth="lg" sx={{ py: 2 }}><UserStats userId={user.id} /></Container> : <Navigate to="/login" />} 
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;