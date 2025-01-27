import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
// import './VideoPlayer.css'; 

const VideoPlayer = ({ url, width, height }) => {
  return (
    <div className="video-player-container" style={{ width, height }}>
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="100%"
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload', // Disable download option
            },
            tracks: [
              {
                kind: 'subtitles',
                src: null, // Replace with your subtitle file path
                srcLang: 'en',
                default: true,
              },
            ],
          },
        }}
      />
    </div>
  );
};

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

VideoPlayer.defaultProps = {
  width: '100%',
  height: '100%',
};

export default VideoPlayer;