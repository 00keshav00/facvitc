'use client';

import React from 'react';
import HoverYouTube from './HoverYouTube';

export default function About({ title, text, images, video }) {
  const defaultImages = ["/technoph.jpeg", "/vibe1.webp", "/ph4.jpeg", "/wall.webp"];
  const displayImages = images && images.length > 0 ? images : defaultImages;

  return (
    <section className="flex flex-col lg:flex-row p-6 md:p-14 gap-8 md:gap-10 items-start border-t border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.005)] to-transparent" id="about">
      <div className="w-full lg:w-1/3">
        <div className="section-title">{title || "About Our Club"}</div>
        <p className="about-text text-[#bfc1c3] text-base md:text-lg max-w-[48ch] leading-relaxed">
          {text}
        </p>
      </div>
      <div className="about-grid w-full lg:flex-1 grid grid-cols-2 grid-rows-[140px_140px_140px] md:grid-rows-[200px_200px_200px] gap-4">
        <div 
          className="about-video-box col-span-1 row-span-2 relative overflow-hidden rounded-[18px] border border-[#5A3E2B] bg-black z-10 transition-all duration-350 hover:scale-[1.03] lg:hover:scale-[1.1] hover:z-20"
        >
          {video && video.includes('youtube') ? (
            <HoverYouTube url={video} className="w-full h-full object-cover" />
          ) : (
            <video 
              id="aboutVideo" 
              src={video || "/videos/background.mp4"} 
              autoPlay
              muted
              loop 
              className="w-full h-full object-cover"
              playsInline
            ></video>
          )}
        </div>
        {displayImages[0] && (
          <img 
            src={displayImages[0]} 
            alt="" 
            className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] transition-all duration-350 hover:opacity-100 hover:scale-[0.9] col-start-2 row-start-1"
          />
        )}
        {displayImages[1] && (
          <img 
            src={displayImages[1]} 
            alt="" 
            className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] transition-all duration-350 hover:opacity-100 hover:scale-[0.9] col-start-2 row-start-2"
          />
        )}
        {displayImages[3] && (
          <img 
            src={displayImages[3]} 
            alt="" 
            className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] transition-all duration-350 hover:opacity-100 hover:scale-[0.9] col-start-1 row-start-3"
          />
        )}
        {displayImages[2] && (
          <img 
            src={displayImages[2]} 
            alt="" 
            className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] transition-all duration-350 hover:opacity-100 hover:scale-[0.9] col-start-2 row-start-3"
          />
        )}
      </div>
    </section>
  );
}
