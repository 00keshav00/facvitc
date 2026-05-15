'use client';

import React, { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import YouTube from 'react-youtube';
import Navbar from './Navbar';

export default function SiteLayout({ children, settings }) {
  const contentRef = useRef(null);
  const pathname = usePathname();
  const [showBg, setShowBg] = useState(false);

  // Dual video references for seamless loop crossfading
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [activeVid, setActiveVid] = useState(1);

  // Set video playback speed
  useEffect(() => {
    if (video1Ref.current) video1Ref.current.playbackRate = 1;
    if (video2Ref.current) video2Ref.current.playbackRate = 1;
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
        <div className="site-background-video pointer-events-none overflow-hidden bg-black">
          {/* Static image behind the video to show while loading */}
          <img src="/images/hero.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover filter brightness-50" />
          
          {/* Extract video ID to pass into playlist for seamless YouTube looping */}
          {(() => {
            const videoId = settings.backgroundVideo.split('/embed/')[1]?.split('?')[0];
            const opts = {
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
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

            return (
              <div className={`w-full h-full absolute inset-0 transition-opacity duration-1500 ${showBg ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-[1.35] sm:scale-[1.15]">
                  <YouTube 
                    videoId={videoId} 
                    opts={opts} 
                    onStateChange={(e) => {
                      // 1 = PLAYING
                      if (e.data === 1) {
                        // Increased delay to 4s to ensure the initial 5s center-play icon is gone
                        // YouTube's 'modestbranding' and 'controls=0' still flash the center icon for ~3-5s
                        setTimeout(() => setShowBg(true), 4000);
                      }
                    }}
                    onEnd={(e) => {
                      e.target.playVideo();
                    }}
                    className="w-full h-full"
                    iframeClassName="w-full h-full pointer-events-none" 
                  />
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="site-background-video-container pointer-events-none absolute inset-0 w-full h-full -z-10 bg-black">
          {/* Static image behind the video */}
          <img src="/images/hero.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover filter brightness-50" />
          
          <video 
            ref={video1Ref}
            className={`site-background-video absolute inset-0 w-full h-full object-cover filter brightness-50 transition-opacity duration-500 ease-in-out ${activeVid === 1 ? 'opacity-100' : 'opacity-0'}`} 
            src="/videos/background.mp4" 
            autoPlay 
            muted 
            playsInline 
            onTimeUpdate={(e) => {
              const video = e.target;
              // 0.5 seconds before this video ends, start the other video and trigger crossfade
              if (video.duration && video.currentTime >= video.duration - 0.5) {
                if (activeVid !== 2) {
                  setActiveVid(2);
                  if (video2Ref.current) {
                    video2Ref.current.currentTime = 0;
                    video2Ref.current.play().catch(() => {});
                  }
                }
              }
            }}
          />
          
          <video 
            ref={video2Ref}
            className={`site-background-video absolute inset-0 w-full h-full object-cover filter brightness-50 transition-opacity duration-500 ease-in-out ${activeVid === 2 ? 'opacity-100' : 'opacity-0'}`} 
            src="/videos/background.mp4" 
            muted 
            playsInline 
            onTimeUpdate={(e) => {
              const video = e.target;
              // 0.5 seconds before this video ends, start the other video and trigger crossfade
              if (video.duration && video.currentTime >= video.duration - 0.5) {
                if (activeVid !== 1) {
                  setActiveVid(1);
                  if (video1Ref.current) {
                    video1Ref.current.currentTime = 0;
                    video1Ref.current.play().catch(() => {});
                  }
                }
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
