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
  // Check if we have multiple blocks, otherwise fallback to legacy structure
  const blocks = (content.blocks && content.blocks.length > 0) 
    ? content.blocks 
    : [{
        template: content.template || 'A',
        title: content.title || '',
        description: content.description || '',
        images: content.images || []
      }];

  const handleImageClick = (src) => {
    openLightbox(src);
    setLightboxOpen(true);
  };

  const DescriptionBox = ({ title, description }) => (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl flex flex-col justify-center h-full shadow-lg group hover:-translate-y-2 transition duration-300">
      <h3 className="text-2xl font-bold mb-4 text-white">{title || 'Untitled'}</h3>
      <p className="text-[#bfc1c3] text-lg leading-relaxed">{description}</p>
    </div>
  );

  const ImageBox = ({ src, className }) => (
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
      <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        {content.year}
      </h2>

      <div className="flex flex-col gap-12">
        {blocks.map((block, index) => (
          <div key={index}>
            {/* TEMPLATE A: Stack (Top Row: Img + Desc, Bottom: 3 Imgs) */}
            {block.template === 'A' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px]">
                  {block.images && block.images[0] ? <ImageBox src={block.images[0]} className="md:col-span-1" /> : <div className="hidden md:block"></div>}
                  <div className="md:col-span-2 h-full"><DescriptionBox title={block.title} description={block.description} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[250px]">
                  {block.images && block.images.slice(1, 4).map((img, i) => (
                    <ImageBox key={i} src={img} />
                  ))}
                </div>
              </div>
            )}

            {/* TEMPLATE B: Split (Left: Large Img, Right: Desc + 2 Small Imgs) */}
            {block.template === 'B' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
                {block.images && block.images[0] ? <ImageBox src={block.images[0]} className="h-[400px] md:h-full" /> : <div></div>}
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex-1"><DescriptionBox title={block.title} description={block.description} /></div>
                  <div className="flex gap-6 h-[200px]">
                    {block.images && block.images.slice(1, 3).map((img, i) => (
                      <ImageBox key={i} src={img} className="flex-1" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE C: Grid (Standard) */}
            {block.template === 'C' && (
              <>
                <div className="mb-8"><DescriptionBox title={block.title} description={block.description} /></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {block.images && block.images.map((img, i) => (
                    <ImageBox key={i} src={img} className="aspect-square" />
                  ))}
                </div>
              </>
            )}

            {/* TEMPLATE D: Text Only */}
            {block.template === 'D' && (
              <div className="max-w-3xl mx-auto py-10">
                <DescriptionBox title={block.title} description={block.description} />
              </div>
            )}

            {/* TEMPLATE E: L-Shape (Top: Desc + Side Img, Bottom: Row Imgs) */}
            {block.template === 'E' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[350px]">
                  <div className="md:col-span-2"><DescriptionBox title={block.title} description={block.description} /></div>
                  {block.images && block.images[0] && <ImageBox src={block.images[0]} className="md:col-span-1" />}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[200px]">
                  {block.images && block.images.slice(1).map((img, i) => (
                    <ImageBox key={i} src={img} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
