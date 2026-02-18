'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, artworks: 0, events: 0 });
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
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
