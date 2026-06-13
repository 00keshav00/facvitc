'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || 'loading';

  // Strict Security: Logout on browser close or refresh (simulated via sessionStorage)
  React.useEffect(() => {
    // Check if we are on the client and status is loaded
    if (typeof window !== 'undefined' && status !== 'loading') {
      const isSessionFlagActive = sessionStorage.getItem('admin_session_active');
      
      if (status === 'authenticated') {
        if (!isSessionFlagActive && pathname !== '/admin/login') {
          // If authenticated but no sessionStorage flag, it's a new tab/fresh window
          // Force logout to satisfy "login every time" requirement
          signOut({ redirect: true, callbackUrl: '/admin/login' });
        }
      } else if (status === 'unauthenticated' && pathname !== '/admin/login') {
        // If logged out and trying to access admin, redirect to login
        router.push('/admin/login');
      }
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a1a1a] text-[#e6e6e6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/20"></div>
      </div>
    );
  }

  // If not logged in and not on login page, don't show anything while redirecting
  if (status === 'unauthenticated' && pathname !== '/admin/login') {
    return null;
  }

  // On login page, just show children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout flex h-screen bg-[#1a1a1a] text-[#e6e6e6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2d2e30] border-r border-[rgba(255,255,255,0.08)] flex flex-col">
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className={`block px-4 py-2 rounded-md ${pathname === '/admin' ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Dashboard
          </Link>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sections
          </div>
          <Link href="/admin/home" className={`block px-4 py-2 rounded-md ${pathname.startsWith('/admin/home') ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Home
          </Link>
          <Link href="/admin/gallery" className={`block px-4 py-2 rounded-md ${pathname.startsWith('/admin/gallery') ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Gallery
          </Link>
          <Link href="/admin/events" className={`block px-4 py-2 rounded-md ${pathname.startsWith('/admin/events') ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Events
          </Link>
          <Link href="/admin/leads" className={`block px-4 py-2 rounded-md ${pathname.startsWith('/admin/leads') ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Club Leads
          </Link>
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Internal
          </div>
          <Link href="/admin/ffcs" className={`block px-4 py-2 rounded-md ${pathname.startsWith('/admin/ffcs') ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            FFCS Portal
          </Link>
          <Link href="/admin/results" className={`block px-4 py-2 rounded-md ${pathname.startsWith('/admin/results') ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Interview Results
          </Link>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            System
          </div>
          <Link href="/admin/settings" className={`block px-4 py-2 rounded-md ${pathname === '/admin/settings' ? 'bg-[#3a3a3b] text-white' : 'text-[#bfc1c3] hover:bg-[#3a3a3b] hover:text-white'}`}>
            Settings
          </Link>

          <button 
            onClick={() => {
              sessionStorage.removeItem('admin_session_active');
              signOut({ callbackUrl: '/admin/login' });
            }}
            className="w-full text-left px-4 py-2 rounded-md text-red-400 hover:bg-red-400/10 transition-colors mt-4"
          >
            Logout
          </button>

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
