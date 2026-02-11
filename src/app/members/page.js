'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeYear, setActiveYear] = useState('all');
  const [loading, setLoading] = useState(true);

  // Initial static data to match HTML until API is ready
  const initialMembers = [
    { name: "Aditya Sharma", year: "4th Year", specialization: "Watercolor" },
    { name: "Kavya Reddy", year: "3rd Year", specialization: "Digital Illustration" },
    { name: "Vikram Singh", year: "2nd Year", specialization: "Charcoal Sketching" },
    { name: "Ananya Das", year: "3rd Year", specialization: "3D Digital Art" },
    { name: "Karan Malhotra", year: "4th Year", specialization: "Abstract Art" },
    { name: "Simran Kaur", year: "2nd Year", specialization: "Fantasy Art" },
    { name: "Neha Gupta", year: "1st Year", specialization: "Portrait Drawing" },
    { name: "Rahul Verma", year: "3rd Year", specialization: "Acrylic Painting" },
    { name: "Prannav Raj VS", year: "2nd Year", specialization: "Charcoal Sketching" },
    { name: "Samyukktha KP", year: "2nd Year", specialization: "Acrylic Painting, Charcoal Sketching" },
    // ... adding more placeholders to fill the table
  ];

  useEffect(() => {
    // In a real scenario, fetch from API
    // fetch('/api/members').then(res => res.json()).then(data => setMembers(data));
    setMembers(initialMembers);
    setFilteredMembers(initialMembers);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = members;

    if (activeYear !== 'all') {
      result = result.filter(m => m.year.startsWith(activeYear));
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(lowerSearch) || 
        (m.specialization && m.specialization.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredMembers(result);
  }, [search, activeYear, members]);

  return (
    <div className="members-page px-14 py-12 h-full flex flex-col">
      <h2 className="text-[28px] font-bold mb-6 text-center text-[#e6e6e6]">All Club Members</h2>

      {/* Controls */}
      <div className="members-controls flex gap-4 justify-between items-center mb-5 flex-wrap">
        <input 
          type="text" 
          placeholder="Search by name or specialization..." 
          className="members-search flex-1 min-w-[240px] px-3.5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e6e6e6] text-sm outline-none placeholder-[#bfc1c3] focus:border-[rgba(255,255,255,0.2)] transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="members-filters flex gap-2 flex-wrap">
          {['all', '1', '2', '3', '4'].map((year) => (
            <button 
              key={year}
              className={`filter-btn px-3.5 py-2 rounded-[20px] border border-[rgba(255,255,255,0.08)] text-[13px] cursor-pointer transition-all duration-250 ${activeYear === year ? 'bg-[rgba(255,255,255,0.12)] text-[#e6e6e6]' : 'bg-[rgba(255,255,255,0.03)] text-[#bfc1c3] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e6e6e6]'}`}
              onClick={() => setActiveYear(year)}
            >
              {year === 'all' ? 'All' : `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="members-table-wrap border border-[rgba(255,255,255,0.08)] rounded-[10px] bg-[rgba(255,255,255,0.02)] overflow-x-auto">
        <table className="members-table w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[rgba(255,255,255,0.04)] text-left">
              <th className="p-3.5 px-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Name</th>
              <th className="p-3.5 px-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Year</th>
              <th className="p-3.5 px-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Art Specialization</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, idx) => (
              <tr key={idx} className="hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                <td className="p-3.5 px-4 text-[#bfc1c3] border-b border-[rgba(255,255,255,0.04)] text-sm">{member.name}</td>
                <td className="p-3.5 px-4 text-[#bfc1c3] border-b border-[rgba(255,255,255,0.04)] text-sm">{member.year}</td>
                <td className="p-3.5 px-4 text-[#bfc1c3] border-b border-[rgba(255,255,255,0.04)] text-sm">{member.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="p-8 text-center text-[#bfc1c3]">No members found matching your criteria.</div>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
