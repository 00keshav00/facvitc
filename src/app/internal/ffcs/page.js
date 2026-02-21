'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function FFCSPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchFFCS() {
      try {
        const res = await fetch('/api/ffcs');
        if (res.ok) {
          const data = await res.json();
          setRecords(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFFCS();
  }, []);

  const filtered = records.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.regno.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <div className="flex-grow px-6 md:px-14 pb-12">
        <h1 className="text-3xl md:text-44px font-bold mb-4 text-[#e6e6e6] text-center">FFCS Portal</h1>
        <p className="text-[#bfc1c3] mb-12 text-center max-w-2xl mx-auto">Check your FFCS points and ranking.</p>

        <div className="max-w-4xl mx-auto mb-8">
          <input 
            type="text" 
            placeholder="Search by name or reg no..." 
            className="w-full px-5 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e6e6e6] outline-none placeholder-[#bfc1c3] focus:border-blue-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-[#bfc1c3] py-20 animate-pulse text-lg">Loading FFCS records...</div>
        ) : (
          <div className="max-w-4xl mx-auto border border-[rgba(255,255,255,0.08)] rounded-[10px] bg-[rgba(255,255,255,0.02)] overflow-x-auto shadow-lg backdrop-blur-sm">
            <table className="w-full border-collapse min-w-[500px] text-left">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.04)]">
                  <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Rank</th>
                  <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Name</th>
                  <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Reg No.</th>
                  <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)] text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, idx) => (
                  <tr key={record._id} className="hover:bg-[rgba(255,255,255,0.04)] transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <td className="p-4 text-[#bfc1c3] font-semibold">#{idx + 1}</td>
                    <td className="p-4 text-[#e6e6e6] font-semibold">{record.name}</td>
                    <td className="p-4 text-[#bfc1c3] uppercase">{record.regno}</td>
                    <td className="p-4 text-blue-400 font-bold text-right">{record.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-[#bfc1c3]">No records found.</div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
