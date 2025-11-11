import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Download, EmojiEvents } from '@mui/icons-material';
import { enrollmentAPI } from '../../services/api';

const CertificateGenerator = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certificateDialog, setCertificateDialog] = useState({ open: false, enrollment: null });
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchCompletedEnrollments();
  }, []);

  const fetchCompletedEnrollments = async () => {
    try {
      const response = await enrollmentAPI.getMyCourses();
      const completedEnrollments = (response.data.enrollments || []).filter(
        enrollment => enrollment.progress === 100 && enrollment.completed_at
      );
      setEnrollments(completedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = (enrollment) => {
    setStudentName('');
    setCertificateDialog({ open: true, enrollment });
  };

  const downloadCertificate = (enrollment) => {
    if (!studentName.trim()) {
      alert('Please enter your name for the certificate');
      return;
    }

    const certificateContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 40px; }
          .certificate { 
            text-align: center; 
            border: 5px solid #1976d2; 
            padding: 60px 40px; 
            max-width: 800px; 
            margin: 0 auto;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          .title { color: #1976d2; font-size: 48px; margin-bottom: 30px; }
          .subtitle { font-size: 24px; margin: 20px 0; }
          .name { font-size: 36px; color: #333; margin: 30px 0; text-decoration: underline; }
          .course { font-size: 28px; color: #1976d2; margin: 30px 0; font-weight: bold; }
          .date { margin: 40px 0; font-size: 18px; }
          .signature { margin-top: 80px; display: flex; justify-content: space-around; }
          .sig-line { border-top: 2px solid #333; padding-top: 10px; width: 200px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1 class="title">Certificate of Completion</h1>
          <p class="subtitle">This is to certify that</p>
          <h2 class="name">${studentName.trim()}</h2>
          <p class="subtitle">has successfully completed the course</p>
          <h3 class="course">${enrollment.course?.title || 'Course'}</h3>
          <p class="date">Completion Date: ${new Date(enrollment.completed_at).toLocaleDateString()}</p>
          <p class="date">Final Score: ${enrollment.progress}%</p>
          <div class="signature">
            <div class="sig-line">Instructor Signature</div>
            <div class="sig-line">Date</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([certificateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${studentName.trim()}-${enrollment.course?.title || 'course'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCertificateDialog({ open: false, enrollment: null });
    setStudentName('');
  };

  if (loading) return <Typography>Loading certificates...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Certificates</Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Completed Courses</Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Completed Date</TableCell>
                  <TableCell>Final Score</TableCell>
                  <TableCell>Certificate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.length > 0 ? enrollments.map((enrollment) => (
                  <TableRow key={enrollment.course_id}>
                    <TableCell>{enrollment.course?.title || 'Unknown Course'}</TableCell>
                    <TableCell>
                      {new Date(enrollment.completed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip label={`${enrollment.progress}%`} color="success" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<EmojiEvents />}
                        onClick={() => generateCertificate(enrollment)}
                        size="small"
                      >
                        Generate Certificate
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No completed courses found. Complete a course to earn certificates!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Certificate Preview Dialog */}
      <Dialog 
        open={certificateDialog.open} 
        onClose={() => setCertificateDialog({ open: false, enrollment: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Certificate Preview</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter your name for the certificate"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="e.g., John Doe"
          />
          <Box sx={{ 
            textAlign: 'center', 
            p: 4, 
            border: '3px solid #1976d2',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}>
            <Typography variant="h3" color="primary" gutterBottom>
              Certificate of Completion
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
              This is to certify that
            </Typography>
            <Typography variant="h4" sx={{ my: 2, color: '#333', textDecoration: 'underline' }}>
              {studentName || '[Your Name]'}
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
              has successfully completed
            </Typography>
            <Typography variant="h4" color="primary" sx={{ my: 3, fontWeight: 'bold' }}>
              {certificateDialog.enrollment?.course?.title || 'Course Title'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 4 }}>
              Completion Date: {certificateDialog.enrollment?.completed_at ? 
                new Date(certificateDialog.enrollment.completed_at).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography variant="body1">
              Final Score: {certificateDialog.enrollment?.progress || 0}%
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertificateDialog({ open: false, enrollment: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => downloadCertificate(certificateDialog.enrollment)}
            variant="contained"
            startIcon={<Download />}
          >
            Download Certificate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateGenerator;