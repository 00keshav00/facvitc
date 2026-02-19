'use client';

import React from 'react';

export default function Hero({ title, subtitle, logo }) {
  return (
    <section className="hero relative min-h-[400px] md:h-[420px] flex items-center px-6 md:px-12 py-12 md:py-9 gap-10 overflow-hidden" id="home">
      <div 
        className="hero-bg absolute inset-0 bg-cover bg-center z-0 contrast-[0.95] saturate-[0.9] brightness-[0.7]" 
        style={{backgroundImage: "url('/images/hero.jpg')"}}
      ></div>
      <div className="hero-content relative z-10 w-full md:max-w-[56%] reveal visible text-center md:text-left flex flex-col items-center md:items-start">
        {logo && <img src={logo} alt="Logo" className="w-20 md:w-24 mb-6" />}
        <h2 className="text-3xl md:text-[44px] leading-tight mb-3 text-[#e6e6e6] font-bold">{title || "FAC VIT CHENNAI"}</h2>
        <p className="text-[#bfc1c3] mb-6 md:mb-5 max-w-[48ch] leading-relaxed">
          {subtitle || "Where Creativity Meets Passion"}
        </p>
        <a className="cta" href="#gallery">Discover Our Art</a>
      </div>
    </section>
  );
}
