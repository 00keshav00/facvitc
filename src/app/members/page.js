'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch('/api/members');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    (m.department && m.department.toLowerCase().includes(search.toLowerCase())) ||
    (m.role && m.role.toLowerCase().includes(search.toLowerCase()))
  );

  const leads = filteredMembers.filter(m => m.type === 'Lead');
  const general = filteredMembers.filter(m => m.type === 'General');

  const MemberTable = ({ title, list }) => (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-blue-400 border-b border-blue-400/20 pb-2">{title}</h3>
      <div className="members-table-wrap border border-[rgba(255,255,255,0.08)] rounded-[10px] bg-[rgba(255,255,255,0.02)] overflow-x-auto shadow-lg backdrop-blur-sm">
        <table className="members-table w-full border-collapse min-w-[700px] text-left">
          <thead>
            <tr className="bg-[rgba(255,255,255,0.04)]">
              <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Name</th>
              <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Role</th>
              <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Dept / Year</th>
              <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Bio</th>
              <th className="p-4 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.08)]">Contact</th>
            </tr>
          </thead>
          <tbody>
            {list.map((member, idx) => (
              <tr key={member._id || idx} className="hover:bg-[rgba(255,255,255,0.04)] transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0">
                <td className="p-4 text-[#e6e6e6] font-semibold">{member.name}</td>
                <td className="p-4 text-[#bfc1c3]">{member.role}</td>
                <td className="p-4 text-[#bfc1c3]">{member.department || '-'} / {member.year || '-'}</td>
                <td className="p-4 text-[#bfc1c3] text-sm max-w-[300px] leading-relaxed">{member.bio || '-'}</td>
                <td className="p-4 text-[#bfc1c3]">
                   <div className="flex gap-3">
                      {member.socialLinks?.instagram && <a href={member.socialLinks.instagram} target="_blank" className="hover:text-white">IG</a>}
                      {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" className="hover:text-white">LI</a>}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="p-8 text-center text-[#bfc1c3]">No members found in this category.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="members-page px-6 md:px-14 py-12 min-h-screen flex flex-col">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#e6e6e6]">FAC Club Directory</h2>

      {/* Controls */}
      <div className="mb-10 max-w-xl mx-auto w-full">
        <input 
          type="text" 
          placeholder="Search by name, role or department..." 
          className="w-full px-5 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e6e6e6] outline-none placeholder-[#bfc1c3] focus:border-blue-500/50 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-[#bfc1c3] py-20 animate-pulse text-lg">Loading club directory...</div>
      ) : (
        <>
          <MemberTable title="Lead Members" list={leads} />
          <MemberTable title="General Members" list={general} />
        </>
      )}

      <div className="mt-auto pt-12">
        <Footer />
      </div>
    </div>
  );
}
