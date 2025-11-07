import React, { useState, useRef } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

const VideoPlayer = ({ lesson, onProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progressPercent = (currentTime / duration) * 100;
      
      setProgress(progressPercent);
      
      // Update progress in backend
      if (onProgress) {
        onProgress({
          lesson_id: lesson.id,
          watched_duration: Math.floor(currentTime),
          completed: progressPercent > 90
        });
      }
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {lesson.title}
      </Typography>
      
      <Box sx={{ position: 'relative', mb: 2 }}>
        <video
          ref={videoRef}
          width="100%"
          height="400"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
        >
          <source src={lesson.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <Button
          variant="contained"
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
          onClick={handlePlayPause}
          sx={{ position: 'absolute', bottom: 10, left: 10 }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </Box>
      
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      
      <Typography variant="body2" color="text.secondary">
        Progress: {Math.round(progress)}%
      </Typography>
      
      {lesson.description && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {lesson.description}
        </Typography>
      )}
    </Box>
  );
};

export default VideoPlayer;