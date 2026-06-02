'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { FaInstagram, FaLinkedin, FaLink } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const MemberCard = ({ img, name, role, quote, instagram, linkedin, other }) => {
  return (
    <div className="test-card w-[calc(100%)] sm:w-[300px] md:w-[320px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[10px] overflow-hidden transition-all duration-300 shadow-xl flex flex-col hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="member-image w-full h-48 sm:h-[240px] overflow-hidden">
        <img src={img || '/placeholder_member.jpg'} alt={name} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="person flex flex-col gap-0.5 px-[18px] py-3.5 pb-1.5">
        <div className="flex justify-between items-center w-full">
          <strong className="text-base text-[#e6e6e6] truncate pr-2">
            {name}
          </strong>
          <div className="flex gap-2 shrink-0">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-white transition-colors">
                <FaInstagram size={16} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-white transition-colors">
                <FaLinkedin size={16} />
              </a>
            )}
            {other && (
              <a href={other} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-white transition-colors">
                <FaLink size={16} />
              </a>
            )}
          </div>
        </div>
        <span className="role text-[12px] font-bold text-[#bfc1c3] truncate uppercase tracking-widest opacity-80">{role}</span>
      </div>
      {quote && (
        <div className="quote px-[18px] pb-[18px] text-[#bfc1c3] text-[14px] leading-relaxed line-clamp-3 italic opacity-70">
          "{quote}"
        </div>
      )}
    </div>
  );
};

export default function ClubLeadsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [yearsRes, membersRes] = await Promise.all([
          fetch('/api/years'),
          fetch('/api/members?type=Lead')
        ]);
        
        const years = await yearsRes.json();
        const members = await membersRes.json();

        // Group members by year
        const grouped = years.map(y => ({
          year: y.year,
          leads: members.filter(m => m.year === y.year)
        })).filter(g => g.leads.length > 0);

        setData(grouped);
        if (grouped.length > 0) {
          setActiveYear(grouped[0].year);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeGroup = data.find(g => g.year === activeYear);

  return (
    <div className="leads-page min-h-screen bg-black/60 backdrop-blur-sm text-[#e6e6e6] flex flex-col relative no-scrollbar">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="py-16 px-6 md:px-14 z-10">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">FAC Club Leads</h1>
          <p className="text-[#bfc1c3] max-w-2xl mx-auto italic text-lg opacity-80">
            Honoring the dedicated individuals who have led the Fine Arts Club through the years.
          </p>
        </div>

        {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/40"></div>
            </div>
        ) : data.length === 0 ? (
            <div className="text-center py-20 text-[#bfc1c3]">No lead records found.</div>
        ) : (
          <div className="space-y-16">
            {/* Events-style Timeline Bar (Neutral Theme, Non-sticky) */}
            <div className="flex justify-center z-50">
              <nav className="flex flex-wrap justify-center gap-4 p-4 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
                {data.map((group) => (
                  <button
                    key={group.year}
                    onClick={() => setActiveYear(group.year)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent
                      ${String(activeYear) === String(group.year) 
                        ? 'bg-[#3a3a3b] text-white shadow-lg border-white/10 scale-105' 
                        : 'text-[#bfc1c3] hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {group.year}
                  </button>
                ))}
              </nav>
            </div>

            {/* Cards Section */}
            <div className="year-section pb-20">
              {activeGroup && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center">
                  {activeGroup.leads.map((lead) => (
                    <MemberCard 
                      key={lead._id}
                      img={lead.image}
                      name={lead.name}
                      role={lead.role}
                      quote={lead.bio}
                      instagram={lead.socialLinks?.instagram}
                      linkedin={lead.socialLinks?.linkedin}
                      other={lead.socialLinks?.otherLink}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto z-10">
        <Footer />
      </div>
    </div>
  );
}
