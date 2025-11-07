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
      setCourses(response.data.courses);
      setFilteredCourses(response.data.courses);
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
      <Typography variant="h4" gutterBottom>Available Courses</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Discover {courses.length} courses • {filteredCourses.length} results
      </Typography>
      
      <CourseFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={course.thumbnail_url || 'https://via.placeholder.com/300x200?text=Course'}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 1 }}>
                  <Chip 
                    label={course.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {course.description?.substring(0, 120)}...
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {course.instructor?.name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PlayCircleOutline sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {course.lesson_count} lessons
                  </Typography>
                  <Star sx={{ fontSize: 16, ml: 2, mr: 0.5, color: 'warning.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    4.5 (120 reviews)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    {course.price === 0 || course.price === '0' ? 'Free' : `$${course.price}`}
                  </Typography>
                  {course.price !== 0 && course.price !== '0' && (
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                      ${(parseFloat(course.price) * 1.5).toFixed(2)}
                    </Typography>
                  )}
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate(`/course/${course.id}`)}
                  sx={{ mt: 'auto' }}
                >
                  View Course
                </Button>
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