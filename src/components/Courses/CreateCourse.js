import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { coursesAPI } from '../../services/api';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail_url: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business'];

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
      await coursesAPI.create(formData);
      navigate('/courses');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create New Course</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        name="title"
        label="Course Title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
        required
      />
      
      <TextField
        fullWidth
        name="price"
        label="Price ($)"
        type="number"
        value={formData.price}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        select
        name="category"
        label="Category"
        value={formData.category}
        onChange={handleChange}
        margin="normal"
        required
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
      
      <TextField
        fullWidth
        name="thumbnail_url"
        label="Thumbnail URL"
        value={formData.thumbnail_url}
        onChange={handleChange}
        margin="normal"
        placeholder="https://example.com/image.jpg"
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Course'}
      </Button>
    </Box>
  );
};

export default CreateCourse;