'use client';

import React, { useRef, useEffect } from 'react';
import Navbar from './Navbar';

export default function SiteLayout({ children, settings }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1; // Set playback speed to 1x
    }
  }, []);

  return (
    <div className="site">
      <video 
        ref={videoRef}
        className="site-background-video" 
        src="/videos/background.mp4" 
        poster="/images/hero.jpg" 
        autoPlay 
        loop 
        muted 
        playsInline 
      />
      <Navbar settings={settings} />
      <main className="site-content">
        {children}
      </main>
    </div>
  );
}
