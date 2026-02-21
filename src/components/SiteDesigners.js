import React from 'react';

export default function SiteDesigners({ designers }) {
  if (!designers || designers.length === 0 || !designers[0]?.name) return null;

  return (
    <div className="w-full bg-[rgba(0,0,0,0.4)] backdrop-blur-md border-t border-[rgba(255,255,255,0.08)] py-8 px-6 md:px-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <h3 className="text-[#bfc1c3] font-bold text-lg whitespace-nowrap">Site Designing Team:</h3>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full">
          {designers.slice(0, 4).map((designer, idx) => {
            if (!designer.name) return null;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[#e6e6e6] font-semibold">{designer.name}</span>
                  {designer.role && <span className="text-[#666] text-xs">{designer.role}</span>}
                </div>
                <div className="flex gap-2 text-[#bfc1c3]">
                  {designer.linkedin && (
                    <a href={designer.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <i className="fab fa-linkedin text-lg"></i>
                    </a>
                  )}
                  {designer.otherLink && (
                    <a href={designer.otherLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <i className="fas fa-link text-lg"></i>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
