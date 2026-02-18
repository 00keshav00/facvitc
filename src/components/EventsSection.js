'use client';

import React from 'react';
import Link from 'next/link';

import { motion } from 'framer-motion';

const EventCard = ({ imgLeft, imgRight, text, link, linkText }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="event-container relative w-full max-w-[800px] min-h-[400px] md:h-[450px] bg-[rgba(0,0,0,0.5)] backdrop-blur-md rounded-3xl border border-[rgba(255,255,255,0.1)] shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex justify-center items-center overflow-hidden p-6 md:p-0"
    >
      <motion.img 
        initial={{ x: -20, rotate: -3 }}
        whileHover={{ x: -30, rotate: -5, scale: 1.1 }}
        src={imgLeft || "https://via.placeholder.com/400x300"} 
        className="floating-img absolute w-[120px] h-[80px] md:w-[200px] md:h-[120px] rounded-xl object-cover z-[1] border border-[rgba(255,255,255,0.2)] transition-transform duration-400 bottom-4 left-4 md:bottom-10 md:left-10 opacity-40 md:opacity-100" 
        alt="Event Left" 
      />
      <motion.img 
        initial={{ x: 20, rotate: 3 }}
        whileHover={{ x: 30, rotate: 5, scale: 1.1 }}
        src={imgRight || "https://via.placeholder.com/400x300"} 
        className="floating-img absolute w-[120px] h-[80px] md:w-[200px] md:h-[120px] rounded-xl object-cover z-[1] border border-[rgba(255,255,255,0.2)] transition-transform duration-400 top-4 right-4 md:top-10 md:right-10 opacity-40 md:opacity-100" 
        alt="Event Right" 
      />
      
      <div className="glass-card relative z-10 w-full max-w-[420px] p-6 md:p-10 text-center text-white bg-[rgba(255,255,255,0.08)] backdrop-blur-2xl rounded-[20px] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <p className="description text-sm md:text-base leading-relaxed mb-6 text-[rgba(255,255,255,0.9)] drop-shadow-md">
          {text}
        </p>
        <Link href={link} className="techno-btn bg-transparent border border-[rgba(255,255,255,0.5)] text-white py-2.5 px-6 md:py-3 md:px-8 text-sm md:text-base font-bold tracking-widest rounded-[50px] uppercase transition-all duration-300 hover:scale-105 hover:bg-[rgba(255,255,255,0.1)] hover:border-white inline-block">
          {linkText}
        </Link>
      </div>
    </motion.div>
  );
};

export default function EventsSection({ preview }) {
  const defaultEvents = [
    {
      imageA: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop",
      imageB: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop",
      description: "Our flagship tech-art festival featuring installations, digital mapping, and interactive exhibits.",
      link: "/events/technovit",
      title: "TECHNOVIT"
    },
    {
      imageA: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop",
      imageB: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=400&auto=format&fit=crop",
      description: "A celebration of color and traditional media. Join us for the annual painting and sculpture showcase.",
      link: "/events/vibrance",
      title: "VIBRANCE"
    },
    {
      imageA: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop",
      imageB: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop",
      description: "Weekly hands-on sessions. Learn pottery, sketching, and digital design from industry experts.",
      link: "/events/others",
      title: "WORKSHOPS"
    }
  ];

  const displayEvents = preview && preview.length > 0 ? preview : defaultEvents;

  return (
    <section className="events py-12 md:py-16 px-4 md:px-14 border-t border-[rgba(255,255,255,0.08)] flex flex-col items-center gap-10 md:gap-16" id="events">
      <div className="section-title self-start">Events</div>

      {displayEvents.map((event, idx) => {
        const title = event.title?.toUpperCase();
        let link = event.link;
        if (!link || link.startsWith('/techno')) {
           if (title.includes('TECHNO')) link = '/events/technovit';
           else if (title.includes('VIBRANCE')) link = '/events/vibrance';
           else link = '/events/others';
        }

        return (
          <EventCard 
            key={idx}
            imgLeft={event.imageA}
            imgRight={event.imageB}
            text={event.description}
            link={link}
            linkText={title}
          />
        );
      })}
    </section>
  );
}
