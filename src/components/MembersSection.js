'use client';

import React from 'react';
import Link from 'next/link';

const MemberCard = ({ img, name, role, quote, link, revealDelay }) => {
  return (
    <div className={`test-card w-[320px] max-w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[10px] overflow-hidden transition-all duration-300 shadow-xl flex flex-col hover:-translate-y-1.5 hover:shadow-2xl reveal visible`} style={{transitionDelay: revealDelay}}>
      <div className="member-image w-full h-[200px] overflow-hidden">
        <img src={img || '/placeholder_member.jpg'} alt={role} className="w-full h-full object-cover" />
      </div>
      <div className="person flex flex-col gap-0.5 px-[18px] py-3.5 pb-1.5">
        <strong className="text-base text-[#e6e6e6]">
          {name}
          {link && <a href={link} className="member-link ml-2 no-underline" target="_blank">🔗</a>}
        </strong>
        <span className="role text-[13px] font-semibold text-[#bfc1c3]">{role}</span>
      </div>
      <div className="quote px-[18px] pb-[18px] text-[#bfc1c3] text-[14px] leading-relaxed">
        {quote}
      </div>
    </div>
  );
};

export default function MembersSection({ members = [] }) {
  // If no members passed, default to static list or empty
  const displayMembers = members.length > 0 ? members : [
    { name: "Dr. Anjali Sharma", role: "Faculty Coordinator", quote: "Guiding the club with vision and academic excellence.", image: "/images/faculty.jpg" },
    { name: "Prasenjit Choudhury", role: "President", quote: "Passionate about traditional and contemporary art forms.", image: "/president.jpg" }
  ];

  return (
    <section className="testimonials py-16 px-14 border-t border-[rgba(255,255,255,0.08)] flex flex-col items-center gap-12 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.03)]" id="members">
      
      <div className="members-row flex justify-center gap-6 flex-wrap w-full">
         {displayMembers.slice(0, 4).map((m, i) => (
           <MemberCard 
             key={i}
             img={m.image} 
             name={m.name} 
             role={m.role} 
             quote={m.quote} 
             link={m.socialLink}
           />
         ))}
      </div>

      <div className="members-cta flex justify-center my-8">
        <Link href="/members" className="members-btn px-6 py-2.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[#e6e6e6] font-semibold transition-all duration-300 shadow-xl hover:bg-[rgba(255,255,255,0.08)] hover:-translate-y-0.5">
          View All FAC Members
        </Link>
      </div>

    </section>
  );
}
