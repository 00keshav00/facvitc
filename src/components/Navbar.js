'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar({ settings }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="nav flex items-center justify-between px-5 py-2.5 bg-transparent border-b border-[rgba(255,255,255,0.08)] backdrop-blur-md z-50 shrink-0 relative">
      <div className="brand flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 no-underline" onClick={closeMenu}>
          {settings?.logo ? (
            <img src={settings.logo} alt="Logo" className="h-[38px] w-auto object-contain" />
          ) : (
            <div className="logo w-[38px] h-[38px] rounded-md bg-gradient-to-br from-[#ececec] to-[#bfbfbf] flex items-center justify-center text-[#222] font-bold text-lg">
              FAC
            </div>
          )}
          <div>
            <h1 className="text-base tracking-wide font-bold text-[#e6e6e6]">Fine Arts Club</h1>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center font-semibold text-[#bfc1c3]">
        <Link href="/#home" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white">
          Home
        </Link>
        <Link href="/#about" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white">
          About
        </Link>
        <Link href="/#gallery" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white">
          Gallery
        </Link>
        <Link href="/#events" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white">
          Events
        </Link>
        <Link href="/#members" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white">
          Members
        </Link>
        <Link href="/#contact" className="text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:text-black hover:bg-white">
          Contact
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-[#e6e6e6] text-2xl focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1a1a1b] border-b border-[rgba(255,255,255,0.08)] backdrop-blur-xl flex flex-col items-center py-4 space-y-4 md:hidden z-40 shadow-xl">
          <Link href="/#home" onClick={closeMenu} className="text-[#bfc1c3] text-base font-semibold py-2 w-full text-center hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            Home
          </Link>
          <Link href="/#about" onClick={closeMenu} className="text-[#bfc1c3] text-base font-semibold py-2 w-full text-center hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            About
          </Link>
          <Link href="/#gallery" onClick={closeMenu} className="text-[#bfc1c3] text-base font-semibold py-2 w-full text-center hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            Gallery
          </Link>
          <Link href="/#events" onClick={closeMenu} className="text-[#bfc1c3] text-base font-semibold py-2 w-full text-center hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            Events
          </Link>
          <Link href="/#members" onClick={closeMenu} className="text-[#bfc1c3] text-base font-semibold py-2 w-full text-center hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            Members
          </Link>
          <Link href="/#contact" onClick={closeMenu} className="text-[#bfc1c3] text-base font-semibold py-2 w-full text-center hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
