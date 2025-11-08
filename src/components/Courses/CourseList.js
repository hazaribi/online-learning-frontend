import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Star, Person, PlayCircleOutline } from '@mui/icons-material';
import { coursesAPI } from '../../services/api';
import CourseFilters from './CourseFilters';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'newest',
    priceRange: [0, 200],
    freeOnly: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, courses]);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      console.log('API Response:', response.data);
      const coursesData = response.data.courses || [];
      console.log('Courses:', coursesData);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...courses];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Free only filter
    if (filters.freeOnly) {
      filtered = filtered.filter(course => course.price === 0 || course.price === '0');
    }

    // Price range filter
    filtered = filtered.filter(course => {
      const price = parseFloat(course.price) || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sort
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredCourses(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, courses]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Typography>Loading courses...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Discover Amazing Courses
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {courses.length} expert-led courses • {filteredCourses.length} matching your search
        </Typography>
        <Box sx={{ 
          width: 60, 
          height: 4, 
          bgcolor: '#1976d2', 
          mx: 'auto', 
          borderRadius: 2 
        }} />
      </Box>
      
      <CourseFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderRadius: 3,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnail_url || `https://picsum.photos/400/200?random=${course.id}`}
                  alt={course.title}
                  sx={{
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: course.price === 0 ? 'success.main' : 'primary.main',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {course.price === 0 || course.price === '0' ? 'FREE' : `$${course.price}`}
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={course.category || 'General'} 
                    size="small" 
                    sx={{
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 'bold',
                      border: 'none'
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    lineHeight: 1.3,
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {course.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3, 
                    flexGrow: 1,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {course.description || 'Comprehensive course covering essential topics and practical skills.'}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Person sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {course.instructor?.name || 'Expert Instructor'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PlayCircleOutline sx={{ fontSize: 18, mr: 0.5, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.lesson_count || '12'} lessons
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 18, mr: 0.5, color: 'warning.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        4.8 (245)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                        {course.price === 0 || course.price === '0' ? 'FREE' : `$${course.price}`}
                      </Typography>
                      {course.price !== 0 && course.price !== '0' && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          ${(parseFloat(course.price) * 1.8).toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                    {course.price !== 0 && course.price !== '0' && (
                      <Chip 
                        label="BESTSELLER" 
                        size="small" 
                        sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }}
                      />
                    )}
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    size="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/course/${course.id}`);
                    }}
                    sx={{ 
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                      }
                    }}
                  >
                    Enroll Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredCourses.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No courses found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CourseList;