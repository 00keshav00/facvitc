'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, artworks: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [resetData, setResetData] = useState({ oldPassword: '', newPassword: '' });
  const [resetMsg, setResetMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [memRes, artRes, eveRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/gallery'),
          fetch('/api/events')
        ]);
        
        const [members, artworks, events] = await Promise.all([
          memRes.json(),
          artRes.json(),
          eveRes.json()
        ]);

        setStats({
          members: Array.isArray(members) ? members.length : 0,
          artworks: Array.isArray(artworks) ? artworks.length : 0,
          events: Array.isArray(events) ? events.length : 0
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg({ text: 'Processing...', type: 'info' });
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg({ text: 'Password reset successful!', type: 'success' });
        setResetData({ oldPassword: '', newPassword: '' });
      } else {
        setResetMsg({ text: data.error || 'Reset failed', type: 'error' });
      }
    } catch (err) {
      setResetMsg({ text: 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#1e1e1f] p-6 rounded-xl border border-[#3a3a3b]">
        <h2 className="text-xl font-bold mb-4">Reset Admin Password</h2>
        <form onSubmit={handleResetPassword} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs text-[#bfc1c3] mb-1">Old Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm"
              value={resetData.oldPassword}
              onChange={(e) => setResetData({...resetData, oldPassword: e.target.value})}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-[#bfc1c3] mb-1">New Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm"
              value={resetData.newPassword}
              onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold transition-colors text-sm">Reset</button>
        </form>
        {resetMsg.text && (
          <p className={`mt-2 text-sm ${resetMsg.type === 'error' ? 'text-red-400' : resetMsg.type === 'success' ? 'text-green-400' : 'text-blue-400'}`}>
            {resetMsg.text}
          </p>
        )}
      </div>

      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold mb-2">Total Members</h3>
          <p className="text-4xl font-bold text-[#e6e6e6]">{loading ? '...' : stats.members}</p>
        </div>
        <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold mb-2">Artworks</h3>
          <p className="text-4xl font-bold text-[#e6e6e6]">{loading ? '...' : stats.artworks}</p>
        </div>
        <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold mb-2">Events</h3>
          <p className="text-4xl font-bold text-[#e6e6e6]">{loading ? '...' : stats.events}</p>
        </div>
      </div>
    </div>
  );
}
