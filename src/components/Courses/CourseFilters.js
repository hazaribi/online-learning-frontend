import React from 'react';
import { 
  Box, TextField, MenuItem, Chip, FormControl, 
  InputLabel, Select, Slider, Typography 
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

const CourseFilters = ({ filters, onFilterChange }) => {
  const categories = [
    'All Categories',
    'Programming', 
    'Web Development', 
    'Mobile Development', 
    'Data Science', 
    'Design', 
    'Business'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value === 'All Categories' ? '' : e.target.value;
    onFilterChange({ ...filters, category });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value });
  };

  const handlePriceChange = (e, newValue) => {
    onFilterChange({ ...filters, priceRange: newValue });
  };

  const handleFreeOnlyChange = () => {
    onFilterChange({ ...filters, freeOnly: !filters.freeOnly });
  };

  return (
    <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6">Filter Courses</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        {/* Search */}
        <TextField
          placeholder="Search courses..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 250 }}
          size="small"
        />

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category || 'All Categories'}
            onChange={handleCategoryChange}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'newest'}
            onChange={handleSortChange}
            label="Sort By"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Free Only Filter */}
        <Chip
          label="Free Only"
          onClick={handleFreeOnlyChange}
          color={filters.freeOnly ? 'primary' : 'default'}
          variant={filters.freeOnly ? 'filled' : 'outlined'}
          clickable
        />
      </Box>

      {/* Price Range */}
      <Box sx={{ mt: 3, maxWidth: 300 }}>
        <Typography variant="body2" gutterBottom>
          Price Range: ${filters.priceRange?.[0] || 0} - ${filters.priceRange?.[1] || 200}
        </Typography>
        <Slider
          value={filters.priceRange || [0, 200]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={200}
          step={10}
          marks={[
            { value: 0, label: '$0' },
            { value: 50, label: '$50' },
            { value: 100, label: '$100' },
            { value: 200, label: '$200+' }
          ]}
        />
      </Box>

      {/* Active Filters */}
      {(filters.search || filters.category || filters.freeOnly) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Active Filters:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.search && (
              <Chip
                label={`Search: "${filters.search}"`}
                onDelete={() => onFilterChange({ ...filters, search: '' })}
                size="small"
              />
            )}
            {filters.category && (
              <Chip
                label={`Category: ${filters.category}`}
                onDelete={() => onFilterChange({ ...filters, category: '' })}
                size="small"
              />
            )}
            {filters.freeOnly && (
              <Chip
                label="Free Only"
                onDelete={() => onFilterChange({ ...filters, freeOnly: false })}
                size="small"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CourseFilters;