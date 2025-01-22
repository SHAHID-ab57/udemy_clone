import { Box, Slider, IconButton, Typography } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

const VideoPlayer = ({ url, captionsUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const STORAGE_KEY = 'videoPlayerCurrentTime';

  // Helper function to format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle Volume Change
  const handleVolumeChange = (event, newValue) => {
    videoRef.current.volume = newValue;
    setVolume(newValue);
  };

  // Handle Progress Change
  const handleProgressChange = (event, newValue) => {
    const newTime = (videoRef.current.duration * newValue) / 100;
    videoRef.current.currentTime = newTime;
    setProgress(newValue);
  };

  // Update Progress, Current Time, and Save to localStorage
  const updateProgress = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / duration) * 100);
    localStorage.setItem(STORAGE_KEY, currentTime);
  };

  // Handle Fullscreen
  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Enable/Disable Captions
  const toggleCaptions = () => {
    const tracks = videoRef.current.textTracks[0];
    if (tracks) {
      tracks.mode = captionsEnabled ? 'disabled' : 'showing';
      setCaptionsEnabled(!captionsEnabled);
    }
  };

  // Load Previous Playback Time
  useEffect(() => {
    const savedTime = localStorage.getItem(STORAGE_KEY);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, []);

  return (
    <Box
      sx={{
        width: 650,
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid #000',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <video
        ref={videoRef}
        src={url}
        width="600"
        height="350"
        style={{ objectFit: 'cover', marginBottom: '10px' }}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
      >
        {captionsUrl && (
          <track
            src={captionsUrl}
            kind="subtitles"
            srcLang="en"
            label="English"
            default
          />
        )}
      </video>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        {/* Play/Pause Button */}
        <IconButton onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        {/* Progress Bar */}
        <Slider
          value={progress}
          onChange={handleProgressChange}
          sx={{ flex: 1, mx: 2 }}
        />

        {/* Volume Control */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <VolumeUpIcon />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{ width: 100, ml: 1 }}
          />
        </Box>

        {/* Captions Toggle */}
        <IconButton onClick={toggleCaptions} sx={{ ml: 1 }}>
          <SubtitlesIcon color={captionsEnabled ? 'primary' : 'disabled'} />
        </IconButton>

        {/* Fullscreen Button */}
        <IconButton onClick={handleFullscreen}>
          <FullscreenIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        {/* Display Current Time */}
        <Typography variant="body2">{formatTime(currentTime)}</Typography>

        {/* Display Duration */}
        <Typography variant="body2">{formatTime(duration)}</Typography>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
