import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const PaymentForm = ({ course, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/payment/create-checkout-session', {
        course_id: course.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      setError(error.response?.data?.error || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Purchase Course</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
        ${course.price}
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handlePayment}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </Button>
      
      <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        💳 Test Mode: Use card 4242424242424242
      </Typography>
    </Box>
  );
};

export default PaymentForm;