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
      {settings?.backgroundVideo && settings.backgroundVideo.includes('youtube') ? (
        <div className="site-background-video pointer-events-none">
          <iframe
            src={`${settings.backgroundVideo}${settings.backgroundVideo.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
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
      )}
      <Navbar settings={settings} />
      <main className="site-content">
        {children}
      </main>
    </div>
  );
}
