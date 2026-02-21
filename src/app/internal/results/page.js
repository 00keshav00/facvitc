'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/results');
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <div className="flex-grow px-6 md:px-14 pb-12">
        <h1 className="text-3xl md:text-44px font-bold mb-4 text-[#e6e6e6] text-center">Interview Results</h1>
        <p className="text-[#bfc1c3] mb-12 text-center max-w-2xl mx-auto">Congratulations to all the selected candidates! Here is the list of people selected for each department.</p>

        {loading ? (
          <div className="text-center text-[#bfc1c3] py-20 animate-pulse text-lg">Loading results...</div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {results.map((dept) => (
              <div key={dept._id} className="border border-[rgba(255,255,255,0.08)] rounded-2xl bg-[rgba(255,255,255,0.02)] overflow-hidden shadow-xl">
                <div className="bg-[rgba(255,255,255,0.04)] p-6 flex items-center justify-center gap-4 border-b border-[rgba(255,255,255,0.08)]">
                  {dept.logo && (
                    <img src={dept.logo} alt={`${dept.department} Logo`} className="w-16 h-16 rounded-full object-cover border-2 border-[rgba(255,255,255,0.1)]" />
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-[#e6e6e6] tracking-wide">{dept.department}</h2>
                </div>
                
                <div className="p-0">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[rgba(0,0,0,0.2)]">
                        <th className="p-4 pl-8 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.04)]">Name</th>
                        <th className="p-4 pr-8 font-bold text-[#e6e6e6] border-b border-[rgba(255,255,255,0.04)] text-right">Reg No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dept.selectedMembers && dept.selectedMembers.map((member, idx) => (
                        <tr key={idx} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0">
                          <td className="p-4 pl-8 text-[#e6e6e6] font-semibold">{member.name}</td>
                          <td className="p-4 pr-8 text-[#bfc1c3] uppercase text-right tracking-widest">{member.regno}</td>
                        </tr>
                      ))}
                      {(!dept.selectedMembers || dept.selectedMembers.length === 0) && (
                        <tr>
                          <td colSpan="2" className="p-8 text-center text-[#bfc1c3]">No candidates selected yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div className="text-center py-20 bg-[rgba(255,255,255,0.02)] rounded-3xl border border-dashed border-[rgba(255,255,255,0.1)]">
                <p className="text-[#bfc1c3]">No interview results are currently published.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
