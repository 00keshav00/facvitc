'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimelinePage({ data }) {
  const [activeYear, setActiveYear] = useState(data.timeline?.[0]?.year || null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');
  const bgVideoRef = useRef(null);

  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.playbackRate = 1;
    }
  }, []);

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
        ref={bgVideoRef}
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
              <TimelineContent 
                key={activeYear} 
                content={activeContent} 
                openLightbox={setLightboxImg} 
                setLightboxOpen={setLightboxOpen} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Back to Top Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[rgba(0,0,0,0.4)] backdrop-blur-sm p-4 z-50 flex justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-semibold transition-colors"
        >
          Back to Top
        </button>
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
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1000'}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.5)] object-contain"
            alt="Full screen" 
          />
        </div>
      )}
    </div>
  );
}

function TimelineContent({ content, openLightbox, setLightboxOpen }) {
  const blocks = (content.blocks && content.blocks.length > 0) 
    ? content.blocks 
    : [{
        template: content.template || 'TEXT_LEFT_IMAGE_RIGHT',
        title: content.title || '',
        description: content.description || '',
        images: content.images || []
      }];

  const handleImageClick = (src) => {
    openLightbox(src);
    setLightboxOpen(true);
  };

  const DescriptionBox = ({ title, description, className = "" }) => (
    <div className={`bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl flex flex-col justify-center h-full shadow-lg group hover:-translate-y-1 transition duration-300 ${className}`}>
      <h3 className="text-2xl font-bold mb-4 text-white">{title || 'Untitled'}</h3>
      <p className="text-[#bfc1c3] text-lg leading-relaxed">{description}</p>
    </div>
  );

  const ImageBox = ({ src, className = "" }) => (
    <div 
      className={`relative rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black group cursor-pointer ${className}`}
      onClick={() => handleImageClick(src)}
    >
      <img 
        src={src} 
        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1000'}
        alt="" 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-2 text-white">
        {content.title || content.year}
      </h2>
      {content.description && (
        <div className="mb-8">
          <hr className="my-4 border-white/20" />
          <p className="text-lg text-[#bfc1c3] leading-relaxed">{content.description}</p>
        </div>
      )}

      <div className="flex flex-col gap-16">
        {blocks.map((block, index) => {
          const layout = block.template;
          
          return (
            <div key={index} className="w-full">
              {/* 1. TEXT_LEFT_IMAGE_RIGHT */}
              {layout === 'TEXT_LEFT_IMAGE_RIGHT' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  <DescriptionBox title={block.title} description={block.description} className="md:col-span-2" />
                  <ImageBox src={block.images?.[0]} className="h-[400px] md:col-span-1" />
                </div>
              )}

              {/* 2. TEXT_RIGHT_IMAGE_LEFT */}
              {layout === 'TEXT_RIGHT_IMAGE_LEFT' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  <ImageBox src={block.images?.[0]} className="h-[400px] md:order-1 md:col-span-1" />
                  <DescriptionBox title={block.title} description={block.description} className="md:order-2 md:col-span-2" />
                </div>
              )}

              {/* 3. IMAGE_ONLY */}
              {layout === 'IMAGE_ONLY' && (
                <div className="max-w-4xl mx-auto">
                  <ImageBox src={block.images?.[0]} className="h-[500px] w-full" />
                </div>
              )}

              {/* 4. SPLIT_WITH_STACK (Image Left) */}
              {layout === 'SPLIT_WITH_STACK' && (
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-6 h-auto md:h-[500px]">
                  <ImageBox src={block.images?.[0]} className="md:row-span-2 md:col-span-1 h-[300px] md:h-full" />
                  <DescriptionBox title={block.title} description={block.description} className="md:col-span-3 md:row-span-1" />
                  <div className="md:col-span-3 md:row-span-1 grid grid-cols-3 gap-4">
                    {block.images?.slice(1, 4).map((img, i) => (
                      <ImageBox key={i} src={img} className="h-full" />
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SPLIT_WITH_STACK_REVERSE (Image Right) */}
              {layout === 'SPLIT_WITH_STACK_REVERSE' && (
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-6 h-auto md:h-[500px]">
                  <DescriptionBox title={block.title} description={block.description} className="md:col-span-3 md:row-span-1 md:order-1" />
                  <ImageBox src={block.images?.[0]} className="md:row-span-2 md:col-span-1 h-[300px] md:h-full md:order-2" />
                  <div className="md:col-span-3 md:row-span-1 grid grid-cols-3 gap-4 md:order-3">
                    {block.images?.slice(1, 4).map((img, i) => (
                      <ImageBox key={i} src={img} className="h-full" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
