'use client';

import YouTube from 'react-youtube';

export default function YouTubePlayer({ videoId }) {
  const opts = {
    height: '390',
    width: '640',
    playerVars: { autoplay: 1, modestbranding: 1 },
  };

  return <YouTube videoId={videoId} opts={opts} />;
}   