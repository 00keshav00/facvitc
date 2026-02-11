'use client';

import React, { useRef, useState } from 'react';

export default function About({ title, text }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.play();
  };

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <section className="panel" id="about">
      <div>
        <div className="section-title">{title || "About Our Club"}</div>
        <p className="about-text text-[#bfc1c3] text-[15px] max-w-[48ch]">
          {text || "We bring together creative minds to learn, share and exhibit. Our workshops, exhibitions, and community events provide a platform for everyone passionate about art."}
        </p>
      </div>
      <div className="about-grid grid grid-cols-[0.9fr_1.8fr] grid-rows-[110px_110px] gap-3 ml-[204px]">
        {/* Images would need to be in public folder or fetched */}
        <img 
          src="/technoph.jpeg" 
          alt="" 
          className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] animate-[floatImage_9s_infinite] transition-all duration-350 hover:opacity-100 hover:scale-[0.88]"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="about-video-box row-span-2 relative overflow-hidden rounded-[18px] border border-[#5A3E2B] bg-black z-10 transition-all duration-350 hover:scale-[1.22] hover:z-20 hover:opacity-100 animate-[floatVideo_7s_infinite]"
          style={{ animationDelay: '0.6s' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video 
            ref={videoRef}
            id="aboutVideo" 
            src="/videos/background.mp4" 
            muted={isMuted} 
            loop 
            className="w-full h-full object-cover"
          ></video>
          <button 
            className="mute-btn absolute bottom-2.5 right-2.5 w-[34px] h-[34px] rounded-full border-none bg-[rgba(0,0,0,0.6)] text-white text-base cursor-pointer flex items-center justify-center backdrop-blur-md z-20 hover:bg-[rgba(0,0,0,0.8)]" 
            onClick={toggleMute}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
        <img 
          src="/vibe1.webp" 
          alt="" 
          className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] animate-[floatImage_9s_infinite] transition-all duration-350 hover:opacity-100 hover:scale-[0.88]"
          style={{ animationDelay: '1.4s' }}
        />
        <img 
          src="/ph4.jpeg" 
          alt="" 
          className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] animate-[floatImage_9s_infinite] transition-all duration-350 hover:opacity-100 hover:scale-[0.88]"
          style={{ animationDelay: '2.8s' }}
        />
        <img 
          src="/wall.webp" 
          alt="" 
          className="w-full h-full object-cover rounded-xl border border-[#5A3E2B] animate-[floatImage_9s_infinite] transition-all duration-350 hover:opacity-100 hover:scale-[0.88]"
          style={{ animationDelay: '0s' }} // Reusing delay as per CSS count
        />
      </div>
    </section>
  );
}
