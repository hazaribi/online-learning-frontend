import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

const VideoPlayer = ({ lesson, onProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoError(false);
  }, [lesson.video_url]);

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

  const isSupabaseVideo = lesson.video_url?.includes('supabase');
  const isYouTubeVideo = lesson.video_url?.includes('youtube.com') || lesson.video_url?.includes('youtu.be');

  const renderVideo = () => {
    if (videoError) {
      return (
        <Box sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.100',
          border: '1px solid',
          borderColor: 'grey.300'
        }}>
          <Typography color="error">Video could not be loaded</Typography>
        </Box>
      );
    }

    if (isYouTubeVideo) {
      const videoId = lesson.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (videoId) {
        return (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId[1]}`}
            title={lesson.title}
            frameBorder="0"
            allowFullScreen
          />
        );
      }
    }

    return (
      <video
        ref={videoRef}
        width="100%"
        height="400"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setVideoError(true)}
        controls
        preload="metadata"
      >
        <source src={lesson.video_url} type="video/mp4" />
        <source src={lesson.video_url} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {lesson.title}
      </Typography>
      
      <Box sx={{ position: 'relative', mb: 2 }}>
        {renderVideo()}
        
        {!isYouTubeVideo && !videoError && (
          <Button
            variant="contained"
            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
            onClick={handlePlayPause}
            sx={{ position: 'absolute', bottom: 10, left: 10 }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        )}
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