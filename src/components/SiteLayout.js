'use client';

import React, { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function SiteLayout({ children, settings }) {
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();

  // Set video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1; // Set playback speed to 1x
    }
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [pathname]);

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
          onTimeUpdate={(e) => {
            const video = e.target;
            // When the video is within 0.1 seconds of ending, add a class to trigger the blink
            if (video.duration - video.currentTime < 0.1) {
              video.style.opacity = '0';
              setTimeout(() => {
                video.style.opacity = '1';
              }, 1000); // 1000ms = 1 sec blink duration
            }
          }}
        />
      )}
      <Navbar settings={settings} />
      <main ref={contentRef} className="site-content">
        {children}
      </main>
    </div>
  );
}
