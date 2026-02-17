'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeYear, setActiveYear] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch('/api/members');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
          setFilteredMembers(data);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  useEffect(() => {
    let result = members;

    if (activeYear !== 'all') {
      // Assuming year format "1st Year", "2nd Year" etc.
      result = result.filter(m => m.year.startsWith(activeYear));
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(lowerSearch) || 
        (m.specialization && m.specialization.toLowerCase().includes(lowerSearch)) ||
        (m.role && m.role.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredMembers(result);
  }, [search, activeYear, members]);

  return (
    <div className="members-page px-6 md:px-14 py-12 min-h-screen flex flex-col">
      <h2 className="text-[28px] font-bold mb-6 text-center text-[#e6e6e6]">All Club Members</h2>

      {/* Controls */}
      <div className="members-controls flex gap-4 justify-between items-center mb-8 flex-wrap">
        <input 
          type="text" 
          placeholder="Search by name, role or specialization..." 
          className="members-search flex-1 min-w-[240px] px-3.5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e6e6e6] text-sm outline-none placeholder-[#bfc1c3] focus:border-[rgba(255,255,255,0.2)] transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="members-filters flex gap-2 flex-wrap">
          {['all', '1', '2', '3', '4'].map((year) => (
            <button 
              key={year}
              className={`filter-btn px-3.5 py-2 rounded-full border border-[rgba(255,255,255,0.08)] text-[13px] cursor-pointer transition-all duration-250 ${activeYear === year ? 'bg-[#e6e6e6] text-black font-semibold' : 'bg-[rgba(255,255,255,0.03)] text-[#bfc1c3] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e6e6e6]'}`}
              onClick={() => setActiveYear(year)}
            >
              {year === 'all' ? 'All' : `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-[#bfc1c3] py-10">Loading members...</div>
      ) : (
        /* Table */
        <div className="members-table-wrap border border-[rgba(255,255,255,0.08)] rounded-[10px] bg-[rgba(255,255,255,0.02)] overflow-x-auto shadow-lg backdrop-blur-sm">
          <table className="members-table w-full border-collapse min-w-[700px] text-left">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.04)]">
                <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Name</th>
                <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Role</th>
                <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Year</th>
                <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, idx) => (
                <tr key={member._id || idx} className="hover:bg-[rgba(255,255,255,0.04)] transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <td className="p-4 text-[#e6e6e6]">{member.name}</td>
                  <td className="p-4 text-[#bfc1c3]">{member.role}</td>
                  <td className="p-4 text-[#bfc1c3]">{member.year}</td>
                  <td className="p-4 text-[#bfc1c3]">{member.specialization || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-[#bfc1c3]">No members found matching your criteria.</div>
          )}
        </div>
      )}

      <div className="mt-auto pt-12">
        <Footer />
      </div>
    </div>
  );
}
