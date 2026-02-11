'use client';

import React from 'react';
import Link from 'next/link';

const EventCard = ({ imgLeft, imgRight, text, link, linkText }) => {
  return (
    <div className="event-container relative w-[800px] h-[450px] bg-[rgba(0,0,0,0.5)] backdrop-blur-md rounded-3xl border border-[rgba(255,255,255,0.1)] shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex justify-center items-center overflow-hidden">
      <img src={imgLeft} className="floating-img absolute w-[200px] h-[120px] rounded-xl object-cover z-[1] border border-[rgba(255,255,255,0.2)] transition-transform duration-400 bottom-10 left-10 -rotate-3" alt="Event Left" />
      <img src={imgRight} className="floating-img absolute w-[200px] h-[120px] rounded-xl object-cover z-[1] border border-[rgba(255,255,255,0.2)] transition-transform duration-400 top-10 right-10 rotate-3" alt="Event Right" />
      
      <div className="glass-card relative z-10 w-[420px] p-10 text-center text-white bg-[rgba(255,255,255,0.08)] backdrop-blur-2xl rounded-[20px] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <p className="description text-base leading-relaxed mb-6 text-[rgba(255,255,255,0.9)] drop-shadow-md">
          {text}
        </p>
        <Link href={link} className="techno-btn bg-transparent border border-[rgba(255,255,255,0.5)] text-white py-3 px-8 text-base font-bold tracking-widest rounded-[50px] uppercase transition-all duration-300 hover:scale-115 hover:bg-[rgba(255,255,255,0.1)] hover:border-white inline-block">
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default function EventsSection() {
  return (
    <section className="events py-16 px-14 border-t border-[rgba(255,255,255,0.08)] flex flex-col items-center gap-16" id="events">
      <div className="section-title self-start">Events</div>

      <EventCard 
        imgLeft="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop"
        imgRight="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop"
        text="Our flagship tech-art festival featuring installations, digital mapping, and interactive exhibits."
        link="/techno"
        linkText="TECHNOVIT"
      />

      <EventCard 
        imgLeft="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop"
        imgRight="https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=400&auto=format&fit=crop"
        text="A celebration of color and traditional media. Join us for the annual painting and sculpture showcase."
        link="/vibrance"
        linkText="VIBRANCE"
      />

      <EventCard 
        imgLeft="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop"
        imgRight="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop"
        text="Weekly hands-on sessions. Learn pottery, sketching, and digital design from industry experts."
        link="/workshops"
        linkText="WORKSHOPS"
      />
    </section>
  );
}
