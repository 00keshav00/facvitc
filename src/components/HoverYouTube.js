'use client';

import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function HoverYouTube({ url, className }) {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Extract video ID from embed URL
  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/\/embed\/([^?]+)/);
    if (match) return match[1];
    
    // Also try to match regular watch URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match2 = url.match(regExp);
    return (match2 && match2[2].length === 11) ? match2[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
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
      mute: 1,
      // Removed playlist/loop to avoid the "next/previous" buttons in the UI
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      playsinline: 1,
      vq: 'hd1080'
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
  };

  const onStateChange = (event) => {
    // event.data: 1 = playing, 2 = paused, 3 = buffering, 0 = ended
    if (event.data === 1) {
      // Only show the video once it has actually started playing to hide the initial UI flash
      setShowVideo(true);
    } else if (event.data === 2 || event.data === 0) {
      setShowVideo(false);
    }
  };

  const handleMouseEnter = () => {
    if (isReady && playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handleMouseLeave = () => {
    if (isReady && playerRef.current) {
      playerRef.current.pauseVideo();
      setShowVideo(false);
    }
  };

  const handleEnd = (event) => {
    // Manual loop to avoid using the 'playlist' parameter
    event.target.playVideo();
  };

  return (
    <div 
      className={`${className} relative overflow-hidden group cursor-pointer bg-black`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Thumbnail Placeholder */}
      <img 
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="thumbnail"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: showVideo ? 0 : 1 }}
      />

      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}></div>
      
      {/* 
        Aggressive scaling and state-based visibility ensure that YouTube's 
        internal UI elements (play buttons, titles, etc.) are either clipped 
        or hidden during transitions.
      */}
      <div className={`absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-700 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady} 
          onStateChange={onStateChange}
          onEnd={handleEnd}
          className="w-full h-full"
          iframeClassName="w-full h-full object-cover" 
        />
      </div>
    </div>
  );
}
