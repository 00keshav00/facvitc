import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold mb-2">Total Members</h3>
          <p className="text-4xl font-bold text-[#e6e6e6]">48</p>
        </div>
        <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold mb-2">Artworks</h3>
          <p className="text-4xl font-bold text-[#e6e6e6]">120</p>
        </div>
        <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold mb-2">Events</h3>
          <p className="text-4xl font-bold text-[#e6e6e6]">5</p>
        </div>
      </div>
    </div>
  );
}
