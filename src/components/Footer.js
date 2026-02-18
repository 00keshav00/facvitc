'use client';

import React from 'react';

export default function Footer({ settings }) {
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.site-content');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer py-10 px-6 md:px-14 flex flex-col items-center gap-6 border-t border-[rgba(255,255,255,0.08)]">
      <div className="text-[13px] text-[#bfc1c3] font-medium text-center">
        {settings?.footerText || "© 2024 Fine Arts Club, VIT Vellore. All Rights Reserved."}
      </div>
      <button 
        onClick={scrollToTop}
        className="btn-secondary px-4 py-2.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-transparent text-[#e6e6e6] font-semibold hover:bg-[rgba(255,255,255,0.06)] cursor-pointer transition-colors"
      >
        Back to Top
      </button>
    </footer>
  );
}
