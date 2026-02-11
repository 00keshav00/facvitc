'use client';

import React from 'react';

export default function Hero({ title, subtitle, ctaText, ctaLink }) {
  return (
    <section className="hero relative h-[420px] flex items-center px-12 py-9 gap-10 overflow-hidden" id="home">
      <div 
        className="hero-bg absolute inset-0 bg-cover bg-center z-0 contrast-[0.95] saturate-[0.9] brightness-[0.7]" 
        style={{backgroundImage: "url('/images/hero.jpg')"}}
      ></div>
      <div className="hero-content relative z-10 max-w-[56%] reveal visible">
        <h2 className="text-[44px] leading-tight mb-3 text-[#e6e6e6] font-bold">{title || "Creativity Lives Here."}</h2>
        <p className="text-[#bfc1c3] mb-5 max-w-[48ch] leading-relaxed">
          {subtitle || "Celebrate the passion and artistry of our students. Explore our gallery and meet the artists shaping our campus culture."}
        </p>
        <a className="cta" href={ctaLink || "#gallery"}>{ctaText || "Discover Our Art"}</a>
      </div>
    </section>
  );
}
