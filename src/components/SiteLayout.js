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
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      }, 10);
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
        <div className="site-background-video-container pointer-events-none absolute inset-0 w-full h-full -z-10 bg-black">
          {/* Static image behind the video so the fade doesn't go to pure black */}
          <img src="/images/hero.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover filter brightness-50" />
          <video 
            ref={videoRef}
            className="site-background-video absolute inset-0 w-full h-full object-cover filter brightness-50 transition-opacity duration-700 ease-in-out" 
            src="/videos/background.mp4" 
            autoPlay 
            muted 
            loop
            playsInline 
            onTimeUpdate={(e) => {
              const video = e.target;
              // Fade out smoothly just before the end of the video
              if (video.duration && video.currentTime >= video.duration - 0.5) {
                video.style.opacity = '0';
              } 
              // Fade back in smoothly once it natively loops back to the beginning
              else if (video.currentTime < 1) {
                video.style.opacity = '1';
              }
            }}
          />
        </div>
      )}
      <Navbar settings={settings} />
      <main ref={contentRef} className="site-content">
        {children}
      </main>
    </div>
  );
}
