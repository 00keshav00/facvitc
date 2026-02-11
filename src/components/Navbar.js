'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="nav flex items-center justify-between px-5 py-2.5 bg-transparent border-b border-[rgba(255,255,255,0.08)] backdrop-blur-md z-50 shrink-0 relative">
      <div className="brand flex items-center gap-3">
        <div className="logo w-[38px] h-[38px] rounded-md bg-gradient-to-br from-[#ececec] to-[#bfbfbf] flex items-center justify-center text-[#222] font-bold text-lg">
          FAC
        </div>
        <div>
          <h1 className="text-base tracking-wide font-bold text-[#e6e6e6]">Fine Arts Club</h1>
        </div>
      </div>
      <nav className="nav-links flex gap-6 items-center font-semibold text-[#bfc1c3]">
        <Link href="/" className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white ${pathname === '/' ? 'text-white' : ''}`}>
          Home
        </Link>
        <Link href="/about" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white text-[#bfc1c3]">
          About
        </Link>
        <Link href="/gallery" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white text-[#bfc1c3]">
          Gallery
        </Link>
        <Link href="/workshops" className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white ${pathname === '/workshops' ? 'text-white' : ''}`}>
          Workshops
        </Link>
        <Link href="/techno" className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white ${pathname === '/techno' ? 'text-white' : ''}`}>
          Techno
        </Link>
        <Link href="/members" className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white ${pathname === '/members' ? 'text-white' : ''}`}>
          Members
        </Link>
        <Link href="/contact" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white text-[#bfc1c3]">
          Contact
        </Link>
      </nav>
    </header>
  );
}
