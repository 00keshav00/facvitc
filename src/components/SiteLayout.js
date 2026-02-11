import React from 'react';
import Navbar from './Navbar';

export default function SiteLayout({ children }) {
  return (
    <div className="site">
      <video 
        className="site-background-video" 
        src="/videos/background.mp4" 
        poster="/images/hero.jpg" 
        autoPlay 
        loop 
        muted 
        playsInline 
      />
      <Navbar />
      <main className="site-content">
        {children}
      </main>
    </div>
  );
}
