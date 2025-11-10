import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, MenuItem, Divider } from '@mui/material';
import { coursesAPI, lessonsAPI } from '../../services/api';
import VideoUpload from '../Video/VideoUpload';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail_url: ''
  });
  const [lessons, setLessons] = useState([{ title: '', description: '', video_url: '', order_index: 1 }]);
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
      
      navigate('/courses');
    } catch (error) {
      console.error('Course creation error:', error);
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