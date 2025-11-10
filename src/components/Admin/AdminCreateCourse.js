import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, MenuItem, Divider, Autocomplete } from '@mui/material';
import { coursesAPI, lessonsAPI, authAPI } from '../../services/api';
import VideoUpload from '../Video/VideoUpload';

const AdminCreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail_url: '',
    instructor_id: ''
  });
  const [lessons, setLessons] = useState([{ title: '', description: '', video_url: '', order_index: 1 }]);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const navigate = useNavigate();

  const categories = ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business', 'Other'];

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      // Fetch users with instructor role
      const response = await authAPI.getProfile(); // This would need to be updated to get all instructors
      // For now, we'll use a placeholder
      setInstructors([]);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category' && value === 'Other') {
      setShowCustomCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === 'category') {
        setShowCustomCategory(false);
        setCustomCategory('');
      }
    }
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    setFormData({ ...formData, category: value });
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = value;
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', description: '', video_url: '', order_index: lessons.length + 1 }]);
  };

  const removeLesson = (index) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const handleVideoUpload = (index, videoUrl) => {
    handleLessonChange(index, 'video_url', videoUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const courseResponse = await coursesAPI.create(formData);
      const course = courseResponse.data.course || courseResponse.data;
      
      // Create lessons for the course
      for (const lesson of lessons) {
        if (lesson.title && lesson.video_url) {
          await lessonsAPI.create({
            ...lesson,
            course_id: course.id
          });
        }
      }
      
      navigate('/admin/courses');
    } catch (error) {
      console.error('Course creation error:', error);
      setError(error.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create New Course (Admin)</Typography>
      
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
        value={showCustomCategory ? 'Other' : formData.category}
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
      
      {showCustomCategory && (
        <TextField
          fullWidth
          name="customCategory"
          label="Enter Custom Category"
          value={customCategory}
          onChange={handleCustomCategoryChange}
          margin="normal"
          required
          placeholder="e.g., Photography, Music, etc."
        />
      )}

      <TextField
        fullWidth
        name="instructor_id"
        label="Instructor ID (Optional - leave empty to assign to current admin)"
        value={formData.instructor_id}
        onChange={handleChange}
        margin="normal"
        placeholder="Enter instructor user ID"
      />
      
      <TextField
        fullWidth
        name="thumbnail_url"
        label="Thumbnail URL"
        value={formData.thumbnail_url}
        onChange={handleChange}
        margin="normal"
        placeholder="https://example.com/image.jpg"
      />
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h5" gutterBottom>Course Lessons</Typography>
      
      {lessons.map((lesson, index) => (
        <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Lesson {index + 1}
          </Typography>
          
          <TextField
            fullWidth
            label="Lesson Title"
            value={lesson.title}
            onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Lesson Description"
            value={lesson.description}
            onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
          
          <VideoUpload
            onUploadComplete={(videoUrl) => handleVideoUpload(index, videoUrl)}
            existingVideoUrl={lesson.video_url}
          />
          
          {lessons.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeLesson(index)}
              sx={{ mt: 1 }}
            >
              Remove Lesson
            </Button>
          )}
        </Box>
      ))}
      
      <Button
        variant="outlined"
        onClick={addLesson}
        sx={{ mb: 3 }}
      >
        Add Another Lesson
      </Button>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/admin/courses')}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{ flex: 1 }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminCreateCourse;