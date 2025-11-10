import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { coursesAPI } from '../../services/api';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, course: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await coursesAPI.delete(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      setDeleteDialog({ open: false, course: null });
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const openDeleteDialog = (course) => {
    setDeleteDialog({ open: true, course });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, course: null });
  };

  if (loading) return <Typography>Loading courses...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Course Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/create-course')}
        >
          Create Course
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.instructor?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip label={course.category} size="small" />
                </TableCell>
                <TableCell>
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={course.status || 'Active'} 
                    color={course.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(course.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => navigate(`/course/${course.id}`)}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => openDeleteDialog(course)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.course?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(deleteDialog.course?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourseManagement;