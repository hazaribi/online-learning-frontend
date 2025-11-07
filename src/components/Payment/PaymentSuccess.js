import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    // Auto redirect after 5 seconds
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        navigate('/courses');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  if (paymentStatus === 'success') {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Congratulations! You have successfully enrolled in the course.
          You now have full access to all course materials.
        </Typography>
        
        <Alert severity="success" sx={{ mb: 3 }}>
          Your enrollment is now active. Start learning immediately!
        </Alert>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/courses')}
        >
          Go to My Courses
        </Button>
        
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          Redirecting automatically in 5 seconds...
        </Typography>
      </Box>
    );
  }

  if (paymentStatus === 'cancelled') {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Payment Cancelled
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your payment was cancelled. No charges were made to your account.
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          You can try purchasing the course again anytime.
        </Alert>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/courses')}
        >
          Browse Courses
        </Button>
      </Box>
    );
  }

  return null;
};

export default PaymentSuccess;