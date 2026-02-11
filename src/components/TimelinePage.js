'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimelinePage({ data }) {
  const [activeYear, setActiveYear] = useState(data.timeline?.[0]?.year || null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');

  const activeContent = data.timeline?.find(t => t.year === activeYear);
  const timeline = data.timeline || [];

  // Default image if actual image fails
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1000'; // Placeholder
  };

  const openLightbox = (src) => {
    setLightboxImg(src);
    setLightboxOpen(true);
  };

  return (
    <div className="site flex flex-col min-h-screen bg-black text-[#e6e6e6] relative overflow-hidden font-sans">
      
      {/* Background Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50 brightness-50"
        src="/videos/background.mp4"
        autoPlay loop muted playsInline
      />

      {/* Timeline Nav */}
      <nav className="w-full py-5 px-8 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)] backdrop-blur-md flex gap-4 overflow-x-auto z-50 justify-center no-scrollbar">
        {timeline.map((item) => (
          <button
            key={item.year}
            onClick={() => setActiveYear(item.year)}
            className={`px-4 py-2 rounded-full text-base transition-all whitespace-nowrap border border-transparent
              ${activeYear === item.year 
                ? 'bg-[#3a3a3b] text-white font-bold border-[rgba(255,255,255,0.1)]' 
                : 'text-[#bfc1c3] hover:text-[#e6e6e6] hover:bg-[rgba(255,255,255,0.1)]'
              }`}
          >
            {item.year}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar py-10">
        <div className="w-full max-w-[1300px] mx-auto px-6 md:px-14">
          <AnimatePresence mode="wait">
            {activeContent && (
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-[rgba(255,255,255,0.1)] shadow-sm">
                  {activeContent.title || `${data.page} ${activeYear}`}
                </h2>

                {activeContent.description && (
                  <p className="mb-8 text-[#bfc1c3] text-lg max-w-3xl leading-relaxed">
                    {activeContent.description}
                  </p>
                )}

                {(!activeContent.images || activeContent.images.length === 0) ? (
                   <p className="mt-5 text-[#bfc1c3] italic">No images available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
                    {/* First image large (Bento style logic simplified) */}
                    {activeContent.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-lg bg-black group cursor-pointer
                          ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                        `}
                        onClick={() => openLightbox(img)}
                      >
                        <img 
                          src={img} 
                          onError={handleImageError}
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 flex justify-center items-center backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-5 right-8 text-white text-4xl w-12 h-12 flex justify-center items-center rounded-full bg-white/10 hover:bg-white/20 transition"
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>
          <img 
            src={lightboxImg} 
            onError={handleImageError}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.5)] object-contain"
            alt="Full screen" 
          />
        </div>
      )}
    </div>
  );
}
