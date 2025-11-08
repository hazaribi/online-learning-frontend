import React, { useState } from 'react';
import { 
  Box, Button, Typography, LinearProgress, Alert, 
  Card, CardContent, IconButton 
} from '@mui/material';
import { CloudUpload, Delete, VideoFile } from '@mui/icons-material';
import { supabase } from '../../services/supabase';

const VideoUpload = ({ onUploadComplete, existingVideoUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState(existingVideoUrl || '');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file must be less than 100MB');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `course-videos/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      setVideoUrl(publicUrl);
      
      if (onUploadComplete) {
        onUploadComplete(publicUrl, {
          fileName: file.name,
          fileSize: file.size,
          duration: 0 // Will be calculated by video player
        });
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!videoUrl) return;

    try {
      // Extract file path from URL
      const urlParts = videoUrl.split('/');
      const filePath = `course-videos/${urlParts[urlParts.length - 1]}`;

      const { error } = await supabase.storage
        .from('videos')
        .remove([filePath]);

      if (error) throw error;

      setVideoUrl('');
      if (onUploadComplete) {
        onUploadComplete('', null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Video Upload
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!videoUrl ? (
        <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
          <CardContent>
            <VideoFile sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            
            <Typography variant="body1" gutterBottom>
              Upload video lesson
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: MP4, WebM, AVI (Max 100MB)
            </Typography>

            <input
              accept="video/*"
              style={{ display: 'none' }}
              id="video-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            
            <label htmlFor="video-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                disabled={uploading}
                size="large"
              >
                {uploading ? 'Uploading...' : 'Choose Video File'}
              </Button>
            </label>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2">
                  {Math.round(uploadProgress)}% uploaded
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Video uploaded successfully
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {videoUrl}
                </Typography>
              </Box>
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </Box>
            
            {/* Video Preview */}
            <Box sx={{ mt: 2 }}>
              <video 
                controls 
                style={{ width: '100%', maxHeight: '300px' }}
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VideoUpload;