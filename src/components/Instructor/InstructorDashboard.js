import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { coursesAPI } from '../../services/api';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business'];

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await coursesAPI.getByInstructor(user.id);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      thumbnail_url: course.thumbnail_url || '',
      status: course.status
    });
    setEditDialog(true);
  };

  const handleUpdate = async () => {
    try {
      await coursesAPI.update(selectedCourse.id, formData);
      setEditDialog(false);
      fetchMyCourses();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update course');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await coursesAPI.delete(courseId);
        fetchMyCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handlePublish = async (courseId) => {
    try {
      await coursesAPI.update(courseId, { status: 'published' });
      fetchMyCourses();
    } catch (error) {
      console.error('Error publishing course:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Instructor Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/create-course')}
        >
          Create New Course
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4">{courses.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                {courses.filter(c => c.status === 'published').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                {courses.filter(c => c.status === 'draft').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Draft Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Courses Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>My Courses</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>${course.price}</TableCell>
                    <TableCell>
                      <Chip 
                        label={course.status} 
                        color={getStatusColor(course.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/course/${course.id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(course)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(course.id)}>
                        <Delete />
                      </IconButton>
                      {course.status === 'draft' && (
                        <Button
                          size="small"
                          onClick={() => handlePublish(course.id)}
                        >
                          Publish
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            name="title"
            label="Course Title"
            value={formData.title || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            margin="normal"
          />
          
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            margin="normal"
            multiline
            rows={3}
          />
          
          <TextField
            fullWidth
            name="price"
            label="Price ($)"
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            margin="normal"
          />
          
          <TextField
            fullWidth
            select
            name="category"
            label="Category"
            value={formData.category || ''}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            margin="normal"
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
            value={formData.thumbnail_url || ''}
            onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorDashboard;