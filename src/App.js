import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './components/Home/HomePage';
import MyCourses from './components/Courses/MyCourses';
import Login from './components/Auth/Login';
import AdminLogin from './components/Auth/AdminLogin';
import Signup from './components/Auth/Signup';
import CourseList from './components/Courses/CourseList';
import CourseDetails from './components/Courses/CourseDetails';
import CreateCourse from './components/Courses/CreateCourse';
import EditCourse from './components/Courses/EditCourse';
import CreateQuiz from './components/Quiz/CreateQuiz';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import UserStats from './components/Progress/UserStats';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminCourseManagement from './components/Admin/AdminCourseManagement';
import AdminCreateCourse from './components/Admin/AdminCreateCourse';
import CertificateGenerator from './components/Certificates/CertificateGenerator';
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

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User restored from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    // Only clear authentication data, preserve user progress
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear only navigation state, not user progress data
    sessionStorage.removeItem('activeTab');
    
    setUser(null);
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                path="/edit-course/:id" 
                element={user?.role === 'instructor' ? <Container maxWidth="lg" sx={{ py: 2 }}><EditCourse /></Container> : <Navigate to="/" />} 
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
                path="/admin-login" 
                element={!user ? <AdminLogin onLogin={handleLogin} /> : <Navigate to="/admin" />} 
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
                path="/admin/courses" 
                element={user?.role === 'admin' ? <Container maxWidth="lg" sx={{ py: 2 }}><AdminCourseManagement /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/admin/create-course" 
                element={user?.role === 'admin' ? <Container maxWidth="lg" sx={{ py: 2 }}><AdminCreateCourse /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/admin/edit-course/:id" 
                element={user?.role === 'admin' ? <Container maxWidth="lg" sx={{ py: 2 }}><EditCourse /></Container> : <Navigate to="/" />} 
              />
              <Route 
                path="/progress/:courseId" 
                element={user ? <Container maxWidth="lg" sx={{ py: 2 }}><ProgressPage /></Container> : <Navigate to="/login" />} 
              />
              <Route 
                path="/my-stats" 
                element={user ? <Container maxWidth="lg" sx={{ py: 2 }}><UserStats /></Container> : <Navigate to="/login" />} 
              />
              <Route 
                path="/certificates" 
                element={user ? <Container maxWidth="lg" sx={{ py: 2 }}><CertificateGenerator user={user} /></Container> : <Navigate to="/login" />} 
              />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;