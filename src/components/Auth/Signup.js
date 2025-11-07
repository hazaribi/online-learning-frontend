import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { authAPI } from '../../services/api';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signup(formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onSignup(user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        select
        name="role"
        label="Role"
        value={formData.role}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="student">Student</MenuItem>
        <MenuItem value="instructor">Instructor</MenuItem>
      </TextField>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
      
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
        onClick={() => navigate('/login')}
      >
        Already have an account? Login
      </Button>
    </Box>
  );
};

export default Signup;