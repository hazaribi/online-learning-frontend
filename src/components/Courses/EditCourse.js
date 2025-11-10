import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, MenuItem, Divider } from '@mui/material';
import { coursesAPI, lessonsAPI } from '../../services/api';
import VideoUpload from '../Video/VideoUpload';

const EditCourse = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail_url: ''
  });
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const navigate = useNavigate();

  const categories = ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business', 'Other'];

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        coursesAPI.getById(id),
        lessonsAPI.getByCourse(id)
      ]);
      
      const course = courseRes.data.course;
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        thumbnail_url: course.thumbnail_url || ''
      });
      
      const courseLessons = lessonsRes.data.lessons || [];
      setLessons(courseLessons.length > 0 ? courseLessons : [{ title: '', description: '', video_url: '', order_index: 1 }]);
      
      // Check if category is custom
      if (!categories.includes(course.category) && course.category !== 'Other') {
        setShowCustomCategory(true);
        setCustomCategory(course.category);
      }
    } catch (error) {
      setError('Failed to load course data');
    } finally {
      setFetchLoading(false);
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
      // Update course
      await coursesAPI.update(id, formData);
      
      // Update lessons
      for (const lesson of lessons) {
        if (lesson.title && lesson.video_url) {
          if (lesson.id) {
            // Update existing lesson
            await lessonsAPI.update(lesson.id, {
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url,
              order_index: lesson.order_index
            });
          } else {
            // Create new lesson
            await lessonsAPI.create({
              ...lesson,
              course_id: id
            });
          }
        }
      }
      
      navigate(`/course/${id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Typography>Loading course data...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Course</Typography>
      
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
          onClick={() => navigate(`/course/${id}`)}
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
          {loading ? 'Updating...' : 'Update Course'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditCourse;