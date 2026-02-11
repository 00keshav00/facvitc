'use client';

import React from 'react';

export default function ConnectSection() {
  return (
    <section className="connect-section py-10 px-14 pb-16 flex justify-center border-t border-[rgba(255,255,255,0.08)]" id="contact">
      <div className="connect-card w-full max-w-[900px] py-9 px-7 rounded-xl bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] text-center shadow-2xl">
        <h2 className="text-[22px] font-bold text-[#e6e6e6] mb-2">Connect With Us</h2>
        <p className="text-[14px] text-[#bfc1c3] mb-6">Follow our journey and stay updated with the latest events and exhibitions.</p>
        <div className="connect-icons flex justify-center gap-4">
          {['instagram', 'threads', 'youtube', 'envelope'].map((icon) => (
            <a 
              key={icon} 
              href="#" 
              target="_blank" 
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#e6e6e6] transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-1"
            >
              <i className={`fa-${icon === 'envelope' ? 'solid' : 'brands'} fa-${icon}`}></i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
