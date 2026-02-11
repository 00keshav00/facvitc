'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout flex h-screen bg-[#1a1a1a] text-[#e6e6e6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2d2e30] border-r border-[rgba(255,255,255,0.08)] flex flex-col">
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className={`block px-4 py-2 rounded-md ${pathname === '/admin' ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Dashboard
          </Link>
          <Link href="/admin/members" className={`block px-4 py-2 rounded-md ${pathname === '/admin/members' ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Manage Members
          </Link>
          <Link href="/admin/content" className={`block px-4 py-2 rounded-md ${pathname === '/admin/content' ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Page Content
          </Link>
          <Link href="/" target="_blank" className="block px-4 py-2 rounded-md text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white mt-10">
            View Site ↗
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
