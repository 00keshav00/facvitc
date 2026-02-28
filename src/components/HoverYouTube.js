'use client';

import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function HoverYouTube({ url, className }) {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Extract video ID from embed URL
  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/\/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    // Fallback if the URL isn't a standard embed link
    return (
      <iframe 
        src={url} 
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    );
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      mute: 1, // Must be muted to autoplay consistently on hover
      loop: 1,
      playlist: videoId, // Required for loop to work
      vq: 'hd1080', // Hint to YouTube to prefer 1080p quality
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      playsinline: 1
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
  };

  const handleMouseEnter = () => {
    if (isReady && playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handleMouseLeave = () => {
    if (isReady && playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  return (
    <div 
      className={`${className} relative overflow-hidden group cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}></div>
      {/* 
        By making the container 180% the size of the box and centering it, 
        we naturally push the YouTube logo, title, and any black bars outside the visible area, 
        forcing YouTube to render at a higher resolution instead of using pixelated CSS scaling.
      */}
      <div className="absolute top-1/2 left-1/2 w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady} 
          className="w-full h-full"
          iframeClassName="w-full h-full object-cover scale-[1.05]" 
        />
      </div>
    </div>
  );
}
